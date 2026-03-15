import { z } from "zod";

export const facetIdSchema = z.string().min(1);
export const timestampSchema = z.string().min(1);
export const urlSchema = z.string().url();

export const searchQuerySchema = z.object({
  id: facetIdSchema,
  text: z.string().min(1),
  submittedAt: timestampSchema,
  locale: z.string().min(2).optional()
});

export const sourceProvenanceSchema = z.object({
  sourceId: facetIdSchema,
  providerKey: z.string().min(1),
  url: urlSchema,
  publisher: z.string().min(1).optional(),
  retrievedAt: timestampSchema
});

export const searchResultSchema = z.object({
  id: facetIdSchema,
  title: z.string().min(1),
  snippet: z.string().min(1).optional(),
  url: urlSchema,
  provenance: sourceProvenanceSchema
});

export const searchRequestSchema = z.object({
  query: searchQuerySchema,
  limit: z.number().int().positive().max(50).optional(),
  providerKeys: z.array(z.string().min(1)).optional()
});

export const searchResponseSchema = z.object({
  query: searchQuerySchema,
  results: z.array(searchResultSchema),
  nextCursor: z.string().min(1).optional(),
  safetyDisposition: z.enum(["allow", "review", "redirect", "refuse"])
});
