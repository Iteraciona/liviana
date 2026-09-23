<script lang="ts">
	import '../../site.css';
	import Footer from '$lib/components/site/Footer.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex min-h-screen flex-col">
	<main class="flex-1">
		{@render children?.()}
	</main>
	<Footer />
</div>
