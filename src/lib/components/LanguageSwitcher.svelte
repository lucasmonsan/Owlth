<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
</script>

<div class="language-switcher">
	{#each locales as locale}
		<a
			href={localizeHref(page.url.pathname, { locale })}
			class:active={page.url.pathname.startsWith(`/${locale}`) ||
				(locale === 'en' && !page.url.pathname.startsWith('/pt-br'))}
			data-sveltekit-reload
		>
			{locale.toUpperCase()}
		</a>
	{/each}
</div>

<style>
	.language-switcher {
		position: fixed;
		top: 1rem;
		left: 1rem;
		display: flex;
		gap: 1rem;
		font-size: 0.8rem;
		justify-content: center;
	}
	a {
		text-decoration: none;
		color: #999;
		font-weight: bold;
		padding: 0.25rem 0.5rem;
	}
	a:hover {
		color: #333;
	}
	a.active {
		color: #000;
		text-decoration: underline;
		pointer-events: none;
	}
</style>
