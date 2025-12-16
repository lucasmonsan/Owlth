import { writable } from 'svelte/store';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
	id: number;
	type: ToastType;
	message: string;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	let nextId = 1;

	return {
		subscribe,
		show: (type: ToastType, message: string, duration = 5000) => {
			const id = nextId++;
			update((toasts) => [...toasts, { id, type, message }]);

			setTimeout(() => {
				update((toasts) => toasts.filter((t) => t.id !== id));
			}, duration);
		},
		success: (message: string) => {
			return createToastStore().show('success', message);
		},
		error: (message: string) => {
			return createToastStore().show('error', message);
		},
		info: (message: string) => {
			return createToastStore().show('info', message);
		},
		remove: (id: number) => {
			update((toasts) => toasts.filter((t) => t.id !== id));
		}
	};
}

export const toast = createToastStore();

