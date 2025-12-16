<script lang="ts">
	import { Motion } from 'svelte-motion';
	import GlassCard from '$lib/components/ui/GlassCard.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import {
		LayoutDashboard,
		LogOut,
		DollarSign,
		Cloud,
		Lock,
		Menu,
		X,
		Sparkles
	} from 'lucide-svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let sidebarOpen = $state(false);

	const apps = [
		{
			id: 'financeiro',
			name: 'Financeiro 360',
			description: 'Gestão completa das suas finanças',
			icon: DollarSign,
			active: true,
			color: 'from-green-500 to-emerald-600',
			url: '/apps/financeiro'
		},
		{
			id: 'cloud',
			name: 'Cloud Manager',
			description: 'Gerencie seus recursos na nuvem',
			icon: Cloud,
			active: false,
			color: 'from-blue-500 to-cyan-600',
			url: '/apps/cloud'
		},
		{
			id: 'security',
			name: 'Security Hub',
			description: 'Central de segurança e monitoramento',
			icon: Lock,
			active: false,
			color: 'from-red-500 to-orange-600',
			url: '/apps/security'
		}
	];

	const userName = $derived(data.user?.user_metadata?.full_name || data.user?.email?.split('@')[0] || 'Usuário');
</script>

<svelte:head>
	<title>Dashboard - Monsan</title>
</svelte:head>

<div class="min-h-screen bg-[#0a0a0a]">
	<!-- Mobile Menu Button -->
	<div class="lg:hidden fixed top-6 left-4 z-50">
		<button
			onclick={() => (sidebarOpen = !sidebarOpen)}
			class="glass-effect glass-hover p-3 rounded-xl shadow-lg"
			aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
			aria-expanded={sidebarOpen}
		>
			{#if sidebarOpen}
				<X class="w-6 h-6 text-white" />
			{:else}
				<Menu class="w-6 h-6 text-white" />
			{/if}
		</button>
	</div>

	<!-- Sidebar -->
	<aside
		class={`fixed top-0 left-0 h-full w-64 glass-effect border-r border-white/10 p-6 transition-transform duration-300 z-40 ${
			sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
		}`}
		role="navigation"
		aria-label="Menu principal"
	>
		<div class="flex flex-col h-full">
			<!-- Logo -->
			<div class="flex items-center gap-3 mb-8">
				<div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
					<Sparkles class="w-6 h-6 text-white" />
				</div>
				<div>
					<h1 class="text-xl font-bold text-white">Monsan</h1>
					<p class="text-xs text-gray-400">Auth Hub</p>
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 space-y-2" aria-label="Navegação principal">
				<a
					href="/dashboard"
					class="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
					aria-current="page"
				>
					<LayoutDashboard class="w-5 h-5" aria-hidden="true" />
					Dashboard
				</a>
			</nav>

			<!-- User Info -->
			<div class="border-t border-white/10 pt-4 mt-4">
				<div class="flex items-center gap-3 mb-4">
					<div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold">
						{userName[0].toUpperCase()}
					</div>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-medium text-white truncate">{userName}</p>
						<p class="text-xs text-gray-400 truncate">{data.user?.email}</p>
					</div>
				</div>
				<form method="POST" action="?/logout">
					<Button type="submit" variant="ghost" class="w-full justify-center">
						<div class="flex items-center gap-2">
							<LogOut class="w-4 h-4" />
							Sair
						</div>
					</Button>
				</form>
			</div>
		</div>
	</aside>

	<!-- Main Content -->
	<main class="lg:ml-64 min-h-screen p-4 sm:p-6 lg:p-8 pt-20 lg:pt-8">
		<Motion
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			let:motion
		>
			<div use:motion class="max-w-7xl mx-auto">
				<!-- Header -->
				<div class="mb-8 lg:mb-12">
					<h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">
						Olá, {userName} 👋
					</h1>
					<p class="text-sm sm:text-base text-gray-400">
						Bem-vindo ao seu hub de aplicações. Escolha um app para começar.
					</p>
				</div>

				<!-- Apps Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each apps as app, i}
						<Motion
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.1, duration: 0.6 }}
							let:motion
						>
							<div use:motion>
								{#if app.active}
									<a href={app.url} target="_blank" rel="noopener noreferrer" class="block group">
										<GlassCard class="relative overflow-hidden glass-hover cursor-pointer h-full">
											<!-- Gradient Background -->
											<div
												class={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-10 group-hover:opacity-20 transition-opacity`}
											></div>

											<div class="relative">
												<!-- Icon -->
												<div
													class={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center mb-4 shadow-lg`}
												>
													<app.icon class="w-8 h-8 text-white" />
												</div>

												<!-- Content -->
												<h3 class="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
													{app.name}
												</h3>
												<p class="text-gray-400 text-sm mb-4">
													{app.description}
												</p>

												<!-- Status Badge -->
												<div class="flex items-center gap-2">
													<div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
													<span class="text-xs text-green-400 font-medium">Ativo</span>
												</div>
											</div>
										</GlassCard>
									</a>
								{:else}
									<GlassCard class="relative overflow-hidden opacity-60 cursor-not-allowed h-full">
										<!-- Icon -->
										<div class="w-16 h-16 rounded-2xl glass-effect flex items-center justify-center mb-4 relative">
											<app.icon class="w-8 h-8 text-gray-500" />
											<div class="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
												<Lock class="w-6 h-6 text-gray-400" />
											</div>
										</div>

										<!-- Content -->
										<h3 class="text-xl font-bold text-gray-500 mb-2">
											{app.name}
										</h3>
										<p class="text-gray-600 text-sm mb-4">
											{app.description}
										</p>

										<!-- Status Badge -->
										<div class="flex items-center gap-2">
											<div class="w-2 h-2 rounded-full bg-gray-600"></div>
											<span class="text-xs text-gray-500 font-medium">Indisponível</span>
										</div>
									</GlassCard>
								{/if}
							</div>
						</Motion>
					{/each}
				</div>

				<!-- Stats Section -->
				<Motion
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.6 }}
					let:motion
				>
					<div use:motion class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
						<GlassCard class="text-center">
							<div class="text-3xl font-bold text-white mb-2">
								{apps.filter((a) => a.active).length}
							</div>
							<div class="text-gray-400 text-sm">Apps Ativos</div>
						</GlassCard>

						<GlassCard class="text-center">
							<div class="text-3xl font-bold text-white mb-2">
								{apps.length}
							</div>
							<div class="text-gray-400 text-sm">Total de Apps</div>
						</GlassCard>

						<GlassCard class="text-center">
							<div class="text-3xl font-bold text-blue-400 mb-2">100%</div>
							<div class="text-gray-400 text-sm">Segurança</div>
						</GlassCard>
					</div>
				</Motion>
			</div>
		</Motion>
	</main>
</div>

<!-- Overlay for mobile sidebar -->
{#if sidebarOpen}
	<button
		class="fixed inset-0 bg-black/50 z-30 lg:hidden"
		onclick={() => (sidebarOpen = false)}
		aria-label="Fechar menu"
	></button>
{/if}

