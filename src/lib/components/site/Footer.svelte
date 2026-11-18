<script lang="ts">
	const year = new Date().getFullYear();
</script>

<footer class="border-t border-ink-200">
	<div
		class="flex flex-col gap-2 px-4 py-4 text-xs text-ink-600 sm:flex-row sm:items-center sm:justify-between sm:px-6"
	>
		<p>
			Hecho por
			<a
				href="https://iteraciona.com"
				target="_blank"
				rel="noopener noreferrer"
				class="font-medium text-ink-800 underline decoration-ink-300 underline-offset-4 hover:decoration-ember-600"
			>
				Iteraciona
			</a>
			<span aria-hidden="true">·</span>
			<span class="num">{year}</span>
		</p>

		<nav class="flex gap-4" aria-label="Enlaces legales">
			<a href="/terminos" class="underline decoration-ink-300 underline-offset-4 hover:text-ink-900">
				Términos y condiciones
			</a>
			<a href="/privacidad" class="underline decoration-ink-300 underline-offset-4 hover:text-ink-900">
				Política de privacidad
			</a>
		</nav>
	</div>
</footer>
