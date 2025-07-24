# QUANTUM ダークモードトグル UI/UX設計仕様

**作成日**: 2025-07-21  
**タスク**: QUANTUM-D03  
**目的**: 直感的で美しいダークモード切替機能の設計

---

## 🎯 設計方針

### UI設計原則
1. **直感性**: 一目で状態が分かるデザイン
2. **アクセシビリティ**: キーボード操作・スクリーンリーダー対応
3. **統一感**: 新5色パレットに完全準拠
4. **レスポンシブ**: 全デバイスで適切なサイズ・位置

### UX要件
- **瞬時切替**: クリック即座にテーマ変更
- **状態保持**: localStorage永続化
- **初期設定**: システム設定に応じた自動検出
- **視覚フィードバック**: 切替時の滑らかなアニメーション

---

## 🎨 ビジュアルデザイン

### トグルボタン外観

#### ライトモード時
```css
.dark-mode-toggle {
  /* Container */
  width: 60px;
  height: 32px;
  background: var(--color-accent-secondary);  /* #B5A7A7 */
  border: 2px solid var(--color-border);
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: var(--effect-transition-normal);
  
  /* Icon container */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
}

.dark-mode-toggle::before {
  /* Slider circle */
  content: '';
  width: 20px;
  height: 20px;
  background: var(--color-surface);
  border-radius: 50%;
  position: absolute;
  left: 4px;
  top: 4px;
  transition: var(--effect-transition-spring);
  box-shadow: var(--effect-shadow-soft);
}

/* Sun icon (visible in light mode) */
.toggle-icon-sun {
  opacity: 1;
  color: var(--color-accent-primary);
  font-size: 14px;
}

/* Moon icon (hidden in light mode) */
.toggle-icon-moon {
  opacity: 0.3;
  color: var(--color-text-muted);
  font-size: 14px;
}
```

#### ダークモード時
```css
[data-theme="dark"] .dark-mode-toggle {
  background: var(--color-accent-primary);  /* #7A9AAD */
  border-color: var(--color-border);
}

[data-theme="dark"] .dark-mode-toggle::before {
  /* Slider moves right */
  left: 34px;
  background: var(--color-surface);  /* #2A2A2A */
}

[data-theme="dark"] .toggle-icon-sun {
  opacity: 0.3;
  color: var(--color-text-muted);
}

[data-theme="dark"] .toggle-icon-moon {
  opacity: 1;
  color: var(--color-accent-secondary);
}
```

### アイコンシステム

#### 使用アイコン
- **Sun**: `☀️` または Lucide `Sun` component
- **Moon**: `🌙` または Lucide `Moon` component

#### アイコン仕様
```tsx
// Sun Icon (Light Mode Active)
<Sun size={14} className="toggle-icon-sun" />

// Moon Icon (Dark Mode Active)  
<Moon size={14} className="toggle-icon-moon" />
```

---

## 📍 配置・レイアウト

### 配置位置
**右上固定ナビゲーション内**
- Navigation.tsx の右端
- 既存ナビゲーション項目の右側
- モバイルでも常に表示

### レスポンシブ配置
```css
/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .dark-mode-toggle-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 50;
  }
}

/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .dark-mode-toggle-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 50;
  }
  
  .dark-mode-toggle {
    width: 56px;
    height: 28px;
  }
}

/* Mobile (< 768px) */
@media (max-width: 767px) {
  .dark-mode-toggle-container {
    position: fixed;
    top: 16px;
    right: 16px;
    z-index: 50;
  }
  
  .dark-mode-toggle {
    width: 52px;
    height: 26px;
  }
}
```

---

## ⚙️ 機能仕様

### 状態管理

#### localStorage Key
```typescript
const THEME_STORAGE_KEY = 'portfolio-theme'
const THEME_VALUES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
} as const
```

#### 初期値決定ロジック
```typescript
function getInitialTheme(): string {
  // 1. localStorage確認
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored && ['light', 'dark'].includes(stored)) {
    return stored
  }
  
  // 2. System preference確認
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  
  // 3. デフォルト（light）
  return 'light'
}
```

### DOM操作

#### Theme適用
```typescript
function applyTheme(theme: string) {
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
```

#### System Preference監視
```typescript
useEffect(() => {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  
  const handleChange = (e: MediaQueryListEvent) => {
    // ユーザーが手動設定していない場合のみ反映
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (!stored) {
      applyTheme(e.matches ? 'dark' : 'light')
    }
  }
  
  mediaQuery.addEventListener('change', handleChange)
  return () => mediaQuery.removeEventListener('change', handleChange)
}, [])
```

---

## 🎭 アニメーション仕様

### 切替アニメーション

