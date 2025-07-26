import React from 'react';
import Layout from '../../components/layout/Layout';

const TenantDashboard: React.FC = () => {

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">日個連会館　テナント専用ページ</h1>
        </div>

        {/* Information Section */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">インフォメーション</h2>
          <div className="space-y-1 text-sm">
            <div>• 2025.05.07 <a href="#" className="text-blue-600 hover:underline">3階空室情報</a>を更新しました。</div>
            <div>• 2025.05.07 <a href="#" className="text-blue-600 hover:underline">1階空室情報</a>を更新しました。</div>
            <div>• 2025.05.09 2025年5月20日に<a href="#" className="text-blue-600 hover:underline">消防設備点検</a>を行います。</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <div className="space-y-6">
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

export default TenantDashboard;