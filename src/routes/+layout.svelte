<script lang="ts">
	import '$lib/styles/normalize.css';
	import '$lib/styles/palette.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/variables.css';

	import Header from '$lib/components/layout/Header.svelte';

	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import BG from '$lib/components/layout/BG.svelte';
	import Toast from '$lib/components/interface/Toast.svelte';

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
	<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
	<link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
	<link rel="shortcut icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<meta name="apple-mobile-web-app-title" content="Owlth" />
	<link rel="manifest" href="/site.webmanifest" />
</svelte:head>

<BG />

<Header />

{@render children()}

<Toast />
