import type { SearchQuery, SearchResult } from "@facet/domain";
import { orientWithMockLayer } from "@facet/reframing";
import { searchMockResults } from "@facet/search-providers";
import type { FacetSearchResponse } from "@facet/api-contracts";

import { createId, nowIso } from "./facetStorage";
import type { LocalCorpusDocument } from "./facetTypes";

const localCorpusProvider = { key: "local-corpus", label: "Local Corpus" };
const stopWords = new Set([
  "about",
  "after",
  "before",
  "from",
  "have",
  "into",
  "that",
  "the",
  "this",
  "what",
  "when",
  "where",
  "which",
  "with",
  "would",
  "your",
]);

export const createSearchQuery = (text: string, locale: string): SearchQuery => ({
  id: createId(),
  text: text.trim(),
  submittedAt: nowIso(),
  ...(locale.trim() ? { locale: locale.trim() } : {}),
});

export const tokenize = (input: string): string[] =>
  input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

export const sourceHostname = (sourceUrl: string): string => {
  if (!sourceUrl.trim()) return "local corpus";

  try {
    return new URL(sourceUrl.trim()).hostname;
  } catch {
    return "local corpus";
  }
};

const sourceUrlForDocument = (document: LocalCorpusDocument): SearchResult["url"] =>
  (document.sourceUrl.trim() || `facet-local://document/${document.id}`) as SearchResult["url"];

export const snippetForDocument = (body: string, words: string[]): string => {
  const normalizedBody = body.toLowerCase();
  const firstHit = words
    .map((word) => normalizedBody.indexOf(word))
    .filter((index) => index >= 0)
    .sort((first, second) => first - second)[0];
  const start = Math.max(0, (firstHit ?? 0) - 70);
  const snippet = body.slice(start, start + 220).trim();

  return start > 0 ? `...${snippet}` : snippet;
};

export const searchLocalCorpus = (query: SearchQuery, documents: LocalCorpusDocument[]): SearchResult[] => {
  const words = tokenize(query.text);
  if (words.length === 0 || documents.length === 0) return [];

  return documents
    .map((document) => {
      const title = document.title.toLowerCase();
      const body = document.body.toLowerCase();
      const tagText = document.tags.join(" ").toLowerCase();
      const score = words.reduce((total, word) => {
        const titleScore = title.includes(word) ? 4 : 0;
        const tagScore = tagText.includes(word) ? 3 : 0;
        const bodyScore = body.includes(word) ? 1 : 0;

        return total + titleScore + tagScore + bodyScore;
      }, 0);

      return { document, score };
    })
    .filter(({ score }) => score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 8)
    .map(({ document, score }) => ({
      id: `local-corpus-${document.id}`,
      title: document.title,
      url: sourceUrlForDocument(document),
      hostname: sourceHostname(document.sourceUrl),
      snippet: snippetForDocument(document.body, words),
      provider: localCorpusProvider,
      publishedAt: document.updatedAt,
      provenance: {
        surfacedBy: [localCorpusProvider],
        commonality: {
          status: "unique",
          providerCount: 1,
        },
      },
      labels: [...document.tags, `${score} local match points`].filter(Boolean),
    }));
};

export const runLocalFacetSearch = async (
  text: string,
  locale: string,
  localCorpus: LocalCorpusDocument[],
): Promise<FacetSearchResponse> => {
  const query = createSearchQuery(text, locale);
  const [results, block] = await Promise.all([
    searchMockResults(query, { limit: 8, locale }),
    orientWithMockLayer({ query }),
  ]);
  const localResults = searchLocalCorpus(query, localCorpus);

  return {
    search: {
      query,
      results: [...localResults, ...results].slice(0, 8),
      safetyDisposition: "allow",
    },
    reframing: {
      query,
      block,
      safetyDisposition: "allow",
    },
  };
};

