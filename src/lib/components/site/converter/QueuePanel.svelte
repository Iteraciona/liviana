<script lang="ts">
	import JobRow from './JobRow.svelte';
	import { queue } from '$lib/stores/queue.svelte';
	import { formatBytes, savingsPercent } from '$lib/utils/format';

	const totalSavings = $derived(savingsPercent(queue.totalSource, queue.totalOutput));
	const hasResults = $derived(queue.completed.length > 0);
</script>

<section class="flex flex-col gap-6" aria-labelledby="queue-heading">
	<div class="flex flex-wrap items-center justify-between gap-4">
		<h2 id="queue-heading" class="display-md text-ink-900">
			{queue.jobs.length}
			{queue.jobs.length === 1 ? 'imagen lista para convertir' : 'imágenes listas para convertir'}
		</h2>

		<button type="button" class="btn-quiet" onclick={() => queue.clear()} disabled={queue.isRunning}>
			Vaciar la lista
		</button>
	</div>

	{#if queue.rejected.length > 0}
		<div class="panel-sunk border-ember-300 bg-ember-50 p-4" role="status">
			<div class="flex items-start justify-between gap-4">
				<div>
					<p class="font-semibold text-ember-900">
						{queue.rejected.length}
						{queue.rejected.length === 1 ? 'archivo quedó fuera' : 'archivos quedaron fuera'}
					</p>
					<ul class="mt-2 flex flex-col gap-1 text-sm text-ember-900">
						{#each queue.rejected as item (item.name)}
							<li><span class="font-medium">{item.name}</span> — {item.reason}</li>
						{/each}
					</ul>
				</div>
				<button
					type="button"
					class="btn-quiet text-ember-900"
					onclick={() => queue.dismissRejected()}
					aria-label="Cerrar este aviso"
				>
					Entendido
				</button>
			</div>
		</div>
	{/if}

	<div class="flex flex-wrap items-center gap-3">
		<button
			type="button"
			class="btn-primary"
			onclick={() => queue.run()}
			disabled={queue.isRunning || queue.jobs.length === 0}
		>
			{#if queue.isRunning}
				<span
					class="h-4 w-4 rounded-full border-2 border-white/40 border-t-white spin-slow"
					aria-hidden="true"
				></span>
				Convirtiendo {queue.progress}%
			{:else if hasResults}
				Volver a convertir en {queue.qualityLabel.toLowerCase()}
			{:else}
				Convertir a WebP
			{/if}
		</button>

		{#if hasResults && !queue.isRunning}
			<button type="button" class="btn-solid" onclick={() => queue.downloadAll()}>
				{queue.completed.length === 1
					? 'Descargar la imagen'
					: `Descargar las ${queue.completed.length} en un ZIP`}
			</button>
		{/if}
	</div>

	{#if queue.isRunning}
		<div
			class="h-1.5 w-full overflow-hidden rounded-full bg-ink-200"
			role="progressbar"
			aria-valuenow={queue.progress}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-label="Progreso de la conversión"
		>
			<div
				class="h-full rounded-full bg-ember-600 transition-[width] duration-300 ease-out"
				style:width="{queue.progress}%"
			></div>
		</div>
	{/if}

	{#if hasResults && !queue.isRunning}
		<div class="panel-sunk flex flex-wrap items-center justify-between gap-4 p-5">
			<div>
				<p class="text-sm font-medium text-ink-600">Peso total</p>
				<p class="font-display text-2xl font-semibold text-ink-900">
					<span class="tabular-nums line-through decoration-ink-400">
						{formatBytes(queue.totalSource)}
					</span>
					<span class="mx-2 text-ink-400" aria-hidden="true">→</span>
					<span class="tabular-nums text-moss-700">{formatBytes(queue.totalOutput)}</span>
				</p>
			</div>

			{#if totalSavings > 0}
				<p class="font-display text-4xl font-semibold tabular-nums text-ember-700">
					−{totalSavings}%
				</p>
			{/if}
		</div>
	{/if}

	<ul class="flex flex-col gap-3">
		{#each queue.jobs as job (job.id)}
			<JobRow {job} />
		{/each}
	</ul>
</section>
