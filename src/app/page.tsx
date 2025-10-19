import DiagnosisForm from "@/components/DiagnosisForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <h1 className="text-xl md:text-2xl font-bold text-blue-600">
            Google Workspace コスト削減診断
          </h1>
        </div>
      </header>

      {/* ヒーローセクション */}
      <section className="relative py-12 md:py-20 px-4 overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 rounded-full">
            <p className="text-sm md:text-base font-semibold text-blue-700">
              ✨ たった3分で診断完了！
            </p>
          </div>

          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            SaaSコスト、
            <br className="md:hidden" />
            まとめて削減しませんか？
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Google Workspace で最大40%削減
            </span>
          </h2>

          <p className="text-base md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Slack、Zoom、Dropbox、ChatGPT...
            <br className="hidden md:block" />
            バラバラに契約しているSaaSを統合して、コストも管理も一気に削減。
          </p>

          {/* 実績数値 */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-3xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
              <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-1">
                30%
              </p>
              <p className="text-xs md:text-sm text-gray-600">平均削減率</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
              <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-1">
                500+
              </p>
              <p className="text-xs md:text-sm text-gray-600">導入企業数</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-shadow">
              <p className="text-2xl md:text-4xl font-bold text-blue-600 mb-1">
                3分
              </p>
              <p className="text-xs md:text-sm text-gray-600">診断時間</p>
            </div>
          </div>

          {/* CTAボタン */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="#form"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all transform hover:scale-105"
            >
              無料で診断を開始 →
            </a>
            <a
              href="#benefits"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-blue-200"
            >
              導入メリットを見る
            </a>
          </div>
        </div>
      </section>

      {/* ビフォーアフター比較 */}
      <section className="py-12 md:py-20 px-4 bg-white" id="benefits">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-bold text-center mb-12 md:mb-16">
            Google Workspace 導入で変わること
          </h3>

          {/* 比較図 */}
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 mb-16">
            {/* Before */}
            <div className="relative">
              <div className="absolute -top-4 left-4 bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-semibold">
                現在
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 md:p-8 border-2 border-gray-200">
                <h4 className="text-lg md:text-xl font-bold mb-6 text-gray-800">
                  バラバラなSaaS環境
                </h4>
                <div className="space-y-3">
                  {["Slack", "Zoom", "Dropbox", "ChatGPT", "Kintone", "Salesforce"].map(
                    (service) => (
                      <div
                        key={service}
                        className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xs font-bold">
                          {service[0]}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {service}
                        </span>
                      </div>
                    )
                  )}
                </div>
                <div className="mt-6 space-y-2 text-sm text-gray-600">
                  <p className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    複数のIDとパスワード管理
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    バラバラな請求と契約
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-500">✗</span>
                    データ連携が煩雑
                  </p>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="relative">
              <div className="absolute -top-4 left-4 bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold">
                導入後
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 md:p-8 border-2 border-blue-200 shadow-lg">
                <h4 className="text-lg md:text-xl font-bold mb-6 text-blue-900">
                  統合されたGoogle Workspace
                </h4>
                <div className="bg-white rounded-xl p-6 shadow-md mb-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-2xl">
                      G
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">
                        Google Workspace
                      </p>
                      <p className="text-sm text-gray-600">オールインワン</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Gmail
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Meet
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Drive
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Chat
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Sheets
                    </span>
                    <span className="bg-blue-50 px-2 py-1 rounded text-center">
                      Gemini
                    </span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    シングルサインオン（SSO）
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    一括管理・一括請求
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    シームレスな連携
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-green-600 text-lg">✓</span>
                    <strong>Gemini AI内蔵</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メリットカード */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl md:text-4xl font-bold text-center mb-12">
            Google Workspace 4つのメリット
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* メリット1 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-center">
                コスト削減
              </h4>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                複数SaaSを統合して平均30%のコスト削減。ライセンス管理も簡素化。
              </p>
            </div>

            {/* メリット2 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚀</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-center">
                生産性向上
              </h4>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                Gemini AIで文章作成、データ分析が自動化。業務効率が劇的に改善。
              </p>
            </div>

            {/* メリット3 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-center">
                セキュリティ強化
              </h4>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                エンタープライズグレードのセキュリティ。一元管理で漏洩リスク低減。
              </p>
            </div>

            {/* メリット4 */}
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚙️</span>
              </div>
              <h4 className="font-bold text-lg mb-2 text-center">
                管理工数削減
              </h4>
              <p className="text-sm text-gray-600 text-center leading-relaxed">
                IT管理者の負担を大幅軽減。一つの管理画面で全て完結。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 診断フォームセクション */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-blue-50" id="form">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-4xl font-bold mb-4">
              今すぐ無料で診断
            </h3>
            <p className="text-gray-600">
              現在のSaaS利用状況を入力するだけで、削減額をシミュレーション
            </p>
          </div>
          <DiagnosisForm />
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-lg mb-4">
                Google Workspace コスト削減診断
              </h4>
              <p className="text-sm text-gray-400">
                Google Workspace 正規代理店による無料診断サービス
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">サービス</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#form" className="hover:text-white transition">
                    コスト診断
                  </a>
                </li>
                <li>
                  <a href="#benefits" className="hover:text-white transition">
                    導入メリット
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">お問い合わせ</h5>
              <p className="text-sm text-gray-400">
                Google Workspace の導入に関するご相談はお気軽にどうぞ
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>© 2025 ShigApps Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
