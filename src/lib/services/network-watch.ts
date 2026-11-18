/**
 * Counts the network requests this tab makes while a conversion runs, using the
 * Resource Timing API. It is the evidence behind "your images never leave your
 * device": the number shown is measured, not promised.
 */
export interface NetworkWatch {
	/** Stops watching and returns how many requests happened in between. */
	stop(): number;
}

export function watchNetwork(): NetworkWatch | null {
	if (typeof PerformanceObserver === 'undefined') return null;
	if (!PerformanceObserver.supportedEntryTypes?.includes('resource')) return null;

	let count = 0;
	const observer = new PerformanceObserver((list) => {
		count += list.getEntries().length;
	});

	observer.observe({ type: 'resource', buffered: false });

	return {
		stop() {
			// Flush entries the browser recorded but has not delivered to the callback yet.
			count += observer.takeRecords().length;
			observer.disconnect();
			return count;
		}
	};
}
