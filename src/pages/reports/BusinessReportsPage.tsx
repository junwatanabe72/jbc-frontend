import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../stores/authStore';

interface Report {
  id: string;
  title: string;
  type: 'cleaning' | 'inspection' | 'maintenance' | 'patrol' | 'emergency';
  status: 'draft' | 'in_progress' | 'completed' | 'submitted';
  period: string;
  createdAt: Date;
  submittedAt?: Date;
  description: string;
  attachments: string[];
  assignedTo: string;
}

const BusinessReportsPage: React.FC = () => {
  const { } = useAuthStore();
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('2024-07'); // YYYY-MM format - デフォルトで2024年7月を表示
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock data for reports
  const mockReports: Report[] = [
    // 2024年7月（当月）の報告書
    {
      id: 'rpt-001',
      title: '2024年7月度清掃作業報告',
      type: 'cleaning',
      status: 'in_progress',
      period: '2024-07',
      createdAt: new Date('2024-07-25'),
      description: '館内共用部分の清掃作業を実施中。エレベーター内の清掃、床面のワックス掛けを準備しています。',
      attachments: ['清掃チェックリスト.pdf'],
      assignedTo: 'user-mgmt1'
    },
    {
      id: 'rpt-002',
      title: '空調設備月次点検報告',
      type: 'inspection',
      status: 'completed',
      period: '2024-07',
      createdAt: new Date('2024-07-15'),
      description: '各階の空調設備の定期点検を完了。全て正常動作を確認しました。',
      attachments: ['点検チェックシート.pdf', '点検結果写真.jpg'],
      assignedTo: 'user-mgmt1'
    },
    {
      id: 'rpt-003',
      title: '防災設備点検報告',
      type: 'inspection',
      status: 'draft',
      period: '2024-07',
      createdAt: new Date('2024-07-20'),
      description: '消防設備、非常口、避難経路の点検を予定。',
      attachments: [],
      assignedTo: 'user-mgmt1'
    },
    // 2024年6月の報告書
    {
      id: 'rpt-004',
      title: '2024年6月度清掃作業報告',
      type: 'cleaning',
      status: 'submitted',
      period: '2024-06',
      createdAt: new Date('2024-06-28'),
      submittedAt: new Date('2024-07-01'),
      description: '館内共用部分の清掃作業を完了。エレベーター内の清掃、床面のワックス掛けを行いました。',
      attachments: ['清掃チェックリスト.pdf', '作業完了写真.jpg'],
      assignedTo: 'user-mgmt1'
    },
    {
      id: 'rpt-005',
      title: 'エレベーター定期メンテナンス',
      type: 'maintenance',
      status: 'submitted',
      period: '2024-06',
      createdAt: new Date('2024-06-10'),
      submittedAt: new Date('2024-06-11'),
      description: 'エレベーターの定期メンテナンスを実施。油圧系統の点検、ケーブル調整を行いました。',
      attachments: ['メンテナンス報告書.pdf', 'メンテナンス写真.jpg'],
      assignedTo: 'user-mgmt1'
    },
    // 2024年5月の報告書
    {
      id: 'rpt-006',
      title: '2024年5月度清掃作業報告',
      type: 'cleaning',
      status: 'submitted',
      period: '2024-05',
      createdAt: new Date('2024-05-30'),
      submittedAt: new Date('2024-06-01'),
      description: '館内共用部分の清掃作業を完了。窓ガラス清掃、カーペット清掃を重点的に実施しました。',
      attachments: ['清掃チェックリスト.pdf', '清掃完了写真.jpg'],
      assignedTo: 'user-mgmt1'
    },
    {
      id: 'rpt-007',
      title: '緊急対応：水漏れ修理',
      type: 'emergency',
      status: 'submitted',
      period: '2024-05',
      createdAt: new Date('2024-05-15'),
      submittedAt: new Date('2024-05-15'),
      description: '3階トイレで水漏れが発生。緊急対応として配管修理を実施し、正常復旧しました。',
      attachments: ['緊急対応報告書.pdf', '修理前後写真.jpg'],
      assignedTo: 'user-mgmt1'
    }
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'cleaning': return '清掃作業';
      case 'inspection': return '設備点検';
      case 'maintenance': return 'メンテナンス';
      case 'patrol': return '巡回点検';
      case 'emergency': return '緊急対応';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '下書き';
      case 'in_progress': return '作成中';
      case 'completed': return '完了';
      case 'submitted': return '提出済み';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'submitted': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cleaning': return 'bg-blue-100 text-blue-800';
      case 'inspection': return 'bg-purple-100 text-purple-800';
      case 'maintenance': return 'bg-orange-100 text-orange-800';
      case 'patrol': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = mockReports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedStatus !== 'all' && report.status !== selectedStatus) return false;
    if (report.period !== selectedMonth) return false;
    return true;
  });

  // 選択可能な月の一覧を生成（モックデータ期間に合わせて2024年5月〜7月）
  const generateMonthOptions = () => {
    // モックデータの期間に合わせて2024年の5月、6月、7月を表示
    const months = [
      { value: '2024-07', label: '2024年7月' },
      { value: '2024-06', label: '2024年6月' },
      { value: '2024-05', label: '2024年5月' }
    ];
    return months;
  };

  const monthOptions = generateMonthOptions();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">業務報告</h1>
            <p className="mt-1 text-sm text-gray-600">
              月次業務報告書の作成・管理
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + 新規報告書作成
          </button>
        </div>

        {/* フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4 flex-wrap gap-y-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">対象月:</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[140px]"
              >
                {monthOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">タイプ:</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                <option value="cleaning">清掃作業</option>
                <option value="inspection">設備点検</option>
                <option value="maintenance">メンテナンス</option>
                <option value="patrol">巡回点検</option>
                <option value="emergency">緊急対応</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mr-2">ステータス:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">すべて</option>
                <option value="draft">下書き</option>
                <option value="in_progress">作成中</option>
                <option value="completed">完了</option>
                <option value="submitted">提出済み</option>
              </select>
            </div>
          </div>
        </div>

        {/* 報告書一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              {monthOptions.find(opt => opt.value === selectedMonth)?.label}の報告書一覧 ({filteredReports.length}件)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    報告書
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    対象期間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    作成日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`px-2 py-1 text-xs rounded ${getTypeColor(report.type)}`}>
                            {getTypeLabel(report.type)}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {report.description.substring(0, 60)}...
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {report.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.createdAt.toLocaleDateString('ja-JP')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        詳細
                      </button>
                      <button className="text-green-600 hover:text-green-900 mr-3">
                        編集
                      </button>
                      {report.status === 'completed' && (
                        <button className="text-purple-600 hover:text-purple-900">
                          提出
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 報告書作成モーダル */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">新規報告書作成</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    報告書タイプ
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="cleaning">清掃作業報告</option>
                    <option value="inspection">設備点検報告</option>
                    <option value="maintenance">メンテナンス報告</option>
                    <option value="patrol">巡回点検報告</option>
                    <option value="emergency">緊急対応報告</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="報告書のタイトルを入力"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    対象月
                  </label>
                  <select
                    defaultValue={selectedMonth}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {monthOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    報告内容
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="実施した作業内容、発見した問題、改善提案などを記入してください"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    添付ファイル
                  </label>
                  <input
                    type="file"
                    multiple
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    写真、チェックシート、見積書などを添付できます
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                  >
                    下書き保存
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    作成
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BusinessReportsPage;