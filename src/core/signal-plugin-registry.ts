import type { Signal } from "./signal";
import type {SignalPlugin, SignalPluginConfig} from "./types";
/**
 * Type-safe plugin registry for Signal system
 */
export class SignalPluginRegistry {
  private static instance: SignalPluginRegistry;
  private plugins: Map<string, SignalPlugin<any>> = new Map();
  
  private constructor() {
    // Private constructor for singleton pattern
  }
  
  static getInstance(): SignalPluginRegistry {
    if (!SignalPluginRegistry.instance) {
      SignalPluginRegistry.instance = new SignalPluginRegistry();
    }
    return SignalPluginRegistry.instance;
  }
  
  register<TOptions>(plugin: SignalPlugin<TOptions>): void {
    if (this.plugins.has(plugin.id)) {
      console.warn(`Plugin '${plugin.id}' is already registered. Skipping registration.`);
      return;
    }
    
    if (plugin.init) {
      plugin.init();
    }
    
    this.plugins.set(plugin.id, plugin);
  }
  
  unregister(pluginId: string): void {
    const plugin = this.plugins.get(pluginId);
    if (plugin?.cleanup) {
      plugin.cleanup();
    }
    this.plugins.delete(pluginId);
  }
  
  getPlugin(pluginId: string): SignalPlugin<any> | undefined {
    return this.plugins.get(pluginId);
  }
  
  hasPlugin(pluginId: string): boolean {
    return this.plugins.has(pluginId);
  }
}


