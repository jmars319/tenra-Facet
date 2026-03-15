import { z } from "zod";

export const facetIdSchema = z.string().min(1);
export const timestampSchema = z.string().min(1);
export const urlSchema = z.string().url();
export const hostnameSchema = z.string().min(1);
export const providerReferenceSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1)
});

export const searchQuerySchema = z.object({
  id: facetIdSchema,
  text: z.string().min(1),
  submittedAt: timestampSchema,
  locale: z.string().min(2).optional()
});

export const resultCommonalitySchema = z.object({
  status: z.enum(["unique", "shared"]),
  providerCount: z.number().int().positive()
});

export const resultProvenanceSchema = z.object({
  surfacedBy: z.array(providerReferenceSchema).min(1),
  commonality: resultCommonalitySchema
});

export const searchResultSchema = z.object({
  id: facetIdSchema,
  title: z.string().min(1),
  url: urlSchema,
  hostname: hostnameSchema,
  snippet: z.string().min(1).optional(),
  provider: providerReferenceSchema,
  publishedAt: timestampSchema.optional(),
  provenance: resultProvenanceSchema,
  labels: z.array(z.string().min(1)).optional()
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

export const reframingModeSchema = z.enum([
  "broaden",
  "compare",
  "distinguish",
  "contextualize"
]);

export const orientationFollowupSchema = z.object({
  id: facetIdSchema,
  prompt: z.string().min(1)
});

export const relatedConceptSchema = z.object({
  id: facetIdSchema,
  label: z.string().min(1),
  queryHint: z.string().min(1)
});

export const orientationBlockSchema = z.object({
  id: facetIdSchema,
  mode: reframingModeSchema.optional(),
  heading: z.string().min(1),
  line: z.string().min(1).optional(),
  followups: z.array(orientationFollowupSchema).min(1),
  relatedConcepts: z.array(relatedConceptSchema).optional()
});

export const reframingRequestSchema = z.object({
  query: searchQuerySchema,
  modes: z.array(reframingModeSchema).optional()
});

export const reframingResponseSchema = z.object({
  query: searchQuerySchema,
  block: orientationBlockSchema,
  safetyDisposition: z.enum(["allow", "review", "redirect", "refuse"])
});
