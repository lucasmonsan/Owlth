<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<main>
	<header>
		<h1>{m.app_name()}</h1>
	</header>

	{#if data.user}
		<div class="card welcome-back">
			<h2>{m.welcome_back()}</h2>

			<div class="user-info">
				<div class="avatar">{data.user.email[0].toUpperCase()}</div>
				<p>{data.user.email}</p>
			</div>

			<div class="actions">
				<a href="/dashboard" class="button primary">
					{m.continue_app()}
				</a>

				<form action="?/logout" method="POST">
					<button type="submit" class="button text-only">
						{m.switch_account()}
					</button>
				</form>
			</div>
		</div>
	{:else}
		<div class="card login-form">
			<h2>{m.login_title()}</h2>

			<form action="?/login" method="POST">
				{#if form?.message}
					<div class="alert error">{form.message}</div>
				{/if}

				<div class="form-group">
					<label for="email">{m.email_label()}</label>
					<input
						type="email"
						name="email"
						id="email"
						value={form?.email ?? ''}
						required
						autocomplete="email"
					/>
				</div>

				<div class="form-group">
					<label for="password">{m.password_label()}</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						autocomplete="current-password"
					/>
				</div>

				<button type="submit" class="button primary full-width">
					{m.login_button()}
				</button>
			</form>

			<div class="footer">
				<p>{m.no_account()} <a href="/register">{m.register_link()}</a></p>
			</div>
		</div>
	{/if}
</main>

<style>
	.card {
		border: 1px solid #ddd;
		padding: 2rem;
		border-radius: 8px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}
	.avatar {
		width: 64px;
		height: 64px;
		background: #333;
		color: white;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 2rem;
		margin: 0 auto 1rem;
	}
	.user-info p {
		font-weight: bold;
		margin: 0;
	}
	.form-group {
		text-align: left;
		margin-bottom: 1rem;
	}
	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-size: 0.9rem;
	}
	.form-group input {
		width: 100%;
		padding: 0.5rem;
		box-sizing: border-box;
	}
	.button {
		display: inline-block;
		padding: 0.75rem 1.5rem;
		text-decoration: none;
		border-radius: 4px;
		border: none;
		cursor: pointer;
		font-size: 1rem;
	}
	.button.primary {
		background-color: #000;
		color: #fff;
	}
	.button.text-only {
		background: none;
		color: #666;
		text-decoration: underline;
		font-size: 0.9rem;
		margin-top: 1rem;
	}
	.button.full-width {
		width: 100%;
	}
	.alert.error {
		color: #d32f2f;
		background: #ffebee;
		padding: 0.5rem;
		border-radius: 4px;
		margin-bottom: 1rem;
	}
	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-top: 1.5rem;
	}
</style>
