<script lang="ts">
	import { theme } from '$lib/stores/theme';
	import { onMount } from 'svelte';

	let currentTheme = $state<'light' | 'dark'>('light');

	onMount(() => {
		theme.init();
		theme.subscribe((value) => {
			currentTheme = value;
		});
	});

	function toggleTheme() {
		theme.toggle();
	}
</script>

<button onclick={toggleTheme} class="theme-toggle" aria-label="Toggle theme">
	{#if currentTheme === 'light'}
		🌙
	{:else}
		☀️
	{/if}
</button>

<style>
	.theme-toggle {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border: none;
		background: transparent;
		font-size: var(--xl);
		cursor: pointer;
		border-radius: var(--radius-sm);
		transition: all var(--fast);
	}

	.theme-toggle:hover {
		background: var(--hover);
	}
</style>
