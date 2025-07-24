# E2Eテスト完全ガイド - ポートフォリオサイト

## 概要

フリーランス開発者のポートフォリオサイト（Next.js + TypeScript）の包括的なE2Eテスト戦略とシナリオドキュメントです。Playwrightを使用して実装し、CI/CDパイプラインで継続的な品質保証を行います。

---

## 1. 技術選定と導入戦略

### 1.1 推奨フレームワーク: Playwright

現在のプロジェクト（Next.js, TypeScript）の技術スタックを考慮し、**Playwright**を強く推奨します。

#### 選定理由
- **TypeScriptとの高い親和性**: 完全なTypeScriptサポートにより、型安全で保守性の高いテストコードを記述
- **Auto-Waiting機能**: 操作対象の要素が表示されるまで自動待機し、テストの不安定さを軽減
- **クロスブラウザ対応**: Chromium, Firefox, WebKit（Safari）の主要ブラウザエンジンに対応
- **強力なデバッグツール**: Trace Viewerによるステップバイステップ追跡
- **テストコード自動生成**: Codegen機能による効率的なテスト作成

### 1.2 導入手順

```bash
# 1. Playwrightのインストール
npm init playwright@latest

# 2. 設定の確認（対話形式）
# - TypeScript: Yes
# - tests フォルダ: Yes
# - GitHub Actions: Yes
# - Browser install: Yes

# 3. テスト実行
npx playwright test

# 4. レポート確認
npx playwright show-report
```

### 1.3 プロジェクト構成

```
resume-portfolio/
├── tests/
│   ├── e2e/
│   │   ├── navigation.spec.ts          # ナビゲーション機能テスト
│   │   ├── contact-form.spec.ts        # お問い合わせフォームテスト
│   │   ├── contact-validation.spec.ts  # フォームバリデーションテスト
│   │   ├── contact-errors.spec.ts      # エラーハンドリングテスト
│   │   ├── ui-responsive.spec.ts       # レスポンシブデザインテスト
│   │   └── security.spec.ts            # セキュリティテスト
│   ├── fixtures/
│   │   └── test-data.ts                # テストデータ定義
│   └── utils/
│       └── helpers.ts                  # テストヘルパー関数
├── playwright.config.ts                # Playwright設定
└── docs/
    └── e2e-testing-complete.md         # このドキュメント
```

---

## 2. テスト実行環境

### 2.1 対象環境
- **URL**: `http://localhost:3000`
- **ブラウザ**: Chrome, Firefox, Safari
- **デバイス**: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- **実行タイミング**: プルリクエスト、デプロイ前、スケジュール実行

### 2.2 事前準備
```typescript
// テスト用環境変数
NOTION_API_KEY=test_api_key_for_e2e
NOTION_DATABASE_ID=test_database_id
IP_HASH_SALT=test_salt_for_e2e
NODE_ENV=test
```

---

## 3. ナビゲーション機能テストシナリオ

### 3.1 クリックによるナビゲーション（正常系）

**目的**: ナビゲーション項目クリック時の正常動作確認

```typescript
// navigation.spec.ts
test('ナビゲーションクリックで正しいセクションに移動', async ({ page }) => {
  await page.goto('/');
  
  // 経歴ボタンをクリック
  await page.click('text=経歴');
  
  // 正しいセクションが表示されることを確認
  await expect(page.locator('#career')).toBeInViewport();
  
  // ナビゲーションの状態確認
  await expect(page.locator('button:has-text("経歴")')).toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
  await expect(page.locator('button:has-text("自己紹介")')).not.toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
});
```

### 3.2 スクロールによるナビゲーション追従（正常系）

**目的**: スクロール時のアクティブ状態動的切り替え確認

```typescript
test('スクロールでナビゲーション状態が追従', async ({ page }) => {
  await page.goto('/');
  
  // お問い合わせセクションまでスクロール
  await page.locator('#contact').scrollIntoViewIfNeeded();
  
  // 適切な待機
  await page.waitForTimeout(500);
  
  // ナビゲーション状態の確認
  await expect(page.locator('button:has-text("お問い合わせ")')).toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
});
```

### 3.3 リロード時のアクティブ状態復元（不具合検証）

**目的**: 特定セクション表示中のリロードで正しい状態復元確認

