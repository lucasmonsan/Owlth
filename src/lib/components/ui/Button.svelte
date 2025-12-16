<script lang="ts">
	import { Motion } from 'svelte-motion';
	import { cn } from '$lib';

	let {
		variant = 'primary',
		type = 'button',
		disabled = false,
		loading = false,
		class: className = '',
		children,
		onclick,
		...rest
	}: {
		variant?: 'primary' | 'ghost' | 'outline';
		type?: 'button' | 'submit' | 'reset';
		disabled?: boolean;
		loading?: boolean;
		class?: string;
		children?: any;
		onclick?: (e: MouseEvent) => void;
		[key: string]: any;
	} = $props();

	const variants = {
		primary:
			'bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50',
		ghost:
			'glass-effect glass-hover text-white font-medium',
		outline:
			'border-2 border-white/20 hover:border-white/40 bg-transparent text-white font-medium hover:bg-white/5'
	};
</script>

<Motion let:motion whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
	<button
		use:motion
		{type}
		disabled={disabled || loading}
		class={cn(
			'rounded-full px-8 py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a]',
			variants[variant],
			className
		)}
		onclick={onclick}
		aria-busy={loading}
		{...rest}
	>
		{#if loading}
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
				<span>Carregando...</span>
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</button>
</Motion>

