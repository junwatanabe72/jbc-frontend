import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

interface Rule {
  id: string;
  category: string;
  title: string;
  content: string;
  lastUpdated: Date;
  isImportant: boolean;
}

const BuildingRulesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // モック館内細則データ
  const mockRules: Rule[] = [
    {
      id: 'rule-001',
      category: 'general',
      title: '入退館に関する規則',
      content: `
1. 営業時間: 平日 8:00-20:00、土日祝 10:00-18:00
2. 入館時には必ずICカードをタッチしてください
3. 来訪者は受付で手続きを行い、入館証を着用してください
4. 退館時には消灯・施錠を確認してください
5. 緊急時以外は指定された出入口をご利用ください`,
      lastUpdated: new Date('2024-06-01'),
      isImportant: true
    },
    {
      id: 'rule-002',
      category: 'parking',
      title: '駐車場利用規則',
      content: `
1. 指定された駐車スペースのみご利用ください
2. 来客用駐車場は2時間以内の利用に限ります
3. 車両登録手続きを事前に行ってください
4. 駐車場内での事故・盗難について当社は責任を負いません
5. 長期間放置された車両は移動させる場合があります`,
      lastUpdated: new Date('2024-05-15'),
      isImportant: false
    },
    {
      id: 'rule-003',
      category: 'facilities',
      title: '共用施設の利用について',
      content: `
1. 会議室の予約は専用システムから行ってください
2. 利用後は清掃・原状回復をお願いします
3. 備品の破損・紛失時は速やかに管理会社へ連絡してください
4. 飲食は指定エリアのみ可能です
5. 騒音に配慮し、他のテナントの迷惑にならないようにしてください`,
      lastUpdated: new Date('2024-06-10'),
      isImportant: false
    },
    {
      id: 'rule-004',
      category: 'safety',
      title: '防災・安全管理規則',
      content: `
1. 火災報知器や消火器の点検は定期的に実施されます
2. 避難経路は常に確保し、物品を置かないでください
3. 緊急時は館内放送の指示に従ってください
4. 危険物の持ち込みは事前に許可を取ってください
5. セキュリティカメラが設置されており、記録されています`,
      lastUpdated: new Date('2024-07-01'),
      isImportant: true
    },
    {
      id: 'rule-005',
      category: 'environment',
      title: 'ゴミ処理・環境規則',
      content: `
1. ゴミは分別して指定場所に出してください
2. 回収日時を守り、前日夜に出すのは禁止です
3. 大型ゴミは事前に管理会社へ連絡してください
4. リサイクル可能なものは分別にご協力ください
5. 喫煙は指定された喫煙エリアのみ可能です`,
      lastUpdated: new Date('2024-05-20'),
      isImportant: false
    },
    {
      id: 'rule-006',
      category: 'renovation',
      title: '工事・改装に関する規則',
      content: `
1. 工事は事前に管理会社へ申請・承認が必要です
2. 作業時間は平日9:00-17:00に限ります
3. 騒音を伴う作業は近隣テナントへ事前通知してください
4. 共用部分への影響がある場合は別途協議が必要です
5. 工事完了後は検査を受けてください`,
      lastUpdated: new Date('2024-06-20'),
      isImportant: true
    }
  ];

  const categories = [
    { value: 'all', label: '全て' },
    { value: 'general', label: '一般規則' },
    { value: 'parking', label: '駐車場' },
    { value: 'facilities', label: '共用施設' },
    { value: 'safety', label: '防災・安全' },
    { value: 'environment', label: '環境・ゴミ' },
    { value: 'renovation', label: '工事・改装' }
  ];

  const filteredRules = mockRules.filter(rule => {
    const matchesCategory = selectedCategory === 'all' || rule.category === selectedCategory;
    const matchesSearch = rule.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rule.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">館内細則</h1>
          <p className="mt-1 text-sm text-gray-600">
            建物利用に関する重要な規則とガイドライン
          </p>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                検索
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="規則の内容を検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                カテゴリ
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 重要なお知らせ */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <span className="text-yellow-600">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                重要な規則について
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                館内細則は定期的に更新されます。最新の情報をご確認ください。
                違反があった場合は、管理会社からご連絡させていただく場合があります。
              </p>
            </div>
          </div>
        </div>

        {/* 規則一覧 */}
        <div className="space-y-4">
          {filteredRules.map((rule) => (
            <div key={rule.id} className="bg-white rounded-lg shadow border">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-medium text-gray-900">
                      {rule.title}
                    </h3>
                    {rule.isImportant && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        重要
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    最終更新: {formatDate(rule.lastUpdated)}
                  </span>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {rule.content}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">該当する規則が見つかりませんでした。</p>
          </div>
        )}

        {/* フッター情報 */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">お問い合わせ</h3>
          <p className="text-sm text-gray-600 mb-2">
            館内細則に関してご質問がございましたら、管理会社までお気軽にお問い合わせください。
          </p>
          <div className="text-sm text-gray-600">
            <p>管理会社: 株式会社JBCマネジメント</p>
            <p>電話: 03-1234-5678</p>
            <p>メール: info@jbc-management.com</p>
            <p>受付時間: 平日 9:00-18:00</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BuildingRulesPage;