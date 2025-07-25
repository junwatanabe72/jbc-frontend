import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import Calendar from '../../components/common/Calendar';
import EventModal from '../../components/common/EventModal';
import { useEventStore } from '../../stores/eventStore';
import { useBookingStore } from '../../stores/bookingStore';
import { useRequestStore } from '../../stores/requestStore';
import { useAuthStore } from '../../stores/authStore';
import type { Event } from '../../types';

const CalendarPage: React.FC = () => {
  const { selectedDate, getEventsByDate, deleteEvent } = useEventStore();
  const { bookings, rooms } = useBookingStore();
  const { requests } = useRequestStore();
  const { user } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>();
  const [showEventDetail, setShowEventDetail] = useState(false);

  const selectedDateEvents = getEventsByDate(selectedDate);

  // 選択された日の予約と申請を取得
  const selectedDateBookings = bookings.filter(booking => {
    const bookingDate = new Date(booking.startTime);
    return bookingDate.toDateString() === selectedDate.toDateString() && 
           booking.status === 'approved';
  });

  const selectedDateRequests = requests.filter(request => {
    if (!request.dueDate) return false;
    const dueDate = new Date(request.dueDate);
    return dueDate.toDateString() === selectedDate.toDateString();
  });

  const getRoomName = (roomId: string) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? room.name : 'Unknown Room';
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetail(true);
  };

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    setShowEventDetail(false);
  };

  const handleDeleteEvent = (eventId: string) => {
    if (window.confirm('このイベントを削除しますか？')) {
      deleteEvent(eventId);
      setShowEventDetail(false);
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'meeting': return '会議';
      case 'maintenance': return 'メンテナンス';
      case 'inspection': return '点検';
      case 'training': return '訓練';
      default: return 'その他';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return '予定';
      case 'in_progress': return '進行中';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditEvent = (event: Event) => {
    if (!user) return false;
    if (user.role === 'OWNER' || user.role === 'MGMT') return true;
    return event.createdBy === user.id;
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">イベントカレンダー</h1>
            <p className="mt-1 text-sm text-gray-600">
              スケジュール管理とイベント作成
            </p>
          </div>
          <button
            onClick={handleCreateEvent}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + イベント作成
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Calendar 
              onEventClick={handleEventClick}
            />
          </div>

          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {selectedDate.toLocaleDateString('ja-JP', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              
              <div className="space-y-4">
                {/* イベント */}
                {selectedDateEvents.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📅 イベント</h4>
                    <div className="space-y-2">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleEventClick(event)}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-gray-900">{event.title}</h5>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(event.startTime).toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(event.endTime).toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                              {event.location && (
                                <p className="text-xs text-gray-500">📍 {event.location}</p>
                              )}
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${getStatusColor(event.status)}`}>
                              {getStatusLabel(event.status)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 会議室予約 */}
                {selectedDateBookings.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">🏢 会議室予約</h4>
                    <div className="space-y-2">
                      {selectedDateBookings.map((booking) => (
                        <div key={booking.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-blue-900">{booking.title}</h5>
                              <p className="text-xs text-blue-700 mt-1">
                                {getRoomName(booking.roomId)} • {new Date(booking.startTime).toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })} - {new Date(booking.endTime).toLocaleTimeString('ja-JP', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </p>
                            </div>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              承認済み
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 申請期限 */}
                {selectedDateRequests.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">📋 申請期限</h4>
                    <div className="space-y-2">
                      {selectedDateRequests.map((request) => (
                        <div key={request.id} className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h5 className="text-sm font-medium text-orange-900">{request.title}</h5>
                              <p className="text-xs text-orange-700 mt-1">
                                期限: {new Date(request.dueDate!).toLocaleDateString('ja-JP')}
                              </p>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded ${
                              request.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {request.status === 'submitted' ? '承認待ち' :
                               request.status === 'approved' ? '承認済み' :
                               request.status === 'rejected' ? '却下' : request.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 何もない場合 */}
                {selectedDateEvents.length === 0 && selectedDateBookings.length === 0 && selectedDateRequests.length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">この日には予定がありません</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* イベント詳細モーダル */}
        {showEventDetail && selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-semibold">{selectedEvent.title}</h2>
                <button
                  onClick={() => setShowEventDetail(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">タイプ: </span>
                  <span className="text-sm text-gray-900">{getEventTypeLabel(selectedEvent.type)}</span>
                </div>
                
                <div>
                  <span className="text-sm font-medium text-gray-700">ステータス: </span>
                  <span className={`px-2 py-1 text-xs rounded ${getStatusColor(selectedEvent.status)}`}>
                    {getStatusLabel(selectedEvent.status)}
                  </span>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-700">時間: </span>
                  <span className="text-sm text-gray-900">
                    {new Date(selectedEvent.startTime).toLocaleString('ja-JP')} - {new Date(selectedEvent.endTime).toLocaleString('ja-JP')}
                  </span>
                </div>

                {selectedEvent.location && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">場所: </span>
                    <span className="text-sm text-gray-900">{selectedEvent.location}</span>
                  </div>
                )}

                <div>
                  <span className="text-sm font-medium text-gray-700">主催者: </span>
                  <span className="text-sm text-gray-900">{selectedEvent.organizer}</span>
                </div>

                {selectedEvent.description && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">説明: </span>
                    <p className="text-sm text-gray-900 mt-1">{selectedEvent.description}</p>
                  </div>
                )}
              </div>

              {canEditEvent(selectedEvent) && (
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => handleDeleteEvent(selectedEvent.id)}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => handleEditEvent(selectedEvent)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    編集
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          event={selectedEvent}
          selectedDate={selectedDate}
        />
      </div>
    </Layout>
  );
};

export default CalendarPage;