# Google Workspace コスト削減診断フォーム - プロジェクトドキュメント

## 📋 概要

このプロジェクトは、中小企業が現在利用している各種SaaS（Zoom、Slack、Dropbox、ChatGPTなど）をGoogle Workspaceに統合した場合のコスト削減額を診断するWebフォームを開発するためのドキュメント一式です。

**目的**: Webマーケティングによるリード獲得  
**ターゲット**: 中小企業の経営者、IT担当者  
**技術スタック**: Next.js, Tailwind CSS, shadcn/ui, Supabase, Gemini API

---

## 📁 ドキュメント構成

### 1. **CLAUDE.md**
Claude Codeが最初に読み込む第一優先の指示書です。プロジェクトの概要、技術スタック、ディレクトリ構造、コーディングスタイル、ワークフロー、デザインガイドラインが記載されています。

**用途**: Claude Code / Cursorでの開発時に自動的に読み込まれ、AIがプロジェクトのコンテキストを理解するために使用されます。

---

### 2. **requirements.md**
詳細な要件定義書です。機能要件、非機能要件、データ仕様、計算ロジック、API連携、セキュリティ、KPIなど、プロジェクトのすべての要件が網羅されています。

**主な内容**:
- ランディングページの仕様
- 診断フォームの入力項目とフロー
- 診断結果ページの表示内容
- Gemini APIによる機能比較生成
- メール送信仕様
- データベース設計

---

### 3. **todo.md**
実装タスクのチェックリストです。プロジェクトセットアップから、UI実装、ロジック開発、API連携、デプロイまで、段階的に進めるべきタスクが整理されています。

**用途**: 開発の進捗管理に使用します。各タスクを完了したら、チェックボックスにチェックを入れてください。

---

### 4. **services-pricing.json**
各種SaaSサービスのプランと料金情報を格納したデータベースファイルです。診断フォームの計算ロジックで参照されます。

**構造**:
```json
[
  {
    "categoryName": "カテゴリ名",
    "services": [
      {
        "serviceName": "サービス名",
        "plans": [
          { "planName": "プラン名", "price": 年額, "unit": "per_user_per_year" }
        ]
      }
    ]
  }
]
```

**更新方法**: 新しいサービスやプランを追加する場合は、このファイルに追記してください。

---

### 5. **default-plans.json**
ユーザーが「プランが分からない」を選択した場合に適用するデフォルトプランを定義したファイルです。

**選定基準**: 各サービスの中間プラン（価格と機能のバランスが取れたプラン）を選定しています。

---

### 6. **research-report.md**
中小企業向けSaaSの料金調査レポートです。各サービスの料金体系、社内サーバーのコスト分析、Google Workspaceとの比較考察が記載されています。

**用途**: プロジェクトの背景理解、営業資料の作成、ブログ記事の執筆などに活用できます。

---

## 🚀 使い方

### Claude Code / Cursorでの開発

1. **プロジェクトディレクトリに移動**
   ```bash
   cd /path/to/google-workspace-cost-calculator
   ```

2. **Claude Codeを起動**
   ```bash
   claude
   ```
   または、Cursorでこのディレクトリを開きます。

3. **AIに指示を出す**
   - `CLAUDE.md`が自動的に読み込まれ、プロジェクトのコンテキストが理解されます。
   - `requirements.md`と`todo.md`を参照しながら、実装を進めてください。

### Next.jsプロジェクトの初期化

```bash
pnpm create next-app google-workspace-calculator
cd google-workspace-calculator
```

その後、このドキュメント一式をプロジェクトルートにコピーしてください。

---

## 📊 データの更新

### サービス料金の更新

`services-pricing.json`を編集し、最新の料金情報に更新してください。

### デフォルトプランの変更

`default-plans.json`を編集し、推奨プランを変更してください。

---

## 🔐 環境変数

以下の環境変数を`.env.local`に設定してください。

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# Google Apps Script Webhook
WEBHOOK_URL=your_gas_webhook_url

# 日程調整ツール
CALENDLY_URL=your_calendly_url
```

---

## 📈 KPI

- **診断完了率**: 60%以上
- **リード獲得数**: 月間100件以上
- **商談化率**: 10%以上
- **平均削減額**: 年間5万円以上

---

## 📝 ライセンス

このプロジェクトは、Google Workspace正規代理店向けのマーケティングツールとして開発されています。

---

**作成者**: Manus AI  
**作成日**: 2025年10月18日  
**バージョン**: 1.0