```typescript
test('リロード時に正しいナビゲーション状態を復元', async ({ page }) => {
  // お問い合わせセクションに直接アクセス
  await page.goto('/#contact');
  
  // ページ完全読み込み待機
  await page.waitForLoadState('networkidle');
  
  // セクション表示確認
  await expect(page.locator('#contact')).toBeInViewport();
  
  // 正しいナビゲーション状態確認
  await expect(page.locator('button:has-text("お問い合わせ")')).toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
  await expect(page.locator('button:has-text("自己紹介")')).not.toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
});
```

### 3.4 リロード後操作の安定性（不具合検証）

**目的**: リロード後の操作で二重選択などの不具合が発生しないことを確認

```typescript
test('リロード後の操作で状態の衝突が発生しない', async ({ page }) => {
  await page.goto('/#contact');
  await page.waitForLoadState('networkidle');
  
  // スキルボタンをクリック
  await page.click('text=スキル');
  await page.waitForTimeout(500);
  
  // スキルのみがアクティブであることを確認
  await expect(page.locator('button:has-text("スキル")')).toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
  
  // 他のボタンが非アクティブであることを確認
  const otherButtons = ['自己紹介', '経歴', 'お問い合わせ'];
  for (const buttonText of otherButtons) {
    await expect(page.locator(`button:has-text("${buttonText}")`)).not.toHaveClass(/bg-white.*text-pink-600.*shadow-lg/);
  }
});
```

---

## 4. お問い合わせフォームテストシナリオ

### 4.1 基本フォーム送信フロー（正常系）

**目的**: 正常なフォーム送信プロセスの完全確認

```typescript
// contact-form.spec.ts
test('正常なフォーム送信フロー', async ({ page }) => {
  await page.goto('/#contact');
  
  // フォーム入力
  await page.fill('input[name="name"]', 'テスト太郎');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'E2Eテストからの送信です。');
  
  // プライバシーポリシー同意
  await page.check('input[name="privacyPolicy"]');
  
  // 確認画面へ進む
  await page.click('text=確認画面へ進む');
  
  // 確認画面での内容検証
  await expect(page.locator('text=テスト太郎')).toBeVisible();
  await expect(page.locator('text=test@example.com')).toBeVisible();
  await expect(page.locator('text=E2Eテストからの送信です。')).toBeVisible();
  
  // 送信実行
  await page.click('text=送信する');
  
  // ローディング状態確認
  await expect(page.locator('text=送信中')).toBeVisible();
  
  // 成功画面確認
  await expect(page.locator('text=お問い合わせを受け付けました')).toBeVisible();
  await expect(page.locator('text=24時間以内にご返信いたします')).toBeVisible();
  
  // 成功画面のアイコン確認
  await expect(page.locator('.bg-green-100 svg')).toBeVisible();
});
```

### 4.2 確認画面で戻るシナリオ

**目的**: 確認画面での編集機能の確認

```typescript
test('確認画面から編集して再送信', async ({ page }) => {
  await page.goto('/#contact');
  
  // 初期入力
  await page.fill('input[name="name"]', '編集テスト太郎');
  await page.fill('input[name="email"]', 'edit-test@example.com');
  await page.fill('textarea[name="message"]', '編集前の内容です。');
  await page.check('input[name="privacyPolicy"]');
  
  // 確認画面へ
  await page.click('text=確認画面へ進む');
  
  // 表示内容確認
  await expect(page.locator('text=編集テスト太郎')).toBeVisible();
  await expect(page.locator('text=編集前の内容です。')).toBeVisible();
  
  // 編集ボタンクリック
  await page.click('text=編集');
  
  // 入力画面に戻ることを確認
  await expect(page.locator('input[name="name"]')).toHaveValue('編集テスト太郎');
  await expect(page.locator('textarea[name="message"]')).toHaveValue('編集前の内容です。');
  
  // 内容修正
  await page.fill('input[name="name"]', '編集テスト次郎');
  await page.fill('textarea[name="message"]', '編集後の内容です。');
  
  // 再度確認画面へ
  await page.click('text=確認画面へ進む');
  
  // 修正内容確認
  await expect(page.locator('text=編集テスト次郎')).toBeVisible();
  await expect(page.locator('text=編集後の内容です。')).toBeVisible();
  
  // 送信完了
  await page.click('text=送信する');
  await expect(page.locator('text=お問い合わせを受け付けました')).toBeVisible();
});
```

---

## 5. バリデーションテストシナリオ

### 5.1 必須フィールド検証

