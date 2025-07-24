# ConCatEx セットアップガイド

ConCatExは、個人情報を含むコンテンツとNext.jsコードを分離したポートフォリオサイトです。

## 🚀 クイックスタート

### 1. コンテンツファイルのセットアップ

```bash
# content/ ディレクトリのセットアップ
cp content/about.md.example content/about.md
cp content/skills.md.example content/skills.md
cp content/activities.md.example content/activities.md

# data/ ディレクトリのセットアップ
cp data/resume.json.example data/resume.json
cp data/skills.json.example data/skills.json
```

### 2. 個人情報の入力

作成したファイルを編集して、あなたの情報に置き換えてください：

- `content/about.md` - 自己紹介
- `content/skills.md` - 技術スキル（Markdown形式）
- `content/activities.md` - 活動・実績
- `data/resume.json` - 職務経歴（構造化データ）
- `data/skills.json` - スキル（レベル付きデータ）

### 3. 依存関係のインストール

```bash
npm install
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

## 🔒 セキュリティ

### 個人情報の保護

- `content/` と `data/` 内の実際のファイルは `.gitignore` で除外済み
- `.example` ファイルのみがGitで管理されます
- 個人情報が誤ってコミットされる心配はありません

### リポジトリ公開時の注意

このリポジトリは公開リポジトリとして設計されています：

- ✅ Next.jsコード: 公開OK
- ✅ テンプレートファイル: 公開OK
- ❌ 実際のコンテンツ: 自動的に除外

## 🏗️ アーキテクチャ

### ディレクトリ構造

```
ConCatEx/
├── app/                    # Next.js App Router
├── components/             # Reactコンポーネント
├── utils/                  # ユーティリティ関数
├── content/                # Markdownコンテンツ
│   ├── *.md               # 実際のファイル（Git除外）
│   └── *.md.example       # テンプレート（Git管理）
├── data/                   # JSONデータ
│   ├── *.json             # 実際のファイル（Git除外）
│   └── *.json.example     # テンプレート（Git管理）
└── public/                 # 静的ファイル
```

### 環境変数

コンテンツパスをカスタマイズ可能：

```bash
# .env.local (オプション)
CONTENT_PATH=./content    # デフォルト
DATA_PATH=./data          # デフォルト
```

## 🚨 トラブルシューティング

### コンテンツファイルが見つからない

```
Error: Could not load about.md
```

**解決方法**: テンプレートファイルをコピーしてください
```bash
cp content/about.md.example content/about.md
```

### ビルドエラー

```bash
# 依存関係の再インストール
rm -rf node_modules package-lock.json
npm install

# コンテンツファイルの確認
ls -la content/ data/
```

## 📝 開発コマンド

```bash
# 開発サーバー
npm run dev

# 本番ビルド
npm run build

# テスト実行
npm test

# コード品質チェック
npm run lint
```

## 📖 詳細情報

- [移行計画](./docs/development/OBSIDIAN_MIGRATION_PLAN.md)
- [プロジェクト概要](./README.md)
- [開発ガイド](./PROJECT_STATUS.md)