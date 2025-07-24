# NEXUS アニメーション穏やか化・統一性確保仕様

**作成日**: 2025-07-23 12:05 JST  
**目的**: 現在のアニメーション効果の穏やか化・統一性確保  
**設計方針**: 上品で控えめ、統一されたモーション言語

---

## 🎯 設計目標

### 主要目標
1. **穏やか化**: 過度な動きの抑制
2. **統一性**: 一貫したeasing・速度・距離
3. **上品さ**: 注意を逸らさない背景的効果
4. **パフォーマンス**: 60fps維持・GPU最適化

### モーション言語定義
- **微細な動き**: 0.5-1px程度の移動
- **適度な動き**: 1-2px程度の移動  
- **明確な動き**: 2-4px程度の移動（最大値）
- **統一easing**: `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 🔍 現状アニメーション分析

### 1. 基本アニメーション (L253-295) ✅ 良好
```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
```
**評価**: ✅ 適度な移動距離、上品な効果

### 2. ボタンホバーアニメーション ❌ 活発すぎ
```css
.modern-button:hover {
  transform: translateY(-2px);              /* ❌ 活発 */
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.modern-button-enhanced:hover {
  transform: translateY(-3px);              /* ❌ 非常に活発 */
  box-shadow: var(--shadow-large);
}
```
**評価**: ❌ 移動距離過大、注意を引きすぎ

### 3. カードホバーアニメーション ❌ 活発すぎ
```css
.modern-card:hover {
  transform: translateY(-4px);              /* ❌ 非常に活発 */
  box-shadow: var(--effect-shadow-large);
}
```
**評価**: ❌ 最も活発、改善必要度高

### 4. 3D浮遊エレメント ⚠️ 検討要
```css
@keyframes float1 {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-15px) translateX(5px); }
  50% { transform: translateY(-25px) translateX(-3px); }     /* ⚠️ 大きな移動 */
  75% { transform: translateY(-10px) translateX(8px); }
}
```
**評価**: ⚠️ 振幅が大きい、控えめ化検討要

---

## 📐 新アニメーション変数仕様

### 1. 統一easing・timing定義
```css
:root {
  /* Unified easing functions */
  --easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-gentle: cubic-bezier(0.25, 0, 0.3, 1);
  --easing-subtle: cubic-bezier(0.3, 0, 0.4, 1);
  --easing-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* Unified timing */
  --duration-fast: 0.15s;
  --duration-normal: 0.3s;
  --duration-slow: 0.5s;
  
  /* Unified distances */
  --move-micro: 0.5px;
  --move-small: 1px;
  --move-medium: 2px;
  --move-large: 4px;    /* 最大値 */
}
```

### 2. 穏やかなボタンアニメーション
```css
/* Refined button animations */
.modern-button {
  transition: all var(--duration-normal) var(--easing-standard);
  transform: translateY(0);
}

.modern-button:hover {
  transform: translateY(calc(-1 * var(--move-small)));       /* -1px */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);               /* 軽量化 */
}

.modern-button-enhanced {
  transition: all var(--duration-normal) var(--easing-standard);
  transform: translateY(0);
}

.modern-button-enhanced:hover:not(:disabled) {
  transform: translateY(calc(-1 * var(--move-medium)));      /* -2px */
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);              /* 軽量化 */
}
```

### 3. 穏やかなカードアニメーション
```css
/* Refined card animations */
.modern-card {
  transition: all var(--duration-normal) var(--easing-standard);
  transform: translateY(0);
}

.modern-card:hover {
  transform: translateY(calc(-1 * var(--move-medium)));      /* -2px (was -4px) */
  box-shadow: var(--effect-shadow-large);
}

.modern-card-mini {
  transition: all var(--duration-normal) var(--easing-gentle);
  transform: translateY(0);
}

.modern-card-mini:hover {
  transform: translateY(calc(-1 * var(--move-small)));       /* -1px (現状維持) */
  background: var(--color-hover);
  box-shadow: var(--effect-shadow-medium);
}
```

---

## 🌊 3D浮遊エレメント穏やか化仕様

### 現在の振幅分析
- **float1**: 最大25px移動 → **15px**に削減提案
- **float2**: 最大20px移動 → **12px**に削減提案  
- **float3**: 最大22px移動 → **14px**に削減提案

### 穏やか化アニメーション
```css
/* Refined floating animations */
@keyframes float1-gentle {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-8px) translateX(3px); }       /* -15px → -8px */
  50% { transform: translateY(-15px) translateX(-2px); }     /* -25px → -15px */
  75% { transform: translateY(-5px) translateX(4px); }       /* -10px → -5px */
}

