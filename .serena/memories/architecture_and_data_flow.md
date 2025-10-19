# アーキテクチャとデータフロー

## システムアーキテクチャ

```
┌─────────────┐
│   ユーザー   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────┐
│  Next.js フロントエンド (Vercel)    │
│  ┌─────────────────────────────┐  │
│  │  ランディングページ          │  │
│  │  (src/app/page.tsx)        │  │
│  └─────────────┬───────────────┘  │
│                │                   │
│                ▼                   │
│  ┌─────────────────────────────┐  │
│  │  診断フォーム                │  │
│  │  (DiagnosisForm.tsx)        │  │
│  └─────────────┬───────────────┘  │
│                │                   │
│                ▼                   │
│  ┌─────────────────────────────┐  │
│  │  コスト計算                  │  │
│  │  (lib/calculator.ts)        │  │
│  └─────────────┬───────────────┘  │
│                │                   │
│                ▼                   │
│  ┌─────────────────────────────┐  │
│  │  結果ページ                  │  │
│  │  (src/app/result/page.tsx)  │  │
│  └──┬──────────┬──────────┬────┘  │
└─────┼──────────┼──────────┼───────┘
      │          │          │
      ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐
│ Supabase │ │  Gemini  │ │   GAS    │
│   DB     │ │   API    │ │ Webhook  │
└──────────┘ └──────────┘ └──────────┘
```

## データフロー詳細

### 1. フォーム入力フェーズ

```
ユーザー入力
    ↓
React Hook Form (バリデーション)
    ↓
Zod Schema (型チェック)
    ↓
FormDataオブジェクト生成
```

### 2. コスト計算フェーズ

```
FormData
    ↓
calculator.ts
    ├→ services-pricing.json 参照
    ├→ default-plans.json 参照
    └→ コスト計算実行
        ├→ 現在のコスト算出
        ├→ GWSコスト算出
        └→ 削減額算出
    ↓
CostCalculationResult
    ↓
SessionStorage保存
```

### 3. 結果表示フェーズ

```
SessionStorageから取得
    ↓
result/page.tsx
    ├→ API: /api/generate-comparison
    │   └→ Gemini API呼び出し
    │       └→ 機能比較テキスト生成
    │
    ├→ API: /api/save-result
    │   └→ Supabaseにデータ保存
    │
    └→ ユーザーアクション待機
        ├→ メール送信ボタン
        │   └→ API: /api/send-email
        │       └→ GAS Webhook呼び出し
        │
        └→ 無料相談予約ボタン
            └→ Timerex/Calendlyへ遷移
```

## コアコンポーネント

### calculator.ts (コスト計算エンジン)

**主要関数:**

1. `calculateCost(formData: DiagnosisFormData): CostCalculationResult`
   - メインの計算ロジック
   - 全サービスのコストを集計
   - GWSコストと比較

2. `getPriceForService(serviceName: string, planName: string): number | null`
   - services-pricing.jsonから料金取得

3. `getDefaultPlan(serviceName: string): string | null`
   - default-plans.jsonからデフォルトプラン取得

4. `getOnPremiseServerPlan(employeeCount: number): string`
   - 従業員数に応じた社内サーバープラン選択
   - 10名以下: "10名規模"
   - 20名以下: "20名規模"
   - 50名以上: "50名規模"

5. `formatCurrency(amount: number): string`
   - 金額フォーマット（カンマ区切り）

6. `isCostReduction(savings: number): boolean`
   - 削減か増加かの判定

**定数:**
- `GWS_PRICE_PER_USER_PER_YEAR = 19200` (円)

### supabase.ts (データベース連携)

**主要関数:**

1. `saveDiagnosisResult(result: DiagnosisResult): Promise<{success, error?, id?}>`
   - 診断結果をSupabaseに保存
   - RLSポリシーで公開INSERT許可

**エクスポート:**
- `supabase` - Supabaseクライアントインスタンス
- `Database` - データベース型定義

### validation.ts (フォームバリデーション)

**スキーマ:**
- `diagnosisFormSchema` - Zodスキーマ定義
  - 必須フィールド: companyName, employeeCount, name, email
  - オプション: 各種サービス選択
  - カスタムバリデーション: 最低1サービス選択必須

## データ構造

### services-pricing.json

```json
[
  {
    "categoryName": "グループウェア",
    "services": [
      {
        "serviceName": "Microsoft 365",
        "plans": [
          {
            "planName": "Business Basic",
            "price": 10788,
            "unit": "per_user_per_year"
          }
        ]
      }
    ]
  }
]
```

### default-plans.json

```json
{
  "Zoom": "プロ",
  "Slack": "プロ",
  "Dropbox": "Standard (Business)",
  ...
}
```

## APIエンドポイント

### POST /api/generate-comparison

**リクエスト:**
```json
{
  "selectedServices": [
    {
      "categoryName": "ビデオ会議",
      "serviceName": "Zoom",
      "planName": "プロ",
      "licenseCount": 10,
      "price": 20000
    }
  ]
}
```

**レスポンス:**
```json
{
  "comparison": "# 機能比較\n\n| 現在のツール | Google Workspace | メリット |\n..."
}
```

**処理:**
1. プロンプト生成
2. Gemini API呼び出し
3. Markdownテーブル返却

### POST /api/save-result

**リクエスト:**
```json
{
  "company_name": "株式会社テスト",
  "employee_count": 10,
  "email": "test@example.com",
  "name": "山田太郎",
  "current_services": [...],
  "current_cost": 500000,
  "gws_cost": 192000,
  "savings": 308000,
  "satisfaction": "普通",
  "feature_comparison": "..."
}
```

**レスポンス:**
```json
{
  "success": true,
  "id": "uuid"
}
```

### POST /api/send-email

**リクエスト:**
```json
{
  "email": "test@example.com",
  "name": "山田太郎",
  "companyName": "株式会社テスト",
  "currentCost": 500000,
  "gwsCost": 192000,
  "savings": 308000
}
```

**レスポンス:**
```json
{
  "success": true
}
```

**処理:**
1. GAS Webhook呼び出し
2. メール本文生成（GAS側）
3. GmailApp.sendEmailで送信

## 状態管理

### SessionStorage

```typescript
// 保存
sessionStorage.setItem("diagnosisResult", JSON.stringify({
  formData: DiagnosisFormData,
  calculation: CostCalculationResult
}));

// 取得
const storedData = sessionStorage.getItem("diagnosisResult");
const { formData, calculation } = JSON.parse(storedData);
```

**用途:**
- フォーム送信後、結果ページ遷移時のデータ受け渡し
- ページリロード時はデータ消失（意図的）

### React State

- `useState` - コンポーネント内の状��管理
- `useForm` - フォーム状態管理（React Hook Form）
- `useEffect` - 副作用処理（データ取得、API呼び出し）

## セキュリティ考慮事項

1. **環境変数管理**
   - APIキーは`.env.local`で管理
   - クライアント側: `NEXT_PUBLIC_*`
   - サーバー側: `GEMINI_API_KEY`, `GAS_WEBHOOK_URL`

2. **Supabase RLS**
   - 公開アクセスはINSERTのみ許可
   - SELECTは管理者のみ

3. **入力バリデーション**
   - Zodスキーマで型安全性保証
   - メールアドレス形式チェック
   - SQLインジェクション対策（Supabaseクライアント使用）

4. **CORS設定**
   - Next.js API Routesはデフォルトで同一オリジンのみ
