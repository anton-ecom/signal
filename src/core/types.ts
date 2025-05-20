import type { Signal } from "./signal";

/**
 * Represents the status of a signal
 * @type {string}
 * @enum {string}
 * @property {string} success - Indicates that the signal was successful
 * @property {string} error - Indicates that the signal encountered an error
 * @property {string} pending - Indicates that the signal is still processing
 */
export type SignalStatus = "success" | "error" | "pending";

/**
 * Represents a reflection in the Signal pattern
 * @template T - Type of the value being reflected upon
 */

export interface Reflection {
	/** Method name that triggered this reflection */
	method?: string;
	/** Class name that triggered this reflection */
	class?: string;
	/** Message describing the reflection */
	message?: string;

	/** Contextual data related to this reflection */
	context?: Record<string, unknown>;
	/** Timestamp when this reflection was created */
	timestamp: number;
}

export interface TraceEntry {
	/** Layer or function name */
	layer: string;
	/** Timestamp when this entry was created */
	timestamp: number;
	/** Optional reflections about this layer */
	status?: SignalStatus;

	reflections?: Array<Reflection>;
	/** Error that occurred at this step, if any */
	error?: Error;
}

/**
 * Represents a plugin configuration for Signal
 */
export interface SignalPluginConfig<TOptions = unknown> {
	/**
	 * Unique identifier for the plugin
	 */
	id: string;

	/**
	 * Plugin options
	 */
	options?: TOptions;
}

export interface TraceData {
	layer: string;
	timestamp: string;
	status?: "error" | "success";
	error?: string;
	context?: Record<string, unknown>;
	reflections?: Array<{
		message: string;
		method?: string;
		class?: string;
		timestamp: string;
		context?: Record<string, unknown>;
	}>;
	method?: string;
	class?: string;
}

export interface SignalInstance<T> {
	readonly value: T | undefined;
	readonly error: Error | undefined;
	readonly isSuccess: boolean;
	readonly isFailure: boolean;
	readonly id: string; // Make sure this is implemented in Signal class

	// Methods
	reflect(
		message: string,
		context?: Record<string, unknown>,
		component?: string,
	): SignalInstance<T>;
	layer<U = T>(
		name: string,
		context?: Record<string, unknown>,
	): SignalInstance<U>;
	success<U = T>(value: U): Signal<U>;
	failure(error: Error | string, layer?: string): Signal<never>;
	map<U>(fn: (value: T) => U, layer?: string): Signal<U>;
	tracedMap<U>(fn: (value: T) => U, layer?: string): Signal<U>;
	flatMap<U>(fn: (value: T) => Signal<U>, layer?: string): Signal<U>;
	traceData(): TraceData[]; // Replace with proper return type
	trace(): string;
	with<U = T>(pluginConfig: SignalPluginConfig | string): Signal<U>;
	// Add other public methods...
}

/**
 * Defines a Signal plugin
 */
export interface SignalPlugin<TOptions = unknown> {
	/**
	 * Unique identifier for the plugin
	 */
	id: string;

	/**
	 * Plugin initialization function - called once when plugin is registered
	 */
	init?: (options?: TOptions) => void;

	/**
	 * Execution function - called for each signal that uses this plugin
	 */
	execute: <T>(
		signal: SignalInstance<T>,
		options?: TOptions,
	) => SignalInstance<T>;

	/**
	 * Optional cleanup function - called when plugin is unregistered
	 */
	cleanup?: () => void;
}

/**
 * Plugin handler type for registering and managing plugins
 */
export type SignalPluginHandler = {
	register: <TOptions>(plugin: SignalPlugin<TOptions>) => void;
	unregister: (pluginId: string) => void;
	use: <T>(
		signal: Signal<T>,
		pluginConfig: SignalPluginConfig | string,
	) => Signal<T>;
};
