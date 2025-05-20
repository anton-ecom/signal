import { describe, it, expect, vi } from 'vitest';
import { Signal } from '../src/core/signal';

// Simulate a gateway config from your other example
interface GatewayConfig {
  gatewayId: string;
  pool: string;
  status: string;
  assignedAt: string;
  publicKey: string;
}

// Mock repository
class MockGatewayRepository {
  getConfig(): Signal<GatewayConfig | null> {
    return Signal.success({
      gatewayId: 'synet-gw1',
      pool: '10.20.0.0/24',
      status: 'assigned',
      assignedAt: '2025-05-02T15:52:37.000Z',
      publicKey: 'ZCYnY1ZrfiJmtThhP1cCIXWCLKflBOpxBOWFJ7RB2VQ='
    })
    .layer('Repository')
    .reflect('Config retrieved from storage');
  }
}

// Mock use case
class MockGatewayUseCases {
  private repository: MockGatewayRepository;
  
  constructor() {
    this.repository = new MockGatewayRepository();
  }
  
  enhanceConfig(config: GatewayConfig | null): Signal<GatewayConfig | null> {
    if (config) {
      const newValue = { ...config };
      newValue.gatewayId = `enhanced-${newValue.gatewayId}`;
      return Signal.success(newValue)
        .reflect('Config enhanced');
    }
    
    return Signal.failure('Config is null');
  }
  
  async getConfig(): Promise<Signal<GatewayConfig | null>> {
    const signal = this.repository.getConfig();
    
    return Signal.extend(signal)
      .layer('UseCase')
      .flatMap((value) => this.enhanceConfig(value))
      .reflect('Processing complete')

  }
}

describe('Signal - Real World Example', () => {
  it('should work with the gateway example', async () => {
    const useCases = new MockGatewayUseCases();
    const result = await useCases.getConfig();
    
    expect(result.isSuccess).toBe(true);
    expect(result.value).toBeDefined();
    expect(result.value?.gatewayId).toBe('enhanced-synet-gw1');
    
    const traceData = result.traceData();
    
    
    expect(traceData.length).toBe(2); // Repository and UseCase layers
    expect(traceData[0].layer).toBe('Repository');
    expect(traceData[1].layer).toBe('UseCase');
  });
});