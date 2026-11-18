<script lang="ts">
	import type { Banner } from '$lib/config/banners';

	interface Props {
		banner: Banner;
	}

	let { banner }: Props = $props();
</script>

<!-- Square, never larger than 280px, so it reads the same on a phone and on a wide screen. -->
<figure class="promo">
	<figcaption class="promo-caption">De Iteraciona, quienes hacen Liviana</figcaption>

	{#if banner.kind === 'image'}
		<a href={banner.href} target="_blank" rel="noopener" class="promo-link">
			<img
				src={banner.src}
				alt={banner.alt}
				width="280"
				height="280"
				decoding="async"
				class="aspect-square w-full rounded-xl object-cover"
			/>
		</a>
	{:else}
		<a
			href={banner.href}
			target="_blank"
			rel="noopener"
			class="promo-link promo-card"
			class:promo-card-ember={banner.tone === 'ember'}
			class:promo-card-moss={banner.tone === 'moss'}
		>
			<span class="promo-eyebrow">{banner.eyebrow}</span>
			<span class="promo-title">{banner.title}</span>
			<span class="promo-text">{banner.text}</span>
			<span class="promo-cta">
				{banner.cta}
				<svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path d="M7 17L17 7" />
					<path d="M8 7h9v9" />
				</svg>
			</span>
		</a>
	{/if}
</figure>
