import { SITE, absoluteUrl } from './site';

/** Schema.org nodes, linked by @id so search engines read them as one entity graph. */

const ORG_ID = `${SITE.publisher.url}/#organization`;
const WEBSITE_ID = `${SITE.url}/#website`;
const APP_ID = `${SITE.url}/#app`;

export const organization = {
	'@type': 'Organization',
	'@id': ORG_ID,
	name: SITE.publisher.name,
	url: SITE.publisher.url
};

export const website = {
	'@type': 'WebSite',
	'@id': WEBSITE_ID,
	name: SITE.name,
	url: `${SITE.url}/`,
	inLanguage: SITE.language,
	publisher: { '@id': ORG_ID }
};

export const webApplication = {
	'@type': 'WebApplication',
	'@id': APP_ID,
	name: SITE.name,
	url: `${SITE.url}/`,
	description:
		'Convierte imágenes JPG, PNG, GIF, AVIF, BMP, TIFF y SVG a WebP dentro del navegador, sin subirlas a ningún servidor.',
	applicationCategory: 'MultimediaApplication',
	applicationSubCategory: 'Conversor de imágenes',
	operatingSystem: 'Cualquiera con un navegador moderno',
	browserRequirements: 'Requiere un navegador que pueda generar WebP: Chrome, Edge, Firefox o Safari recientes.',
	inLanguage: SITE.language,
	isAccessibleForFree: true,
	offers: { '@type': 'Offer', price: '0', priceCurrency: 'PEN' },
	featureList: [
		'Conversión a WebP dentro del navegador, sin subir archivos',
		'Varias imágenes a la vez',
		'Cuatro niveles de calidad o ajuste manual del 10 % al 100 %',
		'Comparación del original y el WebP lado a lado',
		'Descarga individual o en un ZIP',
		'Conserva la transparencia de PNG y SVG'
	],
	image: absoluteUrl(SITE.ogImage.path),
	isPartOf: { '@id': WEBSITE_ID },
	publisher: { '@id': ORG_ID }
};

/** A plain document page (legal texts), with its breadcrumb back to the home page. */
export function documentPage(path: string, name: string, description: string) {
	const url = absoluteUrl(path);
	return [
		{
			'@type': 'WebPage',
			'@id': `${url}#webpage`,
			url,
			name,
			description,
			inLanguage: SITE.language,
			isPartOf: { '@id': WEBSITE_ID },
			publisher: { '@id': ORG_ID }
		},
		{
			'@type': 'BreadcrumbList',
			itemListElement: [
				{ '@type': 'ListItem', position: 1, name: SITE.name, item: `${SITE.url}/` },
				{ '@type': 'ListItem', position: 2, name, item: url }
			]
		}
	];
}
