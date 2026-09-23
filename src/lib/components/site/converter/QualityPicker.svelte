<script lang="ts">
	import { queue } from '$lib/stores/queue.svelte';
	import { QUALITY_PRESETS } from '$lib/utils/types';

	function pick(id: string) {
		queue.presetId = id;
		queue.useCustom = false;
	}

	function enableCustom() {
		queue.useCustom = true;
	}
</script>

<section class="panel p-6 sm:p-8" aria-labelledby="quality-heading">
	<div class="mb-6 flex flex-wrap items-baseline justify-between gap-2">
		<h2 id="quality-heading" class="display-md text-ink-900">Calidad de salida</h2>
		<p class="text-sm text-ink-600">
			Actual: <span class="font-semibold text-moss-700">{queue.qualityLabel}</span>
		</p>
	</div>

	<div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{#each QUALITY_PRESETS as preset (preset.id)}
			{@const isActive = !queue.useCustom && queue.presetId === preset.id}
			<button
				type="button"
				class="quality-option"
				class:quality-option-active={isActive}
				aria-pressed={isActive}
				onclick={() => pick(preset.id)}
			>
				<span class="flex items-baseline justify-between gap-2">
					<span class="font-display text-lg font-semibold">{preset.label}</span>
					<span
						class="text-xs font-semibold tabular-nums"
						class:text-moss-200={isActive}
						class:text-ink-500={!isActive}
					>
						{Math.round(preset.quality * 100)}%
					</span>
				</span>
				<span
					class="text-xs leading-relaxed"
					class:text-moss-100={isActive}
					class:text-ink-600={!isActive}
				>
					{preset.hint}
				</span>
			</button>
		{/each}
	</div>

	<div class="mt-6 border-t border-ink-200 pt-6">
		<div class="flex flex-wrap items-center justify-between gap-3">
			<button
				type="button"
				class="text-sm font-semibold text-ink-700 underline underline-offset-4 hover:text-ember-700"
				aria-pressed={queue.useCustom}
				onclick={enableCustom}
			>
				Ajustar la calidad manualmente
			</button>

			{#if queue.useCustom}
				<span class="font-display text-2xl font-semibold tabular-nums text-ember-700">
					{queue.customQuality}%
				</span>
			{/if}
		</div>

		{#if queue.useCustom}
			<label class="mt-4 block">
				<span class="sr-only">Calidad personalizada, de 10 a 100 por ciento</span>
				<input
					type="range"
					min="10"
					max="100"
					step="1"
					class="slider"
					bind:value={queue.customQuality}
				/>
			</label>
			<div class="mt-2 flex justify-between text-xs font-medium text-ink-500">
				<span>Archivo más liviano</span>
				<span>Mayor detalle</span>
			</div>
		{/if}
	</div>
</section>
