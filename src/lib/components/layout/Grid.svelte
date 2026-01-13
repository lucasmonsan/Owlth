<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		cols?: number | string; // 1, 2, 3, or '1fr 2fr' etc
		minItemWidth?: string; // e.g. '300px'
		gap?: string;
		align?: 'start' | 'center' | 'end' | 'stretch';
		children?: import('svelte').Snippet;
	}

	let { cols = 1, minItemWidth = undefined, gap = 'var(--md)', align = 'stretch', class: className = '', style = '', children, ...rest }: Props = $props();

	// Helper to handle responsive cols if needed, but keeping simple for now.
	// Can be extended to accept object { sm: 1, md: 2, lg: 3 } later.
</script>

<div
	class="grid {className}"
	style="
		--cols: {cols};
		--min-item-width: {minItemWidth};
		--gap: {gap};
		--align: {align};
		{style}
	"
	{...rest}
>
	{@render children?.()}
</div>

<style>
	.grid {
		display: grid;
		/* Default grid-template-columns, overridden if minItemWidth is provided */
		grid-template-columns: repeat(var(--cols), 1fr);
		gap: var(--gap);
		align-items: var(--align);
		width: 100%;
	}

	/* Se minItemWidth for fornecido, usa auto-fit para responsividade automática */
	@supports (width: min(100%, 1px)) {
		.grid[style*='--min-item-width'] {
			grid-template-columns: repeat(auto-fit, minmax(min(100%, var(--min-item-width, 300px)), 1fr));
		}
	}

	/* Simple Responsive Defaults if not overridden */
	@media (max-width: 768px) {
		.grid {
			/* If cols is a number and > 1, default to 1 on mobile unless overridden */
			grid-template-columns: 1fr;
		}
	}
</style>
