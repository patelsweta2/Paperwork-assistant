import type { ExcelRow } from "../type/document";

export const extractHeaders = (
    rows: ExcelRow[]
): string[] => {

    if(rows.length === 0){

        return [];

    }

    return Object.keys(rows[0]);

}