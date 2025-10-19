# 推奨コマンド

## 開発コマンド

### 基本的な開発フロー

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動（ホットリロード有効）
npm run dev
# → http://localhost:3000 でアクセス可能

# プロダクションビルド
npm run build

# プロダクションサーバーの起動
npm run start

# ESLintによるコードチェック
npm run lint
```

### 環境変数の設定

```bash
# .env.local ファイルを作成（.env.local.example をコピー）
cp .env.local.example .env.local

# エディタで環境変数を編集
# 必要な環境変数:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - GEMINI_API_KEY
# - GAS_WEBHOOK_URL
# - NEXT_PUBLIC_CALENDLY_URL
```

## Supabase関連コマンド

### データベースセットアップ

```bash
# Supabase CLIのインストール（グローバル）
npm install -g supabase

# Supabaseプロジェクトにリンク
supabase link --project-ref <your-project-ref>

# マイグレーションの実行
supabase db push

# または、Supabase Dashboardから手動で実行:
# supabase/migrations/20250101000000_create_diagnosis_results.sql の内容をコピーして実行
```

## Git操作

```bash
# 現在の状態確認
git status

# 変更をステージング
git add .

# コミット（Conventional Commits形式推奨）
git commit -m "feat: 新機能の説明"
git commit -m "fix: バグ修正の説明"
git commit -m "docs: ドキュメント更新"

# プッシュ
git push origin main
```

## ファイル・ディレクトリ操作（macOS/Darwin）

```bash
# ファイル一覧
ls -la

# ディレクトリ移動
cd src/app

# ファイル検索
find . -name "*.tsx" -type f

# 文字列検索
grep -r "calculateCost" src/

# ファイル内容確認
cat src/lib/calculator.ts

# ファイルの先頭20行を表示
head -n 20 src/lib/calculator.ts

# ファイルの末尾20行を表示
tail -n 20 src/lib/calculator.ts
```

## デプロイコマンド（Vercel）

```bash
# Vercel CLIのインストール
npm install -g vercel

# 初回デプロイ（インタラクティブ）
vercel

# プロダクションデプロイ
vercel --prod

# 環境変数の設定（Vercel Dashboard推奨）
# または CLI:
vercel env add GEMINI_API_KEY
```

## トラブルシューティング

```bash
# node_modulesとビルドキャッシュを削除して再インストール
rm -rf node_modules .next
npm install

# ポート3000が使用中の場合
# 別のポートで起動:
PORT=3001 npm run dev

# TypeScriptの型チェック
npx tsc --noEmit

# キャッシュをクリアしてビルド
rm -rf .next
npm run build
```

## テスト・検証

```bash
# ビルドエラーの確認
npm run build 2>&1 | grep -i error

# ESLintで特定のファイルをチェック
npx eslint src/lib/calculator.ts

# 環境変数の確認（.env.localの内容表示）
cat .env.local

# Supabase接続テスト（開発サーバー起動後、ブラウザで確認）
# http://localhost:3000/api/save-result にPOSTリクエストを送信
```

## shadcn/ui コンポーネント追加

```bash
# 新しいUIコンポーネントを追加
npx shadcn@latest add <component-name>

# 例: ダイアログコンポーネントを追加
npx shadcn@latest add dialog

# 利用可能なコンポーネント一覧
npx shadcn@latest add
```

## 注意事項

- **Turbopack使用**: このプロジェクトでは `--turbopack` フラグを使用しているため、従来のWebpackより高速
- **macOS/Darwin環境**: 一部のLinuxコマンドとは異なる動作をする可能性があります
- **環境変数**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません
- **ビルド前の確認**: 本番デプロイ前に必ず `npm run build` でエラーがないか確認してください
