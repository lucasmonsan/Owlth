<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import PasswordIcon from '$lib/components/icons/PasswordIcon.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Input from '$lib/components/interface/Input.svelte';
	import Main from '$lib/components/layout/Main.svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<Main fullWidth>
	{#if data.user}
		<form action="/dashboard" method="POST">
			<div>
				<h2>{m.welcome_back()}</h2>
				<Button variant="outline" class="avatar">
					{data.user.email[0].toUpperCase()}
				</Button>
			</div>

			<h3 class="name">{data.user.full_name}</h3>
			<p class="email">{data.user.email}</p>

			<Button type="submit">
				{m.continue_app()}
			</Button>
		</form>
		<p><a href="?/logout">{m.switch_account()}</a></p>
	{:else}
		<form action="?/login" method="POST">
			<div>
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

		&.email {
			text-align: center;
		}
	}

	:global(.avatar) {
		width: var(--xxxxl);
		height: var(--xxxxl);
	}
</style>
