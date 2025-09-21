import { create } from 'zustand';

type Theme = 'dark' | 'light';

type UIState = {
  theme: Theme;
  reducedMotion: boolean;
  fontScale: number; // 1 = 100%
  setTheme: (t: Theme) => void;
  toggleReducedMotion: () => void;
  setFontScale: (s: number) => void;
};

export const useUI = create<UIState>((set) => ({
  theme: 'dark',
  reducedMotion: false,
  fontScale: 1,
  setTheme: (theme) => set({ theme }),
  toggleReducedMotion: () => set((s) => ({ reducedMotion: !s.reducedMotion })),
  setFontScale: (fontScale) => set({ fontScale }),
}));
