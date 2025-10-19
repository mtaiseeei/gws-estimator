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

    // Gemini API呼び出し
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
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
            maxOutputTokens: 1024,
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
    const comparisonText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

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

  return `以下の現在利用しているサービスと、Google Workspace Business Standardの機能を比較する表を、簡潔に（5〜7行程度）生成してください。

現在利用しているサービス:
${servicesList}

Google Workspace Business Standardの機能:
- Gmail (メール)
- Google Meet (ビデオ会議、最大500名)
- Google Chat (ビジネスチャット)
- Google Drive (ストレージ、2TB/ユーザー)
- Google Docs, Sheets, Slides (文書作成、表計算、プレゼンテーション)
- Google Calendar (カレンダー)
- Gemini for Google Workspace (生成AI)
- 高度なセキュリティと管理機能

比較の観点:
1. 機能の充実度
2. 統合性（サービス間の連携）
3. コストパフォーマンス
4. 生産性向上

**出力形式:**
Markdown形式の表で出力してください。見出しは「機能比較」とし、「現在のツール」「Google Workspace」「メリット」の3列で構成してください。`;
}
