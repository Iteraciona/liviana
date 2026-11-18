/** Shared motion helpers. Anything animated with them must degrade to "no motion" under prefers-reduced-motion. */

export function prefersReducedMotion(): boolean {
	if (typeof window === 'undefined') return true;
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** ease-out-expo, the same curve as --ease-out-expo in site.css. */
export function easeOutExpo(t: number): number {
	return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
}