@keyframes float2-gentle {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  33% { transform: translateY(-12px) translateX(-4px); }     /* -20px → -12px */
  66% { transform: translateY(-7px) translateX(6px); }       /* -12px → -7px */
}

@keyframes float3-gentle {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  20% { transform: translateY(-5px) translateX(2px); }       /* -8px → -5px */
  40% { transform: translateY(-10px) translateX(-3px); }     /* -18px → -10px */
  60% { transform: translateY(-14px) translateX(4px); }      /* -22px → -14px */
  80% { transform: translateY(-8px) translateX(-1px); }      /* -14px → -8px */
}
```

---

## 🎭 インタラクション階層定義

### Level 1: 微細反応（Micro Feedback）
- **対象**: 小要素、アイコン、テキストリンク
- **移動距離**: `var(--move-micro)` (0.5px)
- **duration**: `var(--duration-fast)` (0.15s)
- **easing**: `var(--easing-gentle)`

### Level 2: 標準反応（Standard Feedback）
- **対象**: ボタン、小カード、入力フィールド
- **移動距離**: `var(--move-small)` (1px)
- **duration**: `var(--duration-normal)` (0.3s)
- **easing**: `var(--easing-standard)`

### Level 3: 明確反応（Clear Feedback）
- **対象**: 大カード、主要ボタン、重要要素
- **移動距離**: `var(--move-medium)` (2px)
- **duration**: `var(--duration-normal)` (0.3s)
- **easing**: `var(--easing-standard)`

### Level 4: 強調反応（Emphasized Feedback）
- **対象**: CTA、アクションボタン、警告要素
- **移動距離**: `var(--move-large)` (4px) ※最大値
- **duration**: `var(--duration-slow)` (0.5s)
- **easing**: `var(--easing-spring)`

---

## 📱 レスポンシブ・アクセシビリティ対応

### モバイル最適化
```css
@media (max-width: 768px) {
  :root {
    /* Reduced movement for mobile */
    --move-micro: 0px;      /* 移動なし */
    --move-small: 0.5px;    /* より微細 */
    --move-medium: 1px;     /* 削減 */
    --move-large: 2px;      /* 削減 */
  }
}
```

### 動き削減設定対応
```css
@media (prefers-reduced-motion: reduce) {
  :root {
    /* No movement for motion-sensitive users */
    --move-micro: 0px;
    --move-small: 0px;
    --move-medium: 0px;
    --move-large: 0px;
    
    --duration-fast: 0.01s;     /* ほぼ瞬時 */
    --duration-normal: 0.01s;
    --duration-slow: 0.01s;
  }
  
  /* Disable floating elements completely */
  .floating-element {
    display: none;
  }
}
```

---

## 🚀 実装優先度

### Phase 1: 基本変数・easing統一（必須）
1. CSS変数定義（easing、duration、distance）
2. 統一transitionの適用
3. 基本ホバー効果の穏やか化

### Phase 2: アニメーション穏やか化
1. ボタンホバー効果調整（-2px → -1px, -3px → -2px）
2. カードホバー効果調整（-4px → -2px）
3. フォーカス効果統一化

### Phase 3: 3D浮遊エレメント調整（検討）
1. 振幅削減の実装（25px → 15px等）
2. 速度調整の実装（より遅く）
3. 効果検証・微調整

---

## 🎯 期待される改善効果

### ユーザーエクスペリエンス
- **集中力維持**: 注意を逸らさない背景的効果
- **上品さ向上**: 控えめで洗練されたモーション
- **使いやすさ**: 適度なフィードバック効果
- **包括性**: 動きに敏感なユーザーへの配慮

### 技術的メリット
- **パフォーマンス**: GPU最適化による滑らかな動作
- **保守性**: 統一されたアニメーションシステム
- **拡張性**: 階層化されたインタラクション定義
- **アクセシビリティ**: 包括的な動作設定対応

---

**仕様策定完了**: 2025-07-23 12:10 JST  
**次フェーズ**: Phase 2 実装開始 - NEXUS-I01 .modern-button系統の単色化・洗練