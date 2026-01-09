<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type Variant = 'primary' | 'outline' | 'invisible';

	interface Props extends HTMLButtonAttributes {
		variant?: Variant;
		children?: import('svelte').Snippet;
	}

	let {
		variant = 'primary',
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<button
	class:outline={variant === 'outline'}
	class:invisible={variant === 'invisible'}
	class={className}
	{...rest}
>
	{@render children?.()}
</button>

<style>
	button {
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
