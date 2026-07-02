import PizZip from "pizzip";

export const openDocx = (buffer: ArrayBuffer) => {
    const zip = new PizZip(buffer);
    return zip;
}

export const getDocumentXml = (zip: PizZip) => {
    const xmlFile = zip.file("word/document.xml");
    return xmlFile?.asText();
}