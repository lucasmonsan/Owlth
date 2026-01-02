<script lang="ts">
	import type { ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { form }: { form: ActionData } = $props();
</script>

<main>
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
			<input type="password" name="confirmPassword" id="confirmPassword" required />
			{#if form?.errors?.confirmPassword?.[0]}
				<p style="color: red;">{form.errors.confirmPassword[0]}</p>
			{/if}
		</div>

		<button type="submit">{m.register_button()}</button>

		{#if form?.message}
			<p style="color: red;">{form.message}</p>
		{/if}
	</form>

	<p>{m.already_have_account()} <a href="/login">{m.sign_in_link()}</a></p>
</main>
