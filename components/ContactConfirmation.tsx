interface FormData {
  name: string;
  email: string;
  message: string;
}

interface ContactConfirmationProps {
  formData: FormData;
  onEdit: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export default function ContactConfirmation({
  formData,
  onEdit,
  onConfirm,
  isSubmitting,
}: ContactConfirmationProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-3xl md:text-4xl font-bold text-color-text mb-4">送信内容の確認</h3>
        <p className="text-lg text-color-text-muted">
          以下の内容で送信いたします。内容をご確認の上、送信ボタンを押してください。
        </p>
      </div>

      <div className="grid gap-6">
        {/* 名前とメールアドレスを2列レイアウト */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 氏名の確認 */}
          <div className="modern-card-mini p-6">
            <div className="flex items-center mb-3">
              <svg
                className="w-5 h-5 mr-2 text-color-accent-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <label className="text-base font-semibold text-color-text">氏名</label>
            </div>
            <p className="text-color-text text-lg font-medium pl-7">{formData.name}</p>
          </div>

          {/* メールアドレスの確認 */}
          <div className="modern-card-mini p-6">
            <div className="flex items-center mb-3">
              <svg
                className="w-5 h-5 mr-2 text-color-accent-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <label className="text-base font-semibold text-color-text">メールアドレス</label>
            </div>
            <p className="text-color-text text-lg font-medium pl-7 break-all">{formData.email}</p>
          </div>
        </div>

        {/* お問い合わせ内容の確認 */}
        <div className="modern-card-mini p-6">
          <div className="flex items-center mb-4">
            <svg
              className="w-5 h-5 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <label className="text-base font-semibold text-color-text">お問い合わせ内容</label>
          </div>
          <div className="bg-color-background p-4 rounded-lg pl-7">
            <div className="text-color-text whitespace-pre-wrap leading-relaxed">
              {formData.message}
            </div>
          </div>
        </div>
      </div>

      {/* アクションボタン */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <button
          type="button"
          onClick={onEdit}
          disabled={isSubmitting}
          className={`flex-1 px-6 py-3 border border-color-border rounded-lg text-color-text font-medium transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-color-hover active:bg-color-active'
          }`}
        >
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 17l-5-5m0 0l5-5m-5 5h12"
              />
            </svg>
            内容を修正する
          </div>
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={isSubmitting}
          className={`flex-1 modern-button-enhanced relative ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg active:scale-95'
          }`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
              送信する
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
