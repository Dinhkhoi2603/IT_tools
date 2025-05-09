//// filepath: d:\IT_tools\frontend\src\components\tools\converter\interger.jsx
import React, { useState } from 'react';
import { ArrowsRightLeftIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'integer-not-base-converter',
  name: 'Integer Not Base Converter',
  description: 'Convert decimal integers to binary, octal, decimal, hexadecimal, and base64',
  category: 'converter',
  path: '/tools/converter/integer-not-base-converter',
  icon: ArrowsRightLeftIcon,
  order: 1,
};

const IntegerBaseConverter = () => {
  const [inputValue, setInputValue] = useState('');
  const [copiedType, setCopiedType] = useState(null);

  // Returns the decimal number if valid; otherwise null
  const parseNumber = () => {
    const dec = parseInt(inputValue, 10);
    return isNaN(dec) ? null : dec;
  };

  // Converts a decimal number to the various bases
  const conversions = (num) => {
    const binary = num.toString(2);
    const octal = num.toString(8);
    const decimal = num.toString(10);
    const hex = num.toString(16).toUpperCase();

    // Base64 (only valid for 0–255)
    let base64 = '';
    if (num >= 0 && num < 256) {
      base64 = window.btoa(String.fromCharCode(num));
    } else {
      base64 = '(Only valid for 0–255)';
    }

    return { binary, octal, decimal, hex, base64 };
  };

  // Copies the given text to clipboard
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 1500);
  };

  // Determine actual or placeholder results
  const decVal = parseNumber();
  const result = decVal !== null
    ? conversions(decVal)
    : {
        binary: '-',
        octal: '-',
        decimal: '-',
        hex: '-',
        base64: '-',
      };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <ArrowsRightLeftIcon className="h-6 w-6 mr-2" />
        Integer Base Converter
      </h2>

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Enter a decimal integer
      </label>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="e.g. 123"
      />

      {/* Always display the results section, even if invalid input */}
      <div className="space-y-4">
        {Object.entries(result).map(([baseType, value]) => (
          <div key={baseType} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                {baseType}
              </span>
              {value !== '-' && (
                <button
                  onClick={() => handleCopy(value, baseType)}
                  className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                >
                  {copiedType === baseType ? (
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200 break-all">
                {value}
              </code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IntegerBaseConverter;