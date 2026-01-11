<script lang="ts">
	import type { HTMLFormAttributes } from 'svelte/elements';

	interface Props extends HTMLFormAttributes {
		children?: import('svelte').Snippet;
		gap?: string;
	}

	let {
		children,
		gap = 'var(--sm)',
		class: className = '',
		...rest
	}: Props = $props();
</script>

<form class={className} style="gap: {gap}" {...rest}>
	{@render children?.()}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
