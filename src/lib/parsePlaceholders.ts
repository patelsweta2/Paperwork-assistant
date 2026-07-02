import type { LexerToken, Placeholder } from "../type/document";

export const parsePlaceholders = (tokens: LexerToken[]): Placeholder[] => {
  const map = new Map<string, Placeholder>();

  for (const token of tokens) {
    if (token.type !== "PLACEHOLDER") {
      continue;
    }

    const name = token.value.trim();
    const key = `${token.patternType}:${name}`;

    if (map.has(key)) {
      map.get(key)!.occurrences++;
    } else {
      map.set(key, {
        id: crypto.randomUUID(),
        name,
        occurrences: 1,
        type: token.patternType ?? "unknown",
      });
    }
  }

  return [...map.values()];
};
