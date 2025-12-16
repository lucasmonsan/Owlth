<script lang="ts">
	import { toast } from '$lib';
	import Toast from './Toast.svelte';
</script>

<div class="fixed top-4 right-4 z-50 flex flex-col gap-2" role="region" aria-label="Notificações">
	{#each $toast as item (item.id)}
		<Toast
			type={item.type}
			message={item.message}
			onClose={() => toast.remove(item.id)}
		/>
	{/each}
</div>

