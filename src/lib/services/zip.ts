/**
 * Minimal ZIP writer using the STORE method (no compression).
 * WebP payloads are already compressed, so deflating them again costs CPU and saves nothing.
 * Avoids pulling a zip dependency for what amounts to a header format.
 */

interface ZipEntry {
	name: string;
	data: Uint8Array;
	crc: number;
	offset: number;
}

const CRC_TABLE = buildCrcTable();

function buildCrcTable(): Uint32Array {
	const table = new Uint32Array(256);

	for (let i = 0; i < 256; i++) {
		let value = i;
		for (let bit = 0; bit < 8; bit++) {
			value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
		}
		table[i] = value >>> 0;
	}

	return table;
}

function crc32(data: Uint8Array): number {
	let crc = 0xffffffff;
	for (let i = 0; i < data.length; i++) {
		crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
	}
	return (crc ^ 0xffffffff) >>> 0;
}

/** Ensures every entry has a unique name so the archive never silently drops a file. */
function uniqueName(name: string, taken: Set<string>): string {
	if (!taken.has(name)) {
		taken.add(name);
		return name;
	}

	const lastDot = name.lastIndexOf('.');
	const base = lastDot > 0 ? name.slice(0, lastDot) : name;
	const extension = lastDot > 0 ? name.slice(lastDot) : '';

	let counter = 2;
	let candidate = `${base}-${counter}${extension}`;

	while (taken.has(candidate)) {
		counter++;
		candidate = `${base}-${counter}${extension}`;
	}

	taken.add(candidate);
	return candidate;
}

export async function buildZip(files: { name: string; blob: Blob }[]): Promise<Blob> {
	const encoder = new TextEncoder();
	const taken = new Set<string>();
	const chunks: Uint8Array[] = [];
	const entries: ZipEntry[] = [];

	let offset = 0;

	for (const file of files) {
		const name = uniqueName(file.name, taken);
		const nameBytes = encoder.encode(name);
		const data = new Uint8Array(await file.blob.arrayBuffer());
		const crc = crc32(data);

		const header = new Uint8Array(30 + nameBytes.length);
		const view = new DataView(header.buffer);

		view.setUint32(0, 0x04034b50, true); // local file header signature
		view.setUint16(4, 20, true); // version needed
		view.setUint16(6, 0x0800, true); // UTF-8 filename flag
		view.setUint16(8, 0, true); // STORE
		view.setUint16(10, 0, true); // mod time
		view.setUint16(12, 0x21, true); // mod date
		view.setUint32(14, crc, true);
		view.setUint32(18, data.length, true); // compressed size
		view.setUint32(22, data.length, true); // uncompressed size
		view.setUint16(26, nameBytes.length, true);
		view.setUint16(28, 0, true); // extra field length
		header.set(nameBytes, 30);

		entries.push({ name, data, crc, offset });
		chunks.push(header, data);
		offset += header.length + data.length;
	}

	const centralStart = offset;

	for (const entry of entries) {
		const nameBytes = encoder.encode(entry.name);
		const record = new Uint8Array(46 + nameBytes.length);
		const view = new DataView(record.buffer);

		view.setUint32(0, 0x02014b50, true); // central directory signature
		view.setUint16(4, 20, true); // version made by
		view.setUint16(6, 20, true); // version needed
		view.setUint16(8, 0x0800, true); // UTF-8 filename flag
		view.setUint16(10, 0, true); // STORE
		view.setUint16(12, 0, true); // mod time
		view.setUint16(14, 0x21, true); // mod date
		view.setUint32(16, entry.crc, true);
		view.setUint32(20, entry.data.length, true);
		view.setUint32(24, entry.data.length, true);
		view.setUint16(28, nameBytes.length, true);
		view.setUint16(30, 0, true); // extra field length
		view.setUint16(32, 0, true); // comment length
		view.setUint16(34, 0, true); // disk number
		view.setUint16(36, 0, true); // internal attributes
		view.setUint32(38, 0, true); // external attributes
		view.setUint32(42, entry.offset, true);
		record.set(nameBytes, 46);

		chunks.push(record);
		offset += record.length;
	}

	const end = new Uint8Array(22);
	const endView = new DataView(end.buffer);

	endView.setUint32(0, 0x06054b50, true); // end of central directory signature
	endView.setUint16(4, 0, true); // disk number
	endView.setUint16(6, 0, true); // central directory disk
	endView.setUint16(8, entries.length, true);
	endView.setUint16(10, entries.length, true);
	endView.setUint32(12, offset - centralStart, true);
	endView.setUint32(16, centralStart, true);
	endView.setUint16(20, 0, true); // comment length

	chunks.push(end);

	return new Blob(chunks as BlobPart[], { type: 'application/zip' });
}

/** Triggers a browser download for a blob and releases the object URL afterwards. */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');

	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	link.remove();

	setTimeout(() => URL.revokeObjectURL(url), 1000);
}
