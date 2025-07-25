import { create } from 'zustand';
import type { BillingState, Invoice, Payment, InvoiceTemplate } from '../types/billing';

// サンプルデータ
const mockInvoices: Invoice[] = [
  {
    id: 'invoice-1',
    invoiceNumber: '2024-001',
    tenantId: 'tenant-1',
    tenantName: '株式会社テックソリューション',
    billingPeriod: {
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-02-29'),
    },
    items: [
      {
        id: 'item-1',
        description: '賃料（201号室）',
        quantity: 1,
        unitPrice: 320000,
        amount: 320000,
        type: 'rent',
        unitId: 'unit-1',
      },
      {
        id: 'item-2',
        description: '共益費',
        quantity: 1,
        unitPrice: 32000,
        amount: 32000,
        type: 'maintenance',
      },
      {
        id: 'item-3',
        description: '駐車場代',
        quantity: 1,
        unitPrice: 15000,
        amount: 15000,
        type: 'parking',
      }
    ],
    subtotal: 367000,
    tax: 36700,
    total: 403700,
    status: 'issued',
    issueDate: new Date('2024-01-25'),
    dueDate: new Date('2024-02-25'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: 'invoice-2',
    invoiceNumber: '2024-002',
    tenantId: 'tenant-1',
    tenantName: '株式会社テックソリューション',
    billingPeriod: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
    },
    items: [
      {
        id: 'item-4',
        description: '賃料（201号室）',
        quantity: 1,
        unitPrice: 320000,
        amount: 320000,
        type: 'rent',
        unitId: 'unit-1',
      },
      {
        id: 'item-5',
        description: '共益費',
        quantity: 1,
        unitPrice: 32000,
        amount: 32000,
        type: 'maintenance',
      }
    ],
    subtotal: 352000,
    tax: 35200,
    total: 387200,
    status: 'paid',
    issueDate: new Date('2023-12-25'),
    dueDate: new Date('2024-01-25'),
    paidDate: new Date('2024-01-20'),
    createdAt: new Date('2023-12-25'),
    updatedAt: new Date('2024-01-20'),
  }
];

const mockPayments: Payment[] = [
  {
    id: 'payment-1',
    invoiceId: 'invoice-2',
    amount: 387200,
    paymentDate: new Date('2024-01-20'),
    paymentMethod: 'bank_transfer',
    reference: 'TXN-20240120-001',
    createdAt: new Date('2024-01-20'),
  }
];

const mockTemplates: InvoiceTemplate[] = [
  {
    id: 'template-1',
    name: '月額賃料請求書',
    description: '標準的な月額賃料の請求書テンプレート',
    items: [
      {
        description: '賃料',
        type: 'rent',
        isVariable: true,
      },
      {
        description: '共益費',
        type: 'maintenance',
        isVariable: true,
      }
    ],
    isDefault: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }
];

export const useBillingStore = create<BillingState>((set, get) => ({
  invoices: mockInvoices,
  payments: mockPayments,
  templates: mockTemplates,
  selectedInvoice: null,
  isLoading: false,

  // Invoice operations
  createInvoice: (invoiceData) => {
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `invoice-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      invoices: [...state.invoices, newInvoice],
    }));
  },

  updateInvoice: (id, updates) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, ...updates, updatedAt: new Date() }
          : invoice
      ),
    }));
  },

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
      selectedInvoice: state.selectedInvoice?.id === id ? null : state.selectedInvoice,
    }));
  },

  setInvoiceStatus: (id, status) => {
    const updates: Partial<Invoice> = { status };
    
    if (status === 'paid') {
      updates.paidDate = new Date();
    }
    
    get().updateInvoice(id, updates);
  },

  // Payment operations
  addPayment: (paymentData) => {
    const newPayment: Payment = {
      ...paymentData,
      id: `payment-${Date.now()}`,
      createdAt: new Date(),
    };
    
    set((state) => ({
      payments: [...state.payments, newPayment],
    }));

    // 請求書のステータスを支払済みに更新
    get().setInvoiceStatus(paymentData.invoiceId, 'paid');
  },

  deletePayment: (id) => {
    set((state) => ({
      payments: state.payments.filter((payment) => payment.id !== id),
    }));
  },

  // Template operations
  createTemplate: (templateData) => {
    const newTemplate: InvoiceTemplate = {
      ...templateData,
      id: `template-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      templates: [...state.templates, newTemplate],
    }));
  },

  updateTemplate: (id, updates) => {
    set((state) => ({
      templates: state.templates.map((template) =>
        template.id === id
          ? { ...template, ...updates, updatedAt: new Date() }
          : template
      ),
    }));
  },

  deleteTemplate: (id) => {
    set((state) => ({
      templates: state.templates.filter((template) => template.id !== id),
    }));
  },

  // Helper functions
  getInvoicesByTenant: (tenantId) => {
    const { invoices } = get();
    return invoices.filter((invoice) => invoice.tenantId === tenantId);
  },

  getInvoicesByStatus: (status) => {
    const { invoices } = get();
    return invoices.filter((invoice) => invoice.status === status);
  },

  getOverdueInvoices: () => {
    const { invoices } = get();
    const today = new Date();
    return invoices.filter((invoice) => 
      invoice.status !== 'paid' && 
      invoice.status !== 'cancelled' && 
      invoice.dueDate < today
    );
  },

  getTotalRevenue: (period) => {
    const { invoices } = get();
    let filteredInvoices = invoices.filter(invoice => invoice.status === 'paid');
    
    if (period) {
      filteredInvoices = filteredInvoices.filter(invoice => 
        invoice.paidDate && 
        invoice.paidDate >= period.start && 
        invoice.paidDate <= period.end
      );
    }
    
    return filteredInvoices.reduce((total, invoice) => total + invoice.total, 0);
  },

  getPaymentsByInvoice: (invoiceId) => {
    const { payments } = get();
    return payments.filter((payment) => payment.invoiceId === invoiceId);
  },

  generateInvoiceNumber: () => {
    const { invoices } = get();
    const year = new Date().getFullYear();
    const yearInvoices = invoices.filter(inv => 
      inv.invoiceNumber.startsWith(year.toString())
    );
    const nextNumber = yearInvoices.length + 1;
    return `${year}-${nextNumber.toString().padStart(3, '0')}`;
  },
}));