<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Input from '$lib/components/interface/Input.svelte';
	import Main from '$lib/components/interface/Main.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Main fullWidth>
	{#if data.user}
		<form action=""></form>

		<div>
			<h2>{m.welcome_back()}</h2>

			<div>
				<div>{data.user.email[0].toUpperCase()}</div>
				<p>{data.user.email}</p>
			</div>

			<div>
				<a href="/dashboard">
					{m.continue_app()}
				</a>

				<form action="?/logout" method="POST">
					<Button type="submit">
						{m.switch_account()}
					</Button>
				</form>
			</div>
		</div>
	{:else}
		<form action="?/login" method="POST">
			<div class="title">
				<h2>{m.login_title()}</h2>
				<Button variant="invisible">
					<GoogleIcon height="var(--lg)" />
				</Button>
			</div>

			{#if form?.message}
				<span>{form.message}</span>
			{/if}

			<Input
				type="email"
				name="email"
				id="email"
				value={form?.email ?? ''}
				required
				autocomplete="email"
				placeholder={m.email_label()}
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
			>
				<PasswordIcon height="var(--lg)" />
			</Input>

			<Button type="submit">
				{m.login_button()}
			</Button>
		</form>

		<p>{m.no_account()} <a href="/register">{m.register_link()}</a></p>
	{/if}
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
