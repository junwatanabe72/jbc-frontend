import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { useBookingStore } from '../../stores/bookingStore';
import { useAuthStore } from '../../stores/authStore';
import type { Room, Booking } from '../../types';

const BookingPage: React.FC = () => {
  const { rooms, bookings, addBooking, getBookingsByRoom, getAvailableSlots } = useBookingStore();
  const { user } = useAuthStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
  });

  const handleRoomSelect = (room: Room) => {
    setSelectedRoom(room);
    setShowBookingForm(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !user) return;

    const startTime = new Date(formData.startTime);
    const endTime = new Date(formData.endTime);

    // 時間の検証
    if (startTime >= endTime) {
      alert('終了時間は開始時間より後にしてください');
      return;
    }

    // 営業時間の検証
    if (startTime.getHours() < 9 || endTime.getHours() > 21) {
      alert('営業時間は9:00-21:00です');
      return;
    }

    addBooking({
      roomId: selectedRoom.id,
      userId: user.id,
      title: formData.title,
      description: formData.description,
      startTime,
      endTime,
    });

    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
    });
    setShowBookingForm(false);
    alert('予約申請を送信しました。承認をお待ちください。');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return '承認待ち';
      case 'approved': return '承認済み';
      case 'rejected': return '却下';
      case 'cancelled': return 'キャンセル';
      case 'completed': return '完了';
      default: return status;
    }
  };

  const selectedRoomBookings = selectedRoom ? getBookingsByRoom(selectedRoom.id, selectedDate) : [];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">会議室予約</h1>
          <p className="mt-1 text-sm text-gray-600">
            会議室の空き状況確認と予約申請
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 会議室一覧 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">会議室一覧</h2>
            <div className="space-y-3">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => handleRoomSelect(room)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{room.name}</h3>
                      <p className="text-sm text-gray-500">{room.floor}F・定員{room.capacity}名</p>
                      <p className="text-sm text-gray-500">¥{room.hourlyRate?.toLocaleString()}/時間</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      設備: {room.equipment.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 日付選択と空き状況 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">空き状況</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                日付選択
              </label>
              <input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {selectedRoom ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">{selectedRoom.name}</h3>
                  <p className="text-sm text-gray-600">
                    {selectedDate.toLocaleDateString('ja-JP', { 
                      month: 'long', 
                      day: 'numeric',
                      weekday: 'short'
                    })}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">予約状況</h4>
                  {selectedRoomBookings.length === 0 ? (
                    <p className="text-sm text-gray-500">予約はありません</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedRoomBookings.map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                          <div>
                            <p className="text-sm font-medium">{booking.title}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(booking.startTime).toLocaleTimeString('ja-JP', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })} - {new Date(booking.endTime).toLocaleTimeString('ja-JP', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded ${getStatusColor(booking.status)}`}>
                            {getStatusLabel(booking.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  予約申請
                </button>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">会議室を選択してください</p>
            )}
          </div>

          {/* 予約フォーム */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">予約申請フォーム</h2>
            
            {showBookingForm && selectedRoom ? (
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    予約タイトル
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    開始時間
                  </label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    終了時間
                  </label>
                  <input
                    type="datetime-local"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    申請
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-500 text-center py-8">
                会議室を選択して「予約申請」ボタンをクリックしてください
              </p>
            )}
          </div>
        </div>

        {/* 自分の予約一覧 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">予約履歴</h2>
          <div className="space-y-3">
            {bookings
              .filter(booking => booking.userId === user?.id)
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((booking) => {
                const room = rooms.find(r => r.id === booking.roomId);
                return (
                  <div key={booking.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{booking.title}</h3>
                      <p className="text-sm text-gray-600">{room?.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.startTime).toLocaleString('ja-JP')} - {new Date(booking.endTime).toLocaleString('ja-JP')}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`px-3 py-1 text-sm rounded ${getStatusColor(booking.status)}`}>
                        {getStatusLabel(booking.status)}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.createdAt).toLocaleDateString('ja-JP')} 申請
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookingPage;