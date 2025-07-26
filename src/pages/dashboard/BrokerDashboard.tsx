import React from 'react';
import Layout from '../../components/layout/Layout';

const BrokerDashboard: React.FC = () => {

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">日個連会館　仲介会社専用ページ</h1>
        </div>

        {/* Information Section */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">インフォメーション</h2>
          <div className="space-y-1 text-sm">
            <div>• 2025.05.07 <a href="#" className="text-blue-600 hover:underline">3階空室情報</a>を更新しました。</div>
            <div>• 2025.05.02 <a href="#" className="text-blue-600 hover:underline">1階空室情報</a>を更新しました。</div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white border-2 border-gray-400 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">NEWS</h3>
              <div className="space-y-1 text-sm">
                <div>• 3階の賃料が198,000→186,000になりました（5/7）。</div>
                <div>• 1階の広告料が1ヶ月→2ヶ月になりました（5/2）。</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BrokerDashboard;