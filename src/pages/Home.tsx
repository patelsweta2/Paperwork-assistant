import { useState } from "react";
import { getCurrentStep } from "../utils/getCurrentSteps";
import DocxUploader from "../components/DocxUploader";
import ExcelUploader from "../components/ExcelUploader";
import GenerateSection from "../components/Generate/GenerateSections";
import AppLayout from "../../layout/AppLayout";
import type { ExcelRow, Placeholder, PlaceholderMapping } from "../type/document";
import { autoMap } from "../lib/mappingEngine";
import { useDocXGenerator } from "../hooks/useDocXGenerator";
import Hero from "../components/hero/Hero";
import Stepper from "../components/steeper/Steeper";
import Footer from "../components/footer/Footer";
import toast from "react-hot-toast";
import MappingModal from "../components/mapping/MappingModal";
import { smartAutoMap } from "../lib/smartMappingEngine";

const Home = () => {
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ExcelRow[]>([]);
  const [editableMappings, setEditableMappings] = useState<PlaceholderMapping[]>([]);
  const [isMappingConfirmed, setIsMappingConfirmed] = useState(false);
  const [isMappingModalOpen, setIsMappingModalOpen] = useState(false);
  const [originalMappings, setOriginalMappings] = useState<PlaceholderMapping[]>([]);
  const [isMatching, setIsMatching] = useState(false);

  const { generate, download, isGenerating, reset: resetGenerator, progress, generatedZip } = useDocXGenerator();

  const unmatchedCount = editableMappings.filter((m) => !m.matched).length;


  const currentStep = getCurrentStep({ templateBuffer, rows });

  const scrollToUpload = () => {
    document.getElementById("upload-template")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleReset = () => {
    setTemplateBuffer(null);
    setPlaceholders([]);
    setHeaders([]);
    setRows([]);
    resetGenerator();

    toast.success("Ready to start a new batch!");

    document.getElementById("upload-template")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleColumnChange = (placeholderName: string, newColumn: string) => {
    setEditableMappings((prev) =>
      prev.map((m) => {
        if (m.placeholder !== placeholderName) return m;

        if (newColumn === "__none__") {
          return { ...m, column: null, matched: false, source: "none", confidence: 0 };
        }

        return { ...m, column: newColumn, matched: true, source: "manual", confidence: 1 };
      })
    );
  };

  const handleConfirmMapping = () => {
    setIsMappingConfirmed(true);
  };

  const handleResetToDefault = (placeholderName: string) => {
    setEditableMappings((prev) =>
      prev.map((m) => {
        if (m.placeholder !== placeholderName) return m;
        const original = originalMappings.find((o) => o.placeholder === placeholderName);
        return original ? { ...original } : m;
      })
    )
  }

  const handleResetAllToDefault = () => {
    setEditableMappings(originalMappings.map((m) => ({ ...m })));
  };

  return (
    <AppLayout currentStep={currentStep} onReset={handleReset}>
      <Hero onCtaClick={scrollToUpload} />
      <Stepper currentStep={currentStep} />

      <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-6 px-6 md:grid-cols-2 md:px-0">
        <div id="upload-template" className="scroll-mt-24">

          <DocxUploader
            onTemplateLoaded={(buffer, extractedPlaceholders) => {
              setTemplateBuffer(buffer);
              setPlaceholders(extractedPlaceholders);
            }}
          />
        </div>
        <div id="upload-excel" className="scroll-mt-24">

          <ExcelUploader
            hasTemplate={!!templateBuffer}
            onExcelLoaded={async (excelRows, excelHeaders) => {
              setRows(excelRows);
              setHeaders(excelHeaders);

              setIsMatching(true);
              try {
                const initialMapping = await smartAutoMap(placeholders, excelHeaders);
                setEditableMappings(initialMapping);
                setOriginalMappings(initialMapping);
              } catch (error) {
                console.error("Mapping error:", error);
                toast.error("Field matching failed. You can still map manually.");
                const fallback = autoMap(placeholders, excelHeaders);
                setEditableMappings(fallback);
                setOriginalMappings(fallback);
              } finally {
                setIsMatching(false);
              }

              setIsMappingConfirmed(false);
            }}
            isMappingReady={editableMappings.length > 0}
            unmatchedCount={unmatchedCount}
            onReviewMapping={() => setIsMappingModalOpen(true)}
            isMatching={isMatching} 
          />
        </div>
      </div>
      <MappingModal
        isOpen={isMappingModalOpen}
        onClose={() => setIsMappingModalOpen(false)}
        mappings={editableMappings}
        headers={headers}
        firstRow={rows[0]}
        onColumnChange={handleColumnChange}
        onConfirm={handleConfirmMapping}
        onResetToDefault={handleResetToDefault}
        onResetAll={handleResetAllToDefault}
      />
      <div id="generate" className="scroll-mt-24">
        <GenerateSection
          isVisible={
            !!templateBuffer &&
            rows.length > 0 &&
            editableMappings.length > 0 &&
            isMappingConfirmed
          }
          isGenerating={isGenerating}
          progress={progress}
          rowCount={rows.length}
          isReadyToDownload={!!generatedZip}
          onDownload={download}
          onGenerate={() => generate({ templateBuffer, rows, mappings: editableMappings })}
          onReset={handleReset}
        />
      </div>
      {/* </div> */}
      <Footer />
    </AppLayout>
  );
};

export default Home;