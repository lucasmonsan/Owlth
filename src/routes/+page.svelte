<script lang="ts">
	import { Motion } from 'svelte-motion';
	import Button from '$lib/components/ui/Button.svelte';
	import { Sparkles } from 'lucide-svelte';

	const titleVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: (i: number) => ({
			opacity: 1,
			y: 0,
			transition: {
				delay: i * 0.2,
				duration: 0.8,
				ease: [0.6, 0.05, 0.01, 0.9]
			}
		})
	};
</script>

<svelte:head>
	<title>Monsan - Uma Única Conta, Um Universo de Possibilidades</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="relative min-h-screen overflow-hidden bg-[#0a0a0a]">
	<!-- Background Effects -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500/10 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute -bottom-1/2 -right-1/2 w-full h-full bg-purple-500/10 rounded-full blur-3xl animate-pulse"
			style="animation-delay: 1s;"
		></div>
	</div>

	<!-- Hero Section -->
	<div class="relative flex min-h-screen items-center justify-center px-4">
		<div class="max-w-5xl text-center">
			<!-- Animated Icon -->
			<Motion
				initial={{ scale: 0, rotate: -180 }}
				animate={{ scale: 1, rotate: 0 }}
				transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
				let:motion
			>
				<div use:motion class="mb-12 flex justify-center">
					<div
						class="rounded-full glass-effect p-6 shadow-2xl shadow-blue-500/20"
					>
						<Sparkles class="h-16 w-16 text-blue-400" />
					</div>
				</div>
			</Motion>

			<!-- Title Lines with Staggered Animation -->
			<div class="space-y-4">
				<Motion
					custom={0}
					initial="hidden"
					animate="visible"
					variants={titleVariants}
					let:motion
				>
					<h1
						use:motion
						class="text-6xl md:text-8xl font-extrabold tracking-tight text-white"
					>
						UMA ÚNICA CONTA
					</h1>
				</Motion>

				<Motion
					custom={1}
					initial="hidden"
					animate="visible"
					variants={titleVariants}
					let:motion
				>
					<h2
						use:motion
						class="text-5xl md:text-7xl italic text-[#3b82f6]"
						style="font-family: 'Playfair Display', serif;"
					>
						UM UNIVERSO DE
					</h2>
				</Motion>

				<Motion
					custom={2}
					initial="hidden"
					animate="visible"
					variants={titleVariants}
					let:motion
				>
					<h1
						use:motion
						class="text-6xl md:text-8xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
					>
						POSSIBILIDADES
					</h1>
				</Motion>
			</div>

			<!-- Subtitle -->
			<Motion
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.8, duration: 0.8 }}
				let:motion
			>
				<p use:motion class="mt-8 text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto">
					Acesse todos os seus aplicativos com uma única identidade. Simples, seguro e elegante.
				</p>
			</Motion>

			<!-- CTA Buttons -->
			<Motion
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1, duration: 0.8 }}
				let:motion
			>
				<div use:motion class="mt-12 flex flex-col sm:flex-row gap-4 justify-center items-center">
					<a href="/register">
						<Button variant="primary" class="min-w-[200px]">
							Começar Agora
						</Button>
					</a>
					<a href="/login">
						<Button variant="ghost" class="min-w-[200px]">
							Fazer Login
						</Button>
					</a>
				</div>
			</Motion>

			<!-- Features -->
			<Motion
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.4, duration: 1 }}
				let:motion
			>
				<div use:motion class="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
					{#each [
						{ title: 'Segurança', desc: 'Autenticação de nível empresarial' },
						{ title: 'Simplicidade', desc: 'Uma conta para tudo' },
						{ title: 'Velocidade', desc: 'Acesso instantâneo aos apps' }
					] as feature}
						<div class="glass-effect glass-hover rounded-xl p-6 text-left">
							<h3 class="text-xl font-bold text-white mb-2">{feature.title}</h3>
							<p class="text-gray-400">{feature.desc}</p>
						</div>
					{/each}
				</div>
			</Motion>
		</div>
	</div>
</div>

<style>
	@keyframes pulse {
		0%, 100% {
			opacity: 0.1;
		}
		50% {
			opacity: 0.2;
		}
	}
</style>
