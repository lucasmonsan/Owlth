<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Main from '$lib/components/layout/Main.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Form from '$lib/components/layout/Form.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Input from '$lib/components/interface/Input.svelte';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import ProfileIcon from '$lib/components/icons/ProfileIcon.svelte';
	import { enhance } from '$app/forms';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	// Handlers para validação HTML5 traduzida
	const handleInvalidRequired = (
		e: Event & { currentTarget: HTMLInputElement }
	) => {
		const input = e.currentTarget;
		if (input.validity.valueMissing) {
			input.setCustomValidity(m.field_required());
		}
	};

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

	const handleInput = (e: Event & { currentTarget: HTMLInputElement }) => {
		e.currentTarget.setCustomValidity('');
	};
</script>

<SEO title={m.register_title()} description={m.seo_register_description()} />

<Main fullWidth maxWidth="content">
	<Form
		action="?/register"
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ update }) => {
				await update();
				isSubmitting = false;
			};
		}}
	>
		<Div justify="between" align="center">
			<Heading level={2}>{m.register_title()}</Heading>
			<Button
				variant="invisible"
				href="/api/auth/google/login"
				aria-label={m.google_login_aria()}
			>
				<GoogleIcon height="var(--lg)" />
			</Button>
		</Div>

		<Input
			type="text"
			name="fullName"
			id="fullName"
			value={(form?.data?.fullName as string) ?? ''}
			error={form?.errors?.fullName?.[0]}
			required
			autocomplete="name"
			placeholder={m.name_label()}
			oninvalid={handleInvalidRequired}
			oninput={handleInput}
		>
			<ProfileIcon height="var(--lg)" />
		</Input>

		<Input
			type="email"
			name="email"
			id="email"
			value={(form?.data?.email as string) ?? ''}
			error={form?.errors?.email?.[0]}
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
			error={form?.errors?.password?.[0]}
			required
			autocomplete="new-password"
			placeholder={m.password_label()}
			oninvalid={handleInvalidRequired}
			oninput={handleInput}
		>
			<PasswordIcon height="var(--lg)" />
		</Input>

		<Input
			type="password"
			name="confirmPassword"
			id="confirmPassword"
			error={form?.errors?.confirmPassword?.[0]}
			required
			autocomplete="new-password"
			placeholder={m.confirm_password_label()}
			oninvalid={handleInvalidRequired}
			oninput={handleInput}
		>
			<PasswordIcon height="var(--lg)" />
		</Input>

		{#if form?.message}
			<Text variant="error" size="sm" align="center">
				{form.message}
			</Text>
		{/if}

		<Button type="submit" fullWidth loading={isSubmitting}>
			{m.register_button()}
		</Button>

		<Text size="sm" align="center">
			{m.already_have_account()}
			<Button href="/" variant="invisible">
				{m.sign_in_link()}
			</Button>
		</Text>
	</Form>
</Main>
