import React from 'react';
import Layout from '../../components/layout/Layout';

const OwnerDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">オーナーダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-600">
            イベントカレンダー、TODO、緊急連絡一覧、最新インフォメーション
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">今日の予定</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">3件</p>
            <p className="mt-1 text-sm text-gray-500">会議・点検予定</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">承認待ち</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">2件</p>
            <p className="mt-1 text-sm text-gray-500">申請・依頼</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">緊急連絡</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">0件</p>
            <p className="mt-1 text-sm text-gray-500">未対応の緊急事案</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">入居率</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">95%</p>
            <p className="mt-1 text-sm text-gray-500">全フロア平均</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">イベントカレンダー・TODO</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">エレベーター点検</p>
                  <p className="text-xs text-gray-500">2024-01-15 10:00</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">完了</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">テナント面談</p>
                  <p className="text-xs text-gray-500">明日 14:00</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">予定</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">月次収支確認</p>
                  <p className="text-xs text-gray-500">1月31日まで</p>
                </div>
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">TODO</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">受付・承認ワークフロー</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">会議室利用申請</p>
                  <p className="text-xs text-gray-500">山田次郎 - 2F会議室A</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                    承認
                  </button>
                  <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                    却下
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">工事申請</p>
                  <p className="text-xs text-gray-500">佐藤建設 - 3F内装工事</p>
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                    承認
                  </button>
                  <button className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">
                    却下
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">管理状況確認</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">🏢 テナント管理</span>
                  <span className="text-xs text-gray-500">12件</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">🏠 会議室管理</span>
                  <span className="text-xs text-gray-500">8件</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">🔧 メンテナンス管理</span>
                  <span className="text-xs text-gray-500">5件</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">🏗️ 工事管理</span>
                  <span className="text-xs text-gray-500">3件</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">📋 空室管理</span>
                  <span className="text-xs text-gray-500">2件</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">緊急連絡管理</h2>
            <div className="text-center py-8">
              <div className="text-green-600 mb-2">
                <span className="text-2xl">✓</span>
              </div>
              <p className="text-sm text-gray-500">現在、緊急通報はありません</p>
              <p className="text-xs text-gray-400 mt-1">対応依頼ステータス: 正常</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">最新インフォメーション</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <h3 className="text-sm font-medium text-gray-900">テナント契約更新</h3>
                <p className="text-sm text-gray-600 mt-1">
                  3F-302号室の契約更新手続きが完了しました。
                </p>
                <p className="text-xs text-gray-500 mt-2">2024-01-15</p>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <h3 className="text-sm font-medium text-gray-900">収益レポート</h3>
                <p className="text-sm text-gray-600 mt-1">
                  12月分の収益レポートが完成しました。
                </p>
                <p className="text-xs text-gray-500 mt-2">2024-01-12</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;