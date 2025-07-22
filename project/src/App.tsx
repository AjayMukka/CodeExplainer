import React, { useState } from 'react';
import { Brain, Github, Star, BookOpen } from 'lucide-react';
import CodeInput from './components/CodeInput';
import ExplanationOutput from './components/ExplanationOutput';
import { ExplanationResult, SupportedLanguage } from './types';
import { parseAndExplainCode } from './utils/codeParser';
import { detectLanguage } from './utils/languageDetector';

function App() {
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleExplainCode = async (code: string, language: SupportedLanguage) => {
    setIsLoading(true);
    
    // Simulate processing time for better UX
    setTimeout(() => {
      const detectedLang = language === 'auto' ? detectLanguage(code) : language;
      const explanation = parseAndExplainCode(code, detectedLang);
      setResult(explanation);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Brain className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-gray-800">CodeExplainer</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Paste any code and get a simple, line-by-line explanation in plain English. 
            Perfect for learning and understanding how code works.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Star className="text-yellow-500" size={16} />
              <span>Multi-language support</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <CodeInput onExplain={handleExplainCode} isLoading={isLoading} />
          
          {isLoading && (
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Analyzing your code...</p>
            </div>
          )}
          
          <ExplanationOutput result={result} />
        </div>

        {/* Features */}
        {!result && !isLoading && (
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="text-blue-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Smart Analysis</h3>
                <p className="text-gray-600">Automatically detects language and explains each line intelligently</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Beginner Friendly</h3>
                <p className="text-gray-600">Explanations in simple English that anyone can understand</p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-purple-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">Multi-Language</h3>
                <p className="text-gray-600">Supports Python, JavaScript, Java, C++, and more</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Made for Students who struggle to code. Happy Learning.
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;