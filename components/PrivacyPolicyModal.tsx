import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, onAgree }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent body scrolling
      const handleEscape = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = ''; // Restore body scrolling
      };
    } else {
      document.body.style.overflow = ''; // Restore body scrolling when closed
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="modern-card max-w-4xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-8 md:p-12"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-color-text">プライバシーポリシー</h2>
          <button
            onClick={onClose}
            className="text-color-text-muted hover:text-color-text"
            aria-label="Close privacy policy modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>

        {/* Privacy Policy Content */}
        <div className="prose max-w-none mb-8 text-color-text">
          <p>
            [あなたの名前]（以下、「当方」といいます）は、当サイトのお問い合わせフォームを通じて取得する個人情報の取り扱いについて、以下の通りプライバシーポリシー（以下、「本ポリシー」といいます）を定めます。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">1. 取得する個人情報</h3>
          <p>当サイトでは、お問い合わせフォームから以下の情報を取得します。</p>
          <ul className="list-disc list-inside ml-4">
            <li>氏名</li>
            <li>メールアドレス</li>
            <li>お問い合わせ内容</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">2. 利用目的</h3>
          <p>
            取得した個人情報は、お問い合わせに対する回答や、必要な情報を電子メールでご連絡する場合に利用するものであり、これらの目的以外では利用いたしません。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">3. 第三者への提供</h3>
          <p>
            当方は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはありません。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">4. 情報の管理</h3>
          <p>
            取得した個人情報は、当方のメールシステム内にて厳重に管理いたします。お問い合わせへの返信が完了し、以降の連絡が不要になったと判断した場合、取得した個人情報は速やかに破棄いたします。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">5. 注意事項</h3>
          <p>
            お問い合わせフォームには、クレジットカード情報やその他、特に機密性の高い情報は入力しないようお願いいたします。当方では、お問い合わせ内容に含まれる機密情報の管理について、特別な責任を負うことはできかねますので、あらかじめご了承ください。
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-color-text">6. 本ポリシーの変更</h3>
          <p>
            本ポリシーの内容は、予告なく変更されることがあります。変更後の本ポリシーについては、当サイトに掲載した時から効力を生じるものとします。
          </p>

          <p className="text-sm text-color-text-subtle mt-8">制定日: 2025年7月19日</p>
        </div>

        {/* Agreement Section */}
        <div className="border-t border-color-border pt-8">
          <div className="flex justify-center space-x-4">
            <button
              onClick={onClose}
              className="px-6 py-3 text-color-text-muted font-medium rounded-lg border border-color-border hover:bg-color-hover focus:outline-none focus:ring-2 focus:ring-color-accent-primary transition-colors"
            >
              キャンセル
            </button>
            <button onClick={onAgree} className="modern-button-enhanced px-6 py-3 font-semibold">
              プライバシーポリシーに同意して閉じる
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PrivacyPolicyModal;
