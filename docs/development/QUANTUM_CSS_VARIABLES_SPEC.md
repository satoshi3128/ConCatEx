# QUANTUM CSS変数命名体系仕様

**作成日**: 2025-07-21  
**タスク**: QUANTUM-D02  
**目的**: セマンティックで保守しやすいCSS変数命名規則定義

---

## 🎯 命名方針

### 基本原則
1. **セマンティック**: 用途が明確に分かる名前
2. **階層構造**: カテゴリ → サブカテゴリ → 詳細の順
3. **一貫性**: 統一されたパターンでの命名
4. **拡張性**: 将来の追加にも対応できる設計

### 命名パターン
```css
--{category}-{subcategory}-{variant}
```

---

## 🎨 カラー変数体系

### Core Colors (コア5色)
```css
/* === MONOCHROME BASE COLORS === */
--color-primary: #2E2E2E;              /* ダークグレー */
--color-background: #F8F8F8;           /* ウォームグレー */
--color-surface: #FFFFFF;              /* ピュアホワイト */
--color-accent-primary: #8FA8B2;       /* ペールブルーグレー */
--color-accent-secondary: #B5A7A7;     /* ペールモーブ */
```

### Semantic Colors (セマンティック色)
```css
/* === TEXT COLORS === */
--color-text: var(--color-primary);                    /* メインテキスト */
--color-text-muted: rgba(46, 46, 46, 0.7);            /* 軽量テキスト */
--color-text-subtle: rgba(46, 46, 46, 0.5);           /* サブテキスト */
--color-text-inverse: var(--color-background);         /* 反転テキスト */

/* === INTERACTIVE COLORS === */
--color-link: var(--color-accent-primary);             /* リンク */
--color-link-hover: var(--color-accent-secondary);     /* リンクホバー */
--color-button-primary: var(--color-accent-primary);   /* 主要ボタン */
--color-button-secondary: var(--color-accent-secondary); /* セカンダリーボタン */

/* === BORDER & DIVIDER COLORS === */
--color-border: rgba(46, 46, 46, 0.1);                /* ボーダー */
--color-border-strong: rgba(46, 46, 46, 0.2);         /* 強調ボーダー */
--color-divider: rgba(46, 46, 46, 0.08);              /* 区切り線 */

/* === STATE COLORS === */
--color-hover: rgba(143, 168, 178, 0.1);              /* ホバー背景 */
--color-focus: rgba(143, 168, 178, 0.2);              /* フォーカス背景 */
--color-active: rgba(143, 168, 178, 0.3);             /* アクティブ背景 */
--color-disabled: rgba(46, 46, 46, 0.3);              /* 無効状態 */
```

### Dark Mode Colors
```css
/* === DARK MODE OVERRIDES === */
[data-theme="dark"] {
  --color-primary: #E5E5E5;
  --color-background: #1A1A1A;
  --color-surface: #2A2A2A;
  --color-accent-primary: #7A9AAD;
  --color-accent-secondary: #A39999;
  
  --color-text: var(--color-primary);
  --color-text-muted: rgba(229, 229, 229, 0.7);
  --color-text-subtle: rgba(229, 229, 229, 0.5);
  --color-text-inverse: var(--color-background);
  
  --color-border: rgba(229, 229, 229, 0.1);
  --color-border-strong: rgba(229, 229, 229, 0.2);
  --color-divider: rgba(229, 229, 229, 0.08);
  
  --color-hover: rgba(122, 154, 173, 0.1);
  --color-focus: rgba(122, 154, 173, 0.2);
  --color-active: rgba(122, 154, 173, 0.3);
  --color-disabled: rgba(229, 229, 229, 0.3);
}
```

---

## 📐 サイズ・スペーシング体系

### Size Variables
```css
/* === SPACING SYSTEM === */
--size-spacing-xs: 0.25rem;    /* 4px */
--size-spacing-sm: 0.5rem;     /* 8px */
--size-spacing-md: 1rem;       /* 16px */
--size-spacing-lg: 1.5rem;     /* 24px */
--size-spacing-xl: 2rem;       /* 32px */
--size-spacing-2xl: 3rem;      /* 48px */

/* === RADIUS SYSTEM === */
--size-radius-sm: 0.25rem;     /* 4px */
--size-radius-md: 0.5rem;      /* 8px */
--size-radius-lg: 0.75rem;     /* 12px */
--size-radius-xl: 1rem;        /* 16px */

/* === TYPOGRAPHY SIZES === */
--size-text-xs: 0.75rem;       /* 12px */
--size-text-sm: 0.875rem;      /* 14px */
--size-text-md: 1rem;          /* 16px */
--size-text-lg: 1.125rem;      /* 18px */
--size-text-xl: 1.25rem;       /* 20px */
--size-text-2xl: 1.5rem;       /* 24px */
--size-text-3xl: 2rem;         /* 32px */
```

---

## 🌊 エフェクト・アニメーション体系

