# 静的解析とコードフォーマットによる品質保持ガイド

## 1. 基本方針

本プロジェクトでは、コードの品質と一貫性を高めるために、静的解析ツール **ESLint** とコードフォーマッター **Prettier** を導入します。これらのツールを組み合わせることで、潜在的なバグの早期発見と、誰が書いても同じスタイルになるコードフォーマットの自動化を実現します。

- **ESLint**: コードの品質をチェックする（潜在的なバグやベストプラクティス違反を検出）
- **Prettier**: コードの見た目を整える（インデント、スペース、改行などを自動整形）

## 2. 導入ツールと役割

### 2.1. ESLint (`eslint-config-next`)

- **役割**: コードの品質と構文エラーをチェックします。
- **設定**: `eslint-config-next` は、Next.jsプロジェクトに最適化されたESLintの推奨ルールセットです。これには、Reactやアクセシビリティ（`jsx-a11y`）に関するベストプラクティスが含まれており、高品質なアプリケーション開発をサポートします。
- **ファイル**: `eslint.config.mjs` で設定を管理します。

### 2.2. Prettier

- **役割**: コードのフォーマット（見た目）を統一します。
- **導入目的**: インデントの深さ、引用符の種類（シングルかダブルか）、行末のセミコロンの有無など、機能に影響しない「見た目」に関する議論をなくし、自動で一貫性のあるスタイルに整形します。
- **ESLintとの連携**: `eslint-config-prettier` を導入し、ESLintのフォーマット関連ルールを無効化します。これにより、**品質チェックはESLint**、**フォーマットはPrettier**という明確な役割分担を実現し、ルールの競合を防ぎます。

## 3. 実装計画

### ステップ1: Prettierの導入

1.  **パッケージのインストール**:

    ```bash
    npm install --save-dev prettier eslint-config-prettier
    ```

2.  **設定ファイルの作成**: プロジェクトルートに `.prettierrc.json` を作成し、フォーマットルールを定義します。

    ```json
    {
      "semi": true,
      "singleQuote": true,
      "trailingComma": "es5"
    }
    ```

3.  **ESLint設定の更新**: `eslint.config.mjs` を開き、設定配列の**最後**に `eslint-config-prettier` を追加します。これにより、Prettierと競合するESLintルールが無効になります。

### ステップ2: ワークフローの整備

高品質なコードを維持するために、以下のワークフローを構築します。

1.  **開発中のリアルタイム整形＆チェック**:
    - **エディタ連携**: VS Codeに **Prettier - Code formatter** と **ESLint** の拡張機能を導入します。
    - **保存時に自動フォーマット**: VS Codeの設定で「Format On Save」を有効にします。これにより、ファイルを保存するたびにPrettierが自動でコードを整形します。

2.  **コミット前の自動チェック**:
    - **リンターの実行**: コードをコミットする前に、必ずリンターを実行して品質上の問題がないか確認します。
      ```bash
      npm run lint
      ```
    - **フォーマットの確認**: プロジェクト全体のフォーマットが統一されているかを確認します。
      ```bash
      npx prettier --check .
      ```

3.  **CI/CDでの自動検証**:
    - **自動化**: GitHub ActionsなどのCIで、プルリクエスト作成時に `npm run lint` と `npx prettier --check .` を実行します。
    - **品質ゲート**: これらのチェックが失敗した場合はマージをブロックし、コード品質とフォーマットの一貫性を強制します。

## 4. まとめ

`eslint-config-next` でコードの品質を担保し、`Prettier` で見た目を統一する。この役割分担により、開発者は本質的なロジックの実装に集中でき、チーム全体でメンテナンス性の高いコードベースを効率的に維持することができます。
