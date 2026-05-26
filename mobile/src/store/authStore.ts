import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserRole } from '../navigation/types';

interface User {
  id: string;
  phone: string;
  name: string;
  email?: string;
  avatarUri?: string;
  role: UserRole;
  verified: boolean;
  walletBalance: number;
  state?: string;
  bio?: string;
  farmName?: string;
  kycCompleted: boolean;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setUser: (user: User, token: string) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
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

  updateUser: async (partial) => {
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
      const [userStr, token] = await AsyncStorage.multiGet([
        '@farmlink_user',
        '@farmlink_token',
      ]);
      const user = userStr[1] ? JSON.parse(userStr[1]) : null;
      const tok = token[1] ?? null;
      set({ user, token: tok, isAuthenticated: !!(user && tok), isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));
