import { useState } from 'react';
import { type UploadDoc } from '../type/document';
import { readDocx } from '../lib/docsReader';
import { lexer } from '../lib/lexer';
import { getDocumentXml, openDocx } from '../lib/docxParser';
import { tokenizeXml } from '../lib/xmlTokenizer';
import { tokensToText } from '../lib/tokenToText';
import { parsePlaceholders } from '../lib/parsePlaceholders';

const DocxUploader = () => {
    const [document, setDocument] = useState<UploadDoc | null>(null);

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
        })
        const buffer = await readDocx(file);
        const zip = openDocx(buffer);
        const xml = getDocumentXml(zip)!;
        // const doc = createTemplate(zip);
        // const text = extractText(xml);
        const xmlTokens = tokenizeXml(xml);

        const text = tokensToText(xmlTokens);

        const lexerTokens = lexer(text);

        const placeholders = parsePlaceholders(lexerTokens);

        console.log(placeholders);
    }
    return (
        <div className="max-w-xl mx-auto mt-10 rounded-lg border border-gray-300 bg-white p-6 shadow-md">

            <h2 className="mb-4 text-2xl font-semibold">
                Upload DOCX Template
            </h2>

            <label
                htmlFor="doc-upload"
                className="inline-block cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Upload Template
            </label>

            <input
                id="doc-upload"
                type="file"
                accept=".docx"
                onChange={handleUpload}
                className="hidden"
            />

            {!document && (
                <p className="mt-4 text-gray-500">
                    No template uploaded
                </p>
            )}

            {document && (
                <div className="mt-6 rounded-md bg-gray-100 p-4">

                    <p className="font-semibold text-green-600">
                        ✅ Template Uploaded Successfully
                    </p>

                    <div className="mt-3 space-y-2 text-sm">

                        <p>
                            <span className="font-semibold">
                                File Name:
                            </span>{" "}
                            {document.fileName}
                        </p>

                        <p>
                            <span className="font-semibold">
                                Size:
                            </span>{" "}
                            {(document.size / 1024).toFixed(2)} KB
                        </p>

                        <p className="break-all">
                            <span className="font-semibold">
                                Type:
                            </span>{" "}
                            {document.type}
                        </p>

                    </div>

                </div>
            )}

        </div>
    )
}

export default DocxUploader