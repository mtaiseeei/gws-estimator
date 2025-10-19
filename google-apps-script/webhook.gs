/**
 * Google Apps Script: メール送信Webhook
 *
 * このスクリプトをGoogle Apps Scriptプロジェクトにデプロイし、
 * Webアプリとして公開してください。
 *
 * デプロイ手順:
 * 1. Google Apps Scriptエディタでこのコードを貼り付け
 * 2. 「デプロイ」→「新しいデプロイ」
 * 3. 「種類の選択」→「ウェブアプリ」
 * 4. 「アクセスできるユーザー」→「全員」を選択
 * 5. デプロイ後、URLをコピーして .env.local の GAS_WEBHOOK_URL に設定
 */

function doPost(e) {
  try {
    // リクエストボディをパース
    const data = JSON.parse(e.postData.contents);

    const {
      email,
      name,
      companyName,
      currentCost,
      gwsCost,
      savings,
      isSavings
    } = data;

    // メールの件名
    const subject = `【Google Workspace診断】${companyName} 様の診断結果`;

    // メール本文を作成
    const body = createEmailBody({
      name,
      companyName,
      currentCost,
      gwsCost,
      savings,
      isSavings
    });

    // メール送信
    GmailApp.sendEmail(email, subject, body, {
      name: 'Google Workspace コスト削減診断',
    });

    // 成功レスポンスを返す
    return ContentService.createTextOutput(
      JSON.stringify({ success: true })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());

    // エラーレスポンスを返す
    return ContentService.createTextOutput(
      JSON.stringify({ success: false, error: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * メール本文を作成
 */
function createEmailBody(data) {
  const { name, companyName, currentCost, gwsCost, savings, isSavings } = data;

  let savingsText = '';
  if (isSavings) {
    savingsText = `
🎉 年間 ¥${savings} のコスト削減が可能です！

Google Workspaceに統合することで、コスト削減だけでなく、
以下のようなメリットも期待できます：

✓ 統合環境による業務効率化
✓ Gemini AIによる生産性向上
✓ エンタープライズレベルのセキュリティ
✓ シームレスな共同作業環境
`;
  } else {
    savingsText = `
年間 ¥${savings} の費用増となりますが、
Google Workspaceには価格以上のメリットがあります：

✓ Gemini AIによる生産性向上
✓ 統合環境による業務効率化
✓ エンタープライズレベルのセキュリティ
✓ シームレスな共同作業環境
`;
  }

  return `
${name} 様

この度は「Google Workspace コスト削減診断」をご利用いただき、
誠にありがとうございます。

${companyName} 様の診断結果をお送りいたします。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【診断結果】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

現在の年間コスト:          ¥${currentCost}
Google Workspace導入後:     ¥${gwsCost}
${isSavings ? '年間削減額' : '年間増加額'}:              ¥${savings}

${savingsText}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【次のステップ】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Google Workspaceの専門家が、御社の状況に合わせた
最適なプランをご提案いたします。

まずは無料相談をご予約ください：
[Calendlyリンクをここに挿入]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※本診断結果はあくまで目安であり、
  実際の削減額を保証するものではありません。

ご不明な点がございましたら、お気軽にお問い合わせください。

────────────────────────────
Google Workspace コスト削減診断
[お問い合わせ先メールアドレス]
────────────────────────────
`;
}

/**
 * テスト用関数
 */
function testEmail() {
  const testData = {
    email: 'test@example.com',
    name: '山田 太郎',
    companyName: '株式会社テスト',
    currentCost: '500,000',
    gwsCost: '384,000',
    savings: '116,000',
    isSavings: true
  };

  const body = createEmailBody(testData);
  Logger.log(body);
}
