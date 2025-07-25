import { create } from 'zustand';
import type { 
  EmergencyState, 
  EmergencyIncident, 
  EmergencyContact, 
  EmergencyProtocol,
  IncidentUpdate
} from '../types/emergency';
import { useNotificationStore } from './notificationStore';

// サンプルデータ
const mockContacts: EmergencyContact[] = [
  {
    id: 'contact-1',
    name: '警備室',
    role: '警備担当',
    phone: '03-1234-5678',
    email: 'security@jbc.co.jp',
    availability: '24h',
    priority: 1,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'contact-2',
    name: '管理事務所',
    role: '管理担当',
    phone: '03-1234-5679',
    email: 'management@jbc.co.jp',
    availability: 'business_hours',
    priority: 2,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: 'contact-3',
    name: '設備管理センター',
    role: '設備管理',
    phone: '03-1234-5680',
    email: 'facility@jbc.co.jp',
    availability: '24h',
    priority: 3,
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

const mockProtocols: EmergencyProtocol[] = [
  {
    id: 'protocol-1',
    name: '火災対応手順',
    category: 'fire',
    description: '火災発生時の標準対応手順',
    steps: [
      {
        id: 'step-1',
        order: 1,
        title: '119番通報',
        description: '直ちに消防署に通報する',
        responsible: 'reporter',
        estimatedTime: 2,
        isCritical: true,
      },
      {
        id: 'step-2',
        order: 2,
        title: '避難誘導',
        description: '在館者の避難誘導を開始する',
        responsible: 'security',
        estimatedTime: 10,
        isCritical: true,
      },
      {
        id: 'step-3',
        order: 3,
        title: '管理会社へ連絡',
        description: '管理会社に状況を報告する',
        responsible: 'security',
        estimatedTime: 5,
        isCritical: false,
      }
    ],
    contacts: ['contact-1', 'contact-2'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

const mockIncidents: EmergencyIncident[] = [
  {
    id: 'incident-1',
    title: '3階廊下での水漏れ',
    description: '3階東側廊下の天井から水漏れが発生しています。',
    category: 'water',
    severity: 'medium',
    location: '3階東側廊下',
    buildingId: 'building-1',
    reportedBy: 'user-tenant1',
    reporterName: '田中 太郎',
    reporterPhone: '090-1234-5678',
    status: 'acknowledged',
    assignedTo: 'contact-3',
    respondedBy: ['contact-2'],
    responseTime: new Date(Date.now() - 30 * 60 * 1000), // 30分前
    updates: [
      {
        id: 'update-1',
        userId: 'contact-2',
        userName: '管理事務所',
        content: '設備管理センターに連絡済み。30分以内に現場確認予定。',
        timestamp: new Date(Date.now() - 25 * 60 * 1000),
      }
    ],
    notifiedContacts: ['contact-2', 'contact-3'],
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45分前
    updatedAt: new Date(Date.now() - 25 * 60 * 1000),
  }
];

export const useEmergencyStore = create<EmergencyState>((set, get) => ({
  incidents: mockIncidents,
  contacts: mockContacts,
  protocols: mockProtocols,
  activeIncidents: mockIncidents.filter(i => i.status !== 'closed'),
  isLoading: false,

  // Incident operations
  reportIncident: (incidentData) => {
    const newIncident: EmergencyIncident = {
      ...incidentData,
      id: `incident-${Date.now()}`,
      status: 'reported',
      updates: [],
      notifiedContacts: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      incidents: [newIncident, ...state.incidents],
      activeIncidents: [newIncident, ...state.activeIncidents],
    }));

    // 緊急度に応じて自動的に関係者に通知
    const contactsToNotify = get().getContactsByPriority()
      .filter(contact => contact.isActive)
      .slice(0, incidentData.severity === 'critical' ? 3 : 2)
      .map(contact => contact.id);
    
    get().notifyContacts(newIncident.id, contactsToNotify);
  },

  updateIncident: (id, updates) => {
    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === id
          ? { ...incident, ...updates, updatedAt: new Date() }
          : incident
      ),
      activeIncidents: state.activeIncidents.map((incident) =>
        incident.id === id && updates.status !== 'closed'
          ? { ...incident, ...updates, updatedAt: new Date() }
          : incident
      ).filter(incident => incident.status !== 'closed'),
    }));
  },

  addIncidentUpdate: (incidentId, updateData) => {
    const newUpdate: IncidentUpdate = {
      ...updateData,
      id: `update-${Date.now()}`,
      timestamp: new Date(),
    };

    set((state) => ({
      incidents: state.incidents.map((incident) =>
        incident.id === incidentId
          ? { 
              ...incident, 
              updates: [...incident.updates, newUpdate],
              updatedAt: new Date()
            }
          : incident
      ),
      activeIncidents: state.activeIncidents.map((incident) =>
        incident.id === incidentId
          ? { 
              ...incident, 
              updates: [...incident.updates, newUpdate],
              updatedAt: new Date()
            }
          : incident
      ),
    }));
  },

  acknowledgeIncident: (id, userId) => {
    const incident = get().incidents.find(i => i.id === id);
    if (!incident) return;

    get().updateIncident(id, {
      status: 'acknowledged',
      respondedBy: [...(incident.respondedBy || []), userId],
      responseTime: incident.responseTime || new Date(),
    });

    get().addIncidentUpdate(id, {
      userId,
      userName: 'システム',
      content: 'インシデントが確認されました。',
    });
  },

  resolveIncident: (id, userId) => {
    get().updateIncident(id, {
      status: 'resolved',
      resolvedAt: new Date(),
    });

    get().addIncidentUpdate(id, {
      userId,
      userName: 'システム',
      content: 'インシデントが解決されました。',
    });
  },

  // Contact operations
  addContact: (contactData) => {
    const newContact: EmergencyContact = {
      ...contactData,
      id: `contact-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      contacts: [...state.contacts, newContact],
    }));
  },

  updateContact: (id, updates) => {
    set((state) => ({
      contacts: state.contacts.map((contact) =>
        contact.id === id
          ? { ...contact, ...updates, updatedAt: new Date() }
          : contact
      ),
    }));
  },

  deleteContact: (id) => {
    set((state) => ({
      contacts: state.contacts.filter((contact) => contact.id !== id),
    }));
  },

  // Protocol operations
  addProtocol: (protocolData) => {
    const newProtocol: EmergencyProtocol = {
      ...protocolData,
      id: `protocol-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      protocols: [...state.protocols, newProtocol],
    }));
  },

  updateProtocol: (id, updates) => {
    set((state) => ({
      protocols: state.protocols.map((protocol) =>
        protocol.id === id
          ? { ...protocol, ...updates, updatedAt: new Date() }
          : protocol
      ),
    }));
  },

  deleteProtocol: (id) => {
    set((state) => ({
      protocols: state.protocols.filter((protocol) => protocol.id !== id),
    }));
  },

  // Helper functions
  getIncidentsByBuilding: (buildingId) => {
    const { incidents } = get();
    return incidents.filter((incident) => incident.buildingId === buildingId);
  },

  getActiveIncidents: () => {
    const { incidents } = get();
    return incidents.filter((incident) => 
      incident.status !== 'resolved' && incident.status !== 'closed'
    );
  },

  getCriticalIncidents: () => {
    const { incidents } = get();
    return incidents.filter((incident) => 
      incident.severity === 'critical' && 
      (incident.status !== 'resolved' && incident.status !== 'closed')
    );
  },

  getContactsByPriority: () => {
    const { contacts } = get();
    return contacts
      .filter(contact => contact.isActive)
      .sort((a, b) => a.priority - b.priority);
  },

  getProtocolByCategory: (category) => {
    const { protocols } = get();
    return protocols.find((protocol) => 
      protocol.category === category && protocol.isActive
    );
  },

  notifyContacts: (incidentId, contactIds) => {
    const incident = get().incidents.find(i => i.id === incidentId);
    if (!incident) return;

    // 実際の実装では、ここで実際の通知（メール、SMS等）を送信
    console.log(`Notifying contacts ${contactIds.join(', ')} about incident ${incidentId}`);

    // 通知した連絡先をインシデントに記録
    get().updateIncident(incidentId, {
      notifiedContacts: [...incident.notifiedContacts, ...contactIds],
    });

    // 各連絡先に通知を送信（実際の実装では外部API呼び出し）
    contactIds.forEach(contactId => {
      const contact = get().contacts.find(c => c.id === contactId);
      if (contact) {
        // アプリ内通知も追加
        useNotificationStore.getState().addNotification({
          userId: contactId,
          title: '緊急事案が報告されました',
          message: `${incident.category}: ${incident.title}`,
          type: incident.severity === 'critical' ? 'error' : 'warning',
          read: false,
        });
      }
    });
  },
}));