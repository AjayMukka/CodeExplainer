import React, { useState } from 'react';
import { Code, Play } from 'lucide-react';
import { SupportedLanguage } from '../types';

interface CodeInputProps {
  onExplain: (code: string, language: SupportedLanguage) => void;
  isLoading: boolean;
}

const supportedLanguages: { value: SupportedLanguage; label: string }[] = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' }
];

const CodeInput: React.FC<CodeInputProps> = ({ onExplain, isLoading }) => {
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('auto');

  const handleSubmit = () => {
    if (code.trim()) {
      onExplain(code, selectedLanguage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const exampleCode = `def greet(name):
    print("Hello, " + name)

greet("Ajay")`;

  const loadExample = () => {
    setCode(exampleCode);
    setSelectedLanguage('python');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Code className="text-blue-600" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Paste Your Code</h2>
        </div>
        <button
          onClick={loadExample}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          Load Example
        </button>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Programming Language
        </label>
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {supportedLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste your code here..."
          className="w-full h-64 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
          style={{
            backgroundColor: '#f8f9fa',
            lineHeight: '1.5'
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Tip: Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl + Enter</kbd> to explain
        </p>
        <button
          onClick={handleSubmit}
          disabled={!code.trim() || isLoading}
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
        >
          <Play size={16} />
          <span>{isLoading ? 'Explaining...' : 'Explain Code'}</span>
        </button>
      </div>
    </div>
  );
};

export default CodeInput;