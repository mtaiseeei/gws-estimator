import { createClient } from "@supabase/supabase-js";
import type { DiagnosisResult, SelectedService } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * Supabaseクライアントのインスタンスを作成
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * 診断結果をデータベースに保存
 */
export async function saveDiagnosisResult(
  result: DiagnosisResult
): Promise<{ success: boolean; error?: string; id?: string }> {
  try {
    const { data, error } = await supabase
      .from("diagnosis_results")
      .insert([
        {
          company_name: result.company_name,
          employee_count: result.employee_count,
          email: result.email,
          name: result.name,
          current_services: result.current_services,
          current_cost: result.current_cost,
          gws_cost: result.gws_cost,
          savings: result.savings,
          satisfaction: result.satisfaction,
          feature_comparison: result.feature_comparison,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.[0]?.id };
  } catch (error) {
    console.error("Save diagnosis result error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * データベーススキーマの型定義
 */
export type Database = {
  public: {
    Tables: {
      diagnosis_results: {
        Row: {
          id: string;
          company_name: string;
          employee_count: number;
          email: string;
          name: string;
          current_services: SelectedService[];
          current_cost: number;
          gws_cost: number;
          savings: number;
          satisfaction: string | null;
          feature_comparison: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          company_name: string;
          employee_count: number;
          email: string;
          name: string;
          current_services: SelectedService[];
          current_cost: number;
          gws_cost: number;
          savings: number;
          satisfaction?: string | null;
          feature_comparison?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          employee_count?: number;
          email?: string;
          name?: string;
          current_services?: SelectedService[];
          current_cost?: number;
          gws_cost?: number;
          savings?: number;
          satisfaction?: string | null;
          feature_comparison?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
