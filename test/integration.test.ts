import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

describe('Signal - Integration Tests', () => {
  it('should handle complex workflows', () => {
    type User = { id: number; name: string; active: boolean };
    
    // Simulate a user workflow with multiple transformations and validations
    const user: User = { id: 1, name: 'John', active: true };
    
    const result = Signal.success(user)
      .layer('UserService')
      .reflect('Processing user')
      .ensure(u => u.active, 'User is not active')
      .map(u => ({ ...u, name: u.name.toUpperCase() }))
      .reflect('User name capitalized')
      .layer('NotificationService')
      .reflect('Preparing notification')
      .map(u => `Notification for ${u.name} prepared`);
    
    //console.log(result);

    expect(result.isSuccess).toBe(true);
    expect(result.value).toBe('Notification for JOHN prepared');
    
    const traceData = result.traceData();
    expect(traceData.length).toBe(2); // Two layers
    expect(traceData[0].layer).toBe('UserService');
    expect(traceData[1].layer).toBe('NotificationService');
    expect(traceData[0].reflections?.length).toBe(2); // Two reflections in UserService
    expect(traceData[1].reflections?.length).toBe(1); // One reflection in NotificationService
  });
  
  it('should propagate failures correctly through transforms', () => {
    const result = Signal.success(5)
      .map(value => value * 2) // 10
      .ensure(value => value < 10, 'Value too high')
      .map(value => value + 1) // This should be skipped
      .reflect('This reflection should still be added');
    
    expect(result.isFailure).toBe(true);
    expect(result.error?.message).toBe('Value too high');
    
    const traceData = result.traceData();
    // The reflection should still be added even though the map was skipped
    const lastReflection = traceData[traceData.length - 1].reflections?.slice(-1)[0];
    expect(lastReflection?.message).toBe('This reflection should still be added');
  });
});