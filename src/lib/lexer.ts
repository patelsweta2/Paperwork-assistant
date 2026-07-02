import type { LexerToken } from "../type/document";
import { PLACEHOLDER_PATTERNS } from "../constants/placeholderPatterns";
import { findMatchingPattern } from "./findPattern";

export const lexer = (text: string): LexerToken[] => {
  const tokens: LexerToken[] = [];

  let buffer = "";

  let i = 0;

  while (i < text.length) {
    const pattern = findMatchingPattern(text, i, PLACEHOLDER_PATTERNS);
    // console.log("lexer :",{
    //   index: i,
    //   char: text[i],
    //   pattern,
    // });

    if (pattern) {
      if (buffer) {
        tokens.push({
          type: "TEXT",
          value: buffer,
        });

        buffer = "";
      }

      i += pattern.start.length;

      let placeholder = "";

      while (i < text.length && !text.startsWith(pattern.end, i)) {
        placeholder += text[i];

        i++;
      }

      tokens.push({
        type: "PLACEHOLDER",
        value: placeholder,
        patternType: pattern.type,
      });

      i += pattern.end.length;

      continue;
    }

    buffer += text[i];

    i++;
  }

  if (buffer) {
    tokens.push({
      type: "TEXT",

      value: buffer,
    });
  }

  return tokens;
};
