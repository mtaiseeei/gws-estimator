# セットアップガイド

Google Workspace コスト削減診断フォームのセットアップ手順を説明します。

## 1. プロジェクトのクローン

```bash
git clone <repository-url>
cd shigapps-gws-estimator
```

## 2. 依存関係のインストール

```bash
npm install
```

## 3. Supabaseプロジェクトのセットアップ

### 3.1. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com/)にアクセス
2. 新しいプロジェクトを作成
3. プロジェクトのURLとAnon Keyをメモ

### 3.2. データベーステーブルの作成

Supabaseダッシュボードの「SQL Editor」で、[supabase/migrations/20250101000000_create_diagnosis_results.sql](supabase/migrations/20250101000000_create_diagnosis_results.sql) の内容を実行します。

または、Supabase CLIを使用する場合:

```bash
# Supabase CLIのインストール
npm install -g supabase

# Supabaseプロジェクトにリンク
supabase link --project-ref <your-project-ref>

# マイグレーションの実行
supabase db push
```

## 4. Google AI Studio (Gemini API) のセットアップ

1. [Google AI Studio](https://aistudio.google.com/)にアクセス
2. APIキーを作成
3. APIキーをメモ

## 5. Google Apps Script Webhookのセットアップ

### 5.1. Google Apps Scriptプロジェクトの作成

1. [Google Apps Script](https://script.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. [google-apps-script/webhook.gs](google-apps-script/webhook.gs) の内容をコピー
4. プロジェクトに貼り付け

### 5.2. Webアプリとしてデプロイ

1. 「デプロイ」→「新しいデプロイ」を選択
2. 「種類の選択」→「ウェブアプリ」
3. 設定:
   - 次のユーザーとして実行: **自分**
   - アクセスできるユーザー: **全員**
4. 「デプロイ」をクリック
5. デプロイURLをコピー

### 5.3. メール本文のカスタマイズ

`webhook.gs` の `createEmailBody` 関数内のCalendlyリンクや
お問い合わせ先メールアドレスを実際の値に置き換えてください。

## 6. Calendlyのセットアップ

1. [Calendly](https://calendly.com/)でアカウントを作成
2. イベントタイプを作成（例: Google Workspace 無料相談）
3. 予約ページのURLをコピー

## 7. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を記述します:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Google AI Studio (Gemini API)
GEMINI_API_KEY=your-gemini-api-key

# Google Apps Script Webhook
GAS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Calendly
NEXT_PUBLIC_CALENDLY_URL=https://calendly.com/your-username/your-event
```

## 8. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いて動作確認します。

## 9. 本番環境へのデプロイ (Vercel)

### 9.1. Vercelプロジェクトの作成

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

### 9.2. 環境変数の設定

Vercelダッシュボードで、`.env.local` と同じ環境変数を設定します:

1. Vercelプロジェクトの「Settings」→「Environment Variables」
2. 各環境変数を追加
3. 「Save」をクリック

### 9.3. 本番デプロイ

```bash
vercel --prod
```

## 10. 動作確認

1. デプロイされたURLにアクセス
2. 診断フォームに情報を入力
3. 診断結果が表示されることを確認
4. メール送信機能が動作することを確認
5. Supabaseのテーブルにデータが保存されていることを確認

## トラブルシューティング

### Supabaseへの保存が失敗する

- Supabaseのプロジェクト設定でRLSポリシーが正しく設定されているか確認
- ブラウザのコンソールでエラーメッセージを確認

### Gemini APIのエラー

- APIキーが正しく設定されているか確認
- Google AI StudioでAPIキーが有効化されているか確認
- API利用制限に達していないか確認

### メール送信が失敗する

- Google Apps ScriptのWebhook URLが正しいか確認
- Google Apps Scriptの実行ログでエラーを確認
- GmailのSPAMフォルダを確認

## サポート

問題が解決しない場合は、GitHubのIssueで報告してください。
