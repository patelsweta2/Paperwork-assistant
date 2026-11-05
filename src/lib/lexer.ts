import type { LexerToken, PlaceholderPattern } from "../type/document";
import { PLACEHOLDER_PATTERNS } from "../constants/placeholderPatterns";

const SORTED_PATTERNS = [...PLACEHOLDER_PATTERNS].sort(
  (a, b) => b.start.length - a.start.length
);

const findMatchingPattern = (
  text: string,
  index: number,
  patterns: PlaceholderPattern[]
): PlaceholderPattern | null =>
  patterns.find((p) => text.startsWith(p.start, index)) ?? null;

export const lexer = (text: string): LexerToken[] => {
  const tokens: LexerToken[] = [];
  let buffer = "";
  let i = 0;

  const flushBuffer = () => {
    if (buffer) {
      tokens.push({ type: "TEXT", value: buffer });
      buffer = "";
    }
  };

  while (i < text.length) {
    const pattern = findMatchingPattern(text, i, SORTED_PATTERNS);

    if (!pattern) {
      buffer += text[i];
      i++;
      continue;
    }

    const contentStart = i + pattern.start.length;
    const endIdx = text.indexOf(pattern.end, contentStart);

    if (endIdx === -1) {
      buffer += pattern.start;
      i = contentStart;
      continue;
    }

    const name = text.slice(contentStart, endIdx).trim();

    // Empty placeholder ({}, {{ }}) → normal text
    if (!name) {
      buffer += text.slice(i, endIdx + pattern.end.length);
      i = endIdx + pattern.end.length;
      continue;
    }

    flushBuffer();
    tokens.push({
      type: "PLACEHOLDER",
      value: name,
      patternType: pattern.type,
    });

    i = endIdx + pattern.end.length;
  }

  flushBuffer();
  return tokens;
};