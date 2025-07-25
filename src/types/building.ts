export interface Building {
  id: string;
  name: string;
  address: string;
  floors: number;
  totalUnits: number;
  occupiedUnits: number;
  constructionYear: number;
  totalArea: number; // 平方メートル
  managementCompany: string;
  owner: string;
  description?: string;
  facilities: string[]; // エレベーター、駐車場、等
  createdAt: Date;
  updatedAt: Date;
}

export interface Floor {
  id: string;
  buildingId: string;
  floorNumber: number;
  floorName: string; // "1F", "2F", "B1", 等
  totalUnits: number;
  occupiedUnits: number;
  floorArea: number; // 平方メートル
  floorPlan?: string; // 平面図URL
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Unit {
  id: string;
  buildingId: string;
  floorId: string;
  unitNumber: string; // "101", "A-1", 等
  unitArea: number; // 平方メートル
  rent: number; // 月額賃料
  deposit: number; // 敷金
  maintenanceFee: number; // 共益費
  isOccupied: boolean;
  tenantId?: string;
  contractStartDate?: Date;
  contractEndDate?: Date;
  unitType: 'office' | 'retail' | 'warehouse' | 'parking' | 'other';
  facilities: string[]; // エアコン、インターネット、等
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tenant {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phone: string;
  unitIds: string[]; // 複数の部屋を借りている場合
  contractStartDate: Date;
  contractEndDate: Date;
  rent: number; // 総賃料
  deposit: number; // 総敷金
  maintenanceFee: number; // 総共益費
  contactPerson: string;
  businessType: string;
  employeeCount: number;
  status: 'active' | 'notice' | 'expired' | 'terminated';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuildingState {
  buildings: Building[];
  floors: Floor[];
  units: Unit[];
  tenants: Tenant[];
  selectedBuildingId: string | null;
  isLoading: boolean;
  
  // Building operations
  addBuilding: (building: Omit<Building, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateBuilding: (id: string, updates: Partial<Building>) => void;
  deleteBuilding: (id: string) => void;
  selectBuilding: (id: string | null) => void;
  
  // Floor operations
  addFloor: (floor: Omit<Floor, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateFloor: (id: string, updates: Partial<Floor>) => void;
  deleteFloor: (id: string) => void;
  
  // Unit operations
  addUnit: (unit: Omit<Unit, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateUnit: (id: string, updates: Partial<Unit>) => void;
  deleteUnit: (id: string) => void;
  
  // Tenant operations
  addTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  deleteTenant: (id: string) => void;
  
  // Helper functions
  getBuildingById: (id: string) => Building | undefined;
  getFloorsByBuilding: (buildingId: string) => Floor[];
  getUnitsByFloor: (floorId: string) => Unit[];
  getTenantsByBuilding: (buildingId: string) => Tenant[];
  getAvailableUnits: (buildingId: string) => Unit[];
  getBuildingOccupancyRate: (buildingId: string) => number;
}