import { writable } from 'svelte/store';

export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
  persistent?: boolean;
  actions?: ToastAction[];
}

interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
  persistent?: boolean;
  actions?: ToastAction[];
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  return {
    subscribe,
    add: (options: ToastOptions) => {
      const toast: Toast = {
        id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        message: options.message,
        variant: options.variant || 'info',
        duration: options.duration ?? 3000,
        persistent: options.persistent || false,
        actions: options.actions
      };

      update((toasts) => [...toasts, toast]);

      if (!toast.persistent && toast.duration > 0) {
        setTimeout(() => {
          toastStore.remove(toast.id);
        }, toast.duration);
      }

      return toast.id;
    },
    remove: (id: string) => {
      update((toasts) => toasts.filter((t) => t.id !== id));
    },
    clear: () => {
      update(() => []);
    }
  };
}

export const toastStore = createToastStore();

export const addToast = toastStore.add;
export const removeToast = toastStore.remove;
export const clearToasts = toastStore.clear;