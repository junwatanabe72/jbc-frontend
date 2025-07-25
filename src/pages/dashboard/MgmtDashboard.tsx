import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useBookingStore } from '../../stores/bookingStore';
import { useRequestStore } from '../../stores/requestStore';

const MgmtDashboard: React.FC = () => {
  const { bookings } = useBookingStore();
  const { requests } = useRequestStore();

  // 承認待ちの統計
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  const pendingRequests = requests.filter(request => 
    request.status === 'submitted' || request.status === 'under_review'
  );

  // 今日の予約
  const today = new Date();
  const todayBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === today.toDateString();
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">管理会社ダッシュボード</h1>
          <p className="mt-1 text-sm text-gray-600">
            ビル管理業務と請求・報告機能
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">今日の会議室予約</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{todayBookings.length}件</p>
            <p className="mt-1 text-sm text-gray-500">本日予約</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">予約承認待ち</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{pendingBookings.length}件</p>
            <p className="mt-1 text-sm text-gray-500">会議室予約</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">申請承認待ち</h3>
            <p className="mt-2 text-3xl font-bold text-red-600">{pendingRequests.length}件</p>
            <p className="mt-1 text-sm text-gray-500">各種申請</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総申請数</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{requests.length}件</p>
            <p className="mt-1 text-sm text-gray-500">全体</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">管理業務</h2>
            <div className="space-y-3">
              <Link to="/booking-management" className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">会議室予約管理</span>
                  <span className="text-xs text-gray-500">{pendingBookings.length}件待ち</span>
                </div>
              </Link>
              <Link to="/requests" className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">申請受付・承認</span>
                  <span className="text-xs text-gray-500">{pendingRequests.length}件待ち</span>
                </div>
              </Link>
              <Link to="/calendar" className="block w-full text-left p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">カレンダー管理</span>
                  <span className="text-xs text-gray-500">→</span>
                </div>
              </Link>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">請求書発行・業務報告</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">1月分請求書</p>
                  <p className="text-xs text-gray-500">テナント1-5 管理費</p>
                </div>
                <button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                  発行
                </button>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">月次業務報告</p>
                  <p className="text-xs text-gray-500">12月分清掃・点検</p>
                </div>
                <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                  提出
                </button>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">設備点検レポート</p>
                  <p className="text-xs text-gray-500">エレベーター・空調</p>
                </div>
                <button className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                  作成
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">イベント管理</h2>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h3 className="text-sm font-medium text-blue-900">今日のイベント</h3>
                <p className="text-xs text-blue-700 mt-1">エレベーター点検 10:00-12:00</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-900">明日の予定</h3>
                <p className="text-xs text-yellow-700 mt-1">防災訓練 14:00-15:00</p>
              </div>
              <button className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                + 新規イベント登録
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">緊急連絡管理</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">緊急通報一覧</h3>
              <div className="text-center py-8 text-gray-500">
                <p className="text-sm">現在、緊急通報はありません</p>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">対応依頼ステータス</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <span className="text-xs text-green-800">水漏れ対応</span>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">完了</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-xs text-yellow-800">照明修理</span>
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">対応中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MgmtDashboard;