#### スライダー移動
```css
.dark-mode-toggle::before {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Light → Dark */
.dark-mode-toggle[data-theme="dark"]::before {
  transform: translateX(28px);
}
```

#### アイコンフェード
```css
.toggle-icon-sun,
.toggle-icon-moon {
  transition: all 0.2s ease-out;
}

/* Cross-fade effect */
.dark-mode-toggle:hover .toggle-icon-sun {
  transform: scale(1.1);
}

.dark-mode-toggle:hover .toggle-icon-moon {
  transform: scale(1.1);
}
```

#### 背景色変化
```css
.dark-mode-toggle {
  transition: background-color 0.3s ease-out;
}
```

### ページ全体テーマ切替
```css
/* Smooth theme transition */
* {
  transition: background-color 0.3s ease-out,
              color 0.3s ease-out,
              border-color 0.3s ease-out;
}

/* Theme transition class */
.theme-transitioning * {
  transition-duration: 0.3s !important;
}
```

---

## ♿ アクセシビリティ

### ARIA属性
```tsx
<button
  className="dark-mode-toggle"
  onClick={toggleTheme}
  aria-label={theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
  aria-pressed={theme === 'dark'}
  role="switch"
  type="button"
>
  <Sun size={14} className="toggle-icon-sun" aria-hidden="true" />
  <Moon size={14} className="toggle-icon-moon" aria-hidden="true" />
</button>
```

### キーボード操作
```typescript
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    toggleTheme()
  }
}
```

### スクリーンリーダー対応
```typescript
// Focus management
const announceThemeChange = (newTheme: string) => {
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
```

---

## 🧪 テスト仕様

### ユニットテスト項目
```typescript
describe('DarkModeToggle', () => {
  test('初期状態がシステム設定に従う', () => {})
  test('クリックでテーマが切り替わる', () => {})
  test('localStorage保存が正しく動作', () => {})
  test('ページリロード時に状態復元', () => {})
  test('system preference変更に反応', () => {})
  test('ARIA属性が正しく設定される', () => {})
  test('キーボード操作が動作する', () => {})
})
```

### E2Eテスト項目
```typescript
describe('Dark Mode E2E', () => {
  test('トグルクリックで全体テーマ変更', () => {})
  test('状態がセッション間で保持される', () => {})
  test('全ページでテーマ一貫性確認', () => {})
  test('レスポンシブでトグルが表示', () => {})
})
```

---

## 📱 レスポンシブ考慮事項

### タッチターゲット
```css
.dark-mode-toggle {
  /* Minimum 44px touch target */
  min-width: 44px;
  min-height: 44px;
  
  /* Padding for easier tapping */
  padding: 6px;
}

@media (max-width: 767px) {
  .dark-mode-toggle {
    /* Slightly larger on mobile */
    min-width: 48px;
    min-height: 48px;
  }
}
```

### Hover効果
```css
/* No hover on touch devices */
@media (hover: hover) {
  .dark-mode-toggle:hover {
    background: var(--color-hover);
    transform: scale(1.05);
  }
}

/* Touch feedback */
.dark-mode-toggle:active {
  transform: scale(0.95);
}
```

---

## 🔧 実装ファイル構成

### コンポーネントファイル
```
components/
├── DarkModeToggle.tsx         # メインコンポーネント
├── DarkModeToggle.module.css  # スタイル
└── hooks/
    └── useDarkMode.ts         # カスタムフック
```

### TypeScript型定義
```typescript
export type Theme = 'light' | 'dark'

export interface DarkModeToggleProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export interface UseDarkModeReturn {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}
```

---

## ✅ 品質チェックリスト

### デザイン品質
- [x] **5色パレット準拠**: アクセント色のみ使用
- [x] **グラデーション廃止**: 単色のみで構成
- [x] **状態明確性**: ライト/ダーク状態が一目瞭然
- [x] **統一感**: 全体デザインとの調和

### 機能品質
- [x] **即座切替**: クリック後瞬時にテーマ変更
- [x] **永続化**: localStorage状態保存
- [x] **自動検出**: system preference対応
- [x] **レスポンシブ**: 全デバイス対応

### アクセシビリティ品質
- [x] **ARIA対応**: 適切な属性設定
- [x] **キーボード**: Enter/Space操作対応
- [x] **スクリーンリーダー**: 状態変更アナウンス
- [x] **タッチターゲット**: 44px以上確保

### 技術品質
- [x] **TypeScript**: 完全型安全
- [x] **テスタブル**: ユニット・E2Eテスト対応
- [x] **パフォーマンス**: 軽量・高速
- [x] **保守性**: 明確な責任分離

---

**承認**: ✅ QUANTUM-D03完了  
**次のフェーズ**: Implementation Tasks 開始 (QUANTUM-I01～I09)