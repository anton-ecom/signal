import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { Signal } from '../src/core/signal';
import type { SignalInstance, SignalPlugin } from '../src/core/types';

describe('Signal - Plugin System', () => {
  // Create a test plugin with proper typing
  const testPlugin: SignalPlugin = {
    id: 'test-plugin',
    init: vi.fn(),
    execute: vi.fn().mockImplementation(<T>(signal: SignalInstance<T>): SignalInstance<T> => {
      return signal.reflect('Processed by test plugin');
    }),
    cleanup: vi.fn()
  };
  
  // Add console spies to see what's happening
  //let consoleInfoSpy: any;
  //let consoleWarnSpy: any;
  //let consoleErrorSpy: any;
  
  beforeAll(() => {

    // Setup console spies to see what's happening
    //consoleInfoSpy = vi.spyOn(console, 'info').mockImplementation();
    //consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation();
    //consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation();
    
    // Add debug logs
    console.info('Before registering plugin');
    
    // Register the plugin
    Signal.registerPlugin(testPlugin);
    
    console.info('After registering plugin');
  });
  
  afterAll(() => {
    // Unregister the plugin

    Signal.unregisterPlugin('test-plugin');
    
    // Restore console spies
    //consoleInfoSpy.mockRestore();
    //consoleWarnSpy.mockRestore();
    //consoleErrorSpy.mockRestore();
  });
  
  beforeEach(() => {
    // Reset mock counters between tests
    vi.clearAllMocks();
  });
  
  it('should verify plugin registration', () => {
    // Access the plugins directly to check registration
    // This requires exposing the plugins map in Signal for testing
    // @ts-ignore - accessing private property for testing
    const registeredPlugin = Signal.plugins.get('test-plugin');
  
    expect(registeredPlugin).toBeDefined();
    expect(registeredPlugin).toBe(testPlugin);
  });
  
  it('should register and execute plugins', () => {
    const signal = Signal.success('test');    
    const result = signal.with('test-plugin');       

    
    expect(testPlugin.execute).toHaveBeenCalled();
    
    const traceData = result.traceData();
    const lastTraceEntry = traceData[traceData.length - 1];   
    const reflections = lastTraceEntry.reflections || [];       
    const lastReflection = reflections[reflections.length - 1];
    expect(lastReflection?.message).toBe('Processed by test plugin');
  });
  
  // Rest of your tests...
});