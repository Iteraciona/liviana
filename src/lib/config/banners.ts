/**
 * Banners for Iteraciona's own services. One is picked at random per visit.
 *
 * Two kinds:
 * - `image`: your own square artwork. Put the file in `static/promos/` (ideally WebP,
 *   at least 500×500 so it stays sharp on retina) and reference it as `/promos/<file>`.
 * - `card`: a banner drawn in HTML/CSS with Liviana's style. Only text is needed.
 *
 * Images must be served from this site, never from an ad network: Liviana promises that
 * nothing leaves the browser, and third-party requests would undermine that.
 *
 * Leave the list empty to hide the banner space entirely.
 */

interface BannerBase {
	/** Stable identifier, used as the Svelte key. */
	id: string;
	/** Destination; opens in a new tab. */
	href: string;
}

export interface ImageBanner extends BannerBase {
	kind: 'image';
	/** Path under static/, e.g. '/promos/conecta-reclamos.webp'. */
	src: string;
	/** Describes the banner's message for screen readers, not the picture itself. */
	alt: string;
}

export interface CardBanner extends BannerBase {
	kind: 'card';
	/** Short line above the title, e.g. the product name. */
	eyebrow: string;
	title: string;
	text: string;
	/** Link text at the bottom of the card. */
	cta: string;
	/** Background: dark ink (default), the logo's ember or the logo's moss. */
	tone?: 'ink' | 'ember' | 'moss';
}

export type Banner = ImageBanner | CardBanner;

export const BANNERS: Banner[] = [
	// Copy taken from each product's own site (checked 2026-11-18). Keep claims in sync with it.
	{
		kind: 'card',
		id: 'easedam',
		href: 'https://www.easedam.com',
		eyebrow: 'EaseDAM',
		title: 'La declaración ya está en tus documentos',
		text: 'Arma la DAM (formatos A, B y C) desde tus facturas, BL y packing list. Para agencias de aduana e importadores.',
		// The product is in waitlist stage: do not imply it is available today.
		cta: 'Unirme a la lista de espera',
		tone: 'ink'
	},
	{
		kind: 'card',
		id: 'conecta-reclamos',
		href: 'https://www.conecta-reclamos.com',
		eyebrow: 'Conecta-Reclamos',
		title: 'Tu libro de reclamaciones virtual, en menos de 5 minutos',
		text: '100% legal INDECOPI. Alertas antes del plazo y reportes en un clic.',
		cta: 'Conocer Conecta-Reclamos',
		tone: 'moss'
	}

	// Example of an image banner (place the file in static/promos/ first):
	// {
	// 	kind: 'image',
	// 	id: 'mi-servicio',
	// 	href: 'https://iteraciona.com',
	// 	src: '/promos/mi-servicio.webp',
	// 	alt: 'Iteraciona: desarrollamos tu producto digital'
	// }
];
