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
		<div class="shell-narrow py-16 sm:py-20">
			<a
				href="/"
				class="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-moss-700 underline underline-offset-4 transition-colors duration-200 hover:text-ember-700"
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

			<h1 class="display-lg text-ink-900">{title}</h1>
			<p class="lede mt-4 text-ink-700">{summary}</p>
			<p class="mt-6 text-sm font-medium text-ink-600">
				Última actualización: <span class="tabular-nums">{updated}</span>
			</p>
		</div>
	</header>

	<div class="shell-narrow legal-body py-14 sm:py-16">
		{@render children?.()}
	</div>
</article>
