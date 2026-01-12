import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function createThemeStore() {
  const { subscribe, set, update } = writable<Theme>('light');

  return {
    subscribe,
    init: () => {
      if (!browser) return;

      const saved = localStorage.getItem('theme') as Theme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const theme = saved || (prefersDark ? 'dark' : 'light');
      set(theme);
      document.documentElement.dataset.theme = theme;
    },
    toggle: () => {
      update((current) => {
        const newTheme = current === 'light' ? 'dark' : 'light';
        if (browser) {
          document.documentElement.dataset.theme = newTheme;
          localStorage.setItem('theme', newTheme);
        }
        return newTheme;
      });
    },
    set: (theme: Theme) => {
      set(theme);
      if (browser) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem('theme', theme);
      }
    }
  };
}

export const theme = createThemeStore();
