import type { Placeholder, PlaceholderMapping } from "../type/document";

export const autoMap = (
  placeholders: Placeholder[],
  headers: string[],
): PlaceholderMapping[] => {
  return placeholders.map((placeholder) => {
    const column = headers.find(
      (header) =>
        header.trim().toLowerCase() === placeholder.name.trim().toLowerCase(),
    );

    return {
      placeholder: placeholder.name,
      column: column ?? null,

      matched: column !== undefined,
    };
  });
};
