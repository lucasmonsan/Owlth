<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';

	import BrazilIcon from '$lib/components/icons/BrazilIcon.svelte';
	import UsaIcon from '$lib/components/icons/UsaIcon.svelte';

	const localeIcons = {
		'pt-br': BrazilIcon,
		en: UsaIcon
	} as const;
</script>

<nav aria-label="Language switcher" class="language-switcher">
	{#each locales as locale}
		{@const Icon = localeIcons[locale]}
		{@const targetUrl = localizeHref(page.url.pathname, { locale })}

		<a
			href={targetUrl}
			onclick={(e) => {
				e.preventDefault();
				window.location.replace(targetUrl);
			}}
			class="invisible"
			class:active={page.url.pathname.startsWith(`/${locale}`) ||
				(locale === 'en' && !page.url.pathname.startsWith('/pt-br'))}
			aria-label={locale === 'pt-br' ? 'Português' : 'English'}
			aria-current={page.url.pathname.startsWith(`/${locale}`) ? 'page' : undefined}
		>
			<Icon />
		</a>
	{/each}
</nav>

<style>
	nav {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: var(--xxs);
	}

	a {
		opacity: 0.25;
		transition: opacity var(--fast);

		&:hover {
			opacity: 0.5;
		}

		&.active {
			opacity: 1;
			pointer-events: none;
		}
	}
</style>
