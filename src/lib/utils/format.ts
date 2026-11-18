/** Formats a byte count into a short human-readable string. */
export function formatBytes(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/** Returns the percentage saved between the source and output size. Negative means the file grew. */
export function savingsPercent(sourceSize: number, outputSize: number): number {
	if (sourceSize === 0) return 0;
	return Math.round(((sourceSize - outputSize) / sourceSize) * 100);
}

/** How many times lighter the output is, e.g. "4.3×". Never below 1.0× (no invented savings). */
export function formatRatio(sourceSize: number, outputSize: number): string {
	if (outputSize <= 0) return '1.0×';
	return `${Math.max(1, sourceSize / outputSize).toFixed(1)}×`;
}

/** Replaces any file extension with .webp, preserving dots inside the base name. */
export function toWebpName(filename: string): string {
	const lastDot = filename.lastIndexOf('.');
	const base = lastDot > 0 ? filename.slice(0, lastDot) : filename;
	return `${base}.webp`;
}

/** Shortens a long file name in the middle so both ends stay readable. */
export function truncateMiddle(value: string, max = 28): string {
	if (value.length <= max) return value;
	const head = value.slice(0, max - 12);
	const tail = value.slice(-9);
	return `${head}…${tail}`;
}
