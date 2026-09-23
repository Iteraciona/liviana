import { ACCEPTED_TYPES, MAX_FILE_SIZE, type ConversionJob } from '$lib/utils/types';
import { toWebpName } from '$lib/utils/format';

export interface ConversionResult {
	blob: Blob;
	width: number;
	height: number;
}

/**
 * Checks whether the browser can actually encode WebP through a canvas.
 * Cached after the first call since the answer never changes within a session.
 */
let webpSupport: boolean | null = null;

export function supportsWebp(): boolean {
	if (webpSupport !== null) return webpSupport;
	if (typeof document === 'undefined') return false;

	const canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = 1;
	webpSupport = canvas.toDataURL('image/webp').startsWith('data:image/webp');
	return webpSupport;
}

/** Validates a dropped file, returning an error message or null when it is accepted. */
export function validateFile(file: File): string | null {
	const isAccepted = ACCEPTED_TYPES.includes(file.type) || file.type.startsWith('image/');

	if (!isAccepted) {
		return 'Este archivo no es una imagen.';
	}

	if (file.size > MAX_FILE_SIZE) {
		return 'La imagen supera los 40 MB permitidos.';
	}

	if (file.size === 0) {
		return 'El archivo está vacío.';
	}

	return null;
}

/**
 * Decodes an image file into a bitmap. Falls back to an HTMLImageElement for
 * formats createImageBitmap refuses to handle, such as SVG in some browsers.
 */
async function decodeImage(file: File): Promise<ImageBitmap | HTMLImageElement> {
	try {
		return await createImageBitmap(file);
	} catch {
		return await decodeViaElement(file);
	}
}

function decodeViaElement(file: File): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const image = new Image();

		image.onload = () => {
			URL.revokeObjectURL(url);
			resolve(image);
		};

		image.onerror = () => {
			URL.revokeObjectURL(url);
			reject(new Error('No se pudo leer la imagen.'));
		};

		image.src = url;
	});
}

function readDimensions(source: ImageBitmap | HTMLImageElement): { width: number; height: number } {
	if (source instanceof HTMLImageElement) {
		// SVG without intrinsic size reports 0; fall back to a sane raster size.
		return {
			width: source.naturalWidth || source.width || 1024,
			height: source.naturalHeight || source.height || 1024
		};
	}

	return { width: source.width, height: source.height };
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
	return new Promise((resolve, reject) => {
		canvas.toBlob(
			(blob) => {
				if (blob) resolve(blob);
				else reject(new Error('El navegador no pudo generar el archivo WebP.'));
			},
			'image/webp',
			quality
		);
	});
}

/**
 * Converts a single image file to WebP entirely in the browser.
 * The source never leaves the device: no upload, no temporary file, nothing to delete.
 */
export async function convertToWebp(file: File, quality: number): Promise<ConversionResult> {
	const source = await decodeImage(file);
	const { width, height } = readDimensions(source);

	const canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	// alpha: true keeps PNG and SVG transparency intact instead of flattening it to black.
	const context = canvas.getContext('2d', { alpha: true });

	if (!context) {
		throw new Error('No se pudo preparar el lienzo de dibujo.');
	}

	context.drawImage(source, 0, 0, width, height);

	if ('close' in source) {
		source.close();
	}

	const blob = await canvasToBlob(canvas, quality);

	// Release the backing store immediately; large batches otherwise pile up in memory.
	canvas.width = 0;
	canvas.height = 0;

	return { blob, width, height };
}

/** Builds a fresh job record from a file, ready to be queued. */
export function createJob(file: File): ConversionJob {
	return {
		id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
		file,
		name: file.name,
		outputName: toWebpName(file.name),
		sourceSize: file.size,
		sourceType: file.type || 'desconocido',
		status: 'queued',
		outputSize: null,
		outputUrl: null,
		outputBlob: null,
		width: null,
		height: null,
		error: null
	};
}
