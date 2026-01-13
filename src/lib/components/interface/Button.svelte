<script lang="ts">
	import type { HTMLButtonAttributes, HTMLAnchorAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLButtonAttributes {
		variant?: 'primary' | 'outline' | 'invisible';
		size?: 'xs' | 'sm' | 'md' | 'lg';
		fullWidth?: boolean;
		loading?: boolean;
		href?: string;
		children: Snippet;
	}

	let { variant = 'primary', size = 'md', fullWidth = false, loading = false, href, children, class: className = '', disabled = false, onclick, ...rest }: Props = $props();

	const handleKeydown = (e: KeyboardEvent) => {
		if (href && e.key === ' ') {
			e.preventDefault();
			if (!disabled && !loading) {
				(e.target as HTMLElement).click();
			}
		}
	};
</script>

{#if href}
	<a
		{href}
		class:outline={variant === 'outline'}
		class:invisible={variant === 'invisible'}
		class:w-100={fullWidth}
		class:loading
		class={className}
		data-size={size}
		{...rest as HTMLAnchorAttributes}
		role="button"
		tabindex={disabled || loading ? -1 : 0}
		aria-disabled={disabled || loading}
		onkeydown={handleKeydown}
	>
		{@render children?.()}
	</a>
{:else}
	<button class:outline={variant === 'outline'} class:invisible={variant === 'invisible'} class:w-100={fullWidth} class:loading class={className} data-size={size} disabled={disabled || loading} {onclick} {...rest}>
		{@render children?.()}
	</button>
{/if}

<style>
	button,
	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: var(--xxs);
		cursor: pointer;

		padding: var(--xs) var(--md);
		border-radius: var(--radius);
		border: var(--border) var(--text-primary);
		transition:
			opacity var(--normal),
			transform var(--fast);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;
		font-size: var(--sm);

		color: var(--bg);
		fill: var(--bg);
		background-color: var(--text-primary);

		&[data-size='xs'] {
			padding: var(--xxxs) var(--xs);
			font-size: var(--xs);
		}

		&[data-size='sm'] {
			padding: var(--xxs) var(--sm);
			font-size: var(--sm);
		}

		&[data-size='md'] {
			padding: var(--xs) var(--md);
			font-size: var(--sm);
		}

		&[data-size='lg'] {
			padding: var(--sm) var(--lg);
			font-size: var(--md);
		}

		&.w-100 {
			width: 100%;
		}

		&.outline {
			color: var(--text-primary);
			fill: var(--text-primary);
			background-color: var(--bg);
		}

		&.invisible {
			padding: 0;
			color: var(--text-primary);
			fill: var(--text-primary);
			background-color: transparent;
			border: none;
		}

		&:hover:not(:disabled):not(.loading) {
			opacity: 0.75;
		}

		&:active:not(:disabled):not(.loading) {
			transform: scale(0.98);
		}

		&:focus-visible {
			outline: var(--border) var(--text-primary);
			outline-offset: 2px;
		}

		&:disabled,
		&[aria-disabled='true'],
		&.loading {
			opacity: 0.5;
			cursor: not-allowed;
		}

		&.loading {
			position: relative;
			color: transparent;
			fill: transparent;
		}

		&.loading::after {
			content: '';
			position: absolute;
			width: var(--md);
			height: var(--md);
			border: 2px solid var(--bg);
			border-top-color: transparent;
			border-radius: 50%;
			animation: spin 0.6s linear infinite;
		}

		&.loading.outline::after {
			border-color: var(--text-primary);
			border-top-color: transparent;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
