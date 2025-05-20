import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

// Continuation of signal.test.ts
describe('Signal - Flow Control', () => {
  it('should execute onSuccess for success signals', () => {
    const successFn = vi.fn();
    const failureFn = vi.fn();
    
    Signal.success('test')
      .onSuccess(successFn)
      .onFailure(failureFn);
    
    expect(successFn).toHaveBeenCalledWith('test');
    expect(failureFn).not.toHaveBeenCalled();
  });
  
  it('should execute onFailure for failure signals', () => {
    const error = new Error('error');
    const successFn = vi.fn();
    const failureFn = vi.fn();
    
    Signal.failure(error)
      .onSuccess(successFn)
      .onFailure(failureFn);
    
    expect(successFn).not.toHaveBeenCalled();
    expect(failureFn).toHaveBeenCalledWith(error);
  });
  
  it('should chain operations correctly', () => {
    const result = Signal.success(5)
      .map(value => value * 2)
      .map(value => value + 1)
      .map(value => value.toString());
    
    expect(result.value).toBe('11');
  });

  it('should handle ensure conditions', () => {
    const validSignal = Signal.success(10);
    const resultValid = validSignal.ensure(value => value > 5, 'Value too low');
    
    expect(resultValid.isSuccess).toBe(true);
    
    const invalidSignal = Signal.success(3);
    const resultInvalid = invalidSignal.ensure(value => value > 5, 'Value too low');
    
    expect(resultInvalid.isFailure).toBe(true);
    expect(resultInvalid.error?.message).toBe('Value too low');
  });
});