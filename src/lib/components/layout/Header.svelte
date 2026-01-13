<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import Logo from '$lib/components/icons/Logo.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import HeaderProfile from '$lib/components/layout/HeaderProfile.svelte';

	interface Props {
		user?: any;
	}

	let { user }: Props = $props();
</script>

<header>
	<div class="logo-container">
		<Button href="/dashboard" variant="invisible" class="logo">
			<Logo height="var(--xl)" />
			<Div column gap="calc(var(--xxxs) * 0.85)">
				<strong>monsan.</strong>
				<h1>{m.app_name()}</h1>
			</Div>
		</Button>
	</div>

	<Div gap="var(--xs)">
		{#if user}
			<HeaderProfile {user} />
		{/if}
	</Div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: var(--z-header);
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		height: var(--header-height);
		padding: var(--xxs) var(--xs);
		border: none;
		border-bottom: solid 1px var(--border-color);
		background-color: var(--bg);
		box-shadow: var(--shadow-sm);
	}

	header :global(.logo) {
		gap: var(--xxxs);
		text-transform: none;
		letter-spacing: normal;
	}

	strong {
		padding-left: calc(var(--xxs) * 0.25);
		font-size: var(--xs);
		line-height: var(--xxs);
	}

	h1 {
		font-size: calc(var(--xxl) * 0.75);
		line-height: var(--md);
	}
</style>
