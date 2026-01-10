<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Level = 1 | 2 | 3 | 4 | 5 | 6;
	type Align = 'left' | 'center' | 'right';

	interface Props extends HTMLAttributes<HTMLHeadingElement> {
		level?: Level;
		align?: Align;
		children?: import('svelte').Snippet;
	}

	let {
		level = 1,
		align = 'left',
		class: className = '',
		children,
		...rest
	}: Props = $props();

	const tag = $derived(`h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6');
</script>

<svelte:element
	this={tag}
	class="heading {className}"
	data-align={align}
	{...rest}
>
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
