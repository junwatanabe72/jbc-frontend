import { create } from 'zustand';
import type { EventState, Event } from '../types';
import { mockEvents } from '../data/mockEvents';

export const useEventStore = create<EventState>((set, get) => ({
  events: mockEvents,
  selectedDate: new Date(),
  isLoading: false,

  addEvent: (eventData) => {
    const newEvent: Event = {
      ...eventData,
      id: `event-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      events: [...state.events, newEvent],
    }));
  },

  updateEvent: (id, updates) => {
    set((state) => ({
      events: state.events.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date() }
          : event
      ),
    }));
  },

  deleteEvent: (id) => {
    set((state) => ({
      events: state.events.filter((event) => event.id !== id),
    }));
  },

  getEventsByDate: (date) => {
    const { events } = get();
    return events.filter((event) => {
      const eventDate = new Date(event.startTime);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  },

  setSelectedDate: (date) => {
    set({ selectedDate: date });
  },
}));