import { useState } from "react";
import { saveAs } from "file-saver";

import DocxUploader from "../components/DocxUploader";
import ExcelUploader from "../components/ExcelUploader";

import type { ExcelRow, Placeholder } from "../type/document";

import { autoMap } from "../lib/mappingEngine";
import { buildReplacementMap } from "../lib/replacementEngine";
import { normalizePlaceholders, openDocx } from "../lib/docxParser";       // ✅ fresh zip banane ke liye
import { createTemplate } from "../lib/docxTemplate"; // ✅ fresh instance ke liye
import JSZip from "jszip";

const Home = () => {
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);

  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ExcelRow[]>([]);

  const mappings =
    placeholders.length > 0 && headers.length > 0
      ? autoMap(placeholders, headers)
      : [];

  const handleGenerate = async () => {
    if (!templateBuffer) {
      alert("Please upload a DOCX template.");
      return;
    }
    if (rows.length === 0) {
      alert("Please upload an Excel file.");
      return;
    }
   

    try {
      const bundleZip  = new JSZip()
      for (const [index, row] of rows.entries()) {
        const docxZip  = openDocx(templateBuffer);
        normalizePlaceholders(docxZip );
        const freshDoc = createTemplate(docxZip );
        const replacementMap = buildReplacementMap(mappings, row);
        freshDoc.render(replacementMap);
        const blob = freshDoc.getZip().generate({
          type: "blob",
          mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "DEFLATE",
          compressionOptions: {
            level: 9,
          },
        });
        const fileName = `document_${index + 1}.docx`;
        const fileBuffer = await blob.arrayBuffer();
        bundleZip.file(fileName, fileBuffer);
      }
      const finalZip = await bundleZip.generateAsync({ type: "blob" });
      saveAs(finalZip, "generated_documents.zip");
      console.log(`${rows.length} documents bundled and downloaded.`);
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Failed to generate document. Check console for details.");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <DocxUploader
        onTemplateLoaded={(buffer, extractedPlaceholders) => {
          setTemplateBuffer(buffer);           // ✅ buffer store
          setPlaceholders(extractedPlaceholders);
        }}
      />

      <ExcelUploader
        onExcelLoaded={(excelRows, excelHeaders) => {
          setRows(excelRows);
          setHeaders(excelHeaders);
        }}
      />

      {templateBuffer && rows.length > 0 && mappings.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={handleGenerate}
            className="rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition hover:bg-green-700"
          >
            Generate DOCX
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;