<script lang="ts">
	import type { ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Button from '$lib/components/interface/Button.svelte';
	import Main from '$lib/components/interface/Main.svelte';

	let { form }: { form: ActionData } = $props();
</script>

<Main>
	<h1>{m.register_title()}</h1>

	<form method="POST">
		<div>
			<label for="email">{m.email_label()}</label>
			<input
				type="email"
				name="email"
				id="email"
				value={form?.data?.email?.toString() ?? ''}
				required
			/>
			{#if form?.errors?.email?.[0]}
				<p style="color: red;">{form.errors.email[0]}</p>
			{/if}
		</div>

		<div>
			<label for="password">{m.password_label()}</label>
			<input type="password" name="password" id="password" required />
			{#if form?.errors?.password?.[0]}
				<p style="color: red;">{form.errors.password[0]}</p>
			{/if}
		</div>

		<div>
			<label for="confirmPassword">{m.confirm_password_label()}</label>
			<input
				type="password"
				name="confirmPassword"
				id="confirmPassword"
				required
			/>
			{#if form?.errors?.confirmPassword?.[0]}
				<p style="color: red;">{form.errors.confirmPassword[0]}</p>
			{/if}
		</div>

		<Button type="submit">{m.register_button()}</Button>

		{#if form?.message}
			<p style="color: red;">{form.message}</p>
		{/if}
	</form>

	<p>{m.already_have_account()} <a href="/login">{m.sign_in_link()}</a></p>
</Main>
