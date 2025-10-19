import { z } from "zod";

/**
 * 診断フォームのバリデーションスキーマ
 */
export const diagnosisFormSchema = z.object({
  // ステップ1: グループウェア
  groupware: z.string().optional(),
  groupwarePlan: z.string().optional(),
  groupwareLicenses: z.number().min(1).optional(),

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
}).refine(
  (data) => {
    // 少なくとも1つのサービスが選択されていることを確認
    return (
      (data.groupware && data.groupware !== "利用していない") ||
      (data.videoConference && data.videoConference !== "利用していない") ||
      (data.businessChat && data.businessChat !== "利用していない") ||
      (data.storage && data.storage !== "利用していない") ||
      (data.ai && data.ai !== "利用していない") ||
      (data.biTool && data.biTool !== "利用していない") ||
      (data.crmTool && data.crmTool !== "利用していない") ||
      (data.nocodeTool && data.nocodeTool !== "利用していない")
    );
  },
  {
    message: "少なくとも1つのサービスを選択してください",
    path: ["groupware"],
  }
);

export type DiagnosisFormSchema = z.infer<typeof diagnosisFormSchema>;
