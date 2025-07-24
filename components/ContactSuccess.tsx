/**
 * Contact Form Success Component
 * お問い合わせ送信完了画面
 */

'use client';

interface ContactSuccessProps {
  onBack: () => void;
  notionId?: string;
}

export default function ContactSuccess({ onBack, notionId }: ContactSuccessProps) {
  return (
    <div className="modern-card p-8 md:p-12 text-center animate-fade-in-up" data-contact-success="true">
      {/* 成功アイコン */}
      <div className="mb-8">
        <div className="mx-auto w-20 h-20 bg-color-accent-secondary/20 rounded-full flex items-center justify-center animate-scale-in border-2 border-color-accent-secondary/30">
          <svg 
            className="w-10 h-10 text-color-accent-secondary" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2.5} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>

      {/* 成功メッセージ */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-color-text mb-4">
          お問い合わせを受け付けました
        </h2>
        <div className="text-lg text-color-text-muted leading-relaxed mb-6">
          <p className="mb-3">
            この度は、お問い合わせいただき<br className="hidden sm:inline" />
            誠にありがとうございます。
          </p>
          <p className="mb-3">
            内容を確認次第、<br className="hidden sm:inline" />
            <span className="font-semibold text-color-text">24時間以内</span>に<br className="hidden sm:inline" />
            ご返信いたします。
          </p>
          <p className="text-base text-color-text-subtle">
            万が一、返信が届かない場合は、<br className="hidden sm:inline" />
            迷惑メールフォルダをご確認ください。
          </p>
        </div>
      </div>

      {/* お問い合わせID（デバッグ用・本番では非表示にする場合あり） */}
      {notionId && process.env.NODE_ENV === 'development' && (
        <div className="mb-6 p-4 bg-color-background rounded-lg">
          <p className="text-sm text-color-text-subtle">
            お問い合わせID: <span className="font-mono text-xs">{notionId.substring(0, 8)}...</span>
          </p>
        </div>
      )}

      {/* 次のアクション */}
      <div className="space-y-4">
        <button 
          onClick={onBack}
          className="px-6 py-3 border border-color-border rounded-lg text-color-text font-medium hover:bg-color-hover transition-colors w-full sm:w-auto"
        >
          フォームに戻る
        </button>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <a
            href="#about"
            className="text-color-accent-primary hover:text-color-accent-secondary font-medium transition-colors underline"
            onClick={onBack}
          >
            プロフィールを見る
          </a>
          <span className="text-color-text-subtle hidden sm:inline">|</span>
          <a
            href="#career"
            className="text-color-accent-primary hover:text-color-accent-secondary font-medium transition-colors underline"
            onClick={onBack}
          >
            経歴を確認する
          </a>
        </div>
      </div>

      {/* 装飾要素 */}
      <div className="mt-12 pt-8 border-t border-color-border">
        <div className="flex justify-center items-center space-x-2 text-sm text-color-text-subtle">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>安全に送信されました</span>
        </div>
      </div>
    </div>
  );
}