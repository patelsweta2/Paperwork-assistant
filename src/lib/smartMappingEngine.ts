import type { Placeholder, PlaceholderMapping } from "../type/document";
import { autoMap } from "./mappingEngine";
import { getEmbedding } from "./embeddingEngine";
import { cosineSimilarity } from "./similarityEngine";

const CONFIDENCE_THRESHOLD = 0.5;

export const smartAutoMap = async (
  placeholders: Placeholder[],
  headers: string[]
): Promise<PlaceholderMapping[]> => {
  // Pass 1 — Exact match
  const exactResults = autoMap(placeholders, headers);

  const unmatchedResults = exactResults.filter((m) => !m.matched);

  const usedHeaders = new Set(
    exactResults.filter((m) => m.matched && m.column).map((m) => m.column)
  );
  const availableHeaders = headers.filter((h) => !usedHeaders.has(h));

  if (unmatchedResults.length === 0 || availableHeaders.length === 0) {
    return exactResults;
  }

  const headerEmbeddings = new Map<string, number[]>();
  for (const header of availableHeaders) {
    headerEmbeddings.set(header, await getEmbedding(header));
  }

  const aiResultsMap = new Map<string, PlaceholderMapping>();

  for (const mapping of unmatchedResults) {
    const placeholderEmbedding = await getEmbedding(mapping.placeholder);

    let bestHeader: string | null = null;
    let bestScore = 0;

    for (const header of availableHeaders) {
      const headerEmbedding = headerEmbeddings.get(header)!;
      const score = cosineSimilarity(placeholderEmbedding, headerEmbedding);

      if (score > bestScore) {
        bestScore = score;
        bestHeader = header;
      }
    }

    const isConfident = bestScore >= CONFIDENCE_THRESHOLD;

    aiResultsMap.set(mapping.placeholder, {
      placeholder: mapping.placeholder,
      column: isConfident ? bestHeader : null,
      matched: isConfident,
      confidence: isConfident ? bestScore : 0,
      source: isConfident ? "ai" : "none",
    });
  }

  const finalResults = exactResults.map((mapping) =>
    aiResultsMap.has(mapping.placeholder) ? aiResultsMap.get(mapping.placeholder)! : mapping
  );

  return finalResults;
};