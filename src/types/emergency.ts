export interface EmergencyContact {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  availability: '24h' | 'business_hours' | 'emergency_only';
  priority: number; // 1が最高優先度
  buildingId?: string; // 特定のビル担当の場合
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyIncident {
  id: string;
  title: string;
  description: string;
  category: EmergencyCategory;
  severity: EmergencySeverity;
  location: string;
  buildingId: string;
  reportedBy: string;
  reporterName: string;
  reporterPhone: string;
  status: IncidentStatus;
  assignedTo?: string;
  respondedBy?: string[];
  responseTime?: Date;
  resolvedAt?: Date;
  images?: string[];
  updates: IncidentUpdate[];
  notifiedContacts: string[]; // 通知済み連絡先のID
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentUpdate {
  id: string;
  userId: string;
  userName: string;
  content: string;
  images?: string[];
  timestamp: Date;
}

export type EmergencyCategory = 
  | 'fire' 
  | 'security' 
  | 'medical' 
  | 'infrastructure' 
  | 'weather' 
  | 'power' 
  | 'water' 
  | 'elevator' 
  | 'hvac'
  | 'other';

export type EmergencySeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 'reported' | 'acknowledged' | 'responding' | 'resolved' | 'closed';

export interface EmergencyProtocol {
  id: string;
  name: string;
  category: EmergencyCategory;
  description: string;
  steps: EmergencyStep[];
  contacts: string[]; // 関連する緊急連絡先ID
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyStep {
  id: string;
  order: number;
  title: string;
  description: string;
  responsible: 'reporter' | 'security' | 'management' | 'emergency_services';
  estimatedTime: number; // 分単位
  isCritical: boolean;
}

export interface EmergencyState {
  incidents: EmergencyIncident[];
  contacts: EmergencyContact[];
  protocols: EmergencyProtocol[];
  activeIncidents: EmergencyIncident[];
  isLoading: boolean;
  
  // Incident operations  
  reportIncident: (incident: Omit<EmergencyIncident, 'id' | 'createdAt' | 'updatedAt' | 'updates' | 'notifiedContacts' | 'status'>) => void;
  updateIncident: (id: string, updates: Partial<EmergencyIncident>) => void;
  addIncidentUpdate: (incidentId: string, update: Omit<IncidentUpdate, 'id' | 'timestamp'>) => void;
  acknowledgeIncident: (id: string, userId: string) => void;
  resolveIncident: (id: string, userId: string) => void;
  
  // Contact operations
  addContact: (contact: Omit<EmergencyContact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, updates: Partial<EmergencyContact>) => void;
  deleteContact: (id: string) => void;
  
  // Protocol operations
  addProtocol: (protocol: Omit<EmergencyProtocol, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProtocol: (id: string, updates: Partial<EmergencyProtocol>) => void;
  deleteProtocol: (id: string) => void;
  
  // Helper functions
  getIncidentsByBuilding: (buildingId: string) => EmergencyIncident[];
  getActiveIncidents: () => EmergencyIncident[];
  getCriticalIncidents: () => EmergencyIncident[];
  getContactsByPriority: () => EmergencyContact[];
  getProtocolByCategory: (category: EmergencyCategory) => EmergencyProtocol | undefined;
  notifyContacts: (incidentId: string, contactIds: string[]) => void;
}