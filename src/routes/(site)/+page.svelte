<script lang="ts">
	import { onMount } from 'svelte';
	import Dropzone from '$lib/components/site/converter/Dropzone.svelte';
	import QualityPicker from '$lib/components/site/converter/QualityPicker.svelte';
	import QueuePanel from '$lib/components/site/converter/QueuePanel.svelte';
	import { queue } from '$lib/stores/queue.svelte';
	import { supportsWebp } from '$lib/services/converter';

	let canEncode = $state(true);
	let hero: HTMLElement;
	let workbench: HTMLElement;
	let explainer: HTMLElement;

	function handleFiles(files: File[]) {
		queue.addFiles(files);
	}

	onMount(() => {
		canEncode = supportsWebp();

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) return;

		let cleanup: (() => void) | undefined;

		// GSAP is loaded lazily so the converter stays usable even if the bundle is slow.
		(async () => {
			const { gsap } = await import('gsap');
			const { ScrollTrigger } = await import('gsap/ScrollTrigger');

			gsap.registerPlugin(ScrollTrigger);

			const context = gsap.context(() => {
				// Hero reveal: animates FROM a shifted state, so the default render is already correct.
				gsap.from(hero.querySelectorAll('[data-reveal]'), {
					y: 24,
					opacity: 0,
					duration: 0.9,
					ease: 'expo.out',
					stagger: 0.09
				});

				gsap.from(workbench, {
					y: 40,
					opacity: 0,
					duration: 1,
					ease: 'expo.out',
					scrollTrigger: {
						trigger: workbench,
						start: 'top 85%',
						once: true
					}
				});

				ScrollTrigger.batch(explainer.querySelectorAll('[data-step]'), {
					start: 'top 88%',
					once: true,
					onEnter: (batch) =>
						gsap.from(batch, {
							y: 32,
							opacity: 0,
							duration: 0.8,
							ease: 'expo.out',
							stagger: 0.12,
							overwrite: true
						})
				});

				// Subtle parallax on the hero rule; scrubbed so it tracks the scroll exactly.
				gsap.to('[data-parallax]', {
					yPercent: 18,
					ease: 'none',
					scrollTrigger: {
						trigger: hero,
						start: 'top top',
						end: 'bottom top',
						scrub: 0.6
					}
				});
			});

			cleanup = () => context.revert();
		})();

		return () => cleanup?.();
	});
</script>

<svelte:head>
	<title>Liviana — Convierte tus imágenes a WebP sin subirlas a ningún lado</title>
	<meta
		name="description"
		content="Arrastra tus JPG, PNG, GIF o AVIF y obtén archivos WebP más livianos. Todo ocurre dentro de tu navegador: las imágenes nunca salen de tu equipo."
	/>
	<meta property="og:title" content="Liviana — Tus imágenes, más livianas" />
	<meta
		property="og:description"
		content="Convierte a WebP sin subir nada. Todo ocurre dentro de tu navegador."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/icon-512.png" />
	<meta name="twitter:card" content="summary" />
</svelte:head>

<!-- Hero -->
<section bind:this={hero} class="relative overflow-hidden bg-moss-900 text-white">
	<div
		data-parallax
		class="pointer-events-none absolute inset-x-0 top-1/3 h-px bg-moss-700"
		aria-hidden="true"
	></div>

	<div class="shell relative py-20 sm:py-28 lg:py-32">
		<div data-reveal class="mb-10 flex items-center gap-3">
			<img src="/favicon.svg" alt="" width="34" height="34" class="rounded-md" />
			<span class="font-display text-2xl font-semibold tracking-tight text-white">Liviana</span>
		</div>

		<p data-reveal class="mb-6 text-sm font-semibold text-ember-300">
			Sin cuentas, sin subidas, sin esperas
		</p>

		<h1 data-reveal class="display-xl prose-measure text-white">
			Tus imágenes pesan de más. Arrástralas y quedan en WebP.
		</h1>

		<p data-reveal class="lede prose-measure mt-6 text-moss-100">
			Suelta una o cien imágenes, elige cuánta calidad quieres conservar y descárgalas convertidas.
			Todo el trabajo ocurre dentro de tu navegador, así que tus archivos nunca llegan a un servidor
			ni hay nada que borrar después.
		</p>

		<div data-reveal class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-moss-200">
			<span class="flex items-center gap-2">
				<span class="h-1.5 w-1.5 rounded-full bg-ember-400" aria-hidden="true"></span>
				JPG, PNG, GIF, AVIF, BMP, TIFF y SVG
			</span>
			<span class="flex items-center gap-2">
				<span class="h-1.5 w-1.5 rounded-full bg-ember-400" aria-hidden="true"></span>
				Cuatro niveles de calidad o el tuyo propio
			</span>
			<span class="flex items-center gap-2">
				<span class="h-1.5 w-1.5 rounded-full bg-ember-400" aria-hidden="true"></span>
				Descarga en lote como ZIP
			</span>
		</div>
	</div>
</section>

<!-- Workbench -->
<section bind:this={workbench} class="shell -mt-10 pb-20">
	{#if !canEncode}
		<div class="panel mb-6 border-danger-500 bg-white p-5" role="alert">
			<p class="font-semibold text-danger-700">Este navegador no puede generar archivos WebP.</p>
			<p class="mt-1 text-sm text-ink-700">
				Prueba con una versión reciente de Chrome, Edge, Firefox o Safari.
			</p>
		</div>
	{/if}

	<div class="flex flex-col gap-8">
		<div class="panel p-4 shadow-lg sm:p-6">
			<Dropzone onfiles={handleFiles} disabled={queue.isRunning || !canEncode} />
		</div>

		{#if queue.jobs.length > 0}
			<QualityPicker />
			<QueuePanel />
		{/if}
	</div>
</section>

<!-- Explainer -->
<section bind:this={explainer} class="shell pb-28">
	<h2 class="display-lg prose-measure mb-12 text-ink-900">
		Qué pasa exactamente con tus archivos
	</h2>

	<div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
		<div data-step>
			<h3 class="display-md mb-3 text-ink-900">Se quedan contigo</h3>
			<p class="text-sm leading-relaxed text-ink-700">
				La conversión usa el motor gráfico de tu propio navegador. No hay carga al servidor, no hay
				archivo temporal, no hay copia en ningún disco ajeno. No es una promesa de privacidad: es
				que técnicamente no existe el envío.
			</p>
		</div>

		<div data-step>
			<h3 class="display-md mb-3 text-ink-900">Tú decides el equilibrio</h3>
			<p class="text-sm leading-relaxed text-ink-700">
				Cada nivel de calidad cambia cuánto detalle se conserva frente a cuánto pesa el resultado.
				Puedes convertir el mismo lote varias veces con ajustes distintos y comparar el peso final
				antes de descargar.
			</p>
		</div>

		<div data-step>
			<h3 class="display-md mb-3 text-ink-900">La transparencia se respeta</h3>
			<p class="text-sm leading-relaxed text-ink-700">
				Los PNG y SVG con fondo transparente conservan su canal alfa. Si una imagen ya estaba bien
				optimizada y el WebP sale más pesado, te lo decimos en lugar de inventar un ahorro que no
				existe.
			</p>
		</div>
	</div>
</section>
