<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		class: className = '',
		children,
		...rest
	}: {
		class?: string;
		children?: any;
		[key: string]: any;
	} = $props();
</script>

<div
	class={cn(
		'glass-effect rounded-2xl p-8 shadow-2xl transition-all duration-300',
		className
	)}
	{...rest}
>
	{@render children?.()}
</div>

