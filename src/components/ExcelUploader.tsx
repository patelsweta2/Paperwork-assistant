import { useState } from "react";
import type { ExcelFile } from "../type/document";
import { getFirstSheet, openWorkbook, readExcel, sheetToJson } from "../lib/excelReader";
import type { WorkSheet } from "xlsx";
import { extractHeaders } from "../lib/excelParser";

const ExcelUploader = () => {

    const [excel, setExcel] = useState<ExcelFile | null>(null);

    const handleUpload = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = e.target.files?.[0];

        if (!file) return;

        if (
            !file.name.endsWith(".xlsx") &&
            !file.name.endsWith(".xls")
        ) {

            alert("Upload only Excel file");

            return;

        }

        setExcel({

            file,

            fileName: file.name,

            size: file.size,

            type: file.type,

        });
        const buffer = await readExcel(file);

        const workbook = openWorkbook(buffer);

        const sheet = getFirstSheet(workbook);

        const rows = sheetToJson(sheet);

        const headers = extractHeaders(rows);

        console.log(headers);

    };

    return (

        <div>

            <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUpload}
            />

            {

                excel &&

                <div>

                    <p>{excel.fileName}</p>

                    <p>{excel.size}</p>

                </div>

            }

        </div>

    );

};

export default ExcelUploader;

function sheetToRows(sheet: WorkSheet) {
    throw new Error("Function not implemented.");
}
