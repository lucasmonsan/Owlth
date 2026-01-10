<script lang="ts">
	import type { PageData } from './$types';
	import * as m from '$lib/paraglide/messages';
	import Main from '$lib/components/layout/Main.svelte';
	import Div from '$lib/components/layout/Div.svelte';
	import Heading from '$lib/components/interface/Heading.svelte';
	import Text from '$lib/components/interface/Text.svelte';
	import Avatar from '$lib/components/interface/Avatar.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Main fullWidth maxWidth="content">
	<Div column gap="var(--md)" fullWidth>
		<Div gap="var(--sm)" align="center">
			<Avatar
				src={data.user?.profilePicture ?? undefined}
				alt={data.user?.fullName || data.user?.email || 'User'}
				size="lg"
			/>
			<Div column>
				<Heading level={1}>Dashboard</Heading>
				<Text variant="muted">
					{m.welcome_back()}
					<Text as="span" weight="semibold">{data.user?.email}</Text>
				</Text>
			</Div>
		</Div>

		<!-- Conteúdo do dashboard aqui -->
	</Div>
</Main>
