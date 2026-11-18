<script lang="ts">
	import JobRow from './JobRow.svelte';
	import QualityPicker from './QualityPicker.svelte';
	import TweenNumber from './TweenNumber.svelte';
	import PromoBanner from '$lib/components/site/promo/PromoBanner.svelte';
	import { promo } from '$lib/stores/promo.svelte';
	import { queue } from '$lib/stores/queue.svelte';
	import { formatBytes } from '$lib/utils/format';

	interface Props {
		selectedId: string | null;
		onselect: (id: string) => void;
		onadd: () => void;
		canAdd: boolean;
	}

	let { selectedId, onselect, onadd, canAdd }: Props = $props();

	const hasResults = $derived(queue.completed.length > 0);
	const showTotals = $derived(hasResults && !queue.isRunning);
	const ratio = $derived(
		queue.totalOutput > 0 ? Math.max(1, queue.totalSource / queue.totalOutput) : 1
	);
	const bytes = (value: number) => formatBytes(Math.round(value));
</script>

<aside
	class="flex flex-col border-t border-ink-200 bg-white lg:min-h-0 lg:w-[380px] lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l"
	aria-label="Ajustes y lista de imágenes"
>
	<div class="flex flex-col gap-5 border-b border-ink-200 p-5">
		<QualityPicker />

		<div class="flex flex-col gap-2">
			<button
				type="button"
				class="btn btn-primary w-full"
				onclick={() => queue.run()}
				disabled={queue.isRunning || queue.jobs.length === 0}
			>
				{#if queue.isRunning}
					<span class="h-4 w-4 rounded-full border-2 border-white/40 border-t-white spin" aria-hidden="true"></span>
					Convirtiendo <span class="num">{queue.progress}%</span>
				{:else if hasResults}
					Volver a convertir en {queue.qualityLabel.toLowerCase()}
				{:else}
					Convertir {queue.jobs.length === 1 ? 'a WebP' : `${queue.jobs.length} a WebP`}
				{/if}
			</button>

			{#if hasResults && !queue.isRunning}
				<button type="button" class="btn btn-dark w-full" onclick={() => queue.downloadAll()}>
					{queue.completed.length === 1
						? 'Descargar la imagen'
						: `Descargar las ${queue.completed.length} en un ZIP`}
				</button>
			{/if}
		</div>

		{#if queue.isRunning}
			<div
				class="h-1 w-full overflow-hidden rounded-full bg-ink-150"
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

		{#if showTotals}
			<div class="flex items-end justify-between gap-4" role="status">
				<div>
					<p class="label">Peso total</p>
					<p class="num mt-1 text-sm text-ink-600">
						<span class="line-through decoration-ink-400">{formatBytes(queue.totalSource)}</span>
						→
						<span class="font-medium text-ink-900">
							<TweenNumber value={queue.totalOutput} from={queue.totalSource} format={bytes} duration={1000} />
						</span>
					</p>
				</div>
				<p class="text-right">
					<span class="num block text-3xl leading-none font-medium text-moss-700">
						<TweenNumber value={ratio} from={1} format={(value) => `${value.toFixed(1)}×`} duration={1000} />
					</span>
					<span class="mt-1 block text-xs text-ink-500">más livianas</span>
				</p>
			</div>

			{#if queue.networkRequests !== null}
				<p class="flex items-start gap-2 text-xs leading-relaxed text-ink-600">
					<svg class="mt-0.5 h-3.5 w-3.5 shrink-0 text-moss-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
						<path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6z" />
						<path d="M9 12l2 2 4-4" />
					</svg>
					<span>
						Medido en esta pestaña:
						<strong class="num font-medium text-ink-900">
							{queue.networkRequests === 1 ? '1 solicitud' : `${queue.networkRequests} solicitudes`}
						</strong>
						de red durante la conversión.
						{#if queue.networkRequests !== 0}
							Ninguna lleva tus imágenes; puedes revisarlas en la pestaña Red de tu navegador.
						{/if}
					</span>
				</p>
			{/if}
		{/if}
	</div>

	{#if queue.rejected.length > 0}
		<div class="mx-5 mt-4 rounded-lg bg-ember-50 p-3 text-sm text-ember-900" role="status">
			<div class="flex items-start justify-between gap-3">
				<p class="font-medium">
					{queue.rejected.length}
					{queue.rejected.length === 1 ? 'archivo quedó fuera' : 'archivos quedaron fuera'}
				</p>
				<button
					type="button"
					class="text-xs font-medium underline underline-offset-4"
					onclick={() => queue.dismissRejected()}
				>
					Entendido
				</button>
			</div>
			<ul class="mt-1 flex flex-col gap-0.5 text-xs">
				{#each queue.rejected as item (item.name)}
					<li><span class="font-medium">{item.name}</span>: {item.reason}</li>
				{/each}
			</ul>
		</div>
	{/if}

	<div class="flex items-center justify-between px-5 pt-4 pb-1">
		<h2 class="label">
			<span class="num">{queue.jobs.length}</span>
			{queue.jobs.length === 1 ? 'imagen' : 'imágenes'}
		</h2>
		<div class="flex gap-1">
			<button type="button" class="rounded-md px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-40" onclick={onadd} disabled={!canAdd}>
				Agregar
			</button>
			<button type="button" class="rounded-md px-2 py-1 text-xs font-medium text-ink-600 hover:bg-ink-100 hover:text-ink-900 disabled:opacity-40" onclick={() => queue.clear()} disabled={queue.isRunning}>
				Vaciar
			</button>
		</div>
	</div>

	<ul class="flex flex-col gap-0.5 px-3 pb-4">
		{#each queue.jobs as job (job.id)}
			<JobRow {job} selected={job.id === selectedId} {onselect} />
		{/each}
	</ul>

	<!-- Below 1280px there is no room for a left column, so the banner closes the panel. -->
	{#if !promo.wide && promo.current}
		<div class="border-t border-ink-200 p-5">
			<PromoBanner banner={promo.current} />
		</div>
	{/if}
</aside>
