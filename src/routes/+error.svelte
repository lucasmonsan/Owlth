<script lang="ts">
	import { page } from '$app/state';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Button from '$lib/components/interface/Button.svelte';
	import Main from '$lib/components/layout/Main.svelte';
	import SEO from '$lib/components/layout/SEO.svelte';
	import * as m from '$lib/paraglide/messages';
</script>

<SEO title={m.error_title({ status: page.status })} description={m.error_description()} />

<Main center fullWidth maxWidth="content">
	<Div column gap="var(--lg)" center>
		<Heading level={1}>
			{m.error_title({ status: page.status })}
		</Heading>

		<Text size="lg" align="center" variant="muted">
			{page.error?.message || m.unexpected_error()}
		</Text>

		{#if page.status === 404}
			<Text align="center">{m.error_404()}</Text>
		{:else if page.status === 503}
			<Text align="center">{m.error_503()}</Text>
		{:else if page.status === 504}
			<Text align="center">{m.error_504()}</Text>
		{:else if page.status === 505}
			<Text align="center">{m.error_505()}</Text>
		{:else if page.status === 506}
			<Text align="center">{m.error_506()}</Text>
		{:else if page.status === 507}
			<Text align="center">{m.error_507()}</Text>
		{:else if page.status === 508}
			<Text align="center">{m.error_508()}</Text>
		{:else if page.status === 510}
			<Text align="center">{m.error_510()}</Text>
		{:else if page.status === 511}
			<Text align="center">{m.error_511()}</Text>
		{:else if page.status === 520}
			<Text align="center">{m.error_520()}</Text>
		{:else if page.status === 521}
			<Text align="center">{m.error_521()}</Text>
		{:else if page.status === 522}
			<Text align="center">{m.error_522()}</Text>
		{:else if page.status === 523}
			<Text align="center">{m.error_523()}</Text>
		{:else if page.status === 524}
			<Text align="center">{m.error_524()}</Text>
		{:else if page.status === 525}
			<Text align="center">{m.error_525()}</Text>
		{:else if page.status === 526}
			<Text align="center">{m.error_526()}</Text>
		{:else if page.status === 527}
			<Text align="center">{m.error_527()}</Text>
		{:else if page.status === 528}
			<Text align="center">{m.error_528()}</Text>
		{:else if page.status === 529}
			<Text align="center">{m.error_529()}</Text>
		{:else if page.status === 530}
			<Text align="center">{m.error_530()}</Text>
		{:else if page.status === 598}
			<Text align="center">{m.error_598()}</Text>
		{:else if page.status === 599}
			<Text align="center">{m.error_599()}</Text>
		{:else}
			<Text align="center">{m.error_500()}</Text>
		{/if}

		<Div gap="var(--sm)" justify="center">
			<Button href="/" variant="primary">{m.back_to_home()}</Button>
			<Button onclick={() => window.location.reload()} variant="outline">{m.try_again()}</Button>
		</Div>
	</Div>
</Main>
