# next-app

Next.js App Router を使う、TypeScript + Tailwind CSS の最小Webアプリです。
最初に動く画面と開発・レビューの仕組みだけを用意し、機能はPRごとに追加します。

## 技術スタック

- Next.js 16.4.6（App Router、Turbopack）
- React 19.3.1 / TypeScript / Tailwind CSS v4
- ESLint（Next.js Core Web Vitals）
- GitHub Actions（lint / 型チェック / build）
- VercelにGitHub連携済み（Production: https://next-app-dun-six-88.vercel.app）

> 現時点で認証・DB・Supabase・AI APIは導入していません。必要な機能が決まってから追加します。

## 開発の始め方

Node.js **24 LTS** を推奨。`engines.node` は `24.x` に固定し、CIは `.nvmrc` を参照します。

```bash
git clone https://github.com/iwasaki-hub/next-app.git
cd next-app
npm ci
npm run dev
```

http://localhost:3000 を開いてください。機能開発は`main`からfeatureブランチを作って進めます。

### 利用できるコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（http://localhost:3000） |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` → TypeScript 型チェック |
| `npm run build` | 本番向けビルド |
| `npm run start` | ビルド後のローカル本番起動 |

### ログイン・新規登録ページ（画面のみ）

- `/login`：メールアドレス・パスワードの入力、パスワードの表示切り替え
- `/signup`：メールアドレス・パスワード・確認用パスワードの入力、一致確認
- ホーム画面の「ログイン」から `/login` に移動し、各ページから相互に切り替えられます。

**重要：認証・ユーザー登録サービスは未接続です。** 画面はUIプレビューであり、実際のログイン・アカウント作成・パスワードの照合・保存はできません。送信操作はブラウザ内で止め、認証APIへデータは送信しません。実際のパスワードを入力しないよう画面にも注意を表示しています。

本番の認証を有効にする場合は、認証プロバイダー・メール確認・パスワードリセット・セッション管理・エラー表示・環境変数などを別PRで設計・検証してから接続します。

### UI操作の自動テスト（Playwright）

実際のChromiumブラウザで、下部3タブ、キーボード操作、ログインページへの移動・認証画面の入力チェック、ヒーローからガイドへの移動、モバイル幅の横はみ出しを検証します。UIの見た目やiPhone Safari実機操作を全面的に保証するものではありません。

ローカルで初めて実行するとき:

```bash
npm ci
npx playwright install chromium
npm run build
npm run test:e2e
```

テストは `playwright.config.ts` の設定で `npm run start` を自動起動し、`tests/e2e/guide.spec.ts` の操作を検証します。既にポート3000で開発サーバーを実行している場合は、そのサーバーを使用するため、最新の本番ビルドで検証するには他のサーバーを停止してください。

GitHub ActionsのCIは `npm ci`、Lint、型チェック、Buildに続いてChromiumをインストールし、`npm run test:e2e` を実行します。CI成功とiPhone実機確認は別の検証です。

## ディレクトリ

```text
app/                    App Router（画面・共通レイアウト・スタイル）
  page.tsx              最初のホーム画面
  layout.tsx            共通レイアウトとメタデータ
  globals.css           Tailwind CSS v4
  icon.svg              ファビコン
docs/development/       開発ワークフロー・引き継ぎ
.github/workflows/      PR/メインブランチの自動チェック
AGENTS.md               Codex用の最小ルール
```

## GitHubへの導入とPR運用

1. GitHub Actionsの`CI`と変更差分を確認。
2. PRレビューを経て`main`へマージし、最新コードを取り込みます。
3. `package-lock.json` をリポジトリに保存しています。CIと初回セットアップは `npm ci` を利用し、`actions/setup-node` のnpmキャッシュを利用します。依存を追加・更新するときだけ `npm install` を実行し、`package.json` と `package-lock.json` を同じPRに含めます。
4. 次の機能から `feature/*` で実装→型・Lint・ビルド→PRレビュー→CI→マージ。
5. VercelはGitHubと接続済み。PRのPreviewを確認してからマージし、Productionを再検証します。警告対策は[DEPLOY_WARNINGS.md](docs/development/DEPLOY_WARNINGS.md)を参照してください。

## Codexを使う場合

- [AGENTS.md](AGENTS.md) と [WORKFLOW.md](docs/development/WORKFLOW.md) を先に読む。
- 変更予定・対象外・Done when を小さなタスクごとに決める。
- [codex-tips 一般編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_TIPS_JA.md)、
  [CLI編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_CLI_TIPS_JA.md)、
  [VS Code × ChatGPT編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/VSCODE_CODEX_CHATGPT_TIPS_JA.md)を必要に応じて適用診断する。

### 補足

この初期ファイル群はNext.js公式構成を参考にした手動スキャフォールドです。
初回PRのGitHub Actionsではlint・型チェック・buildが成功し、Vercel ProductionへのデプロイもREADYを確認済みです。ただし、ブラウザ・iPhone実機表示は未確認です。

- [Next.js公式インストール](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js公式 ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Tailwind公式 Next.js導入](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
