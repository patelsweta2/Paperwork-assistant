import type { Token } from "../type/document";


export const tokensToText = (
    tokens: Token[]
): string => {

    let text = "";

    for (const token of tokens) {

        switch (token.type) {

            case "TEXT":
                text += token.value ?? "";
                break;

            case "TAB":
                text += "\t";
                break;

            case "LINE_BREAK":
                text += "\n";
                break;

            case "PARAGRAPH_END":
                text += "\n";
                break;
        }

    }

    return text;

}