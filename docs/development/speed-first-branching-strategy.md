# スピード重視ブランチ戦略

開発速度を最優先にしつつ、コードの安全性を保つための効率的なGitブランチワークフローです。

---

## 1. 基本方針

🚀 **開発速度最優先** + ⚡ **シンプルワークフロー**

- `main`ブランチを本番対応状態で維持
- `develop`ブランチは省略して工程短縮
- PR経由でmainへ直接マージ
- 最小限のレビュー、軽量CI/CD

---

## 2. ブランチ構造

| ブランチタイプ    | 目的                                   | 派生元  | マージ先       |
|:------------------|:---------------------------------------|:--------|:---------------|
| **main**          | 本番対応、常にデプロイ可能             | -       | -              |
| **feature/***     | 新機能・タスク開発用                   | main    | main (PR経由)  |
| **bugfix/***      | バグ修正用                             | main    | main (PR経由)  |
| **hotfix/***      | 本番緊急修正用                         | main    | main (PR経由)  |

### 🌳 ワークフロー図
```
main ← feature/タスク名 (PR経由)
main ← bugfix/問題内容 (PR経由)  
main ← hotfix/緊急修正 (PR経由)
```

---

## 3. ghコマンドを使った実践ワークフロー

### ✅ **新機能開発の流れ**
```bash
# 1. mainからfeatureブランチを作成
git checkout main
git pull origin main
git checkout -b feature/contact-form-validation

# 2. 開発作業とコミット
git add .
git commit -m "feat: お問い合わせフォームのバリデーション追加"

# 3. リモートにプッシュしてPR作成
git push origin feature/contact-form-validation
gh pr create --title "お問い合わせフォームのバリデーション機能追加" \
             --body "フォーム項目の入力チェック機能を実装" \
             --base main \
             --assignee @me

# 4. PR状況確認
gh pr status

# 5. レビュー・承認後にマージ
gh pr merge --squash --delete-branch

# 6. ローカルクリーンアップ
git checkout main
git pull origin main
```

### 🐛 **バグ修正の流れ**
```bash
# バグ修正ブランチ作成
git checkout -b bugfix/navigation-reload-issue
# 修正作業
git commit -m "fix: ページリロード時のナビゲーション状態を修正"
git push origin bugfix/navigation-reload-issue

# PRを作成してマージ
gh pr create --title "ナビゲーションリロード問題の修正" --body "Fixes #123"
gh pr merge --squash --delete-branch
```

### 🚨 **緊急修正の流れ**
```bash
# 緊急修正ブランチ
git checkout -b hotfix/security-vulnerability
# 緊急修正作業
git commit -m "hotfix: XSS脆弱性のパッチ"
git push origin hotfix/security-vulnerability

# 緊急修正用の迅速PR
gh pr create --title "【緊急】セキュリティ脆弱性パッチ" \
             --body "緊急対応が必要なセキュリティ修正" \
             --base main \
             --label "hotfix,urgent"
gh pr merge --squash --delete-branch
```

---

## 4. ブランチ命名規則

### 📝 **推奨命名パターン**
- `feature/機能名-詳細` 
  - 例: `feature/contact-form-validation`, `feature/e2e-test-setup`
- `bugfix/問題の内容`
  - 例: `bugfix/navigation-reload-issue`, `bugfix/form-submit-error`
- `hotfix/緊急度-内容`
  - 例: `hotfix/security-patch`, `hotfix/production-crash`

### 🚫 **避けるべき命名**
- 曖昧な名前: `feature/update`, `bugfix/fix`
- 日本語: `feature/お問い合わせ機能`
- 長すぎる名前: `feature/contact-form-validation-with-spam-protection-and-notion-integration`

---

## 5. プルリクエスト管理とレビューワークフロー

### 📋 **PR作成時のベストプラクティス**
```bash
# 詳細情報付きPR作成
gh pr create \
  --title "明確で簡潔なタイトル" \
  --body "## 概要
  変更内容の簡潔な説明
  
  ## 実装内容
  - [ ] 機能A追加
  - [ ] バグB修正
  - [ ] テストC追加
  
  ## テスト状況
  - [ ] 単体テスト成功
  - [ ] 手動テスト完了
  - [ ] Lintチェック通過
  
  Closes #issue番号" \
  --assignee @me \
  --reviewer @human-reviewer \
  --label "feature"
```

### 👤 **人間レビューのポイント**

#### 🔍 **必須チェック項目**
- [ ] **機能要件**: 実装が要件を満たしているか
- [ ] **コード品質**: 可読性、保守性が適切か
- [ ] **設計一貫性**: 既存アーキテクチャとの整合性
- [ ] **セキュリティ**: 脆弱性や機密情報漏洩リスク
- [ ] **パフォーマンス**: 性能に悪影響がないか
- [ ] **テストカバレッジ**: 適切なテストが含まれているか

#### 💡 **レビュー観点**
```markdown
## レビューコメント例

### 🎯 機能面
- この実装でエッジケースXXXは考慮されていますか？
- エラーハンドリングは十分ですか？

### 🏗️ 設計面
- この処理は他のコンポーネントでも再利用できそうですが、共通化を検討しませんか？
- 状態管理の方法は既存パターンと一致していますか？

### 🛡️ セキュリティ面
- ユーザー入力のサニタイゼーションは適切ですか？
- API呼び出しで認証は正しく実装されていますか？

### 📚 ドキュメント面
- この新機能のドキュメント更新は必要ですか？
- コメントで複雑な処理の説明は十分ですか？
```

---

## 6. 承認ワークフロー

### 📊 **承認プロセス**

#### 🤖 **自動チェック（必須）**
```yaml
# GitHub Actions による自動チェック
自動チェック項目:
- [ ] ESLint チェック通過
- [ ] TypeScript コンパイル成功  
- [ ] 単体テスト全件成功
- [ ] ビルド処理成功
- [ ] セキュリティスキャン通過
```

#### 👥 **人間レビュー段階**

##### **段階1: セルフレビュー**
```bash
# PR作成者による最終確認
gh pr view 123 --json files | jq -r '.files[].filename' | head -10

# 変更内容の再確認
gh pr diff 123

# テスト実行
npm test && npm run lint && npm run build
```

##### **段階2: ピアレビュー**
```bash
# レビュー担当者の指定
gh pr edit 123 --add-reviewer @human-reviewer

# レビュー状況確認
gh pr checks 123

# レビューコメントの確認
gh pr review 123 --approve --body "LGTM! セキュリティチェックとパフォーマンステストを確認しました。"
```

##### **段階3: 最終承認**
```bash
# 全チェック通過後の承認
gh pr merge 123 --squash --delete-branch

# または条件付き自動承認設定
gh pr merge 123 --auto --squash --delete-branch
```

### 🚦 **承認条件**

#### ✅ **マージ条件（すべて必須）**
1. **自動チェック**: 全項目グリーン
2. **人間レビュー**: 最低1名の承認
3. **ブランチ更新**: mainの最新変更を反映済み
4. **競合解決**: マージ競合なし

#### ⚠️ **特別ケース**
- **緊急修正（hotfix）**: レビュー簡素化、即時マージ可能
- **ドキュメント更新**: 自動チェックのみでマージ可能  
- **テスト追加**: 軽量レビューでマージ可能

---

## 7. レビューフィードバック対応

### 🔄 **修正→再レビューサイクル**
```bash
# フィードバック対応
git checkout feature/your-branch
# 修正作業
git add .
git commit -m "review: レビューコメントに対応"
git push origin feature/your-branch

# レビュー再依頼
gh pr comment 123 --body "@reviewer 修正完了しました。再レビューお願いします。

修正内容:
- エラーハンドリングを追加
- バリデーションロジックを改善  
- テストケースを追加"
```

### 📝 **レビューコミュニケーション**
```bash
# 質問や確認
gh pr comment 123 --body "この実装方法について質問があります。XXXの方が良いでしょうか？"

# 修正完了報告
gh pr comment 123 --body "✅ 指摘事項すべて修正完了
- セキュリティチェック追加
- パフォーマンス改善  
- テストカバレッジ100%達成"
```

---

## 8. 品質ゲート

### ✅ **マージ前必須チェック（自動）**
- [ ] `npm run lint` 成功
- [ ] `npm test` 成功  
- [ ] `npm run build` 成功
- [ ] セキュリティスキャン成功
- [ ] mainブランチとの競合なし

### 💡 **手動確認項目**
- [ ] 機能が期待通りに動作
- [ ] PRの説明が明確
- [ ] コミットメッセージが規約準拠
- [ ] 機密情報がコミットに含まれていない

---

## 9. 緊急対応手順

### 🚨 **ロールバック戦略**
```bash
# 迅速なロールバック
gh pr create --title "Revert: 問題のある変更をロールバック" \
             --body "緊急ロールバック - コミット abc123 を取り消し" \
             --base main

# または特定コミットのリバート
git revert abc123
git push origin main
```

### 🔧 **ホットフィックス展開**
```bash
# 緊急修正の迅速展開
git checkout -b hotfix/critical-issue
# 修正適用
git commit -m "hotfix: 本番緊急問題の修正"
git push origin hotfix/critical-issue

# 迅速PRプロセス
gh pr create --title "【緊急】本番ホットフィックス" \
             --body "**緊急対応**: 本番環境の重要な問題を修正
             
             - 影響範囲: [説明]
             - 解決方法: [説明]  
             - テスト: [実施内容]" \
             --base main \
             --label "hotfix,urgent"

# 通常レビューをスキップして管理者権限でマージ
gh pr merge --admin --squash --delete-branch
```

---

## 10. モニタリングと改善

### 📊 **開発速度の追跡**
```bash
# PR統計
gh pr list --state all --json createdAt,mergedAt | \
  jq '[.[] | select(.mergedAt != null)] | length'

# 平均マージ時間
gh pr list --state merged --limit 50 --json createdAt,mergedAt
```

### 🎯 **成功指標**
- ブランチ作成からマージまでの時間
- PR当たりの修正回数
- ビルド成功率
- デプロイ頻度

---

## 11. トラブルシューティング

### 🔄 **競合解決**
```bash
# featureブランチを最新mainと同期
git checkout feature/your-branch
git fetch origin
git rebase origin/main

# 競合解決後
git add .
git rebase --continue
git push --force-with-lease origin feature/your-branch
```

### 🧹 **クリーンアップコマンド**
```bash
# リモート参照の整理
git remote prune origin

# マージ済みブランチの削除
git branch --merged | grep -v "main" | xargs -n 1 git branch -d

# ghコマンドでのクリーンアップ
gh pr list --state merged --json headRefName | \
  jq -r '.[].headRefName' | \
  xargs -I {} git branch -d {}
```

---

## 12. ベストプラクティスまとめ

### ⚡ **速度最適化**
1. **直接mainマージ**: 中間developブランチなし
2. **Squashマージ**: クリーンなコミット履歴
3. **自動チェック**: 迅速なフィードバックループ
4. **ghコマンド活用**: CLI中心の効率的運用

### 🛡️ **安全性確保**
- mainブランチ保護設定
- 必須ステータスチェック
- PRベースコードレビュー
- 自動テストパイプライン

### 🎯 **生産性向上のコツ**
- ghコマンドをすべてのGitHub操作で活用
- シェルエイリアスで頻出コマンドを短縮
- GitHub Actionsで自動化を推進
- メトリクスを監視してワークフロー最適化

---

## 13. 参考資料

- [GitHub CLI ドキュメント](https://cli.github.com/manual/)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Squash and Merge](https://docs.github.com/ja/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github#squashing-your-merge-commits)

---

**最終更新**: 2025-07-21  
**対象プロジェクト**: Concat（フリーランス開発者ポートフォリオ）  
**目標**: 高速開発と安全性の両立