import type { ModelRequest, ModelResponse } from "./types.js";

export interface GideonModelProvider {
  readonly id: string;
  generate(request: ModelRequest): Promise<ModelResponse>;
}

export class ProviderRegistry {
  private readonly providers = new Map<string, GideonModelProvider>();

  register(provider: GideonModelProvider): void {
    if (this.providers.has(provider.id)) {
      throw new Error(`Provider already registered: ${provider.id}`);
    }
    this.providers.set(provider.id, provider);
  }

  get(id: string): GideonModelProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Unknown GIDEON model provider: ${id}`);
    }
    return provider;
  }
}
