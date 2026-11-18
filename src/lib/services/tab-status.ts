/**
 * Mirrors the conversion in the browser tab so people working elsewhere know when to
 * come back: the title counts the batch while it runs, and once it is done the
 * favicon switches to the brand mark with its pixel fully lifted.
 *
 * Any favicon change makes the browser fetch the site's icon again, so the icon is
 * only swapped after the privacy measurement has stopped (see queue.run). The site's
 * own <link rel="icon"> tags are never touched; a separate link is appended (the last
 * icon wins) and removed on restore.
 */

const MOSS = '#102511';
const EMBER = '#df6d25';
const RESTORE_AFTER_MS = 8000;
const LINK_ID = 'liviana-progress-icon';

let originalTitle: string | null = null;
let restoreTimer: ReturnType<typeof setTimeout> | undefined;
let canvas: HTMLCanvasElement | null = null;

/** Draws the small-size cut of the mark with the pixel at `progress` (0–1) of its flight. */
function drawIcon(progress: number): string {
	canvas ??= document.createElement('canvas');
	canvas.width = 32;
	canvas.height = 32;

	const context = canvas.getContext('2d');
	if (!context) return '';

	context.clearRect(0, 0, 32, 32);
	context.fillStyle = MOSS;
	context.beginPath();
	context.roundRect(3, 11, 19, 19, 3);
	context.fill();
	context.clearRect(16, 11, 6, 6);

	const t = Math.min(1, Math.max(0, progress));
	context.fillStyle = EMBER;
	context.beginPath();
	context.roundRect(16 + t * 9, 11 - t * 9, 6, 6, 1.5);
	context.fill();

	return canvas.toDataURL('image/png');
}

function setIcon(href: string): void {
	let link = document.getElementById(LINK_ID) as HTMLLinkElement | null;

	if (!link) {
		link = document.createElement('link');
		link.id = LINK_ID;
		link.rel = 'icon';
		link.type = 'image/png';
		document.head.appendChild(link);
	}

	link.href = href;
}

export function showProgress(done: number, total: number): void {
	if (typeof document === 'undefined' || total === 0) return;

	clearTimeout(restoreTimer);
	originalTitle ??= document.title;

	// Title only while the batch runs: any favicon change makes the browser re-request
	// the site's icon, and that request would land inside the privacy measurement.
	const current = Math.min(done + 1, total);
	document.title = `(${current}/${total}) Convirtiendo… · Liviana`;
}

export function showDone(summary: string): void {
	if (typeof document === 'undefined') return;

	originalTitle ??= document.title;
	document.title = `Listo · ${summary} · Liviana`;
	setIcon(drawIcon(1));

	clearTimeout(restoreTimer);
	restoreTimer = setTimeout(restore, RESTORE_AFTER_MS);
}

export function restore(): void {
	if (typeof document === 'undefined') return;

	clearTimeout(restoreTimer);
	document.getElementById(LINK_ID)?.remove();

	if (originalTitle !== null) {
		document.title = originalTitle;
		originalTitle = null;
	}
}
