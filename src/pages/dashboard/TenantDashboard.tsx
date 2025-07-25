import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/layout/Layout';
import { useBookingStore } from '../../stores/bookingStore';
import { useRequestStore } from '../../stores/requestStore';
import { useAuthStore } from '../../stores/authStore';

const TenantDashboard: React.FC = () => {
  const { bookings } = useBookingStore();
  const { requests } = useRequestStore();
  const { user } = useAuthStore();

  // ユーザーの予約と申請を取得
  const myBookings = bookings.filter(booking => booking.userId === user?.id);
  const myRequests = requests.filter(request => request.submitterId === user?.id);

  // 今日の予約
  const today = new Date();
  const todayBookings = myBookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === today.toDateString();
  });

  // 承認待ちの申請
  const pendingRequests = myRequests.filter(request => 
    request.status === 'submitted' || request.status === 'under_review'
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">テナントホーム</h1>
          <p className="mt-1 text-sm text-gray-600">
            イベントカレンダー、手続き申請、館内細則閲覧、緊急連絡
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">今日の会議室予約</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{todayBookings.length}件</p>
            <p className="mt-1 text-sm text-gray-500">予約済み</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">申請状況</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{pendingRequests.length}件</p>
            <p className="mt-1 text-sm text-gray-500">承認待ち</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総申請数</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{myRequests.length}件</p>
            <p className="mt-1 text-sm text-gray-500">全体</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">総予約数</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{myBookings.length}件</p>
            <p className="mt-1 text-sm text-gray-500">会議室</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">イベントカレンダー</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">会議室A利用</p>
                  <p className="text-xs text-gray-500">今日 14:00 - 16:00</p>
                </div>
                <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">予約済</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">防災訓練</p>
                  <p className="text-xs text-gray-500">金曜日 10:00 - 11:00</p>
                </div>
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">参加必須</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">清掃作業</p>
                  <p className="text-xs text-gray-500">来週火曜 08:00 - 10:00</p>
                </div>
                <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">予定</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">申請・予約</h2>
            <div className="space-y-3">
              <Link to="/bookings" className="block w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">📋 会議室予約</span>
                  <span className="text-xs text-gray-500">→</span>
                </div>
              </Link>
              <Link to="/apply" className="block w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">🔧 各種申請</span>
                  <span className="text-xs text-gray-500">→</span>
                </div>
              </Link>
              {pendingRequests.length > 0 && (
                <div className="mt-4 space-y-2">
                  {pendingRequests.slice(0, 2).map(request => (
                    <div key={request.id} className="p-3 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-800 font-medium">
                        申請中: {request.title}
                      </p>
                      <p className="text-xs text-orange-600">
                        {request.status === 'submitted' ? '承認待ち' : '審査中'} 
                        ({new Date(request.createdAt).toLocaleDateString('ja-JP')})
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">館内細則・緊急連絡</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">📄 館内細則閲覧</span>
                  <span className="text-xs text-gray-500">PDF</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-gray-300 rounded-lg hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">📋 利用ルール</span>
                  <span className="text-xs text-gray-500">→</span>
                </div>
              </button>
              <button className="w-full text-left p-3 border border-red-300 rounded-lg bg-red-50 hover:bg-red-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-red-700">🚨 緊急連絡</span>
                  <span className="text-xs text-red-500">24時間</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">最新のお知らせ</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">エレベーター点検のお知らせ</h3>
              <p className="text-sm text-gray-600 mt-1">
                明日1月16日（火）午前10:00〜12:00の間、エレベーターの定期点検を実施いたします。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-15</p>
            </div>
            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">会議室利用ルールの変更</h3>
              <p className="text-sm text-gray-600 mt-1">
                2月1日より会議室の利用時間が変更になります。詳細は館内規則をご確認ください。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-12</p>
            </div>
            <div className="border-l-4 border-yellow-400 pl-4">
              <h3 className="text-sm font-medium text-gray-900">防災訓練実施予定</h3>
              <p className="text-sm text-gray-600 mt-1">
                1月19日（金）午前10:00より防災訓練を実施いたします。全テナント様の参加をお願いいたします。
              </p>
              <p className="text-xs text-gray-500 mt-2">2024-01-10</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TenantDashboard;