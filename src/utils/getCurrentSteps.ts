import type { ExcelRow } from "../type/document";

type Params = {
  templateBuffer: ArrayBuffer | null;
  rows: ExcelRow[];
};

export function getCurrentStep({ templateBuffer, rows }: Params): number {
  if (!templateBuffer) return 0; 
  if (rows.length === 0) return 1; 
  return 2; 
}