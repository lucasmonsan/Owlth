<script lang="ts">
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	let history = $state<any[]>([]);
	let isLoading = $state(true);

	onMount(async () => {
		try {
			const response = await fetch('/api/user/login-history');
			const data = await response.json();
			history = data.history;
		} catch (error) {
			console.error('Failed to fetch login history', error);
		} finally {
			isLoading = false;
		}
	});

	function formatDate(date: string) {
		return new Date(date).toLocaleString();
	}

	function getRiskColor(risk: string | null) {
		if (!risk) return 'muted';
		if (risk === 'high') return 'error';
		if (risk === 'medium') return 'warning';
		return 'success';
	}

	function getRiskLabel(risk: string | null) {
		if (!risk) return '';
		if (risk === 'high') return m.risk_high();
		if (risk === 'medium') return m.risk_medium();
		return m.risk_low();
	}
</script>

<Div column gap="var(--md)">
	<Heading level={3}>{m.login_history()}</Heading>

	{#if isLoading}
		<Text>{m.loading()}</Text>
	{:else if history.length === 0}
		<Text color="muted">{m.no_login_history()}</Text>
	{:else}
		<Div column gap="var(--sm)">
			{#each history as login}
				<Div
					column
					gap="var(--xxs)"
					style="padding: var(--sm); border: var(--border) var(--border-color); border-radius: var(--radius);"
				>
					<Div justify="between" align="center">
						<Text weight="medium">
							{login.device || m.unknown_device()} • {login.browser ||
								m.unknown_browser()}
						</Text>
						{#if login.riskLevel}
							<Text size="sm" color={getRiskColor(login.riskLevel)}>
								{getRiskLabel(login.riskLevel)}
							</Text>
						{/if}
					</Div>
					<Text size="sm" color="muted">
						{login.ip} • {login.os || m.unknown_os()}
					</Text>
					<Text size="sm" color="muted">
						{formatDate(login.createdAt)}
					</Text>
				</Div>
			{/each}
		</Div>
	{/if}
</Div>
