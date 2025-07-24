# 🛠️ Notion API設定完全ガイド - Concat

**作成日**: 2025年7月20日  
**更新日**: 2025年7月20日  
**対象機能**: お問い合わせフォーム + ロギング機能  
**所要時間**: 約15分

---

## 🎯 設定完了で実現される機能

✅ **お問い合わせフォーム** → Notionに自動保存  
✅ **スパム対策** → 無料の多層防御システム  
✅ **ログ監視** → アクセス・エラー・パフォーマンスログ  
✅ **管理効率化** → Notionでの一元管理

---

## 📋 必要な環境変数（コピー用）

### 完成形 `.env.local`
```bash
# Notion API設定
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=236bfa2ace858041ab2ff15df412803a

# セキュリティ設定  
IP_HASH_SALT=concat-2025-random-security-salt-key

# 環境設定
NODE_ENV=development
```

### 本番環境用（Vercel）
```bash
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=236bfa2ace858041ab2ff15df412803a
IP_HASH_SALT=concat-2025-random-security-salt-key
NODE_ENV=production
```

---

## 📝 Notion API設定手順

### ステップ1: Notion Integration作成 ⭐

#### 1-1. 開発者ページアクセス
🔗 **リンク**: https://www.notion.so/my-integrations

#### 1-2. 新しいIntegration作成
1. **「New integration」ボタンをクリック**
2. **基本情報を入力**:
   ```
   ✅ Name: Concat Contact Form
   ✅ Associated workspace: [あなたのワークスペース]  
   ✅ Type: Internal integration
   ```
3. **「Submit」で作成完了**

#### 1-3. API Key取得 🔑
1. **作成されたIntegrationページで「内部インテグレーションシークレット」を探す**
2. **`ntn_` で始まる長い文字列をコピー**
   - ✅ 正しい例: `ntn_514417496374tT8v72rraa1YRis2BNd4IKXY...` (約50文字)
   - ❌ 旧形式: `secret_1234...` (現在は廃止済み)

### ステップ2: Notionデータベース作成 📊

#### 2-1. 新しいページ作成
1. **Notionで「新規ページ」をクリック**
2. **ページ名**: `お問い合わせ管理` と入力

#### 2-2. データベース追加
1. **ページ内で `/database` と入力**
2. **「データベース - フルページ」を選択**

#### 2-3. プロパティ設定（重要）🎯
**既存の「名前」列はそのまま残し、以下を追加**:

| 順番 | プロパティ名 | 型 | 設定内容 |
|-----|-------------|-----|---------|
| 1 | 名前 | Title | ✅ 既存のまま |
| 2 | メールアドレス | Email | ➕ 新規追加 |
| 3 | メッセージ | Text | ➕ 新規追加 |
| 4 | スパムスコア | Number | ➕ 新規追加 |
| 5 | ステータス | Select | ➕ 新規追加（選択肢: 未対応/対応中/完了） |
| 6 | 送信日時 | Date | ➕ 新規追加 |

#### 2-4. ステータス選択肢の詳細設定
**「ステータス」プロパティ作成時**:
- 選択肢1: `未対応` (赤色推奨)
- 選択肢2: `対応中` (黄色推奨)  
- 選択肢3: `完了` (緑色推奨)

### ステップ3: Integration接続 🔗

#### 3-1. データベースにIntegrationを接続
1. **お問い合わせ管理データベースのページで「...」（3点メニュー）をクリック**
2. **「Add connections」または「接続を追加」を選択**
3. **「Concat Contact Form」（作成したIntegration）を選択して追加**

#### 3-2. 接続確認
✅ **成功時**: Integration設定画面に「お問い合わせ管理」が表示される

### ステップ4: Database ID取得 🔑

#### 4-1. URLからDatabase IDを抽出
1. **お問い合わせ管理データベースのページを開く**
2. **ブラウザのアドレスバーのURLをコピー**

#### 4-2. Database ID特定方法
**URLの例**:
```
https://www.notion.so/236bfa2ace858041ab2ff15df412803a?v=236bfa2ace8580b7a1d0000c5852db33
```

**Database ID**: `236bfa2ace858041ab2ff15df412803a`
- **取得方法**: `/` の直後から `?` までの32文字
- **あなたの場合**: すでに特定済み → `236bfa2ace858041ab2ff15df412803a`

