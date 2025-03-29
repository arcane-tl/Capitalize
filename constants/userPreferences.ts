import { create } from 'zustand';
import { Appearance } from 'react-native';

type Theme = 'light' | 'dark';

interface UserPreferences {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useUserPreferences = create<UserPreferences>((set) => ({
  theme: Appearance.getColorScheme() === 'dark' ? 'dark' : 'light',
  setTheme: (theme) => set({ theme }),
}));