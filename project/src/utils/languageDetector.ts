import { SupportedLanguage, LanguageConfig } from '../types';

const languageConfigs: Record<string, LanguageConfig> = {
  python: {
    name: 'Python',
    keywords: ['def', 'class', 'import', 'from', 'if', 'elif', 'else', 'for', 'while', 'try', 'except', 'return', 'print', 'len', 'range'],
    commentPatterns: [/^\s*#/],
    functionPatterns: [/^\s*def\s+(\w+)/],
    variablePatterns: [/^\s*(\w+)\s*=/],
    loopPatterns: [/^\s*(for|while)\s+/],
    conditionPatterns: [/^\s*(if|elif|else)/],
    classPatterns: [/^\s*class\s+(\w+)/]
  },
  javascript: {
    name: 'JavaScript',
    keywords: ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'class', 'console.log', 'document', 'window'],
    commentPatterns: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
    functionPatterns: [/^\s*function\s+(\w+)/, /^\s*(\w+)\s*=\s*function/, /^\s*const\s+(\w+)\s*=\s*\(/],
    variablePatterns: [/^\s*(var|let|const)\s+(\w+)/],
    loopPatterns: [/^\s*(for|while)\s*\(/],
    conditionPatterns: [/^\s*(if|else\s+if|else)/],
    classPatterns: [/^\s*class\s+(\w+)/]
  },
  java: {
    name: 'Java',
    keywords: ['public', 'private', 'protected', 'class', 'interface', 'void', 'int', 'String', 'if', 'else', 'for', 'while', 'return', 'System.out.println'],
    commentPatterns: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
    functionPatterns: [/^\s*(public|private|protected)?\s*(static\s+)?\w+\s+(\w+)\s*\(/],
    variablePatterns: [/^\s*(public|private|protected)?\s*(static\s+)?(int|String|double|float|boolean|char)\s+(\w+)/],
    loopPatterns: [/^\s*(for|while)\s*\(/],
    conditionPatterns: [/^\s*(if|else\s+if|else)/],
    classPatterns: [/^\s*(public\s+)?class\s+(\w+)/]
  },
  cpp: {
    name: 'C++',
    keywords: ['#include', 'using', 'namespace', 'int', 'main', 'cout', 'cin', 'if', 'else', 'for', 'while', 'return', 'class', 'public', 'private'],
    commentPatterns: [/^\s*\/\//, /^\s*\/\*/, /^\s*\*/],
    functionPatterns: [/^\s*\w+\s+(\w+)\s*\(/],
    variablePatterns: [/^\s*(int|float|double|char|string|bool)\s+(\w+)/],
    loopPatterns: [/^\s*(for|while)\s*\(/],
    conditionPatterns: [/^\s*(if|else\s+if|else)/],
    classPatterns: [/^\s*class\s+(\w+)/]
  }
};

export function detectLanguage(code: string): string {
  const lines = code.split('\n').filter(line => line.trim());
  const scores: Record<string, number> = {};

  Object.keys(languageConfigs).forEach(lang => {
    scores[lang] = 0;
  });

  lines.forEach(line => {
    Object.entries(languageConfigs).forEach(([lang, config]) => {
      config.keywords.forEach(keyword => {
        if (line.includes(keyword)) {
          scores[lang] += 1;
        }
      });
    });
  });

  const detectedLang = Object.entries(scores).reduce((a, b) => 
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  return scores[detectedLang] > 0 ? detectedLang : 'javascript';
}

export function getLanguageConfig(language: string): LanguageConfig {
  return languageConfigs[language] || languageConfigs.javascript;
}