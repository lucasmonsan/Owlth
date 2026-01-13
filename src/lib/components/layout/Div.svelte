<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Justify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
	type Align = 'start' | 'center' | 'end' | 'stretch';
	type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'content' | 'full';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: import('svelte').Snippet;
		column?: boolean;
		center?: boolean;
		fullWidth?: boolean;
		wrap?: boolean;
		gap?: string;
		justify?: Justify;
		align?: Align;
		maxWidth?: MaxWidth;
	}

	let { children, column = false, center = false, fullWidth = false, wrap = false, gap = undefined, justify = undefined, align = undefined, maxWidth = undefined, class: className = '', style = '', ...rest }: Props = $props();
</script>

<div class:column class:center class:w-100={fullWidth} class:wrap class={className} style={gap ? `${style}; gap: ${gap}` : style} data-justify={justify} data-align={align} data-max-width={maxWidth} {...rest}>
	{@render children?.()}
</div>

<style>
	div {
		display: flex;
		flex-direction: row;
		align-items: flex-start;

		&.column {
			flex-direction: column;
		}

		&.center {
			align-items: center;
			justify-content: center;
		}

		&.w-100 {
			width: 100%;
		}

		&.wrap {
			flex-wrap: wrap;
		}

		&[data-justify='start'] {
			justify-content: flex-start;
		}
		&[data-justify='center'] {
			justify-content: center;
		}
		&[data-justify='end'] {
			justify-content: flex-end;
		}
		&[data-justify='between'] {
			justify-content: space-between;
		}
		&[data-justify='around'] {
			justify-content: space-around;
		}
		&[data-justify='evenly'] {
			justify-content: space-evenly;
		}

		&[data-align='start'] {
			align-items: flex-start;
		}
		&[data-align='center'] {
			align-items: center;
		}
		&[data-align='end'] {
			align-items: flex-end;
		}
		&[data-align='stretch'] {
			align-items: stretch;
		}

		&[data-max-width='xs'] {
			max-width: var(--max-width-xs);
		}
		&[data-max-width='sm'] {
			max-width: var(--max-width-sm);
		}
		&[data-max-width='md'] {
			max-width: var(--max-width-md);
		}
		&[data-max-width='lg'] {
			max-width: var(--max-width-lg);
		}
		&[data-max-width='xl'] {
			max-width: var(--max-width-xl);
		}
		&[data-max-width='content'] {
			max-width: var(--max-width-content);
		}
		&[data-max-width='full'] {
			max-width: 100%;
		}
	}
</style>
