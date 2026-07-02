import * as XLSX from "xlsx";

export const readExcel = async (file: File): Promise<ArrayBuffer> => {
  return await file.arrayBuffer();
};

export const openWorkbook = (buffer: ArrayBuffer) => {
  return XLSX.read(buffer, {
    type: "array",
  });
};

// Workbook --> Sheet
export const getFirstSheet = (workbook: XLSX.WorkBook) => {
  const sheetName = workbook.SheetNames[0];

  return workbook.Sheets[sheetName];
};

// Sheet --> JSON
export const sheetToJson = (sheet: XLSX.WorkSheet) => {
  return XLSX.utils.sheet_to_json(sheet);
};
