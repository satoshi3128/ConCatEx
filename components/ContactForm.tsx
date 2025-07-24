'use client';

import { useState } from 'react';
import ContactConfirmation from './ContactConfirmation';
import PrivacyPolicyModal from './PrivacyPolicyModal';
import ContactSuccess from './ContactSuccess';

interface FormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // ハニーポットフィールド
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
  submit?: string;
}

type FormStep = 'input' | 'confirm' | 'result';

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '', // ハニーポットフィールド初期化
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [currentStep, setCurrentStep] = useState<FormStep>('input');
  const [isPolicyAgreed, setIsPolicyAgreed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notionId, setNotionId] = useState<string>();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '氏名を入力してください';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'メールアドレスを入力してください';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = '有効なメールアドレスを入力してください';
      }
    }

    if (!formData.message.trim()) {
      newErrors.message = 'お問い合わせ内容を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // エラーがある場合はリアルタイムでクリア
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 確認画面に移動
    setCurrentStep('confirm');
  };

  const handleConfirmSubmit = async () => {
    setIsSubmitting(true);
    setErrors({});
    setCurrentStep('result');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        setNotionId(result.notionId);
        setFormData({ name: '', email: '', message: '', honeypot: '' });
      } else {
        setSubmitStatus('error');
        setErrors({ submit: result.error || 'エラーが発生しました' });
      }
    } catch {
      setSubmitStatus('error');
      setErrors({
        submit: 'ネットワークエラーが発生しました。しばらく後でもう一度お試しください。',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackToInput = () => {
    setCurrentStep('input');
    setSubmitStatus('idle');
  };

  const handleStartOver = () => {
    setCurrentStep('input');
    setSubmitStatus('idle');
    setFormData({ name: '', email: '', message: '', honeypot: '' });
    setErrors({});
    setNotionId(undefined);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAgreeToPolicy = () => {
    setIsPolicyAgreed(true);
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* ステップインジケータ */}
      {currentStep !== 'result' && (
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center ${currentStep === 'input' ? 'text-color-accent-primary' : 'text-color-accent-secondary'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'input'
                    ? 'bg-color-accent-primary/20 border-2 border-color-accent-primary'
                    : 'bg-color-accent-secondary/20 border-2 border-color-accent-secondary'
                }`}
              >
                {currentStep === 'input' ? (
                  '1'
                ) : (
                  <svg
                    className="w-4 h-4 text-color-accent-secondary"
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
                )}
              </div>
              <span className="ml-2 text-sm font-medium">入力</span>
            </div>
            <div
              className={`w-8 h-1 ${currentStep === 'confirm' ? 'bg-color-accent-primary' : 'bg-color-border'}`}
            ></div>
            <div
              className={`flex items-center ${currentStep === 'confirm' ? 'text-color-accent-primary' : 'text-color-text-subtle'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  currentStep === 'confirm'
                    ? 'bg-color-accent-primary/20 border-2 border-color-accent-primary'
                    : 'bg-color-background border-2 border-color-border'
                }`}
              >
                2
              </div>
              <span className="ml-2 text-sm font-medium">確認</span>
            </div>
          </div>
        </div>
      )}

      {/* 入力ステップ */}
      {currentStep === 'input' && (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 名前とメールアドレスを2列レイアウト */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-slide-in-left animate-delay-300">
              <label htmlFor="name" className="block text-base font-semibold text-color-text mb-3">
                氏名 <span className="text-color-accent-secondary">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`modern-input-enhanced ${errors.name ? 'border-color-accent-secondary focus:border-color-accent-secondary' : ''}`}
                placeholder="お名前を入力してください"
                required
              />
              {errors.name && <p className="mt-2 text-sm text-color-accent-secondary">{errors.name}</p>}
            </div>

            <div className="animate-slide-in-right animate-delay-400">
              <label htmlFor="email" className="block text-base font-semibold text-color-text mb-3">
                メールアドレス <span className="text-color-accent-secondary">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`modern-input-enhanced ${errors.email ? 'border-color-accent-secondary focus:border-color-accent-secondary' : ''}`}
                placeholder="example@example.com"
                required
              />
              {errors.email && <p className="mt-2 text-sm text-color-accent-secondary">{errors.email}</p>}
            </div>
          </div>

          {/* メッセージフィールド */}
          <div className="animate-fade-in-up animate-delay-500">
            <label htmlFor="message" className="block text-base font-semibold text-color-text mb-3">
              お問い合わせ内容 <span className="text-color-accent-secondary">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={8}
              value={formData.message}
              onChange={handleInputChange}
              className={`modern-input-enhanced resize-none ${errors.message ? 'border-color-accent-secondary focus:border-color-accent-secondary' : ''}`}
              placeholder="プロジェクトの詳細、期間、ご予算、その他ご相談内容をお聞かせください"
              required
            />
            {errors.message && <p className="mt-2 text-sm text-color-accent-secondary">{errors.message}</p>}
          </div>

          {/* ハニーポットフィールド（ボット対策・非表示） */}
          <input
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleInputChange}
            style={{ display: 'none' }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* プライバシーポリシー同意 */}
          <div className="animate-fade-in-up animate-delay-550 bg-color-background p-6 rounded-xl border border-color-border">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <input
                  type="checkbox"
                  id="policy-agreement"
                  checked={isPolicyAgreed}
                  onChange={e => setIsPolicyAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`mt-1.5 h-5 w-5 border-2 rounded cursor-pointer transition-all duration-200 flex items-center justify-center ${
                    isPolicyAgreed
                      ? 'border-color-accent-primary bg-transparent'
                      : 'border-color-border bg-transparent hover:border-color-accent-primary'
                  }`}
                  onClick={() => setIsPolicyAgreed(!isPolicyAgreed)}
                >
                  {isPolicyAgreed && (
                    <svg
                      className="w-3 h-3 text-color-accent-primary"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <label htmlFor="policy-agreement" className="text-base text-color-text leading-relaxed">
                <button
                  type="button"
                  onClick={handleOpenModal}
                  className="text-color-accent-primary hover:text-color-accent-secondary underline font-medium transition-colors"
                >
                  プライバシーポリシー
                </button>
                に同意します <span className="text-color-accent-secondary font-semibold">*</span>
                <div className="text-sm text-color-text-subtle mt-1">
                  お預かりした個人情報は、お問い合わせへの回答のみに使用いたします
                </div>
              </label>
            </div>
          </div>

          {/* 送信ボタン */}
          <div className="animate-fade-in-up animate-delay-600 pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isPolicyAgreed}
              className={`w-full modern-button-enhanced relative transform transition-all duration-200 ${
                isSubmitting || !isPolicyAgreed
                  ? 'opacity-50 cursor-not-allowed scale-100'
                  : 'hover:shadow-xl hover:scale-105 active:scale-95'
              }`}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-color-text-inverse"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  送信中...
                </div>
              ) : (
                <>
                  <span className="text-lg font-semibold">確認画面へ進む</span>
                  <svg
                    className="ml-2 h-5 w-5 inline-block"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* 確認ステップ */}
      {currentStep === 'confirm' && (
        <ContactConfirmation
          formData={formData}
          onEdit={handleBackToInput}
          onConfirm={handleConfirmSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* 結果ステップ */}
      {currentStep === 'result' && (
        <div>
          {/* 成功メッセージ */}
          {submitStatus === 'success' && (
            <ContactSuccess 
              onBack={handleStartOver}
              notionId={notionId}
            />
          )}

          {/* エラーメッセージ */}
          {submitStatus === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 glass-morphism-subtle rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-color-accent-secondary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-color-text mb-2">送信エラー</h3>
                <p className="text-color-accent-secondary mb-6">{errors.submit}</p>
              </div>
              <div className="space-x-4">
                <button
                  onClick={handleBackToInput}
                  className="modern-button"
                >
                  入力画面に戻る
                </button>
                <button onClick={handleConfirmSubmit} className="px-6 py-3 modern-button-enhanced">
                  再送信
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAgree={handleAgreeToPolicy}
      />
    </div>
  );
}
