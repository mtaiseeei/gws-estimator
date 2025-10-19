/**
 * サービスプランの型定義
 */
export type ServicePlan = {
  planName: string;
  price: number;
  unit: "per_user_per_year" | "per_organization_per_year";
};

/**
 * サービスの型定義
 */
export type Service = {
  serviceName: string;
  plans: ServicePlan[];
};

/**
 * カテゴリの型定義
 */
export type Category = {
  categoryName: string;
  services: Service[];
};

/**
 * ユーザーが選択したサービス情報
 */
export type SelectedService = {
  categoryName: string;
  serviceName: string;
  planName: string;
  licenseCount: number;
  price: number;
};

/**
 * コスト計算結果
 */
export type CostCalculationResult = {
  currentCost: number;
  gwsCost: number;
  savings: number;
  selectedServices: SelectedService[];
  employeeCount: number;
};

/**
 * フォーム入力データ
 */
export type DiagnosisFormData = {
  // ステップ1: グループウェア
  groupware?: string;
  groupwarePlan?: string;
  groupwareLicenses?: number;

  // グループウェアで社内サーバー選択時
  groupwarePaymentMethod?: "purchase" | "lease";
  groupwarePurchaseCost?: number;
  groupwareReplaceYears?: number;
  groupwareLeaseCost?: number;

  // ステップ2: 各種サービス
  videoConference?: string;
  videoConferencePlan?: string;
  videoConferenceLicenses?: number;

  businessChat?: string;
  businessChatPlan?: string;
  businessChatLicenses?: number;

  storage?: string;
  storagePlan?: string;
  storageLicenses?: number;

  // 社内サーバー関連
  storagePaymentMethod?: "purchase" | "lease"; // 買い上げ or リース
  storagePurchaseCost?: number; // 買い上げ時の購入費用
  storageReplaceYears?: number; // 買い替え年数
  storageLeaseCost?: number; // リース時の年額料金

  ai?: string;
  aiPlan?: string;
  aiLicenses?: number;

  biTool?: string;
  biToolPlan?: string;
  biToolLicenses?: number;

  crmTool?: string;
  crmToolPlan?: string;
  crmToolLicenses?: number;

  nocodeTool?: string;
  nocodeToolPlan?: string;
  nocodeToolLicenses?: number;

  // ステップ3: ユーザー情報
  companyName: string;
  employeeCount: number;
  name: string;
  email: string;

  // ステップ4: 満足度
  satisfaction?: string;
};

/**
 * 診断結果のデータベース保存用型
 */
export type DiagnosisResult = {
  id?: string;
  company_name: string;
  employee_count: number;
  email: string;
  name: string;
  current_services: SelectedService[];
  current_cost: number;
  gws_cost: number;
  savings: number;
  satisfaction?: string;
  feature_comparison?: string;
  created_at?: string;
};
