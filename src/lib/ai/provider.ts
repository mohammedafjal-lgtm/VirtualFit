import type { AIProvider } from "./types";

const providers = new Map<string, () => AIProvider>();

/**
 * Register a provider factory by name.
 * Call this once per adapter in providers/index.ts.
 */
export function registerProvider(name: string, factory: () => AIProvider) {
  providers.set(name, factory);
}

/**
 * Resolve the active provider.
 * Reads AI_PROVIDER from env (default: "openai").
 */
export function getAIProvider(): AIProvider {
  const name = process.env.AI_PROVIDER ?? "openai";
  const factory = providers.get(name);

  if (!factory) {
    throw new Error(
      `Unknown AI_PROVIDER "${name}". Registered: ${[...providers.keys()].join(", ")}`
    );
  }

  return factory();
}