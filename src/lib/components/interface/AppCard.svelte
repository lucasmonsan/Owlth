<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		name: string;
		description?: string;
		url: string;
		icon?: string;
		color: string;
		isUsed: boolean;
	}

	let { name, description, url, icon, color, isUsed, ...rest }: Props =
		$props();
</script>

<a
	href={url}
	class="app-card"
	class:used={isUsed}
	style="--app-color: {color}"
	{...rest}
>
	<div class="icon">{icon || '📦'}</div>
	<h3>{name}</h3>
	{#if description}
		<p>{description}</p>
	{/if}
</a>

<style>
	.app-card {
		display: flex;
		flex-direction: column;
		gap: var(--xs);
		padding: var(--md);
		border-radius: var(--radius-md);
		background: var(--app-color);
		opacity: 0.3;
		transition: all var(--normal);
		text-decoration: none;
		color: white;
		border: 2px solid transparent;
	}

	.app-card.used {
		opacity: 1;
	}

	.app-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border-color: rgba(255, 255, 255, 0.2);
	}

	.icon {
		font-size: var(--xxxl);
		line-height: 1;
	}

	h3 {
		margin: 0;
		font-size: var(--lg);
		font-weight: 700;
	}

	p {
		margin: 0;
		font-size: var(--sm);
		opacity: 0.9;
		line-height: 1.4;
	}
</style>
