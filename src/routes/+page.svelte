<script lang="ts">
	import type { PageData, ActionData } from './$types';
	import * as m from '$lib/paraglide/messages';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<main>
	{#if data.user}
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
					<button type="submit">
						{m.switch_account()}
					</button>
				</form>
			</div>
		</div>
	{:else}
		<div>
			<h2>{m.login_title()}</h2>

			<form action="?/login" method="POST">
				{#if form?.message}
					<div>{form.message}</div>
				{/if}

				<div>
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

				<div>
					<label for="password">{m.password_label()}</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						autocomplete="current-password"
					/>
				</div>

				<button type="submit">
					{m.login_button()}
				</button>
			</form>

			<div>
				<p>{m.no_account()} <a href="/register">{m.register_link()}</a></p>
			</div>
		</div>
	{/if}
</main>

<style>
</style>
