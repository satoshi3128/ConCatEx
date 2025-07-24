import { NextRequest, NextResponse } from 'next/server';
import Logger from '@/utils/loggerSimple';
import { performFreeSpamCheck } from '@/utils/freeSpamProtection';
import { saveToNotion, type ContactFormData } from '@/utils/notion';

interface ContactFormRequest extends ContactFormData {
  honeypot?: string; // ハニーポットフィールド
}

interface ContactFormResponse {
  success?: boolean;
  message?: string;
  error?: string;
  notionId?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  const startTime = Date.now();
  
  try {
    Logger.info('contact', 'Contact form submission started', {}, request);

    // リクエストボディ解析
    const body: ContactFormRequest = await request.json();
    const { name, email, message, honeypot } = body;

    // 基本バリデーション
    if (!name || !email || !message) {
      Logger.warn('contact', 'Validation failed: missing required fields', {
        hasName: !!name,
        hasEmail: !!email,
        hasMessage: !!message
      }, request);
      
      return NextResponse.json(
        { error: '全ての項目を入力してください' }, 
        { status: 400 }
      );
    }

    // 文字数制限チェック
    if (name.length > 100 || email.length > 200 || message.length > 2000) {
      Logger.warn('contact', 'Validation failed: field length exceeded', {
        nameLength: name.length,
        emailLength: email.length,
        messageLength: message.length
      }, request);
      
      return NextResponse.json(
        { error: '入力内容が長すぎます' }, 
        { status: 400 }
      );
    }

    // メールアドレス基本形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Logger.warn('contact', 'Validation failed: invalid email format', {
        email: email.substring(0, 10) + '...'
      }, request);
      
      return NextResponse.json(
        { error: '有効なメールアドレスを入力してください' },
        { status: 400 }
      );
    }

    const contactData: ContactFormData = { name, email, message };

    // 無料スパム検証
    const spamCheck = await performFreeSpamCheck(contactData, honeypot, request);
    
    if (!spamCheck.allow) {
      if (spamCheck.isSpam) {
        Logger.warn('contact', 'Spam detected', {
          score: spamCheck.score,
          confidence: spamCheck.confidence,
          reasonCount: spamCheck.reasons.length
        }, request);
        
        return NextResponse.json(
          { error: '送信内容に問題が検出されました' },
          { status: 429 }
        );
      } else {
        // レート制限
        Logger.warn('contact', 'Rate limit exceeded', {
          reasons: spamCheck.reasons
        }, request);
        
        return NextResponse.json(
          { error: spamCheck.reasons[0] },
          { status: 429 }
        );
      }
    }

    // Notion保存
    const notionResult = await saveToNotion(contactData, spamCheck.score, request);
    
    if (!notionResult.success) {
      Logger.error('contact', 'Failed to save to Notion', {
        error: notionResult.error,
        spamScore: spamCheck.score
      }, request);
      
      return NextResponse.json(
        { error: 'データの保存に失敗しました。しばらく後でもう一度お試しください。' },
        { status: 500 }
      );
    }

    // 成功ログ
    const responseTime = Date.now() - startTime;
    Logger.info('contact', 'Contact form submission completed successfully', {
      notionId: notionResult.notionId,
      spamScore: spamCheck.score,
      responseTime,
      messageLength: message.length
    }, request);

    return NextResponse.json(
      {
        success: true,
        message: 'お問い合わせを受け付けました。ありがとうございます。',
        notionId: notionResult.notionId
      },
      { status: 200 }
    );

  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    Logger.error('contact', 'Contact form submission error', {
      error: errorMessage,
      responseTime
    }, request);

    return NextResponse.json(
      {
        error: 'サーバーエラーが発生しました。しばらく後でもう一度お試しください。',
      },
      { status: 500 }
    );
  }
}
