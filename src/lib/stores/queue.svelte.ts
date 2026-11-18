import { convertToWebp, createJob, validateFile } from '$lib/services/converter';
import { buildZip, downloadBlob } from '$lib/services/zip';
import { watchNetwork } from '$lib/services/network-watch';
import { restore as restoreTab, showDone, showProgress } from '$lib/services/tab-status';
import { formatRatio } from '$lib/utils/format';
import { QUALITY_PRESETS, type ConversionJob } from '$lib/utils/types';

/** Runs conversions a few at a time so a large batch never freezes the main thread. */
const CONCURRENCY = 3;

class ConversionQueue {
	jobs = $state<ConversionJob[]>([]);
	presetId = $state<string>('high');
	customQuality = $state<number>(85);
	useCustom = $state<boolean>(false);
	isRunning = $state<boolean>(false);
	rejected = $state<{ name: string; reason: string }[]>([]);
	/** Network requests measured during the last run; null when it could not be measured. */
	networkRequests = $state<number | null>(null);

	readonly completed = $derived(this.jobs.filter((job) => job.status === 'done'));
	readonly failed = $derived(this.jobs.filter((job) => job.status === 'failed'));
	readonly pending = $derived(
		this.jobs.filter((job) => job.status === 'queued' || job.status === 'working')
	);

	readonly totalSource = $derived(
		this.completed.reduce((sum, job) => sum + job.sourceSize, 0)
	);

	readonly totalOutput = $derived(
		this.completed.reduce((sum, job) => sum + (job.outputSize ?? 0), 0)
	);

	readonly progress = $derived(
		this.jobs.length === 0
			? 0
			: Math.round(((this.completed.length + this.failed.length) / this.jobs.length) * 100)
	);

	/** The effective 0–1 quality passed to the encoder. */
	get quality(): number {
		if (this.useCustom) return this.customQuality / 100;
		const preset = QUALITY_PRESETS.find((item) => item.id === this.presetId);
		return preset ? preset.quality : 0.85;
	}

	get qualityLabel(): string {
		if (this.useCustom) return `${this.customQuality}%`;
		const preset = QUALITY_PRESETS.find((item) => item.id === this.presetId);
		return preset ? preset.label : 'Alta';
	}

	addFiles(files: File[]): void {
		const accepted: ConversionJob[] = [];
		const refused: { name: string; reason: string }[] = [];

		for (const file of files) {
			const error = validateFile(file);
			if (error) refused.push({ name: file.name, reason: error });
			else accepted.push(createJob(file));
		}

		this.jobs = [...this.jobs, ...accepted];
		this.rejected = refused;
	}

	removeJob(id: string): void {
		const target = this.jobs.find((job) => job.id === id);
		if (target?.outputUrl) URL.revokeObjectURL(target.outputUrl);
		this.jobs = this.jobs.filter((job) => job.id !== id);
	}

	clear(): void {
		restoreTab();
		this.networkRequests = null;
		for (const job of this.jobs) {
			if (job.outputUrl) URL.revokeObjectURL(job.outputUrl);
		}
		this.jobs = [];
		this.rejected = [];
	}

	dismissRejected(): void {
		this.rejected = [];
	}

	/** Resets finished jobs so a new quality setting can be applied to the same files. */
	private resetResults(): void {
		this.jobs = this.jobs.map((job) => {
			if (job.outputUrl) URL.revokeObjectURL(job.outputUrl);
			return {
				...job,
				status: 'queued' as const,
				outputSize: null,
				outputUrl: null,
				outputBlob: null,
				width: null,
				height: null,
				error: null
			};
		});
	}

	private patch(id: string, changes: Partial<ConversionJob>): void {
		this.jobs = this.jobs.map((job) => (job.id === id ? { ...job, ...changes } : job));
	}

	private async runJob(job: ConversionJob): Promise<void> {
		this.patch(job.id, { status: 'working' });

		try {
			const result = await convertToWebp(job.file, this.quality);
			this.patch(job.id, {
				status: 'done',
				outputBlob: result.blob,
				outputSize: result.blob.size,
				outputUrl: URL.createObjectURL(result.blob),
				width: result.width,
				height: result.height
			});
		} catch (error) {
			const reason = error instanceof Error ? error.message : 'No se pudo convertir la imagen.';
			this.patch(job.id, { status: 'failed', error: reason });
		}
	}

	async run(): Promise<void> {
		if (this.isRunning || this.jobs.length === 0) return;

		this.isRunning = true;
		this.networkRequests = null;
		this.resetResults();

		const snapshot = [...this.jobs];
		const total = snapshot.length;
		let cursor = 0;
		let finished = 0;

		const network = watchNetwork();
		showProgress(0, total);

		const worker = async (): Promise<void> => {
			while (cursor < snapshot.length) {
				const job = snapshot[cursor++];
				// The job may have been removed from the queue while the batch was running.
				if (!this.jobs.some((item) => item.id === job.id)) continue;
				await this.runJob(job);
				finished++;
				if (finished < total) showProgress(finished, total);
			}
		};

		const lanes = Array.from({ length: Math.min(CONCURRENCY, snapshot.length) }, worker);
		await Promise.all(lanes);

		this.networkRequests = network ? network.stop() : null;
		this.isRunning = false;

		if (this.completed.length > 0) {
			showDone(`${formatRatio(this.totalSource, this.totalOutput)} más livianas`);
		} else {
			restoreTab();
		}
	}

	downloadOne(id: string): void {
		const job = this.jobs.find((item) => item.id === id);
		if (job?.outputBlob) downloadBlob(job.outputBlob, job.outputName);
	}

	async downloadAll(): Promise<void> {
		const ready = this.completed.filter((job) => job.outputBlob);
		if (ready.length === 0) return;

		if (ready.length === 1) {
			downloadBlob(ready[0].outputBlob as Blob, ready[0].outputName);
			return;
		}

		const archive = await buildZip(
			ready.map((job) => ({ name: job.outputName, blob: job.outputBlob as Blob }))
		);

		downloadBlob(archive, 'imagenes-webp.zip');
	}
}

export const queue = new ConversionQueue();
