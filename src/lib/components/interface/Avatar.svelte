<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	type Size = 'sm' | 'md' | 'lg' | 'xl';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		src?: string | null;
		alt: string;
		size?: Size;
		fallback?: string;
	}

	let { src = null, alt, size = 'md', fallback = undefined, class: className = '', ...rest }: Props = $props();

	const initials = $derived(fallback || alt.charAt(0).toUpperCase());
	let imageError = $state(false);

	const handleImageError = () => {
		imageError = true;
	};
</script>

<div class="avatar {className}" data-size={size} {...rest}>
	{#if src && !imageError}
		<img {src} {alt} onerror={handleImageError} />
	{:else}
		<span class="initials">{initials}</span>
	{/if}
</div>

<style>
	.avatar {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: var(--radius);
		background-color: var(--text-primary);
		color: var(--bg);
		font-weight: 700;
		overflow: hidden;
		flex-shrink: 0;
	}

	.avatar[data-size='sm'] {
		width: var(--xl);
		height: var(--xl);
		font-size: var(--sm);
	}

	.avatar[data-size='md'] {
		width: var(--xxl);
		height: var(--xxl);
		font-size: var(--md);
	}

	.avatar[data-size='lg'] {
		width: var(--xxxl);
		height: var(--xxxl);
		font-size: var(--lg);
	}

	.avatar[data-size='xl'] {
		width: var(--xxxxl);
		height: var(--xxxxl);
		font-size: var(--xl);
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.initials {
		user-select: none;
	}
</style>
