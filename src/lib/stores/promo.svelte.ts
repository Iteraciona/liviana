import { BANNERS, type Banner } from '$lib/config/banners';

/** Width from which the banner gets its own column on the left. Matches Tailwind's `xl`. */
const WIDE_QUERY = '(min-width: 1280px)';

/**
 * Holds the banner chosen for this visit and where it should render.
 *
 * Only one placement is ever mounted (the left column on wide screens, the end of the
 * side panel otherwise), so the image is requested once, at page load, and never while
 * a conversion is being measured.
 */
class PromoState {
	current = $state<Banner | null>(null);
	wide = $state(false);

	private started = false;

	/** Picks the banner and starts tracking the viewport. Call once, from onMount. */
	start(): () => void {
		if (this.started || typeof window === 'undefined') return () => {};
		this.started = true;

		if (BANNERS.length > 0) {
			this.current = BANNERS[Math.floor(Math.random() * BANNERS.length)];
		}

		const media = window.matchMedia(WIDE_QUERY);
		const update = () => (this.wide = media.matches);
		update();
		media.addEventListener('change', update);

		return () => {
			media.removeEventListener('change', update);
			this.started = false;
		};
	}
}

export const promo = new PromoState();
