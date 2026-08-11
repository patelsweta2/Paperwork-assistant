import type { PlaceholderPattern } from "../type/document";

export const PLACEHOLDER_PATTERNS: PlaceholderPattern[] = [
  {
    id: "single-curly",
    type: "single-curly",
    start: "{",
    end: "}",
  },
  {
    id: "double-curly",
    type: "double-curly",
    start: "{{",
    end: "}}",
  },
  {
    id: "square",
    type: "square",
    start: "[",
    end: "]",
  },
  {
    id: "template-literal",
    type: "template-literal",
    start: "${",
    end: "}",
  },
  {
   id:"angle",
   type: "angle",
   start:"<<",
   end:">>"
}
];

export const MAX_ROWS = 100;