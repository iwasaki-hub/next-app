# Vercelデプロイ警告の対策（2026-11-21）

対象: [iwasaki-hub/next-app](https://github.com/iwasaki-hub/next-app)。
初回Productionデプロイはビルド成功（READY）。次の警告について原因と対策を整理する。

| 警告 | 原因と対策 |
| --- | --- |
| `Detected "engines": { "node": ">=20.9.0" } ... automatically upgrade` | 広い範囲指定だとVercelで将来のNodeメジャーが自動適用される。`package.json`の`engines.node`を`24.x`に変更し、CIも`.nvmrc`で24系に統一する。PRのVercel Previewで解消を確認する。 |
| `npm warn Unknown env config "cache-dir"` | プロジェクトの`.npmrc`ではなく、Vercelビルド環境から渡る環境設定とみられる。**外部要因で未解消**。全警告の非表示やダミーの設定追加は行わない。 |
| `npm warn deprecated eslint@9.39.5` | ESLint 9は2026-08-06にEOL。ESLint 10への更新はNext.js由来の`eslint-plugin-import`、`eslint-plugin-jsx-a11y`、`eslint-plugin-react`などのpeerDependencies/実行互換性確認が必要。**安全なメジャー移行は未実施**。強制インストールで警告を隠さない。 |

## CIとPreviewの確認
- Node 24のGitHub Actionsで`npm install` → `npm run lint` → `npm run typecheck` → `npm run build` を実行する。
- PRでVercel Previewが`READY`であることを確認する。
- Nodeバージョン警告が消えても、外部要因のnpm警告とESLint 9の廃止警告は別に管理する。
- 本番デプロイはこのPRをマージした後に実施する。

## 再現性の改善（別タスク）
初回PRでは`package-lock.json`を生成できなかった。次のPRで信頼できるネットワーク上の`npm install`でロックファイルを生成・コミットし、CIを`npm ci`にする。ロックファイルなしで`npm ci`へ切り替えると失敗する。

## 出典
- [Vercel Node 24推奨](https://vercel.com/changelog/node-js-20-is-being-deprecated)
- [VercelサポートNode](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [ESLint公式サポート表](https://eslint.org/version-support/)
- [Next.js ESLint設定](https://nextjs.org/docs/app/api-reference/config/eslint)
- [Vercel Community: npm cache-dir警告](https://vercel-community-mu.vercel.sh/t/npm-warn-unknown-env-config-cache-dir-caused-by-vercel-build-environment/51678)
