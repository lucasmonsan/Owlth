<script lang="ts">
	interface Props {
		title: string;
		description: string;
		canonical?: string;
		ogImage?: string;
	}

	let {
		title,
		description,
		canonical,
		ogImage = '/og-image.png'
	}: Props = $props();

	const fullTitle = `${title} | Owlth`;
	const url =
		canonical || (typeof window !== 'undefined' ? window.location.href : '');
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />

	<!-- Open Graph -->
	<meta property="og:title" content={fullTitle} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<meta property="og:image" content={ogImage} />

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={fullTitle} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	<!-- Canonical -->
	{#if canonical}
		<link rel="canonical" href={canonical} />
	{/if}
</svelte:head>
