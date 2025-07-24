# NEXUS ガラスモーフィズム軽量化仕様

**作成日**: 2025-07-23 11:50 JST  
**目的**: `.glass-morphism`未定義変数の適切な定義・軽量化  
**設計方針**: 上品で控えめ、パフォーマンス重視

---

## 🎯 設計目標

### 主要目標
1. **軽量化**: 重いblur効果の最適化
2. **上品さ**: 控えめで洗練された透明感
3. **統一性**: 既存CSS変数システムとの整合性
4. **パフォーマンス**: レンダリング負荷軽減

### 技術要件
- CSS変数による管理
- モバイルデバイス対応
- ダークモード対応
- アクセシビリティ考慮

---

## 🔍 現状分析

### 現在の`.glass-morphism`問題点
```css
.glass-morphism {
  background: var(--effect-glass-background);    /* ❌ 未定義 */
  backdrop-filter: var(--effect-glass-backdrop); /* ❌ 未定義 */
  border: 1px solid var(--effect-glass-border);  /* ❌ 未定義 */
  border-radius: 1rem;
  box-shadow: var(--effect-shadow-medium);       /* ✅ 既存変数 */
}
```

### 参考：既存の軽量実装
```css
.modern-card-mini {
  backdrop-filter: blur(8px);                    /* ✅ 適度な重さ */
  background: var(--color-surface);
  border: 1px solid var(--color-border);
}
```

---

## 📐 新CSS変数定義仕様

### 1. ガラス背景効果変数
```css
/* Light Mode */
:root {
  --effect-glass-background: rgba(255, 255, 255, 0.85);
  --effect-glass-background-subtle: rgba(255, 255, 255, 0.75);
  --effect-glass-background-strong: rgba(255, 255, 255, 0.95);
}

/* Dark Mode */
[data-theme="dark"] {
  --effect-glass-background: rgba(45, 45, 45, 0.85);
  --effect-glass-background-subtle: rgba(45, 45, 45, 0.75);
  --effect-glass-background-strong: rgba(45, 45, 45, 0.95);
}
```

**設計根拠**:
- `0.85` 基本値：適度な透明感と視認性のバランス
- `0.75` subtle：より控えめな効果が必要な場合
- `0.95` strong：しっかりとした背景が必要な場合

### 2. ガラスブラー効果変数
```css
/* Performance-optimized blur values */
:root {
  --effect-glass-backdrop: blur(6px) saturate(150%);
  --effect-glass-backdrop-subtle: blur(4px) saturate(120%);
  --effect-glass-backdrop-strong: blur(10px) saturate(180%);
}
```

**設計根拠**:
- `blur(6px)` 基本値：軽量でありながら効果的
- `saturate()` 追加：色の深みを演出
- モバイル考慮：重すぎないblur値

### 3. ガラスボーダー効果変数
```css
/* Light Mode */
:root {
  --effect-glass-border: rgba(255, 255, 255, 0.25);
  --effect-glass-border-subtle: rgba(255, 255, 255, 0.15);
  --effect-glass-border-strong: rgba(255, 255, 255, 0.4);
}

/* Dark Mode */
[data-theme="dark"] {
  --effect-glass-border: rgba(255, 255, 255, 0.15);
  --effect-glass-border-subtle: rgba(255, 255, 255, 0.08);
  --effect-glass-border-strong: rgba(255, 255, 255, 0.25);
}
```

**設計根拠**:
- ライトモード：より明確なボーダー
- ダークモード：控えめなボーダー
- 3段階の強度設定

---

## 🎨 ガラスモーフィズムクラス体系

### 1. 基本ガラス効果 (`.glass-morphism`)
```css
.glass-morphism {
  background: var(--effect-glass-background);
  backdrop-filter: var(--effect-glass-backdrop);
  border: 1px solid var(--effect-glass-border);
  border-radius: 1rem;
  box-shadow: var(--effect-shadow-medium);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 2. 控えめガラス効果 (`.glass-morphism-subtle`)
```css
.glass-morphism-subtle {
  background: var(--effect-glass-background-subtle);
  backdrop-filter: var(--effect-glass-backdrop-subtle);
  border: 1px solid var(--effect-glass-border-subtle);
  border-radius: 0.75rem;
  box-shadow: var(--effect-shadow-soft);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 3. 強調ガラス効果 (`.glass-morphism-strong`)
```css
.glass-morphism-strong {
  background: var(--effect-glass-background-strong);
  backdrop-filter: var(--effect-glass-backdrop-strong);
  border: 1px solid var(--effect-glass-border-strong);
  border-radius: 1.25rem;
  box-shadow: var(--effect-shadow-large);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 🎭 インタラクション効果仕様

### ホバー効果
```css
.glass-morphism:hover {
  background: var(--effect-glass-background-strong);
  backdrop-filter: var(--effect-glass-backdrop-strong);
  border-color: var(--effect-glass-border-strong);
  transform: translateY(-1px);                    /* 穏やか */
  box-shadow: var(--effect-shadow-large);
}

.glass-morphism-subtle:hover {
  background: var(--effect-glass-background);
  backdrop-filter: var(--effect-glass-backdrop);
  border-color: var(--effect-glass-border);
  /* transform無し：より控えめ */
  box-shadow: var(--effect-shadow-medium);
}
```

### フォーカス効果
```css
.glass-morphism:focus-visible {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: var(--effect-shadow-focus), var(--effect-shadow-medium);
}
```

---

## 📱 レスポンシブ最適化

### モバイル用軽量化
```css
@media (max-width: 768px) {
  .glass-morphism,
  .glass-morphism-subtle,
  .glass-morphism-strong {
    backdrop-filter: blur(4px) saturate(120%);   /* より軽量 */
  }
  
  .glass-morphism-strong {
    backdrop-filter: blur(6px) saturate(140%);   /* 強調版も軽量化 */
  }
}
```

### 動き削減設定対応
```css
@media (prefers-reduced-motion: reduce) {
  .glass-morphism,
  .glass-morphism-subtle,
  .glass-morphism-strong {
    transition: none;
    backdrop-filter: none;                        /* 動きに敏感な場合 */
  }
}
```

---

## 🚀 パフォーマンス考慮事項

### 最適化戦略
1. **blur値制限**: 最大10px、基本6px以下
2. **レイヤー最適化**: `will-change: transform` 必要時のみ
3. **GPU最適化**: `transform3d(0,0,0)` 活用
4. **条件付き適用**: モバイルでの軽量化

### パフォーマンス測定指標
- **First Paint**: blur効果による遅延最小化
- **Composite Layers**: 不要なレイヤー作成回避
- **CPU Usage**: backdrop-filter負荷軽減

---

## 🎯 実装優先度

### Phase 1: 基本変数定義（必須）
1. `--effect-glass-background` 系統
2. `--effect-glass-backdrop` 系統  
3. `--effect-glass-border` 系統

### Phase 2: クラス体系実装
1. `.glass-morphism` 基本実装
2. `.glass-morphism-subtle` 控えめ版
3. `.glass-morphism-strong` 強調版

### Phase 3: 最適化（推奨）
1. レスポンシブ対応
2. アクセシビリティ対応
3. パフォーマンス測定・調整

---

## 🧪 テスト計画

### 視覚テスト
- [ ] ライトモードでの視認性
- [ ] ダークモードでの視認性
- [ ] 各デバイスサイズでの表示
- [ ] ホバー・フォーカス効果

### パフォーマンステスト
- [ ] レンダリング時間測定
- [ ] CPU使用率確認
- [ ] モバイルデバイステスト
- [ ] 低スペックデバイステスト

### アクセシビリティテスト
- [ ] コントラスト比確認
- [ ] キーボード操作
- [ ] スクリーンリーダー対応
- [ ] 動き削減設定対応

---

## 📊 期待される効果

### ユーザーエクスペリエンス
- **視覚的統一感**: ガラス効果の一貫した適用
- **上品さ向上**: 控えめで洗練された透明感
- **レスポンシブ対応**: 全デバイスでの最適な表示

### 技術的メリット
- **パフォーマンス**: 軽量化による高速レンダリング
- **保守性**: CSS変数による統一管理
- **拡張性**: 3段階の強度設定による柔軟性
- **アクセシビリティ**: 包括的な配慮

---

**仕様策定完了**: 2025-07-23 12:00 JST  
**次フェーズ**: NEXUS-D03 アニメーション穏やか化・統一性確保仕様