# Codex development guidance

Next.js / TypeScript / Tailwind CSS の初期アプリです。

## 最初に確認する
- `README.md` と `docs/development/WORKFLOW.md` を読む。
- `package.json` のscriptsと、現在のブランチ・未コミット差分を確認。
- 要件が曖昧な場合は読み取り調査し、変更箇所と完成条件を先に整理。

## 実装
- App Router の Server Components を基本にする。状態・イベント・ブラウザAPIが必要な時だけ `"use client"` を追加。
- 機能は小さなPR単位。無関係なリファクタリングや依存追加はしない。
- タスクの必要に応じて公式ドキュメントに当たり、古いNext.jsの書き方を避ける。
- 変更範囲が増える場合は、その理由を説明してから進める。

## 検証
- `npm run lint`、`npm run typecheck`、`npm run build` を実行する。
- 実施できない検証は未実施と報告し、成功を推測しない。
- ブラウザでの表示確認とCI/型チェックを混同しない。

## 安全
- mainへの直接Push、PRのマージ、本番デプロイ、DBの変更は明示的な依頼なしには行わない。
- 秘密情報・トークン・.envファイルを記録やコミットに含めない。
- 既存のコードとドキュメントを削除・上書きする前に影響を確認する。

参考: https://github.com/iwasaki-hub/codex-tips
