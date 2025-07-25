import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useEmergencyStore } from '../../stores/emergencyStore';
import { useAuthStore } from '../../stores/authStore';
import { useBuildingStore } from '../../stores/buildingStore';
import type { EmergencyCategory, EmergencySeverity, EmergencyIncident } from '../../types/emergency';

const EmergencyPage: React.FC = () => {
  const { user } = useAuthStore();
  const { buildings } = useBuildingStore();
  const {
    incidents,
    contacts,
    protocols,
    activeIncidents,
    reportIncident,
    updateIncident,
    addIncidentUpdate,
    acknowledgeIncident,
    resolveIncident,
    getActiveIncidents,
    getCriticalIncidents,
    getProtocolByCategory
  } = useEmergencyStore();

  const [activeTab, setActiveTab] = useState<'incidents' | 'report' | 'contacts' | 'protocols'>('incidents');
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);
  const [newUpdate, setNewUpdate] = useState('');

  const [reportForm, setReportForm] = useState({
    title: '',
    description: '',
    category: 'other' as EmergencyCategory,
    severity: 'medium' as EmergencySeverity,
    location: '',
    buildingId: buildings[0]?.id || '',
    reporterPhone: '',
  });

  const getCategoryLabel = (category: EmergencyCategory) => {
    const labels = {
      fire: '🔥 火災',
      security: '🔒 セキュリティ',
      medical: '🏥 医療',
      infrastructure: '🏗️ インフラ',
      weather: '🌪️ 天候',
      power: '⚡ 電力',
      water: '💧 水道',
      elevator: '🏢 エレベーター',
      hvac: '❄️ 空調',
      other: '❓ その他'
    };
    return labels[category] || category;
  };

  const getSeverityLabel = (severity: EmergencySeverity) => {
    const labels = {
      critical: '🚨 緊急',
      high: '🔴 高',
      medium: '🟡 中',
      low: '🟢 低'
    };
    return labels[severity] || severity;
  };

  const getSeverityColor = (severity: EmergencySeverity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[severity] || colors.medium;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      reported: '📋 報告済み',
      acknowledged: '👁️ 確認済み',
      responding: '🏃 対応中',
      resolved: '✅ 解決済み',
      closed: '📁 終了'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      reported: 'bg-blue-100 text-blue-800',
      acknowledged: 'bg-yellow-100 text-yellow-800',
      responding: 'bg-purple-100 text-purple-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.reported;
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    reportIncident({
      ...reportForm,
      reportedBy: user.id,
      reporterName: user.name,
    });

    // フォームリセット
    setReportForm({
      title: '',
      description: '',
      category: 'other',
      severity: 'medium',
      location: '',
      buildingId: buildings[0]?.id || '',
      reporterPhone: '',
    });

    setShowReportModal(false);
    alert('緊急事案を報告しました。関係者に通知されます。');
  };

  const handleAddUpdate = (incidentId: string) => {
    if (!user || !newUpdate.trim()) return;

    addIncidentUpdate(incidentId, {
      userId: user.id,
      userName: user.name,
      content: newUpdate,
    });

    setNewUpdate('');
  };

  const criticalIncidents = getCriticalIncidents();
  const recentIncidents = incidents.slice(0, 10);

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">緊急連絡システム</h1>
            <p className="text-sm text-gray-600">緊急事案の報告・管理・対応</p>
          </div>
          <button
            onClick={() => setShowReportModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
          >
            🚨 緊急事案を報告
          </button>
        </div>

        {/* 緊急アラート */}
        {criticalIncidents.length > 0 && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-2xl">🚨</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  緊急事案が発生しています ({criticalIncidents.length}件)
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {criticalIncidents.map(incident => (
                    <div key={incident.id} className="mb-1">
                      • {incident.title} ({incident.location})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">アクティブ事案</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{activeIncidents.length}</p>
            <p className="mt-1 text-sm text-gray-500">対応中・確認中</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">緊急事案</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{criticalIncidents.length}</p>
            <p className="mt-1 text-sm text-gray-500">最高優先度</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総事案数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{incidents.length}</p>
            <p className="mt-1 text-sm text-gray-500">全期間</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">緊急連絡先</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{contacts.filter(c => c.isActive).length}</p>
            <p className="mt-1 text-sm text-gray-500">有効</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'incidents', label: '事案一覧' },
              { id: 'report', label: '事案報告' },
              { id: 'contacts', label: '緊急連絡先' },
              { id: 'protocols', label: '対応手順' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* タブコンテンツ */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'incidents' && (
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">事案一覧</h3>
                
                <div className="space-y-4">
                  {recentIncidents.map((incident) => (
                    <div key={incident.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-medium text-gray-900">{incident.title}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(incident.severity)}`}>
                              {getSeverityLabel(incident.severity)}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(incident.status)}`}>
                              {getStatusLabel(incident.status)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">カテゴリ:</span> {getCategoryLabel(incident.category)}</p>
                            <p><span className="font-medium">場所:</span> {incident.location}</p>
                            <p><span className="font-medium">報告者:</span> {incident.reporterName}</p>
                            <p><span className="font-medium">報告時刻:</span> {incident.createdAt.toLocaleString('ja-JP')}</p>
                          </div>
                          
                          <p className="text-sm text-gray-700 mt-2">{incident.description}</p>
                          
                          {incident.updates.length > 0 && (
                            <div className="mt-3 text-xs text-gray-500">
                              最新更新: {incident.updates[incident.updates.length - 1].content}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => setSelectedIncident(incident)}
                            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                          >
                            詳細
                          </button>
                          {incident.status === 'reported' && user?.role !== 'TENANT' && (
                            <button
                              onClick={() => acknowledgeIncident(incident.id, user.id)}
                              className="px-3 py-1 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                            >
                              確認
                            </button>
                          )}
                          {incident.status !== 'resolved' && incident.status !== 'closed' && user?.role !== 'TENANT' && (
                            <button
                              onClick={() => resolveIncident(incident.id, user.id)}
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                            >
                              解決
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {incidents.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <p>報告された事案はありません</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'report' && (
            <div className="p-6">
              <div className="max-w-2xl">
                <h3 className="text-lg font-medium text-gray-900 mb-4">緊急事案報告</h3>
                
                <form onSubmit={handleReportSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        カテゴリ *
                      </label>
                      <select
                        value={reportForm.category}
                        onChange={(e) => setReportForm({...reportForm, category: e.target.value as EmergencyCategory})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="fire">🔥 火災</option>
                        <option value="security">🔒 セキュリティ</option>
                        <option value="medical">🏥 医療</option>
                        <option value="infrastructure">🏗️ インフラ</option>
                        <option value="weather">🌪️ 天候</option>
                        <option value="power">⚡ 電力</option>
                        <option value="water">💧 水道</option>
                        <option value="elevator">🏢 エレベーター</option>
                        <option value="hvac">❄️ 空調</option>
                        <option value="other">❓ その他</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        緊急度 *
                      </label>
                      <select
                        value={reportForm.severity}
                        onChange={(e) => setReportForm({...reportForm, severity: e.target.value as EmergencySeverity})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="critical">🚨 緊急（生命に関わる）</option>
                        <option value="high">🔴 高（すぐに対応が必要）</option>
                        <option value="medium">🟡 中（数時間以内に対応）</option>
                        <option value="low">🟢 低（業務時間内に対応）</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      事案タイトル *
                    </label>
                    <input
                      type="text"
                      value={reportForm.title}
                      onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                      required
                      placeholder="例: 3階廊下での水漏れ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      詳細説明 *
                    </label>
                    <textarea
                      value={reportForm.description}
                      onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                      required
                      rows={4}
                      placeholder="状況の詳細、発生場所、影響範囲などを記入してください"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        建物 *
                      </label>
                      <select
                        value={reportForm.buildingId}
                        onChange={(e) => setReportForm({...reportForm, buildingId: e.target.value})}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        {buildings.map(building => (
                          <option key={building.id} value={building.id}>
                            {building.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        詳細な場所 *
                      </label>
                      <input
                        type="text"
                        value={reportForm.location}
                        onChange={(e) => setReportForm({...reportForm, location: e.target.value})}
                        required
                        placeholder="例: 3階東側廊下"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      連絡先電話番号
                    </label>
                    <input
                      type="tel"
                      value={reportForm.reporterPhone}
                      onChange={(e) => setReportForm({...reportForm, reporterPhone: e.target.value})}
                      placeholder="緊急時の連絡先"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                    >
                      🚨 緊急事案を報告
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'contacts' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">緊急連絡先</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + 連絡先追加
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {contacts.filter(c => c.isActive).map((contact) => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{contact.name}</h4>
                          <p className="text-sm text-gray-600">{contact.role}</p>
                        </div>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                          優先度 {contact.priority}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <span>📞</span>
                          <a href={`tel:${contact.phone}`} className="text-blue-600 hover:text-blue-800">
                            {contact.phone}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>📧</span>
                          <a href={`mailto:${contact.email}`} className="text-blue-600 hover:text-blue-800">
                            {contact.email}
                          </a>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span>🕒</span>
                          <span className="text-gray-600">
                            {contact.availability === '24h' ? '24時間対応' :
                             contact.availability === 'business_hours' ? '営業時間内' : '緊急時のみ'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'protocols' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">対応手順</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + 手順追加
                  </button>
                </div>
                
                <div className="space-y-4">
                  {protocols.filter(p => p.isActive).map((protocol) => (
                    <div key={protocol.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{protocol.name}</h4>
                          <p className="text-sm text-gray-600">{getCategoryLabel(protocol.category)}</p>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-4">{protocol.description}</p>
                      
                      <div className="space-y-2">
                        <h5 className="text-sm font-medium text-gray-900">対応手順:</h5>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 ml-4">
                          {protocol.steps.map((step) => (
                            <li key={step.id} className={step.isCritical ? 'font-medium text-red-700' : ''}>
                              <span className="font-medium">{step.title}</span>
                              <span className="text-gray-500"> ({step.estimatedTime}分)</span>
                              <div className="text-xs text-gray-500 ml-4 mt-1">
                                {step.description}
                              </div>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 事案詳細モーダル */}
        {selectedIncident && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedIncident.title}</h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`px-2 py-1 text-xs rounded-full border ${getSeverityColor(selectedIncident.severity)}`}>
                      {getSeverityLabel(selectedIncident.severity)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(selectedIncident.status)}`}>
                      {getStatusLabel(selectedIncident.status)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">事案詳細</h3>
                  <dl className="space-y-2 text-sm">
                    <div>
                      <dt className="font-medium text-gray-700">カテゴリ:</dt>
                      <dd className="text-gray-600">{getCategoryLabel(selectedIncident.category)}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">場所:</dt>
                      <dd className="text-gray-600">{selectedIncident.location}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">報告者:</dt>
                      <dd className="text-gray-600">{selectedIncident.reporterName}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">報告時刻:</dt>
                      <dd className="text-gray-600">{selectedIncident.createdAt.toLocaleString('ja-JP')}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-700">説明:</dt>
                      <dd className="text-gray-600">{selectedIncident.description}</dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">更新履歴</h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedIncident.updates.map((update) => (
                      <div key={update.id} className="p-3 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <span className="text-sm font-medium text-gray-900">{update.userName}</span>
                          <span className="text-xs text-gray-500">
                            {update.timestamp.toLocaleString('ja-JP')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{update.content}</p>
                      </div>
                    ))}
                  </div>

                  {user?.role !== 'TENANT' && selectedIncident.status !== 'closed' && (
                    <div className="mt-4">
                      <textarea
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        placeholder="更新情報を入力..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleAddUpdate(selectedIncident.id)}
                        disabled={!newUpdate.trim()}
                        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        更新を追加
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmergencyPage;