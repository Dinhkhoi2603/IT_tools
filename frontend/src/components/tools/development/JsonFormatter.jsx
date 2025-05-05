import React, { useState, useEffect } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'json-formatter',
  name: 'JSON Formatter',
  description: 'Format and beautify JSON data',
  category: 'development',
  path: '/tools/development/json-formatter',
  icon: CodeBracketIcon,
  order: 1,
};

const JsonFormatter = () => {
  // Sample JSON for demonstration
  const sampleJson = `{"hello":"world","foo":"bar","nested":{"array":[1,2,3],"object":{"a":true,"b":false}},"colors":["red","green","blue"]}`;
  
  const [inputJson, setInputJson] = useState(sampleJson);
  const [outputJson, setOutputJson] = useState('');
  const [indentSize, setIndentSize] = useState(2);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    formatJson(inputJson);
  }, [inputJson, indentSize]);

  const formatJson = (json) => {
    try {
      if (!json.trim()) {
        setOutputJson('');
        setError(null);
        return;
      }
      
      // Parse the JSON string to ensure it's valid
      const parsedJson = JSON.parse(json);
      
      // Format with the specified indentation
      const formatted = JSON.stringify(parsedJson, null, indentSize);
      setOutputJson(formatted);
      setError(null);
    } catch (err) {
      setError(`Invalid JSON: ${err.message}`);
      // Keep the last valid formatted output
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleCompact = () => {
    try {
      if (!inputJson.trim()) return;
      
      const parsedJson = JSON.parse(inputJson);
      const compacted = JSON.stringify(parsedJson);
      setInputJson(compacted);
    } catch (err) {
      // If there's an error, just leave the input as is
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <CodeBracketIcon className="h-6 w-6 mr-2" />
        JSON Formatter
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
          disabled={!outputJson || error}
        >
          {copied ? (
            <>
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
              Copy Formatted
            </>
          )}
        </button>
        <button
          onClick={handleCompact}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          disabled={!inputJson.trim()}
        >
          Compact JSON
        </button>
        <div className="flex items-center">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
            Indent Size:
          </label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(Number(e.target.value))}
            className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="h-[400px] flex flex-col">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Input JSON
          </div>
          <div className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <textarea
              value={inputJson}
              onChange={(e) => setInputJson(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none"
              spellCheck="false"
              placeholder="Paste your JSON here..."
            />
          </div>
        </div>

        {/* Output */}
        <div className="h-[400px] flex flex-col">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Formatted JSON
          </div>
          <div className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            {error ? (
              <div className="w-full h-full p-4 overflow-auto text-red-500 bg-red-50 dark:bg-red-900/10">
                {error}
              </div>
            ) : (
              <pre className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white overflow-auto">
                {outputJson}
              </pre>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Tip: This tool validates and formats JSON data with proper indentation.</p>
        <p>Use the controls above to adjust formatting options or compact the JSON.</p>
      </div>
    </div>
  );
};

export default JsonFormatter;