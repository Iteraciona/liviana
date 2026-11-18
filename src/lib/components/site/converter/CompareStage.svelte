<script lang="ts">
	import { formatBytes, savingsPercent, truncateMiddle } from '$lib/utils/format';
	import type { ConversionJob } from '$lib/utils/types';

	interface Props {
		job: ConversionJob;
	}

	let { job }: Props = $props();

	let sourceUrl = $state<string | null>(null);
	let previewFailed = $state(false);
	let natural = $state({ width: 4, height: 3 });
	let split = $state(50);
	let zoom = $state<'fit' | 'actual'>('fit');
	let frame: HTMLElement | undefined = $state();
	let dragging = false;

	// Each job gets its own preview URL, released as soon as another job is shown.
	$effect(() => {
		const url = URL.createObjectURL(job.file);
		sourceUrl = url;
		previewFailed = false;
		split = 50;
		return () => URL.revokeObjectURL(url);
	});

	const canCompare = $derived(job.status === 'done' && job.outputUrl !== null);
	const savings = $derived(
		job.outputSize === null ? 0 : savingsPercent(job.sourceSize, job.outputSize)
	);

	function handleLoad(event: Event) {
		const image = event.currentTarget as HTMLImageElement;
		if (image.naturalWidth && image.naturalHeight) {
			natural = { width: image.naturalWidth, height: image.naturalHeight };
		}
	}

	function moveTo(event: PointerEvent) {
		if (!frame) return;
		const rect = frame.getBoundingClientRect();
		const ratio = (event.clientX - rect.left) / rect.width;
		split = Math.round(Math.min(1, Math.max(0, ratio)) * 1000) / 10;
	}

	function handleDown(event: PointerEvent) {
		if (!canCompare || event.button !== 0) return;
		dragging = true;
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		moveTo(event);
	}

	function handleMove(event: PointerEvent) {
		if (dragging) moveTo(event);
	}

	function handleUp() {
		dragging = false;
	}
</script>

<section class="stage flex flex-col bg-ink-100 lg:min-h-0 lg:flex-1" aria-label="Comparación de la imagen">
	<div class="flex flex-wrap items-center justify-between gap-2 px-4 pt-4 sm:px-6">
		<span class="stage-tag">
			Original
			<span class="num text-ink-500">{formatBytes(job.sourceSize)}</span>
		</span>

		<div class="flex items-center gap-2">
			<span class="hidden max-w-56 truncate text-xs text-ink-500 md:inline" title={job.name}>
				{truncateMiddle(job.name, 36)}
			</span>
			<div class="flex rounded-md bg-ink-150 p-0.5" role="group" aria-label="Zoom">
				<button
					type="button"
					class="rounded px-2 py-1 text-xs font-medium"
					class:bg-white={zoom === 'fit'}
					class:text-ink-900={zoom === 'fit'}
					class:text-ink-600={zoom !== 'fit'}
					aria-pressed={zoom === 'fit'}
					onclick={() => (zoom = 'fit')}
				>
					Ajustar
				</button>
				<button
					type="button"
					class="num rounded px-2 py-1 text-xs font-medium"
					class:bg-white={zoom === 'actual'}
					class:text-ink-900={zoom === 'actual'}
					class:text-ink-600={zoom !== 'actual'}
					aria-pressed={zoom === 'actual'}
					onclick={() => (zoom = 'actual')}
				>
					1:1
				</button>
			</div>
		</div>

		<span class="stage-tag">
			WebP
			{#if canCompare && job.outputSize !== null}
				<span class="num text-ink-500">{formatBytes(job.outputSize)}</span>
				{#if savings > 0}
					<span class="badge-win">−{savings}%</span>
				{:else}
					<span class="badge-neutral">sin ahorro</span>
				{/if}
			{:else if job.status === 'working'}
				<span class="h-3 w-3 rounded-full border-2 border-ink-300 border-t-ember-600 spin" aria-hidden="true"></span>
				<span class="text-ink-500" role="status">convirtiendo…</span>
			{:else if job.status === 'failed'}
				<span class="text-danger-700" role="status">{job.error ?? 'no se pudo convertir'}</span>
			{:else}
				<span class="text-ink-500">pendiente</span>
			{/if}
		</span>
	</div>

	<div class="stage-view" class:stage-view-actual={zoom === 'actual'}>
		<div
			bind:this={frame}
			class="stage-frame"
			class:cursor-ew-resize={canCompare}
			style:--ratio={natural.width / natural.height}
			style:--w={natural.width}
			style:--h={natural.height}
			onpointerdown={handleDown}
			onpointermove={handleMove}
			onpointerup={handleUp}
			onpointercancel={handleUp}
			role="presentation"
		>
			{#if previewFailed}
				<p class="absolute inset-0 grid place-items-center p-6 text-center text-sm text-ink-600">
					Tu navegador no puede mostrar esta imagen.
				</p>
			{:else if sourceUrl}
				<img
					src={sourceUrl}
					alt="Original de {job.name}"
					class="stage-img"
					onload={handleLoad}
					onerror={() => (previewFailed = true)}
				/>
			{/if}

			{#if canCompare && job.outputUrl}
				<img
					src={job.outputUrl}
					alt="Versión WebP de {job.name}"
					class="stage-img"
					style:clip-path="inset(0 0 0 {split}%)"
				/>
				<div class="stage-divider" style:left="{split}%" aria-hidden="true">
					<span class="stage-knob">
						<svg
							class="h-4 w-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M9 6l-6 6 6 6" />
							<path d="M15 6l6 6-6 6" />
						</svg>
					</span>
				</div>
			{/if}
		</div>

	</div>

	{#if canCompare}
		<label class="sr-only">
			Posición del divisor: a la izquierda el original, a la derecha el WebP
			<input class="stage-range" type="range" min="0" max="100" step="1" bind:value={split} />
		</label>
	{/if}
</section>
