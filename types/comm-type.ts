export type MultiFormatResponseType = {
  error: boolean;
  rest: string;
  formats: CodeByFormatType[];
};

export type CodeByFormatType = {
  language: "json" | "typescript" | "java";
  content: string;
};
