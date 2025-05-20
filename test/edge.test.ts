import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

describe('Signal - Edge Cases', () => {
  it('should handle deeply nested objects', () => {
    const deepObject = {
      level1: {
        level2: {
          level3: {
            value: 'deeply nested'
          }
        }
      }
    };
    
    const signal = Signal.success(deepObject);
    expect(signal.value).toEqual(deepObject);
    
    const mapped = signal.map(obj => ({
      ...obj,
      level1: {
        ...obj.level1,
        level2: {
          ...obj.level1.level2,
          level3: {
            ...obj.level1.level2.level3,
            value: `${obj.level1.level2.level3.value} and mapped`
          }
        }
      }
    }));
    
    expect(mapped.value?.level1.level2.level3.value).toBe('deeply nested and mapped');
  });
  
  it('should handle very large trace histories', () => {
    let signal = Signal.success('test');
    
    // Create a large trace history
    for (let i = 0; i < 1000; i++) {
      signal = signal.reflect(`Reflection ${i}`);
    }
    
    const traceData = signal.traceData();
    expect(traceData[0].reflections?.length).toBe(1000);
    
    // Test that operations still work efficiently with large traces
    const mapped = signal.map(v => v.toUpperCase());
    expect(mapped.value).toBe('TEST');
  });
  
  it('should handle circular references', () => {
    const obj: any = { name: 'circular' };
    obj.self = obj; // Create circular reference
    
    const signal = Signal.success(obj);
    
    // This should not cause infinite recursion
    const trace = signal.trace();
    expect(trace).toBeDefined();
    
    // JSON.stringify typically throws on circular refs
    // So we're testing that our traceData method handles this properly
    const traceData = signal.traceData();
    expect(traceData).toBeDefined();
  });
});