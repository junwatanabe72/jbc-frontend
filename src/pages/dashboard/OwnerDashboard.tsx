import React from 'react';
import Layout from '../../components/layout/Layout';

const OwnerDashboard: React.FC = () => {

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">日個連会館 オーナー専用ページ</h1>
        </div>

        {/* Information Section */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">（テナント向け）インフォメーション</h2>
            <button className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
              編集
            </button>
          </div>
          <div className="space-y-1 text-sm">
            <div>• 2025.05.01 <a href="#" className="text-blue-600 hover:underline">3階空室情報</a>を更新しました。</div>
            <div>• 2025.05.01 <a href="#" className="text-blue-600 hover:underline">1階空室情報</a>を更新しました。</div>
            <div>• 2025.05.02 2025年5月20日に<a href="#" className="text-blue-600 hover:underline">消防設備点検</a>を行います。</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <div className="space-y-6">
            {/* TODO List */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">TODOリスト</h3>
              <div className="space-y-1 text-sm">
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mr-2">緊急</span>
                  <span className="text-red-600">101テナント様より緊急連絡あり。</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mr-2">会議予約</span>
                  <span>301テナント様から会議室の予約あり。</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mr-2">イベント</span>
                  <span>401テナント様から避難訓練参加の申し込みあり。</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded mr-2">修繕</span>
                  <span>205テナント様からエアコン修繕の申請あり。</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded mr-2">駐車場</span>
                  <span>102テナント様から駐車場契約変更の申請あり。</span>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">本日の予定</h3>
              <div className="text-sm">
                <div>• 17時より302号室で工事があります。</div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">近日の予定</h3>
              <div className="space-y-1 text-sm">
                <div>• 5月8日10時から<a href="#" className="text-blue-600 hover:underline">空調点検</a>を行います。</div>
                <div>• 5月9日14時より<a href="#" className="text-blue-600 hover:underline">避難訓練</a>を行います。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OwnerDashboard;