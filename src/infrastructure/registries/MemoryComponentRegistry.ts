import { Component } from '../../core/ports/ComponentRegistry';
import { ComponentRegistry } from '../../core/ports/ComponentRegistry';

/**
 * Реализация реестра компонентов в памяти
 * Реализует порт ComponentRegistry
 */
export class MemoryComponentRegistry implements ComponentRegistry {
  private components: Map<string, Component> = new Map();

  register(name: string, component: Component): void {
    if (!name || typeof name !== 'string') {
      throw new Error('Component name must be a non-empty string');
    }
    
    if (!component) {
      throw new Error('Component must be provided');
    }

    this.components.set(name, component);
  }

  get(name: string): Component | null {
    return this.components.get(name) || null;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  getAll(): Record<string, Component> {
    const result: Record<string, Component> = {};
    this.components.forEach((component, name) => {
      result[name] = component;
    });
    return result;
  }

  unregister(name: string): boolean {
    return this.components.delete(name);
  }

  clear(): void {
    this.components.clear();
  }
}
