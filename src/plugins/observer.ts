import type { SignalPlugin, SignalInstance } from "../core/types";

type ObserverCallback<T> = (signal: SignalInstance<T>) => void;

export interface ObserverPluginOptions<T = unknown> {
	onSuccess?: ObserverCallback<T>;
	onFailure?: ObserverCallback<T>;
	always?: ObserverCallback<T>;
}

export const observerPlugin: SignalPlugin<ObserverPluginOptions> = {
	id: "observer",

	execute<T>(
		signal: SignalInstance<T>,
		options?: ObserverPluginOptions<T>,
	): SignalInstance<T> {
		if (options?.always) {
			options.always(signal);
		}

		if (signal.isSuccess && options?.onSuccess) {
			options.onSuccess(signal);
		} else if (signal.isFailure && options?.onFailure) {
			options.onFailure(signal);
		}

		return signal.reflect("Observed by observer plugin");
	},
};
