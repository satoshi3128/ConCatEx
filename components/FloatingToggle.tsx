'use client';

import { useState, useEffect } from 'react';

interface FloatingToggleProps {
  onToggle: (isEnabled: boolean) => void;
  className?: string;
}

export default function FloatingToggle({ onToggle, className = '' }: FloatingToggleProps) {
  const [isEnabled, setIsEnabled] = useState(true);

  // ローカルストレージから状態を読み込み
  useEffect(() => {
    const savedState = localStorage.getItem('floating-elements-enabled');
    if (savedState !== null) {
      const enabled = savedState === 'true';
      setIsEnabled(enabled);
    }
  }, []);

  // 状態変更ハンドラ
  const handleToggle = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    onToggle(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        p-3 rounded-full
        transition-all duration-300 transform hover:scale-110 active:scale-95
        bg-color-background border-2 border-color-border
        hover:bg-color-hover hover:border-color-accent-primary
        shadow-lg hover:shadow-xl
        group relative
        ${className}
      `}
      aria-label={isEnabled ? '浮遊エレメントを無効にする' : '浮遊エレメントを有効にする'}
      title={isEnabled ? '浮遊エレメントを無効にする' : '浮遊エレメントを有効にする'}
    >
      {/* 浮遊エレメント アイコン */}
      <div className="relative w-6 h-6">
        {isEnabled ? (
          // 有効時: 複数の浮遊オブジェクト
          <svg
            className="w-6 h-6 text-color-accent-primary transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {/* 大きい円 */}
            <circle
              cx="12"
              cy="8"
              r="3"
              className="animate-pulse"
              strokeWidth="2"
              fill="currentColor"
              opacity="0.6"
            />
            {/* 小さい円1 */}
            <circle
              cx="6"
              cy="16"
              r="2"
              className="animate-bounce"
              strokeWidth="2"
              fill="currentColor"
              opacity="0.4"
              style={{ animationDelay: '0.2s' }}
            />
            {/* 小さい円2 */}
            <circle
              cx="18"
              cy="16"
              r="1.5"
              className="animate-ping"
              strokeWidth="2"
              fill="currentColor"
              opacity="0.3"
              style={{ animationDelay: '0.4s' }}
            />
            {/* 動きを表す線 */}
            <path
              d="m9 12 2 2 4-4"
              strokeWidth="2"
              opacity="0.5"
              className="animate-pulse"
            />
          </svg>
        ) : (
          // 無効時: 無効化された浮遊オブジェクト
          <svg
            className="w-6 h-6 text-color-text-muted transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {/* 停止した円 */}
            <circle
              cx="12"
              cy="8"
              r="3"
              strokeWidth="2"
              fill="none"
              opacity="0.4"
            />
            <circle
              cx="6"
              cy="16"
              r="2"
              strokeWidth="2"
              fill="none"
              opacity="0.3"
            />
            <circle
              cx="18"
              cy="16"
              r="1.5"
              strokeWidth="2"
              fill="none"
              opacity="0.2"
            />
            {/* 無効化線 */}
            <path
              d="m3 3 18 18"
              strokeWidth="2"
              opacity="0.6"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>

      {/* ホバー時のツールチップ効果 */}
      <div className="absolute inset-0 rounded-full bg-color-accent-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      
      {/* 状態インジケータ */}
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-300 ${
          isEnabled
            ? 'bg-color-accent-primary shadow-lg shadow-color-accent-primary/50'
            : 'bg-color-text-subtle'
        }`}
      />
    </button>
  );
}