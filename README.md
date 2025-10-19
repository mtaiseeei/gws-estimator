# Google Workspace コスト削減診断フォーム

中小企業が現在利用している各種SaaS（Zoom、Slack、Dropbox、ChatGPTなど）をGoogle Workspaceに統合した場合のコスト削減額を診断するWebアプリケーションです。

## 🎯 プロジェクト概要

このアプリケーションは、Webマーケティングによるリード獲得を目的としています。ユーザーが現在利用しているSaaSサービスの情報を入力すると、Google Workspaceに統合した場合の年間コスト削減額を自動で計算し、AI（Gemini）による機能比較も提供します。

## ✨ 主な機能

- **コスト計算**: 現在のSaaS利用状況とGoogle Workspaceの料金を比較
- **AI機能比較**: Gemini APIを使用した自動機能比較の生成
- **診断結果の保存**: Supabaseへのデータ保存とリード管理
- **メール送信**: Google Apps Scriptを利用した診断結果のメール送信
- **Calendly連携**: 無料相談予約へのスムーズな誘導

## 🛠️ 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**
- **shadcn/ui** (UIコンポーネント)
- **React Hook Form** + **Zod** (フォーム管理とバリデーション)

### バックエンド
- **Next.js API Routes**
- **Vercel** (ホスティング)

### データベース
- **Supabase** (PostgreSQL)

### 外部API
- **Gemini 2.0 Flash** (Google AI Studio)
- **Google Apps Script** (メール送信Webhook)
- **Calendly** (日程調整)

## 📁 プロジェクト構成

```
shigapps-gws-estimator/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # ランディングページ
│   │   ├── result/
│   │   │   └── page.tsx               # 診断結果ページ
│   │   └── api/
│   │       ├── generate-comparison/   # Gemini API連携
│   │       ├── save-result/           # Supabase保存
│   │       └── send-email/            # メール送信
│   ├── components/
│   │   ├── DiagnosisForm.tsx          # 診断フォーム
│   │   └── ui/                        # shadcn/ui コンポーネント
│   ├── lib/
│   │   ├── calculator.ts              # コスト計算ロジック
│   │   ├── supabase.ts                # Supabaseクライアント
│   │   └── validation.ts              # フォームバリデーション
│   ├── data/
│   │   ├── services-pricing.json      # サービス料金データ
│   │   └── default-plans.json         # デフォルトプラン設定
│   └── types/
│       └── index.ts                   # 型定義
├── supabase/
│   └── migrations/                    # データベースマイグレーション
├── google-apps-script/
│   └── webhook.gs                     # メール送信スクリプト
├── CLAUDE.md                          # Claude Code 用プロジェクト指示
├── SETUP.md                           # セットアップガイド
└── requirements.md                    # 要件定義書
```

## 🚀 クイックスタート

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd shigapps-gws-estimator
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定します：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google AI Studio (Gemini API)
GEMINI_API_KEY=your_gemini_api_key

# Google Apps Script Webhook
GAS_WEBHOOK_URL=your_gas_webhook_url

# Calendly
NEXT_PUBLIC_CALENDLY_URL=your_calendly_url
```

詳細な設定方法は [SETUP.md](SETUP.md) を参照してください。

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

## 📊 データベースセットアップ

Supabaseプロジェクトを作成後、以下のSQLを実行してテーブルを作成します：

```bash
# Supabase SQL Editorで実行
supabase/migrations/20250101000000_create_diagnosis_results.sql
```

または、Supabase CLIを使用：

```bash
supabase db push
```

## 📝 主要なコマンド

```bash
npm run dev      # 開発サーバーを起動
npm run build    # プロダクションビルド
npm run start    # プロダクションサーバーを起動
npm run lint     # ESLintによるコードチェック
```

## 🎨 デザインガイドライン

- **基調カラー**: 白 (#FFFFFF)
- **アクセントカラー**: ブルー (#3B82F6)
- **フォント**: Inter (Next.js Font最適化)
- **レイアウト**: モバイルファーストのレスポンシブデザイン
- **コンポーネント**: shadcn/uiをベースとしたモダンなUI

## 🔐 セキュリティ

- すべての通信はHTTPSで暗号化
- Supabase Row Level Security (RLS) によるデータ保護
- 環境変数による機密情報の管理
- CORS設定による不正アクセス防止

## 📈 KPI

- 診断完了率: 60%以上
- リード獲得数: 月間100件以上
- 商談化率: 10%以上
- 平均削減額: 年間5万円以上

## 🤝 コントリビューション

プルリクエストを歓迎します。大きな変更の場合は、まずIssueを開いて変更内容を議論してください。

## 📄 ライセンス

このプロジェクトは、Google Workspace正規代理店向けのマーケティングツールとして開発されています。

## 📚 ドキュメント

- [CLAUDE.md](CLAUDE.md) - Claude Code用のプロジェクト指示
- [SETUP.md](SETUP.md) - 詳細なセットアップガイド
- [requirements.md](requirements.md) - 要件定義書
- [todo.md](todo.md) - 実装タスクリスト
- [research-report.md](research-report.md) - SaaS料金調査レポート

## 🆘 サポート

問題が発生した場合は、GitHubのIssueで報告してください。

---

**作成日**: 2025年10月18日
**バージョン**: 1.0.0
