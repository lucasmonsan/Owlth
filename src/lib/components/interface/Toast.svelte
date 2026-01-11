<script lang="ts">
	import { fly } from 'svelte/transition';
	import {
		toastStore,
		removeToast,
		type ToastVariant
	} from '$lib/stores/toast.svelte';

	interface ToastItem {
		id: string;
		message: string;
		variant: ToastVariant;
		duration: number;
		persistent?: boolean;
	}

	let toasts = $state<ToastItem[]>([]);

	$effect(() => {
		toasts = $toastStore;
	});

	function handleClose(id: string) {
		removeToast(id);
	}
</script>

<div class="toast-container">
	{#each toasts as toast (toast.id)}
		<div
			class="toast {toast.variant}"
			class:persistent={toast.persistent}
			role="alert"
			aria-live="polite"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<p class="toast-message">{toast.message}</p>

			{#if toast.persistent || toast.duration === 0}
				<button
					class="toast-close"
					onclick={() => handleClose(toast.id)}
					aria-label="Fechar notificação"
				>
					×
				</button>
			{/if}
		</div>
	{/each}
</div>

<style>
	.toast-container {
		position: fixed;
		bottom: var(--md);
		right: var(--md);
		z-index: var(--z-toast);
		display: flex;
		flex-direction: column;
		gap: var(--sm);
		pointer-events: none;
	}

	.toast {
		pointer-events: auto;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--sm);
		min-width: 16rem;
		max-width: 24rem;
		padding: var(--sm) var(--md);
		border-radius: var(--radius);
		background-color: var(--surface);
		border: var(--border) var(--border-color);
		box-shadow: var(--shadow-lg);
		color: var(--text-primary);
	}

	.toast.info {
		border-color: var(--info);
		background-color: var(--info);
		color: white;
	}

	.toast.success {
		border-color: var(--success);
		background-color: var(--success);
		color: white;
	}

	.toast.warning {
		border-color: var(--warning);
		background-color: var(--warning);
		color: var(--text-primary);
	}

	.toast.error {
		border-color: var(--error);
		background-color: var(--error);
		color: white;
	}

	.toast-message {
		flex: 1;
		margin: 0;
		font-size: var(--sm);
		line-height: 1.4;
	}

	.toast-close {
		display: flex;
		align-items: center;
		justify-content: center;
		width: var(--lg);
		height: var(--lg);
		padding: 0;
		border: none;
		background: transparent;
		color: currentColor;
		font-size: var(--xl);
		line-height: 1;
		cursor: pointer;
		opacity: 0.7;
		transition: opacity var(--fast);
	}

	.toast-close:hover {
		opacity: 1;
	}

	.toast-close:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
		border-radius: var(--radius);
	}

	@media (max-width: 640px) {
		.toast-container {
			left: var(--md);
			right: var(--md);
			bottom: var(--md);
			align-items: center;
		}
	}
</style>
