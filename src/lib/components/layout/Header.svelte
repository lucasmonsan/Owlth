<script>
	import * as m from '$lib/paraglide/messages';
	import Logo from '$lib/components/icons/Logo.svelte';
	import LanguageSwitcher from '$lib/components/interface/LanguageSwitcher.svelte';
	import Button from '$lib/components/interface/Button.svelte';
</script>

<header>
	<Button variant="invisible" class="logo">
		<Logo height="var(--xl)" />
		<div>
			<strong>monsan.</strong>
			<h1>{m.app_name()}</h1>
		</div>
	</Button>
	<LanguageSwitcher />
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
		padding: var(--xxs) var(--xs);
		border: none;
		border-bottom: solid 1px var(--border-color);
	}

	header :global(.logo) {
		gap: var(--xxxs);
		text-transform: none;
		letter-spacing: normal;
	}

	div {
		flex-direction: column;
		align-items: flex-start;
		gap: calc(var(--xxxs) * 0.85);
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
