/**
 * Pino Logger Configuration for Concat
 * 個人情報保護を考慮した構造化ログシステム
 */

import pino from 'pino';
// Dynamic import for crypto to avoid Edge Runtime issues
let crypto: typeof import('crypto') | null = null;

// Initialize crypto only when needed
async function getCrypto() {
  if (!crypto && typeof window === 'undefined') {
    try {
      crypto = await import('crypto');
    } catch (error) {
      console.warn('Crypto module not available:', error);
    }
  }
  return crypto;
}

// ログレベル定義
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// ログカテゴリ定義
export type LogCategory = 'access' | 'contact' | 'error' | 'performance';

// ログエントリ型定義
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  metadata?: Record<string, any>;
  sessionId?: string;
  anonymizedIP?: string;
  userAgent?: string;
}

// 環境設定
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// Pino設定
const pinoConfig = {
  level: isDevelopment ? 'debug' : 'info',
  ...(isDevelopment && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'yyyy-mm-dd HH:MM:ss',
        ignore: 'pid,hostname'
      }
    }
  }),
  ...(isProduction && {
    formatters: {
      level: (label: string) => ({ level: label })
    },
    redact: {
      paths: ['req.headers.authorization', 'password', 'email'],
      remove: true
    }
  })
};

// Pinoインスタンス作成
const pinoLogger = pino(pinoConfig);

/**
 * IPアドレス匿名化
 */
async function anonymizeIP(ip: string): Promise<string> {
  const cryptoModule = await getCrypto();
  if (!cryptoModule) {
    // Fallback: 簡単なハッシュ化
    return btoa(ip).substring(0, 16);
  }
  
  const salt = process.env.IP_HASH_SALT || 'concat_default_salt_2025';
  return cryptoModule.createHash('sha256').update(ip + salt).digest('hex').substring(0, 16);
}

/**
 * セッションID生成
 */
async function generateSessionId(): Promise<string> {
  const cryptoModule = await getCrypto();
  if (!cryptoModule) {
    // Fallback: Math.randomベース
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  
  return cryptoModule.randomBytes(16).toString('hex');
}

/**
 * クライアントIPアドレス取得（Next.js環境対応）
 */
function getClientIP(request?: Request): string | undefined {
  if (typeof window !== 'undefined') {
    // クライアントサイドでは取得不可
    return undefined;
  }

  if (!request) return undefined;

  // Vercel環境でのIP取得
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }

  return undefined;
}

/**
 * メインLoggerクラス
 */
class Logger {
  private static sessionId: string | null = null;

  /**
   * セッションIDの初期化
   */
  private static async ensureSessionId(): Promise<string> {
    if (!this.sessionId) {
      this.sessionId = await generateSessionId();
    }
    return this.sessionId;
  }

  /**
   * 基本ログ出力
   */
  private static async log(
    level: LogLevel,
    category: LogCategory,
    message: string,
    metadata?: Record<string, any>,
    request?: Request
  ): Promise<void> {
    const clientIP = getClientIP(request);
    const sessionId = await this.ensureSessionId();
    
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      ...(metadata && { metadata }),
      sessionId,
      ...(request && { userAgent: request.headers.get('user-agent') || undefined })
    };

    // IPアドレス匿名化（非同期）
    if (clientIP) {
      try {
        logEntry.anonymizedIP = await anonymizeIP(clientIP);
      } catch (error) {
        // 匿名化に失敗した場合はIPを記録しない
        console.warn('IP anonymization failed:', error);
      }
    }

    // Pinoでログ出力
    pinoLogger[level](logEntry);
  }

  /**
   * 情報ログ
   */
  static info(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.INFO, category, message, metadata, request).catch(console.error);
  }

  /**
   * 警告ログ
   */
  static warn(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.WARN, category, message, metadata, request).catch(console.error);
  }

  /**
   * エラーログ
   */
  static error(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    this.log(LogLevel.ERROR, category, message, metadata, request).catch(console.error);
  }

  /**
   * デバッグログ（開発環境のみ）
   */
  static debug(category: LogCategory, message: string, metadata?: Record<string, any>, request?: Request): void {
    if (isDevelopment) {
      this.log(LogLevel.DEBUG, category, message, metadata, request).catch(console.error);
    }
  }

  /**
   * アクセスログ（専用メソッド）
   */
  static access(path: string, method: string, statusCode: number, responseTime: number, request?: Request): void {
    this.info('access', `${method} ${path}`, {
      method,
      path,
      statusCode,
      responseTime,
      timestamp: new Date().toISOString()
    }, request);
  }

  /**
   * お問い合わせログ（専用メソッド）
   */
  static contact(action: string, success: boolean, metadata?: Record<string, any>, request?: Request): void {
    const level = success ? LogLevel.INFO : LogLevel.WARN;
    this.log(level, 'contact', `Contact form: ${action}`, {
      action,
      success,
      timestamp: new Date().toISOString(),
      ...metadata
    }, request);
  }

  /**
   * パフォーマンスログ（専用メソッド）
   */
  static performance(metric: string, value: number, unit: string = 'ms', metadata?: Record<string, any>): void {
    this.info('performance', `Performance metric: ${metric}`, {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }

  /**
   * 新しいセッションID生成
   */
  static newSession(): void {
    this.sessionId = null; // リセットして次回ログ時に新しいIDを生成
    this.debug('access', 'New session started', {});
  }
}

export default Logger;

/**
 * クライアントサイド用Logger（簡略版）
 */
export class ClientLogger {
  private static sessionId: string = Math.random().toString(36).substring(2, 15);

  /**
   * クライアントサイドでの基本ログ
   */
  private static log(level: LogLevel, category: LogCategory, message: string, metadata?: Record<string, any>): void {
    if (typeof window === 'undefined') {
      // サーバーサイドでは通常のLoggerを使用
      Logger[level](category, message, metadata);
      return;
    }

    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      sessionId: this.sessionId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      ...metadata
    };

    // 開発環境ではコンソール出力
    if (isDevelopment) {
      console[level === 'debug' ? 'log' : level](`[${category}] ${message}`, logEntry);
    }

    // 本番環境では必要に応じてAPIエンドポイントに送信
    if (isProduction && level !== 'debug') {
      // 将来的にAPI経由でサーバーに送信
      // fetch('/api/log', { method: 'POST', body: JSON.stringify(logEntry) });
    }
  }

  static info(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.INFO, category, message, metadata);
  }

  static warn(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.WARN, category, message, metadata);
  }

  static error(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.ERROR, category, message, metadata);
  }

  static debug(category: LogCategory, message: string, metadata?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, category, message, metadata);
  }

  static newSession(): void {
    this.sessionId = Math.random().toString(36).substring(2, 15);
    this.debug('access', 'New client session started', { sessionId: this.sessionId });
  }
}