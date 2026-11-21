# 開発ワークフロー

## 基本サイクル

1. 目的とDone when（完成条件）を決める。
2. 関連ファイルと `AGENTS.md` を読む。複雑な変更は計画から開始。
3. `feature/*` で最小実装。不要な依存や大きなリファクタリングを避ける。
4. `npm run lint` / `npm run typecheck` / `npm run build`。
5. ブラウザ/スマートフォン幅を必要に応じて確認。
6. GitHub PRの差分をレビューし、必須CIが通った後でマージ判断。
7. 複数日にまたがる作業は `HANDOFF.md` に事実を記録。

## チェックの境界

- ローカルのコマンド成功 ≠ GitHub Actions成功。
- CI成功 ≠ UIの実機確認。
- Vercel Preview成功 ≠ Production公開。
- Supabase・認証・外部APIを導入する際は環境変数、権限/RLS、復旧手順を別途確認する。

## Bootstrap固有の保留事項

- 依存のインストール・Next.jsビルドは、この初期PRを作成した環境では実行できていない。
- `package-lock.json` は次のPRで生成・追加し、その後CIを `npm ci` に変更する。
- Vercel連携、独自ドメイン、本番公開は未実施。
- 現在はWebの最小構成のみ。DB・認証・AI・ビジネス機能は未導入。

## Codex Tips

- [一般編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_TIPS_JA.md)
- [CLI編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/CODEX_CLI_TIPS_JA.md)
- [VS Code × ChatGPT編](https://github.com/iwasaki-hub/codex-tips/blob/main/docs/VSCODE_CODEX_CHATGPT_TIPS_JA.md)
