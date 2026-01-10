<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Size =
		| 'xxxs'
		| 'xxs'
		| 'xs'
		| 'sm'
		| 'md'
		| 'lg'
		| 'xl'
		| 'xxl'
		| 'xxxl';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		size?: Size;
		horizontal?: boolean;
	}

	let {
		size = 'md',
		horizontal = false,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<div
	class="space {className}"
	class:horizontal
	data-size={size}
	{...rest}
></div>

<style>
	.space {
		flex-shrink: 0;
	}

	/* Vertical (padrão) */
	.space[data-size='xxxs'] {
		height: var(--xxxs);
	}
	.space[data-size='xxs'] {
		height: var(--xxs);
	}
	.space[data-size='xs'] {
		height: var(--xs);
	}
	.space[data-size='sm'] {
		height: var(--sm);
	}
	.space[data-size='md'] {
		height: var(--md);
	}
	.space[data-size='lg'] {
		height: var(--lg);
	}
	.space[data-size='xl'] {
		height: var(--xl);
	}
	.space[data-size='xxl'] {
		height: var(--xxl);
	}
	.space[data-size='xxxl'] {
		height: var(--xxxl);
	}

	/* Horizontal */
	.space.horizontal[data-size='xxxs'] {
		width: var(--xxxs);
		height: auto;
	}
	.space.horizontal[data-size='xxs'] {
		width: var(--xxs);
		height: auto;
	}
	.space.horizontal[data-size='xs'] {
		width: var(--xs);
		height: auto;
	}
	.space.horizontal[data-size='sm'] {
		width: var(--sm);
		height: auto;
	}
	.space.horizontal[data-size='md'] {
		width: var(--md);
		height: auto;
	}
	.space.horizontal[data-size='lg'] {
		width: var(--lg);
		height: auto;
	}
	.space.horizontal[data-size='xl'] {
		width: var(--xl);
		height: auto;
	}
	.space.horizontal[data-size='xxl'] {
		width: var(--xxl);
		height: auto;
	}
	.space.horizontal[data-size='xxxl'] {
		width: var(--xxxl);
		height: auto;
	}
</style>
