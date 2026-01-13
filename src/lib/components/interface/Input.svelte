<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { slide } from 'svelte/transition';

	interface Props extends HTMLInputAttributes {
		value?: string | number | string[] | null;
		error?: string;
		success?: string;
		hint?: string;
		oninvalid?: (e: Event & { currentTarget: HTMLInputElement }) => void;
		oninput?: (e: Event & { currentTarget: HTMLInputElement }) => void;
		children?: import('svelte').Snippet;
	}

	let { value = $bindable(), error, success, hint, id, required = false, disabled = false, oninvalid, oninput, children, class: className = '', ...rest }: Props = $props();

	const inputId = $derived(id || `input-${Math.random().toString(36).slice(2, 11)}`);
	const hasError = $derived(!!error);
	const hasSuccess = $derived(!!success);
</script>

<div class="input-wrapper {className}">
	<!-- Label invisível para screen readers -->
	<label for={inputId} class="sr-only">
		{rest.placeholder || 'Input'}
		{#if required}
			<span aria-label="obrigatório">*</span>
		{/if}
	</label>

	<div class="input-container" class:error={hasError} class:success={hasSuccess} class:disabled>
		{#if children}
			<span class="input-icon" aria-hidden="true">
				{@render children()}
			</span>
		{/if}

		<input bind:value {...rest} id={inputId} {required} {disabled} {oninvalid} {oninput} aria-invalid={hasError} aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined} />

		{#if required}
			<span class="required-indicator" aria-hidden="true">*</span>
		{/if}
	</div>

	{#if error}
		<p id="{inputId}-error" class="input-message error" role="alert" transition:slide={{ duration: 200 }}>
			{error}
		</p>
	{:else if success}
		<p class="input-message success" transition:slide={{ duration: 200 }}>
			{success}
		</p>
	{:else if hint}
		<p id="{inputId}-hint" class="input-message hint">
			{hint}
		</p>
	{/if}
</div>

<style>
	.input-wrapper {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	/* Label invisível apenas para screen readers */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border-width: 0;
	}

	.input-container {
		position: relative;
		display: flex;
		align-items: center;
		width: 100%;
		gap: var(--xxs);
		padding: var(--xxxs) 0;
		cursor: text;

		border-bottom: solid 2px transparent;
		transition: border-color var(--normal);
	}

	.input-container.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.input-container:focus-within:not(.disabled) {
		border-bottom-color: var(--text-primary);
	}

	.input-container.error {
		border-bottom-color: var(--error);
	}

	.input-container.success {
		border-bottom-color: var(--success);
	}

	.input-icon {
		display: flex;
		align-items: center;
		color: var(--text-secondary);
		fill: var(--text-secondary);
		transition:
			color var(--normal),
			fill var(--normal);
	}

	.input-container:focus-within .input-icon {
		color: var(--text-primary);
		fill: var(--text-primary);
	}

	input {
		flex: 1;
		height: var(--lg);
		padding-top: calc(var(--xxxs) * 0.5);
		font-size: calc(var(--sm) * 1.125);

		border: none;
		outline: none;
		background: transparent;
		color: var(--text-primary);
	}

	input:disabled {
		cursor: not-allowed;
	}

	/* Asterisco flutuante no canto */
	.required-indicator {
		position: absolute;
		top: 0;
		right: 0;
		font-size: var(--xs);
		color: var(--error);
		font-weight: 700;
		pointer-events: none;
	}

	.input-message {
		font-size: var(--xs);
		margin: var(--xxxs) 0 0 0;
		line-height: 1.4;
	}

	.input-message.error {
		color: var(--error);
	}

	.input-message.success {
		color: var(--success);
	}

	.input-message.hint {
		color: var(--text-secondary);
	}
</style>
