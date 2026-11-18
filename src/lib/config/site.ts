/** Public identity of the site: one place for every absolute URL used in SEO tags. */
export const SITE = {
	name: 'Liviana',
	url: 'https://liviana.iteraciona.com',
	locale: 'es_PE',
	language: 'es-PE',
	themeColor: '#ffffff',
	/** Social preview: 1200×630, served from static/. */
	ogImage: {
		path: '/og-image.png',
		width: 1200,
		height: 630,
		alt: 'Liviana: convierte tus imágenes a WebP dentro de tu navegador, sin subirlas.'
	},
	publisher: {
		name: 'Iteraciona',
		url: 'https://iteraciona.com'
	}
} as const;

/** Builds an absolute URL on the public domain from a site path. */
export function absoluteUrl(path: string): string {
	return new URL(path, SITE.url).href;
}
