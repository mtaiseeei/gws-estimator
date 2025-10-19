"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, isCostReduction } from "@/lib/calculator";
import type {
  CostCalculationResult,
  DiagnosisFormData,
  SelectedService,
} from "@/types";

export default function ResultPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<DiagnosisFormData | null>(null);
  const [calculation, setCalculation] = useState<CostCalculationResult | null>(
    null
  );
  const [comparison, setComparison] = useState<string>("");
  const [isLoadingComparison, setIsLoadingComparison] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 既に初期化済みの場合はスキップ（重複実行防止）
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // セッションストレージから診断結果を取得
    const storedData = sessionStorage.getItem("diagnosisResult");

    if (!storedData) {
      router.push("/");
      return;
    }

    const { formData, calculation } = JSON.parse(storedData);
    setFormData(formData);
    setCalculation(calculation);

    // Gemini APIで機能比較を生成と結果保存
    const loadData = async () => {
      if (calculation.selectedServices.length > 0) {
        await generateComparison(calculation.selectedServices);
      }
      await saveResult(formData, calculation);
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const generateComparison = async (selectedServices: SelectedService[]) => {
    setIsLoadingComparison(true);
    try {
      const response = await fetch("/api/generate-comparison", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedServices }),
      });

      if (response.ok) {
        const data = await response.json();
        setComparison(data.comparison);
      }
    } catch (error) {
      console.error("Failed to generate comparison:", error);
    } finally {
      setIsLoadingComparison(false);
    }
  };

  const saveResult = async (
    formData: DiagnosisFormData,
    calculation: CostCalculationResult
  ) => {
    try {
      await fetch("/api/save-result", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: formData.companyName,
          employee_count: formData.employeeCount,
          email: formData.email,
          name: formData.name,
          current_services: calculation.selectedServices,
          current_cost: calculation.currentCost,
          gws_cost: calculation.gwsCost,
          savings: calculation.savings,
          satisfaction: formData.satisfaction,
          feature_comparison: comparison,
        }),
      });
    } catch (error) {
      console.error("Failed to save result:", error);
    }
  };

  const handleSendEmail = async () => {
    if (!formData || !calculation) return;

    setIsSendingEmail(true);
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name,
          companyName: formData.companyName,
          currentCost: calculation.currentCost,
          gwsCost: calculation.gwsCost,
          savings: calculation.savings,
        }),
      });

      if (response.ok) {
        setEmailSent(true);
        alert("診断結果をメールで送信しました。");
      } else {
        alert("メール送信に失敗しました。");
      }
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("メール送信に失敗しました。");
    } finally {
      setIsSendingEmail(false);
    }
  };

  const handleScheduling = () => {
    const schedulingUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "#";
    window.open(schedulingUrl, "_blank");
  };

  if (!formData || !calculation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  const isReduction = isCostReduction(calculation.savings);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-blue-600">
            Google Workspace コスト削減診断
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* 診断結果サマリー */}
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-2xl text-center">
              診断結果
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-2">{formData.companyName} 様</p>
              <p className="text-sm text-gray-500">
                従業員数: {calculation.employeeCount}名
              </p>
            </div>

            {/* コスト比較 */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-1">現在の年間コスト</p>
                <p className="text-2xl font-bold text-gray-900">
                  ¥{formatCurrency(calculation.currentCost)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-600 mb-1">
                  Google Workspace導入後
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ¥{formatCurrency(calculation.gwsCost)}
                </p>
              </div>
              <div
                className={`${
                  isReduction ? "bg-green-50" : "bg-orange-50"
                } p-4 rounded-lg text-center`}
              >
                <p
                  className={`text-sm ${
                    isReduction ? "text-green-600" : "text-orange-600"
                  } mb-1`}
                >
                  {isReduction ? "年間削減額" : "年間増加額"}
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isReduction ? "text-green-600" : "text-orange-600"
                  }`}
                >
                  {isReduction ? "+" : "-"}¥
                  {formatCurrency(Math.abs(calculation.savings))}
                </p>
              </div>
            </div>

            {/* メリット訴求 */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg mb-6">
              {isReduction ? (
                <div className="text-center">
                  <p className="text-3xl font-bold mb-2">
                    年間 ¥{formatCurrency(calculation.savings)} のコスト削減が可能です！
                  </p>
                  <p className="text-blue-100">
                    さらに、統合による生産性向上とセキュリティ強化も実現できます。
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-2xl font-bold mb-2">
                    年間 ¥{formatCurrency(Math.abs(calculation.savings))} の費用増となりますが...
                  </p>
                  <p className="text-blue-100 mb-2">
                    Google Workspaceなら、価格以上のメリットがあります：
                  </p>
                  <ul className="text-sm space-y-1 text-left max-w-md mx-auto">
                    <li>✓ Gemini AIによる生産性向上</li>
                    <li>✓ 統合環境による業務効率化</li>
                    <li>✓ エンタープライズレベルのセキュリティ</li>
                    <li>✓ シームレスな共同作業環境</li>
                  </ul>
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 text-center">
              ※本診断結果はあくまで目安であり、実際の削減額を保証するものではありません。
            </p>
          </CardContent>
        </Card>

        {/* 選択されたサービス一覧 */}
        <Card>
          <CardHeader>
            <CardTitle>現在ご利用中のサービス</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {calculation.selectedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium">{service.serviceName}</p>
                    <p className="text-sm text-gray-600">
                      {service.planName} × {service.licenseCount}ライセンス
                    </p>
                  </div>
                  <p className="font-semibold">
                    ¥{formatCurrency(service.price * service.licenseCount)}
                    /年
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 機能比較 */}
        <Card>
          <CardHeader>
            <CardTitle>機能比較</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingComparison ? (
              <p className="text-center text-gray-500">
                AI が機能比較を生成中...
              </p>
            ) : comparison ? (
              <div className="prose max-w-none">
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: comparison.replace(/\n/g, "<br />"),
                  }}
                />
              </div>
            ) : (
              <p className="text-center text-gray-500">
                機能比較を生成できませんでした
              </p>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg font-semibold mb-4">
                  さらに詳しく知りたい方へ
                </p>
                <p className="text-sm text-gray-600 mb-6">
                  Google
                  Workspaceの専門家が、御社の状況に合わせた最適なプランをご提案します。
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    onClick={handleScheduling}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    無料相談を予約する
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || emailSent}
                  >
                    {emailSent
                      ? "メール送信済み"
                      : isSendingEmail
                      ? "送信中..."
                      : "診断結果をメールで受け取る"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-blue-600"
            >
              ← トップページに戻る
            </Button>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © 2025 ShigApps Inc.
          </p>
        </div>
      </footer>
    </div>
  );
}
