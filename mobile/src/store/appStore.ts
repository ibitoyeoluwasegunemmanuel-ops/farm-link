import { create } from 'zustand';

interface AppState {
  notifCount: number;
  hasNewMessages: boolean;
  selectedLocation: string;
  networkConnected: boolean;

  setNotifCount: (count: number) => void;
  incrementNotif: () => void;
  setHasNewMessages: (val: boolean) => void;
  setSelectedLocation: (loc: string) => void;
  setNetworkConnected: (connected: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  notifCount: 0,
  hasNewMessages: false,
  selectedLocation: 'Lagos',
  networkConnected: true,

  setNotifCount: (notifCount) => set({ notifCount }),
  incrementNotif: () => set((s) => ({ notifCount: s.notifCount + 1 })),
  setHasNewMessages: (hasNewMessages) => set({ hasNewMessages }),
  setSelectedLocation: (selectedLocation) => set({ selectedLocation }),
  setNetworkConnected: (networkConnected) => set({ networkConnected }),
}));
