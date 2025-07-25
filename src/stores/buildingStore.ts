import { create } from 'zustand';
import type { BuildingState, Building, Floor, Unit, Tenant } from '../types/building';

// サンプルデータ
const mockBuildings: Building[] = [
  {
    id: 'building-1',
    name: 'JBCビル',
    address: '東京都港区六本木1-1-1',
    floors: 10,
    totalUnits: 50,
    occupiedUnits: 42,
    constructionYear: 2018,
    totalArea: 5000,
    managementCompany: 'JBC管理株式会社',
    owner: 'JBC不動産株式会社',
    facilities: ['エレベーター', '駐車場', '会議室', '受付', 'セキュリティ'],
    description: '六本木の中心部に位置する近代的なオフィスビル',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

const mockFloors: Floor[] = [
  {
    id: 'floor-1',
    buildingId: 'building-1',
    floorNumber: 1,
    floorName: '1F',
    totalUnits: 5,
    occupiedUnits: 4,
    floorArea: 500,
    description: 'エントランス・受付・商業施設',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'floor-2',
    buildingId: 'building-1',
    floorNumber: 2,
    floorName: '2F',
    totalUnits: 6,
    occupiedUnits: 5,
    floorArea: 480,
    description: 'オフィススペース',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'floor-3',
    buildingId: 'building-1',
    floorNumber: 3,
    floorName: '3F',
    totalUnits: 6,
    occupiedUnits: 6,
    floorArea: 480,
    description: 'オフィススペース・会議室',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

const mockUnits: Unit[] = [
  {
    id: 'unit-1',
    buildingId: 'building-1',
    floorId: 'floor-2',
    unitNumber: '201',
    unitArea: 80,
    rent: 320000,
    deposit: 640000,
    maintenanceFee: 32000,
    isOccupied: true,
    tenantId: 'tenant-1',
    contractStartDate: new Date('2024-01-01'),
    contractEndDate: new Date('2025-12-31'),
    unitType: 'office',
    facilities: ['エアコン', 'インターネット', '電話回線'],
    description: '角部屋の明るいオフィス',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'unit-2',
    buildingId: 'building-1',
    floorId: 'floor-2',
    unitNumber: '202',
    unitArea: 60,
    rent: 240000,
    deposit: 480000,
    maintenanceFee: 24000,
    isOccupied: false,
    unitType: 'office',
    facilities: ['エアコン', 'インターネット'],
    description: '中規模オフィススペース',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: '田中 太郎',
    companyName: '株式会社テックソリューション',
    email: 'tanaka@techsolution.co.jp',
    phone: '03-1234-5678',
    unitIds: ['unit-1'],
    contractStartDate: new Date('2024-01-01'),
    contractEndDate: new Date('2025-12-31'),
    rent: 320000,
    deposit: 640000,
    maintenanceFee: 32000,
    contactPerson: '田中 太郎',
    businessType: 'ITサービス',
    employeeCount: 15,
    status: 'active',
    notes: '優良テナント',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

export const useBuildingStore = create<BuildingState>((set, get) => ({
  buildings: mockBuildings,
  floors: mockFloors,
  units: mockUnits,
  tenants: mockTenants,
  selectedBuildingId: 'building-1',
  isLoading: false,

  // Building operations
  addBuilding: (buildingData) => {
    const newBuilding: Building = {
      ...buildingData,
      id: `building-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      buildings: [...state.buildings, newBuilding],
    }));
  },

  updateBuilding: (id, updates) => {
    set((state) => ({
      buildings: state.buildings.map((building) =>
        building.id === id
          ? { ...building, ...updates, updatedAt: new Date() }
          : building
      ),
    }));
  },

  deleteBuilding: (id) => {
    set((state) => ({
      buildings: state.buildings.filter((building) => building.id !== id),
      selectedBuildingId: state.selectedBuildingId === id ? null : state.selectedBuildingId,
    }));
  },

  selectBuilding: (id) => {
    set({ selectedBuildingId: id });
  },

  // Floor operations
  addFloor: (floorData) => {
    const newFloor: Floor = {
      ...floorData,
      id: `floor-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      floors: [...state.floors, newFloor],
    }));
  },

  updateFloor: (id, updates) => {
    set((state) => ({
      floors: state.floors.map((floor) =>
        floor.id === id
          ? { ...floor, ...updates, updatedAt: new Date() }
          : floor
      ),
    }));
  },

  deleteFloor: (id) => {
    set((state) => ({
      floors: state.floors.filter((floor) => floor.id !== id),
    }));
  },

  // Unit operations
  addUnit: (unitData) => {
    const newUnit: Unit = {
      ...unitData,
      id: `unit-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      units: [...state.units, newUnit],
    }));
  },

  updateUnit: (id, updates) => {
    set((state) => ({
      units: state.units.map((unit) =>
        unit.id === id
          ? { ...unit, ...updates, updatedAt: new Date() }
          : unit
      ),
    }));
  },

  deleteUnit: (id) => {
    set((state) => ({
      units: state.units.filter((unit) => unit.id !== id),
    }));
  },

  // Tenant operations
  addTenant: (tenantData) => {
    const newTenant: Tenant = {
      ...tenantData,
      id: `tenant-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      tenants: [...state.tenants, newTenant],
    }));
  },

  updateTenant: (id, updates) => {
    set((state) => ({
      tenants: state.tenants.map((tenant) =>
        tenant.id === id
          ? { ...tenant, ...updates, updatedAt: new Date() }
          : tenant
      ),
    }));
  },

  deleteTenant: (id) => {
    set((state) => ({
      tenants: state.tenants.filter((tenant) => tenant.id !== id),
    }));
  },

  // Helper functions
  getBuildingById: (id) => {
    const { buildings } = get();
    return buildings.find((building) => building.id === id);
  },

  getFloorsByBuilding: (buildingId) => {
    const { floors } = get();
    return floors.filter((floor) => floor.buildingId === buildingId);
  },

  getUnitsByFloor: (floorId) => {
    const { units } = get();
    return units.filter((unit) => unit.floorId === floorId);
  },

  getTenantsByBuilding: (buildingId) => {
    const { tenants, units } = get();
    const buildingUnitIds = units
      .filter((unit) => unit.buildingId === buildingId)
      .map((unit) => unit.id);
    
    return tenants.filter((tenant) =>
      tenant.unitIds.some((unitId) => buildingUnitIds.includes(unitId))
    );
  },

  getAvailableUnits: (buildingId) => {
    const { units } = get();
    return units.filter((unit) => unit.buildingId === buildingId && !unit.isOccupied);
  },

  getBuildingOccupancyRate: (buildingId) => {
    const { units } = get();
    const buildingUnits = units.filter((unit) => unit.buildingId === buildingId);
    const occupiedUnits = buildingUnits.filter((unit) => unit.isOccupied);
    
    return buildingUnits.length > 0 ? (occupiedUnits.length / buildingUnits.length) * 100 : 0;
  },
}));