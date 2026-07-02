import PizZip from "pizzip";

export const openDocx = (buffer: ArrayBuffer) => {
    const zip = new PizZip(buffer);
    return zip;
}

export const getDocumentXml = (zip: PizZip) => {
    const xmlFile = zip.file("word/document.xml");
    return xmlFile?.asText();
}

export const parseXml = (xml:string) => {
    const parser = new DOMParser();

    return parser.parseFromString(
        xml,
        "application/xml"
    )
}