<script lang="ts">
	import { page } from '$app/stores';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
</script>

<SEO
	title="Erro {$page.status}"
	description="Ocorreu um erro ao processar sua solicitação"
/>

<Main center fullWidth maxWidth="content">
	<Div column gap="var(--lg)" center>
		<Heading level={1}>
			{#if $page.status === 404}
				404 - Página não encontrada
			{:else if $page.status === 500}
				500 - Erro interno
			{:else}
				Oops! Algo deu errado
			{/if}
		</Heading>

		<Text size="lg" align="center" variant="muted">
			{$page.error?.message || 'Ocorreu um erro inesperado'}
		</Text>

		{#if $page.status === 404}
			<Text align="center">
				A página que você procura não existe ou foi movida.
			</Text>
		{:else if $page.status === 500}
			<Text align="center">
				Nossos servidores encontraram um problema. Tente novamente em alguns
				instantes.
			</Text>
		{/if}

		<Div gap="var(--sm)" justify="center">
			<Button href="/" variant="primary">Voltar para Home</Button>
			<Button onclick={() => window.location.reload()} variant="outline">
				Tentar Novamente
			</Button>
		</Div>
	</Div>
</Main>
