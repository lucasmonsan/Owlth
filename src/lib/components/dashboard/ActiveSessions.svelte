<script lang="ts">
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import { addToast } from '$lib/stores/toast.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	let sessions = $state<any[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		await fetchSessions();
	});

	async function fetchSessions() {
		try {
			const response = await fetch('/api/user/sessions');
			const data = await response.json();
			sessions = data.sessions;
		} catch (error) {
			console.error('Failed to fetch sessions', error);
		} finally {
			isLoading = false;
		}
	}

	async function revokeSession(sessionId: string) {
		try {
			const response = await fetch('/api/user/sessions', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ sessionId })
			});

			if (response.ok) {
				await fetchSessions();
				addToast({
					message: m.session_revoked(),
					variant: 'success',
					duration: 3000
				});
			}
		} catch (error) {
			addToast({
				message: m.session_revoke_failed(),
				variant: 'error',
				duration: 3000
			});
		}
	}

	function formatRelative(date: Date) {
		const now = new Date();
		const diff = now.getTime() - new Date(date).getTime();
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) return m.days_ago({ days: days.toString() });
		if (hours > 0) return m.hours_ago({ hours: hours.toString() });
		if (minutes > 0) return m.minutes_ago({ minutes: minutes.toString() });
		return m.just_now();
	}
</script>

<Div column gap="var(--md)">
	<Heading level={3}>{m.active_sessions()}</Heading>

	{#if isLoading}
		<Text>{m.loading()}</Text>
	{:else if sessions.length === 0}
		<Text color="muted">{m.no_active_sessions()}</Text>
	{:else}
		<Div column gap="var(--sm)">
			{#each sessions as session}
				<Div
					justify="between"
					align="center"
					style="padding: var(--sm); border: var(--border) var(--border-color); border-radius: var(--radius);"
				>
					<Div column gap="var(--xxs)">
						<Text weight="medium">
							{session.device || m.unknown_device()} • {session.browser ||
								m.unknown_browser()}
						</Text>
						<Text size="sm" color="muted">
							{session.ipAddress || m.unknown_ip()}
						</Text>
						<Text size="sm" color="muted">
							{m.last_active()}: {formatRelative(session.lastActivityAt)}
						</Text>
					</Div>

					{#if session.isCurrent}
						<Text size="sm" color="success" weight="medium"
							>{m.current_session()}</Text
						>
					{:else}
						<Button
							variant="outline"
							size="sm"
							onclick={() => revokeSession(session.id)}
						>
							{m.logout_device()}
						</Button>
					{/if}
				</Div>
			{/each}
		</Div>
	{/if}
</Div>
