import { useState } from "react"
import DocxUploader from "../components/DocxUploader"
import ExcelUploader from "../components/ExcelUploader"
import type { ExcelRow, Placeholder } from "../type/document";
import { autoMap } from "../lib/mappingEngine";

const Home = () => {
    const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [rows, setRows] = useState<ExcelRow[]>([]);
    const mappings =
        placeholders.length > 0 &&
            headers.length > 0
            ? autoMap(placeholders, headers)
            : [];

    console.log(mappings);
    return (
        <>
            <DocxUploader onPlaceholdersExtracted={setPlaceholders} />
            <ExcelUploader onExcelLoaded={(rows, headers) => {

                setRows(rows);

                setHeaders(headers);

            }} />
        </>
    )
}

export default Home