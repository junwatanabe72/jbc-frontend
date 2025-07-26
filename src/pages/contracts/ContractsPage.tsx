import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

interface ContractDocument {
  id: string;
  title: string;
  category: 'contract' | 'rules' | 'agreement' | 'form' | 'guide';
  buildingName: string;
  documentType: string;
  fileFormat: 'pdf' | 'doc' | 'docx';
  fileSize: string;
  lastUpdated: Date;
  version: string;
  description: string;
  isRequired: boolean;
  downloadUrl: string;
}

const ContractsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // モック契約書・規則データ
  const documents: ContractDocument[] = [
    {
      id: 'doc-001',
      title: '標準賃貸借契約書ひな型',
      category: 'contract',
      buildingName: 'JBCビルディング',
      documentType: '賃貸借契約書',
      fileFormat: 'pdf',
      fileSize: '1.2MB',
      lastUpdated: new Date('2024-07-01'),
      version: 'v2.1',
      description: 'オフィス賃貸借契約書の標準ひな型。最新の法改正に対応済み。',
      isRequired: true,
      downloadUrl: '/contracts/standard-lease-template.pdf'
    },
    {
      id: 'doc-002',
      title: 'JBCビルディング館内細則',
      category: 'rules',
      buildingName: 'JBCビルディング',
      documentType: '館内細則',
      fileFormat: 'pdf',
      fileSize: '0.8MB',
      lastUpdated: new Date('2024-06-15'),
      version: 'v3.4',
      description: '館内での利用規則、共用部分の使用方法、禁止事項等を記載。',
      isRequired: true,
      downloadUrl: '/contracts/jbc-building-rules.pdf'
    },
    {
      id: 'doc-003',
      title: '駐車場利用契約書',
      category: 'agreement',
      buildingName: 'JBCビルディング',
      documentType: '駐車場契約書',
      fileFormat: 'pdf',
      fileSize: '0.5MB',
      lastUpdated: new Date('2024-07-10'),
      version: 'v1.3',
      description: '地下駐車場の利用に関する契約書。月極契約・時間貸し対応。',
      isRequired: false,
      downloadUrl: '/contracts/parking-agreement.pdf'
    },
    {
      id: 'doc-004',
      title: '入居申込書',
      category: 'form',
      buildingName: 'JBCビルディング',
      documentType: '申込書',
      fileFormat: 'docx',
      fileSize: '0.3MB',
      lastUpdated: new Date('2024-07-05'),
      version: 'v2.0',
      description: '新規入居申込み時に使用する申込書。編集可能なWord形式。',
      isRequired: true,
      downloadUrl: '/contracts/application-form.docx'
    },
    {
      id: 'doc-005',
      title: '重要事項説明書',
      category: 'contract',
      buildingName: 'JBCビルディング',
      documentType: '重要事項説明書',
      fileFormat: 'pdf',
      fileSize: '1.5MB',
      lastUpdated: new Date('2024-06-30'),
      version: 'v2.2',
      description: '宅建業法に基づく重要事項説明書。物件詳細情報を記載。',
      isRequired: true,
      downloadUrl: '/contracts/important-matters.pdf'
    },
    {
      id: 'doc-006',
      title: '火災保険加入ガイド',
      category: 'guide',
      buildingName: 'JBCビルディング',
      documentType: 'ガイド',
      fileFormat: 'pdf',
      fileSize: '0.6MB',
      lastUpdated: new Date('2024-06-20'),
      version: 'v1.5',
      description: '入居時に必要な火災保険加入手続きのガイド。推奨保険会社リスト付き。',
      isRequired: false,
      downloadUrl: '/contracts/insurance-guide.pdf'
    },
    {
      id: 'doc-007',
      title: '更新契約書ひな型',
      category: 'contract',
      buildingName: 'JBCビルディング',
      documentType: '更新契約書',
      fileFormat: 'pdf',
      fileSize: '0.9MB',
      lastUpdated: new Date('2024-07-12'),
      version: 'v1.8',
      description: '賃貸借契約更新時に使用する契約書ひな型。',
      isRequired: true,
      downloadUrl: '/contracts/renewal-contract.pdf'
    },
    {
      id: 'doc-008',
      title: 'JBCアネックス館内細則',
      category: 'rules',
      buildingName: 'JBCアネックス',
      documentType: '館内細則',
      fileFormat: 'pdf',
      fileSize: '0.7MB',
      lastUpdated: new Date('2024-07-08'),
      version: 'v2.1',
      description: 'アネックス棟の利用規則。本館とは一部規則が異なります。',
      isRequired: true,
      downloadUrl: '/contracts/jbc-annex-rules.pdf'
    },
    {
      id: 'doc-009',
      title: '解約通知書',
      category: 'form',
      buildingName: 'JBCビルディング',
      documentType: '解約通知書',
      fileFormat: 'docx',
      fileSize: '0.2MB',
      lastUpdated: new Date('2024-06-25'),
      version: 'v1.4',
      description: '賃貸借契約解約時に使用する通知書。編集可能なWord形式。',
      isRequired: false,
      downloadUrl: '/contracts/termination-notice.docx'
    },
    {
      id: 'doc-010',
      title: '個人情報取扱同意書',
      category: 'agreement',
      buildingName: 'JBCビルディング',
      documentType: '同意書',
      fileFormat: 'pdf',
      fileSize: '0.4MB',
      lastUpdated: new Date('2024-07-01'),
      version: 'v1.2',
      description: '個人情報の取扱いに関する同意書。GDPR対応済み。',
      isRequired: true,
      downloadUrl: '/contracts/privacy-consent.pdf'
    }
  ];

  const buildingNames = ['all', ...Array.from(new Set(documents.map(doc => doc.buildingName)))];

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'contract': return '契約書';
      case 'rules': return '館内細則';
      case 'agreement': return '同意書・覚書';
      case 'form': return '申込書・届出書';
      case 'guide': return 'ガイド・説明書';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'contract': return 'bg-blue-100 text-blue-800';
      case 'rules': return 'bg-red-100 text-red-800';
      case 'agreement': return 'bg-green-100 text-green-800';
      case 'form': return 'bg-purple-100 text-purple-800';
      case 'guide': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return '📄';
      case 'doc': return '📝';
      case 'docx': return '📝';
      default: return '📄';
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesBuilding = selectedBuilding === 'all' || doc.buildingName === selectedBuilding;
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.documentType.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesBuilding && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleDownload = (doc: ContractDocument) => {
    alert(`${doc.title} をダウンロードします。\nファイル形式: ${doc.fileFormat.toUpperCase()}\nファイルサイズ: ${doc.fileSize}`);
    console.log(`Downloaded: ${doc.title}`);
  };

  const handleBulkDownload = () => {
    if (filteredDocuments.length === 0) {
      alert('ダウンロード可能な文書がありません。');
      return;
    }
    
    const totalSize = filteredDocuments.reduce((total, doc) => {
      const sizeNum = parseFloat(doc.fileSize.replace('MB', ''));
      return total + sizeNum;
    }, 0);
    
    if (confirm(`選択された${filteredDocuments.length}個のファイル（合計 ${totalSize.toFixed(1)}MB）を一括ダウンロードしますか？`)) {
      alert('一括ダウンロードを開始します。');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">契約書・館内細則</h1>
            <p className="mt-1 text-sm text-gray-600">
              賃貸借契約書・館内細則・各種申込書のダウンロード
            </p>
          </div>
          <button
            onClick={handleBulkDownload}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            📦 一括ダウンロード ({filteredDocuments.length}件)
          </button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総文書数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{documents.length}</p>
            <p className="mt-1 text-sm text-gray-500">利用可能</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">必須文書</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">
              {documents.filter(doc => doc.isRequired).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">必須</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">文書種類</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {Array.from(new Set(documents.map(d => d.category))).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">カテゴリ</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">フィルター結果</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{filteredDocuments.length}</p>
            <p className="mt-1 text-sm text-gray-500">表示中</p>
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">検索</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="文書名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全てのカテゴリ</option>
                <option value="contract">契約書</option>
                <option value="rules">館内細則</option>
                <option value="agreement">同意書・覚書</option>
                <option value="form">申込書・届出書</option>
                <option value="guide">ガイド・説明書</option>
              </select>
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

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBuilding('all');
                  setSearchTerm('');
                }}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
              >
                リセット
              </button>
            </div>
          </div>
        </div>

        {/* 文書一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">
              文書一覧 ({filteredDocuments.length}件)
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    文書情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    建物・種類
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ファイル情報
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    更新日・バージョン
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{getFileFormatIcon(doc.fileFormat)}</span>
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          {doc.isRequired && (
                            <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                              必須
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{doc.description}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.buildingName}</div>
                      <div className="text-sm text-gray-500">{doc.documentType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(doc.category)}`}>
                        {getCategoryLabel(doc.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{doc.fileFormat.toUpperCase()}</div>
                      <div className="text-sm text-gray-500">{doc.fileSize}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(doc.lastUpdated)}</div>
                      <div className="text-sm text-gray-500">{doc.version}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleDownload(doc)}
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

        {filteredDocuments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に一致する文書が見つかりませんでした。</p>
          </div>
        )}

        {/* 重要な注意事項 */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-red-800 mb-3">重要事項・利用上の注意</h3>
          <div className="text-sm text-red-700 space-y-2">
            <p>• <strong>必須文書</strong>は契約手続きに必ず必要な文書です</p>
            <p>• 契約書の内容は物件・契約条件により変更される場合があります</p>
            <p>• 最新版の文書を使用してください（バージョン番号をご確認ください）</p>
            <p>• 文書の無断転載・複製・第三者への譲渡は禁止されています</p>
            <p>• 法的効力を持つ文書のため、内容をよくご確認の上ご利用ください</p>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">よくある質問</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Q. 契約書のひな型はどの程度編集できますか？</h4>
              <p className="text-sm text-gray-600 mt-1">
                A. 基本的な契約条件（賃料、敷金等）は物件により変更されます。重要事項に関わる条項の変更は管理会社との協議が必要です。
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Q. 古いバージョンの文書を使用してしまった場合は？</h4>
              <p className="text-sm text-gray-600 mt-1">
                A. 法改正等により内容が変更されている可能性があります。最新版を再度ダウンロードして手続きをやり直してください。
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Q. 文書の内容について質問があります</h4>
              <p className="text-sm text-gray-600 mt-1">
                A. 下記のお問い合わせ先まで、文書名とご質問内容を明記してご連絡ください。
              </p>
            </div>
          </div>
        </div>

        {/* フッター情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-800 mb-2">お問い合わせ・サポート</h3>
          <p className="text-sm text-blue-700 mb-2">
            契約書・文書に関するご質問や記入方法のご相談は、下記までお気軽にお問い合わせください。
          </p>
          <div className="text-sm text-blue-700">
            <p>管理会社: 株式会社JBCマネジメント</p>
            <p>契約書担当: 契約管理部</p>
            <p>電話: 03-1234-5678（内線: 契約管理）</p>
            <p>メール: contracts@jbc-management.com</p>
            <p>対応時間: 平日 9:00-18:00（土日祝日は要予約）</p>
            <p>緊急時: 080-1234-5678（24時間対応）</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContractsPage;