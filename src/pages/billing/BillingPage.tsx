import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useBillingStore } from '../../stores/billingStore';
import { useBuildingStore } from '../../stores/buildingStore';
import type { Invoice, InvoiceStatus } from '../../types/billing';

const BillingPage: React.FC = () => {
  const {
    invoices,
    payments,
    createInvoice,
    updateInvoice,
    setInvoiceStatus,
    addPayment,
    getInvoicesByStatus,
    getOverdueInvoices,
    getTotalRevenue,
    generateInvoiceNumber
  } = useBillingStore();

  const { tenants } = useBuildingStore();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'payments' | 'create'>('overview');
  const [selectedStatus, setSelectedStatus] = useState<InvoiceStatus | 'all'>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' }).format(amount);
  };

  const getStatusLabel = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return '下書き';
      case 'issued': return '発行済み';
      case 'sent': return '送信済み';
      case 'paid': return '支払済み';
      case 'overdue': return '延滞';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getStatusColor = (status: InvoiceStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'issued': return 'bg-blue-100 text-blue-800';
      case 'sent': return 'bg-yellow-100 text-yellow-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredInvoices = selectedStatus === 'all' 
    ? invoices 
    : getInvoicesByStatus(selectedStatus);

  const overdueInvoices = getOverdueInvoices();
  const thisMonthRevenue = getTotalRevenue({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    end: new Date()
  });

  const handleCreateInvoice = () => {
    // 新規請求書作成のロジック（簡易版）
    const newInvoice = {
      invoiceNumber: generateInvoiceNumber(),
      tenantId: tenants[0]?.id || '',
      tenantName: tenants[0]?.companyName || '',
      billingPeriod: {
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      },
      items: [],
      subtotal: 0,
      tax: 0,
      total: 0,
      status: 'draft' as InvoiceStatus,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30日後
    };
    
    createInvoice(newInvoice);
    alert('新しい請求書が作成されました');
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">請求書管理</h1>
            <p className="text-sm text-gray-600">請求書の発行・管理・売上分析</p>
          </div>
          <button
            onClick={handleCreateInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + 新規請求書
          </button>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">今月の売上</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">
              {formatCurrency(thisMonthRevenue)}
            </p>
            <p className="mt-1 text-sm text-gray-500">累計収入</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">未収金</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">
              {formatCurrency(
                invoices
                  .filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled')
                  .reduce((sum, inv) => sum + inv.total, 0)
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">請求済み・未入金</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">延滞件数</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{overdueInvoices.length}</p>
            <p className="mt-1 text-sm text-gray-500">期限超過</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総請求書数</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{invoices.length}</p>
            <p className="mt-1 text-sm text-gray-500">全期間</p>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: '概要' },
              { id: 'invoices', label: '請求書一覧' },
              { id: 'payments', label: '入金履歴' },
              { id: 'create', label: '請求書作成' }
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">請求書ステータス分布</h3>
                  <div className="space-y-3">
                    {(['issued', 'sent', 'paid', 'overdue'] as InvoiceStatus[]).map((status) => {
                      const count = getInvoicesByStatus(status).length;
                      const percentage = invoices.length > 0 ? (count / invoices.length) * 100 : 0;
                      
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(status)}`}>
                              {getStatusLabel(status)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 rounded-full h-2" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600">{count}件</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">最近の請求書</h3>
                  <div className="space-y-3">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-xs text-gray-500">{invoice.tenantName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">{formatCurrency(invoice.total)}</p>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                            {getStatusLabel(invoice.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">請求書一覧</h3>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as InvoiceStatus | 'all')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">全てのステータス</option>
                    <option value="draft">下書き</option>
                    <option value="issued">発行済み</option>
                    <option value="sent">送信済み</option>
                    <option value="paid">支払済み</option>
                    <option value="overdue">延滞</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          請求書番号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          テナント
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          請求期間
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          金額
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ステータス
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          期限
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          アクション
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredInvoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {invoice.invoiceNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.tenantName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.billingPeriod.startDate.toLocaleDateString('ja-JP')} - {invoice.billingPeriod.endDate.toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(invoice.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(invoice.status)}`}>
                              {getStatusLabel(invoice.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {invoice.dueDate.toLocaleDateString('ja-JP')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => setSelectedInvoice(invoice)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              詳細
                            </button>
                            {invoice.status !== 'paid' && (
                              <button
                                onClick={() => {
                                  setSelectedInvoice(invoice);
                                  setShowPaymentModal(true);
                                }}
                                className="text-green-600 hover:text-green-800"
                              >
                                入金登録
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="p-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">入金履歴</h3>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          入金日
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          請求書番号
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          金額
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          支払方法
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          参照番号
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => {
                        const invoice = invoices.find(inv => inv.id === payment.invoiceId);
                        return (
                          <tr key={payment.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {payment.paymentDate.toLocaleDateString('ja-JP')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {invoice?.invoiceNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatCurrency(payment.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.paymentMethod === 'bank_transfer' ? '銀行振込' :
                               payment.paymentMethod === 'cash' ? '現金' :
                               payment.paymentMethod === 'credit_card' ? 'クレジットカード' : 'その他'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {payment.reference}
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

          {activeTab === 'create' && (
            <div className="p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-4">請求書作成</h3>
                <p className="text-gray-600 mb-6">新しい請求書を作成します</p>
                <button
                  onClick={handleCreateInvoice}
                  className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  新規請求書を作成
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 入金登録モーダル */}
        {showPaymentModal && selectedInvoice && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">入金登録</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">請求書: {selectedInvoice.invoiceNumber}</p>
                    <p className="text-sm text-gray-600">金額: {formatCurrency(selectedInvoice.total)}</p>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowPaymentModal(false);
                        setSelectedInvoice(null);
                      }}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={() => {
                        addPayment({
                          invoiceId: selectedInvoice.id,
                          amount: selectedInvoice.total,
                          paymentDate: new Date(),
                          paymentMethod: 'bank_transfer',
                          reference: `PAY-${Date.now()}`,
                        });
                        setShowPaymentModal(false);
                        setSelectedInvoice(null);
                        alert('入金を登録しました');
                      }}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      入金登録
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BillingPage;