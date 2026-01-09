<script lang="ts">
	import type {
		HTMLButtonAttributes,
		HTMLAnchorAttributes
	} from 'svelte/elements';

	type Variant = 'primary' | 'outline' | 'invisible';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		fullWidth?: boolean;
		href?: string;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		fullWidth = false,
		href = undefined,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		class:outline={variant === 'outline'}
		class:invisible={variant === 'invisible'}
		class:w-100={fullWidth}
		class={className}
		{...rest as HTMLAnchorAttributes}
		role="button"
	>
		{@render children?.()}
	</a>
{:else}
	<button
		class:outline={variant === 'outline'}
		class:invisible={variant === 'invisible'}
		class:w-100={fullWidth}
		class={className}
		{...rest}
	>
		{@render children?.()}
	</button>
{/if}

<style>
	button,
	a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;

		padding: var(--sm) var(--xxs);
		border-radius: var(--radius);
		border: var(--border) var(--text-primary);
		transition: opacity var(--normal);
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 1px;

		color: var(--bg);
		fill: var(--bg);
		background-color: var(--text-primary);

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

		&:hover:not(:disabled) {
			opacity: 0.75;
		}

		&:focus:not(:disabled) {
			outline: var(--border) var(--text-primary);
			outline-offset: 2px;
		}

		&:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
	}
</style>