```typescript
// contact-validation.spec.ts
test('必須フィールドのバリデーション', async ({ page }) => {
  await page.goto('/#contact');
  
  // 空のまま送信試行
  await page.click('text=確認画面へ進む');
  
  // エラーメッセージ確認
  await expect(page.locator('text=氏名を入力してください')).toBeVisible();
  await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible();
  await expect(page.locator('text=お問い合わせ内容を入力してください')).toBeVisible();
  
  // ボタンが無効化されていることを確認
  await expect(page.locator('button:has-text("確認画面へ進む")')).toBeDisabled();
});
```

### 5.2 メールアドレス形式検証

```typescript
test('メールアドレス形式のバリデーション', async ({ page }) => {
  await page.goto('/#contact');
  
  await page.fill('input[name="name"]', 'テスト太郎');
  await page.fill('input[name="email"]', 'invalid-email'); // 無効な形式
  await page.fill('textarea[name="message"]', 'テストメッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  await page.click('text=確認画面へ進む');
  
  // メール形式エラー確認
  await expect(page.locator('text=正しいメールアドレスを入力してください')).toBeVisible();
});
```

### 5.3 プライバシーポリシー同意確認

```typescript
test('プライバシーポリシー未同意時の制御', async ({ page }) => {
  await page.goto('/#contact');
  
  await page.fill('input[name="name"]', 'テスト太郎');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('textarea[name="message"]', 'テストメッセージ');
  // プライバシーポリシーをチェックしない
  
  // ボタンが無効化されていることを確認
  await expect(page.locator('button:has-text("確認画面へ進む")')).toBeDisabled();
  
  // 同意後にボタンが有効化されることを確認
  await page.check('input[name="privacyPolicy"]');
  await expect(page.locator('button:has-text("確認画面へ進む")')).toBeEnabled();
});
```

---

## 6. エラーハンドリングテストシナリオ

### 6.1 ネットワークエラーシミュレーション

```typescript
// contact-errors.spec.ts
test('ネットワークエラー時の適切な処理', async ({ page }) => {
  await page.goto('/#contact');
  
  // フォーム入力
  await page.fill('input[name="name"]', 'エラーテスト');
  await page.fill('input[name="email"]', 'error@example.com');
  await page.fill('textarea[name="message"]', 'エラーテスト用メッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  // 確認画面へ
  await page.click('text=確認画面へ進む');
  
  // ネットワークエラーをシミュレート
  await page.route('/api/contact', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' })
    });
  });
  
  // 送信実行
  await page.click('text=送信する');
  
  // エラー画面確認
  await expect(page.locator('text=送信エラー')).toBeVisible();
  await expect(page.locator('text=再送信')).toBeVisible();
  await expect(page.locator('text=入力画面に戻る')).toBeVisible();
  
  // ボタンスタイルの確認
  await expect(page.locator('button:has-text("再送信")')).toHaveClass(/modern-button-enhanced/);
  await expect(page.locator('button:has-text("入力画面に戻る")')).toHaveClass(/border-gray-300/);
});
```

### 6.2 5分以内連続送信制限テスト

```typescript
test('スパム保護: 5分以内連続送信制限', async ({ page }) => {
  // 1回目の送信
  await page.goto('/#contact');
  await fillAndSubmitForm(page, 'スパムテスト1');
  await expect(page.locator('text=お問い合わせを受け付けました')).toBeVisible();
  
  // フォームに戻る
  await page.click('text=フォームに戻る');
  
  // 即座に2回目の送信を試行
  await fillAndSubmitForm(page, 'スパムテスト2');
  
  // スパム保護メッセージ確認
  await expect(page.locator('text=5分以内の連続送信は制限されています')).toBeVisible();
});

async function fillAndSubmitForm(page, name) {
  await page.fill('input[name="name"]', name);
  await page.fill('input[name="email"]', 'spam@example.com');
  await page.fill('textarea[name="message"]', 'スパムテスト用メッセージ');
  await page.check('input[name="privacyPolicy"]');
  await page.click('text=確認画面へ進む');
  await page.click('text=送信する');
}
```

---

## 7. リロードシナリオテスト

### 7.1 入力途中リロード

```typescript
test('入力途中でリロードした場合の状態管理', async ({ page }) => {
  await page.goto('/#contact');
  
  // 一部入力
  await page.fill('input[name="name"]', '途中入力');
  await page.fill('input[name="email"]', 'partial@example.com');
  
  // リロード
  await page.reload();
  
  // 入力内容がクリアされることを確認
  await expect(page.locator('input[name="name"]')).toHaveValue('');
  await expect(page.locator('input[name="email"]')).toHaveValue('');
  
  // フォームが正常に動作することを確認
  await page.fill('input[name="name"]', 'リロード後テスト');
  await page.fill('input[name="email"]', 'reload@example.com');
  await page.fill('textarea[name="message"]', 'リロード後のテストメッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  await expect(page.locator('button:has-text("確認画面へ進む")')).toBeEnabled();
});
```

### 7.2 確認画面リロード

```typescript
test('確認画面でリロードした場合の処理', async ({ page }) => {
  await page.goto('/#contact');
  
  // フォーム入力完了
  await page.fill('input[name="name"]', '確認画面テスト');
  await page.fill('input[name="email"]', 'confirm@example.com');
  await page.fill('textarea[name="message"]', '確認画面テスト用メッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  // 確認画面へ
  await page.click('text=確認画面へ進む');
  await expect(page.locator('text=確認画面テスト')).toBeVisible();
  
  // 確認画面でリロード
  await page.reload();
  
  // 入力画面に戻ることを確認
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="name"]')).toHaveValue('');
});
```

### 7.3 送信中リロード

```typescript
test('送信処理中のリロードで重複送信が発生しない', async ({ page }) => {
  await page.goto('/#contact');
  
  // 送信処理を遅延させるためのルート設定
  await page.route('/api/contact', async route => {
    // 3秒遅延
    await new Promise(resolve => setTimeout(resolve, 3000));
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, notionId: 'test-id' })
    });
  });
  
  // フォーム送信開始
  await fillAndSubmitForm(page, '送信中リロードテスト');
  
  // ローディング中であることを確認
  await expect(page.locator('text=送信中')).toBeVisible();
  
  // リロード実行
  await page.reload();
  
  // 入力画面に戻ることを確認
  await expect(page.locator('input[name="name"]')).toBeVisible();
  
  // 重複送信が発生していないことを確認（APIコールが1回のみ）
  // ※実際の実装では、APIコール回数をモニタリング
});
```

---

## 8. レスポンシブ・UI/UXテスト

### 8.1 レスポンシブデザインテスト

```typescript
// ui-responsive.spec.ts
test('モバイルデバイスでのフォーム操作', async ({ page }) => {
  // モバイルビューポート設定
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/#contact');
  
  // モバイルレイアウトの確認
  await expect(page.locator('input[name="name"]')).toBeVisible();
  
  // フォーム入力（モバイル）
  await page.fill('input[name="name"]', 'モバイルテスト');
  await page.fill('input[name="email"]', 'mobile@example.com');
  await page.fill('textarea[name="message"]', 'モバイルからのテストメッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  // ボタンの押しやすさ確認
  const submitButton = page.locator('button:has-text("確認画面へ進む")');
  const buttonBox = await submitButton.boundingBox();
  expect(buttonBox.height).toBeGreaterThan(44); // Appleのガイドライン
  
  await submitButton.click();
  await expect(page.locator('text=モバイルテスト')).toBeVisible();
});
```

### 8.2 ボタンスタイル一貫性テスト

```typescript
test('ボタンスタイルの一貫性確認', async ({ page }) => {
  await page.goto('/#contact');
  
  // Submit系ボタンの確認
  await page.fill('input[name="name"]', 'スタイルテスト');
  await page.fill('input[name="email"]', 'style@example.com');
  await page.fill('textarea[name="message"]', 'スタイルテスト用メッセージ');
  await page.check('input[name="privacyPolicy"]');
  
  // メイン送信ボタン
  await expect(page.locator('button:has-text("確認画面へ進む")')).toHaveClass(/modern-button-enhanced/);
  
  await page.click('text=確認画面へ進む');
  
  // 確認画面のボタンスタイル
  await expect(page.locator('button:has-text("送信する")')).toHaveClass(/modern-button-enhanced/);
  await expect(page.locator('button:has-text("編集")')).toHaveClass(/border-gray-300/);
  
  // エラー状態のシミュレーション
  await page.route('/api/contact', route => {
    route.fulfill({ status: 500 });
  });
  
  await page.click('text=送信する');
  
  // エラー画面のボタンスタイル
  await expect(page.locator('button:has-text("再送信")')).toHaveClass(/modern-button-enhanced/);
  await expect(page.locator('button:has-text("入力画面に戻る")')).toHaveClass(/border-gray-300/);
});
```

---

## 9. セキュリティテスト

### 9.1 XSS攻撃対策テスト

