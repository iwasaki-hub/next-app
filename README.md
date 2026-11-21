# next-app

Next.js App Router を使う、TypeScript + Tailwind CSS の最小Webアプリです。
最初に動く画面と開発・レビューの仕組みだけを用意し、機能はPRごとに追加します。

## 技術スタック

- Next.js 16.4.6（App Router、Turbopack）
- React 19.3.1 / TypeScript / Tailwind CSS v4
- ESLint（Next.js Core Web Vitals）
- GitHub Actions（lint / 型チェック / build）
- VercelへのGitHub連携を想定（**未接続・未デプロイ**）

> 現時点で認証・DB・Supabase・AI APIは導入していません。必要な機能が決まってから追加します。

## 開発の始め方

Node.js 22 LTS を推奨（Next.jsの最低要件は Node.js 20.9）。

```bash
git clone https://github.com/iwasaki-hub/next-app.git
cd next-app
npm install
npm run dev
```

http://localhost:3000 を開いてください。PRブランチだけで試す場合は
`git switch feature/nextjs-initial-setup` してから `npm install` を実行してください。

### 利用できるコマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（http://localhost:3000） |
| `npm run lint` | ESLint |
| `npm run typecheck` | `next typegen` → TypeScript 型チェック |
| `npm run build` | 本番向けビルド |
| `npm run start` | ビルド後のローカル本番起動 |

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

1. このPRをレビューし、GitHub Actions の `CI` を確認。
2. マージ後に `main` をローカルに取り込んで `npm install`。
3. **重要:** 初期PRでは npm レジストリに接続できなかったため、`package-lock.json` は未生成です。ネット接続のある環境で `npm install` を実行し、生成された `package-lock.json` を**次のPRにコミット**してください。以後CIは `npm ci` とキャッシュに切り替えると再現性が高まります。
4. 次の機能から `feature/*` で実装→型・Lint・ビルド→PRレビュー→CI→マージ。
5. Vercelを使う場合はGitHubリポジトリをインポートし、PreviewとProductionを別々に確認する。**このPRではVercelへの接続操作は行っていません。**

## Codexを使う場合

- [AGENTS.md](AGENTS.md) と [WORKFLOW.md](docs/development/WORKFLOW.md) を先に読む。
- 変更予定・対象外・Done when を小さなタスクごとに決める。
- [codex-tips 一般編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_TIPS_JA.md)、
  [CLI編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_CLI_TIPS_JA.md)、
  [VS Code × ChatGPT編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/VSCODE_CODEX_CHATGPT_TIPS_JA.md)を必要に応じて適用診断する。

### 補足

この初期ファイル群はNext.js公式構成を参考にした手動スキャフォールドです。
パッケージのダウンロード・実行はローカルでは未検証です。CIの実行結果を確認するまで「build成功」とは扱わないでください。

- [Next.js公式インストール](https://nextjs.org/docs/app/getting-started/installation)
- [Next.js公式 ESLint](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Tailwind公式 Next.js導入](https://tailwindcss.com/docs/installation/framework-guides/nextjs)
