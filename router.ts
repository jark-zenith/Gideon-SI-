import type { ModelProvider } from './types.js';

export interface RouteRequest {
  needsTools?: boolean;
  needsVision?: boolean;
}

/**
 * MVP router: deliberately trivial. Returns the first registered provider that has the
 * required capabilities. Multi-model routing rules are PLANNED (Phase 11) per ADR-001.
 */
export class ModelRouter {
  private readonly providers: ModelProvider[] = [];

  register(p: ModelProvider): void {
    if (this.providers.some((x) => x.id === p.id)) throw new Error(`provider already registered: ${p.id}`);
    this.providers.push(p);
  }

  select(req: RouteRequest = {}): ModelProvider {
    const hit = this.providers.find((p) => {
      const c = p.capabilities();
      return (!req.needsTools || c.toolCalling) && (!req.needsVision || c.vision);
    });
    if (!hit) throw new Error('no model provider available for the requested capabilities');
    return hit;
  }
}
