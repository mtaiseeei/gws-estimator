# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Google Workspace コスト削減診断フォーム - A web application to calculate cost savings when migrating from various SaaS solutions to Google Workspace.

**Current Status**: Documentation phase - Next.js project not yet initialized

## Project Initialization

This project needs to be initialized first. Follow these steps:

```bash
# Initialize Next.js with TypeScript and Tailwind CSS
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# Install required dependencies
pnpm add react-hook-form zod @hookform/resolvers
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs
pnpm add -D @types/node

# Install shadcn/ui (follow prompts)
pnpm dlx shadcn-ui@latest init
```

## Commands

After initialization, use these commands:

```bash
pnpm dev       # Start development server on localhost:3000
pnpm build     # Create production build
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## Architecture

### Data Flow
1. User inputs current SaaS usage in form
2. Calculator uses `services-pricing.json` to compute costs
3. Gemini API generates feature comparisons
4. Results stored in Supabase
5. Email sent via Google Apps Script webhook
6. CTA redirects to Calendly for scheduling

### Core Components

**Services Data** (`services-pricing.json`, `default-plans.json`):
- Master pricing database for all SaaS services
- Default plan fallbacks when user doesn't know their plan
- On-premise server costs calculated by company size

**Cost Calculation** (`lib/calculator.ts`):
- Takes user inputs and services data
- Returns current costs, GWS costs, and savings
- Handles on-premise server special calculations

**API Integrations**:
- **Gemini 2.0 Flash**: Feature comparison generation via Google AI Studio
- **Supabase**: Lead data storage and analytics
- **Google Apps Script**: Email notifications (webhook)
- **Calendly**: Meeting scheduling (embedded or redirect)

### Database Schema (Supabase)

```sql
-- diagnosis_results table
id: uuid
company_name: text
employee_count: integer
email: text
current_services: jsonb
current_cost: numeric
gws_cost: numeric
savings: numeric
feature_comparison: jsonb
created_at: timestamp
```

## Environment Variables

Create `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Google AI Studio
GEMINI_API_KEY=your_gemini_api_key

# Google Apps Script Webhook
GAS_WEBHOOK_URL=your_gas_webhook_url

# Calendly
NEXT_PUBLIC_CALENDLY_URL=your_calendly_link
```

## Key Implementation Notes

### Service Pricing Logic
- All service pricing defined in `services-pricing.json`
- On-premise server costs vary by company size (10/20/50+ employees)
- Google Workspace baseline: 19,200 yen/user/year (Business Standard)

### Form Validation
- Use React Hook Form with Zod schema validation
- Required fields: company name, employee count, email, at least one service
- Email validation and duplicate submission prevention

### UI/UX Guidelines
- Mobile-first responsive design
- Primary color: Blue (#3B82F6)
- Base: White (#FFFFFF)
- Use shadcn/ui components as foundation
- Clear visual hierarchy with adequate spacing

## Related Documentation

- **requirements.md**: Complete requirements specification
- **todo.md**: Implementation task checklist (follow for development phases)
- **research-report.md**: SaaS pricing research and competitive analysis
- **README.md**: Project overview and structure

## Development Workflow

1. Check `todo.md` for current phase tasks
2. Implement features following the task checklist
3. Test calculations against expected values in `research-report.md`
4. Ensure mobile responsiveness
5. Validate form inputs and error handling
6. Test API integrations (Gemini, Supabase, GAS webhook)

# ユーザー追加

# CLAUDE.md - Google Workspace コスト削減診断フォーム

## 1. プロジェクト概要

このプロジェクトは、中小企業が現在利用している各種SaaSをGoogle Workspaceに統合した場合のコスト削減額を診断するWebフォームを開発するものです。

- **目的**: Webマーケティングのリード獲得
- **ターゲット**: 中小企業の経営者、IT担当者
- **コア機能**: サービスごとのコスト計算、Google Workspaceとの比較、診断結果のメール送信、CTAからの日程調整

## 2. 技術スタック

- **フロントエンド**: Next.js (React)
- **バックエンド**: Vercel
- **データベース**: Supabase
- **メール送信**: Google Apps Script (Webhook経由)
- **AI (機能比較生成)**: Gemini 2.5 Pro (Google AI Studio)
- **UIフレームワーク**: Tailwind CSS + shadcn/ui
- **フォーム管理**: React Hook Form

## 3. 主要ファイルとディレクトリ構造

```
/
├── pages/
│   ├── index.tsx       # ランディングページ & 診断フォーム
│   └── result.tsx      # 診断結果ページ
├── components/
│   ├── ui/             # shadcn/ui コンポーネント
│   ├── form/           # フォーム関連コンポーネント
│   └── layout.tsx      # 共通レイアウト
├── lib/
│   ├── calculator.ts   # コスト計算ロジック
│   └── api.ts          # Gemini API, Supabaseクライアント
├── data/
│   ├── services-pricing.json # サービス料金データベース
│   └── default-plans.json    # デフォルトプラン設定
├── public/
└── styles/
    └── globals.css     # Tailwind CSS設定
```

- **`services-pricing.json`**: 各サービスのプラン名、料金、機能概要を格納します。このファイルをマスターデータとして参照してください。
- **`calculator.ts`**: ユーザーの入力と`services-pricing.json`を基に、現在のコストと削減額を計算するロジックをここに記述します。

## 4. コマンド

- `pnpm install`: 依存関係のインストール
- `pnpm dev`: 開発サーバーの起動
- `pnpm build`: プロダクションビルド
- `pnpm start`: ビルドされたアプリケーションの起動
- `pnpm lint`: ESLintによるコードチェック

## 5. コーディングスタイル

- **言語**: TypeScript
- **フォーマット**: Prettierを適用 (設定は`package.json`参照)
- **命名規則**: 
  - コンポーネント: PascalCase (e.g., `CostCalculator.tsx`)
  - 変数・関数: camelCase (e.g., `calculateTotalCost`)
  - 型定義: PascalCase (e.g., `type ServicePlan = { ... }`)
- **コメント**: 複雑なロジックや意図が分かりにくい箇所には、JSDoc形式でコメントを追加してください。

## 6. ワークフロー

1.  **ブランチ作成**: `feature/` や `fix/` プレフィックスを使用してブランチを作成します。
2.  **実装**: `todo.md`のタスクリストに従って実装を進めます。
3.  **テスト**: UIの表示確認と、計算ロジックの単体テストを必ず実施します。
4.  **コミット**: `feat: ...` や `fix: ...` のようなConventional Commits形式でコミットメッセージを記述します。
5.  **プルリクエスト**: Vercelのプレビューデプロイを確認し、問題がなければプルリクエストを作成します。

## 7. デザインガイドライン

- **基調カラー**: 白 (`#FFFFFF`)
- **アクセントカラー**: ブルー (`#3B82F6`)
- **フォント**: `Inter` (Next/font/google を使用)
- **レイアウト**: シンプル、クリーン、モダン。十分な余白を確保し、視覚的な階層を明確にしてください。
- **コンポーネント**: `shadcn/ui`をベースとし、必要な場合はカスタムコンポーネントを作成します。
- **レスポンシブ**: モバイルファーストで設計し、全ての画面サイズで最適な表示になるようにしてください。

