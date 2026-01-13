<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	interface Tab {
		id: string;
		label: string;
		icon?: any;
	}

	interface Props {
		tabs: Tab[];
		activeTab: string;
		onTabChange?: (id: string) => void;
	}

	let { tabs, activeTab, onTabChange }: Props = $props();

	function handleTabClick(id: string) {
		if (onTabChange) {
			onTabChange(id);
		} else {
			const url = new URL(page.url);
			url.searchParams.set('tab', id);
			goto(url, { keepFocus: true, noScroll: true });
		}
	}
</script>

<div class="tabs-container">
	<div class="tabs-list" role="tablist">
		{#each tabs as tab}
			<button class="tab-trigger" role="tab" aria-selected={activeTab === tab.id} onclick={() => handleTabClick(tab.id)}>
				{#if tab.icon}
					<tab.icon size="var(--md)" />
				{/if}
				<span>{tab.label}</span>
				{#if activeTab === tab.id}
					<div class="active-indicator" in:fade={{ duration: 200 }}></div>
				{/if}
			</button>
		{/each}
	</div>
</div>

<style>
	.tabs-container {
		width: 100%;
		margin-bottom: var(--md);
	}

	.tabs-list {
		display: flex;
		gap: var(--md);
		overflow-x: auto;
		scrollbar-width: none;
	}

	.tab-trigger {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--xs);
		padding: var(--sm) var(--xs);
		background: none;
		border: none;
		color: var(--text-muted, #888);
		font-weight: 500;
		cursor: pointer;
		transition: color 0.2s;
		white-space: nowrap;
	}

	.tab-trigger:hover {
		color: var(--text-primary, #fff);
	}

	.tab-trigger[aria-selected='true'] {
		color: var(--text-primary, #fff);
	}

	.active-indicator {
		position: absolute;
		bottom: -1px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--primary, #6366f1);
		border-radius: 2px 2px 0 0;
	}
</style>
