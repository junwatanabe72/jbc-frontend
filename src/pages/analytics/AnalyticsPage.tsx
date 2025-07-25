import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { LineChart, BarChart, PieChart } from '../../components/charts/SimpleChart';
import { useAnalyticsStore } from '../../stores/analyticsStore';

const AnalyticsPage: React.FC = () => {
  const { 
    data, 
    isLoading, 
    selectedPeriod, 
    generateReport, 
    setPeriod, 
    exportReport 
  } = useAnalyticsStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'occupancy' | 'requests' | 'bookings'>('overview');

  useEffect(() => {
    generateReport();
  }, [generateReport]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (isLoading || !data) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">レポートを生成しています...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">レポート・分析</h1>
            <p className="text-sm text-gray-600">収益、入居率、申請状況の詳細分析</p>
          </div>
          <div className="flex space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setPeriod(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">週間</option>
              <option value="month">月間</option>
              <option value="quarter">四半期</option>
              <option value="year">年間</option>
            </select>
            <button
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              CSV出力
            </button>
            <button
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              PDF出力
            </button>
          </div>
        </div>

        {/* KPIカード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">月間売上</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(data.monthlyRevenue)}
            </p>
            <p className={`mt-1 text-sm ${data.revenueGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(data.revenueGrowth)} 前月比
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">入居率</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {data.currentOccupancyRate}%
            </p>
            <p className={`mt-1 text-sm ${data.occupancyTrend >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {formatPercent(data.occupancyTrend)} 前月比
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">処理中申請</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{data.pendingRequests}</p>
            <p className="mt-1 text-sm text-gray-500">総申請数: {data.totalRequests}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">予約利用率</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{data.bookingUtilization}%</p>
            <p className="mt-1 text-sm text-gray-500">月間予約: {data.monthlyBookings}件</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '概要' },
              { id: 'revenue', label: '収益分析' },
              { id: 'occupancy', label: '入居率分析' },
              { id: 'requests', label: '申請分析' },
              { id: 'bookings', label: '予約分析' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="space-y-6">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <LineChart
                    title="月別売上推移"
                    data={data.revenueData.map(item => ({ 
                      label: item.month, 
                      value: item.revenue 
                    }))}
                    showValues
                  />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <LineChart
                    title="入居率推移"
                    data={data.occupancyData.map(item => ({ 
                      label: item.month, 
                      value: item.occupancyRate 
                    }))}
                    showValues
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <BarChart
                    title="申請タイプ別件数"
                    data={data.requestAnalytics.map(item => ({ 
                      label: item.type, 
                      value: item.count,
                      color: '#3b82f6'
                    }))}
                  />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">重要指標</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">テナント継続率</span>
                      <span className="text-lg font-bold text-green-600">{data.tenantRetentionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">平均契約期間</span>
                      <span className="text-lg font-bold text-blue-600">{data.avgContractLength}ヶ月</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">顧客満足度</span>
                      <span className="text-lg font-bold text-purple-600">{data.customerSatisfaction}/5.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm font-medium text-gray-700">月間メンテナンス費</span>
                      <span className="text-lg font-bold text-orange-600">{formatCurrency(data.maintenanceCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'revenue' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <LineChart
                  title="収益・支出・利益推移"
                  data={data.revenueData.map(item => ({ 
                    label: item.month, 
                    value: item.profit 
                  }))}
                  showValues
                />
                <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">平均売上</p>
                    <p className="text-lg font-bold text-green-600">
                      {formatCurrency(data.revenueData.reduce((sum, item) => sum + item.revenue, 0) / data.revenueData.length)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">平均支出</p>
                    <p className="text-lg font-bold text-red-600">
                      {formatCurrency(data.revenueData.reduce((sum, item) => sum + item.expenses, 0) / data.revenueData.length)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">平均利益</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatCurrency(data.revenueData.reduce((sum, item) => sum + item.profit, 0) / data.revenueData.length)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">収益構成</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">月</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">売上</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">支出</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">利益</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.revenueData.slice(-6).map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{item.month}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">{formatCurrency(item.revenue)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">{formatCurrency(item.expenses)}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">{formatCurrency(item.profit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'occupancy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <LineChart
                  title="入居率推移"
                  data={data.occupancyData.map(item => ({ 
                    label: item.month, 
                    value: item.occupancyRate 
                  }))}
                  showValues
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <BarChart
                  title="月別入居数"
                  data={data.occupancyData.slice(-6).map(item => ({ 
                    label: item.month, 
                    value: item.occupiedUnits,
                    color: '#10b981'
                  }))}
                />
              </div>
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <BarChart
                  title="申請タイプ別件数"
                  data={data.requestAnalytics.map(item => ({ 
                    label: item.type, 
                    value: item.count,
                    color: '#3b82f6'
                  }))}
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <PieChart
                  title="承認率分布"
                  data={data.requestAnalytics.map((item, index) => ({ 
                    label: item.type, 
                    value: item.approvalRate,
                    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'][index]
                  }))}
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow lg:col-span-2">
                <h3 className="text-lg font-medium text-gray-900 mb-4">申請処理状況</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">申請タイプ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">件数</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">平均処理時間</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">承認率</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.requestAnalytics.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.type}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}件</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.avgProcessingTime.toFixed(1)}日</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.approvalRate.toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <LineChart
                  title="月別予約数推移"
                  data={data.bookingAnalytics.map(item => ({ 
                    label: item.month, 
                    value: item.totalBookings 
                  }))}
                  showValues
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <BarChart
                  title="予約利用率推移"
                  data={data.bookingAnalytics.slice(-6).map(item => ({ 
                    label: item.month, 
                    value: item.utilizationRate,
                    color: '#8b5cf6'
                  }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;