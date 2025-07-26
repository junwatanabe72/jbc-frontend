import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

interface FloorPlan {
  id: string;
  title: string;
  buildingName: string;
  floor: string;
  planType: 'building' | 'floor' | 'unit' | 'evacuation' | 'parking';
  fileFormat: 'pdf' | 'dwg' | 'jpg' | 'png';
  fileSize: string;
  lastUpdated: Date;
  description: string;
  isConfidential: boolean;
  downloadUrl: string;
}

const FloorPlanDownloadPage: React.FC = () => {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [selectedPlanType, setSelectedPlanType] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // モック図面データ
  const floorPlans: FloorPlan[] = [
    {
      id: 'plan-001',
      title: 'JBCビルディング全体平面図',
      buildingName: 'JBCビルディング',
      floor: '全階',
      planType: 'building',
      fileFormat: 'pdf',
      fileSize: '2.4MB',
      lastUpdated: new Date('2024-06-15'),
      description: '建物全体の平面図。各階の配置とフロア構成が記載されています。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-building-full.pdf'
    },
    {
      id: 'plan-002',
      title: '1階フロア平面図',
      buildingName: 'JBCビルディング',
      floor: '1階',
      planType: 'floor',
      fileFormat: 'dwg',
      fileSize: '1.8MB',
      lastUpdated: new Date('2024-07-01'),
      description: '1階フロアの詳細平面図。エントランス、エレベーター配置を含む。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-1f.dwg'
    },
    {
      id: 'plan-003',
      title: '2階フロア平面図',
      buildingName: 'JBCビルディング',
      floor: '2階',
      planType: 'floor',
      fileFormat: 'pdf',
      fileSize: '1.5MB',
      lastUpdated: new Date('2024-07-01'),
      description: '2階フロアの平面図。オフィスレイアウトと設備配置。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-2f.pdf'
    },
    {
      id: 'plan-004',
      title: '101号室詳細図面',
      buildingName: 'JBCビルディング',
      floor: '1階',
      planType: 'unit',
      fileFormat: 'pdf',
      fileSize: '0.8MB',
      lastUpdated: new Date('2024-07-10'),
      description: '101号室の詳細間取り図。寸法、設備配置を記載。',
      isConfidential: true,
      downloadUrl: '/plans/jbc-101.pdf'
    },
    {
      id: 'plan-005',
      title: '205号室詳細図面',
      buildingName: 'JBCビルディング',
      floor: '2階',
      planType: 'unit',
      fileFormat: 'dwg',
      fileSize: '1.2MB',
      lastUpdated: new Date('2024-07-12'),
      description: '205号室の詳細間取り図。CADデータ形式。',
      isConfidential: true,
      downloadUrl: '/plans/jbc-205.dwg'
    },
    {
      id: 'plan-006',
      title: '避難経路図',
      buildingName: 'JBCビルディング',
      floor: '全階',
      planType: 'evacuation',
      fileFormat: 'jpg',
      fileSize: '0.5MB',
      lastUpdated: new Date('2024-05-20'),
      description: '緊急時の避難経路と集合場所を示した図面。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-evacuation.jpg'
    },
    {
      id: 'plan-007',
      title: '駐車場レイアウト図',
      buildingName: 'JBCビルディング',
      floor: 'B1階',
      planType: 'parking',
      fileFormat: 'pdf',
      fileSize: '1.1MB',
      lastUpdated: new Date('2024-06-30'),
      description: '地下駐車場の配置図。区画番号と車路を記載。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-parking.pdf'
    },
    {
      id: 'plan-008',
      title: 'JBCアネックス全体平面図',
      buildingName: 'JBCアネックス',
      floor: '全階',
      planType: 'building',
      fileFormat: 'pdf',
      fileSize: '3.1MB',
      lastUpdated: new Date('2024-07-05'),
      description: 'アネックス棟の建物全体平面図。',
      isConfidential: false,
      downloadUrl: '/plans/jbc-annex-full.pdf'
    }
  ];

  const buildingNames = ['all', ...Array.from(new Set(floorPlans.map(plan => plan.buildingName)))];

  const getPlanTypeLabel = (type: string) => {
    switch (type) {
      case 'building': return '建物全体';
      case 'floor': return 'フロア平面';
      case 'unit': return '区画詳細';
      case 'evacuation': return '避難経路';
      case 'parking': return '駐車場';
      default: return type;
    }
  };

  const getPlanTypeColor = (type: string) => {
    switch (type) {
      case 'building': return 'bg-blue-100 text-blue-800';
      case 'floor': return 'bg-green-100 text-green-800';
      case 'unit': return 'bg-purple-100 text-purple-800';
      case 'evacuation': return 'bg-red-100 text-red-800';
      case 'parking': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'dwg': return '📐';
      case 'jpg': return '🖼️';
      case 'png': return '🖼️';
      default: return '📄';
    }
  };

  const filteredPlans = floorPlans.filter(plan => {
    const matchesBuilding = selectedBuilding === 'all' || plan.buildingName === selectedBuilding;
    const matchesPlanType = selectedPlanType === 'all' || plan.planType === selectedPlanType;
    const matchesFormat = selectedFormat === 'all' || plan.fileFormat === selectedFormat;
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBuilding && matchesPlanType && matchesFormat && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDownload = (plan: FloorPlan) => {
    // 実際のアプリでは、ファイルダウンロード処理を実装
    alert(`${plan.title} をダウンロードします。\nファイル形式: ${plan.fileFormat.toUpperCase()}\nファイルサイズ: ${plan.fileSize}`);
    
    // 模擬的なダウンロード統計更新
    console.log(`Downloaded: ${plan.title}`);
  };

  const handleBulkDownload = () => {
    if (filteredPlans.length === 0) {
      alert('ダウンロード可能なファイルがありません。');
      return;
    }
    
    const totalSize = filteredPlans.reduce((total, plan) => {
      const sizeNum = parseFloat(plan.fileSize.replace('MB', ''));
      return total + sizeNum;
    }, 0);
    
    if (confirm(`選択された${filteredPlans.length}個のファイル（合計 ${totalSize.toFixed(1)}MB）を一括ダウンロードしますか？`)) {
      alert('一括ダウンロードを開始します。');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">図面ダウンロード</h1>
            <p className="mt-1 text-sm text-gray-600">
              建物の平面図・設計図面のダウンロード
            </p>
          </div>
          <button
            onClick={handleBulkDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            📦 一括ダウンロード ({filteredPlans.length}件)
          </button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総図面数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{floorPlans.length}</p>
            <p className="mt-1 text-sm text-gray-500">利用可能</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">建物数</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {buildingNames.length - 1}
            </p>
            <p className="mt-1 text-sm text-gray-500">対象建物</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">図面種類</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {Array.from(new Set(floorPlans.map(p => p.planType))).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">種類</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">フィルター結果</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{filteredPlans.length}</p>
            <p className="mt-1 text-sm text-gray-500">表示中</p>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="図面名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">建物</label>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ての建物</option>
                {buildingNames.slice(1).map(building => (
                  <option key={building} value={building}>{building}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">図面種類</label>
              <select
                value={selectedPlanType}
                onChange={(e) => setSelectedPlanType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ての種類</option>
                <option value="building">建物全体</option>
                <option value="floor">フロア平面</option>
                <option value="unit">区画詳細</option>
                <option value="evacuation">避難経路</option>
                <option value="parking">駐車場</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ファイル形式</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ての形式</option>
                <option value="pdf">PDF</option>
                <option value="dwg">DWG (CAD)</option>
                <option value="jpg">JPG</option>
                <option value="png">PNG</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSelectedBuilding('all');
                  setSelectedPlanType('all');
                  setSelectedFormat('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                リセット
              </button>
            </div>
          </div>
        </div>

        {/* 図面一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              図面一覧 ({filteredPlans.length}件)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    図面情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    建物・階数
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    種類
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ファイル情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    更新日
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getFileFormatIcon(plan.fileFormat)}</span>
                          <p className="text-sm font-medium text-gray-900">{plan.title}</p>
                          {plan.isConfidential && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                              要承認
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{plan.buildingName}</div>
                      <div className="text-sm text-gray-500">{plan.floor}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPlanTypeColor(plan.planType)}`}>
                        {getPlanTypeLabel(plan.planType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{plan.fileFormat.toUpperCase()}</div>
                      <div className="text-sm text-gray-500">{plan.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(plan.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownload(plan)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        ダウンロード
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        プレビュー
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredPlans.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に一致する図面が見つかりませんでした。</p>
          </div>
        )}

        {/* 利用上の注意 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-yellow-800 mb-3">図面利用に関する注意事項</h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>• 図面の無断転載・複製は禁止されています</p>
            <p>• 商用利用の場合は事前に管理会社の許可が必要です</p>
            <p>• 「要承認」マークの付いた図面は管理会社の承認後にダウンロード可能になります</p>
            <p>• 図面の内容に関する質問は管理会社までお問い合わせください</p>
            <p>• ダウンロード履歴は管理会社で記録・管理されています</p>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">お問い合わせ・サポート</h3>
          <p className="text-sm text-gray-600 mb-2">
            図面に関するご質問や追加資料のご要望がございましたら、お気軽にお問い合わせください。
          </p>
          <div className="text-sm text-gray-600">
            <p>管理会社: 株式会社JBCマネジメント</p>
            <p>図面管理担当: 施設管理部</p>
            <p>電話: 03-1234-5678（内線: 図面管理）</p>
            <p>メール: plans@jbc-management.com</p>
            <p>対応時間: 平日 9:00-17:00</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FloorPlanDownloadPage;