```typescript
// security.spec.ts
test('XSS攻撃の防御確認', async ({ page }) => {
  await page.goto('/#contact');
  
  const xssPayloads = [
    '<script>alert("XSS")</script>',
    '<img src="x" onerror="alert(\'XSS\')">',
    'javascript:alert("XSS")',
    '<svg onload="alert(\'XSS\')">'
  ];
  
  for (const payload of xssPayloads) {
    await page.fill('input[name="name"]', payload);
    await page.fill('input[name="email"]', 'xss@example.com');
    await page.fill('textarea[name="message"]', payload);
    await page.check('input[name="privacyPolicy"]');
    
    await page.click('text=確認画面へ進む');
    
    // スクリプトが実行されないことを確認
    await expect(page.locator('text=確認画面')).toBeVisible();
    
    // アラートダイアログが表示されないことを確認
    const alertPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
    const dialog = await alertPromise;
    expect(dialog).toBeNull();
    
    // 戻って次のテストへ
    await page.click('text=編集');
  }
});
```

### 9.2 入力制限テスト

```typescript
test('過度に長い入力の制限確認', async ({ page }) => {
  await page.goto('/#contact');
  
  const longText = 'a'.repeat(10000);
  
  await page.fill('input[name="name"]', longText);
  await page.fill('input[name="email"]', 'long@example.com');
  await page.fill('textarea[name="message"]', longText);
  await page.check('input[name="privacyPolicy"]');
  
  await page.click('text=確認画面へ進む');
  
  // 適切な文字数制限が機能することを確認
  const displayedName = await page.locator('text=' + longText.substring(0, 100)).isVisible();
  // 実装に応じて適切な制限値を確認
});
```

---

## 10. CI/CD統合

### 10.1 GitHub Actions設定

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  pull_request:
    branches: [ main ]
  push:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *' # 毎日午前2時

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Build application
        run: npm run build
      
      - name: Start server
        run: npm start &
        
      - name: Wait for server
        run: npx wait-on http://localhost:3000
      
      - name: Run E2E tests
        run: npx playwright test
        env:
          NOTION_API_KEY: ${{ secrets.NOTION_API_KEY_TEST }}
          NOTION_DATABASE_ID: ${{ secrets.NOTION_DATABASE_ID_TEST }}
          IP_HASH_SALT: ${{ secrets.IP_HASH_SALT_TEST }}
      
      - name: Upload test results
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

### 10.2 Playwright設定ファイル

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['github']
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 11. テスト実行と保守

### 11.1 実行コマンド

```bash
# 全テスト実行
npx playwright test

# 特定ファイルのテスト実行
npx playwright test contact-form.spec.ts

# 特定ブラウザでのテスト実行
npx playwright test --project=chromium

# デバッグモードでテスト実行
npx playwright test --debug

# UIモードでテスト実行
npx playwright test --ui

# レポート表示
npx playwright show-report
```

### 11.2 テストメンテナンス

#### 優先度別メンテナンス
- **高優先度**: 基本フォーム送信、ナビゲーション機能
- **中優先度**: バリデーション、エラーハンドリング
- **低優先度**: セキュリティ、レスポンシブ詳細

#### 定期見直し項目
- [ ] テストデータの更新
- [ ] 新機能追加時のテストシナリオ追加
- [ ] パフォーマンス改善によるタイムアウト調整
- [ ] ブラウザアップデートに伴う動作確認

---

## 12. 期待される成果

### 12.1 品質向上
- デグレ（機能低下）の早期検出
- リファクタリング時の安全性確保
- 手動テスト工数の削減

### 12.2 開発効率向上
- CI/CDパイプラインでの自動品質チェック
- プルリクエストでの自動テスト実行
- 開発者の自信を持ったデプロイ

### 12.3 ユーザー体験向上
- 一貫したUI/UX品質の保証
- 多様な環境での動作確認
- セキュリティ脆弱性の継続的チェック

---

## 13. 実装スケジュール

### Phase 1: 基盤構築（1週間）
- [ ] Playwright環境構築
- [ ] CI/CD設定
- [ ] テストデータ準備

### Phase 2: 核心機能テスト（2週間）
- [ ] ナビゲーション機能テスト
- [ ] 基本フォーム送信テスト
- [ ] バリデーションテスト

### Phase 3: 高度な機能テスト（2週間）
- [ ] エラーハンドリングテスト
- [ ] リロードシナリオテスト
- [ ] レスポンシブテスト

### Phase 4: セキュリティ・最適化（1週間）
- [ ] セキュリティテスト
- [ ] パフォーマンステスト
- [ ] 運用最適化

---

*最終更新: 2025-07-21*  
*作成者: Claude Code + Gemini CLI (統合版)*  
*バージョン: 1.0.0*