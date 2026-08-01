import { useState } from "react";
import type { ExcelFile, ExcelRow } from "../type/document";
import { getFirstSheet, openWorkbook, readExcel, sheetToJson } from "../lib/excelReader";
import { extractHeaders } from "../lib/excelParser";

interface Props {

    onExcelLoaded: (

        rows: ExcelRow[],

        headers: string[]

    ) => void;

}

const ExcelUploader = ({ onExcelLoaded }: Props) => {

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

        // console.log("rows :", rows);
        const headers = extractHeaders(rows);
        onExcelLoaded(rows, headers)

    };

    return (

        <div className="max-w-xl mx-auto mt-10 rounded-lg border border-gray-300 bg-white p-6 shadow-md">

            <h2 className="mb-4 text-2xl font-semibold">
                Upload Excel File
            </h2>

            <label
                htmlFor="excel-upload"
                className="inline-block cursor-pointer rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
            >
                Upload Excel
            </label>

            <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUpload}
                className="hidden"
            />

            {!excel && (
                <p className="mt-4 text-gray-500">
                    No Excel file uploaded
                </p>
            )}

            {excel && (
                <div className="mt-6 rounded-md bg-gray-100 p-4">

                    <p className="font-semibold text-green-600">
                        ✅ Excel Uploaded Successfully
                    </p>

                    <div className="mt-3 space-y-2 text-sm">

                        <p>
                            <span className="font-semibold">
                                File Name:
                            </span>{" "}
                            {excel.fileName}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Size:
                            </span>{" "}
                            {(excel.size / 1024).toFixed(2)} KB
                        </p>

                        <p className="break-all">
                            <span className="font-semibold">
                                Type:
                            </span>{" "}
                            {excel.type}
                        </p>

                    </div>

                </div>
            )}

        </div>

    );

};

export default ExcelUploader;


