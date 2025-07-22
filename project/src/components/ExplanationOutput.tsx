import React from 'react';
import { BookOpen, FileText, Lightbulb } from 'lucide-react';
import { ExplanationResult } from '../types';

interface ExplanationOutputProps {
  result: ExplanationResult | null;
}

const typeColors = {
  comment: 'bg-gray-100 border-gray-300',
  variable: 'bg-blue-50 border-blue-300',
  function: 'bg-green-50 border-green-300',
  loop: 'bg-purple-50 border-purple-300',
  condition: 'bg-yellow-50 border-yellow-300',
  class: 'bg-indigo-50 border-indigo-300',
  import: 'bg-teal-50 border-teal-300',
  return: 'bg-orange-50 border-orange-300',
  other: 'bg-gray-50 border-gray-200'
};

const typeIcons = {
  comment: '💬',
  variable: '📦',
  function: '⚙️',
  loop: '🔄',
  condition: '🤔',
  class: '🏗️',
  import: '📥',
  return: '↩️',
  other: '📝'
};

const ExplanationOutput: React.FC<ExplanationOutputProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="space-y-6">
      {/* Language Detection Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <FileText className="text-blue-600" size={20} />
          <h3 className="font-medium text-blue-800">Language Detected</h3>
        </div>
        <p className="text-blue-700 capitalize">
          {result.detectedLanguage} • {result.lines.length} lines analyzed
        </p>
      </div>

      {/* Line-by-line explanations */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center space-x-2 mb-4">
          <BookOpen className="text-green-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Line-by-Line Explanation</h3>
        </div>
        
        <div className="space-y-4">
          {result.lines.map((line, index) => (
            <div key={index} className={`border-l-4 p-4 rounded-r-lg ${typeColors[line.type]}`}>
              <div className="flex items-start space-x-3">
                <span className="text-2xl" title={line.type}>
                  {typeIcons[line.type]}
                </span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                      Line {line.lineNumber}
                    </span>
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {line.type}
                    </span>
                  </div>
                  <div className="mb-2">
                    <pre className="bg-gray-800 text-green-400 p-3 rounded text-sm font-mono overflow-x-auto">
                      <code>{line.code}</code>
                    </pre>
                  </div>
                  <div className="text-gray-700 leading-relaxed">
                    {line.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
        <div className="flex items-center space-x-2 mb-3">
          <Lightbulb className="text-green-600" size={24} />
          <h3 className="text-xl font-semibold text-gray-800">Code Summary</h3>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {result.summary}
        </p>
      </div>
    </div>
  );
};

export default ExplanationOutput;