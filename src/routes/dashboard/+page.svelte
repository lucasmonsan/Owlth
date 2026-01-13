<script lang="ts">
	import type { PageData } from './$types';
	import Main from '$lib/components/layout/Main.svelte';
	import Grid from '$lib/components/layout/Grid.svelte';
	import Card from '$lib/components/layout/Card.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import AppCard from '$lib/components/interface/AppCard.svelte';
	import ProfileEditForm from '$lib/components/dashboard/ProfileEditForm.svelte';
	import LoginHistory from '$lib/components/dashboard/LoginHistory.svelte';
	import ActiveSessions from '$lib/components/dashboard/ActiveSessions.svelte';
	import NotificationPreferences from '$lib/components/dashboard/NotificationPreferences.svelte';
	import Tabs from '$lib/components/interface/Tabs.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import * as m from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores/toast.svelte';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { page } from '$app/state';
	import { fade } from 'svelte/transition';

	import AppsIcon from '$lib/components/icons/AppsIcon.svelte';
	import SecurityIcon from '$lib/components/icons/SecurityIcon.svelte';
	import SettingsIcon from '$lib/components/icons/SettingsIcon.svelte';

	let { data }: { data: PageData } = $props();

	// Usar $derived para reatividade
	const myApps = $derived(data.apps.filter((app) => app.isUsed));
	const otherApps = $derived(data.apps.filter((app) => !app.isUsed));

	// Tabs Configuration
	const tabs = [
		{ id: 'apps', label: m.apps(), icon: AppsIcon },
		{ id: 'security', label: m.security(), icon: SecurityIcon },
		{ id: 'settings', label: m.settings(), icon: SettingsIcon }
	];

	let activeTab = $state('apps');

	// Sync tab with URL param
	$effect(() => {
		const tabParam = page.url.searchParams.get('tab');
		if (tabParam && tabs.some((t) => t.id === tabParam)) {
			activeTab = tabParam;
		}
	});

	function handleTabChange(id: string) {
		activeTab = id;
		const url = new URL(window.location.href);
		url.searchParams.set('tab', id);
		window.history.replaceState({}, '', url);
	}

	onMount(() => {
		if (!browser) return;

		const pendingPicture = document.cookie
			.split('; ')
			.find((row) => row.startsWith('pending_picture_sync='))
			?.split('=')[1];

		if (pendingPicture) {
			addToast({
				message: m.google_picture_changed(),
				variant: 'info',
				persistent: true,
				actions: [
					{
						label: m.update_picture(),
						variant: 'primary',
						onClick: async () => {
							const response = await fetch('/api/user/sync-picture', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({
									pictureUrl: decodeURIComponent(pendingPicture)
								})
							});

							if (response.ok) {
								await invalidateAll();
							}
						}
					},
					{
						label: m.not_now(),
						variant: 'secondary',
						onClick: () => {
							document.cookie = 'pending_picture_sync=; path=/; max-age=0';
						}
					}
				]
			});
		}
	});
</script>

<SEO title={m.dashboard_title()} description={m.seo_dashboard_description()} />

<Main fullWidth>
	<!-- Padding bottom e margin são passados inline para evitar style global, conforme regra -->
	<Tabs {tabs} {activeTab} onTabChange={handleTabChange} />

	<Div fullWidth>
		{#if activeTab === 'apps'}
			<div in:fade={{ duration: 300 }} style="width: 100%">
				<Div column gap="var(--xl)" fullWidth>
					<!-- My Apps -->
					<section>
						{#if myApps.length > 0}
							<Grid minItemWidth="200px" gap="var(--md)">
								{#each myApps as app}
									<AppCard {...app} description={app.description ?? undefined} icon={app.icon ?? undefined} />
								{/each}
							</Grid>
						{:else}
							<Div fullWidth center style="height: 150px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: var(--radius-md);">
								<Text color="muted" align="center">
									{m.empty_apps()}
								</Text>
							</Div>
						{/if}
					</section>

					<!-- Other Apps -->
					{#if otherApps.length > 0}
						<section style="margin-top: var(--lg)">
							<Heading level={3}>{m.other_apps()}</Heading>
							<div style="margin-top: var(--sm)">
								<Grid minItemWidth="200px" gap="var(--md)">
									{#each otherApps as app}
										<AppCard {...app} description={undefined} icon={app.icon ?? undefined} />
									{/each}
								</Grid>
							</div>
						</section>
					{/if}
				</Div>
			</div>
		{:else if activeTab === 'security'}
			<div in:fade={{ duration: 300 }} style="width: 100%">
				<!-- Grid responsivo paraSecurity: min 400px garante 2 cols em desktop/tablet large, 1 em mobile -->
				<Grid minItemWidth="400px" gap="var(--md)">
					<Card>
						<ActiveSessions />
					</Card>
					<Card>
						<LoginHistory />
					</Card>
				</Grid>
			</div>
		{:else if activeTab === 'settings'}
			<div in:fade={{ duration: 300 }} style="width: 100%">
				<Grid minItemWidth="400px" gap="var(--md)">
					<Card>
						<ProfileEditForm user={data.user} />
					</Card>
					<Card>
						<NotificationPreferences />
					</Card>
				</Grid>
			</div>
		{/if}
	</Div>
</Main>
