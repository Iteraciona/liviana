import { absoluteUrl } from '$lib/config/site';

// Built once at build time: the pages are static, so the file can be too.
export const prerender = true;

interface Entry {
	path: string;
	/** Date the page content last changed, YYYY-MM-DD. Update when you edit the page. */
	lastmod: string;
	priority: string;
}

const PAGES: Entry[] = [
	{ path: '/', lastmod: '2026-11-18', priority: '1.0' },
	{ path: '/privacidad', lastmod: '2026-09-21', priority: '0.3' },
	{ path: '/terminos', lastmod: '2026-09-21', priority: '0.3' }
];

export function GET(): Response {
	const urls = PAGES.map(
		(page) =>
			`\t<url>\n\t\t<loc>${absoluteUrl(page.path)}</loc>\n\t\t<lastmod>${page.lastmod}</lastmod>\n\t\t<priority>${page.priority}</priority>\n\t</url>`
	).join('\n');

	const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'public, max-age=3600'
		}
	});
}
