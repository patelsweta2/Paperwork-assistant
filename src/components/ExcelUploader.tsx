import { useState } from "react";
import type { ExcelFile, ExcelRow } from "../type/document";
import { getFirstSheet, openWorkbook, readExcel, sheetToJson } from "../lib/excelReader";
import { extractHeaders } from "../lib/excelParser";
import toast from "react-hot-toast";

interface Props {
    hasTemplate: boolean;
    onExcelLoaded: (rows: ExcelRow[], headers: string[]) => void;
    onReviewMapping?: () => void;
    isMappingReady?: boolean;
    unmatchedCount?: number;
    isMatching: boolean;
}

const ExcelUploader = ({ hasTemplate, onExcelLoaded, onReviewMapping,
    isMappingReady,
    unmatchedCount = 0,isMatching }: Props) => {
    const [excel, setExcel] = useState<ExcelFile | null>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
            toast.error('Upload only Excel file')
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
        console.log("Rows :", rows);

        if (rows.length === 0) {
            toast.error("This file has headers but no data rows. Please add at least one row.");
            return;
        }

        if (rows.length > 100) {
            toast.error(`Maximum 100 rows allowed. Your file has ${rows.length} rows.`)
            return;
        }
        setExcel({ file, fileName: file.name, size: file.size, type: file.type });
        const headers = extractHeaders(rows);
        onExcelLoaded(rows, headers);
    };

    return (
        <div
            className={`flex h-full flex-col rounded-lg border border-[#1A2B4C]/10 bg-white p-6 shadow-sm transition ${!hasTemplate ? "opacity-50" : ""
                }`}
        >
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                        Step 2
                    </p>
                    <h2 className="mt-1 font-serif text-xl text-[#1A2B4C]">
                        Upload Excel
                    </h2>
                </div>
                {excel && (
                    <span className="rounded-full bg-[#1A2B4C]/5 px-2 py-1 font-mono text-xs text-[#1A2B4C]">
                        .xlsx
                    </span>
                )}
            </div>

            {/* Upload Zone */}
            {!excel ? (
                <label
                    htmlFor={hasTemplate ? "excel-upload" : undefined}
                    className={`flex flex-1 flex-col items-center justify-center rounded-md border-2 border-dashed px-4 py-10 text-center transition ${hasTemplate
                        ? "cursor-pointer border-[#1A2B4C]/15 bg-green-50 hover:border-green-400 hover:bg-green-100"
                        : "cursor-not-allowed border-[#1A2B4C]/10 bg-[#FAF8F3]/50"
                        }`}
                >
                    <span className="font-mono text-sm text-[#1A2B4C]/60">
                        {hasTemplate ? "Click to upload .xlsx" : "Upload a template first"}
                    </span>
                    <span className="mt-1 text-xs text-[#6B7280]">
                        Spreadsheet with matching data
                    </span>
                </label>
            ) : (
                <div className="flex flex-1 flex-col justify-between">
                    <div className="rounded-md bg-green-50 p-4">
                        <p className="flex items-center gap-2 font-mono text-sm text-[#1A2B4C]">
                            <span className="text-[#2F6E4E]">✓</span>
                            {excel.fileName}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                            {(excel.size / 1024).toFixed(2)} KB
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <label
                            htmlFor="excel-upload"
                            className="cursor-pointer font-mono text-xs text-[#6B7280] underline hover:text-[#1A2B4C]"
                        >
                            Replace file
                        </label>
                        {isMatching ? (<p className="flex items-center gap-2 font-mono text-xs text-[#6B7280]">
                            <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#1A2B4C]/30 border-t-[#1A2B4C]" />
                            Analyzing fields...
                        </p>) :
                        (isMappingReady && onReviewMapping && (
                            <button
                                type="button"
                                onClick={onReviewMapping}
                                className="flex items-center gap-1.5 rounded-md border border-[#1A2B4C]/20 px-3 py-1.5 font-mono text-xs text-[#1A2B4C] transition hover:bg-[#1A2B4C]/5"
                            >
                                Review Mapping
                                {unmatchedCount > 0 && (
                                    <span className="rounded-full bg-[#E8A33D]/20 px-1.5 py-0.5 text-[#E8A33D]">
                                        {unmatchedCount}
                                    </span>
                                )}
                            </button>
                        ) )}
                    </div>
                </div>
            )}

            <input
                id="excel-upload"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleUpload}
                className="hidden"
                disabled={!hasTemplate}
            />
        </div>
    );
};

export default ExcelUploader;