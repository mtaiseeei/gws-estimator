"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6 flex items-center justify-between">
          {/* 左側: ロゴ + タイトル */}
          <div className="flex items-center gap-3 md:gap-4">
            <img
              src="/logos/company-logo.png"
              alt="ShigApps Logo"
              className="h-8 md:h-10 w-auto object-contain"
            />
            <h1 className="text-lg md:text-2xl font-bold text-blue-600">
              Google Workspace コスト削減診断
            </h1>
          </div>

          {/* 右側: ホームページリンク */}
          <a
            href="https://shigapps.jp"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all shadow-md hover:shadow-lg hover:scale-105"
          >
            <span>ShigApps ホームページ</span>
            <span>→</span>
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        {/* 完了ヒーローセクション */}
        <div className="text-center py-8 animate-fade-in">
          <div className="inline-block mb-4">
            <span className="text-6xl animate-bounce-once">🎉</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            診断完了！
          </h2>
          <p className="text-gray-600">
            {formData.companyName} 様の診断結果をご確認ください
          </p>
        </div>

        {/* 診断結果サマリー */}
        <Card className="border-2 border-blue-200 shadow-xl overflow-hidden animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-blue-50 via-cyan-50 to-blue-50">
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <span className="text-3xl">💰</span>
              <span>コスト診断結果</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="text-center mb-8">
              <p className="text-xl font-semibold text-gray-800 mb-2">
                {formData.companyName} 様
              </p>
              <p className="text-sm text-gray-600 bg-gray-100 inline-block px-4 py-1 rounded-full">
                👥 従業員数: {calculation.employeeCount}名
              </p>
            </div>

            {/* コスト比較カード */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* 現在のコスト */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl text-center border-2 border-gray-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="text-3xl mb-2">💸</div>
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  現在の年間コスト
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  ¥{formatCurrency(calculation.currentCost)}
                </p>
              </div>

              {/* GWS導入後 */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl text-center border-2 border-blue-200 hover:shadow-lg transition-all hover:scale-105">
                <div className="text-3xl mb-2">🚀</div>
                <p className="text-sm font-semibold text-blue-700 mb-2">
                  Google Workspace導入後
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  ¥{formatCurrency(calculation.gwsCost)}
                </p>
              </div>

              {/* 削減額 */}
              <div
                className={`${
                  isReduction
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
                    : "bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
                } p-6 rounded-xl text-center border-2 hover:shadow-lg transition-all hover:scale-105`}
              >
                <div className="text-3xl mb-2">
                  {isReduction ? "✨" : "💡"}
                </div>
                <p
                  className={`text-sm font-semibold ${
                    isReduction ? "text-green-700" : "text-orange-700"
                  } mb-2`}
                >
                  {isReduction ? "年間削減額" : "年間増加額"}
                </p>
                <p
                  className={`text-3xl font-bold ${
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
        <Card className="overflow-hidden animate-fade-in">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <span>現在ご利用中のサービス</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {calculation.selectedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 hover:shadow-md transition-all hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">📱</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {service.serviceName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {service.planName} × {service.licenseCount}ライセンス
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-lg text-blue-600">
                    ¥{formatCurrency(service.price * service.licenseCount)}
                    <span className="text-sm text-gray-500 font-normal">/年</span>
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 機能比較 */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50">
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span>機能比較</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {isLoadingComparison ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-600 font-medium">
                    Gemini AI が機能比較を生成中...
                  </p>
                </div>
                {/* スケルトンローディング */}
                <div className="space-y-3 animate-pulse">
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                  <div className="h-8 bg-gray-100 rounded"></div>
                </div>
              </div>
            ) : comparison ? (
              <div className="markdown-table-container prose prose-blue max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    table: ({ node, ...props }) => (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg" {...props} />
                      </div>
                    ),
                    thead: ({ node, ...props }) => (
                      <thead className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white" {...props} />
                    ),
                    th: ({ node, ...props }) => (
                      <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider" {...props} />
                    ),
                    td: ({ node, ...props }) => (
                      <td className="px-6 py-4 text-sm text-gray-700 border-t border-gray-200" {...props} />
                    ),
                    tbody: ({ node, ...props }) => (
                      <tbody className="bg-white divide-y divide-gray-200" {...props} />
                    ),
                    tr: ({ node, ...props }) => (
                      <tr className="hover:bg-blue-50 transition-colors" {...props} />
                    ),
                  }}
                >
                  {comparison}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-2">⚠️ 機能比較を生成できませんでした</p>
                <p className="text-sm text-gray-400">
                  恐れ入りますが、ページを再読み込みしてください
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="space-y-6 animate-fade-in">
          <Card className="bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 border-2 border-blue-200 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8">
              <div className="text-center">
                <div className="inline-block mb-4">
                  <span className="text-5xl">🚀</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  次のステップへ
                </h3>
                <p className="text-base md:text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
                  Google Workspace の専門家が、御社の状況に合わせた<br className="hidden md:block" />
                  最適なプランと導入方法をご提案します。
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <Button
                    size="lg"
                    onClick={handleScheduling}
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    📅 無料相談を予約する
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleSendEmail}
                    disabled={isSendingEmail || emailSent}
                    className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all hover:scale-105"
                  >
                    {emailSent
                      ? "✓ メール送信済み"
                      : isSendingEmail
                      ? "📧 送信中..."
                      : "📧 診断結果をメールで受け取る"}
                  </Button>
                </div>

                <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>完全無料</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>オンライン対応</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span>即日対応可能</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center space-y-4">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
            >
              ← トップページに戻る
            </Button>

            <div className="pt-4">
              <a
                href="https://shigapps.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                ShigApps について詳しく見る →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* フッター */}
      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-6">
              <img
                src="/logos/company-logo.png"
                alt="ShigApps Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="text-xl font-bold">ShigApps Inc.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm text-gray-400">
              <a
                href="https://shigapps.jp"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                ホームページ
              </a>
              <span className="hidden sm:inline">|</span>
              <a
                href="https://shigapps.jp/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                お問い合わせ
              </a>
            </div>

            <p className="text-sm text-gray-500 pt-4">
              © 2025 ShigApps Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
