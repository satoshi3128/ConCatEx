'use client'

import { useState, useEffect } from 'react'

export type Theme = 'light' | 'dark'

interface DarkModeToggleProps {
  className?: string
}

const THEME_STORAGE_KEY = 'portfolio-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  
  // 1. localStorage確認
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored && ['light', 'dark'].includes(stored)) {
    return stored as Theme
  }
  
  // 2. System preference確認
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  // 3. デフォルト（light）
  return 'light'
}

function applyTheme(theme: Theme) {
  // HTML属性設定
  document.documentElement.setAttribute('data-theme', theme)
  
  // localStorage保存
  localStorage.setItem(THEME_STORAGE_KEY, theme)
  
  // meta theme-color更新
  const metaThemeColor = document.querySelector('meta[name="theme-color"]')
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', 
      theme === 'dark' ? '#1A1A1A' : '#F8F8F8'
    )
  }
}

function announceThemeChange(newTheme: Theme) {
  const message = newTheme === 'dark' 
    ? 'ダークモードに切り替わりました' 
    : 'ライトモードに切り替わりました'
  
  // Create live region for announcement
  const announcement = document.createElement('div')
  announcement.setAttribute('aria-live', 'polite')
  announcement.setAttribute('aria-atomic', 'true')
  announcement.className = 'sr-only'
  announcement.textContent = message
  
  document.body.appendChild(announcement)
  setTimeout(() => document.body.removeChild(announcement), 1000)
}

export default function DarkModeToggle({ className = '' }: DarkModeToggleProps) {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setMounted(true)

    // System preference監視
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e: MediaQueryListEvent) => {
      // ユーザーが手動設定していない場合のみ反映
      const stored = localStorage.getItem(THEME_STORAGE_KEY)
      if (!stored) {
        const newTheme = e.matches ? 'dark' : 'light'
        setTheme(newTheme)
        applyTheme(newTheme)
      }
    }
    
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    applyTheme(newTheme)
    announceThemeChange(newTheme)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggleTheme()
    }
  }

  // マウント前は何も表示しない（ハイドレーション不一致防止）
  if (!mounted) {
    return (
      <div className={`dark-mode-toggle-container ${className}`}>
        <div className="dark-mode-toggle loading">
          <div className="toggle-placeholder" />
        </div>
      </div>
    )
  }

  return (
    <div className={`dark-mode-toggle-container ${className}`}>
      <button
        className="dark-mode-toggle"
        onClick={toggleTheme}
        onKeyDown={handleKeyDown}
        aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        aria-checked={theme === 'dark'}
        role="switch"
        type="button"
        data-theme={theme}
      >
        {/* Sun icon */}
        <svg 
          className="toggle-icon-sun" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>

        {/* Moon icon */}
        <svg 
          className="toggle-icon-moon" 
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      </button>
    </div>
  )
}