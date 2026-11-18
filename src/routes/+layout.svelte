<script lang="ts">
	import { SITE } from '$lib/config/site';

	let { children } = $props();

	// Bump when the icons change: browsers cache favicons aggressively and keep
	// showing the old one otherwise.
	const ICON_VERSION = '2';
</script>

<svelte:head>
	<link rel="icon" href="/favicon.ico?v={ICON_VERSION}" sizes="48x48" />
	<link rel="icon" href="/favicon.svg?v={ICON_VERSION}" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png?v={ICON_VERSION}" />
	<link rel="manifest" href="/site.webmanifest?v={ICON_VERSION}" />
	<meta name="theme-color" content={SITE.themeColor} />
</svelte:head>

{@render children()}
