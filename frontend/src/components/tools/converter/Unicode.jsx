import React, { useState, useEffect } from 'react';
import { LanguageIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'unicode-converter',
  name: 'Unicode Converter',
  description: 'Convert between text and HTML entity codes',
  category: 'converter',
  path: '/tools/converter/unicode-converter',
  icon: LanguageIcon,
  order: 2,
};

const UnicodeConverter = () => {
  const [normalText, setNormalText] = useState('');
  const [unicodeText, setUnicodeText] = useState('');
  const [copied, setCopied] = useState({ text: false, unicode: false });

  // Convert normal text to Unicode when text changes
  useEffect(() => {
    if (document.activeElement?.id !== 'unicode-input') {
      const unicode = textToUnicode(normalText);
      setUnicodeText(unicode);
    }
  }, [normalText]);

  // Convert Unicode to normal text when Unicode changes
  useEffect(() => {
    if (document.activeElement?.id !== 'text-input') {
      const text = unicodeToText(unicodeText);
      setNormalText(text);
    }
  }, [unicodeText]);

  // Convert text to HTML entity format
  const textToUnicode = (text) => {
    if (!text) return '';
    return Array.from(text)
      .map(char => {
        const codePoint = char.codePointAt(0);
        return `&#${codePoint};`;
      })
      .join('');
  };

  // Convert HTML entities back to text
  const unicodeToText = (unicode) => {
    if (!unicode) return '';
    
    // Create a temporary div to use browser's built-in HTML entity parsing
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = unicode;
    return tempDiv.textContent;
  };

  // Handle copy function
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <LanguageIcon className="h-6 w-6 mr-2" />
        HTML Entity Converter
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Text to Unicode */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Text
            </label>
            <button
              onClick={() => handleCopy(normalText, 'text')}
              className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              disabled={!normalText}
            >
              {copied.text ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <textarea
            id="text-input"
            value={normalText}
            onChange={(e) => setNormalText(e.target.value)}
            className="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter text here..."
          />
        </div>

        {/* Unicode to Text */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              HTML Entities
            </label>
            <button
              onClick={() => handleCopy(unicodeText, 'unicode')}
              className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              disabled={!unicodeText}
            >
              {copied.unicode ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <textarea
            id="unicode-input"
            value={unicodeText}
            onChange={(e) => setUnicodeText(e.target.value)}
            className="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Enter HTML entities (e.g. &#72;&#101;&#108;&#108;&#111;)"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        <p>Enter text in either box to see the conversion in the other box.</p>
        <p className="mt-1">HTML entity format: &#38;#value; (e.g., &#38;#97; for 'a')</p>
      </div>
    </div>
  );
};

export default UnicodeConverter;