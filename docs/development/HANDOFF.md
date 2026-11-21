# Handoff（初期状態）

## 現在地
- Next.js 16 / TypeScript / Tailwind CSS の初期構成をfeatureブランチに追加。
- PR/CIで確認後、次の開発タスクを決める。

## 検証状況
- ローカルでの npm install / lint / typecheck / build は **未実施**（依存取得のための外部接続が不可）。
- GitHub Actionsの実行結果はPR作成後に確認する。
- iPhone/ブラウザでの実機表示確認は **未実施**。

## 次の一手
1. PRで差分とGitHub Actionsを確認し、必要なら修正。
2. npm install によりpackage-lock.jsonを生成し、別PRでコミット。その後CIを npm ci に変更。
3. Vercelにリポジトリを接続しPreviewを確認（ユーザーの指示後）。
4. 開発する最初の機能の仕様・Done whenを確定。

## 安全
- mainに直接変更しない。
- DB/認証/本番公開/Secretsの追加は別途の設計・承認後。