### Shadow System
```css
/* === SHADOW VARIABLES === */
--effect-shadow-soft: 0 2px 4px rgba(46, 46, 46, 0.05);
--effect-shadow-medium: 0 4px 8px rgba(46, 46, 46, 0.08);
--effect-shadow-large: 0 8px 16px rgba(46, 46, 46, 0.12);
--effect-shadow-focus: 0 0 0 3px rgba(143, 168, 178, 0.2);

/* Dark mode shadows */
[data-theme="dark"] {
  --effect-shadow-soft: 0 2px 4px rgba(0, 0, 0, 0.3);
  --effect-shadow-medium: 0 4px 8px rgba(0, 0, 0, 0.4);
  --effect-shadow-large: 0 8px 16px rgba(0, 0, 0, 0.5);
  --effect-shadow-focus: 0 0 0 3px rgba(122, 154, 173, 0.3);
}
```

### Transition System
```css
/* === TRANSITION VARIABLES === */
--effect-transition-fast: 0.15s ease-out;
--effect-transition-normal: 0.3s ease-out;
--effect-transition-slow: 0.5s ease-out;
--effect-transition-spring: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Glass Morphism (Simplified)
```css
/* === GLASS EFFECT VARIABLES === */
--effect-glass-backdrop: blur(8px);
--effect-glass-background: rgba(255, 255, 255, 0.9);
--effect-glass-border: rgba(255, 255, 255, 0.3);

[data-theme="dark"] {
  --effect-glass-background: rgba(42, 42, 42, 0.9);
  --effect-glass-border: rgba(42, 42, 42, 0.3);
}
```

---

## 📱 レスポンシブ体系

### Breakpoint Variables
```css
/* === BREAKPOINT VARIABLES === */
--breakpoint-sm: 640px;
--breakpoint-md: 768px;
--breakpoint-lg: 1024px;
--breakpoint-xl: 1280px;
```

---

## 🏗️ コンポーネント固有変数

### Button System
```css
/* === BUTTON VARIABLES === */
--button-padding-sm: var(--size-spacing-sm) var(--size-spacing-md);
--button-padding-md: var(--size-spacing-md) var(--size-spacing-lg);
--button-padding-lg: var(--size-spacing-lg) var(--size-spacing-xl);
--button-radius: var(--size-radius-md);
--button-transition: var(--effect-transition-spring);
```

### Card System
```css
/* === CARD VARIABLES === */
--card-background: var(--color-surface);
--card-border: 1px solid var(--color-border);
--card-radius: var(--size-radius-lg);
--card-shadow: var(--effect-shadow-medium);
--card-padding: var(--size-spacing-lg);
```

### Input System
```css
/* === INPUT VARIABLES === */
--input-background: var(--color-surface);
--input-border: 1px solid var(--color-border);
--input-border-focus: 2px solid var(--color-accent-primary);
--input-radius: var(--size-radius-md);
--input-padding: var(--size-spacing-md);
--input-transition: var(--effect-transition-normal);
```

---

## 🚫 削除・置換対象

### 削除する既存変数
```css
/* これらは完全削除 */
--gradient-1
--gradient-2
--gradient-3
--gradient-4
--gradient-5
```

### 置換する既存変数
```css
/* 既存 → 新規 */
--background → --color-background
--foreground → --color-text
--shadow-soft → --effect-shadow-soft
--shadow-medium → --effect-shadow-medium
--shadow-large → --effect-shadow-large
```

---

## 📚 使用例

### Button Implementation
```css
.modern-button {
  background: var(--color-button-primary);
  color: var(--color-text-inverse);
  border: var(--input-border);
  border-radius: var(--button-radius);
  padding: var(--button-padding-md);
  transition: var(--button-transition);
  box-shadow: var(--effect-shadow-soft);
}

.modern-button:hover {
  background: var(--color-button-secondary);
  box-shadow: var(--effect-shadow-medium);
  transform: translateY(-2px);
}
```

### Card Implementation
```css
.modern-card {
  background: var(--card-background);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: var(--card-padding);
  box-shadow: var(--card-shadow);
  transition: var(--effect-transition-normal);
}

.modern-card:hover {
  box-shadow: var(--effect-shadow-large);
  transform: translateY(-1px);
}
```

---

## ✅ 品質基準

### 命名規則チェック
- [x] **一貫性**: 全て同じパターンで命名
- [x] **直感性**: 名前から用途が分かる
- [x] **階層性**: カテゴリ分けが明確
- [x] **拡張性**: 新しい変数追加に対応可能

### 機能性チェック
- [x] **コア5色のみ**: 余分な色を使用しない
- [x] **セマンティック**: 意味のある変数名
- [x] **ダークモード**: 完全対応
- [x] **コンポーネント対応**: 主要コンポーネント網羅

### 保守性チェック
- [x] **削除対象明確**: 既存変数の処理方針確定
- [x] **移行計画**: 段階的な置換が可能
- [x] **ドキュメント**: 使用例とガイドライン完備

---

**承認**: ✅ QUANTUM-D02完了  
**次のタスク**: QUANTUM-D03 ダークモードトグルUI/UX設計