# Supabase Auth 接続手順（next-app専用）

## 現在の状態

- このPRでは **Next.js側の認証処理を実装**しますが、接続先Supabaseプロジェクトと環境変数が設定されるまでアカウント登録・ログインは有効になりません。
- 既存のLittleDiary・typing-appと認証データを共有しないでください。
- **この変更はDBテーブルの作成やマイグレーションを行いません。** ユーザー管理はSupabase Authの管理する\`auth.users\`を使用します。
- アプリ独自のデータを追加する場合、公開スキーマの全テーブルにRLSと所有者ベースのポリシーを設計してください。

## 1. Supabaseプロジェクトの用意

1. 所属するSupabase組織、料金（Free枠・追加請求の有無）を確認した上で、\`next-app\`専用プロジェクトを作ります。
2. リージョンは日本のユーザーを主に想定するならTokyo (\`ap-northeast-1\`)が候補です。
3. Project URLと\`sb_publishable_...\`形式のpublishable keyを取得します。**secretキーやservice_roleキーをNEXT_PUBLIC変数に入れてはいけません。**
4. 認証プロバイダー「Email」を有効にし、メールアドレス確認を有効にしてください。初期設定の確認メール送信制限・SMTP設定も確認してください。

## 2. Next.jsの環境変数

ローカルで \`.env.example\` を参考に\`.env.local\`へ以下を設定（実際の値をGitにコミットしない）：

\`\`\`dotenv
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_YOUR_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

Vercelでは、Preview / Productionで使用するそれぞれのURLに合わせて3つの値を設定し、**環境変数を更新したら再ビルド**してください。\`NEXT_PUBLIC_\`の設定値はブラウザに公開されます。公開鍵以外の認証情報を置かないでください。

認証のURL設定：

- **Authentication → URL Configuration → Site URL**：本番サイト \`https://next-app-dun-six-88.vercel.app\`
- **Redirect URLs**：\`http://localhost:3000/auth/callback\`、\`https://next-app-dun-six-88.vercel.app/auth/callback\`、必要なPreviewの\`/auth/callback\`のみ追加
- ワイルドカードで広範囲のリダイレクト先を許可することは本番では避けてください。
- SupabaseのDefaultメール確認テンプレートでは\`ConfirmationURL\`経由のPKCEコードを\`/auth/callback\`で交換します。独自の\`TokenHash\`方式を使うときだけ\`{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email\`のテンプレートを設定してください。
- \`NEXT_PUBLIC_SITE_URL\`はアプリのオリジン（\`/auth/callback\`を含めない）です。Server Actionのsignupが使用するURLがRedirect URLsに登録されている必要があります。

## 3. 実装範囲

- \`lib/supabase/server.ts\`：Cookieストアを使うSupabaseサーバークライアント
- \`proxy.ts\` / \`lib/supabase/proxy.ts\`：Next.js 16のセッション更新
- \`app/auth/actions.ts\`：ログイン・登録・ログアウト用Server Actions
- \`app/auth/callback/route.ts\`：PKCE確認リンク
- \`app/auth/confirm/route.ts\`：TokenHash形式のメールリンク
- \`/login\` / \`/signup\`：既存のガラス調フォームを再利用
- \`/account\`：認証済みのみ閲覧可能なマイページ。サーバー側\`getUser()\`で検証

未設定環境ではフォーム送信をブラウザ内で止め、既存のデモ表示・検証を維持します。

## 4. 必須確認（実環境で実施）

1. 専用テストメールアドレスで新規登録し、確認メールを受信する。
2. 確認リンクを開き、\`/account\`へ遷移し、正しいメールアドレスが表示される。
3. ログアウトでセッションが終了し、\`/account\`を再訪すると\`/login\`に戻る。
4. 正しいパスワードで再ログインでき、誤パスワードでログインできない。
5. ログインしていない別ブラウザやプライベートウィンドウから\`/account\`を閲覧できない。
6. URLや鍵の設定がないPreviewでは資格情報を送信できない。
7. iPhone Safariでもメールリンクとセッション継続を確認する。

Playwright CIは専用プロジェクトのテスト用認証情報を持たないため、デモ表示と未認証時のガードのみを確認します。**CI成功は実際のメール送受信やSupabase Authの統合成功を意味しません。**

## 後続タスク

- パスワード再設定画面・メール送信処理（このPRでは未実装）
- 必要に応じて認証制限・CAPTCHA・専用SMTP・レート制限
- ユーザープロフィールや業務データ用のRLS付きテーブル（必要になってから追加）

参考： https://supabase.com/docs/guides/auth/server-side/creating-a-client
参考： https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs
