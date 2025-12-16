<script lang="ts">
	import { page } from '$app/stores';
	import { Motion } from 'svelte-motion';
	import Button from '$lib/components/ui/Button.svelte';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import { AlertCircle, Home } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Erro {$page.status} - Monsan</title>
</svelte:head>

<div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
	<!-- Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute top-1/3 left-1/3 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"
		></div>
	</div>

	<Motion
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.6 }}
		let:motion
	>
		<div use:motion class="relative max-w-md w-full">
			<GlassCard class="text-center space-y-6">
				<div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20">
					<AlertCircle class="w-10 h-10 text-red-400" />
				</div>

				<div>
					<h1 class="text-6xl font-bold text-white mb-2">{$page.status}</h1>
					<h2 class="text-2xl font-semibold text-white mb-4">
						{#if $page.status === 404}
							Página não encontrada
						{:else if $page.status === 500}
							Erro interno do servidor
						{:else}
							Algo deu errado
						{/if}
					</h2>
					<p class="text-gray-400">
						{$page.error?.message || 'Desculpe, ocorreu um erro inesperado.'}
					</p>
				</div>

				<a href="/">
					<Button variant="primary" class="w-full">
						<div class="flex items-center justify-center gap-2">
							<Home class="w-5 h-5" />
							Voltar ao Início
						</div>
					</Button>
				</a>
			</GlassCard>
		</div>
	</Motion>
</div>

