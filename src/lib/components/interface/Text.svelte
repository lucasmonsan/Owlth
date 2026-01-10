<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Element = 'p' | 'span' | 'div' | 'label';
	type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type Weight = 'normal' | 'medium' | 'semibold' | 'bold';
	type Variant = 'default' | 'muted' | 'error' | 'success' | 'warning';
	type Align = 'left' | 'center' | 'right' | 'justify';

	interface Props extends HTMLAttributes<HTMLElement> {
		as?: Element;
		size?: Size;
		weight?: Weight;
		variant?: Variant;
		align?: Align;
		truncate?: boolean;
		children?: import('svelte').Snippet;
	}

	let {
		as: element = 'p',
		size = 'md',
		weight = 'normal',
		variant = 'default',
		align = 'left',
		truncate = false,
		class: className = '',
		children,
		...rest
	}: Props = $props();
</script>

<svelte:element
	this={element}
	class="text {className}"
	class:muted={variant === 'muted'}
	class:error={variant === 'error'}
	class:success={variant === 'success'}
	class:warning={variant === 'warning'}
	class:truncate
	data-size={size}
	data-weight={weight}
	data-align={align}
	{...rest}
>
	{@render children?.()}
</svelte:element>

<style>
	.text {
		margin: 0;
		line-height: 1.5;
		color: var(--text-primary);
		transition: color var(--normal);
	}

	/* Sizes */
	.text[data-size='xs'] {
		font-size: var(--xs);
	}
	.text[data-size='sm'] {
		font-size: var(--sm);
	}
	.text[data-size='md'] {
		font-size: var(--md);
	}
	.text[data-size='lg'] {
		font-size: var(--lg);
	}
	.text[data-size='xl'] {
		font-size: var(--xl);
	}

	/* Weights */
	.text[data-weight='normal'] {
		font-weight: 400;
	}
	.text[data-weight='medium'] {
		font-weight: 500;
	}
	.text[data-weight='semibold'] {
		font-weight: 600;
	}
	.text[data-weight='bold'] {
		font-weight: 700;
	}

	/* Align */
	.text[data-align='left'] {
		text-align: left;
	}
	.text[data-align='center'] {
		text-align: center;
	}
	.text[data-align='right'] {
		text-align: right;
	}
	.text[data-align='justify'] {
		text-align: justify;
	}

	/* Variants */
	.text.muted {
		color: var(--text-secondary);
	}

	.text.error {
		color: var(--error);
	}

	.text.success {
		color: var(--success);
	}

	.text.warning {
		color: var(--warning);
	}

	.text.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>
