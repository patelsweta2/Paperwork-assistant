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

export const serializeXml = (
    xmlDoc: XMLDocument
): string => {

    const serializer = new XMLSerializer();

    return serializer.serializeToString(xmlDoc);
};


export const normalizePlaceholders = (zip: PizZip): PizZip => {
  const file = zip.file("word/document.xml");
  if (!file) return zip;

  const xml = file.asText();

  const normalized = xml
    .replace(/\{\{([^{}]+)\}\}/g, "{$1}")   
    .replace(/\$\{([^{}]+)\}/g, "{$1}")     
    .replace(/<<([^<>]+)>>/g, "{$1}")       
    .replace(/\[([^\[\]]+)\]/g, "{$1}");    

  zip.file("word/document.xml", normalized);
  return zip;
};

