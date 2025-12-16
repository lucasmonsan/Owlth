<script lang="ts">
	import { Motion } from 'svelte-motion';
	import { enhance } from '$app/forms';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { Mail, ArrowLeft } from 'lucide-svelte';
	import type { ActionData } from './$types';

	const { form }: { form: ActionData } = $props();
	
	let loading = $state(false);
	let success = $state(false);
</script>

<svelte:head>
	<title>Recuperar Senha - Monsan</title>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-[#0a0a0a] flex items-center justify-center px-4 py-12">
	<!-- Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
			style="animation-delay: 1s;"
		></div>
	</div>

	<Motion
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6 }}
		let:motion
	>
		<div use:motion class="w-full max-w-md relative">
			<GlassCard class="space-y-6">
				{#if !success}
					<!-- Header -->
					<div class="text-center">
						<h1 class="text-3xl font-bold text-white mb-2">Esqueceu sua senha?</h1>
						<p class="text-gray-400">Enviaremos um link de recuperação para seu email</p>
					</div>

					{#if form?.message}
						<div class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
							{form.message}
						</div>
					{/if}

					<!-- Form -->
					<form 
						method="POST"
						use:enhance={() => {
							loading = true;
							return async ({ result, update }) => {
								await update();
								loading = false;
								if (result.type === 'success') {
									success = true;
								}
							};
						}}
						class="space-y-4"
					>
						<div class="relative">
							<Mail class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
							<Input
								type="email"
								name="email"
								value={form?.email || ''}
								placeholder="seu@email.com"
								required
								class="pl-12"
								error={form?.errors?.email?.[0]}
							/>
						</div>

						<Button type="submit" variant="primary" class="w-full" loading={loading}>
							Enviar Link de Recuperação
						</Button>
					</form>
				{:else}
					<!-- Success Message -->
					<div class="text-center space-y-4">
						<div class="w-16 h-16 mx-auto rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
							<Mail class="w-8 h-8 text-green-400" />
						</div>
						<h2 class="text-2xl font-bold text-white">Email Enviado!</h2>
						<p class="text-gray-400">
							Enviamos um link de recuperação para <span class="text-white font-medium">{form?.email}</span>
						</p>
						<p class="text-sm text-gray-500">
							Verifique sua caixa de entrada e spam. O link expira em 1 hora.
						</p>
					</div>
				{/if}

				<!-- Back to Login -->
				<div class="text-center">
					<a href="/login" class="text-gray-400 hover:text-white transition-colors text-sm inline-flex items-center gap-2">
						<ArrowLeft class="w-4 h-4" />
						Voltar para o login
					</a>
				</div>
			</GlassCard>
		</div>
	</Motion>
</div>

