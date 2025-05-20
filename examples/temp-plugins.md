import { Signal, type Reflection } from "../core/signal";
import { performance } from "node:perf_hooks";
import crypto from "node:crypto";
/**
 * Register extensions for the Signal pattern
 */
export function registerSignalExtensions<T>() {
	// Transaction extension
	Signal.plugin("transaction", (signal: Signal<T>, name: string) => {
		const transactionId = crypto.randomUUID();
		return new Signal(signal.value, signal.error, [
			...signal.traceEntries,
			{
				layer: "transaction",
				timestamp: Date.now(),
				reflections: [
					{
						message: `Begin transaction: ${name}`,
						context: { transactionId, state: "begin" },
						timestamp: Date.now(),
					},
				],
			},
		]);
	});

	Signal.plugin(
		"endTransaction",
		(signal: Signal<T>, name: string, status = "committed") => {
			// Find the matching transaction
			const transactionEntry = signal.traceEntries.find(
				(e) =>
					e.layer === "transaction" &&
					e.reflections?.[0]?.message?.includes(`Begin transaction: ${name}`),
			);

			const transactionId =
				transactionEntry?.reflections?.[0]?.context?.transactionId || "unknown";

			return new Signal(signal.value, signal.error, [
				...signal.traceEntries,
				{
					layer: "transaction",
					timestamp: Date.now(),
					reflections: [
						{
							message: `End transaction: ${name}`,
							context: { transactionId, state: "end", status },
							timestamp: Date.now(),
						},
					],
				},
			]);
		},
	);

	// Performance measurement extension
	Signal.plugin(
		"measureTime",
		async (
			signal: Signal<T>,
			operation: (...args: any[]) => Promise<any>,
			label: string,
		) => {
			if (signal.isFailure) {
				return signal;
			}

			const start = performance.now();

			try {
				const result = await operation(signal.value);
				const duration = performance.now() - start;

				// If result is already a Signal, merge with measurements
				if (result instanceof Signal) {
					return new Signal(result.value, result.error, [
						...signal.traceEntries,
						{
							layer: label,
							timestamp: Date.now(),
							reflections: [
								{
									message: "Operation measured",
									context: { durationMs: duration.toFixed(2) },
									timestamp: Date.now(),
								},
							],
							...result.traceEntries,
						},
					]);
				}

				// Regular value
				return new Signal(result, undefined, [
					...signal.traceEntries,
					{
						layer: label,
						timestamp: Date.now(),
						reflections: [
							{
								message: "Operation measured",
								context: { durationMs: duration.toFixed(2) },
								timestamp: Date.now(),
							},
						],
					},
				]);
			} catch (error) {
				const duration = performance.now() - start;
				return new Signal(
					undefined,
					error instanceof Error ? error : new Error(String(error)),
					[
						...signal.traceEntries,
						{
							layer: label,
							timestamp: Date.now(),
							error: error instanceof Error ? error : new Error(String(error)),
							reflections: [
								{
									message: "Operation failed",
									context: { durationMs: duration.toFixed(2) },
									timestamp: Date.now(),
								},
							],
						},
					],
				);
			}
		},
	);

	// Transform extension
	Signal.plugin(
		"transform",
		(
			signal: Signal<T>,
			transformer: (data: any) => any,
			options?: { trackChanges?: boolean; label?: string },
		) => {
			if (signal.isFailure) {
				return signal;
			}

			try {
				const before = options?.trackChanges ? { ...signal.value } : undefined;
				const transformed = transformer(signal.value);

				const reflections: any[] = [
					{
						message: "Data transformed",
						timestamp: Date.now(),
					},
				];

				if (before && options?.trackChanges) {
					reflections.push({
						message: "Transformation details",
						context: { before, after: transformed },
						timestamp: Date.now(),
					});
				}

				return new Signal(transformed, undefined, [
					...signal.traceEntries,
					{
						layer: options?.label || "transform",
						timestamp: Date.now(),
						reflections,
					},
				]);
			} catch (error) {
				return new Signal(
					undefined,
					error instanceof Error ? error : new Error(String(error)),
					[
						...signal.traceEntries,
						{
							layer: options?.label || "transform",
							timestamp: Date.now(),
							error: error instanceof Error ? error : new Error(String(error)),
						},
					],
				);
			}
		},
	);
}

// Make sure to call this when your application starts
// registerSignalExtensions();
