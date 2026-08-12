import { useState } from "react";
import { getCurrentStep } from "../utils/getCurrentSteps";
import DocxUploader from "../components/DocxUploader";
import ExcelUploader from "../components/ExcelUploader";
import GenerateSection from "../components/Generate/GenerateSections";
import AppLayout from "../../layout/AppLayout";
import type { ExcelRow, Placeholder } from "../type/document";
import { autoMap } from "../lib/mappingEngine";
import { useDocxGenerator } from "../hooks/useDocXGenerator";
import Hero from "../components/hero/Hero";
import Stepper from "../components/steeper/Steeper";
import Footer from "../components/footer/Footer";
import toast from "react-hot-toast";

const Home = () => {
  const [templateBuffer, setTemplateBuffer] = useState<ArrayBuffer | null>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<ExcelRow[]>([]);

  const { generate, download, isGenerating, reset: resetGenerator, progress, generatedZip } = useDocxGenerator();

  const mappings =
    placeholders.length > 0 && headers.length > 0
      ? autoMap(placeholders, headers)
      : [];

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


  return (
    <AppLayout currentStep={currentStep} onReset={handleReset}>
      <Hero onCtaClick={scrollToUpload} />
      <Stepper currentStep={currentStep} />
      {/* <div id="upload-template"> */}

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
            onExcelLoaded={(excelRows, excelHeaders) => {
              setRows(excelRows);
              setHeaders(excelHeaders);
            }}
          />
        </div>
      </div>
      <div id="generate" className="scroll-mt-24">
        <GenerateSection
          isVisible={!!templateBuffer && rows.length > 0 && mappings.length > 0}
          isGenerating={isGenerating}
          progress={progress}
          rowCount={rows.length}
          isReadyToDownload={!!generatedZip}
          onDownload={download}
          onGenerate={() => generate({ templateBuffer, rows, mappings })}
          onReset={handleReset}
        />
      </div>
      {/* </div> */}
      <Footer />
    </AppLayout>
  );
};

export default Home;