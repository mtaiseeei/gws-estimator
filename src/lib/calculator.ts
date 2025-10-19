import type {
  Category,
  SelectedService,
  CostCalculationResult,
  DiagnosisFormData,
} from "@/types";
import servicesData from "@/data/services-pricing.json";
import defaultPlans from "@/data/default-plans.json";

/**
 * Google Workspace Business Standardの年額単価
 */
const GWS_PRICE_PER_USER_PER_YEAR = 19200;

/**
 * サービス名とプラン名から価格を取得
 */
function getPriceForService(
  serviceName: string,
  planName: string
): number | null {
  const categories = servicesData as Category[];

  for (const category of categories) {
    const service = category.services.find(
      (s) => s.serviceName === serviceName
    );
    if (service) {
      const plan = service.plans.find((p) => p.planName === planName);
      if (plan) {
        return plan.price;
      }
    }
  }

  return null;
}

/**
 * サービス名からデフォルトプランを取得
 */
function getDefaultPlan(serviceName: string): string | null {
  const defaults = defaultPlans as Record<string, string>;
  return defaults[serviceName] || null;
}

/**
 * 社内サーバーの場合、従業員数に応じたプランを返す
 */
function getOnPremiseServerPlan(employeeCount: number): string {
  if (employeeCount <= 10) return "10名規模";
  if (employeeCount <= 20) return "20名規模";
  return "50名規模";
}

/**
 * フォームデータからコスト計算を実行
 */
export function calculateCost(
  formData: DiagnosisFormData
): CostCalculationResult {
  const selectedServices: SelectedService[] = [];
  let totalCurrentCost = 0;

  // グループウェア
  if (formData.groupware && formData.groupware !== "利用していない") {
    let planName = formData.groupwarePlan || "";
    const licenseCount = formData.groupwareLicenses || formData.employeeCount;

    // プラン不明の場合はデフォルトプランを使用
    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.groupware) || "";
    }

    const price = getPriceForService(formData.groupware, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "グループウェア",
        serviceName: formData.groupware,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // ビデオ会議
  if (formData.videoConference && formData.videoConference !== "利用していない") {
    let planName = formData.videoConferencePlan || "";
    const licenseCount = formData.videoConferenceLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.videoConference) || "";
    }

    const price = getPriceForService(formData.videoConference, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "ビデオ会議",
        serviceName: formData.videoConference,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // ビジネスチャット
  if (formData.businessChat && formData.businessChat !== "利用していない") {
    let planName = formData.businessChatPlan || "";
    const licenseCount = formData.businessChatLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.businessChat) || "";
    }

    const price = getPriceForService(formData.businessChat, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "ビジネスチャット",
        serviceName: formData.businessChat,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // クラウドストレージ
  if (formData.storage && formData.storage !== "利用していない") {
    let planName = formData.storagePlan || "";
    const licenseCount = formData.storageLicenses || formData.employeeCount;

    // 社内サーバーの特殊処理
    if (formData.storage === "社内サーバー") {
      planName = getOnPremiseServerPlan(formData.employeeCount);
    } else if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.storage) || "";
    }

    const price = getPriceForService(formData.storage, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "クラウドストレージ",
        serviceName: formData.storage,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // 生成AI
  if (formData.ai && formData.ai !== "利用していない") {
    let planName = formData.aiPlan || "";
    const licenseCount = formData.aiLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.ai) || "";
    }

    const price = getPriceForService(formData.ai, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "生成AI",
        serviceName: formData.ai,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // BIツール
  if (formData.biTool && formData.biTool !== "利用していない") {
    let planName = formData.biToolPlan || "";
    const licenseCount = formData.biToolLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.biTool) || "";
    }

    const price = getPriceForService(formData.biTool, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "BIツール",
        serviceName: formData.biTool,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // CRMツール
  if (formData.crmTool && formData.crmTool !== "利用していない") {
    let planName = formData.crmToolPlan || "";
    const licenseCount = formData.crmToolLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.crmTool) || "";
    }

    const price = getPriceForService(formData.crmTool, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "CRMツール",
        serviceName: formData.crmTool,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // ノーコード/ローコード
  if (formData.nocodeTool && formData.nocodeTool !== "利用していない") {
    let planName = formData.nocodeToolPlan || "";
    const licenseCount = formData.nocodeToolLicenses || formData.employeeCount;

    if (planName === "プランが分からない" || !planName) {
      planName = getDefaultPlan(formData.nocodeTool) || "";
    }

    const price = getPriceForService(formData.nocodeTool, planName);
    if (price !== null) {
      const cost = price * licenseCount;
      totalCurrentCost += cost;
      selectedServices.push({
        categoryName: "ノーコード/ローコード",
        serviceName: formData.nocodeTool,
        planName,
        licenseCount,
        price,
      });
    }
  }

  // Google Workspaceのコスト計算
  const gwsCost = GWS_PRICE_PER_USER_PER_YEAR * formData.employeeCount;

  // 削減額の計算
  const savings = totalCurrentCost - gwsCost;

  return {
    currentCost: totalCurrentCost,
    gwsCost,
    savings,
    selectedServices,
    employeeCount: formData.employeeCount,
  };
}

/**
 * 削減額がプラスかマイナスかを判定
 */
export function isCostReduction(savings: number): boolean {
  return savings > 0;
}

/**
 * 金額をカンマ区切りでフォーマット
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString("ja-JP");
}
