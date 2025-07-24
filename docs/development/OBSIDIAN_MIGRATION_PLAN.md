# Obsidian統合移行計画

## 🎯 移行戦略
本番運用中のリポジトリを保護するため、新規プロジェクトでプロトタイプを作成し、動作確認後に本番へ適用する段階的アプローチを採用。

## 📊 現状分析（完了）

### 分離対象ファイル
- **コンテンツファイル**（個人情報含む）:
  - `content/about.md` - 自己紹介
  - `content/skills.md` - 技術スキル  
  - `content/activities.md` - 活動実績
  - `data/resume.json` - 職務経歴
  - `data/skills.json` - スキルデータ

### 依存関係
- `app/page.tsx` - fs.readFileでコンテンツ読み込み
- `components/SkillsSection.tsx` - skills.json使用
- `components/CareerTable.tsx` - resume.json使用

## 🏗️ 新アーキテクチャ設計

### リポジトリ構成
```
1. resume-portfolio-public (新規・公開)
   └── Next.jsコードのみ（コンテンツ除外）

2. resume-portfolio-content (新規・非公開)  
   └── Obsidianで管理するコンテンツ

3. resume-portfolio (既存・非公開)
   └── 現在の本番環境（変更なし）
```

### ビルドフロー
```yaml
GitHub Actions:
1. 公開コードリポジトリをチェックアウト
2. プライベートコンテンツリポジトリをチェックアウト（PAT使用）
3. コンテンツをマージ
4. Next.jsビルド実行
5. Vercelへデプロイ
```

## 📋 実装フェーズ

### Phase 1: 新規プロジェクト基盤構築
- [ ] 公開リポジトリ `resume-portfolio-public` 作成
- [ ] プライベートリポジトリ `resume-portfolio-content` 作成
- [ ] 基本的なNext.jsプロジェクト構造セットアップ

### Phase 2: コード移植とコンテンツ分離
- [ ] 現在のコードを新プロジェクトへコピー（コンテンツ除外）
- [ ] コンテンツ読み込みロジックの環境変数対応
- [ ] .gitignoreとテンプレートファイル整備

### Phase 3: Obsidian統合
- [ ] コンテンツリポジトリのObsidian設定
- [ ] WikiLink対応（remark-wiki-link）
- [ ] コンテンツ管理ワークフロー確立

### Phase 4: CI/CD構築
- [ ] GitHub Actions ワークフロー作成
- [ ] Personal Access Token設定
- [ ] ビルド時コンテンツマージ処理

### Phase 5: テストとデプロイ
- [ ] ローカル開発環境での動作確認
- [ ] Vercelテストデプロイ
- [ ] 本番相当の環境でテスト

### Phase 6: 本番移行計画
- [ ] 移行リスク評価
- [ ] 切り替え手順書作成
- [ ] ロールバック計画

## 🔧 技術的実装詳細

### コンテンツパス切り替え
```typescript
// utils/content.ts
const CONTENT_BASE = process.env.CONTENT_PATH || './content';
const DATA_BASE = process.env.DATA_PATH || './data';

export async function getContent(filename: string) {
  const path = join(CONTENT_BASE, filename);
  return await fs.readFile(path, 'utf8');
}
```

### GitHub Actions設定
```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/checkout@v4
        with:
          repository: username/resume-portfolio-content
          token: ${{ secrets.CONTENT_REPO_TOKEN }}
          path: .content-temp
      
      - name: Merge content
        run: |
          cp -r .content-temp/content ./
          cp -r .content-temp/data ./
      
      - name: Build and Deploy
        run: npm run build
```

### ローカル開発セットアップ
```bash
# 1. コードリポジトリクローン
git clone https://github.com/username/resume-portfolio-public.git
cd resume-portfolio-public

# 2. コンテンツリポジトリクローン
git clone https://github.com/username/resume-portfolio-content.git ../resume-portfolio-content

# 3. シンボリックリンク作成
ln -s ../resume-portfolio-content/content ./content
ln -s ../resume-portfolio-content/data ./data

# 4. 開発開始
npm install
npm run dev
```

## 🚨 リスク管理

### 技術的リスク
- **ビルド失敗**: コンテンツ不在時のフォールバック
- **認証エラー**: PAT期限切れの監視
- **パフォーマンス**: 追加のチェックアウト時間

### 運用リスク
- **本番影響**: 新プロジェクトで完全検証
- **切り替え**: Blue-Greenデプロイ検討
- **ロールバック**: 旧環境の保持期間

## 📅 スケジュール

- **Week 1**: Phase 1-3（基盤構築とObsidian統合）
- **Week 2**: Phase 4-5（CI/CD構築とテスト）
- **Week 3**: Phase 6（本番移行準備）
- **Week 4**: 本番切り替え（オプション）

## ✅ 成功基準

1. 新プロジェクトが独立して正常動作
2. コード公開してもコンテンツが露出しない
3. 開発体験が大きく損なわれない
4. 本番環境への影響ゼロ
5. Obsidianでのコンテンツ管理が機能的