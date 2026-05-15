import { create } from 'zustand';

export const useAppStore = create((set) => ({
  activeTheme: 'midnight-glass',
  liveMode: false,
  setTheme: (theme) => set({ activeTheme: theme }),
  setLiveMode: (value) => set({ liveMode: value })
}));
