# 現在の課題とセットアップ状況

## ✅ 完了済み

1. **Next.jsプロジェクト初期化**
   - Next.js 15 + TypeScript + Tailwind CSS
   - App Router使用
   - shadcn/ui統合完了

2. **コア機能実装**
   - 診断フォーム（4ステップ）
   - コスト計算ロジック
   - 結果ページ
   - API Routes（3エンドポイント）

3. **ビルド成功**
   - `npm run build` エラーなし
   - ESLintエラー修正済み
   - TypeScript型エラー解消済み

4. **ドキュメント整備**
   - README.md
   - SETUP.md
   - CLAUDE.md
   - requirements.md
   - todo.md

## ⚠️ 未完了・要対応

### 1. Supabaseデータベース未作成

**現状:**
- マイグレーションファイルは作成済み（`supabase/migrations/20250101000000_create_diagnosis_results.sql`）
- データベーステーブルが未作成

**必要な作業:**
```bash
# Supabase MCPツールを使用してテーブル作成
# または
# Supabase Dashboardで手動実行
```

**ファイル:** `supabase/migrations/20250101000000_create_diagnosis_results.sql`

**テーブル構造:**
```sql
CREATE TABLE diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  employee_count INTEGER NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  current_services JSONB NOT NULL,
  current_cost NUMERIC(12, 2) NOT NULL,
  gws_cost NUMERIC(12, 2) NOT NULL,
  savings NUMERIC(12, 2) NOT NULL,
  satisfaction TEXT,
  feature_comparison TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Gemini API未接続

**現状:**
- APIエンドポイント実装済み（`src/app/api/generate-comparison/route.ts`）
- 環境変数未設定

**必要な作業:**
1. Google AI Studioでプロジェクト作成
2. APIキー取得
3. `.env.local`に設定
   ```bash
   GEMINI_API_KEY=your_gemini_api_key
   ```

**使用モデル:** Gemini 2.0 Flash Experimental

**APIエンドポイント:**
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent
```

### 3. 環境変数未設定

**現状:**
- `.env.local.example` 作成済み
- `.env.local` は存在するが、値が未設定の可能性

**必要な環境変数:**

```bash
# Supabase（必須）
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gemini API（必須）
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX

# Google Apps Script（オプション・後で設定）
GAS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# 日程調整ツール（必須）
NEXT_PUBLIC_CALENDLY_URL=https://timerex.net/s/taisei_5489_d091/db8b53de
```

### 4. Calendly URL変更対応

**現状:**
- コード内でCalendlyを参照
- 実際はTimerexを使用

**必要な変更:**
- 環境変数に正しいTimerex URLを設定
- `NEXT_PUBLIC_CALENDLY_URL` という名前だがTimerexのURLを設定すればOK

**Timerex URL:**
```
https://timerex.net/s/taisei_5489_d091/db8b53de
```

### 5. Google Apps Script Webhook（保留）

**現状:**
- スクリプトファイル作成済み（`google-apps-script/webhook.gs`）
- デプロイ未実施

**必要な作業:**
1. Google Apps Scriptプロジェクト作成
2. `webhook.gs`の内容をコピー
3. Webアプリとしてデプロイ
4. Webhook URLを`.env.local`に設定

**注意:** 後でテストするため、現時点では保留可

## セットアップの優先順位

### 高優先度（すぐに必要）

1. **Supabaseデータベース作成**
   - 診断結果の保存に必須
   - MCPツールで実行可能

2. **Gemini API設定**
   - 機能比較生成に必須
   - Google AI Studioで即座に取得可能

3. **Timerex URL設定**
   - CTAボタンの遷移先
   - 環境変数に設定するだけ

### 中優先度（動作確認後）

4. **GAS Webhook設定**
   - メール送信機能
   - 動作テスト後に設定

### 低優先度（本番デプロイ時）

5. **Vercel環境変数設定**
   - 本番デプロイ時に必要

## 開発サーバー起動時の注意

```bash
# 現在の状態で起動は可能
npm run dev

# ただし、以下の機能は動作しない:
# - 診断結果の保存（Supabase未設定）
# - 機能比較生成（Gemini API未設定）
# - メール送信（GAS Webhook未設定）

# フォーム入力とコスト計算は動作する
```

## 次のステップ

1. Supabase MCPツールでデータベース作成
2. Gemini APIキー取得と設定
3. Timerex URL設定
4. 動作確認
5. GAS Webhook設定（必要に応じて）
