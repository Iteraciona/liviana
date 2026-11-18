<script lang="ts">
	interface Props {
		/** Files are being dragged over the window. */
		active?: boolean;
		disabled?: boolean;
		onpick: () => void;
	}

	let { active = false, disabled = false, onpick }: Props = $props();

	let isMac = $state(false);

	$effect(() => {
		isMac = /Mac|iPhone|iPad/.test(navigator.userAgent);
	});

	function handleSurfaceClick(event: MouseEvent) {
		// The button below already opens the picker; avoid opening it twice.
		if ((event.target as HTMLElement).closest('button')) return;
		if (!disabled) onpick();
	}
</script>

<!-- Pointer convenience only: the "Elegir imágenes" button is the keyboard path, and
     drag-and-drop plus paste are handled at window level by the page. -->
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="intake" class:intake-active={active} onclick={handleSurfaceClick}>
	<svg class="intake-mark mb-6 h-14 w-14" viewBox="0 0 256 256" aria-hidden="true">
		<path
			class="fill-ink-900"
			d="M33 95H117A8 8 0 0 1 125 103V125A6 6 0 0 0 131 131H153A8 8 0 0 1 161 139V223A16 16 0 0 1 145 239H33A16 16 0 0 1 17 223V111A16 16 0 0 1 33 95Z"
		/>
		<rect class="intake-px intake-px-1 fill-ember-500" x="171" y="49" width="36" height="36" rx="7" />
		<rect class="intake-px intake-px-2 fill-ember-500" x="215" y="17" width="24" height="24" rx="5" />
		<rect class="intake-px-extra intake-px-3 fill-ember-400" x="131" y="99" width="20" height="20" rx="4" />
		<rect class="intake-px-extra intake-px-4 fill-ember-400" x="95" y="99" width="16" height="16" rx="3" />
	</svg>

	<h1 class="text-3xl sm:text-4xl">
		{active ? 'Suéltalas aquí' : 'Suelta tus imágenes'}
	</h1>
	<p class="mt-3 text-base text-ink-600">Salen en WebP, más livianas, sin salir de tu equipo.</p>

	<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
		<button type="button" class="btn btn-dark" onclick={onpick} {disabled}>Elegir imágenes</button>
		<span class="flex items-center gap-1.5 text-sm text-ink-500">
			o pega con <kbd class="kbd">{isMac ? '⌘' : 'Ctrl'}</kbd><kbd class="kbd">V</kbd>
		</span>
	</div>

	<p class="num mt-10 text-xs text-ink-500">
		JPG · PNG · GIF · AVIF · BMP · TIFF · SVG — hasta 40 MB cada una
	</p>
</div>
