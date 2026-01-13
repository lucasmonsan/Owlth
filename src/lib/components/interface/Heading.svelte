<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;
	type Align = 'left' | 'center' | 'right';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: Level;
		align?: Align;
		children?: import('svelte').Snippet;
	}

	let { level = 1, align = 'left', class: className = '', children, ...rest }: Props = $props();

	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element this={tag} class="heading {className}" data-level={level} data-align={align} {...rest}>
	{@render children?.()}
</svelte:element>

<style>
	.heading {
		font-weight: 800;
		line-height: 1.2;
		margin: 0;
		color: inherit;
		transition: color var(--fast);
	}

	.heading[data-level='1'] {
		font-size: var(--xxxxl);
		line-height: var(--xxxxl);
	}
	.heading[data-level='2'] {
		font-size: var(--xxxl);
		line-height: var(--xxxl);
	}
	.heading[data-level='3'] {
		font-size: var(--xxl);
		line-height: var(--xxl);
	}
	.heading[data-level='4'] {
		font-size: var(--xl);
		line-height: var(--lg);
	}
	.heading[data-level='5'] {
		font-size: var(--lg);
	}
	.heading[data-level='6'] {
		font-size: var(--md);
		text-transform: uppercase;
		letter-spacing: 0.05em;
		font-weight: 700;
	}

	.heading[data-align='left'] {
		text-align: left;
	}
	.heading[data-align='center'] {
		text-align: center;
	}
	.heading[data-align='right'] {
		text-align: right;
	}
</style>
