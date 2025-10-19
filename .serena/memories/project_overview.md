# Google Workspace コスト削減診断フォーム - プロジェクト概要

## プロジェクトの目的

中小企業が現在利用している各種SaaS（Zoom、Slack、Dropbox、ChatGPTなど）をGoogle Workspaceに統合した場合のコスト削減額を診断するWebアプリケーション。

**主な目的**: Webマーケティングによるリード獲得

**ターゲットユーザー**: 中小企業の経営者、IT担当者

## 技術スタック

### フロントエンド
- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui (UIコンポーネントライブラリ)
- React Hook Form + Zod (フォーム管理とバリデーション)

### バックエンド
- Next.js API Routes
- Vercel (ホスティング)

### データベース
- Supabase (PostgreSQL)

### 外部API連携
- Gemini 2.0 Flash (Google AI Studio) - 機能比較生成
- Google Apps Script - メール送信Webhook
- Calendly/Timerex - 日程調整

### 主要ライブラリ
- @supabase/supabase-js - Supabaseクライアント
- zod - スキーマバリデーション
- react-hook-form - フォーム状態管理
- lucide-react - アイコン
- class-variance-authority - スタイル管理

## プロジェクト構造

```
src/
├── app/                    # Next.js App Router
│   ├── page.tsx           # ランディングページ + 診断フォーム
│   ├── result/
│   │   └── page.tsx      # 診断結果ページ
│   └── api/              # APIエンドポイント
│       ├── generate-comparison/  # Gemini API連携
│       ├── save-result/         # Supabase保存
│       └── send-email/          # メール送信
├── components/
│   ├── DiagnosisForm.tsx  # メイン診断フォーム
│   └── ui/               # shadcn/uiコンポーネント
├── lib/
│   ├── calculator.ts     # コスト計算ロジック
│   ├── supabase.ts      # Supabaseクライアント
│   └── validation.ts    # Zodバリデーションスキーマ
├── types/
│   └── index.ts         # 型定義
└── data/
    ├── services-pricing.json  # SaaSサービス料金データ
    └── default-plans.json     # デフォルトプラン設定
```

## 主要機能

1. **4ステップ診断フォーム**
   - ステップ1: グループウェアの利用状況
   - ステップ2: 各種サービス（ビデオ会議、チャット、ストレージ、AI）
   - ステップ3: ユーザー情報（会社名、従業員数、名前、メール）
   - ステップ4: 満足度評価

2. **コスト計算**
   - 現在のSaaS利用コスト算出
   - Google Workspace導入後のコスト算出
   - 削減額/増加額の計算
   - 社内サーバーの従業員規模別コスト計算

3. **AI機能比較**
   - Gemini APIによる自動機能比較生成
   - 現在のツールとGoogle Workspaceの比較表

4. **結果保存とメール送信**
   - Supabaseへの診断結果保存
   - Google Apps Scriptによるメール通知

5. **CTA（行動喚起）**
   - 無料相談予約への誘導
   - Timerex/Calendly連携

## データフロー

1. ユーザーがフォームに入力
2. `calculator.ts`がコスト計算を実行
3. 結果をセッションストレージに保存
4. 結果ページに遷移
5. Gemini APIで機能比較を生成
6. Supabaseに診断結果を保存
7. ユーザーがメール送信を選択した場合、GAS Webhookを呼び出し
8. CTAボタンから日程調整ページへ遷移

## 環境変数

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase プロジェクトURL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Supabase 匿名キー
GEMINI_API_KEY                    # Gemini API キー
GAS_WEBHOOK_URL                   # Google Apps Script WebhookのURL
NEXT_PUBLIC_CALENDLY_URL          # 日程調整ツールのURL
```

## 現在のステータス

✅ Next.jsプロジェクト初期化完了
✅ 全主要機能実装済み
✅ ビルド成功（エラーなし）
⚠️ Supabaseデータベース未作成
⚠️ Gemini API未接続
⚠️ 環境変数設定未完了
