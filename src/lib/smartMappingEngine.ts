import type { Placeholder, PlaceholderMapping } from "../type/document";
import { autoMap } from "./mappingEngine";
import { getEmbedding } from "./embeddingEngine";
import { cosineSimilarity } from "./similarityEngine";
import { stringSimilarity } from "./fuzzyEngine";

const CONFIDENCE_THRESHOLD = 0.5;
const FUZZY_THRESHOLD = 0.75;

export const smartAutoMap = async (
  placeholders: Placeholder[],
  headers: string[]
): Promise<PlaceholderMapping[]> => {

  const exactResults = autoMap(placeholders, headers);

  const unmatchedResults = exactResults.filter((m) => !m.matched);

  const usedHeaders = new Set(
    exactResults.filter((m) => m.matched && m.column).map((m) => m.column)
  );

  if (unmatchedResults.length === 0) {
    return exactResults;
  }

  const fuzzyResultsMap = new Map<string, PlaceholderMapping>();

  for (const mapping of unmatchedResults) {
    let bestHeader: string | null = null;
    let bestScore = 0;

    for (const header of headers) {
      if (usedHeaders.has(header)) continue;

      const score = stringSimilarity(mapping.placeholder, header);
      if (score > bestScore) {
        bestScore = score;
        bestHeader = header;
      }
    }

    if (bestHeader && bestScore >= FUZZY_THRESHOLD) {
      fuzzyResultsMap.set(mapping.placeholder, {
        placeholder: mapping.placeholder,
        column: bestHeader,
        matched: true,
        confidence: bestScore,
        source: "fuzzy",
      });
      usedHeaders.add(bestHeader);
    }
  }

  const stillUnmatched = unmatchedResults.filter(
    (m) => !fuzzyResultsMap.has(m.placeholder)
  );
  const availableHeaders = headers.filter((h) => !usedHeaders.has(h));

  const aiResultsMap = new Map<string, PlaceholderMapping>();

  if (stillUnmatched.length > 0 && availableHeaders.length > 0) {
    const headerEmbeddings = new Map<string, number[]>();
    for (const header of availableHeaders) {
      headerEmbeddings.set(header, await getEmbedding(header));
    }

    for (const mapping of stillUnmatched) {
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
  }

  return exactResults.map(
    (m) => fuzzyResultsMap.get(m.placeholder) ?? aiResultsMap.get(m.placeholder) ?? m
  );
};