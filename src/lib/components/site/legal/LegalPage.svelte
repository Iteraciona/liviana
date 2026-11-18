<script lang="ts">
	interface Props {
		title: string;
		summary: string;
		updated: string;
		children?: import('svelte').Snippet;
	}

	let { title, summary, updated, children }: Props = $props();
</script>

<article>
	<header class="border-b border-ink-200 bg-ink-50">
		<div class="shell-narrow py-12 sm:py-16">
			<a
				href="/"
				class="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition-colors duration-150 hover:text-ink-900"
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
					<path d="M14 6l-6 6 6 6" />
				</svg>
				Volver a Liviana
			</a>

			<h1 class="text-3xl sm:text-4xl">{title}</h1>
			<p class="mt-3 max-w-prose text-base leading-relaxed text-ink-700">{summary}</p>
			<p class="mt-5 text-xs text-ink-500">
				Última actualización: <span class="num">{updated}</span>
			</p>
		</div>
	</header>

	<div class="shell-narrow legal-body py-12 sm:py-14">
		{@render children?.()}
	</div>
</article>
