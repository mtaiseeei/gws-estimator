# コーディングスタイルと規約

## 言語とツール

- **言語**: TypeScript 5
- **フレームワーク**: Next.js 15 (App Router)
- **パッケージマネージャー**: npm
- **リンター**: ESLint (Next.js config)
- **フォーマッター**: Prettier（設定は暗黙的）

## 命名規則

### ファイル名

```typescript
// Reactコンポーネント: PascalCase
DiagnosisForm.tsx
ResultPage.tsx

// ユーティリティ・ライブラリ: camelCase
calculator.ts
supabase.ts
validation.ts

// 型定義ファイル: camelCase
index.ts (types/)

// APIルート: kebab-case（ディレクトリ名）
generate-comparison/
save-result/
send-email/
```

### 変数・関数

```typescript
// 変数: camelCase
const employeeCount = 10;
const currentCost = 500000;

// 関数: camelCase
function calculateCost(formData: DiagnosisFormData) { }
function formatCurrency(amount: number) { }

// 定数: UPPER_SNAKE_CASE
const GWS_PRICE_PER_USER_PER_YEAR = 19200;
const MAX_EMPLOYEES = 1000;

// コンポーネント: PascalCase
export default function DiagnosisForm() { }
function ResultPage() { }
```

### 型定義

```typescript
// 型・インターフェース: PascalCase
type ServicePlan = {
  planName: string;
  price: number;
};

interface DiagnosisFormData {
  companyName: string;
  employeeCount: number;
}

// 型エイリアス
type SelectedService = {
  categoryName: string;
  serviceName: string;
};
```

## TypeScript規約

### 型の使用

```typescript
// ✅ 推奨: 明示的な型定義
function calculateCost(formData: DiagnosisFormData): CostCalculationResult {
  // ...
}

// ✅ 推奨: constアサーション
const categories = servicesData as Category[];

// ❌ 非推奨: any型の使用
// ESLintでエラーになります
function processData(data: any) { } // NG

// ✅ 正しい: 適切な型定義
function processData(data: SelectedService[]) { } // OK
```

### 変数宣言

```typescript
// ✅ 推奨: const優先、再代入が必要な場合のみlet
const planName = formData.groupwarePlan || "";
let totalCost = 0;

// ❌ 非推奨: 再代入しない変数にlet
let licenseCount = formData.groupwareLicenses; // NG
const licenseCount = formData.groupwareLicenses; // OK
```

## Reactコンポーネント規約

### コンポーネント定義

```typescript
// ✅ 推奨: 関数宣言（デフォルトエクスポート）
export default function DiagnosisForm() {
  // ...
}

// ✅ 推奨: クライアントコンポーネントの明示
"use client";

import { useState } from "react";

export default function ResultPage() {
  const [data, setData] = useState(null);
  // ...
}
```

### Hooks使用規則

```typescript
// ✅ 推奨: React Hook Formの使用
const { register, handleSubmit, watch, setValue } = useForm<DiagnosisFormData>({
  resolver: zodResolver(diagnosisFormSchema),
});

// ✅ 推奨: useEffectの依存配列
useEffect(() => {
  loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [router]); // 必要に応じてeslint-disableを使用
```

## インポート規約

```typescript
// 1. React関連
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// 2. サードパーティライブラリ
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// 3. 自作コンポーネント（@/*エイリアス使用）
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 4. ユーティリティ・型定義
import { calculateCost } from "@/lib/calculator";
import type { DiagnosisFormData } from "@/types";

// 5. データファイル
import servicesData from "@/data/services-pricing.json";
```

## コメント規約

```typescript
/**
 * JSDoc形式のコメント（関数・型定義）
 * 
 * @param formData - ユーザーが入力したフォームデータ
 * @returns コスト計算結果
 */
export function calculateCost(
  formData: DiagnosisFormData
): CostCalculationResult {
  // 単行コメント: 処理の説明
  const selectedServices: SelectedService[] = [];
  
  // 複雑なロジックには説明を追加
  // グループウェアの場合、プラン不明時はデフォルトプランを使用
  if (planName === "プランが分からない" || !planName) {
    planName = getDefaultPlan(formData.groupware) || "";
  }
}
```

## エラーハンドリング

```typescript
// ✅ 推奨: try-catchでエラーをキャッチ
try {
  const { data, error } = await supabase.from("diagnosis_results").insert([...]);
  
  if (error) {
    console.error("Supabase insert error:", error);
    return { success: false, error: error.message };
  }
  
  return { success: true, id: data?.[0]?.id };
} catch (error) {
  console.error("Save diagnosis result error:", error);
  return {
    success: false,
    error: error instanceof Error ? error.message : "Unknown error",
  };
}
```

## UIコンポーネント規約

```typescript
// ✅ 推奨: shadcn/uiコンポーネントの使用
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ✅ 推奨: Tailwind CSSクラスの使用
<div className="max-w-3xl mx-auto px-4 py-8">
  <Card className="border-2 border-blue-200">
    <CardHeader className="bg-blue-50">
      <CardTitle className="text-2xl text-center">診断結果</CardTitle>
    </CardHeader>
  </Card>
</div>

// ✅ 推奨: レスポンシブデザイン（モバイルファースト）
<div className="grid md:grid-cols-3 gap-4">
  {/* 内容 */}
</div>
```

## デザイン規約

```typescript
// カラーパレット
const colors = {
  primary: "#3B82F6",    // ブルー（アクセント）
  base: "#FFFFFF",       // 白（背景）
  gray: "#6B7280",       // グレー（テキスト）
  success: "#10B981",    // グリーン（成功）
  error: "#EF4444",      // レッド（エラー）
};

// 余白（Tailwind CSS）
// p-4, p-6, p-8 (padding)
// mb-2, mb-4, mb-6 (margin-bottom)
// space-y-4, space-y-6 (vertical spacing)
```

## ESLint設定

```typescript
// eslint.config.mjs
// - Next.js推奨設定を使用
// - TypeScript対応
// - react-hooks/exhaustive-deps警告有効
// - @typescript-eslint/no-explicit-any エラー
```

## 避けるべきパターン

```typescript
// ❌ any型の使用
function process(data: any) { }

// ❌ 再代入しない変数にlet
let count = 10; // 再代入しない場合

// ❌ インラインスタイル（Tailwind CSS推奨）
<div style={{ color: "blue" }}>

// ❌ HTMLタグの直接使用（shadcn/ui推奨）
<button>クリック</button> // Buttonコンポーネントを使用

// ❌ 絶対パスの使用（@/*エイリアス推奨）
import { Button } from "../../../components/ui/button";
```
