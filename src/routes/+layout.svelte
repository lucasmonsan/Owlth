<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	import favicon from '$lib/assets/favicon.svg';

	import '$lib/styles/normalize.css';
	import '$lib/styles/palette.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/variables.css';
	import Nebula from '$lib/components/Nebula.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
</svelte:head>

<Nebula />

<LanguageSwitcher />

{@render children()}
