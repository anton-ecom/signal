import type { SignalPlugin, SignalInstance } from '../core/types';
import type { Signal } from '../core/signal';

export interface LoggerPluginOptions {
  level?: 'debug' | 'info' | 'warn' | 'error';
  includeValue?: boolean;
  includeTrace?: boolean;
  formatter?: (signal: SignalInstance<any>) => string;
}

export const loggerPlugin: SignalPlugin<LoggerPluginOptions> = {
  id: 'logger',
  
  init(options?: LoggerPluginOptions) {
    console.debug('Logger plugin initialized', options);
  },
  
  execute<T>(signal: SignalInstance<T>, options?: LoggerPluginOptions): SignalInstance<T> {
    const level = options?.level || 'info';
    const includeValue = options?.includeValue ?? true;
    const includeTrace = options?.includeTrace ?? false;
    
    const logData: Record<string, unknown> = {
      id: signal.id
    };
    
    if (includeValue) {
      logData.value = signal.value;
    }
    
    if (signal.isFailure) {
      logData.error = signal.error?.message;
    }
    
    if (includeTrace) {
      logData.trace = signal.traceData();
    }
    
    if (options?.formatter) {
      const formatted = options.formatter(signal);
      console[level](formatted);
    } else {
      console[level](`Signal ${signal.id}:`, logData);
    }
    
    return signal;
  },
  
  cleanup() {
    console.debug('Logger plugin cleaned up');
  }
};