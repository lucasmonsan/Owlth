<script lang="ts">
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<h1>Register</h1>

<form method="POST">
	<div>
		<label for="email">Email</label>
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
		<label for="password">Password</label>
		<input type="password" name="password" id="password" required />
		{#if form?.errors?.password?.[0]}
			<p style="color: red;">{form.errors.password[0]}</p>
		{/if}
	</div>

	<div>
		<label for="confirmPassword">Confirm Password</label>
		<input type="password" name="confirmPassword" id="confirmPassword" required />
		{#if form?.errors?.confirmPassword?.[0]}
			<p style="color: red;">{form.errors.confirmPassword[0]}</p>
		{/if}
	</div>

	<button type="submit">Create Account</button>

	{#if form?.message}
		<p style="color: red;">{form.message}</p>
	{/if}
</form>

<p>Already have an account? <a href="/login">Sign in</a></p>
