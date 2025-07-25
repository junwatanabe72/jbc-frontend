import React from 'react';
import Layout from '../../components/layout/Layout';

const BrokerDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">仲介会社ダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-600">
            空室情報確認、図面・契約書ダウンロード、インフォメーション
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">空室数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">3室</p>
            <p className="mt-1 text-sm text-gray-500">即入居可能</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">今月成約</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">2件</p>
            <p className="mt-1 text-sm text-gray-500">仲介実績</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">資料DL</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">15件</p>
            <p className="mt-1 text-sm text-gray-500">今月ダウンロード</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">新着情報</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">2件</p>
            <p className="mt-1 text-sm text-gray-500">未確認</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">空室情報</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">3F-301号室</h3>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">即入居可</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>面積: 45.5㎡</div>
                  <div>賃料: ¥180,000</div>
                  <div>敷金: 2ヶ月</div>
                  <div>礼金: 1ヶ月</div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    図面DL
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                    詳細
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">5F-502号室</h3>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">即入居可</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>面積: 62.3㎡</div>
                  <div>賃料: ¥250,000</div>
                  <div>敷金: 2ヶ月</div>
                  <div>礼金: 1ヶ月</div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    図面DL
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                    詳細
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-medium text-gray-900">7F-701号室</h3>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">2月空室予定</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>面積: 58.9㎡</div>
                  <div>賃料: ¥220,000</div>
                  <div>敷金: 2ヶ月</div>
                  <div>礼金: 1ヶ月</div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                    図面DL
                  </button>
                  <button className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                    詳細
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">資料ダウンロード</h2>
            <div className="space-y-3">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">図面・資料</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">📐 フロア図面（全階）</span>
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">🏢 建物概要書</span>
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">💼 賃貸条件一覧</span>
                      <span className="text-xs text-gray-500">Excel</span>
                    </div>
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">契約書・細則</h3>
                <div className="space-y-2">
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">📄 賃貸借契約書</span>
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">📋 館内細則</span>
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </button>
                  <button className="w-full text-left p-2 border border-gray-300 rounded hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-700">💰 重要事項説明書</span>
                      <span className="text-xs text-gray-500">PDF</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">インフォメーション</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">新規空室情報</h3>
              <p className="text-sm text-gray-600 mt-1">
                7F-701号室が2月末に空室予定となります。詳細は資料をご確認ください。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-15</p>
            </div>
            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">賃貸条件変更のお知らせ</h3>
              <p className="text-sm text-gray-600 mt-1">
                3F-301号室の賃貸条件を一部変更いたしました。最新の条件は資料一覧をご確認ください。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-12</p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">建物設備リニューアル完了</h3>
              <p className="text-sm text-gray-600 mt-1">
                エレベーター設備のリニューアル工事が完了いたしました。最新の建物概要書をご利用ください。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-10</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrokerDashboard;