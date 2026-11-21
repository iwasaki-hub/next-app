# Handoff（Vercel初回公開後）

## 現在地
- Next.js 16 / TypeScript / Tailwind CSSの初期構成はPR #1でmainへマージ済み。
- GitHub Actionsで依存インストール・lint・typecheck・buildが成功済み。
- Vercel GitHub連携とProductionデプロイは完了（初回Deployment READY）。
- 今回のPRで `engines.node` = `24.x` に固定し、CIも `.nvmrc` を使ってNode 24へ統一する。

## 警告と未解決事項
- Node.jsの幅広いバージョン指定警告: 今回の変更で解消を図り、Vercel Previewで検証する。
- `npm warn Unknown env config "cache-dir"`: Vercelのビルド環境由来とみられ、リポジトリ側での確実な解消は未確認。
- ESLint 9 EOL: 周辺プラグインのESLint 10互換に問題が残るため、強制的なメジャー更新はせず別課題として管理。
- `package-lock.json` 未登録。作成後にCIを `npm ci` へ切り替える必要がある。
- ブラウザやiPhone Safariでの表示確認は未実施。

## 次の一手
1. 今回のPRのCIとVercel Previewが成功することを確認する。
2. PRをレビューし、ユーザーの指示後にマージしてProductionを確認する。
3. ロックファイルを追加し、依存解決を固定する。
4. Next.jsのプラグイン群のESLint 10対応を確認し、安全な移行を別PRで進める。

参考: [Vercel警告の分析](DEPLOY_WARNINGS.md)
