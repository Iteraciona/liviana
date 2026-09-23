<script lang="ts">
	import { queue } from '$lib/stores/queue.svelte';
	import { formatBytes, savingsPercent, truncateMiddle } from '$lib/utils/format';
	import type { ConversionJob } from '$lib/utils/types';

	interface Props {
		job: ConversionJob;
	}

	let { job }: Props = $props();

	const savings = $derived(
		job.outputSize === null ? 0 : savingsPercent(job.sourceSize, job.outputSize)
	);
</script>

<li class="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5">
	<div
		class="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-ink-200 bg-ink-100"
	>
		{#if job.outputUrl}
			<img src={job.outputUrl} alt="Vista previa de {job.name}" class="h-full w-full object-cover" />
		{:else if job.status === 'working'}
			<span
				class="h-6 w-6 rounded-full border-2 border-ink-300 border-t-ember-600 spin-slow"
				aria-hidden="true"
			></span>
		{:else}
			<svg
				class="h-6 w-6 text-ink-400"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				aria-hidden="true"
			>
				<rect x="3" y="4" width="18" height="16" rx="2" />
				<circle cx="8.5" cy="9.5" r="1.5" />
				<path d="M21 16l-5-5-6 6" />
			</svg>
		{/if}
	</div>

	<div class="min-w-0 flex-1">
		<p class="truncate font-semibold text-ink-900" title={job.name}>
			{truncateMiddle(job.name, 40)}
		</p>

		<p class="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-600">
			<span class="tabular-nums">{formatBytes(job.sourceSize)}</span>

			{#if job.status === 'done' && job.outputSize !== null}
				<span aria-hidden="true">→</span>
				<span class="font-semibold tabular-nums text-ink-900">{formatBytes(job.outputSize)}</span>
				{#if job.width && job.height}
					<span class="text-ink-400" aria-hidden="true">·</span>
					<span class="tabular-nums">{job.width} × {job.height}</span>
				{/if}
			{:else if job.status === 'working'}
				<span class="text-ember-700">Convirtiendo…</span>
			{:else if job.status === 'queued'}
				<span>En espera</span>
			{/if}
		</p>

		{#if job.status === 'failed' && job.error}
			<p class="mt-1 text-sm font-medium text-danger-700">{job.error}</p>
		{/if}
	</div>

	<div class="flex shrink-0 items-center gap-2">
		{#if job.status === 'done'}
			{#if savings > 0}
				<span class="badge-win">−{savings}% de peso</span>
			{:else}
				<span class="badge-warn">Ya estaba optimizada</span>
			{/if}

			<button
				type="button"
				class="btn-ghost px-3 py-2"
				onclick={() => queue.downloadOne(job.id)}
				aria-label="Descargar {job.outputName}"
			>
				<svg
					class="h-4 w-4"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="M12 3v12" />
					<path d="M7 11l5 5 5-5" />
					<path d="M4 20h16" />
				</svg>
				<span class="hidden sm:inline">Descargar</span>
			</button>
		{:else if job.status === 'failed'}
			<span class="badge-fail">No se pudo</span>
		{/if}

		<button
			type="button"
			class="btn-quiet"
			onclick={() => queue.removeJob(job.id)}
			aria-label="Quitar {job.name} de la lista"
		>
			<svg
				class="h-4 w-4"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				aria-hidden="true"
			>
				<path d="M6 6l12 12" />
				<path d="M18 6L6 18" />
			</svg>
		</button>
	</div>
</li>
