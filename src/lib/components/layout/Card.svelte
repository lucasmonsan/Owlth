<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		variant?: 'default' | 'glass';
		padding?: string;
		children?: import('svelte').Snippet;
	}

	let { variant = 'glass', padding = 'var(--lg)', class: className = '', children, ...rest }: Props = $props();
</script>

<div class="card {variant} {className}" style:--padding={padding} {...rest}>
	{@render children?.()}
</div>

<style>
	.card {
		padding: var(--padding);
		border-radius: var(--radius-lg, 16px);
		display: flex;
		flex-direction: column;
		gap: var(--md);
		transition:
			transform var(--normal),
			border-color var(--normal);
		height: 100%;
	}

	.card.glass {
		background: rgba(255, 255, 255, 0.03);
		backdrop-filter: blur(10px);
		border: 1px solid rgba(255, 255, 255, 0.08);
	}

	.card.glass:hover {
		border-color: rgba(255, 255, 255, 0.15);
	}

	.card.default {
		background: var(--surface);
		border: 1px solid var(--border-color);
	}
</style>
