<script lang="ts">
	import type { ActionData } from './$types';
	import { localizeHref } from '$lib/paraglide/runtime';
	import * as m from '$lib/paraglide/messages';

	import Main from '$lib/components/layout/Main.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Input from '$lib/components/interface/Input.svelte';

	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<Main center fullWidth>
	<form method="POST">
		<div>
			<h2>{m.register_title()}</h2>
			<Button variant="invisible">
				<GoogleIcon height="var(--lg)" />
			</Button>
		</div>

		{#if form?.message}
			<span class="error-message">{form.message}</span>
		{/if}

		<div class="field-group">
			<Input
				type="email"
				name="email"
				id="email"
				value={form?.data?.email?.toString() ?? ''}
				required
				autocomplete="email"
				placeholder={m.email_label()}
			>
				<EmailIcon height="var(--lg)" />
			</Input>
			{#if form?.errors?.email?.[0]}
				<span class="error-message">{form.errors.email[0]}</span>
			{/if}
		</div>

		<div class="field-group">
			<Input
				type="password"
				name="password"
				id="password"
				required
				autocomplete="new-password"
				placeholder={m.password_label()}
			>
				<PasswordIcon height="var(--lg)" />
			</Input>
			{#if form?.errors?.password?.[0]}
				<span class="error-message">{form.errors.password[0]}</span>
			{/if}
		</div>

		<div class="field-group">
			<Input
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				required
				autocomplete="new-password"
				placeholder={m.confirm_password_label()}
			>
				<PasswordIcon height="var(--lg)" />
			</Input>
			{#if form?.errors?.confirmPassword?.[0]}
				<span class="error-message">{form.errors.confirmPassword[0]}</span>
			{/if}
		</div>

		<Button type="submit">
			{m.register_button()}
		</Button>
	</form>

	<div>
		<p>
			{m.already_have_account()}
			<a href={localizeHref('/')}>{m.sign_in_link()}</a>
		</p>
	</div>
</Main>

<style>
	form {
		max-width: calc(var(--xxxxl) * 8);
	}

	h2 {
		flex: 1;
	}

	p {
		margin-top: var(--xs);
		font-size: var(--sm);
	}
</style>
