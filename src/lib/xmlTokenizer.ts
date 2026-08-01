import type { Token } from "../type/document";

export const tokenizeXml = (xml: string): Token[] => {
    // browser in-built parser has been create
    const parser = new DOMParser();
    
    // it converts xml string into DOM tree
    const xmlDoc = parser.parseFromString(
        xml,
        "application/xml"
    );

    const body = xmlDoc.getElementsByTagName("w:body")[0];

    if (!body) return [];

    const tokens: Token[] = [];

    const traverse = (node: Node) => {

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:t"
        ) {
            tokens.push({
                type: "TEXT",
                value: node.textContent ?? "",
            });
        }

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:p"
        ) {

            node.childNodes.forEach(traverse);

            tokens.push({
                type: "PARAGRAPH_END",
            });

            return;
        }

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:br"
        ) {
            tokens.push({
                type: "LINE_BREAK",
            });
        }

        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:tab"
        ) {
            tokens.push({
                type: "TAB",
            });
        }

        node.childNodes.forEach(traverse);
    };

    body.childNodes.forEach(traverse);

    return tokens;
};