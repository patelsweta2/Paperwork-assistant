import { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { ExcelRow, PlaceholderMapping } from "../type/document"; // 👈 Mapping → PlaceholderMapping
import { normalizePlaceholders, openDocx } from "../lib/docxParser";
import { createTemplate } from "../lib/docxTemplate";
import { buildReplacementMap } from "../lib/replacementEngine";
import { MAX_ROWS } from "../constants/placeholderPatterns";

type Params = {
  templateBuffer: ArrayBuffer | null;
  rows: ExcelRow[];
  mappings: PlaceholderMapping[];
};

export const useDocxGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);


  const generate = async ({ templateBuffer, rows, mappings }: Params) => {
    if (!templateBuffer) {
      alert("Please upload a DOCX template.");
      return;
    }
    if (rows.length === 0) {
      alert("Please upload an Excel file.");
      return;
    }
        if (rows.length > MAX_ROWS) {   
      alert(
        `You can generate up to ${MAX_ROWS} documents at a time. Your file has ${rows.length} rows — please split it into smaller files.`
      );
      return;
    }

    setIsGenerating(true);
    try {
      const bundleZip = new JSZip();

      for (const [index, row] of rows.entries()) {
        const docxZip = openDocx(templateBuffer);
        normalizePlaceholders(docxZip);
        const freshDoc = createTemplate(docxZip);
        const replacementMap = buildReplacementMap(mappings, row);

        freshDoc.render(replacementMap);
        const blob = freshDoc.getZip().generate({
          type: "blob",
          mimeType:
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          compression: "DEFLATE",
          compressionOptions: { level: 9 },
        });

        const fileName = `document_${index + 1}.docx`;
        const fileBuffer = await blob.arrayBuffer();
        bundleZip.file(fileName, fileBuffer);
      }

      const finalZip = await bundleZip.generateAsync({ type: "blob" });
      saveAs(finalZip, "generated_documents.zip");
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Failed to generate document. Check console for details.");
    } finally {
      setIsGenerating(false);
    }
  };

  return { generate, isGenerating };
};