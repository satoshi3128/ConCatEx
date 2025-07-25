# E2Eテストシナリオ - お問い合わせフォーム

## 概要

お問い合わせフォームの完全な動作確認を行うE2Eテストシナリオです。Playwrightを使用して実装予定。

## テスト環境

- **ブラウザ**: Chrome, Firefox, Safari
- **デバイス**: Desktop, Mobile
- **テストツール**: Playwright
- **対象URL**: `http://localhost:3000/#contact`

---

## 1. 基本フォーム送信フロー

**目的**: 正常なフォーム送信プロセスの確認

### ステップ
1. お問い合わせセクション（`#contact`）に移動
2. 必須フィールドを入力
   - 氏名: `テスト太郎`
   - メールアドレス: `test@example.com`
   - お問い合わせ内容: `E2Eテストからの送信です。`
3. プライバシーポリシー同意チェックボックスをチェック
4. 「確認画面へ進む」ボタンをクリック
5. 確認画面で入力内容を検証
6. 「送信する」ボタンをクリック
7. ローディング状態の確認
8. 成功画面の表示確認
   - 緑色のチェックアイコン
   - 「お問い合わせを受け付けました」メッセージ
   - 「24時間以内にご返信いたします」メッセージ
9. 「フォームに戻る」ボタンの動作確認

### 期待結果
- フォーム送信が正常に完了する
- 各画面遷移がスムーズに行われる
- 成功画面が適切に表示される

---

## 2. バリデーションテスト

**目的**: 入力検証機能の確認

### 2.1 必須フィールド検証

#### ステップ
1. お問い合わせフォームに移動
2. 空のまま「確認画面へ進む」をクリック
3. エラーメッセージの表示確認

#### 期待結果
- 必須フィールドのエラーメッセージが表示される
- 送信ボタンが無効化される

### 2.2 メールアドレス形式検証

#### ステップ
1. 氏名とお問い合わせ内容を入力
2. 無効なメールアドレスを入力: `invalid-email`
3. 確認画面への進行を試行

#### 期待結果
- メールアドレス形式エラーが表示される
- 確認画面に進めない

### 2.3 プライバシーポリシー同意検証

#### ステップ
1. 全フィールドを正しく入力
2. プライバシーポリシー未チェックで送信試行

#### 期待結果
- 送信ボタンが無効化される
- 適切なメッセージが表示される

---

## 3. エラー処理テスト

**目的**: ネットワークエラーやサーバーエラーの処理確認

### 3.1 ネットワークエラーシミュレーション

#### ステップ
1. 正常にフォーム入力完了
2. 確認画面で送信ボタンクリック
3. ネットワークを無効化またはAPIエラーをシミュレート
4. エラー画面の表示確認
5. 「再送信」ボタンの動作確認
6. 「入力画面に戻る」ボタンの動作確認

#### 期待結果
- エラー画面が適切に表示される
- 再送信機能が正常に動作する
- 入力画面への復帰が正常に行われる

---

## 4. 5分以内の連続実行シナリオ（スパム保護テスト）

**目的**: スパム保護機能の確認

### ステップ
1. 正常なフォーム送信を完了
2. 成功画面から「フォームに戻る」をクリック
3. 同じ内容で即座に再送信を試行
4. スパム保護による制限メッセージの確認
   - 「5分以内の連続送信は制限されています」等
5. 5分間待機（またはテスト用にタイムスタンプを調整）
6. 再度送信が可能になることを確認

### 期待結果
- 連続送信が適切に制限される
- 制限時間経過後は再度送信可能になる
- ユーザーフレンドリーなエラーメッセージが表示される

---

## 5. 確認画面で戻るシナリオ

**目的**: 確認画面での編集機能の確認

### ステップ
1. フォームに全項目を入力
   - 氏名: `編集テスト太郎`
   - メール: `edit-test@example.com`
   - 内容: `編集前の内容です。`
2. 確認画面へ進む
3. 表示内容が入力内容と完全に一致することを確認
4. 「編集」ボタンをクリック
5. 入力画面に戻ることを確認
6. 入力内容が全て保持されていることを確認
7. 内容を修正
   - 氏名: `編集テスト次郎`
   - 内容: `編集後の内容です。`
8. 再度確認画面へ進む
9. 修正内容が正しく反映されていることを確認
10. 送信まで完了

### 期待結果
- 確認画面の表示内容が入力内容と一致する
- 編集ボタンで入力画面に戻れる
- 入力内容が保持される
- 修正内容が確認画面に反映される

---

## 6. 途中でリロードするシナリオ

**目的**: ページリロード時の状態管理確認

### 6.1 入力途中リロード

