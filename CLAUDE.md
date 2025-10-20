# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Google Workspace コスト削減診断フォーム - A web application to calculate cost savings when migrating from various SaaS solutions to Google Workspace.

**Current Status**: ✅ Production Ready - All core features implemented and tested

## Commands

Use these commands for development:

```bash
npm install    # Install dependencies
npm run dev    # Start development server on localhost:3000 (or 3001 if 3000 is in use)
npm run build  # Create production build
npm start      # Start production server
npm run lint   # Run ESLint
```

**Note**: This project uses `npm` instead of `pnpm` for package management.

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
- **Gemini 2.5 Pro**: Feature comparison generation via Google AI Studio
  - Model: `gemini-2.5-pro`
  - Max output tokens: 4096
  - Temperature: 0.7
  - Generates structured Markdown tables comparing current services with Google Workspace
- **Supabase**: Lead data storage and analytics
  - RLS policies enabled for secure data access
  - Tables: `diagnosis_results`
- **Google Apps Script**: Email notifications (webhook)
- **Calendly**: Meeting scheduling (embedded or redirect)

### Database Schema (Supabase)

**Table: `diagnosis_results`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key, auto-generated |
| `company_name` | text | Company name |
| `employee_count` | integer | Number of employees |
| `email` | text | Contact email address |
| `name` | text | Contact person name |
| `current_services` | jsonb | Array of selected services with plan details |
| `current_cost` | numeric | Total current annual cost |
| `gws_cost` | numeric | Google Workspace annual cost |
| `savings` | numeric | Cost savings (positive) or increase (negative) |
| `satisfaction` | text | Current IT environment satisfaction level |
| `feature_comparison` | text | Gemini-generated Markdown comparison table |
| `created_at` | timestamptz | Timestamp of diagnosis submission |

