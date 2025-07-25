import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useBuildingStore } from '../../stores/buildingStore';
import type { Unit } from '../../types/building';

const VacancyPage: React.FC = () => {
  const { 
    buildings, 
    floors, 
    units, 
    // tenants, 
    selectedBuildingId, 
    selectBuilding,
    // getFloorsByBuilding,
    getAvailableUnits,
    // getBuildingOccupancyRate
  } = useBuildingStore();

  const [selectedUnitType, setSelectedUnitType] = useState<'all' | 'office' | 'retail' | 'warehouse' | 'parking'>('all');
  const [priceRange, setPriceRange] = useState<{ min: number; max: number }>({ min: 0, max: 1000000 });
  const [areaRange, setAreaRange] = useState<{ min: number; max: number }>({ min: 0, max: 200 });
  const [sortBy, setSortBy] = useState<'rent' | 'area' | 'floor'>('rent');
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const getUnitTypeLabel = (type: string) => {
    switch (type) {
      case 'office': return 'オフィス';
      case 'retail': return '店舗';
      case 'warehouse': return '倉庫';
      case 'parking': return '駐車場';
      default: return 'その他';
    }
  };

  const getFloorName = (floorId: string) => {
    const floor = floors.find(f => f.id === floorId);
    return floor ? floor.floorName : '';
  };

  const getBuildingName = (buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    return building ? building.name : '';
  };

  const getAvailableUnitsFiltered = () => {
    let availableUnits: Unit[] = [];
    
    if (selectedBuildingId) {
      availableUnits = getAvailableUnits(selectedBuildingId);
    } else {
      availableUnits = units.filter(unit => !unit.isOccupied);
    }

    return availableUnits
      .filter(unit => {
        const typeMatch = selectedUnitType === 'all' || unit.unitType === selectedUnitType;
        const priceMatch = unit.rent >= priceRange.min && unit.rent <= priceRange.max;
        const areaMatch = unit.unitArea >= areaRange.min && unit.unitArea <= areaRange.max;
        return typeMatch && priceMatch && areaMatch;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case 'rent':
            return a.rent - b.rent;
          case 'area':
            return a.unitArea - b.unitArea;
          case 'floor':
            const floorA = floors.find(f => f.id === a.floorId)?.floorNumber || 0;
            const floorB = floors.find(f => f.id === b.floorId)?.floorNumber || 0;
            return floorA - floorB;
          default:
            return 0;
        }
      });
  };

  const filteredUnits = getAvailableUnitsFiltered();

  // 統計データ
  const totalVacantUnits = units.filter(unit => !unit.isOccupied).length;
  const totalUnits = units.length;
  const vacancyRate = totalUnits > 0 ? ((totalVacantUnits / totalUnits) * 100) : 0;
  const avgRent = filteredUnits.length > 0 ? 
    filteredUnits.reduce((sum, unit) => sum + unit.rent, 0) / filteredUnits.length : 0;

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">空室情報</h1>
            <p className="text-sm text-gray-600">利用可能な区画の検索・詳細情報</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedBuildingId || ''}
              onChange={(e) => selectBuilding(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">全てのビル</option>
              {buildings.map((building) => (
                <option key={building.id} value={building.id}>
                  {building.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">空室数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{filteredUnits.length}</p>
            <p className="mt-1 text-sm text-gray-500">利用可能</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">空室率</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{vacancyRate.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-gray-500">全体</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">平均賃料</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{formatCurrency(avgRent)}</p>
            <p className="mt-1 text-sm text-gray-500">空室平均</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総区画数</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{totalUnits}</p>
            <p className="mt-1 text-sm text-gray-500">全ビル</p>
          </div>
        </div>

        {/* フィルター・検索 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">検索・フィルター</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">用途</label>
              <select
                value={selectedUnitType}
                onChange={(e) => setSelectedUnitType(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全ての用途</option>
                <option value="office">オフィス</option>
                <option value="retail">店舗</option>
                <option value="warehouse">倉庫</option>
                <option value="parking">駐車場</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">賃料範囲</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="最低"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="最高"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 1000000})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">面積範囲（㎡）</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="最小"
                  value={areaRange.min}
                  onChange={(e) => setAreaRange({...areaRange, min: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="number"
                  placeholder="最大"
                  value={areaRange.max}
                  onChange={(e) => setAreaRange({...areaRange, max: parseInt(e.target.value) || 200})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">並び順</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="rent">賃料順</option>
                <option value="area">面積順</option>
                <option value="floor">フロア順</option>
              </select>
            </div>
          </div>
        </div>

        {/* 空室一覧 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              空室一覧 ({filteredUnits.length}件)
            </h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUnits.map((unit) => (
                <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">
                        {getBuildingName(unit.buildingId)} {unit.unitNumber}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {getFloorName(unit.floorId)} • {getUnitTypeLabel(unit.unitType)}
                      </p>
                    </div>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                      空室
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">面積:</span>
                      <span className="text-sm font-medium">{unit.unitArea}㎡</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">賃料:</span>
                      <span className="text-lg font-bold text-blue-600">{formatCurrency(unit.rent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">敷金:</span>
                      <span className="text-sm font-medium">{formatCurrency(unit.deposit)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">共益費:</span>
                      <span className="text-sm font-medium">{formatCurrency(unit.maintenanceFee)}</span>
                    </div>
                  </div>

                  {unit.facilities.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">設備:</p>
                      <div className="flex flex-wrap gap-1">
                        {unit.facilities.map((facility, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      onClick={() => setSelectedUnit(unit)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                    >
                      詳細を見る
                    </button>
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700">
                      お問い合わせ
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredUnits.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">条件に合う空室が見つかりませんでした。</p>
                <p className="text-sm text-gray-400 mt-2">検索条件を変更してお試しください。</p>
              </div>
            )}
          </div>
        </div>

        {/* 詳細モーダル */}
        {selectedUnit && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border max-w-2xl shadow-lg rounded-md bg-white">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {getBuildingName(selectedUnit.buildingId)} {selectedUnit.unitNumber}
                  </h2>
                  <p className="text-gray-600">
                    {getFloorName(selectedUnit.floorId)} • {getUnitTypeLabel(selectedUnit.unitType)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">基本情報</h3>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">面積:</dt>
                      <dd className="text-sm font-medium">{selectedUnit.unitArea}㎡</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">月額賃料:</dt>
                      <dd className="text-lg font-bold text-blue-600">{formatCurrency(selectedUnit.rent)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">敷金:</dt>
                      <dd className="text-sm font-medium">{formatCurrency(selectedUnit.deposit)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">共益費:</dt>
                      <dd className="text-sm font-medium">{formatCurrency(selectedUnit.maintenanceFee)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-600">坪単価:</dt>
                      <dd className="text-sm font-medium">
                        {formatCurrency(Math.round(selectedUnit.rent / (selectedUnit.unitArea * 0.3025)))}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">設備・特徴</h3>
                  <div className="space-y-2">
                    {selectedUnit.facilities.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedUnit.facilities.map((facility, index) => (
                          <span 
                            key={index} 
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">設備情報はありません</p>
                    )}
                    
                    {selectedUnit.description && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-1">説明</h4>
                        <p className="text-sm text-gray-600">{selectedUnit.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                <button
                  onClick={() => setSelectedUnit(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  閉じる
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                  お問い合わせ
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  資料請求
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VacancyPage;