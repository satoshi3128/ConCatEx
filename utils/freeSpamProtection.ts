/**
 * Free Spam Protection System
 * 無料のスパム対策システム（OOPSpam代替）
 */

import Logger from './loggerSimple';
import { ContactFormData } from './notion';

export interface FreeSpamCheckResult {
  isSpam: boolean;
  score: number;
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
  allow: boolean;
}

// レート制限用のメモリストレージ（シンプル実装）
const rateLimitStore = new Map<string, { count: number; lastReset: number; submissions: number[] }>();

/**
 * クライアントIPアドレス取得
 */
function getClientIP(request?: Request): string {
  if (!request) return '127.0.0.1';

  // Vercel環境でのIP取得
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIP) return realIP;
  
  return '127.0.0.1';
}

/**
 * ハニーポット検証
 */
function checkHoneypot(honeypotValue?: string): { isSpam: boolean; reason?: string } {
  // ハニーポットフィールドに値が入力されていればボット
  if (honeypotValue && honeypotValue.trim().length > 0) {
    return { isSpam: true, reason: 'Honeypot field filled' };
  }
  
  return { isSpam: false };
}

/**
 * レート制限チェック
 */
function checkRateLimit(clientIP: string, request?: Request): { 
  allowed: boolean; 
  reason?: string; 
  remainingTime?: number 
} {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  const fiveMinInMs = 5 * 60 * 1000;
  
  const key = clientIP;
  const current = rateLimitStore.get(key) || { 
    count: 0, 
    lastReset: now, 
    submissions: [] 
  };

  // 1時間ごとにカウンターリセット
  if (now - current.lastReset > hourInMs) {
    current.count = 0;
    current.lastReset = now;
    current.submissions = [];
  }

  // 過去5分以内の送信をフィルタ
  current.submissions = current.submissions.filter(time => now - time < fiveMinInMs);

  // レート制限チェック
  // 1時間に5回まで
  if (current.count >= 5) {
    const remainingTime = Math.ceil((hourInMs - (now - current.lastReset)) / 1000 / 60);
    Logger.warn('contact', 'Rate limit exceeded (hourly)', {
      clientIP: clientIP.substring(0, 8) + '...',
      count: current.count,
      remainingMinutes: remainingTime
    }, request);
    
    return { 
      allowed: false, 
      reason: `1時間の送信上限（5回）に達しました。${remainingTime}分後に再試行してください。`,
      remainingTime
    };
  }

  // 5分以内に送信があるかチェック
  if (current.submissions.length > 0) {
    const lastSubmission = Math.max(...current.submissions);
    const timeSinceLastSubmission = now - lastSubmission;
    
    if (timeSinceLastSubmission < fiveMinInMs) {
      const remainingTime = Math.ceil((fiveMinInMs - timeSinceLastSubmission) / 1000 / 60);
      Logger.warn('contact', 'Rate limit exceeded (5min)', {
        clientIP: clientIP.substring(0, 8) + '...',
        timeSinceLastSubmission: Math.round(timeSinceLastSubmission / 1000),
        remainingMinutes: remainingTime
      }, request);
      
      return { 
        allowed: false, 
        reason: `前回の送信から5分経過していません。${remainingTime}分後に再試行してください。`,
        remainingTime
      };
    }
  }

  // レート制限更新
  current.count++;
  current.submissions.push(now);
  rateLimitStore.set(key, current);

  return { allowed: true };
}

/**
 * コンテンツパターン分析
 */
function analyzeContentPatterns(data: ContactFormData): {
  score: number;
  reasons: string[];
  details: Record<string, any>;
} {
  const reasons: string[] = [];
  let score = 0;
  const details: Record<string, any> = {};

  // 1. URL数チェック
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const urls = data.message.match(urlPattern) || [];
  details.urlCount = urls.length;
  
  if (urls.length > 2) {
    reasons.push(`Too many URLs (${urls.length})`);
    score += urls.length;
  }

  // 2. メッセージ長チェック
  const messageLength = data.message.trim().length;
  details.messageLength = messageLength;
  
  if (messageLength < 10) {
    reasons.push('Message too short');
    score += 3;
  } else if (messageLength > 2000) {
    reasons.push('Message too long');
    score += 2;
  }

  // 3. 同じ文字の大量繰り返し
  const repeatedPattern = /(.)\1{15,}/;
  if (repeatedPattern.test(data.message)) {
    reasons.push('Excessive character repetition');
    score += 3;
  }

  // 4. 全て大文字チェック
  const upperCaseRatio = (data.message.match(/[A-Z]/g) || []).length / data.message.length;
  details.upperCaseRatio = upperCaseRatio;
  
  if (upperCaseRatio > 0.7 && data.message.length > 20) {
    reasons.push('Excessive uppercase text');
    score += 2;
  }

  // 5. スパムキーワード（日本語対応）
  const spamKeywords = [
    // 英語
    'click here', 'make money', 'free money', 'viagra', 'casino', 'lottery', 
    'winner', 'congratulations', 'urgent', 'limited time',
    // 日本語
    'お金を稼ぐ', '簡単に稼げる', '無料で', '今すぐ', '限定', '緊急', '当選'
  ];
  
  const lowerMessage = data.message.toLowerCase();
  const foundKeywords = spamKeywords.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  details.spamKeywords = foundKeywords;
  if (foundKeywords.length > 0) {
    reasons.push(`Spam keywords: ${foundKeywords.join(', ')}`);
    score += foundKeywords.length * 2;
  }

  // 6. 名前の妥当性チェック
  const nameLength = data.name.trim().length;
  details.nameLength = nameLength;
  
  if (nameLength < 2) {
    reasons.push('Name too short');
    score += 2;
  } else if (nameLength > 50) {
    reasons.push('Name too long');
    score += 1;
  }

  // 数字のみの名前
  if (/^\d+$/.test(data.name.trim())) {
    reasons.push('Name is only numbers');
    score += 2;
  }

  // 7. メールアドレス検証
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailPattern.test(data.email);
  details.isValidEmail = isValidEmail;
  
  if (!isValidEmail) {
    reasons.push('Invalid email format');
    score += 3;
  }

  // 使い捨てメールドメインチェック（基本的なもの）
  const disposableEmailDomains = [
    '10minutemail.com', 'tempmail.org', 'guerrillamail.com', 
    'mailinator.com', 'trashmail.com'
  ];
  
  const emailDomain = data.email.split('@')[1]?.toLowerCase();
  if (emailDomain && disposableEmailDomains.includes(emailDomain)) {
    reasons.push('Disposable email domain');
    score += 2;
  }

  return { score, reasons, details };
}

/**
 * 信頼度計算
 */
function calculateConfidence(score: number, reasons: string[]): 'low' | 'medium' | 'high' {
  if (score >= 8 || reasons.some(r => r.includes('Honeypot'))) {
    return 'high';
  } else if (score >= 4) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * メイン無料スパム検証関数
 */
export async function performFreeSpamCheck(
  data: ContactFormData,
  honeypotValue?: string,
  request?: Request
): Promise<FreeSpamCheckResult> {
  try {
    const clientIP = getClientIP(request);
    
    Logger.info('contact', 'Starting free spam check', {
      clientIP: clientIP.substring(0, 8) + '...',
      hasHoneypot: !!honeypotValue,
      messageLength: data.message.length
    }, request);

    let totalScore = 0;
    const allReasons: string[] = [];

    // 1. ハニーポット検証
    const honeypotCheck = checkHoneypot(honeypotValue);
    if (honeypotCheck.isSpam) {
      Logger.warn('contact', 'Honeypot triggered', {
        honeypotValue: honeypotValue?.substring(0, 20) + '...'
      }, request);
      
      return {
        isSpam: true,
        score: 10,
        reasons: [honeypotCheck.reason!],
        confidence: 'high',
        allow: false
      };
    }

    // 2. レート制限チェック
    const rateCheck = checkRateLimit(clientIP, request);
    if (!rateCheck.allowed) {
      return {
        isSpam: false, // レート制限はスパムではない
        score: 0,
        reasons: [rateCheck.reason!],
        confidence: 'medium',
        allow: false
      };
    }

    // 3. コンテンツパターン分析
    const contentAnalysis = analyzeContentPatterns(data);
    totalScore += contentAnalysis.score;
    allReasons.push(...contentAnalysis.reasons);

    // 4. 最終判定
    const confidence = calculateConfidence(totalScore, allReasons);
    const isSpam = totalScore >= 5; // スコア5以上でスパム判定
    const allow = !isSpam;

    const result: FreeSpamCheckResult = {
      isSpam,
      score: totalScore,
      reasons: allReasons,
      confidence,
      allow
    };

    Logger.info('contact', 'Free spam check completed', {
      isSpam,
      score: totalScore,
      confidence,
      reasonCount: allReasons.length,
      allow
    }, request);

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    Logger.error('contact', 'Free spam check failed', {
      error: errorMessage,
      fallback: 'Allowing request due to error'
    }, request);

    // エラーの場合は許可（システム障害でユーザーを拒否しない）
    return {
      isSpam: false,
      score: 0,
      reasons: ['Spam check error - allowing request'],
      confidence: 'low',
      allow: true
    };
  }
}

/**
 * レート制限ストレージのクリーンアップ（定期実行推奨）
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const hourInMs = 60 * 60 * 1000;
  
  for (const [key, data] of rateLimitStore.entries()) {
    if (now - data.lastReset > hourInMs * 2) { // 2時間以上古いデータを削除
      rateLimitStore.delete(key);
    }
  }
  
  Logger.debug('contact', 'Rate limit store cleanup completed', {
    remainingEntries: rateLimitStore.size
  });
}