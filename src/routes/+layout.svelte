<script lang="ts">
	import LanguageSwitcher from '$lib/components/LanguageSwitcher.svelte';

	import favicon from '$lib/assets/favicon.svg';

	import '$lib/styles/normalize.css';
	import '$lib/styles/palette.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/variables.css';
	import '$lib/styles/tags.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
</svelte:head>

<LanguageSwitcher />

{@render children()}
