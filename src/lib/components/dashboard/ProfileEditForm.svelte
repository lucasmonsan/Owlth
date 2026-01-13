<script lang="ts">
	import Div from '$lib/components/layout/Div.svelte';
	import Form from '$lib/components/layout/Form.svelte';
	import Input from '$lib/components/interface/Input.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import ProfileIcon from '$lib/components/icons/ProfileIcon.svelte';
	import { addToast } from '$lib/stores/toast.svelte';
	import { invalidateAll } from '$app/navigation';
	import * as m from '$lib/paraglide/messages';
	import type { PublicUser } from '$lib/types';

	let { user } = $props<{ user: PublicUser }>();

	let isSubmitting = $state(false);
	let fullName = $state('');
	let photoFile: File | null = $state(null);

	$effect(() => {
		fullName = user?.fullName || '';
	});

	async function handleSubmit(e: Event) {
		e.preventDefault();
		isSubmitting = true;

		try {
			const formData = new FormData();
			formData.append('fullName', fullName);
			if (photoFile) {
				formData.append('photo', photoFile);
			}

			const response = await fetch('/api/user/update-profile', {
				method: 'POST',
				body: formData
			});

			if (response.ok) {
				await invalidateAll();
				addToast({
					message: m.profile_updated(),
					variant: 'success',
					duration: 3000
				});
				photoFile = null;
			} else {
				throw new Error('Failed to update profile');
			}
		} catch (error) {
			addToast({
				message: m.profile_update_failed(),
				variant: 'error',
				duration: 3000
			});
		} finally {
			isSubmitting = false;
		}
	}

	function handleFileChange(e: Event) {
		const input = e.target as HTMLInputElement;
		if (!input.files || !input.files[0]) return;

		const file = input.files[0];

		const MAX_SIZE = 5 * 1024 * 1024;
		if (file.size > MAX_SIZE) {
			addToast({
				message: m.file_too_large(),
				variant: 'error',
				duration: 3000
			});
			input.value = '';
			return;
		}

		const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			addToast({
				message: m.file_invalid_format(),
				variant: 'error',
				duration: 3000
			});
			input.value = '';
			return;
		}

		photoFile = file;
	}
</script>

<Div column gap="var(--md)">
	<Heading level={3}>{m.edit_profile()}</Heading>

	<Form onsubmit={handleSubmit}>
		<Input type="text" name="fullName" bind:value={fullName} placeholder={m.full_name()} required>
			<ProfileIcon height="var(--lg)" />
		</Input>

		<Div column gap="var(--xs)">
			<Text size="sm" weight="medium">{m.profile_picture()}</Text>
			<input type="file" accept="image/*" onchange={handleFileChange} />
			{#if photoFile}
				<Text size="sm" color="muted">{photoFile.name}</Text>
			{/if}
		</Div>

		<Button type="submit" loading={isSubmitting}>{m.save_changes()}</Button>
	</Form>
</Div>
