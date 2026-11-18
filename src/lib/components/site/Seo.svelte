<script lang="ts">
	import { SITE, absoluteUrl } from '$lib/config/site';

	interface Props {
		/** Full <title>, kept under ~60 characters. */
		title: string;
		/** Meta description, kept around 140–160 characters. */
		description: string;
		/** Site path of this page, e.g. '/privacidad'. Used for canonical and og:url. */
		path: string;
		/** Shorter title for social cards; defaults to `title`. */
		socialTitle?: string;
		keywords?: string[];
		/** JSON-LD objects for this page. */
		schema?: Record<string, unknown>[];
	}

	let { title, description, path, socialTitle, keywords = [], schema = [] }: Props = $props();

	const canonical = $derived(absoluteUrl(path));
	const image = absoluteUrl(SITE.ogImage.path);

	// "</script" inside the JSON would close the tag early; escape the slash.
	const jsonLd = $derived(
		schema.length === 0
			? ''
			: JSON.stringify(
					schema.length === 1 ? schema[0] : { '@context': 'https://schema.org', '@graph': schema }
				).replaceAll('</', '<\\/')
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	{#if keywords.length > 0}
		<meta name="keywords" content={keywords.join(', ')} />
	{/if}
	<meta name="robots" content="index, follow, max-image-preview:large" />
	<link rel="canonical" href={canonical} />

	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={SITE.name} />
	<meta property="og:locale" content={SITE.locale} />
	<meta property="og:url" content={canonical} />
	<meta property="og:title" content={socialTitle ?? title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:image:type" content="image/png" />
	<meta property="og:image:width" content={String(SITE.ogImage.width)} />
	<meta property="og:image:height" content={String(SITE.ogImage.height)} />
	<meta property="og:image:alt" content={SITE.ogImage.alt} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={socialTitle ?? title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="twitter:image:alt" content={SITE.ogImage.alt} />

	{#if jsonLd}
		{@html `<script type="application/ld+json">${jsonLd}</script>`}
	{/if}
</svelte:head>
