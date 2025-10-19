import { NextRequest, NextResponse } from "next/server";
import type { SelectedService } from "@/types";

/**
 * Gemini APIを使用して機能比較テキストを生成
 */
export async function POST(request: NextRequest) {
  try {
    const { selectedServices } = await request.json();

    if (!selectedServices || selectedServices.length === 0) {
      return NextResponse.json(
        { error: "選択されたサービスがありません" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("GEMINI_API_KEY is not configured");
      return NextResponse.json(
        { error: "API設定エラー" },
        { status: 500 }
      );
    }

    // プロンプトを生成
    const prompt = generateComparisonPrompt(selectedServices);

    // Gemini API呼び出し (Gemini 2.5 Pro)
    console.log("Calling Gemini 2.5 Pro API...");
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "機能比較の生成に失敗しました" },
        { status: 500 }
      );
    }

    const data = await response.json();
    console.log("Gemini API response:", JSON.stringify(data, null, 2));

    const comparisonText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    console.log("Extracted comparison text:", comparisonText);

    return NextResponse.json({ comparison: comparisonText });
  } catch (error) {
    console.error("Generate comparison error:", error);
    return NextResponse.json(
      { error: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * 機能比較のためのプロンプトを生成
 */
function generateComparisonPrompt(
  selectedServices: SelectedService[]
): string {
  const servicesList = selectedServices
    .map((s) => `- ${s.categoryName}: ${s.serviceName} (${s.planName})`)
    .join("\n");

  return `あなたはGoogle Workspaceの専門家です。以下の現在利用しているサービスと、Google Workspace Business Standardを比較するMarkdown表を生成してください。

## 現在利用しているサービス:
${servicesList}

## Google Workspace Business Standardに含まれる主な機能:
- **Gmail**: ビジネスメール、独自ドメイン対応
- **Google Meet**: ビデオ会議（最大150名参加）、録画機能
- **Google Chat**: ビジネスチャット、スペース（グループ）、スレッド機能
- **Google Drive**: クラウドストレージ（2TB/ユーザー）、共有・権限管理
- **Google Docs/Sheets/Slides**: 文書作成・表計算・プレゼンテーション、リアルタイム共同編集
- **Google Calendar**: スケジュール管理、会議室予約
- **Gemini for Workspace**: 世界最高峰の生成AIモデルを利用可能（文書作成支援、要約、データ分析）
- **セキュリティ**: 2段階認証、データ暗号化、DLP、監査ログ

## 指示:
1. **Markdown形式の表**で出力してください
2. 表の**列**は以下の3つ:
   - **カテゴリ**: サービスの種類（メール、ビデオ会議など）
   - **現在のツール**: 利用中のサービス名
   - **Google Workspaceで統合**: 該当するGWSサービスと主なメリット
3. **5〜8行程度**の簡潔な表にしてください
4. **メリット**は具体的に（例: 「統合で切り替え不要」「追加費用なし」など）
5. **表の前後に見出しや説明文を入れないでください**。表のみを出力してください。

## 出力例（フォーマット参考）:
| カテゴリ | 現在のツール | Google Workspaceで統合 |
|---------|------------|---------------------|
| メール | 例: Outlook | Gmail（独自ドメイン対応、強力な検索、スパムフィルタ） |

**重要**: 表のみを出力し、余計な説明は不要です。`;

}
