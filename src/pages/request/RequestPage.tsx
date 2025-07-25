import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import RequestForm from '../../components/common/RequestForm';
import { useRequestStore } from '../../stores/requestStore';
import { useAuthStore } from '../../stores/authStore';

const RequestPage: React.FC = () => {
  const { requests } = useRequestStore();
  const { user } = useAuthStore();
  const [showRequestForm, setShowRequestForm] = useState(false);

  const userRequests = requests.filter(request => request.submitterId === user?.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance': return 'メンテナンス';
      case 'construction': return '工事';
      case 'move_in_out': return '搬入・搬出';
      case 'equipment': return '設備';
      case 'room_booking': return '会議室予約';
      case 'other': return 'その他';
      default: return type;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return '下書き';
      case 'submitted': return '提出済み';
      case 'under_review': return '審査中';
      case 'approved': return '承認済み';
      case 'rejected': return '却下';
      case 'completed': return '完了';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'under_review': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return '緊急';
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return priority;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">各種申請</h1>
            <p className="mt-1 text-sm text-gray-600">
              メンテナンス・工事・搬入搬出などの申請を行います
            </p>
          </div>
          <button
            onClick={() => setShowRequestForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + 新規申請
          </button>
        </div>

        {/* 申請タイプ別クイックアクション */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🔧</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">メンテナンス申請</h3>
                <p className="text-sm text-gray-500">設備の修理・点検依頼</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">🏗️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">工事申請</h3>
                <p className="text-sm text-gray-500">内装工事・改修工事</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📦</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">搬入・搬出申請</h3>
                <p className="text-sm text-gray-500">備品・設備の搬入搬出</p>
              </div>
            </div>
          </div>
        </div>

        {/* 申請履歴 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              申請履歴 ({userRequests.length}件)
            </h2>
          </div>
          
          {userRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">まだ申請はありません</p>
              <button
                onClick={() => setShowRequestForm(true)}
                className="mt-2 text-blue-600 hover:text-blue-800"
              >
                最初の申請を作成する
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      申請内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      優先度
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      作成日
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      更新日
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {request.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {getTypeLabel(request.type)}
                            {request.location && ` • ${request.location}`}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(request.priority)}`}>
                          {getPriorityLabel(request.priority)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(request.status)}`}>
                          {getStatusLabel(request.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString('ja-JP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.updatedAt).toLocaleDateString('ja-JP')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 申請状況サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl text-blue-600">📋</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-800">提出済み</p>
                <p className="text-2xl font-bold text-blue-600">
                  {userRequests.filter(r => r.status === 'submitted').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl text-yellow-600">⏳</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-800">審査中</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {userRequests.filter(r => r.status === 'under_review').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl text-green-600">✅</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">承認済み</p>
                <p className="text-2xl font-bold text-green-600">
                  {userRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-xl text-gray-600">🏁</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">完了</p>
                <p className="text-2xl font-bold text-gray-600">
                  {userRequests.filter(r => r.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <RequestForm
          isOpen={showRequestForm}
          onClose={() => setShowRequestForm(false)}
        />
      </div>
    </Layout>
  );
};

export default RequestPage;