<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	type MaxWidth = 'content' | 'full';

	interface Props extends HTMLAttributes<HTMLElement> {
		children?: import('svelte').Snippet;
		center?: boolean;
		fullWidth?: boolean;
		maxWidth?: MaxWidth;
	}

	let { children, center = false, fullWidth = false, maxWidth = undefined, class: className = '', ...rest }: Props = $props();
</script>

<main id="main" class:center class:w-100={fullWidth} class={className} data-max-width={maxWidth} {...rest} in:fade={{ delay: 400 }} out:fade>
	{@render children?.()}
</main>

<style>
	main {
		z-index: var(--z-page);
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 100dvh;
		padding: calc(var(--header-height) + var(--xxs)) var(--md);
		overflow-y: auto;
		overflow-x: hidden;

		&.w-100 {
			width: 100%;
		}
		&.center {
			align-items: center; /* Apenas alinha horizontalmente ao centro */
		}

		/* Max Width */
		&[data-max-width='content'] {
			max-width: var(--max-width-content);
		}
		&[data-max-width='full'] {
			max-width: 100%;
		}
	}
</style>
