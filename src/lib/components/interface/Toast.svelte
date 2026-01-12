<script lang="ts">
	import { fly } from 'svelte/transition';
	import {
		toastStore,
		removeToast,
		type ToastVariant,
		type ToastAction
	} from '$lib/stores/toast.svelte';

	interface ToastItem {
		id: string;
		message: string;
		variant: ToastVariant;
		duration: number;
		persistent?: boolean;
		actions?: ToastAction[];
	}

	let toasts = $state<ToastItem[]>([]);

	$effect(() => {
		toasts = $toastStore;
	});

	function handleClose(id: string) {
		removeToast(id);
	}

	function handleAction(action: ToastAction, toastId: string) {
		action.onClick();
		removeToast(toastId);
	}
</script>

<div class="toast-container">
	{#each toasts as toast (toast.id)}
		<div
			class="toast {toast.variant}"
			class:persistent={toast.persistent}
			class:has-actions={toast.actions && toast.actions.length > 0}
			role="alert"
			aria-live="polite"
			transition:fly={{ y: 20, duration: 200 }}
		>
			<p class="toast-message">{toast.message}</p>

			{#if toast.actions && toast.actions.length > 0}
				<div class="toast-actions">
					{#each toast.actions as action}
						<button
							class="toast-action {action.variant || 'secondary'}"
							onclick={() => handleAction(action, toast.id)}
						>
							{action.label}
						</button>
					{/each}
				</div>
			{/if}

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

	.toast.has-actions {
		flex-direction: column;
		align-items: stretch;
		max-width: 28rem;
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

	.toast-actions {
		display: flex;
		gap: var(--xs);
		margin-top: var(--xs);
	}

	.toast-action {
		flex: 1;
		padding: var(--xxs) var(--sm);
		border: none;
		border-radius: var(--radius-sm);
		font-size: var(--sm);
		font-weight: 600;
		cursor: pointer;
		transition: all var(--fast);
	}

	.toast-action.primary {
		background: white;
		color: var(--brand);
	}

	.toast-action.primary:hover {
		background: rgba(255, 255, 255, 0.9);
	}

	.toast-action.secondary {
		background: rgba(255, 255, 255, 0.2);
		color: white;
	}

	.toast-action.secondary:hover {
		background: rgba(255, 255, 255, 0.3);
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
		position: absolute;
		top: var(--xs);
		right: var(--xs);
	}

	.toast.has-actions .toast-close {
		position: static;
		align-self: flex-end;
		margin-top: calc(var(--xs) * -1);
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

		.toast {
			max-width: 100%;
		}
	}
</style>
