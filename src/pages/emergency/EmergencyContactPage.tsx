import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useAuthStore } from '../../stores/authStore';

interface EmergencyContact {
  id: string;
  name: string;
  organization: string;
  phone: string;
  email?: string;
  type: 'fire' | 'police' | 'medical' | 'management' | 'security' | 'utilities';
  available24h: boolean;
  description: string;
}

interface EmergencyReport {
  id: string;
  type: 'fire' | 'medical' | 'security' | 'facilities' | 'natural_disaster' | 'other';
  description: string;
  location: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reportedAt: Date;
  reportedBy: string;
  status: 'reported' | 'responding' | 'resolved';
}

const EmergencyContactPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'contacts' | 'report' | 'history'>('contacts');
  const [selectedEmergencyType, setSelectedEmergencyType] = useState<string>('');

  // 緊急連絡先リスト
  const emergencyContacts: EmergencyContact[] = [
    {
      id: 'contact-001',
      name: '消防署',
      organization: '東京消防庁',
      phone: '119',
      type: 'fire',
      available24h: true,
      description: '火災・救急・救助'
    },
    {
      id: 'contact-002',
      name: '警察署',
      organization: '所轄警察署',
      phone: '110',
      type: 'police',
      available24h: true,
      description: '事件・事故・不審者対応'
    },
    {
      id: 'contact-003',
      name: '建物管理会社',
      organization: '株式会社JBCマネジメント',
      phone: '03-1234-5678',
      email: 'emergency@jbc-management.com',
      type: 'management',
      available24h: true,
      description: '建物に関する緊急事態・設備故障'
    },
    {
      id: 'contact-004',
      name: '警備会社',
      organization: 'セキュリティJBC',
      phone: '03-9876-5432',
      type: 'security',
      available24h: true,
      description: 'セキュリティ・防犯・不審者対応'
    },
    {
      id: 'contact-005',
      name: '電力会社',
      organization: '東京電力',
      phone: '0120-995-007',
      type: 'utilities',
      available24h: true,
      description: '停電・電気設備トラブル'
    },
    {
      id: 'contact-006',
      name: 'ガス会社',
      organization: '東京ガス',
      phone: '0570-002-299',
      type: 'utilities',
      available24h: true,
      description: 'ガス漏れ・ガス設備トラブル'
    },
    {
      id: 'contact-007',
      name: '水道局',
      organization: '東京都水道局',
      phone: '03-5326-1100',
      type: 'utilities',
      available24h: false,
      description: '断水・水道設備トラブル（平日8:30-17:15）'
    }
  ];

  // 緊急通報履歴（モックデータ）
  const emergencyHistory: EmergencyReport[] = [
    {
      id: 'report-001',
      type: 'facilities',
      description: 'エレベーター故障により閉じ込められた',
      location: '1階エレベーター',
      severity: 'high',
      reportedAt: new Date('2024-07-20T14:30:00'),
      reportedBy: 'tenant@example.com',
      status: 'resolved'
    },
    {
      id: 'report-002',
      type: 'medical',
      description: '3階で人が倒れているのを発見',
      location: '3階廊下',
      severity: 'critical',
      reportedAt: new Date('2024-07-15T09:15:00'),
      reportedBy: 'mgmt@example.com',
      status: 'resolved'
    },
    {
      id: 'report-003',
      type: 'security',
      description: '不審者が建物内を徘徊している',
      location: '2階共用エリア',
      severity: 'medium',
      reportedAt: new Date('2024-07-10T22:45:00'),
      reportedBy: 'owner@example.com',
      status: 'resolved'
    }
  ];

  const getContactTypeLabel = (type: string) => {
    switch (type) {
      case 'fire': return '消防・救急';
      case 'police': return '警察';
      case 'medical': return '医療';
      case 'management': return '管理会社';
      case 'security': return '警備';
      case 'utilities': return 'ライフライン';
      default: return type;
    }
  };

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'fire': return 'bg-red-100 text-red-800';
      case 'police': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-green-100 text-green-800';
      case 'management': return 'bg-purple-100 text-purple-800';
      case 'security': return 'bg-yellow-100 text-yellow-800';
      case 'utilities': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmergencyTypeLabel = (type: string) => {
    switch (type) {
      case 'fire': return '火災';
      case 'medical': return '救急医療';
      case 'security': return 'セキュリティ';
      case 'facilities': return '設備故障';
      case 'natural_disaster': return '自然災害';
      case 'other': return 'その他';
      default: return type;
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'low': return '軽微';
      case 'medium': return '中程度';
      case 'high': return '高';
      case 'critical': return '緊急';
      default: return severity;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEmergencyCall = (phone: string, name: string) => {
    if (confirm(`${name}（${phone}）に電話をかけますか？`)) {
      // 実際のアプリでは tel: プロトコルで電話アプリを起動
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* 緊急時ヘッダー */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-red-600 text-2xl">🚨</span>
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-red-800">緊急連絡先</h1>
              <p className="mt-1 text-sm text-red-700">
                生命に関わる緊急事態の場合は、まず119（消防・救急）または110（警察）に連絡してください
              </p>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'contacts', label: '緊急連絡先' },
              { id: 'report', label: '緊急通報' },
              { id: 'history', label: '通報履歴' }
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

        {/* 緊急連絡先一覧 */}
        {activeTab === 'contacts' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-white rounded-lg shadow border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.organization}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getContactTypeColor(contact.type)}`}>
                    {getContactTypeLabel(contact.type)}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-16">電話:</span>
                    <button
                      onClick={() => handleEmergencyCall(contact.phone, contact.name)}
                      className="text-lg font-bold text-red-600 hover:text-red-800 underline"
                    >
                      {contact.phone}
                    </button>
                  </div>
                  {contact.email && (
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-700 w-16">メール:</span>
                      <a href={`mailto:${contact.email}`} className="text-sm text-blue-600 hover:text-blue-800">
                        {contact.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700 w-16">対応:</span>
                    <span className={`text-sm ${contact.available24h ? 'text-green-600' : 'text-orange-600'}`}>
                      {contact.available24h ? '24時間対応' : '営業時間内のみ'}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600">{contact.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* 緊急通報フォーム */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-lg font-medium text-gray-900 mb-6">緊急事態の通報</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    緊急事態の種類 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedEmergencyType}
                    onChange={(e) => setSelectedEmergencyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">選択してください</option>
                    <option value="fire">火災</option>
                    <option value="medical">救急医療</option>
                    <option value="security">セキュリティ</option>
                    <option value="facilities">設備故障</option>
                    <option value="natural_disaster">自然災害</option>
                    <option value="other">その他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    発生場所 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="例: 3階301号室、1階エレベーター前"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    緊急度 <span className="text-red-500">*</span>
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" required>
                    <option value="">選択してください</option>
                    <option value="critical">緊急（生命に関わる）</option>
                    <option value="high">高（すぐに対応が必要）</option>
                    <option value="medium">中程度</option>
                    <option value="low">軽微</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    詳細説明 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="状況を詳しく説明してください"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    連絡先（任意）
                  </label>
                  <input
                    type="text"
                    placeholder="緊急時の連絡先電話番号"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    type="submit"
                    className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                  >
                    緊急通報を送信
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 通報履歴 */}
        {activeTab === 'history' && (user?.role === 'OWNER' || user?.role === 'MGMT') && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">緊急通報履歴</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      通報日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      種類
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      場所
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      緊急度
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      内容
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {emergencyHistory.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {report.reportedAt.toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getEmergencyTypeLabel(report.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(report.severity)}`}>
                          {getSeverityLabel(report.severity)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {report.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="text-green-600">対応済み</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && user?.role !== 'OWNER' && user?.role !== 'MGMT' && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">通報履歴の閲覧権限がありません。</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmergencyContactPage;