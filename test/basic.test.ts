import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

describe('Signal - Basic Functionality', () => {
  describe('Creation and Value Access', () => {
    it('should create a success signal with value', () => {
      const signal = Signal.success('test');
      
      expect(signal.isSuccess).toBe(true);
      expect(signal.isFailure).toBe(false);
      expect(signal.value).toBe('test');
      expect(signal.error).toBeUndefined();
    });
    
    it('should create a failure signal with error', () => {
      const error = new Error('it error');
      const signal = Signal.failure(error);
      
      expect(signal.isSuccess).toBe(false);
      expect(signal.isFailure).toBe(true);
      expect(signal.value).toBeUndefined();
      expect(signal.error).toBe(error);
    });
    
    it('should create a failure signal from error string', () => {
      const signal = Signal.failure('it error');
      
      expect(signal.isSuccess).toBe(false);
      expect(signal.isFailure).toBe(true);
      expect(signal.value).toBeUndefined();
      expect(signal.error).toBeInstanceOf(Error);
      expect(signal.error?.message).toBe('it error');
    });

    it('should handle null and undefined values', () => {
      const nullSignal = Signal.success(null);
      const undefinedSignal = Signal.success(undefined);
      
      expect(nullSignal.isSuccess).toBe(true);
      expect(nullSignal.value).toBeNull();
      
      expect(undefinedSignal.isSuccess).toBe(true);
      expect(undefinedSignal.value).toBeUndefined();
    });
  });

  describe('Immutability', () => {
    it('should maintain immutability when creating new signals', () => {
      const originalSignal = Signal.success('original');
      const newSignal = originalSignal.success('new');
      
      expect(originalSignal.value).toBe('original');
      expect(newSignal.value).toBe('new');
      expect(originalSignal).not.toBe(newSignal);
    });
    
    it('should not allow modifying value directly', () => {
      const signal = Signal.success({ name: 'test' });
      
      expect(() => {
        // @ts-expect-error Testing runtime behavior
        signal.value = { name: 'modified' };
      }).toThrow(); // This might fail if value is not properly made read-only
      
      // Alternative it if the above throws a compile error but not runtime error
      const originalValue = signal.value;
      if (originalValue) {
        originalValue.name = 'modified'; // Should modify the object but not break immutability
      }
      
      expect(signal.value?.name).toBe('modified'); // Object is modified
      
      const newSignal = signal.success({ name: 'new' });
      expect(signal.value?.name).toBe('modified'); // Original signal unchanged
      expect(newSignal.value?.name).toBe('new'); // New signal has new value
    });
  });
});