export interface Invoice {
  id: string;
  invoiceNumber: string;
  tenantId: string;
  tenantName: string;
  billingPeriod: {
    startDate: Date;
    endDate: Date;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  paidDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'rent' | 'maintenance' | 'utility' | 'parking' | 'other';
  unitId?: string; // 関連する部屋ID
}

export type InvoiceStatus = 'draft' | 'issued' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentDate: Date;
  paymentMethod: 'bank_transfer' | 'cash' | 'credit_card' | 'other';
  reference?: string;
  notes?: string;
  createdAt: Date;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  items: InvoiceTemplateItem[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceTemplateItem {
  description: string;
  type: 'rent' | 'maintenance' | 'utility' | 'parking' | 'other';
  unitPrice?: number;
  isVariable: boolean; // 金額が変動するかどうか
}

export interface BillingState {
  invoices: Invoice[];
  payments: Payment[];
  templates: InvoiceTemplate[];
  selectedInvoice: Invoice | null;
  isLoading: boolean;
  
  // Invoice operations
  createInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  setInvoiceStatus: (id: string, status: InvoiceStatus) => void;
  
  // Payment operations
  addPayment: (payment: Omit<Payment, 'id' | 'createdAt'>) => void;
  deletePayment: (id: string) => void;
  
  // Template operations
  createTemplate: (template: Omit<InvoiceTemplate, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTemplate: (id: string, updates: Partial<InvoiceTemplate>) => void;
  deleteTemplate: (id: string) => void;
  
  // Helper functions
  getInvoicesByTenant: (tenantId: string) => Invoice[];
  getInvoicesByStatus: (status: InvoiceStatus) => Invoice[];
  getOverdueInvoices: () => Invoice[];
  getTotalRevenue: (period?: { start: Date; end: Date }) => number;
  getPaymentsByInvoice: (invoiceId: string) => Payment[];
  generateInvoiceNumber: () => string;
}