import type { ExcelRow, PlaceholderMapping } from "../type/document";

export const buildReplacementMap = (
  mappings: PlaceholderMapping[],
  row: ExcelRow,
): Record<string, unknown> => {
  const replacementMap: Record<string, unknown> = {};

  for (const mapping of mappings) {
    const rawValue =
      mapping.matched && mapping.column ? row[mapping.column] : undefined;

    const isEmpty =
      rawValue === undefined ||
      rawValue === null ||
      (typeof rawValue === "string" && rawValue.trim() === "");

    replacementMap[mapping.placeholder] = isEmpty
      ? `{${mapping.placeholder}}`
      : rawValue;
  }

  return replacementMap;
};
