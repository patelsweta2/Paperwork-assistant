import { useState } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import type { ExcelRow, PlaceholderMapping } from "../type/document"; // 👈 Mapping → PlaceholderMapping
import { normalizePlaceholders, openDocx } from "../lib/docxParser";
import {
  createTemplate
} from "../lib/docxTemplate";
import { buildReplacementMap } from "../lib/replacementEngine";
import { MAX_ROWS } from "../constants/placeholderPatterns";
import toast from "react-hot-toast";

type Params = {
  templateBuffer: ArrayBuffer | null;
  rows: ExcelRow[];
  mappings: PlaceholderMapping[];
};

export const useDocXGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [generatedZip, setGeneratedZip] = useState<Blob | null>(null);

  const generate = async ({
    templateBuffer,
    rows,
    mappings,
  }: Params): Promise<boolean> => {
    if (!templateBuffer) {
      toast.error("Please upload a DOCX template.");
      return false;
    }
    if (rows.length === 0) {
      toast.error("Please upload an Excel file.");
      return false;
    }
    if (rows.length > MAX_ROWS) {
      toast.error(`You can generate up to ${MAX_ROWS} documents at a time.`);
      return false;
    }

    setIsGenerating(true);
    setProgress({ current: 0, total: rows.length });
    setGeneratedZip(null);

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

        setProgress({ current: index + 1, total: rows.length });

        await new Promise((resolve) => setTimeout(resolve, 30));
      }

      const finalZip = await bundleZip.generateAsync({ type: "blob" });
      setGeneratedZip(finalZip);
      toast.success(
        `${rows.length} document${rows.length > 1 ? "s" : ""} ready to download!`,
      );
      return true;
    } catch (error) {
      console.error("Generation Error:", error);
      toast.error("Failed to generate document. Check console for details.");
      return false;
    } finally {
      setIsGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };
  const download = () => {
    if (!generatedZip) return;
    saveAs(generatedZip, "generated_documents.zip");
  };
  const reset = () => {
    setGeneratedZip(null);
    setProgress({ current: 0, total: 0 });
    setIsGenerating(false);
  };
  return { generate, download, isGenerating, progress, generatedZip, reset };
};
