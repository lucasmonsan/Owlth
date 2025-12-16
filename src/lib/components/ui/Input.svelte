<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		type = 'text',
		name,
		label,
		error,
		value = '',
		placeholder = '',
		required = false,
		disabled = false,
		class: className = '',
		id,
		...rest
	}: {
		type?: string;
		name?: string;
		label?: string;
		error?: string;
		value?: string;
		placeholder?: string;
		required?: boolean;
		disabled?: boolean;
		class?: string;
		id?: string;
		[key: string]: any;
	} = $props();

	let focused = $state(false);
	let inputValue = $state(value);
	let hasValue = $derived(inputValue.length > 0);
	
	// Gera um ID único se não for fornecido
	const inputId = id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
</script>

<div class={cn('relative', className)}>
	{#if label}
		<label
			for={inputId}
			class={cn(
				'absolute left-4 transition-all duration-200 pointer-events-none',
				focused || hasValue
					? 'top-2 text-xs text-blue-400'
					: 'top-1/2 -translate-y-1/2 text-sm text-gray-400'
			)}
		>
			{label}
			{#if required}
				<span class="text-red-400">*</span>
			{/if}
		</label>
	{/if}
	
	<input
		id={inputId}
		{type}
		{name}
		value={inputValue}
		oninput={(e) => (inputValue = e.currentTarget.value)}
		{placeholder}
		{required}
		{disabled}
		onfocus={() => (focused = true)}
		onblur={() => (focused = false)}
		class={cn(
			'w-full rounded-xl glass-effect px-4 transition-all duration-200',
			'text-white placeholder:text-gray-500',
			'focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50',
			'disabled:opacity-50 disabled:cursor-not-allowed',
			label ? 'pt-6 pb-2' : 'py-3',
			error && 'ring-2 ring-red-500/50 border-red-500/50'
		)}
		{...rest}
	/>
	
	{#if error}
		<p class="mt-1 text-xs text-red-400 px-4">{error}</p>
	{/if}
</div>
