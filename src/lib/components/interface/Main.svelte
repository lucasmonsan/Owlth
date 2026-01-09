<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLElement> {
		children?: import('svelte').Snippet;
		center?: boolean; // Ativa a classe .center (justify-content: center)
		fullWidth?: boolean; // Ativa a classe .w-100 (width: 100%)
	}

	let {
		children,
		center = false,
		fullWidth = false,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<main class:center class:w-100={fullWidth} class={className} {...rest}>
	{@render children?.()}
</main>

<style>
	main {
		z-index: var(--z-page);
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
	}
</style>
