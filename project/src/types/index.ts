export interface CodeLine {
  lineNumber: number;
  code: string;
  explanation: string;
  type: 'comment' | 'variable' | 'function' | 'loop' | 'condition' | 'class' | 'import' | 'return' | 'other';
}

export interface ExplanationResult {
  lines: CodeLine[];
  summary: string;
  language: string;
  detectedLanguage: string;
}

export type SupportedLanguage = 'python' | 'javascript' | 'java' | 'cpp' | 'c' | 'html' | 'css' | 'auto';

export interface LanguageConfig {
  name: string;
  keywords: string[];
  commentPatterns: RegExp[];
  functionPatterns: RegExp[];
  variablePatterns: RegExp[];
  loopPatterns: RegExp[];
  conditionPatterns: RegExp[];
  classPatterns: RegExp[];
}