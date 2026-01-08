<script lang="ts">
	import '$lib/styles/normalize.css';
	import '$lib/styles/palette.css';
	import '$lib/styles/typography.css';
	import '$lib/styles/variables.css';
	import '$lib/styles/tags.css';

	import favicon from '$lib/assets/favicon.svg';

	import Header from '$lib/components/layout/Header.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/svg+xml" href={favicon} />
</svelte:head>

<Header />

{@render children()}
