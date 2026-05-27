import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../navigation/types';

export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  email?: string;
  avatar?: string;
  role?: UserRole;
  isVerified: boolean;
  profileComplete: boolean;
  state?: string;
  bio?: string;
  farmName?: string;
  rating?: number;
  totalTransactions?: number;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User, token: string) => Promise<void>;
  updateUser: (partial: Partial<User>) => void;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  hydrateFromStorage: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: async (user, token) => {
    await AsyncStorage.setItem('@farmlink_user', JSON.stringify(user));
    await AsyncStorage.setItem('@farmlink_token', token);
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (partial) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...partial };
      AsyncStorage.setItem('@farmlink_user', JSON.stringify(updated));
      return { user: updated };
    });
  },

  logout: async () => {
    await AsyncStorage.multiRemove(['@farmlink_user', '@farmlink_token']);
    set({ user: null, token: null, isAuthenticated: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  hydrateFromStorage: async () => {
    try {
      const [userEntry, tokenEntry] = await AsyncStorage.multiGet([
        '@farmlink_user',
        '@farmlink_token',
      ]);
      const user: User | null = userEntry[1] ? JSON.parse(userEntry[1]) : null;
      const token = tokenEntry[1] ?? null;
      set({ user, token, isAuthenticated: !!(user && token), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
