import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useBuildingStore } from '../../stores/buildingStore';
import type { Building, Floor, Unit, Tenant } from '../../types/building';

const BuildingManagementPage: React.FC = () => {
  const {
    buildings,
    floors,
    units,
    tenants,
    selectedBuildingId,
    selectBuilding,
    getFloorsByBuilding,
    getUnitsByFloor,
    getTenantsByBuilding,
    getBuildingOccupancyRate
  } = useBuildingStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'floors' | 'units' | 'tenants'>('overview');
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  const selectedBuilding = buildings.find(b => b.id === selectedBuildingId);
  const buildingFloors = selectedBuildingId ? getFloorsByBuilding(selectedBuildingId) : [];
  const buildingTenants = selectedBuildingId ? getTenantsByBuilding(selectedBuildingId) : [];
  const occupancyRate = selectedBuildingId ? getBuildingOccupancyRate(selectedBuildingId) : 0;

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

  const getTenantStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '契約中';
      case 'notice': return '解約予告';
      case 'expired': return '契約終了';
      case 'terminated': return '契約解除';
      default: return status;
    }
  };

  const getTenantStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'notice': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'terminated': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedBuilding) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">ビルを選択してください</h2>
          <div className="mt-6 space-y-2">
            {buildings.map((building) => (
              <button
                key={building.id}
                onClick={() => selectBuilding(building.id)}
                className="block w-full max-w-md mx-auto p-4 text-left border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <h3 className="font-medium text-gray-900">{building.name}</h3>
                <p className="text-sm text-gray-500">{building.address}</p>
              </button>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedBuilding.name}</h1>
            <p className="text-sm text-gray-600">{selectedBuilding.address}</p>
          </div>
          <div className="flex space-x-2">
            <select
              value={selectedBuildingId || ''}
              onChange={(e) => selectBuilding(e.target.value || null)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
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
            <h3 className="text-lg font-medium text-gray-900">入居率</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{occupancyRate.toFixed(1)}%</p>
            <p className="mt-1 text-sm text-gray-500">
              {selectedBuilding.occupiedUnits} / {selectedBuilding.totalUnits} 室
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">フロア数</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{selectedBuilding.floors}</p>
            <p className="mt-1 text-sm text-gray-500">階層</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総面積</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{selectedBuilding.totalArea.toLocaleString()}</p>
            <p className="mt-1 text-sm text-gray-500">㎡</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">テナント数</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{buildingTenants.length}</p>
            <p className="mt-1 text-sm text-gray-500">契約中</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '概要' },
              { id: 'floors', label: 'フロア管理' },
              { id: 'units', label: '区画管理' },
              { id: 'tenants', label: 'テナント管理' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">ビル基本情報</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">管理会社</dt>
                      <dd className="text-sm text-gray-900">{selectedBuilding.managementCompany}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">オーナー</dt>
                      <dd className="text-sm text-gray-900">{selectedBuilding.owner}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">建築年</dt>
                      <dd className="text-sm text-gray-900">{selectedBuilding.constructionYear}年</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">設備</dt>
                      <dd className="text-sm text-gray-900">
                        {selectedBuilding.facilities.join(', ')}
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">収益情報</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="text-sm font-medium text-green-900">月額賃料合計</h4>
                      <p className="text-2xl font-bold text-green-700">
                        {formatCurrency(
                          buildingTenants
                            .filter(t => t.status === 'active')
                            .reduce((sum, t) => sum + t.rent, 0)
                        )}
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900">預り敷金合計</h4>
                      <p className="text-2xl font-bold text-blue-700">
                        {formatCurrency(
                          buildingTenants
                            .filter(t => t.status === 'active')
                            .reduce((sum, t) => sum + t.deposit, 0)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'floors' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">フロア一覧</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + フロア追加
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buildingFloors.map((floor) => (
                    <div key={floor.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{floor.floorName}</h4>
                          <p className="text-sm text-gray-500">{floor.description}</p>
                        </div>
                        <button
                          onClick={() => setSelectedFloorId(floor.id)}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          詳細
                        </button>
                      </div>
                      <div className="mt-3 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">入居率:</span>
                          <span className="font-medium">
                            {floor.totalUnits > 0 ? ((floor.occupiedUnits / floor.totalUnits) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">区画数:</span>
                          <span className="font-medium">{floor.occupiedUnits} / {floor.totalUnits}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">面積:</span>
                          <span className="font-medium">{floor.floorArea}㎡</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'units' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">区画一覧</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + 区画追加
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          区画番号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          フロア
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          面積
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          賃料
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          入居状況
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          種別
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {units
                        .filter(unit => unit.buildingId === selectedBuildingId)
                        .map((unit) => {
                          const floor = floors.find(f => f.id === unit.floorId);
                          return (
                            <tr key={unit.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {unit.unitNumber}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {floor?.floorName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {unit.unitArea}㎡
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCurrency(unit.rent)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  unit.isOccupied 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {unit.isOccupied ? '入居中' : '空室'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {getUnitTypeLabel(unit.unitType)}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">テナント一覧</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    + テナント追加
                  </button>
                </div>
                
                <div className="space-y-4">
                  {buildingTenants.map((tenant) => (
                    <div key={tenant.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="text-lg font-medium text-gray-900">{tenant.companyName}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${getTenantStatusColor(tenant.status)}`}>
                              {getTenantStatusLabel(tenant.status)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">担当者: {tenant.contactPerson}</p>
                          <p className="text-sm text-gray-600">業種: {tenant.businessType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">{formatCurrency(tenant.rent)}</p>
                          <p className="text-sm text-gray-500">月額賃料</p>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-500">契約期間</p>
                          <p className="text-sm text-gray-900">
                            {tenant.contractStartDate.toLocaleDateString('ja-JP')} - {tenant.contractEndDate.toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">従業員数</p>
                          <p className="text-sm text-gray-900">{tenant.employeeCount}名</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-500">連絡先</p>
                          <p className="text-sm text-gray-900">{tenant.phone}</p>
                        </div>
                        <div className="text-right">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            詳細・編集
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default BuildingManagementPage;