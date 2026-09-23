<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-ink-200 bg-ink-50">
	<div class="shell flex flex-col gap-6 py-12 sm:flex-row sm:items-center sm:justify-between">
		<div>
			<p class="flex items-center gap-2.5">
				<img src="/favicon.svg" alt="" width="24" height="24" class="rounded" />
				<span class="font-display text-xl font-semibold text-ink-900">Liviana</span>
			</p>
			<p class="mt-2 max-w-sm text-sm leading-relaxed text-ink-600">
				Tus imágenes se convierten dentro de tu navegador. Nunca se suben a ningún servidor.
			</p>
		</div>

		<div class="flex flex-col gap-4 sm:items-end">
			<nav class="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm" aria-label="Enlaces legales">
				<a
					href="/terminos"
					class="text-ink-700 underline underline-offset-4 transition-colors duration-200 hover:text-ember-700"
				>
					Términos y condiciones
				</a>
				<a
					href="/privacidad"
					class="text-ink-700 underline underline-offset-4 transition-colors duration-200 hover:text-ember-700"
				>
					Política de privacidad
				</a>
			</nav>

			<p class="text-sm text-ink-600">
				Hecho por
				<a
					href="https://iteraciona.com"
					target="_blank"
					rel="noopener noreferrer"
					class="font-semibold text-moss-700 underline underline-offset-4 transition-colors duration-200 hover:text-ember-700"
				>
					Iteraciona
				</a>
				<span class="text-ink-400" aria-hidden="true">·</span>
				<span class="tabular-nums">{year}</span>
			</p>
		</div>
	</div>
</footer>
