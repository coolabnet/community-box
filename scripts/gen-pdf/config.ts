interface PDFConfig {
  title: string;
  author: string;
  version: string;
  date: string;
  output: {
    filename: string;
    pageSize: string;
    margins: {
      top: string;
      bottom: string;
      left: string;
      right: string;
    };
  };
  structure: Section[];
}

interface Section {
  title: string;
  file?: string;
  sections?: Section[];
}

interface ProcessedContent {
  title: string;
  content: string;
  level: number;
  pageBreak?: boolean;
}
