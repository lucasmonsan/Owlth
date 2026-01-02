<script lang="ts">
	import type { PageData } from '../$types';
	import * as m from '$lib/paraglide/messages';

	let { data }: { data: PageData } = $props();
</script>

<h1>Dashboard</h1>
<p>{m.welcome_back} <strong>{data.user?.email}</strong></p>
