<script lang="ts">
	import { queue } from '$lib/stores/queue.svelte';
	import { formatBytes, savingsPercent, truncateMiddle } from '$lib/utils/format';
	import type { ConversionJob } from '$lib/utils/types';

	interface Props {
		job: ConversionJob;
		selected: boolean;
		onselect: (id: string) => void;
	}

	let { job, selected, onselect }: Props = $props();

	let thumbUrl = $state<string | null>(null);
	let thumbFailed = $state(false);

	$effect(() => {
		const url = URL.createObjectURL(job.file);
		thumbUrl = url;
		return () => URL.revokeObjectURL(url);
	});

	const savings = $derived(
		job.outputSize === null ? 0 : savingsPercent(job.sourceSize, job.outputSize)
	);
</script>

<li class="job" class:job-selected={selected}>
	<button
		type="button"
		class="flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-lg p-2 text-left"
		aria-pressed={selected}
		aria-label="Ver {job.name} en la comparación"
		onclick={() => onselect(job.id)}
	>
		<span class="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-ink-150">
			{#if thumbUrl && !thumbFailed}
				<img src={thumbUrl} alt="" class="h-full w-full object-cover" onerror={() => (thumbFailed = true)} />
			{/if}
			{#if job.status === 'working'}
				<span class="absolute inset-0 grid place-items-center bg-ink-900/55" aria-hidden="true">
					<span class="job-working">
						<span class="job-working-block"></span>
						<span class="job-working-cell"></span>
					</span>
				</span>
			{/if}
		</span>

		<span class="min-w-0 flex-1">
			<span class="block truncate text-sm font-medium text-ink-900" title={job.name}>
				{truncateMiddle(job.name, 30)}
			</span>
			<span class="mt-0.5 flex items-center gap-1.5 text-xs text-ink-500">
				{#if job.status === 'done' && job.outputSize !== null}
					<span class="num">{formatBytes(job.sourceSize)} → <span class="text-ink-900">{formatBytes(job.outputSize)}</span></span>
					{#if savings > 0}
						<span class="badge-win">−{savings}%</span>
					{:else}
						<span class="badge-neutral">ya venía liviana</span>
					{/if}
				{:else if job.status === 'failed'}
					<span class="badge-fail">No se pudo</span>
				{:else if job.status === 'working'}
					<span>Convirtiendo…</span>
				{:else}
					<span class="num">{formatBytes(job.sourceSize)}</span>
				{/if}
			</span>
		</span>
	</button>

	{#if job.status === 'done'}
		<button
			type="button"
			class="icon-btn"
			onclick={() => queue.downloadOne(job.id)}
			aria-label="Descargar {job.outputName}"
			title="Descargar"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
				<path d="M12 4v11" />
				<path d="M7 10l5 5 5-5" />
				<path d="M5 20h14" />
			</svg>
		</button>
	{/if}

	<button
		type="button"
		class="icon-btn"
		onclick={() => queue.removeJob(job.id)}
		aria-label="Quitar {job.name} de la lista"
		title="Quitar"
	>
		<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
			<path d="M6 6l12 12" />
			<path d="M18 6L6 18" />
		</svg>
	</button>
</li>
