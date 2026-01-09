<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		value?: string | number | string[] | null;
		children?: import('svelte').Snippet;
	}

	let {
		value = $bindable(),
		children,
		class: className = '',
		...rest
	}: Props = $props();
</script>

<label class={className}>
	{@render children?.()}
	<input bind:value {...rest} />
</label>

<style>
	label {
		display: flex;
		align-items: center;
		width: 100%;
		gap: var(--xxxs);
		padding: var(--xxxs) 0;
		cursor: text;
	}

	input {
		flex: 1;
		height: var(--lg);
		padding-top: calc(var(--xxxs) * 0.5);
		font-size: calc(var(--sm) * 1.125);
	}
</style>
