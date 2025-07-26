import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';

interface Room {
  id: string;
  floor: number;
  roomNumber: string;
  area: number; // 平方メートル
  rent: number; // 月額賃料
  managementFee: number; // 管理費
  deposit: number; // 敷金
  keyMoney: number; // 礼金
  layout: string; // 間取り
  isVacant: boolean;
  availableFrom: Date;
  features: string[];
  description: string;
  lastUpdated: Date;
}

const VacancyPage: React.FC = () => {
  const [filterFloor, setFilterFloor] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rent_asc');
  const [showOnlyVacant, setShowOnlyVacant] = useState<boolean>(true);

  // モック空室データ
  const rooms: Room[] = [
    {
      id: 'room-101',
      floor: 1,
      roomNumber: '101',
      area: 45.5,
      rent: 180000,
      managementFee: 15000,
      deposit: 360000,
      keyMoney: 180000,
      layout: '1LDK',
      isVacant: true,
      availableFrom: new Date('2024-08-01'),
      features: ['南向き', '角部屋', '駐車場付き', 'ペット可'],
      description: '明るい南向きの角部屋。キッチンが広く、収納も充実しています。',
      lastUpdated: new Date('2024-07-20')
    },
    {
      id: 'room-205',
      floor: 2,
      roomNumber: '205',
      area: 52.3,
      rent: 210000,
      managementFee: 18000,
      deposit: 420000,
      keyMoney: 210000,
      layout: '2DK',
      isVacant: true,
      availableFrom: new Date('2024-07-25'),
      features: ['東向き', '2階', 'エアコン完備', 'インターネット完備'],
      description: '2部屋あるのでシェア利用にも最適。設備が新しく快適です。',
      lastUpdated: new Date('2024-07-22')
    },
    {
      id: 'room-308',
      floor: 3,
      roomNumber: '308',
      area: 38.2,
      rent: 155000,
      managementFee: 12000,
      deposit: 310000,
      keyMoney: 155000,
      layout: '1K',
      isVacant: true,
      availableFrom: new Date('2024-08-15'),
      features: ['西向き', 'コンパクト', '新築同様'],
      description: 'リノベーション済みで綺麗。一人暮らしに最適な間取りです。',
      lastUpdated: new Date('2024-07-18')
    },
    {
      id: 'room-412',
      floor: 4,
      roomNumber: '412',
      area: 65.8,
      rent: 280000,
      managementFee: 22000,
      deposit: 560000,
      keyMoney: 280000,
      layout: '2LDK',
      isVacant: false,
      availableFrom: new Date('2024-09-01'),
      features: ['最上階', '南向き', 'バルコニー広め', '駐車場付き'],
      description: '最上階の広いお部屋。眺望良好で静かな環境です。',
      lastUpdated: new Date('2024-07-15')
    },
    {
      id: 'room-303',
      floor: 3,
      roomNumber: '303',
      area: 48.9,
      rent: 195000,
      managementFee: 16000,
      deposit: 390000,
      keyMoney: 195000,
      layout: '1LDK',
      isVacant: false,
      availableFrom: new Date('2024-10-01'),
      features: ['南向き', '収納多め', 'システムキッチン'],
      description: '収納が多く実用的。カップルにもおすすめです。',
      lastUpdated: new Date('2024-07-10')
    }
  ];

  const filteredRooms = rooms.filter(room => {
    if (showOnlyVacant && !room.isVacant) return false;
    if (filterFloor !== 'all' && room.floor.toString() !== filterFloor) return false;
    if (filterArea !== 'all') {
      const [min, max] = filterArea.split('-').map(Number);
      if (max && (room.area < min || room.area > max)) return false;
      if (!max && room.area < min) return false;
    }
    return true;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    switch (sortBy) {
      case 'rent_asc': return a.rent - b.rent;
      case 'rent_desc': return b.rent - a.rent;
      case 'area_asc': return a.area - b.area;
      case 'area_desc': return b.area - a.area;
      case 'floor_asc': return a.floor - b.floor;
      case 'floor_desc': return b.floor - a.floor;
      default: return 0;
    }
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getAvailabilityStatus = (room: Room) => {
    if (room.isVacant) {
      const now = new Date();
      if (room.availableFrom <= now) {
        return { label: '即入居可', color: 'bg-green-100 text-green-800' };
      } else {
        return { label: `${formatDate(room.availableFrom)}〜`, color: 'bg-blue-100 text-blue-800' };
      }
    } else {
      return { label: '入居中', color: 'bg-gray-100 text-gray-800' };
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">空室情報確認</h1>
          <p className="mt-1 text-sm text-gray-600">
            リアルタイムの空室状況と物件詳細情報
          </p>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総戸数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{rooms.length}</p>
            <p className="mt-1 text-sm text-gray-500">全体</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">空室数</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {rooms.filter(r => r.isVacant).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">即入居可能</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">空室率</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {((rooms.filter(r => r.isVacant).length / rooms.length) * 100).toFixed(1)}%
            </p>
            <p className="mt-1 text-sm text-gray-500">現在</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">平均賃料</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">
              {formatCurrency(rooms.reduce((sum, r) => sum + r.rent, 0) / rooms.length)}
            </p>
            <p className="mt-1 text-sm text-gray-500">月額</p>
          </div>
        </div>

        {/* フィルター */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">表示</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={showOnlyVacant}
                  onChange={(e) => setShowOnlyVacant(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">空室のみ表示</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">階数</label>
              <select
                value={filterFloor}
                onChange={(e) => setFilterFloor(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全階</option>
                <option value="1">1階</option>
                <option value="2">2階</option>
                <option value="3">3階</option>
                <option value="4">4階</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">面積</label>
              <select
                value={filterArea}
                onChange={(e) => setFilterArea(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全て</option>
                <option value="0-40">〜40㎡</option>
                <option value="40-50">40-50㎡</option>
                <option value="50-60">50-60㎡</option>
                <option value="60">60㎡〜</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">並び替え</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rent_asc">賃料: 安い順</option>
                <option value="rent_desc">賃料: 高い順</option>
                <option value="area_asc">面積: 小さい順</option>
                <option value="area_desc">面積: 大きい順</option>
                <option value="floor_asc">階数: 低い順</option>
                <option value="floor_desc">階数: 高い順</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={() => {
                  setFilterFloor('all');
                  setFilterArea('all');
                  setSortBy('rent_asc');
                  setShowOnlyVacant(true);
                }}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                条件をリセット
              </button>
            </div>
          </div>
        </div>

        {/* 物件一覧 */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-900">
              物件一覧 ({sortedRooms.length}件)
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedRooms.map((room) => {
              const status = getAvailabilityStatus(room);
              return (
                <div key={room.id} className="bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {room.floor}階 {room.roomNumber}号室
                        </h3>
                        <p className="text-sm text-gray-600">{room.layout} • {room.area}㎡</p>
                      </div>
                      <span className={`px-3 py-1 text-sm rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">月額賃料</p>
                        <p className="text-lg font-bold text-blue-600">{formatCurrency(room.rent)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">管理費</p>
                        <p className="text-lg font-medium text-gray-900">{formatCurrency(room.managementFee)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">敷金</p>
                        <p className="text-sm text-gray-900">{formatCurrency(room.deposit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">礼金</p>
                        <p className="text-sm text-gray-900">{formatCurrency(room.keyMoney)}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">特徴</p>
                      <div className="flex flex-wrap gap-2">
                        {room.features.map((feature, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">物件説明</p>
                      <p className="text-sm text-gray-700">{room.description}</p>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500">
                        更新: {formatDate(room.lastUpdated)}
                      </p>
                      <div className="space-x-2">
                        <button className="px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                          詳細を見る
                        </button>
                        <button className="px-3 py-2 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200">
                          お問い合わせ
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {sortedRooms.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">条件に一致する物件が見つかりませんでした。</p>
          </div>
        )}

        {/* フッター情報 */}
        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-blue-900 mb-2">お問い合わせ</h3>
          <p className="text-sm text-blue-800 mb-2">
            物件の詳細や内見のご希望がございましたら、お気軽にお問い合わせください。
          </p>
          <div className="text-sm text-blue-800">
            <p>管理会社: 株式会社JBCマネジメント</p>
            <p>仲介担当: 営業部 賃貸チーム</p>
            <p>電話: 03-1234-5678</p>
            <p>メール: leasing@jbc-management.com</p>
            <p>営業時間: 平日 9:00-18:00、土日 10:00-17:00</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default VacancyPage;