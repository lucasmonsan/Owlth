<script lang="ts">
	import '$lib/styles/normalize.css';
	import '$lib/styles/palette.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/variables.css';

	import Header from '$lib/components/layout/Header.svelte';

	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import BG from '$lib/components/layout/BG.svelte';
	import Toast from '$lib/components/interface/Toast.svelte';
	import * as m from '$lib/paraglide/messages';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';

	let { children } = $props();

	$effect(() => {
		const currentPath = window.location.pathname;
		const expectedLocale = currentPath.startsWith('/pt-br') ? 'pt-br' : 'en';
		const actualLocale = getLocale();

		if (expectedLocale !== actualLocale) {
			setLocale(expectedLocale, { reload: false });
		}
	});
</script>

<svelte:head>
	{#if browser && env.PUBLIC_ANALYTICS_WEBSITE_ID}
		<script
			async
			src="{env.PUBLIC_ANALYTICS_URL}/script.js"
			data-website-id={env.PUBLIC_ANALYTICS_WEBSITE_ID}
		></script>
	{/if}

	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Owlth" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<!-- Skip Link para Acessibilidade -->
<a href="#main" class="skip-link">{m.skip_to_content()}</a>

<!-- <BG /> -->

<Header />

{@render children()}

<Toast />

<style>
	.skip-link {
		position: fixed;
		top: -100px;
		left: 0;
		background: var(--brand);
		color: white;
		padding: var(--xs) var(--sm);
		text-decoration: none;
		z-index: 1000;
		border-radius: 0 0 var(--radius-sm) 0;
		font-weight: 600;
	}

	.skip-link:focus {
		top: 0;
	}
</style>
