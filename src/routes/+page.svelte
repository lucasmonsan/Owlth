<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import { addToast } from '$lib/stores/toast.svelte';
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
	import Avatar from '$lib/components/interface/Avatar.svelte';
	import Form from '$lib/components/layout/Form.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import { browser } from '$app/environment';

	let { data, form }: { data: PageData; form: ActionData } = $props();

	let isSubmitting = $state(false);

	let errorMessage = $derived(form?.message || '');

	// Countdown para reenvio de email
	let countdown = $state(0);

	// Inicia countdown se servidor retornar retryAfter
	$effect(() => {
		if (form?.retryAfter && form.retryAfter > 0) {
			countdown = form.retryAfter;
		}
	});

	// Decrementa countdown a cada segundo
	$effect(() => {
		if (countdown > 0) {
			const timer = setInterval(() => {
				countdown = Math.max(0, countdown - 1);
			}, 1000);
			return () => clearInterval(timer);
		}
	});

	// Toast de sucesso ao enviar email
	$effect(() => {
		if (form?.success && form.action === 'resend') {
			addToast({
				message: m.email_sent(),
				variant: 'success',
				duration: 5000
			});
		}
	});

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

<SEO title={m.login_title()} description={m.seo_login_description()} />

<Main fullWidth maxWidth="content" center>
	{#if data.user}
		<Div column gap="var(--sm)" fullWidth center maxWidth="content">
			<Div fullWidth justify="between">
				<Heading level={2}>{m.welcome_back()}</Heading>
				<Avatar
					src={data.user.profilePicture}
					alt={data.user.fullName}
					size="xl"
				/>
			</Div>

			<HR />

			<Div column center>
				<Heading level={5} align="center">{data.user.fullName}</Heading>
				<Text align="center" size="sm">{data.user.email}</Text>

				{#if !data.user.isVerified}
					<Space size="xs" />
					<Text align="center" size="sm" variant="error">
						{m.not_verified()}
					</Text>

					<Space size="sm" />

					<!-- Botão de reenviar email -->
					<Form action="?/resend" method="POST">
						{#if countdown > 0}
							<Button type="button" variant="outline" disabled fullWidth>
								{m.resend_in({ seconds: countdown })}
							</Button>
						{:else}
							<Button type="submit" variant="outline" fullWidth>
								{m.resend_email()}
							</Button>
						{/if}
					</Form>
				{/if}
			</Div>

			<Button href="/dashboard" fullWidth disabled={!data.user.isVerified}>
				{m.continue_app()}
			</Button>
		</Div>

		<Space size="xs" />

		<Form action="?/logout" method="POST">
			<Button type="submit" variant="outline" fullWidth>
				{m.logout()}
			</Button>
		</Form>
	{:else}
		<Form
			action="?/login"
			method="POST"
			onsubmit={() => {
				isSubmitting = true;
			}}
		>
			<Div justify="between" align="center">
				<Heading level={2}>{m.login_title()}</Heading>
				<Button
					variant="invisible"
					href="/api/auth/google/login"
					aria-label={m.google_login_aria()}
				>
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

			<Button type="submit" fullWidth loading={isSubmitting}>
				{m.login_button()}
			</Button>

			<Text size="sm" align="center">
				{m.no_account()}
				<Button href="/register" variant="invisible">
					{m.register_link()}
				</Button>
			</Text>
		</Form>
	{/if}
</Main>
