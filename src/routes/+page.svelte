<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Input from '$lib/components/interface/Input.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import HR from '$lib/components/interface/HR.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Space from '$lib/components/interface/Space.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let errorMessage = $derived(form?.message || '');

	const handleInvalidEmail = (
		e: Event & { currentTarget: HTMLInputElement }
	) => {
		const input = e.currentTarget;
		if (input.validity.valueMissing) {
			input.setCustomValidity(m.field_required());
		} else if (input.validity.typeMismatch) {
			input.setCustomValidity(m.invalid_email());
		}
	};

	const handleInvalidPassword = (
		e: Event & { currentTarget: HTMLInputElement }
	) => {
		const input = e.currentTarget;
		if (input.validity.valueMissing) {
			input.setCustomValidity(m.field_required());
		}
	};

	const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
		e.currentTarget.setCustomValidity('');
	};
</script>

<Main fullWidth maxWidth="content">
	{#if data.user}
		<Div column gap="var(--sm)" fullWidth center class="user">
			<Div fullWidth justify="between">
				<Heading level={2}>{m.welcome_back()}</Heading>
				<Button variant="outline" class="avatar">
					{data.user.email[0].toUpperCase()}
				</Button>
			</Div>

			<HR />

			<Div column center>
				<Heading level={5}>{data.user.fullName}</Heading>
				<Text align="center" size="sm">{data.user.email}</Text>

				{#if !data.user.isVerified}
					<Text align="center" size="sm" variant="error">
						{m.not_verified()}
					</Text>
				{/if}
			</Div>

			<Button href="/dashboard" fullWidth>
				{m.continue_app()}
			</Button>
		</Div>

		<Space size="xs" />

		<form action="?/logout" method="POST">
			<Button type="submit" variant="invisible" size="sm">
				{m.switch_account()}
			</Button>
		</form>
	{:else}
		<form action="?/login" method="POST">
			<Div justify="between" align="center">
				<Heading level={2}>{m.login_title()}</Heading>
				<Button variant="invisible" type="button" disabled>
					<GoogleIcon height="var(--lg)" />
				</Button>
			</Div>

			<Input
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				required
				autocomplete="email"
				placeholder={m.email_label()}
				oninvalid={handleInvalidEmail}
				oninput={handleInput}
			>
				<EmailIcon height="var(--lg)" />
			</Input>

			<Input
				type="password"
				name="password"
				id="password"
				required
				autocomplete="current-password"
				placeholder={m.password_label()}
				oninvalid={handleInvalidPassword}
				oninput={handleInput}
			>
				<PasswordIcon height="var(--lg)" />
			</Input>

			{#if errorMessage}
				<Text variant="error" size="sm" align="center">
					{errorMessage}
				</Text>
			{/if}

			<Button type="submit">
				{m.login_button()}
			</Button>

			<Text size="sm" align="center">
				{m.no_account()}
				<Button href="/register" variant="invisible">
					{m.register_link()}
				</Button>
			</Text>
		</form>
	{/if}
</Main>

<style>
	:global(.user) {
		max-width: calc(var(--xxxxl) * 8);
	}

	form {
		max-width: calc(var(--xxxxl) * 8);
	}

	:global(.avatar) {
		width: var(--xxxxl);
		height: var(--xxxxl);
	}
</style>
