import { CodeLine, ExplanationResult, LanguageConfig } from '../types';
import { getLanguageConfig } from './languageDetector';

export function parseAndExplainCode(code: string, language: string): ExplanationResult {
  const config = getLanguageConfig(language);
  const lines = code.split('\n');
  const explanations: CodeLine[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const codeLine: CodeLine = {
      lineNumber: index + 1,
      code: line,
      explanation: '',
      type: 'other'
    };

    // Check for comments
    if (config.commentPatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'comment';
      codeLine.explanation = "This is a comment - it's a note for humans and doesn't affect how the program runs.";
    }
    // Check for function definitions
    else if (config.functionPatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'function';
      const functionName = extractFunctionName(trimmedLine, config);
      codeLine.explanation = `This defines a function called '${functionName}' - a reusable block of code that performs a specific task.`;
    }
    // Check for class definitions
    else if (config.classPatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'class';
      const className = extractClassName(trimmedLine, config);
      codeLine.explanation = `This defines a class called '${className}' - a blueprint for creating objects with similar properties and methods.`;
    }
    // Check for loops
    else if (config.loopPatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'loop';
      if (trimmedLine.includes('for')) {
        codeLine.explanation = "This starts a 'for' loop - it repeats a block of code a specific number of times or for each item in a collection.";
      } else if (trimmedLine.includes('while')) {
        codeLine.explanation = "This starts a 'while' loop - it repeats a block of code as long as a condition remains true.";
      }
    }
    // Check for conditions
    else if (config.conditionPatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'condition';
      if (trimmedLine.includes('if')) {
        codeLine.explanation = "This is an 'if' statement - it runs code only when a specific condition is true.";
      } else if (trimmedLine.includes('elif') || trimmedLine.includes('else if')) {
        codeLine.explanation = "This is an 'else if' statement - it checks another condition if the previous 'if' was false.";
      } else if (trimmedLine.includes('else')) {
        codeLine.explanation = "This is an 'else' statement - it runs when all previous conditions were false.";
      }
    }
    // Check for variable declarations
    else if (config.variablePatterns.some(pattern => pattern.test(trimmedLine))) {
      codeLine.type = 'variable';
      const variableName = extractVariableName(trimmedLine, config);
      codeLine.explanation = `This creates a variable called '${variableName}' and assigns it a value - variables store data that can be used later.`;
    }
    // Check for return statements
    else if (trimmedLine.includes('return')) {
      codeLine.type = 'return';
      codeLine.explanation = "This returns a value from the function - it's like the function's answer or result.";
    }
    // Check for imports
    else if (trimmedLine.includes('import') || trimmedLine.includes('#include')) {
      codeLine.type = 'import';
      codeLine.explanation = "This imports external code or libraries - it brings in pre-written functions and tools from elsewhere.";
    }
    // Handle print/output statements
    else if (trimmedLine.includes('print(') || trimmedLine.includes('console.log') || trimmedLine.includes('cout') || trimmedLine.includes('System.out.println')) {
      codeLine.type = 'other';
      codeLine.explanation = "This displays output - it shows text or values to the user.";
    }
    // Generic explanation for other lines
    else {
      codeLine.explanation = explainGenericLine(trimmedLine, language);
    }

    explanations.push(codeLine);
  });

  const summary = generateSummary(explanations, language);

  return {
    lines: explanations,
    summary,
    language,
    detectedLanguage: language
  };
}

function extractFunctionName(line: string, config: LanguageConfig): string {
  for (const pattern of config.functionPatterns) {
    const match = line.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return 'unknown';
}

function extractClassName(line: string, config: LanguageConfig): string {
  for (const pattern of config.classPatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[match.length - 1]; // Get the last capture group
    }
  }
  return 'unknown';
}

function extractVariableName(line: string, config: LanguageConfig): string {
  for (const pattern of config.variablePatterns) {
    const match = line.match(pattern);
    if (match) {
      return match[match.length - 1]; // Get the last capture group
    }
  }
  return 'unknown';
}

function explainGenericLine(line: string, language: string): string {
  if (line.includes('=') && !line.includes('==') && !line.includes('!=')) {
    return "This assigns a value to a variable or property.";
  }
  if (line.includes('++') || line.includes('--')) {
    return "This increases or decreases a number by 1.";
  }
  if (line.includes('{')) {
    return "This opens a block of code - the following lines belong together.";
  }
  if (line.includes('}')) {
    return "This closes a block of code.";
  }
  if (line.includes('(') && line.includes(')')) {
    return "This calls a function or method - it runs a specific piece of code.";
  }
  return "This line performs an operation or executes code.";
}

function generateSummary(explanations: CodeLine[], language: string): string {
  const types = explanations.map(e => e.type);
  const hasFunction = types.includes('function');
  const hasClass = types.includes('class');
  const hasLoop = types.includes('loop');
  const hasCondition = types.includes('condition');
  const hasVariable = types.includes('variable');

  let summary = `This ${language} code `;

  if (hasClass) {
    summary += "defines a class with properties and methods. ";
  } else if (hasFunction) {
    summary += "defines one or more functions that can be called to perform specific tasks. ";
  }

  if (hasVariable) {
    summary += "It creates variables to store data. ";
  }

  if (hasLoop) {
    summary += "It uses loops to repeat certain operations. ";
  }

  if (hasCondition) {
    summary += "It uses conditional statements to make decisions based on different scenarios. ";
  }

  if (explanations.some(e => e.explanation.includes('output') || e.explanation.includes('displays'))) {
    summary += "It produces output that the user can see. ";
  }

  summary += "Overall, this code is designed to accomplish a specific programming task through a series of logical steps.";

  return summary;
}