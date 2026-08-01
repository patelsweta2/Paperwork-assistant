export interface UploadDoc {
  file: File;
  fileName: string;
  size: number;
  type: string;
}

export interface Placeholder {
  id: string;

  name: string;

  occurrences: number;

  type: string;
}

export interface PlaceholderPattern {
  type: string;
  id: string;
  start: string;
  end: string;
}

export type TokenType = "TEXT" | "PARAGRAPH_END" | "LINE_BREAK" | "TAB";

export interface Token {
  type: TokenType;

  value?: string;
}

export interface LexerToken {
  type: "TEXT" | "PLACEHOLDER";

  value: string;

  patternType?: string;
}

export const lexer = (text: string): LexerToken[] => {
  const tokens: LexerToken[] = [];

  return tokens;
};

export interface LexerToken {
  type: "TEXT" | "PLACEHOLDER";
  value: string;
}

export interface ExcelFile {
  file: File;

  fileName: string;

  size: number;

  type: string;
}

export interface ExcelRow {
  [key: string]: string | number | boolean | null;
}

export interface PlaceholderMapping {
  placeholder: string;
  column: string | null;
  matched: boolean;
}

export type Mapping = {
  placeholder: string;
  header: string;
};
