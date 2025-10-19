import { NextRequest, NextResponse } from "next/server";
import { saveDiagnosisResult } from "@/lib/supabase";
import type { DiagnosisResult } from "@/types";

/**
 * 診断結果をSupabaseに保存
 */
export async function POST(request: NextRequest) {
  try {
    const result: DiagnosisResult = await request.json();

    const { success, error, id } = await saveDiagnosisResult(result);

    if (!success) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Save result error:", error);
    return NextResponse.json(
      { error: "診断結果の保存に失敗しました" },
      { status: 500 }
    );
  }
}
