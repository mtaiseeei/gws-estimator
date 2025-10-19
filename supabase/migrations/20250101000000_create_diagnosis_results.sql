-- 診断結果テーブルの作成
CREATE TABLE IF NOT EXISTS diagnosis_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  employee_count INTEGER NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  current_services JSONB NOT NULL,
  current_cost NUMERIC(12, 2) NOT NULL,
  gws_cost NUMERIC(12, 2) NOT NULL,
  savings NUMERIC(12, 2) NOT NULL,
  satisfaction TEXT,
  feature_comparison TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX idx_diagnosis_results_email ON diagnosis_results(email);
CREATE INDEX idx_diagnosis_results_created_at ON diagnosis_results(created_at DESC);
CREATE INDEX idx_diagnosis_results_company_name ON diagnosis_results(company_name);

-- RLS (Row Level Security) の有効化
ALTER TABLE diagnosis_results ENABLE ROW LEVEL SECURITY;

-- 公開アクセス用のポリシー（INSERTのみ許可）
CREATE POLICY "Allow public insert" ON diagnosis_results
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- コメントの追加
COMMENT ON TABLE diagnosis_results IS 'Google Workspace コスト削減診断の結果を保存するテーブル';
COMMENT ON COLUMN diagnosis_results.id IS '診断結果の一意識別子';
COMMENT ON COLUMN diagnosis_results.company_name IS '会社名';
COMMENT ON COLUMN diagnosis_results.employee_count IS '従業員数';
COMMENT ON COLUMN diagnosis_results.email IS 'メールアドレス';
COMMENT ON COLUMN diagnosis_results.name IS '担当者名';
COMMENT ON COLUMN diagnosis_results.current_services IS '現在利用しているサービスのリスト（JSON形式）';
COMMENT ON COLUMN diagnosis_results.current_cost IS '現在の年間コスト';
COMMENT ON COLUMN diagnosis_results.gws_cost IS 'Google Workspace導入後の年間コスト';
COMMENT ON COLUMN diagnosis_results.savings IS '削減額（プラスの場合は削減、マイナスの場合は増加）';
COMMENT ON COLUMN diagnosis_results.satisfaction IS '現在のIT環境への満足度';
COMMENT ON COLUMN diagnosis_results.feature_comparison IS 'Gemini APIで生成された機能比較テキスト';
COMMENT ON COLUMN diagnosis_results.created_at IS '診断実施日時';
