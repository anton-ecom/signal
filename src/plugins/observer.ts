import type { SignalPlugin } from '../core/types';
import type { Signal } from '../core/signal';

type ObserverCallback<T> = (signal: Signal<T>) => void;

export interface ObserverPluginOptions<T = unknown> {
  onSuccess?: ObserverCallback<T>;
  onFailure?: ObserverCallback<T>;
  always?: ObserverCallback<T>;
}

export const observerPlugin: SignalPlugin<ObserverPluginOptions> = {
  id: 'observer',
  
  execute<T>(signal: Signal<T>, options?: ObserverPluginOptions<T>): Signal<T> {
    if (options?.always) {
      options.always(signal);
    }
    
    if (signal.isSuccess && options?.onSuccess) {
      options.onSuccess(signal);
    } else if (signal.isFailure && options?.onFailure) {
      options.onFailure(signal);
    }
    
    return signal.reflect('Observed by observer plugin');
  }
};