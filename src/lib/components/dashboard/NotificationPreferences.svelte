<script lang="ts">
	import Div from '$lib/components/layout/Div.svelte';
	import Form from '$lib/components/layout/Form.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import { addToast } from '$lib/stores/toast.svelte';
	import { onMount } from 'svelte';
	import * as m from '$lib/paraglide/messages';

	let preferences = $state({
		emailSecurity: true,
		emailLogin: true,
		emailApps: true
	});
	let isLoading = $state(true);
	let isSubmitting = $state(false);

	onMount(async () => {
		try {
			const response = await fetch('/api/user/preferences');
			const data = await response.json();
			preferences = data.preferences;
		} catch (error) {
			console.error('Failed to fetch preferences', error);
		} finally {
			isLoading = false;
		}
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			const response = await fetch('/api/user/preferences', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(preferences)
			});

			if (response.ok) {
				addToast({
					message: m.preferences_updated(),
					variant: 'success',
					duration: 3000
				});
			} else {
				throw new Error('Failed to update preferences');
			}
		} catch (error) {
			addToast({
				message: m.preferences_update_failed(),
				variant: 'error',
				duration: 3000
			});
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Div column gap="var(--md)">
	<Heading level={3}>{m.notification_preferences()}</Heading>

	{#if isLoading}
		<Text>{m.loading()}</Text>
	{:else}
		<Form onsubmit={handleSubmit}>
			<Div column gap="var(--sm)">
				<label style="display: flex; align-items: center; gap: var(--sm);">
					<input type="checkbox" bind:checked={preferences.emailSecurity} />
					<Div column gap="var(--xxxs)">
						<Text weight="medium">{m.security_alerts()}</Text>
						<Text size="sm" color="muted">
							{m.security_alerts_desc()}
						</Text>
					</Div>
				</label>

				<label style="display: flex; align-items: center; gap: var(--sm);">
					<input type="checkbox" bind:checked={preferences.emailLogin} />
					<Div column gap="var(--xxxs)">
						<Text weight="medium">{m.new_login_notifications()}</Text>
						<Text size="sm" color="muted">
							{m.new_login_desc()}
						</Text>
					</Div>
				</label>

				<label style="display: flex; align-items: center; gap: var(--sm);">
					<input type="checkbox" bind:checked={preferences.emailApps} />
					<Div column gap="var(--xxxs)">
						<Text weight="medium">{m.app_notifications()}</Text>
						<Text size="sm" color="muted">{m.app_notifications_desc()}</Text>
					</Div>
				</label>
			</Div>

			<Button type="submit" loading={isSubmitting}
				>{m.save_preferences()}</Button
			>
		</Form>
	{/if}
</Div>
