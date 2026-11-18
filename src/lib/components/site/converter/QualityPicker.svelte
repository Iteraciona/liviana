<script lang="ts">
	import { queue } from '$lib/stores/queue.svelte';
	import { QUALITY_PRESETS } from '$lib/utils/types';

	const activePreset = $derived(QUALITY_PRESETS.find((preset) => preset.id === queue.presetId));

	function pick(id: string) {
		queue.presetId = id;
		queue.useCustom = false;
	}
</script>

<section aria-labelledby="quality-heading">
	<div class="mb-2 flex items-baseline justify-between">
		<h2 id="quality-heading" class="label">Calidad</h2>
		<span class="num text-xs text-ink-500">{Math.round(queue.quality * 100)}%</span>
	</div>

	<div class="segmented">
		{#each QUALITY_PRESETS as preset (preset.id)}
			{@const isActive = !queue.useCustom && queue.presetId === preset.id}
			<button
				type="button"
				class="segment"
				class:segment-active={isActive}
				aria-pressed={isActive}
				onclick={() => pick(preset.id)}
			>
				{preset.label}
			</button>
		{/each}
	</div>

	<p class="mt-2 min-h-10 text-xs leading-relaxed text-ink-600">
		{#if queue.useCustom}
			A la izquierda, archivos más livianos; a la derecha, más detalle.
		{:else}
			{activePreset?.hint}
		{/if}
	</p>

	<label class="mt-1 flex cursor-pointer items-center gap-2 text-sm text-ink-700">
		<input
			type="checkbox"
			class="h-4 w-4 accent-ember-600"
			bind:checked={queue.useCustom}
		/>
		Ajustar a mano
	</label>

	{#if queue.useCustom}
		<div class="mt-3 flex items-center gap-3">
			<input
				type="range"
				min="10"
				max="100"
				step="1"
				class="slider"
				aria-label="Calidad personalizada, de 10 a 100 por ciento"
				bind:value={queue.customQuality}
			/>
			<span class="num w-10 text-right text-sm font-medium text-ink-900">{queue.customQuality}%</span>
		</div>
	{/if}
</section>
