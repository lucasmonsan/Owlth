<script lang="ts">
	let { children, gap = 'var(--sm)', ...rest }: any = $props();
</script>

<form style="gap: {gap}" {...rest}>
	{@render children?.()}
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
