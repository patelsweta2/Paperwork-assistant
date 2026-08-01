import type { ExcelRow, Mapping } from "../type/document";

type Params = {
  templateBuffer: ArrayBuffer | null;
  rows: ExcelRow[];
  mappings: Mapping[];
};

export function getCurrentStep({
  templateBuffer,
  rows,
  mappings,
}: Params): number {
  if (!templateBuffer) return 0;

  if (rows.length === 0) return 1;

  if (mappings.length === 0) return 2;

  return 3;
}