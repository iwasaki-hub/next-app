# Supabase Auth 接続手順（next-app専用）

## 現在の接続状況（2026-11-21）

- Supabase専用プロジェクト **`next-app`** は作成済み。Project ref: `uvtyjurscpegfktbrhnk`、東京リージョン、`ACTIVE_HEALTHY`。
- Project URL: `https://uvtyjurscpegfktbrhnk.supabase.co`。有効なpublishable keyが存在することを確認済み。
- **PR #13は未マージ**。Vercel Preview環境変数への登録は権限不足（403）で失敗したため、まだ接続されていません。Productionは変更していません。
- LittleDiary・typing-appの既存プロジェクト、テーブル・RLS・ユーザーは変更していません。
- このPRのコードは設定不足の環境でUIデモを維持し、実際のパスワードを送信しません。

## 1. Vercel Preview限定の環境変数を設定

Vercelの**next-appプロジェクト → Settings → Environment Variables**で、必ず**Environment = Preview**、**Specific Git Branch = `feature/supabase-auth-foundation`**を指定してください。Productionや全Previewブランチには広げないでください。

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://uvtyjurscpegfktbrhnk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → Project Settings / API Keys の有効な **publishable (`sb_publishable_...`)** キー（このドキュメントには貼り付けない） |
| `NEXT_PUBLIC_SITE_URL` | `https://next-app-git-feature-supabase-au-0f62ac-masas-projects-39337881.vercel.app` |

このURLはPR #13の**固定のPreviewブランチエイリアス**です。デプロイごとに変わる一時URLではなく、このURLをメール認証の戻り先にします。環境変数を設定した後、**同じfeatureブランチのPreviewを再ビルド**してください。既存デプロイは環境変数変更を自動では反映しません。

秘密鍵・service_roleキー・DBパスワードを `NEXT_PUBLIC_` に置かないでください。公開鍵はブラウザに送信される設計です。`.env.local`はコミットせず、ローカルでは`.env.example`を参照してください。

## 2. Supabase Authのメール設定

Supabase Dashboard → `next-app` → **Authentication → Providers → Email**で、メールアドレスとパスワードによる登録、**メール確認（Confirm email）**を有効にします。初期SMTP・メール送信回数制限にも注意してください。

次に **Authentication → URL Configuration** に以下を登録します。

- **Site URL**: `https://next-app-git-feature-supabase-au-0f62ac-masas-projects-39337881.vercel.app`（Preview検証中の設定）
- **Redirect URLs**: `https://next-app-git-feature-supabase-au-0f62ac-masas-projects-39337881.vercel.app/auth/callback`
- TokenHash形式の確認リンクを使う場合、`https://next-app-git-feature-supabase-au-0f62ac-masas-projects-39337881.vercel.app/auth/confirm`も許可しておく
- ローカル開発時のみ `http://localhost:3000/auth/callback` と `http://localhost:3000/auth/confirm` を追加する

**メール確認テンプレート：** 同一ブラウザのPKCE確認リンクなら標準の`{{ .ConfirmationURL }}`と`/auth/callback`を利用できます。メールを別のブラウザ・端末で開く可能性を考慮する場合は、**Authentication → Email Templates → Confirm sign up**を次のTokenHashリンク方式に変更できます。

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">メールアドレスを確認</a>
```

このアプリには`/auth/confirm`（`verifyOtp`）と`/auth/callback`（`exchangeCodeForSession`）の両方を実装済みです。テンプレートの設定内容と実際の戻り先を必ず確認してください。

## 3. 接続確認（未実施）

1. Vercel Previewを再デプロイし、`/login`と`/signup`で**デモ表示が消えたこと**を確認する。
2. 自分で受信できるテスト用メールアドレスを使ってサインアップし、届いた確認メールを開く。
3. `/account`で登録メールアドレスを確認し、ログアウト後の再アクセスが`/login`へ戻ることを確かめる。
4. 正しい・誤ったパスワードでそれぞれログイン動作を確認し、別ブラウザでの未認証アクセスも検証する。
5. iPhone Safariで登録・メール確認・再ログインを確認する。

GitHub Actionsの既存Playwrightテストは未設定状態のデモ動作と未認証時ガードを検証するもので、**実Supabaseとの連携やメール受信の成功を証明しません**。

## 4. 本番反映は別の承認後

Previewで認証を検証してからPRをマージします。その後、SupabaseのSite URL・Redirect URLsとVercel **Production**の環境変数を本番用URLへ切り替えて公開します。現時点ではProduction環境変数を設定しないでください。

独自アプリデータテーブルは未導入です。今後作る公開スキーマのテーブルには所有者を検証するRLSを適用します。パスワード再設定・追加の不正利用防止策・SMTP整備は別PRで扱います。

参考： https://supabase.com/docs/guides/auth/redirect-urls
参考： https://supabase.com/docs/guides/auth/server-side/creating-a-client
参考： https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs

## 管理ページの登録ユーザー一覧

Supabase Dashboard の **Authentication → Users** で、管理ページの閲覧を許可するアカウントの User UID を確認します。Vercel の対象環境またはローカルの `.env.local` に以下を設定します。

| 変数 | 値 |
| --- | --- |
| `ADMIN_USER_IDS` | 許可する User UID。複数の場合はカンマ区切り |
| `SUPABASE_SECRET_KEY` | 同じ Supabase プロジェクトの **Settings → API Keys** にある Secret key |

どちらもサーバー専用です。Secret key を `NEXT_PUBLIC_` 付き変数や GitHub に登録しないでください。Vercel では設定後に対象環境を再デプロイします。許可したアカウントでログインして `/admin` を開くと、登録ユーザーが20件ずつ表示されます。各ユーザーの「管理者」「一般ユーザー」は `ADMIN_USER_IDS` をもとに表示します。

## ToDo のアカウント保存

ToDo のアカウント保存を有効にするには、対象の Supabase プロジェクトに
`supabase/migrations/20261122140000_create_todo_tasks.sql` を適用します。
ログイン済みの利用者は自分の ToDo を作成、閲覧、完了切り替え、削除できます。
公開キーとログインセッションを使い、テーブルの RLS で所有者を照合します。

未ログイン時はブラウザに保存します。ログイン後に「このブラウザのタスクを取り込む」を
選ぶと、現在ログインしているアカウントへ移せます。取り込んだタスクを別の端末で
確認するときは、同じアカウントでログインして ToDo ページを開き直します。
