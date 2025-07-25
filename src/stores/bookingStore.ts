import { create } from 'zustand';
import type { BookingState, Booking } from '../types';
import { mockRooms, mockBookings } from '../data/mockBookings';
import { useNotificationStore } from './notificationStore';

export const useBookingStore = create<BookingState>((set, get) => ({
  bookings: mockBookings,
  rooms: mockRooms,
  isLoading: false,

  addBooking: (bookingData) => {
    const newBooking: Booking = {
      ...bookingData,
      id: `booking-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      bookings: [...state.bookings, newBooking],
    }));
  },

  updateBooking: (id, updates) => {
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? { ...booking, ...updates, updatedAt: new Date() }
          : booking
      ),
    }));
  },

  deleteBooking: (id) => {
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    }));
  },

  getBookingsByRoom: (roomId, date) => {
    const { bookings } = get();
    return bookings.filter((booking) => {
      if (booking.roomId !== roomId) return false;
      if (booking.status === 'rejected' || booking.status === 'cancelled') return false;
      
      const bookingDate = new Date(booking.startTime);
      return (
        bookingDate.getDate() === date.getDate() &&
        bookingDate.getMonth() === date.getMonth() &&
        bookingDate.getFullYear() === date.getFullYear()
      );
    });
  },

  getAvailableSlots: (roomId, date) => {
    const roomBookings = get().getBookingsByRoom(roomId, date);
    const slots: { start: Date; end: Date }[] = [];
    
    // 営業時間: 9:00 - 21:00
    const startHour = 9;
    const endHour = 21;
    
    // 予約済み時間をソート
    const sortedBookings = roomBookings
      .filter(booking => booking.status === 'approved' || booking.status === 'pending')
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    let currentTime = new Date(date);
    currentTime.setHours(startHour, 0, 0, 0);
    
    const endTime = new Date(date);
    endTime.setHours(endHour, 0, 0, 0);
    
    for (const booking of sortedBookings) {
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      
      if (currentTime < bookingStart) {
        slots.push({
          start: new Date(currentTime),
          end: new Date(bookingStart),
        });
      }
      
      if (currentTime < bookingEnd) {
        currentTime = new Date(bookingEnd);
      }
    }
    
    // 最後の空き時間
    if (currentTime < endTime) {
      slots.push({
        start: new Date(currentTime),
        end: new Date(endTime),
      });
    }
    
    return slots;
  },

  approveBooking: (id, approvedBy) => {
    const booking = get().bookings.find(b => b.id === id);
    
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? { 
              ...booking, 
              status: 'approved',
              approvedBy,
              approvedAt: new Date(),
              updatedAt: new Date()
            }
          : booking
      ),
    }));

    // 通知を送信
    if (booking) {
      useNotificationStore.getState().addNotification({
        userId: booking.userId,
        title: '会議室予約が承認されました',
        message: `「${booking.title}」の予約が承認されました。`,
        type: 'success',
        read: false,
        relatedBookingId: id,
      });
    }
  },

  rejectBooking: (id, reason, rejectedBy) => {
    const booking = get().bookings.find(b => b.id === id);
    
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id
          ? { 
              ...booking, 
              status: 'rejected',
              rejectionReason: reason,
              approvedBy: rejectedBy,
              updatedAt: new Date()
            }
          : booking
      ),
    }));

    // 通知を送信
    if (booking) {
      useNotificationStore.getState().addNotification({
        userId: booking.userId,
        title: '会議室予約が却下されました',
        message: `「${booking.title}」の予約が却下されました。理由: ${reason}`,
        type: 'error',
        read: false,
        relatedBookingId: id,
      });
    }
  },
}));