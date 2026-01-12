<script lang="ts">
	import type { PageData } from './$types';
	import Main from '$lib/components/layout/Main.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Avatar from '$lib/components/interface/Avatar.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import AppCard from '$lib/components/interface/AppCard.svelte';
	import * as m from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores/toast.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let { data }: { data: PageData } = $props();

	// Usar $derived para reatividade
	const myApps = $derived(data.apps.filter((app) => app.isUsed));
	const otherApps = $derived(data.apps.filter((app) => !app.isUsed));

	// Verificar se há foto do Google pendente de sincronização
	onMount(() => {
		if (!browser) return;

		const pendingPicture = document.cookie
			.split('; ')
			.find((row) => row.startsWith('pending_picture_sync='))
			?.split('=')[1];

		if (pendingPicture) {
			addToast({
				message: '📸 Sua foto do Google mudou',
				variant: 'info',
				persistent: true,
				actions: [
					{
						label: 'Atualizar',
						variant: 'primary',
						onClick: async () => {
							await fetch('/api/user/sync-picture', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									pictureUrl: decodeURIComponent(pendingPicture)
								})
							});
							window.location.reload();
						}
					},
					{
						label: 'Agora não',
						variant: 'secondary',
						onClick: () => {
							// Remove cookie
							document.cookie = 'pending_picture_sync=; path=/; max-age=0';
						}
					}
				]
			});
		}
	});
</script>

<SEO title={m.dashboard_title()} description={m.seo_dashboard_description()} />

<Main fullWidth maxWidth="xl">
	<Div column gap="var(--xl)" fullWidth>
		<!-- User Info -->
		<Div justify="between" align="center" fullWidth>
			<Div gap="var(--sm)" align="center">
				<Avatar size="lg" alt={data.user?.fullName || 'User'} />
				<Div column gap="var(--xxxs)">
					<Heading level={2}>{data.user?.fullName}</Heading>
					<Text size="sm" color="muted">{data.user?.email}</Text>
				</Div>
			</Div>
			<form method="POST" action="/?/logout">
				<Button variant="outline" type="submit">{m.logout()}</Button>
			</form>
		</Div>

		<!-- My Apps -->
		{#if myApps.length > 0}
			<section>
				<Heading level={3}>{m.my_apps()}</Heading>
				<div class="app-grid">
					{#each myApps as app}
						<AppCard
							{...app}
							description={app.description ?? undefined}
							icon={app.icon ?? undefined}
						/>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Other Apps -->
		{#if otherApps.length > 0}
			<section>
				<Heading level={3}>{m.other_apps()}</Heading>
				<div class="app-grid">
					{#each otherApps as app}
						<AppCard
							{...app}
							description={app.description ?? undefined}
							icon={app.icon ?? undefined}
						/>
					{/each}
				</div>
			</section>
		{/if}

		<!-- Profile Section -->
		<section>
			<Heading level={3}>{m.profile()}</Heading>
			<Text color="muted">Profile editing coming soon...</Text>
		</section>

		<!-- Login History -->
		<section>
			<Heading level={3}>{m.login_history()}</Heading>
			<Text color="muted">Login history coming soon...</Text>
		</section>
	</Div>
</Main>

<style>
	.app-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: var(--md);
		margin-top: var(--md);
	}

	section {
		display: flex;
		flex-direction: column;
		gap: var(--sm);
	}
</style>
