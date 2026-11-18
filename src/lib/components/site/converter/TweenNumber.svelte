<script lang="ts">
	import { easeOutExpo, prefersReducedMotion } from '$lib/utils/motion';

	interface Props {
		/** Final value the number settles on. */
		value: number;
		/** Value the count starts from. */
		from: number;
		format: (value: number) => string;
		duration?: number;
	}

	let { value, from, format, duration = 900 }: Props = $props();

	let shown = $state(0);

	// Re-runs whenever `value` or `from` change, so a new conversion counts down again.
	$effect(() => {
		const start = from;
		const end = value;

		if (prefersReducedMotion() || start === end) {
			shown = end;
			return;
		}

		let frame = 0;
		const t0 = performance.now();

		const step = (now: number) => {
			const progress = Math.min(1, (now - t0) / duration);
			shown = start + (end - start) * easeOutExpo(progress);
			if (progress < 1) frame = requestAnimationFrame(step);
		};

		shown = start;
		frame = requestAnimationFrame(step);

		return () => cancelAnimationFrame(frame);
	});
</script>

<!-- The live value is announced elsewhere; screen readers only get the final figure. -->
<span aria-hidden="true">{format(shown)}</span><span class="sr-only">{format(value)}</span>
