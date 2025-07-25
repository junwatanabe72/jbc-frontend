import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useRequestStore } from '../../stores/requestStore';
import { useAuthStore } from '../../stores/authStore';
import RequestStatusTimeline from '../../components/request/RequestStatusTimeline';
import type { Request, RequestStatus } from '../../types';

const RequestManagementPage: React.FC = () => {
  const { requests, approveRequest, rejectRequest, addComment } = useRequestStore();
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<RequestStatus | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [newComment, setNewComment] = useState('');

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'maintenance': return 'メンテナンス';
      case 'construction': return '工事';
      case 'move_in_out': return '搬入・搬出';
      case 'equipment': return '設備';
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

  const filteredRequests = requests.filter(request => {
    if (selectedStatus === 'all') return true;
    return request.status === selectedStatus;
  }).sort((a, b) => {
    // 優先度順、作成日順でソート
    const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] || 0;
    const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] || 0;
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority;
    }
    
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleApprove = (requestId: string) => {
    if (!user) return;
    approveRequest(requestId, user.id, '承認いたします。');
    setShowDetailModal(false);
  };

  const handleReject = (requestId: string) => {
    if (!user || !rejectionReason.trim()) return;
    rejectRequest(requestId, user.id, rejectionReason);
    setRejectionReason('');
    setShowDetailModal(false);
  };

  const handleAddComment = () => {
    if (!user || !selectedRequest || !newComment.trim()) return;
    addComment(selectedRequest.id, user.id, user.name, newComment);
    setNewComment('');
    // 更新された申請を取得
    const updatedRequest = requests.find(r => r.id === selectedRequest.id);
    if (updatedRequest) {
      setSelectedRequest(updatedRequest);
    }
  };

  const canManageRequest = (_request: Request) => {
    if (!user) return false;
    return user.role === 'OWNER' || user.role === 'MGMT';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">申請・承認管理</h1>
            <p className="mt-1 text-sm text-gray-600">
              テナントからの申請を確認・承認します
            </p>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">ステータス:</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as RequestStatus | 'all')}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">すべて</option>
              <option value="submitted">提出済み</option>
              <option value="under_review">審査中</option>
              <option value="approved">承認済み</option>
              <option value="rejected">却下</option>
              <option value="completed">完了</option>
            </select>
          </div>
        </div>

        {/* 申請一覧 */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              申請一覧 ({filteredRequests.length}件)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請内容
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    申請者
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
                    アクション
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.submitterName}
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        詳細
                      </button>
                      {canManageRequest(request) && request.status === 'submitted' && (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            承認
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 詳細モーダル */}
        {showDetailModal && selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">申請詳細</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">申請タイプ: </span>
                    <span className="text-sm text-gray-900">{getTypeLabel(selectedRequest.type)}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">優先度: </span>
                    <span className={`px-2 py-1 text-xs rounded ${getPriorityColor(selectedRequest.priority)}`}>
                      {getPriorityLabel(selectedRequest.priority)}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">タイトル: </span>
                  <span className="text-sm text-gray-900">{selectedRequest.title}</span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">詳細: </span>
                  <p className="text-sm text-gray-900 mt-1">{selectedRequest.description}</p>
                </div>

                {selectedRequest.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">場所: </span>
                    <span className="text-sm text-gray-900">{selectedRequest.location}</span>
                  </div>
                )}

                {selectedRequest.estimatedCost && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">予想費用: </span>
                    <span className="text-sm text-gray-900">¥{selectedRequest.estimatedCost.toLocaleString()}</span>
                  </div>
                )}

                {selectedRequest.dueDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">希望完了日: </span>
                    <span className="text-sm text-gray-900">
                      {new Date(selectedRequest.dueDate).toLocaleString('ja-JP')}
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-700">申請者: </span>
                  <span className="text-sm text-gray-900">{selectedRequest.submitterName}</span>
                </div>

                {/* 添付ファイル */}
                {selectedRequest.documents.length > 0 && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">添付ファイル:</span>
                    <div className="mt-2 space-y-2">
                      {selectedRequest.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                          <span className="text-lg">
                            {doc.name.endsWith('.pdf') ? '📄' : 
                             doc.name.match(/\.(jpg|jpeg|png|gif)$/i) ? '🖼️' : 
                             doc.name.match(/\.(doc|docx)$/i) ? '📝' : '📎'}
                          </span>
                          <div className="flex-1">
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:text-blue-800 underline"
                            >
                              {doc.name}
                            </a>
                            <p className="text-xs text-gray-500">
                              {(doc.size / 1024).toFixed(1)} KB • {new Date(doc.uploadedAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ステータス進捗 */}
                <div className="border-t pt-4">
                  <RequestStatusTimeline request={selectedRequest} />
                </div>

                {/* コメント */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">コメント</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedRequest.comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-900">{comment.userName}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString('ja-JP')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* コメント追加 */}
                  <div className="mt-3">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="コメントを追加..."
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={!newComment.trim()}
                      className="mt-2 px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700 disabled:opacity-50"
                    >
                      コメント追加
                    </button>
                  </div>
                </div>

                {/* 承認・却下アクション */}
                {canManageRequest(selectedRequest) && selectedRequest.status === 'submitted' && (
                  <div className="border-t pt-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        承認
                      </button>
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="却下理由を入力..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <button
                        onClick={() => handleReject(selectedRequest.id)}
                        disabled={!rejectionReason.trim()}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        却下
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default RequestManagementPage;