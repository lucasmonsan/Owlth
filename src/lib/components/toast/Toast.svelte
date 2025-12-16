<script lang="ts">
	import { Motion } from 'svelte-motion';
	import { X, CheckCircle, AlertCircle, Info } from 'lucide-svelte';
	import { cn } from '$lib';

	let {
		type = 'success',
		message,
		onClose
	}: {
		type?: 'success' | 'error' | 'info';
		message: string;
		onClose?: () => void;
	} = $props();

	const icons = {
		success: CheckCircle,
		error: AlertCircle,
		info: Info
	};

	const styles = {
		success: 'bg-green-500/10 border-green-500/20 text-green-400',
		error: 'bg-red-500/10 border-red-500/20 text-red-400',
		info: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
	};

	const Icon = $derived(icons[type]);
</script>

<Motion
	initial={{ opacity: 0, y: -20, scale: 0.95 }}
	animate={{ opacity: 1, y: 0, scale: 1 }}
	exit={{ opacity: 0, scale: 0.95 }}
	transition={{ duration: 0.2 }}
	let:motion
>
	<div
		use:motion
		class={cn(
			'glass-effect rounded-xl p-4 flex items-center gap-3 shadow-2xl min-w-[300px] border',
			styles[type]
		)}
		role="alert"
		aria-live="polite"
	>
		<Icon class="w-5 h-5 flex-shrink-0" />
		<p class="flex-1 text-sm font-medium">{message}</p>
		{#if onClose}
			<button
				onclick={onClose}
				class="flex-shrink-0 hover:opacity-70 transition-opacity"
				aria-label="Fechar notificação"
			>
				<X class="w-4 h-4" />
			</button>
		{/if}
	</div>
</Motion>

