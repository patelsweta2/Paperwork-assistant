import { useState } from 'react';
import type { UploadDoc, Placeholder } from '../type/document';
import { readDocx } from '../lib/docsReader';
import { lexer } from '../lib/lexer';
import { getDocumentXml, openDocx } from '../lib/docxParser';
import { tokenizeXml } from '../lib/xmlTokenizer';
import { tokensToText } from '../lib/tokenToText';
import { parsePlaceholders } from '../lib/parsePlaceholders';
import PlaceholderTable from "./PlaceholderTable";
import PlaceholderModal from './PlaceholderModal';

interface Props {
    onTemplateLoaded: (
        buffer: ArrayBuffer,
        placeholders: Placeholder[]
    ) => void;
}

const DocxUploader = ({ onTemplateLoaded }: Props) => {
    const [document, setDocument] = useState<UploadDoc | null>(null);
    const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith(".docx")) {
            alert("Upload only DOCX file");
            return;
        }

        setDocument({
            file,
            fileName: file.name,
            size: file.size,
            type: file.type
        });

        const buffer = await readDocx(file);
        console.log("Buffer :", buffer)
        const zip = openDocx(buffer);
        const xml = getDocumentXml(zip)!;

        // console.log(xml.includes("{Job Title}"));
        // console.log(xml.includes("{Employee Name}"));
        // console.log(xml.includes("{{Company Name}}"));

        // const index = xml.indexOf("[Job Title]");
        // console.log(xml.slice(index - 100, index + 100));

        const xmlTokens = tokenizeXml(xml);
        const text = tokensToText(xmlTokens);
        const lexerTokens = lexer(text);
        console.log("lexerTokens: ", lexerTokens)
        const placeholders = parsePlaceholders(lexerTokens);
        // console.log("placeholders :", placeholders)

        setPlaceholders(placeholders);

        onTemplateLoaded(buffer, placeholders);
    };

    return (
        <div className="flex h-full flex-col rounded-lg border border-[#1A2B4C]/10 bg-white p-6 shadow-sm">
            {/* Card Header */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <p className="font-mono text-xs uppercase tracking-wide text-[#6B7280]">
                        Step 1
                    </p>
                    <h2 className="mt-1 font-serif text-xl text-[#1A2B4C]">
                        Upload Template
                    </h2>
                </div>
                {document && (
                    <span className="rounded-full bg-[#1A2B4C]/5 px-2 py-1 font-mono text-xs text-[#1A2B4C]">
                        .docx
                    </span>
                )}
            </div>

            {/* Upload Zone */}
            {!document ? (
                <label
                    htmlFor="doc-upload"
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-[#1A2B4C]/15 bg-[#FAF8F3] px-4 py-10 text-center transition hover:border-[#E8A33D]/50 hover:bg-[#E8A33D]/5"
                >
                    <span className="font-mono text-sm text-[#1A2B4C]/60">
                        Click to upload .docx
                    </span>
                    <span className="mt-1 text-xs text-[#6B7280]">
                        Word template with {"{placeholders}"}
                    </span>
                </label>
            ) : (
                <div className="flex flex-1 flex-col justify-between">
                    <div className="rounded-md bg-[#FAF8F3] p-4">
                        <p className="flex items-center gap-2 font-mono text-sm text-[#1A2B4C]">
                            <span className="text-[#2F6E4E]">✓</span>
                            {document.fileName}
                        </p>
                        <p className="mt-1 text-xs text-[#6B7280]">
                            {(document.size / 1024).toFixed(2)} KB
                        </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                        <label
                            htmlFor="doc-upload"
                            className="cursor-pointer font-mono text-xs text-[#6B7280] underline hover:text-[#1A2B4C]"
                        >
                            Replace file
                        </label>

                        {placeholders.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="rounded-md border border-[#1A2B4C]/20 px-3 py-1.5 font-mono text-xs text-[#1A2B4C] transition hover:bg-[#1A2B4C]/5"
                            >
                                View {placeholders.length} placeholder{placeholders.length > 1 ? "s" : ""}
                            </button>
                        )}
                    </div>
                </div>
            )}

            <input
                id="doc-upload"
                type="file"
                accept=".docx"
                onChange={handleUpload}
                className="hidden"
            />

            <PlaceholderModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                placeholders={placeholders}
            />
        </div>
    );
};

export default DocxUploader;