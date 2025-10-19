# タスク完了時のチェックリスト

## コード変更後に必ず実行すること

### 1. ビルドエラーチェック

```bash
# プロダクションビルドを実行
npm run build

# エラーがないことを確認
# ✓ Compiled successfully と表示されればOK
```

**確認ポイント:**
- TypeScriptの型エラーがないか
- ESLintの警告/エラーがないか
- インポートパスが正しいか

### 2. ESLintチェック

```bash
# ESLintを実行
npm run lint

# または特定のファイルのみ
npx eslint src/lib/calculator.ts
```

**よくあるエラー:**
- `@typescript-eslint/no-explicit-any` - any型の使用
- `prefer-const` - 再代入しない変数にletを使用
- `react-hooks/exhaustive-deps` - useEffectの依存配列不足

### 3. 型チェック

```bash
# TypeScriptコンパイラで型チェックのみ実行
npx tsc --noEmit
```

### 4. 開発サーバーでの動作確認

```bash
# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:3000 を開く
```

**確認項目:**
- [ ] ページが正常に表示される
- [ ] フォームが動作する
- [ ] エラーがコンソールに出ていない
- [ ] レスポンシブデザインが機能している（DevToolsのモバイルビュー）

## 機能追加・変更時の追加チェック

### 新しいコンポーネント追加時

- [ ] ファイル名はPascalCase（例: `NewComponent.tsx`）
- [ ] `"use client"`ディレクティブが必要か確認
- [ ] 型定義が`src/types/index.ts`にあるか
- [ ] インポートパスが`@/*`エイリアスを使用しているか

### API変更時

- [ ] リクエスト/レスポンスの型定義を更新
- [ ] エラーハンドリングが適切か
- [ ] try-catchでエラーをキャッチしているか
- [ ] 環境変数が`.env.local.example`に記載されているか

### データベーススキーマ変更時

- [ ] マイグレーションファイルを作成
- [ ] `src/lib/supabase.ts`の型定義を更新
- [ ] RLSポリシーを確認

### 計算ロジック変更時

- [ ] `lib/calculator.ts`の変更
- [ ] テストケースで検証（手動）
- [ ] エッジケース（0円、マイナス値）の処理確認

## コミット前のチェックリスト

### Git操作

```bash
# 1. 変更内容を確認
git status
git diff

# 2. 変更をステージング
git add .

# 3. コミット（Conventional Commits形式）
git commit -m "feat: 新機能の説明"
# または
git commit -m "fix: バグ修正の説明"
# または
git commit -m "refactor: リファクタリングの説明"
```

**Conventional Commits形式:**
- `feat:` - 新機能
- `fix:` - バグ修正
- `docs:` - ドキュメント変更
- `style:` - コードスタイル変更（機能に影響なし）
- `refactor:` - リファクタリング
- `test:` - テスト追加・修正
- `chore:` - ビルドプロセス、補助ツールの変更

### コミット前の最終確認

- [ ] ビルドが成功する（`npm run build`）
- [ ] ESLintエラーがない（`npm run lint`）
- [ ] 不要なコンソールログを削除
- [ ] デバッグコードを削除
- [ ] TODO/FIXMEコメントが残っていないか確認

## デプロイ前のチェックリスト

### 環境変数確認

- [ ] `.env.local`に全ての必要な環境変数が設定されている
- [ ] Vercelダッシュボードに本番環境の環境変数が設定されている
- [ ] APIキーが正しい（有効期限、権限）

### Supabaseセットアップ確認

- [ ] Supabaseプロジェクトが作成されている
- [ ] マイグレーションが実行されている
- [ ] RLSポリシーが有効
- [ ] 接続テストが成功

### 外部API確認

- [ ] Gemini APIキーが有効
- [ ] GAS Webhookがデプロイされている
- [ ] Timerex/Calendly URLが正しい

### 本番ビルドテスト

```bash
# 本番ビルドを作成
npm run build

# 本番サーバーをローカルで起動
npm run start

# http://localhost:3000 で動作確認
```

### デプロイ実行

```bash
# Vercelにデプロイ
vercel --prod

# デプロイ後、本番URLで動作確認
```

## トラブルシューティング時のチェックリスト

### ビルドエラー時

- [ ] `node_modules`を削除して再インストール
  ```bash
  rm -rf node_modules .next
  npm install
  ```
- [ ] TypeScriptの型エラーを確認
- [ ] インポートパスが正しいか確認

### 実行時エラー時

- [ ] ブラウザのコンソールでエラーを確認
- [ ] 環境変数が正しく設定されているか
- [ ] APIエンドポイントが正しいか
- [ ] Supabase接続が成功しているか

### パフォーマンス問題時

- [ ] Next.jsのビルド最適化が有効か
- [ ] 画像最適化（next/image）を使用しているか
- [ ] 不要なre-renderがないか

## コードレビュー時の確認ポイント

- [ ] コーディング規約に従っているか
- [ ] 型定義が適切か（any型を使用していないか）
- [ ] エラーハンドリングが適切か
- [ ] セキュリティ上の問題がないか
- [ ] パフォーマンスへの影響
- [ ] テスタビリティ（テストしやすいコードか）
- [ ] コメントが適切か（複雑なロジックに説明があるか）
