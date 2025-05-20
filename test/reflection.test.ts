import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

// Continuation of signal.test.ts
describe('Signal - Reflection and Tracing', () => {
  it('should add reflections to the trace', () => {
    

    
     const signal = Signal.success('test')
      .reflect('First reflection')
      .reflect('Second reflection');

    const traceData = signal.traceData();
  
    // Assuming traceData returns an array of trace entries
    expect(traceData.length).toBeGreaterThan(0);
    
    // Check if reflections are present in the last trace entry
    const lastTrace = traceData[traceData.length - 1];
    expect(lastTrace.reflections).toBeDefined();
    expect(lastTrace.reflections?.length).toBe(2);
    expect(lastTrace.reflections?.[0].message).toBe('First reflection');
    expect(lastTrace.reflections?.[1].message).toBe('Second reflection');
   
  });
  

  it('should add layers to the trace', () => {
    const signal = Signal.success('test')
      .layer('Repository')
      .reflect('In repository')
      .layer('UseCase')
      .reflect('In use case');
    
    const traceData = signal.traceData();
    
    // Check if layers are correctly added
    expect(traceData.length).toBeGreaterThanOrEqual(2);
    expect(traceData[0].layer).toBe('Repository');
    expect(traceData[1].layer).toBe('UseCase');
    
    // Check that reflections are in the right layers
    expect(traceData[0].reflections?.[0].message).toBe('In repository');
    expect(traceData[1].reflections?.[0].message).toBe('In use case');
  });
  
  it('should support reflections with context', () => {
    const context = { userId: 123, action: 'test' };
    const signal = Signal.success('test')
      .reflect('With context', context);
    
    const traceData = signal.traceData();
    const reflection = traceData[0].reflections?.[0];
    
    expect(reflection).toBeDefined();
    expect(reflection?.message).toBe('With context');
    expect(reflection?.context).toBeDefined();
    expect(reflection?.context).toEqual(context);
  }); 
});