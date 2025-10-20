import { z } from "zod";

/**
 * ステップ1: ユーザー情報のバリデーション
 */
export const step1Schema = z.object({
  companyName: z
    .string()
    .min(1, { message: "会社名を入力してください" }),
  employeeCount: z
    .number()
    .min(1, { message: "従業員数は1名以上で入力してください" }),
  name: z
    .string()
    .min(1, { message: "お名前を入力してください" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),
});

/**
 * ステップ2: グループウェア・コミュニケーションツールのバリデーション
 */
export const step2Schema = z.object({
  groupware: z.string().min(1, { message: "グループウェアを選択してください" }),
  groupwarePlan: z.string().optional(),
  groupwareLicenses: z.number().min(1).optional(),
  groupwarePaymentMethod: z.enum(["purchase", "lease"]).optional(),
  groupwarePurchaseCost: z.number().min(0).optional(),
  groupwareReplaceYears: z.number().min(1).optional(),
  groupwareLeaseCost: z.number().min(0).optional(),
  videoConference: z.string().min(1, { message: "ビデオ会議ツールを選択してください" }),
  videoConferencePlan: z.string().optional(),
  videoConferenceLicenses: z.number().min(1).optional(),
  businessChat: z.string().min(1, { message: "ビジネスチャットを選択してください" }),
  businessChatPlan: z.string().optional(),
  businessChatLicenses: z.number().min(1).optional(),
  storage: z.string().min(1, { message: "クラウドストレージを選択してください" }),
  storagePlan: z.string().optional(),
  storageLicenses: z.number().min(1).optional(),
  storagePaymentMethod: z.enum(["purchase", "lease"]).optional(),
  storagePurchaseCost: z.number().min(0).optional(),
  storageReplaceYears: z.number().min(1).optional(),
  storageLeaseCost: z.number().min(0).optional(),
});

/**
 * ステップ3: 業務ツールのバリデーション
 */
export const step3Schema = z.object({
  ai: z.string().min(1, { message: "生成AIを選択してください" }),
  aiPlan: z.string().optional(),
  aiLicenses: z.number().min(1).optional(),
  biTool: z.string().min(1, { message: "BIツールを選択してください" }),
  biToolPlan: z.string().optional(),
  biToolLicenses: z.number().min(1).optional(),
  crmTool: z.string().min(1, { message: "CRMツールを選択してください" }),
  crmToolPlan: z.string().optional(),
  crmToolLicenses: z.number().min(1).optional(),
  nocodeTool: z.string().min(1, { message: "ノーコード/ローコードツールを選択してください" }),
  nocodeToolPlan: z.string().optional(),
  nocodeToolLicenses: z.number().min(1).optional(),
});

/**
 * ステップ4: 満足度のバリデーション
 */
export const step4Schema = z.object({
  satisfaction: z.string().min(1, { message: "満足度を選択してください" }),
});

/**
 * 診断フォームのバリデーションスキーマ（全体）
 */
export const diagnosisFormSchema = z.object({
  // ステップ1: グループウェア
  groupware: z.string().optional(),
  groupwarePlan: z.string().optional(),
  groupwareLicenses: z.number().min(1).optional(),

  // グループウェアで社内サーバー選択時
  groupwarePaymentMethod: z.enum(["purchase", "lease"]).optional(),
  groupwarePurchaseCost: z.number().min(0).optional(),
  groupwareReplaceYears: z.number().min(1).optional(),
  groupwareLeaseCost: z.number().min(0).optional(),

  // ステップ2: ビデオ会議
  videoConference: z.string().optional(),
  videoConferencePlan: z.string().optional(),
  videoConferenceLicenses: z.number().min(1).optional(),

  // ステップ2: ビジネスチャット
  businessChat: z.string().optional(),
  businessChatPlan: z.string().optional(),
  businessChatLicenses: z.number().min(1).optional(),

  // ステップ2: クラウドストレージ
  storage: z.string().optional(),
  storagePlan: z.string().optional(),
  storageLicenses: z.number().min(1).optional(),

  // 社内サーバー関連
  storagePaymentMethod: z.enum(["purchase", "lease"]).optional(),
  storagePurchaseCost: z.number().min(0).optional(),
  storageReplaceYears: z.number().min(1).optional(),
  storageLeaseCost: z.number().min(0).optional(),

  // ステップ2: 生成AI
  ai: z.string().optional(),
  aiPlan: z.string().optional(),
  aiLicenses: z.number().min(1).optional(),

  // ステップ2: BIツール
  biTool: z.string().optional(),
  biToolPlan: z.string().optional(),
  biToolLicenses: z.number().min(1).optional(),

  // ステップ2: CRMツール
  crmTool: z.string().optional(),
  crmToolPlan: z.string().optional(),
  crmToolLicenses: z.number().min(1).optional(),

  // ステップ2: ノーコード/ローコード
  nocodeTool: z.string().optional(),
  nocodeToolPlan: z.string().optional(),
  nocodeToolLicenses: z.number().min(1).optional(),

  // ステップ3: ユーザー情報
  companyName: z
    .string()
    .min(1, { message: "会社名を入力してください" }),
  employeeCount: z
    .number()
    .min(1, { message: "従業員数は1名以上で入力してください" }),
  name: z
    .string()
    .min(1, { message: "お名前を入力してください" }),
  email: z
    .string()
    .email({ message: "有効なメールアドレスを入力してください" }),

  // ステップ4: 満足度
  satisfaction: z.string().optional(),
});

export type DiagnosisFormSchema = z.infer<typeof diagnosisFormSchema>;
