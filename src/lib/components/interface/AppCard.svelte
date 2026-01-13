<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';
	import Logo from '$lib/components/icons/Logo.svelte';
	import EmailIcon from '$lib/components/icons/EmailIcon.svelte';
	import GoogleIcon from '$lib/components/icons/GoogleIcon.svelte';
	import BrazilIcon from '$lib/components/icons/BrazilIcon.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';

	interface Props extends HTMLAnchorAttributes {
		id: string; // Adicionado ID para tracking
		name: string;
		description?: string;
		url: string;
		icon?: string;
		color: string;
		isUsed: boolean;
	}

	let { id, name, description, url, icon, color, isUsed = false, ...rest }: Props = $props();

	const iconMap: Record<string, any> = {
		Logo,
		EmailIcon,
		GoogleIcon,
		BrazilIcon
	};

	const IconComponent = $derived(icon && iconMap[icon] ? iconMap[icon] : null);

	async function handleClick() {
		try {
			// Fire and forget tracking
			fetch('/api/user/app-usage', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ appId: id })
			});
		} catch (e) {
			console.error('Failed to track app usage', e);
		}
	}
</script>

<a href={url} class="app-card" class:used={isUsed} style="--app-color: {color}" onclick={handleClick} target="_blank" {...rest}>
	<Div align="center" gap="var(--xxs)">
		<Div>
			{#if IconComponent}
				<IconComponent height="var(--xxxxl)" />
			{:else}
				<span style="font-size: var(--xxl)">{icon || '📦'}</span>
			{/if}
		</Div>
		<Div column>
			<Heading level={4}>{name}</Heading>
			{#if description}
				<Text size="sm" weight="medium" class="description">{description}</Text>
			{/if}
		</Div>
	</Div>
</a>

<style>
	a.app-card {
		padding: var(--xs);
		border-radius: var(--radius);
		background: var(--app-color);
		opacity: 0.6;
		transition: all var(--normal);
		text-decoration: none;
		color: white;
		border: 2px solid transparent;
		position: relative;
		overflow: hidden;
	}

	a.app-card.used {
		opacity: 1;
	}

	a.app-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
		border-color: rgba(255, 255, 255, 0.4);
		opacity: 1;
	}

	.app-card::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), transparent);
		opacity: 0;
		transition: opacity var(--normal);
	}

	a.app-card:hover::before {
		opacity: 1;
	}

	.icon-container {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 48px;
		height: 48px;
		border-radius: 12px; /* radius-md */
		background: rgba(255, 255, 255, 0.2);
		backdrop-filter: blur(4px);
		color: var(--white);
		flex-shrink: 0;
	}

	.emoji-icon {
		font-size: 24px;
		line-height: 1;
	}

	a.app-card :global(.heading) {
		color: white !important;
		font-size: var(--lg) !important;
	}

	a.app-card :global(.description) {
		color: var(--border-color) !important;
		line-height: 1.3;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
