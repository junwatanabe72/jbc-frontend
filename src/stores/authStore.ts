import { create } from 'zustand';
import type { AuthState } from '../types';
import { mockUsers, mockCredentials } from '../data/mockUsers';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: (email: string, password: string) => {
    const expectedPassword = mockCredentials[email as keyof typeof mockCredentials];
    
    if (expectedPassword && expectedPassword === password) {
      const user = mockUsers.find(u => u.email === email);
      if (user) {
        set({ user, isAuthenticated: true });
        return true;
      }
    }
    return false;
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false });
  }
}));