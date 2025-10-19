import { NextRequest, NextResponse } from "next/server";
import { formatCurrency } from "@/lib/calculator";

/**
 * Google Apps Script Webhookを呼び出して診断結果をメール送信
 */
export async function POST(request: NextRequest) {
  try {
    const { email, name, companyName, currentCost, gwsCost, savings } =
      await request.json();

    const webhookUrl = process.env.GAS_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("GAS_WEBHOOK_URL is not configured");
      return NextResponse.json(
        { error: "メール送信設定エラー" },
        { status: 500 }
      );
    }

    // Google Apps Script Webhookに送信するデータ
    const payload = {
      email,
      name,
      companyName,
      currentCost: formatCurrency(currentCost),
      gwsCost: formatCurrency(gwsCost),
      savings: formatCurrency(Math.abs(savings)),
      isSavings: savings > 0,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("GAS Webhook error:", await response.text());
      return NextResponse.json(
        { error: "メール送信に失敗しました" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