#### ステップ
1. フォームに一部入力（氏名とメールのみ）
2. ページをリロード（F5 または ⌘+R）
3. 入力内容がクリアされることを確認
4. 再度全項目を入力してフロー完了

#### 期待結果
- リロード後、フォームが初期状態に戻る
- 部分入力データが残らない

### 6.2 確認画面リロード

#### ステップ
1. フォーム入力を完了
2. 確認画面に遷移
3. 確認画面でページをリロード
4. 入力画面に戻ることを確認
5. データが失われていることを確認

#### 期待結果
- 確認画面リロード後は入力画面に戻る
- 一時的なデータは保持されない
- エラーが発生しない

### 6.3 送信中リロード

#### ステップ
1. フォーム送信処理を開始
2. ローディング中にページをリロード
3. 送信が中断されることを確認
4. 重複送信が発生しないことを確認
5. 再度フォーム入力から開始して完了

#### 期待結果
- 送信処理が適切に中断される
- 重複送信が発生しない
- データの整合性が保たれる

---

## 7. UI/UXテスト

**目的**: ユーザーインターフェースと体験の品質確認

### 7.1 レスポンシブデザイン

#### ステップ
1. デスクトップサイズでフォーム操作
2. タブレットサイズに変更して操作確認
3. モバイルサイズで全フロー実行

#### 期待結果
- 全デバイスサイズで適切に表示される
- ボタンが押しやすいサイズで配置される
- テキストが読みやすく表示される

### 7.2 ローディング状態

#### ステップ
1. 送信ボタンクリック後のローディング表示確認
2. スピナーアニメーションの動作確認
3. ボタンの無効化状態確認

#### 期待結果
- ローディング中は適切な表示がされる
- 二重送信が防止される
- ユーザーに処理中であることが明確に伝わる

### 7.3 ボタンスタイル一貫性

#### ステップ
1. 各画面のボタンスタイルを確認
   - Submit系: ブルー（modern-button-enhanced）
   - キャンセル系: グレー枠（border border-gray-300）
2. ホバー効果の確認
3. フォーカス状態の確認

#### 期待結果
- ボタンスタイルが一貫している
- 視覚的階層が明確
- アクセシビリティに配慮された状態表示

### 7.4 ナビゲーション連携

#### ステップ
1. フォーム送信完了後のナビゲーション状態確認
2. 成功画面からのプロフィール・経歴リンク動作確認
3. ナビゲーションバーでの「お問い合わせ」ハイライト確認

#### 期待結果
- ナビゲーションが正しい位置を示す
- リンクが適切に動作する
- 視覚的フィードバックが一貫している

---

## 8. セキュリティテスト

**目的**: セキュリティ脆弱性の確認

### 8.1 XSS攻撃対策

#### ステップ
1. スクリプトタグを含む入力: `<script>alert('XSS')</script>`
2. HTMLタグを含む入力: `<img src="x" onerror="alert('XSS')">`
3. 送信後の表示確認

#### 期待結果
- スクリプトが実行されない
- HTMLタグが適切にエスケープまたは除去される
- セキュリティが保持される

### 8.2 入力制限テスト

#### ステップ
1. 過度に長い文字列の入力（10,000文字以上）
2. 特殊文字の組み合わせ入力
3. 異なる文字エンコーディングのテスト

#### 期待結果
- 適切な文字数制限が機能する
- 特殊文字が正しく処理される
- システムが安定して動作する

---

## 実行優先度

### 高優先度（Critical）
1. 基本フォーム送信フロー
2. バリデーションテスト
3. 確認画面で戻るシナリオ

### 中優先度（Important）
4. エラー処理テスト
5. 途中でリロードするシナリオ
6. UI/UXテスト（レスポンシブ、ローディング）

### 低優先度（Nice to have）
7. 5分以内の連続実行シナリオ
8. セキュリティテスト
9. UI/UXテスト（詳細項目）

---

## 実装メモ

### 事前準備
- Notion API の テスト用データベース設定
- スパム保護のテスト用設定
- ネットワークエラーシミュレーション環境

### テストデータ
```javascript
const testData = {
  valid: {
    name: 'テスト太郎',
    email: 'test@example.com',
    message: 'E2Eテストからの送信です。'
  },
  invalid: {
    email: 'invalid-email',
    xss: '<script>alert("XSS")</script>',
    longText: 'a'.repeat(10000)
  }
};
```

### 期待される成果物
- Playwright テストスイート
- CI/CD パイプラインでの自動実行
- テスト結果レポート
- スクリーンショット/動画での証跡

---

*最終更新: 2025-07-21*
*作成者: Claude Code*