---

## ⚙️ 環境変数ファイル設定

### ローカル開発用: `.env.local`
```bash
# Notion API
NOTION_API_KEY=ntn_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# セキュリティ
IP_HASH_SALT=concat-dev-salt-2025-random-string

# 開発環境
NODE_ENV=development
```

### 本番環境（Vercel）
Vercel Dashboard → Settings → Environment Variables:

| Name | Value | Environment |
|------|-------|------------|
| `NOTION_API_KEY` | `secret_xxx...` | Production |
| `NOTION_DATABASE_ID` | `xxx...` | Production |
| `IP_HASH_SALT` | `random-string` | Production |
| `NODE_ENV` | `production` | Production |

---

## 🔒 セキュリティ考慮事項

### 1. API Key管理
- ✅ **`.env.local` をgitignoreに追加済み**
- ✅ **API Keyをコードに直接記述しない**
- ⚠️ **本番環境でのみ本番用API Key使用**

### 2. IP匿名化Salt
```bash
# 推奨: ランダムな文字列を生成
IP_HASH_SALT=$(openssl rand -base64 32)

# 例
IP_HASH_SALT=qP8xJ9mN2vR5tK7dL3fH8qW1eY6uI4oP9aS2dF5gH8j
```

### 3. Notion権限設定
- Integration権限は必要最小限に設定
- データベースアクセスのみ許可
- 定期的なAPI Key更新を推奨

---

## 🧪 接続テスト

### 開発サーバーでのテスト
```bash
# 開発サーバー起動
npm run dev

# テスト用お問い合わせ送信
# → ログでNotion接続成功を確認
```

### ログ確認ポイント
```bash
# 正常な場合
[INFO] contact: Notion connection test successful
[INFO] contact: Contact form submission started  
[INFO] contact: Successfully saved to Notion

# エラーの場合
[ERROR] contact: Notion configuration invalid
[ERROR] contact: Failed to save to Notion
```

---

## 🔧 トラブルシューティング

### よくあるエラーと解決法

#### 1. `NOTION_API_KEY is not configured`
**原因**: 環境変数が設定されていない  
**解決**: `.env.local` ファイルを作成し、API Keyを設定

#### 2. `NOTION_DATABASE_ID is not configured`
**原因**: Database IDが未設定  
**解決**: NotionでDatabase IDを取得し、環境変数に設定

#### 3. `API responded with status: 401`
**原因**: API Keyが無効またはIntegration未接続  
**解決**: 
- API Keyを再生成
- データベースにIntegrationを再接続

#### 4. `API responded with status: 404`
**原因**: Database IDが間違っているか、権限なし  
**解決**:
- Database IDを再確認
- Integrationがデータベースに接続されているか確認

#### 5. `Property 'xxx' does not exist`
**原因**: データベースのプロパティ名が間違っている  
**解決**: データベース設計通りにプロパティ名を設定

---

## 📋 設定完了チェックリスト

### Notion設定
- [ ] Notion Integrationを作成済み
- [ ] API Keyを取得済み
- [ ] データベースを作成済み
- [ ] 必要なプロパティを設定済み
- [ ] IntegrationをDB に接続済み
- [ ] Database IDを取得済み

### 環境変数設定
- [ ] `.env.local` ファイルを作成済み
- [ ] `NOTION_API_KEY` を設定済み
- [ ] `NOTION_DATABASE_ID` を設定済み
- [ ] `IP_HASH_SALT` を設定済み

### 動作確認
- [ ] 開発サーバーが正常起動
- [ ] テスト送信が成功
- [ ] Notionにデータが保存される
- [ ] ログが正常に出力される

---

## 🚀 本番デプロイ時の注意点

### Vercel設定
1. **Environment Variables設定**
   - All environments or Production のみ選択
   - Preview環境では開発用設定を使用

2. **Build設定確認**
   ```bash
   npm run build  # エラーがないことを確認
   npm run lint   # コード品質確認
   ```

3. **ログ監視設定**
   - Vercel Functions ログを確認
   - 本番環境でのエラー監視体制構築

**設定完了後、お問い合わせフォームが完全に機能する準備が整います！**