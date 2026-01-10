<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'content' | 'full';

	interface Props extends HTMLAttributes<HTMLElement> {
		children?: import('svelte').Snippet;
		center?: boolean;
		fullWidth?: boolean;
		maxWidth?: MaxWidth;
	}

	let {
		children,
		center = false,
		fullWidth = false,
		maxWidth = undefined,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<main
	class:center
	class:w-100={fullWidth}
	class={className}
	data-max-width={maxWidth}
	{...rest}
	in:fade={{ delay: 400 }}
	out:fade
>
	{@render children?.()}
</main>

<style>
	main {
		z-index: var(--z-page);
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: var(--md);

		&.w-100 {
			width: 100%;
		}
		&.center {
			justify-content: center;
		}

		/* Max Width */
		&[data-max-width='xs'] {
			max-width: var(--max-width-xs);
		}
		&[data-max-width='sm'] {
			max-width: var(--max-width-sm);
		}
		&[data-max-width='md'] {
			max-width: var(--max-width-md);
		}
		&[data-max-width='lg'] {
			max-width: var(--max-width-lg);
		}
		&[data-max-width='xl'] {
			max-width: var(--max-width-xl);
		}
		&[data-max-width='content'] {
			max-width: var(--max-width-content);
		}
		&[data-max-width='full'] {
			max-width: 100%;
		}
	}
</style>
