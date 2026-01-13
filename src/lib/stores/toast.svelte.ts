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

let toasts = $state<Toast[]>([]);

export function addToast(options: ToastOptions): string {
  const toast: Toast = {
    id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    message: options.message,
    variant: options.variant || 'info',
    duration: options.duration ?? 3000,
    persistent: options.persistent || false,
    actions: options.actions
  };

  toasts = [...toasts, toast];

  if (!toast.persistent && toast.duration > 0) {
    setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration);
  }

  return toast.id;
}

export function removeToast(id: string): void {
  toasts = toasts.filter((t) => t.id !== id);
}

export function clearToasts(): void {
  toasts = [];
}

export function getToasts(): Toast[] {
  return toasts;
}