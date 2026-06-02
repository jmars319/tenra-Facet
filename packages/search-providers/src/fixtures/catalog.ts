import type { SearchProviderReference } from "@facet/domain";

export const mockProviderCatalog: SearchProviderReference[] = [
  { key: "mock-atlas", label: "Mock Atlas" },
  { key: "mock-meridian", label: "Mock Meridian" },
  { key: "mock-signal", label: "Mock Signal" },
];

const providerByKey = new Map(mockProviderCatalog.map((provider) => [provider.key, provider]));

export function requireProvider(key: string): SearchProviderReference {
  const provider = providerByKey.get(key);

  if (!provider) {
    throw new Error(`Unknown mock provider: ${key}`);
  }

  return provider;
}

