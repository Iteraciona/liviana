export type JobStatus = 'queued' | 'working' | 'done' | 'failed';

export interface QualityPreset {
	id: string;
	label: string;
	hint: string;
	quality: number;
}

export interface ConversionJob {
	id: string;
	file: File;
	name: string;
	outputName: string;
	sourceSize: number;
	sourceType: string;
	status: JobStatus;
	outputSize: number | null;
	outputUrl: string | null;
	outputBlob: Blob | null;
	width: number | null;
	height: number | null;
	error: string | null;
}

export const QUALITY_PRESETS: QualityPreset[] = [
	{
		id: 'max',
		label: 'Máxima',
		hint: 'Prácticamente idéntica al original. Ideal para impresión o retoque.',
		quality: 0.95
	},
	{
		id: 'high',
		label: 'Alta',
		hint: 'La diferencia no se nota a simple vista. Recomendada para la web.',
		quality: 0.85
	},
	{
		id: 'balanced',
		label: 'Equilibrada',
		hint: 'Buen detalle con archivos notablemente más livianos.',
		quality: 0.72
	},
	{
		id: 'light',
		label: 'Ligera',
		hint: 'El menor peso posible. Pensada para miniaturas y vistas previas.',
		quality: 0.55
	}
];

export const ACCEPTED_TYPES = [
	'image/jpeg',
	'image/png',
	'image/webp',
	'image/gif',
	'image/bmp',
	'image/avif',
	'image/tiff',
	'image/svg+xml'
];

export const MAX_FILE_SIZE = 40 * 1024 * 1024;
