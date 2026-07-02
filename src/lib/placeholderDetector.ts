import type { PlaceholderPattern,Placeholder } from "../type/document";


export const escapeRegex = (value:string) => {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const buildRegex = (pattern:PlaceholderPattern):RegExp => {
    const start = escapeRegex(pattern.start);
    const end = escapeRegex(pattern.end);
    return new RegExp(`${start}(.*?)${end}`, "g");
};

export const extractMatches = (text:string,pattern: PlaceholderPattern): string[] => {
    const regex = buildRegex(pattern);
    const matches = [...text.matchAll(regex)];
    return matches.map(match => match[1].trim());
};

export const mergeDuplicates = () => {};

export const countOccurrences = () => {};

export const detectPlaceholders = (
    text: string,
    patterns: PlaceholderPattern[]
): Placeholder[] => {

    const map = new Map<string, Placeholder>();

    for (const pattern of patterns) {

        const matches = extractMatches(text, pattern);

        for (const name of matches) {

            if (map.has(name)) {

                map.get(name)!.occurrences++;

            } else {

                map.set(name, {
                    name,
                    type: pattern.type,
                    occurrences: 1,
                });

            }

        }

    }

    return [...map.values()];
};



export const extractText = (xml: string): string => {
    const parser = new DOMParser();

    const xmlDoc = parser.parseFromString(
        xml,
        "application/xml"
    );

    const body = xmlDoc.getElementsByTagName("w:body")[0];

    if (!body) return "";

    let result = "";

    const traverse = (node: Node) => {

        // Text Node
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:t"
        ) {
            result += node.textContent ?? "";
        }

        // Paragraph End
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:p"
        ) {

            node.childNodes.forEach(traverse);

            result += "\n";

            return;
        }

        // Line Break
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:br"
        ) {
            result += "\n";
        }

        // Tab
        if (
            node.nodeType === Node.ELEMENT_NODE &&
            node.nodeName === "w:tab"
        ) {
            result += "\t";
        }

        node.childNodes.forEach(traverse);

    };

    body.childNodes.forEach(traverse);

    return result.trim();
};
