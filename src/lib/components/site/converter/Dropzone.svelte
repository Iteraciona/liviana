<script lang="ts">
	interface Props {
		onfiles: (files: File[]) => void;
		disabled?: boolean;
	}

	let { onfiles, disabled = false }: Props = $props();

	let isDragging = $state(false);
	let dragDepth = 0;
	let input: HTMLInputElement;

	function handleEnter(event: DragEvent) {
		event.preventDefault();
		if (disabled) return;
		dragDepth++;
		isDragging = true;
	}

	function handleLeave(event: DragEvent) {
		event.preventDefault();
		dragDepth--;
		// Nested children fire leave events too; only reset once the pointer truly exits.
		if (dragDepth <= 0) {
			dragDepth = 0;
			isDragging = false;
		}
	}

	function handleOver(event: DragEvent) {
		event.preventDefault();
		if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragDepth = 0;
		isDragging = false;
		if (disabled) return;

		const files = Array.from(event.dataTransfer?.files ?? []);
		if (files.length > 0) onfiles(files);
	}

	function handlePick(event: Event) {
		const target = event.currentTarget as HTMLInputElement;
		const files = Array.from(target.files ?? []);
		if (files.length > 0) onfiles(files);
		// Reset so picking the same file twice still fires a change event.
		target.value = '';
	}

	function openPicker() {
		if (!disabled) input.click();
	}

	function handleKey(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			openPicker();
		}
	}
</script>

<div
	class="dropzone"
	class:dropzone-active={isDragging}
	role="button"
	tabindex="0"
	aria-label="Arrastra imágenes aquí o pulsa para elegirlas desde tu equipo"
	aria-disabled={disabled}
	ondragenter={handleEnter}
	ondragleave={handleLeave}
	ondragover={handleOver}
	ondrop={handleDrop}
	onclick={openPicker}
	onkeydown={handleKey}
>
	<input
		bind:this={input}
		type="file"
		accept="image/*"
		multiple
		class="hidden"
		onchange={handlePick}
		tabindex="-1"
	/>

	<svg
		class="mb-5 h-12 w-12 text-moss-600 transition-transform duration-300 ease-out"
		class:scale-110={isDragging}
		viewBox="0 0 48 48"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		aria-hidden="true"
	>
		<path d="M24 32V10" />
		<path d="M15 19l9-9 9 9" />
		<path d="M8 32v4a4 4 0 004 4h24a4 4 0 004-4v-4" />
	</svg>

	<p class="display-md mb-2 text-ink-900">
		{isDragging ? 'Suelta las imágenes' : 'Arrastra tus imágenes aquí'}
	</p>

	<p class="prose-measure text-sm leading-relaxed text-ink-600">
		JPG, PNG, GIF, AVIF, BMP, TIFF o SVG. Puedes soltar varias a la vez o
		<span class="font-semibold text-moss-700 underline underline-offset-4">elegirlas desde tu equipo</span>.
	</p>

	<p class="mt-4 text-xs font-medium text-ink-600">Hasta 40 MB por imagen</p>
</div>
