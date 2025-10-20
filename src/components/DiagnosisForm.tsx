"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { diagnosisFormSchema, step1Schema, step2Schema, step3Schema, step4Schema } from "@/lib/validation";
import type { DiagnosisFormData, Category } from "@/types";
import servicesData from "@/data/services-pricing.json";
import { calculateCost } from "@/lib/calculator";

const categories = servicesData as Category[];

export default function DiagnosisForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stepErrors, setStepErrors] = useState<string[]>([]);
  const [bounceEmoji, setBounceEmoji] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisFormSchema),
    mode: "onChange",
    defaultValues: {
      employeeCount: 10,
    },
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  // 選択されたサービスを監視
  const selectedGroupware = watch("groupware");
  const selectedVideoConference = watch("videoConference");
  const selectedBusinessChat = watch("businessChat");
  const selectedStorage = watch("storage");
  const selectedStoragePaymentMethod = watch("storagePaymentMethod");
  const selectedAI = watch("ai");
  const selectedBITool = watch("biTool");
  const selectedCRMTool = watch("crmTool");
  const selectedNocodeTool = watch("nocodeTool");
  const selectedSatisfaction = watch("satisfaction");

  // 各カテゴリのサービスを取得
  const groupwareCategory = categories.find(
    (c) => c.categoryName === "グループウェア"
  );
  const videoCategory = categories.find(
    (c) => c.categoryName === "ビデオ会議"
  );
  const chatCategory = categories.find(
    (c) => c.categoryName === "ビジネスチャット"
  );
  const storageCategory = categories.find(
    (c) => c.categoryName === "クラウドストレージ"
  );
  const aiCategory = categories.find((c) => c.categoryName === "生成AI");
  const biToolCategory = categories.find((c) => c.categoryName === "BIツール");
  const crmToolCategory = categories.find((c) => c.categoryName === "CRMツール");
  const nocodeToolCategory = categories.find((c) => c.categoryName === "ノーコード/ローコード");

  // 価格フォーマット関数
  const formatPrice = (price: number): string => {
    return `¥${price.toLocaleString()}/年`;
  };

  // 選択されたサービスのプランを取得
  const getPlansForService = (categoryName: string, serviceName?: string) => {
    if (!serviceName || serviceName === "利用していない") return [];
    const category = categories.find((c) => c.categoryName === categoryName);
    const service = category?.services.find(
      (s) => s.serviceName === serviceName
    );
    return service?.plans || [];
  };

  const onSubmit = async (data: DiagnosisFormData) => {
    setIsSubmitting(true);

    try {
      // コスト計算
      const result = calculateCost(data);

      // 結果をセッションストレージに保存して次のページへ
      sessionStorage.setItem(
        "diagnosisResult",
        JSON.stringify({
          formData: data,
          calculation: result,
        })
      );

      router.push("/result");
    } catch (error) {
      console.error("Form submission error:", error);
      alert("エラーが発生しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = async (currentStep: number): Promise<boolean> => {
    setStepErrors([]);
    const formData = getValues();

    try {
      switch (currentStep) {
        case 1:
          await step1Schema.parseAsync({
            companyName: formData.companyName,
            employeeCount: formData.employeeCount,
            name: formData.name,
            email: formData.email,
          });
          break;
        case 2:
          await step2Schema.parseAsync({
            groupware: formData.groupware,
            groupwarePlan: formData.groupwarePlan,
            groupwareLicenses: formData.groupwareLicenses,
            groupwarePaymentMethod: formData.groupwarePaymentMethod,
            groupwarePurchaseCost: formData.groupwarePurchaseCost,
            groupwareReplaceYears: formData.groupwareReplaceYears,
            groupwareLeaseCost: formData.groupwareLeaseCost,
            videoConference: formData.videoConference,
            videoConferencePlan: formData.videoConferencePlan,
            videoConferenceLicenses: formData.videoConferenceLicenses,
            businessChat: formData.businessChat,
            businessChatPlan: formData.businessChatPlan,
            businessChatLicenses: formData.businessChatLicenses,
            storage: formData.storage,
            storagePlan: formData.storagePlan,
            storageLicenses: formData.storageLicenses,
            storagePaymentMethod: formData.storagePaymentMethod,
            storagePurchaseCost: formData.storagePurchaseCost,
            storageReplaceYears: formData.storageReplaceYears,
            storageLeaseCost: formData.storageLeaseCost,
          });
          break;
        case 3:
          await step3Schema.parseAsync({
            ai: formData.ai,
            aiPlan: formData.aiPlan,
            aiLicenses: formData.aiLicenses,
            biTool: formData.biTool,
            biToolPlan: formData.biToolPlan,
            biToolLicenses: formData.biToolLicenses,
            crmTool: formData.crmTool,
            crmToolPlan: formData.crmToolPlan,
            crmToolLicenses: formData.crmToolLicenses,
            nocodeTool: formData.nocodeTool,
            nocodeToolPlan: formData.nocodeToolPlan,
            nocodeToolLicenses: formData.nocodeToolLicenses,
          });
          break;
        case 4:
          await step4Schema.parseAsync({
            satisfaction: formData.satisfaction,
          });
          break;
      }
      return true;
    } catch (error: unknown) {
      console.error('Validation error:', error);

      if (error && typeof error === 'object' && 'issues' in error) {
        // Zod validation error
        const zodError = error as { issues: Array<{ message: string; path: Array<string | number> }> };
        const errorMessages = zodError.issues.map((issue) => {
          const fieldName = issue.path.join('.');
          return fieldName ? `${fieldName}: ${issue.message}` : issue.message;
        });
        setStepErrors(errorMessages);
      } else if (error && typeof error === 'object' && 'message' in error) {
        // Generic error with message
        setStepErrors([(error as { message: string }).message]);
      } else {
        // Unknown error
        setStepErrors(['入力内容を確認してください']);
      }

      return false;
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(step);
    if (isValid && step < totalSteps) {
      setStep(step + 1);
      setStepErrors([]);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      setStepErrors([]);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Google Workspace コスト削減診断
          </CardTitle>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span className="font-semibold">ステップ {step} / {totalSteps}</span>
              <span className="font-semibold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ステップ1: ユーザー情報 */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">まずは基本情報を教えてください</h3>
                  <p className="text-gray-600">診断結果をお送りするために必要な情報です</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名 *</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    placeholder="株式会社○○"
                    className="focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-200"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span>
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeCount">従業員数 *</Label>
                  <Input
                    id="employeeCount"
                    type="number"
                    {...register("employeeCount", { valueAsNumber: true })}
                    placeholder="10"
                    className="focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-200"
                  />
                  {errors.employeeCount && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span>
                      {errors.employeeCount.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">お名前 *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="山田 太郎"
                    className="focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-200"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@company.com"
                    className="focus:ring-2 focus:ring-blue-500 focus:scale-[1.02] transition-all duration-200"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <span>⚠</span>
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Step validation errors */}
                {stepErrors.length > 0 && (
                  <div className="animate-shake bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    {stepErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    次へ →
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ2: グループウェア */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-lg font-semibold">
                  現在のグループウェアの利用状況
                </h3>

                <div className="space-y-2">
                  <Label>グループウェアを利用していますか？ *</Label>
                  <Select
                    value={selectedGroupware}
                    onValueChange={(value) => setValue("groupware", value)}
                  >
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="利用していない">
                        利用していない
                      </SelectItem>
                      {groupwareCategory?.services.map((service) => (
                        <SelectItem
                          key={service.serviceName}
                          value={service.serviceName}
                        >
                          {service.serviceName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedGroupware && selectedGroupware !== "利用していない" && (
                  <>
                    <div className="space-y-2">
                      <Label>プラン *</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("groupwarePlan", value)
                        }
                      >
                        <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                          <SelectValue placeholder="選択してください" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="プランが分からない">
                            プランが分からない
                          </SelectItem>
                          {getPlansForService(
                            "グループウェア",
                            selectedGroupware
                          ).map((plan) => (
                            <SelectItem key={plan.planName} value={plan.planName}>
                              {plan.planName} ({formatPrice(plan.price)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>ライセンス数 *</Label>
                      <Input
                        type="number"
                        {...register("groupwareLicenses", {
                          valueAsNumber: true,
                        })}
                        placeholder="10"
                        className="focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </>
                )}

                {/* Step validation errors */}
                {stepErrors.length > 0 && (
                  <div className="animate-shake bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    {stepErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="hover:scale-105 transition-transform">
                    ← 戻る
                  </Button>
                  <Button type="button" onClick={nextStep} className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-600 to-cyan-600">
                    次へ →
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ3: 各種サービス */}
            {step === 3 && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-lg font-semibold">
                  現在利用している各種サービス
                </h3>

                {/* ビデオ会議 */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">ビデオ会議</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedVideoConference}
                      onValueChange={(value) =>
                        setValue("videoConference", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {videoCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedVideoConference &&
                      selectedVideoConference !== "利用していない" && (
                        <>
                          <Select
                            onValueChange={(value) =>
                              setValue("videoConferencePlan", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="プランを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="プランが分からない">
                                プランが分からない
                              </SelectItem>
                              {getPlansForService(
                                "ビデオ会議",
                                selectedVideoConference
                              ).map((plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            {...register("videoConferenceLicenses", {
                              valueAsNumber: true,
                            })}
                            placeholder="ライセンス数"
                          />
                        </>
                      )}
                  </div>
                </div>

                {/* ビジネスチャット */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">ビジネスチャット</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedBusinessChat}
                      onValueChange={(value) => setValue("businessChat", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {chatCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedBusinessChat &&
                      selectedBusinessChat !== "利用していない" && (
                        <>
                          <Select
                            onValueChange={(value) =>
                              setValue("businessChatPlan", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="プランを選択" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="プランが分からない">
                                プランが分からない
                              </SelectItem>
                              {getPlansForService(
                                "ビジネスチャット",
                                selectedBusinessChat
                              ).map((plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            {...register("businessChatLicenses", {
                              valueAsNumber: true,
                            })}
                            placeholder="ライセンス数"
                          />
                        </>
                      )}
                  </div>
                </div>

                {/* クラウドストレージ */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">クラウドストレージ</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedStorage}
                      onValueChange={(value) => setValue("storage", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {storageCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedStorage && selectedStorage !== "利用していない" && (
                      <>
                        {selectedStorage === "社内サーバー" ? (
                          <>
                            <div className="space-y-2">
                              <Label>支払い方法</Label>
                              <RadioGroup
                                value={selectedStoragePaymentMethod}
                                onValueChange={(value: "purchase" | "lease") =>
                                  setValue("storagePaymentMethod", value)
                                }
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="purchase" id="storage-purchase" />
                                  <Label htmlFor="storage-purchase">買い上げ</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="lease" id="storage-lease" />
                                  <Label htmlFor="storage-lease">リース</Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {selectedStoragePaymentMethod === "purchase" && (
                              <>
                                <div className="space-y-2">
                                  <Label>機器購入費用（円）</Label>
                                  <Input
                                    type="number"
                                    {...register("storagePurchaseCost", {
                                      valueAsNumber: true,
                                    })}
                                    placeholder="例: 500000"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label>買い替え年数</Label>
                                  <Input
                                    type="number"
                                    {...register("storageReplaceYears", {
                                      valueAsNumber: true,
                                    })}
                                    placeholder="例: 5"
                                  />
                                  <p className="text-xs text-gray-500">
                                    何年ごとに買い替えるかを入力してください
                                  </p>
                                </div>
                              </>
                            )}

                            {selectedStoragePaymentMethod === "lease" && (
                              <div className="space-y-2">
                                <Label>年額リース料金（円）</Label>
                                <Input
                                  type="number"
                                  {...register("storageLeaseCost", {
                                    valueAsNumber: true,
                                  })}
                                  placeholder="例: 140000"
                                />
                                <p className="text-xs text-gray-500">
                                  5年リースで70万円の場合、年額14万円と入力
                                </p>
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <Select
                              onValueChange={(value) =>
                                setValue("storagePlan", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="プランを選択" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="プランが分からない">
                                  プランが分からない
                                </SelectItem>
                                {getPlansForService(
                                  "クラウドストレージ",
                                  selectedStorage
                                ).map((plan) => (
                                  <SelectItem
                                    key={plan.planName}
                                    value={plan.planName}
                                  >
                                    {plan.planName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              {...register("storageLicenses", {
                                valueAsNumber: true,
                              })}
                              placeholder="ライセンス数"
                            />
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>

                {/* 生成AI */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">生成AI</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedAI}
                      onValueChange={(value) => setValue("ai", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {aiCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedAI && selectedAI !== "利用していない" && (
                      <>
                        <Select
                          onValueChange={(value) => setValue("aiPlan", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="プランを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="プランが分からない">
                              プランが分からない
                            </SelectItem>
                            {getPlansForService("生成AI", selectedAI).map(
                              (plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          {...register("aiLicenses", { valueAsNumber: true })}
                          placeholder="ライセンス数"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* BIツール */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">BIツール</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedBITool}
                      onValueChange={(value) => setValue("biTool", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {biToolCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedBITool && selectedBITool !== "利用していない" && (
                      <>
                        <Select
                          onValueChange={(value) => setValue("biToolPlan", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="プランを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="プランが分からない">
                              プランが分からない
                            </SelectItem>
                            {getPlansForService("BIツール", selectedBITool).map(
                              (plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          {...register("biToolLicenses", { valueAsNumber: true })}
                          placeholder="ライセンス数"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* CRMツール */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">CRMツール</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedCRMTool}
                      onValueChange={(value) => setValue("crmTool", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {crmToolCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedCRMTool && selectedCRMTool !== "利用していない" && (
                      <>
                        <Select
                          onValueChange={(value) => setValue("crmToolPlan", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="プランを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="プランが分からない">
                              プランが分からない
                            </SelectItem>
                            {getPlansForService("CRMツール", selectedCRMTool).map(
                              (plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          {...register("crmToolLicenses", { valueAsNumber: true })}
                          placeholder="ライセンス数"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* ノーコード/ローコード */}
                <div className="border-b pb-4">
                  <h4 className="font-medium mb-2">ノーコード/ローコード</h4>
                  <div className="space-y-2">
                    <Select
                      value={selectedNocodeTool}
                      onValueChange={(value) => setValue("nocodeTool", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="利用していない">
                          利用していない
                        </SelectItem>
                        {nocodeToolCategory?.services.map((service) => (
                          <SelectItem
                            key={service.serviceName}
                            value={service.serviceName}
                          >
                            {service.serviceName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedNocodeTool && selectedNocodeTool !== "利用していない" && (
                      <>
                        <Select
                          onValueChange={(value) => setValue("nocodeToolPlan", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="プランを選択" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="プランが分からない">
                              プランが分からない
                            </SelectItem>
                            {getPlansForService("ノーコード/ローコード", selectedNocodeTool).map(
                              (plan) => (
                                <SelectItem
                                  key={plan.planName}
                                  value={plan.planName}
                                >
                                  {plan.planName}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          {...register("nocodeToolLicenses", { valueAsNumber: true })}
                          placeholder="ライセンス数"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Step validation errors */}
                {stepErrors.length > 0 && (
                  <div className="animate-shake bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    {stepErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep} className="hover:scale-105 transition-transform">
                    ← 戻る
                  </Button>
                  <Button type="button" onClick={nextStep} className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-600 to-cyan-600">
                    次へ →
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ4: 満足度 */}
            {step === 4 && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">最後の質問です！</h3>
                  <p className="text-gray-600">現在のIT環境（各種ツール）の満足度を教えてください</p>
                </div>

                <div className="flex justify-center gap-6 md:gap-12">
                  {[
                    { value: "不満", emoji: "😞", label: "不満", color: "from-red-400 to-pink-400" },
                    { value: "普通", emoji: "😐", label: "普通", color: "from-yellow-400 to-orange-400" },
                    { value: "満足", emoji: "😊", label: "満足", color: "from-green-400 to-emerald-400" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setValue("satisfaction", option.value);
                        setBounceEmoji(option.value);
                        setTimeout(() => setBounceEmoji(null), 600);
                      }}
                      className={`
                        relative flex flex-col items-center gap-2 p-4 md:p-6 rounded-2xl
                        transition-all duration-300 cursor-pointer
                        ${
                          selectedSatisfaction === option.value
                            ? `scale-110 bg-gradient-to-br ${option.color} shadow-2xl`
                            : "scale-100 bg-gray-100 hover:scale-105 hover:shadow-lg"
                        }
                      `}
                    >
                      <div
                        className={`
                          text-6xl md:text-7xl transition-all duration-300
                          ${
                            bounceEmoji === option.value
                              ? "animate-bounce-once"
                              : selectedSatisfaction === option.value
                              ? ""
                              : "grayscale hover:grayscale-0"
                          }
                        `}
                      >
                        {option.emoji}
                      </div>
                      <span
                        className={`
                          text-sm md:text-base font-semibold
                          ${
                            selectedSatisfaction === option.value
                              ? "text-white"
                              : "text-gray-600"
                          }
                        `}
                      >
                        {option.label}
                      </span>
                      {selectedSatisfaction === option.value && (
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-green-600 text-xl">✓</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Step validation errors */}
                {stepErrors.length > 0 && (
                  <div className="animate-shake bg-red-50 border-2 border-red-300 rounded-lg p-4">
                    {stepErrors.map((error, index) => (
                      <p key={index} className="text-sm text-red-600 flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        {error}
                      </p>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-8">
                  <Button type="button" variant="outline" onClick={prevStep} className="hover:scale-105 transition-transform">
                    ← 戻る
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="hover:scale-105 transition-transform bg-gradient-to-r from-blue-600 to-cyan-600"
                  >
                    {isSubmitting ? "診断中..." : "診断結果を見る →"}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
