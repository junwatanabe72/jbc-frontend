import React, { useState } from 'react';
import { useBookingStore } from '../../stores/bookingStore';
import { useAuthStore } from '../../stores/authStore';
import Layout from '../../components/layout/Layout';
import type { BookingStatus } from '../../types';

const BookingManagementPage: React.FC = () => {
  const { bookings, rooms, approveBooking, rejectBooking } = useBookingStore();
  const { user } = useAuthStore();
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | 'all'>('all');
  const [rejectionReason, setRejectionReason] = useState('');
  const [rejectingBookingId, setRejectingBookingId] = useState<string | null>(null);

  const filteredBookings = bookings.filter(booking => 
    selectedStatus === 'all' || booking.status === selectedStatus
  );

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleApprove = (bookingId: string) => {
    if (user) {
      approveBooking(bookingId, user.id);
    }
  };

  const handleRejectSubmit = () => {
    if (rejectingBookingId && user && rejectionReason.trim()) {
      rejectBooking(rejectingBookingId, rejectionReason, user.id);
      setRejectingBookingId(null);
      setRejectionReason('');
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">会議室予約管理</h1>
          
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | 'all')}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">全てのステータス</option>
            <option value="pending">承認待ち</option>
            <option value="approved">承認済み</option>
            <option value="rejected">却下</option>
            <option value="cancelled">キャンセル</option>
            <option value="completed">完了</option>
          </select>
        </div>

        {/* 予約統計 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['pending', 'approved', 'rejected', 'completed'] as BookingStatus[]).map(status => {
            const count = bookings.filter(b => b.status === status).length;
            return (
              <div key={status} className="bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                    {status === 'pending' && '承認待ち'}
                    {status === 'approved' && '承認済み'}
                    {status === 'rejected' && '却下'}
                    {status === 'completed' && '完了'}
                  </div>
                  <span className="ml-2 text-2xl font-bold">{count}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 予約リスト */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      予約情報
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      会議室
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      日時
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ステータス
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{booking.title}</div>
                          <div className="text-sm text-gray-500">{booking.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getRoomName(booking.roomId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>
                          {new Date(booking.startTime).toLocaleDateString('ja-JP')}
                        </div>
                        <div className="text-gray-500">
                          {new Date(booking.startTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })} - 
                          {new Date(booking.endTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status === 'pending' && '承認待ち'}
                          {booking.status === 'approved' && '承認済み'}
                          {booking.status === 'rejected' && '却下'}
                          {booking.status === 'cancelled' && 'キャンセル'}
                          {booking.status === 'completed' && '完了'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleApprove(booking.id)}
                              className="text-green-600 hover:text-green-900"
                            >
                              承認
                            </button>
                            <button
                              onClick={() => setRejectingBookingId(booking.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              却下
                            </button>
                          </div>
                        )}
                        {booking.status === 'rejected' && booking.rejectionReason && (
                          <div className="text-xs text-red-600">
                            理由: {booking.rejectionReason}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 却下理由入力モーダル */}
        {rejectingBookingId && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">予約却下理由</h3>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="却下理由を入力してください"
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setRejectingBookingId(null);
                      setRejectionReason('');
                    }}
                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleRejectSubmit}
                    disabled={!rejectionReason.trim()}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                  >
                    却下する
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingManagementPage;