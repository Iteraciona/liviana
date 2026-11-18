<script lang="ts">
	import '../../site.css';
	import SiteHeader from '$lib/components/site/SiteHeader.svelte';
	import Footer from '$lib/components/site/Footer.svelte';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex min-h-dvh flex-col">
	<SiteHeader />
	<main class="flex flex-1 flex-col">
		{@render children?.()}
	</main>
	<Footer />
</div>