**RLS Policies:**
- `Enable insert for all users`: Allows public insertion
- `Enable select for all users`: Allows public read access

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
- Accent: Cyan (#06B6D4)
- Base: White (#FFFFFF)
- Use shadcn/ui components as foundation
- Clear visual hierarchy with adequate spacing
- **Images**: Always use Next.js `<Image>` component (never `<img>` tags)
  - Import: `import Image from "next/image"`
  - Required props: `src`, `alt`, `width`, `height`
  - Example: `<Image src="/logo.png" alt="Logo" width={40} height={40} />`
- **Icons**: Use emojis for visual enhancement (🎉, 💰, 🚀, etc.)
- **Animations**: Tailwind CSS utilities (hover:scale-105, transition-all, etc.)
- **Gradients**: Use for CTAs and important sections (bg-gradient-to-r from-blue-600 to-cyan-600)

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
7. Run `npm run build` before deployment to catch TypeScript/ESLint errors

## Recent Implementation Updates (2025-01)

### Gemini API Integration
- **Model**: Changed from `gemini-2.0-flash-exp` to `gemini-2.5-pro`
- **File**: `src/app/api/generate-comparison/route.ts`
- **Configuration**:
  ```typescript
  maxOutputTokens: 4096  // Increased from 1024 to handle complete table generation
  temperature: 0.7
  ```
- **Prompt Engineering**: Detailed expert prompt with specific Markdown table format
- **Output**: Structured 3-column table (カテゴリ, 現在のツール, Google Workspaceで統合)

### Markdown Rendering
- **Package**: `react-markdown` + `remark-gfm` for GitHub Flavored Markdown (tables)
- **File**: `src/app/result/page.tsx`
- **Custom Styling**:
  - Blue gradient table headers (`bg-gradient-to-r from-blue-500 to-cyan-500`)
  - Hover effects on rows (`hover:bg-blue-50`)
  - Responsive overflow handling (`overflow-x-auto`)

### Result Page Enhancements
- **Header**: Company logo + ShigApps homepage link
- **Hero Section**: Celebration message with emoji animation
- **Cost Cards**:
  - Current cost (💸 gray gradient)
  - GWS cost (🚀 blue gradient)
  - Savings (✨ green or 💡 orange gradient)
  - Hover effects with scale transforms
- **Service List**: Icons with gradient backgrounds
- **CTA Section**: Large gradient buttons with trust badges
- **Footer**: Professional gradient footer with company branding

### TypeScript & ESLint Compliance
- **Error Handling**: Changed `error: any` to `error: unknown` with proper type guards
- **Unused Variables**: Removed `Progress`, `trigger`, `selectedGroupwarePaymentMethod`, unused `node` parameters
- **Image Optimization**: All `<img>` tags replaced with Next.js `<Image>` component
  - Requires `width` and `height` props for optimization
  - Automatic lazy loading and optimization

### Supabase Database
- **RLS Enabled**: Row Level Security policies configured
- **Policies**:
  - `Enable insert for all users`: PUBLIC can insert diagnosis results
  - `Enable select for all users`: PUBLIC can read diagnosis results
- **Schema**: See Database Schema section above

### Build & Deployment
- **Status**: ✅ Production build passing
- **Warnings**: Only `getOnPremiseServerPlan` unused function (non-critical)
- **Bundle Size**:
  - Homepage: 230 kB (115 kB page + 115 kB shared)
  - Result page: 178 kB (62.7 kB page + 115 kB shared)

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
├── src/
│   ├── app/
│   │   ├── page.tsx                        # トップページ（診断フォーム）
│   │   ├── result/page.tsx                 # 診断結果ページ
│   │   ├── api/
│   │   │   ├── generate-comparison/route.ts # Gemini API (機能比較生成)
│   │   │   ├── save-result/route.ts        # Supabase保存
│   │   │   └── send-email/route.ts         # メール送信
│   │   └── globals.css                     # グローバルスタイル
│   ├── components/
│   │   ├── DiagnosisForm.tsx               # 診断フォームコンポーネント
│   │   └── ui/                             # shadcn/ui コンポーネント
│   ├── lib/
│   │   ├── calculator.ts                   # コスト計算ロジック
│   │   ├── validation.ts                   # Zodスキーマ定義
│   │   └── supabase.ts                     # Supabaseクライアント
│   ├── data/
│   │   ├── services-pricing.json           # サービス料金マスターデータ
│   │   └── default-plans.json              # デフォルトプラン設定
│   └── types/
│       └── index.ts                        # TypeScript型定義
├── public/
│   ├── logos/
│   │   └── company-logo.png                # 会社ロゴ
│   └── icons/
│       ├── services/                       # サービスアイコン
│       └── google/                         # Google Workspaceアイコン
└── .env.local                              # 環境変数（Gitignore対象）
```

**主要ファイルの説明**:
- **`services-pricing.json`**: 各サービスのプラン名、料金、機能概要のマスターデータ
- **`calculator.ts`**: コスト計算ロジック（現在コスト、GWSコスト、削減額を算出）
- **`generate-comparison/route.ts`**: Gemini 2.5 Pro APIを使用した機能比較テーブル生成
- **`DiagnosisForm.tsx`**: React Hook Form + Zodを使用した4ステップの診断フォーム
- **`result/page.tsx`**: react-markdownを使用した診断結果表示ページ

## 4. コマンド

- `npm install`: 依存関係のインストール
- `npm run dev`: 開発サーバーの起動（localhost:3000）
- `npm run build`: プロダクションビルド（Vercelデプロイ前に必ず実行）
- `npm start`: ビルドされたアプリケーションの起動
- `npm run lint`: ESLintによるコードチェック

**注意**: このプロジェクトは`npm`を使用します（`pnpm`ではありません）

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
- **アクセントカラー**: ブルー (`#3B82F6`)、シアン (`#06B6D4`)
- **フォント**: `Inter` (Next/font/google を使用)
- **レイアウト**: シンプル、クリーン、モダン。十分な余白を確保し、視覚的な階層を明確にしてください。
- **コンポーネント**: `shadcn/ui`をベースとし、必要な場合はカスタムコンポーネントを作成します。
- **レスポンシブ**: モバイルファーストで設計し、全ての画面サイズで最適な表示になるようにしてください。
- **画像**: 必ず Next.js `<Image>` コンポーネントを使用（`<img>`タグは禁止）
  - `import Image from "next/image"` を追加
  - `width` と `height` プロパティを必ず指定
- **絵文字**: 視覚的な強化のため積極的に活用（🎉、💰、🚀など）
- **アニメーション**: Tailwind CSSユーティリティを使用（`hover:scale-105`、`transition-all`など）
- **グラデーション**: CTAや重要なセクションに使用（例：`bg-gradient-to-r from-blue-600 to-cyan-600`）

## 8. 技術的注意事項

### TypeScript
- **厳格な型チェック**: `any`型の使用は避け、`unknown`と型ガードを使用
- **未使用変数**: ESLintエラーを防ぐため、未使用の変数は削除
- **エラーハンドリング**:
  ```typescript
  // ❌ 悪い例
  catch (error: any) {
    console.log(error.message);
  }

  // ✅ 良い例
  catch (error: unknown) {
    if (error && typeof error === 'object' && 'message' in error) {
      console.log((error as { message: string }).message);
    }
  }
  ```

### React Markdown
- **パッケージ**: `react-markdown` + `remark-gfm`（テーブルサポート用）
- **カスタムコンポーネント**: テーブル要素に独自のスタイルを適用可能
- **使用例**:
  ```tsx
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      table: ({ ...props }) => <table className="custom-table" {...props} />,
      thead: ({ ...props }) => <thead className="bg-blue-500" {...props} />,
    }}
  >
    {markdownContent}
  </ReactMarkdown>
  ```

### Gemini API
- **モデル**: `gemini-2.5-pro`（2.0 Flashではない）
- **最大トークン数**: `maxOutputTokens: 4096`（完全なテーブル生成に必要）
- **プロンプト**: 具体的な出力形式を指定（Markdown表形式、列の定義など）
- **エラーハンドリング**: API呼び出し失敗時のフォールバック処理を実装

### Vercel デプロイメント
- **デプロイ前チェック**: 必ず `npm run build` を実行してエラーがないことを確認
- **環境変数**: Vercelダッシュボードで以下を設定:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `GEMINI_API_KEY`
  - `GAS_WEBHOOK_URL`
  - `NEXT_PUBLIC_CALENDLY_URL`
- **ビルド設定**:
  - Framework Preset: Next.js
  - Build Command: `npm run build`
  - Output Directory: `.next`

