import React, { useState, useEffect } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'html-editor',
  name: 'HTML Editor',
  description: 'Edit HTML with live preview',
  category: 'web',
  path: '/tools/web/html-editor',
  icon: CodeBracketIcon,
  order: 3,
};

const HtmlEditor = () => {
  // Sample HTML for initial display
  const initialHtml = `<!DOCTYPE html>
<html>
<head>
  <title>My HTML Page</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    h1 {
      color: #2c3e50;
      border-bottom: 2px solid #ecf0f1;
      padding-bottom: 10px;
    }
    .container {
      background-color: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      border: 1px solid #dee2e6;
    }
  </style>
</head>
<body>
  <h1>Welcome to HTML Editor</h1>
  <div class="container">
    <p>Start editing the HTML code on the left to see the changes on the right.</p>
    <ul>
      <li>Edit the HTML</li>
      <li>See the live preview</li>
      <li>Copy your code when done</li>
    </ul>
  </div>
</body>
</html>`;

  const [htmlCode, setHtmlCode] = useState(initialHtml);
  const [copied, setCopied] = useState(false);
  const [previewError, setPreviewError] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFormatCode = () => {
    try {
      // A very simple HTML formatter - better to use a real formatter library
      // This is just a placeholder implementation
      const formatted = htmlCode
        .replace(/></g, '>\n<')
        .replace(/\n{2,}/g, '\n\n');
      
      setHtmlCode(formatted);
    } catch (err) {
      console.error('Error formatting HTML:', err);
    }
  };

  const handleReset = () => {
    setHtmlCode(initialHtml);
  };

  // Sanitize HTML - note: in a production environment, you would want to use
  // a proper sanitization library like DOMPurify
  const getSanitizedHtml = () => {
    return { __html: htmlCode };
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <CodeBracketIcon className="h-6 w-6 mr-2" />
        HTML Editor
      </h2>

      <div className="mb-4 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
        >
          {copied ? (
            <>
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
              Copy Code
            </>
          )}
        </button>
        <button
          onClick={handleFormatCode}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Format Code
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Reset
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Code Editor */}
        <div className="h-[500px] flex flex-col">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            HTML Code
          </div>
          <div className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
            <textarea
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-full p-4 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none"
              spellCheck="false"
              wrap="off"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="h-[500px] flex flex-col">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Preview
          </div>
          <div className="flex-grow border border-gray-300 dark:border-gray-600 rounded-md overflow-auto bg-white">
            {previewError ? (
              <div className="p-4 text-red-500">{previewError}</div>
            ) : (
              <iframe
                title="HTML Preview"
                srcDoc={htmlCode}
                sandbox="allow-scripts"
                className="w-full h-full"
                style={{ border: 'none' }}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Note: This is a basic HTML editor. For security reasons, some features may be restricted in the preview.</p>
      </div>
    </div>
  );
};

export default HtmlEditor;