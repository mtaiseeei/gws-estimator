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
import { Progress } from "@/components/ui/progress";
import { diagnosisFormSchema } from "@/lib/validation";
import type { DiagnosisFormData, Category } from "@/types";
import servicesData from "@/data/services-pricing.json";
import { calculateCost } from "@/lib/calculator";

const categories = servicesData as Category[];

export default function DiagnosisForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<DiagnosisFormData>({
    resolver: zodResolver(diagnosisFormSchema),
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
  const selectedAI = watch("ai");
  const selectedBITool = watch("biTool");
  const selectedCRMTool = watch("crmTool");
  const selectedNocodeTool = watch("nocodeTool");

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

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
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
              <span>ステップ {step} / {totalSteps}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* ステップ1: グループウェア */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">
                  現在のグループウェアの利用状況
                </h3>

                <div className="space-y-2">
                  <Label>グループウェアを利用していますか？</Label>
                  <Select
                    value={selectedGroupware}
                    onValueChange={(value) => setValue("groupware", value)}
                  >
                    <SelectTrigger>
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
                      <Label>プラン</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("groupwarePlan", value)
                        }
                      >
                        <SelectTrigger>
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
                              {plan.planName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>ライセンス数</Label>
                      <Input
                        type="number"
                        {...register("groupwareLicenses", {
                          valueAsNumber: true,
                        })}
                        placeholder="10"
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end">
                  <Button type="button" onClick={nextStep}>
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ2: 各種サービス */}
            {step === 2 && (
              <div className="space-y-6">
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
                        {selectedStorage !== "社内サーバー" && (
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
                        )}
                        <Input
                          type="number"
                          {...register("storageLicenses", {
                            valueAsNumber: true,
                          })}
                          placeholder="ライセンス数"
                        />
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

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    戻る
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ3: ユーザー情報 */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">ユーザー情報</h3>

                <div className="space-y-2">
                  <Label htmlFor="companyName">会社名 *</Label>
                  <Input
                    id="companyName"
                    {...register("companyName")}
                    placeholder="株式会社○○"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-red-500">
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
                  />
                  {errors.employeeCount && (
                    <p className="text-sm text-red-500">
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
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">メールアドレス *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="example@company.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    戻る
                  </Button>
                  <Button type="button" onClick={nextStep}>
                    次へ
                  </Button>
                </div>
              </div>
            )}

            {/* ステップ4: 満足度 */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">現在の満足度</h3>

                <div className="space-y-2">
                  <Label>現在のIT環境（各種ツール）の満足度を教えてください</Label>
                  <RadioGroup
                    onValueChange={(value) => setValue("satisfaction", value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="満足" id="満足" />
                      <Label htmlFor="満足">満足</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="普通" id="普通" />
                      <Label htmlFor="普通">普通</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="不満" id="不満" />
                      <Label htmlFor="不満">不満</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={prevStep}>
                    戻る
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "診断中..." : "診断結果を見る"}
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
