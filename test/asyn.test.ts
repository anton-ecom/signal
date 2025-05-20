import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

describe('Signal - Async Operations', () => {
  it('should work with async/await', async () => {
    const asyncFn = async (value: string): Promise<Signal<string>> => {
      return Signal.success(`${value} processed`);
    };
    
    const signal = Signal.success('test');
    const result = await asyncFn(signal.value as string);
    
    expect(result.value).toBe('test processed');
  });
  
  it('should handle async errors', async () => {
    const failingAsyncFn = async (): Promise<Signal<string>> => {
      throw new Error('async error');
    };
    
    try {
      await failingAsyncFn();
      expect.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeDefined();
      expect((error as Error).message).toBe('async error');
    }
  });
  
  it('should support async map operations', async () => {
    // This assumes you have an asyncMap method or similar
    // If not, you can implement one or adapt this test
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    
    const signal = Signal.success(5);
    const asyncTransform = async (value: number): Promise<number> => {
      await delay(10);
      return value * 2;
    };
    
    // Simulate async map with regular methods
    const result = await asyncTransform(signal.value as number)
      .then(newValue => Signal.extend(signal, () => newValue));
    
    expect(result.value).toBe(10);
  });
});