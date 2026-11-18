<script lang="ts">
	import { onMount } from 'svelte';
	import CompareStage from '$lib/components/site/converter/CompareStage.svelte';
	import Dropzone from '$lib/components/site/converter/Dropzone.svelte';
	import Sidebar from '$lib/components/site/converter/Sidebar.svelte';
	import PromoBanner from '$lib/components/site/promo/PromoBanner.svelte';
	import Seo from '$lib/components/site/Seo.svelte';
	import { organization, webApplication, website } from '$lib/config/schema';
	import { promo } from '$lib/stores/promo.svelte';
	import { queue } from '$lib/stores/queue.svelte';
	import { supportsWebp } from '$lib/services/converter';

	let canEncode = $state(true);
	let picker: HTMLInputElement;
	let isDragging = $state(false);
	let dragDepth = 0;
	let selectedId = $state<string | null>(null);

	const hasJobs = $derived(queue.jobs.length > 0);
	const canAdd = $derived(canEncode && !queue.isRunning);

	// Falls back to the first job when nothing is selected or the selection was removed.
	const selected = $derived(
		queue.jobs.find((job) => job.id === selectedId) ?? queue.jobs[0] ?? null
	);

	function addFiles(files: File[]) {
		if (!canAdd || files.length === 0) return;
		const firstNew = queue.jobs.length;
		queue.addFiles(files);
		const added = queue.jobs[firstNew];
		if (added) selectedId = added.id;
	}

	function openPicker() {
		if (canAdd) picker.click();
	}

	function handlePick(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		addFiles(Array.from(input.files ?? []));
		// Reset so picking the same file twice still fires a change event.
		input.value = '';
	}

	// --- Window-level intake: drop anywhere, paste anywhere ---

	function carriesFiles(event: DragEvent): boolean {
		return event.dataTransfer?.types.includes('Files') ?? false;
	}

	function handleDragEnter(event: DragEvent) {
		if (!carriesFiles(event)) return;
		event.preventDefault();
		dragDepth++;
		isDragging = canAdd;
	}

	function handleDragOver(event: DragEvent) {
		if (!carriesFiles(event)) return;
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = canAdd ? 'copy' : 'none';
	}

	function handleDragLeave(event: DragEvent) {
		if (!carriesFiles(event)) return;
		// Nested elements fire leave events too; only reset once the pointer truly exits.
		dragDepth = Math.max(0, dragDepth - 1);
		if (dragDepth === 0) isDragging = false;
	}

	function handleDrop(event: DragEvent) {
		if (!carriesFiles(event)) return;
		event.preventDefault();
		dragDepth = 0;
		isDragging = false;
		addFiles(Array.from(event.dataTransfer?.files ?? []));
	}

	// Screenshots on the clipboard arrive as "image.png"; give each one a readable name.
	function handlePaste(event: ClipboardEvent) {
		const target = event.target as HTMLElement | null;
		if (target?.closest('input, textarea, [contenteditable="true"]')) return;

		const images = Array.from(event.clipboardData?.files ?? []).filter((file) =>
			file.type.startsWith('image/')
		);
		if (images.length === 0) return;

		event.preventDefault();
		const stamp = new Date().toTimeString().slice(0, 8).replaceAll(':', '-');
		addFiles(
			images.map((file, index) => {
				if (file.name && file.name !== 'image.png') return file;
				const extension = file.type.split('/')[1] ?? 'png';
				const suffix = images.length > 1 ? `-${index + 1}` : '';
				return new File([file], `captura-${stamp}${suffix}.${extension}`, { type: file.type });
			})
		);
	}

	onMount(() => {
		canEncode = supportsWebp();
		const stopPromo = promo.start();

		// A note for whoever opens the console: the privacy claim can be checked right there.
		console.info(
			'%cLiviana%c\nAbre la pestaña Red y convierte algo. Spoiler: no se va a mover nada.',
			'font: 600 16px Geist, system-ui, sans-serif; color: #df6d25',
			'font: 13px system-ui, sans-serif'
		);

		return stopPromo;
	});
</script>

<svelte:window
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	onpaste={handlePaste}
/>

<Seo
	title="Convertir imágenes a WebP gratis y sin subirlas | Liviana"
	socialTitle="Liviana: tus imágenes a WebP, sin subirlas a ningún lado"
	description="Convierte JPG, PNG, GIF, AVIF y SVG a WebP gratis y sin subir nada: todo ocurre en tu navegador. Compara el antes y el después y descarga en ZIP."
	path="/"
	keywords={[
		'convertir a webp',
		'convertidor webp',
		'jpg a webp',
		'png a webp',
		'comprimir imágenes',
		'optimizar imágenes para web',
		'webp gratis',
		'convertir imágenes sin subirlas'
	]}
	schema={[organization, website, webApplication]}
/>

<input
	bind:this={picker}
	type="file"
	accept="image/*"
	multiple
	class="hidden"
	tabindex="-1"
	onchange={handlePick}
/>

{#if !canEncode}
	<div class="border-b border-danger-500/30 bg-danger-50 px-4 py-3 text-sm sm:px-6" role="alert">
		<span class="font-medium text-danger-700">Este navegador no puede generar archivos WebP.</span>
		<span class="text-ink-700">Prueba con una versión reciente de Chrome, Edge, Firefox o Safari.</span>
	</div>
{/if}

{#if hasJobs && selected}
	<h1 class="sr-only">Liviana: convierte tus imágenes a WebP</h1>
	<div class="flex flex-1 flex-col lg:h-[calc(100dvh-3.5rem)] lg:flex-none lg:flex-row">
		{#if promo.wide && promo.current}
			<aside class="w-[312px] shrink-0 border-r border-ink-200 p-4" aria-label="Servicios de Iteraciona">
				<PromoBanner banner={promo.current} />
			</aside>
		{/if}
		<CompareStage job={selected} />
		<Sidebar
			selectedId={selected.id}
			onselect={(id) => (selectedId = id)}
			onadd={openPicker}
			{canAdd}
		/>
	</div>

	{#if isDragging}
		<div class="drop-overlay" aria-hidden="true">Suelta para agregar a la lista</div>
	{/if}
{:else}
	<div
		class="flex flex-1 flex-col gap-4 p-3 sm:p-4 xl:flex-row"
		style="min-height: calc(100dvh - 3.5rem)"
	>
		{#if promo.current}
			<aside
				class="order-last shrink-0 py-4 xl:order-first xl:w-[296px] xl:py-0"
				aria-label="Servicios de Iteraciona"
			>
				<PromoBanner banner={promo.current} />
			</aside>
		{/if}
		<Dropzone active={isDragging} disabled={!canAdd} onpick={openPicker} />
	</div>
{/if}
