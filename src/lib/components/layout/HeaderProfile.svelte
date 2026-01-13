<script lang="ts">
	import Avatar from '$lib/components/interface/Avatar.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import ThemeToggle from '$lib/components/interface/ThemeToggle.svelte';
	import LanguageSwitcher from '$lib/components/interface/LanguageSwitcher.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import * as m from '$lib/paraglide/messages';
	import { fade, slide } from 'svelte/transition';

	interface Props {
		user: any;
	}

	let { user }: Props = $props();
	let isOpen = $state(false);
	let dropdownRef: HTMLElement;

	function toggle() {
		isOpen = !isOpen;
	}

	function close(e: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(e.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={close} />

<div class="profile-dropdown" bind:this={dropdownRef}>
	<button class="trigger" onclick={toggle} aria-expanded={isOpen} aria-label="Menu de perfil">
		<Avatar src={user?.profilePicture} alt={user?.fullName} size="sm" />
	</button>

	{#if isOpen}
		<div class="dropdown-menu" transition:slide={{ duration: 200, axis: 'y' }}>
			<div class="user-summary">
				<Text size="sm" weight="bold">{user?.fullName}</Text>
				<Text size="xs" color="muted" class="truncate">{user?.email}</Text>
			</div>

			<div class="divider"></div>

			<div class="menu-item">
				<span class="label">Tema</span>
				<ThemeToggle />
			</div>

			<div class="menu-item">
				<span class="label">Idioma</span>
				<LanguageSwitcher />
			</div>

			<div class="divider"></div>

			<form method="POST" action="/?/logout">
				<Button fullWidth variant="invisible" size="sm" type="submit" class="logout-btn">
					{m.logout()}
				</Button>
			</form>
		</div>
	{/if}
</div>

<style>
	.profile-dropdown {
		position: relative;
	}

	.trigger {
		background: none;
		border: 2px solid transparent;
		border-radius: 50%;
		padding: 2px;
		cursor: pointer;
		transition: border-color 0.2s;
	}

	.trigger:hover,
	.trigger[aria-expanded='true'] {
		border-color: var(--primary, #6366f1);
	}

	.dropdown-menu {
		position: absolute;
		top: calc(100% + 10px);
		right: 0;
		width: 240px;
		background: var(--bg-surface, #1e1e2e);
		border: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
		border-radius: var(--radius-md, 8px);
		box-shadow: var(--shadow-lg);
		padding: var(--sm);
		z-index: 100;
		overflow: hidden;
	}

	.user-summary {
		padding: var(--xs) var(--sm);
		display: flex;
		flex-direction: column;
		gap: 2px;
	}

	.divider {
		height: 1px;
		background: var(--border-color, rgba(255, 255, 255, 0.1));
		margin: var(--sm) 0;
	}

	.menu-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--xs) var(--sm);
		border-radius: var(--radius-sm);
	}

	.menu-item:hover {
		background: rgba(255, 255, 255, 0.05);
	}

	.label {
		font-size: var(--font-sm, 0.875rem);
		color: var(--text-muted);
	}

	:global(.logout-btn) {
		color: var(--error, #ef4444) !important;
		justify-content: center;
	}

	:global(.logout-btn:hover) {
		background: rgba(239, 68, 68, 0.1);
	}
</style>
