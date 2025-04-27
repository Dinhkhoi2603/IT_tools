import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Tool metadata for discovery system
export const toolMeta = {
  id: 'bcrypt-tool',
  name: 'Bcrypt Tool',
  description: 'Generate bcrypt hashes',
  category: 'crypto',
  path: '/tools/crypto/bcrypt-tool',
  icon: FingerPrintIcon,
  order: 3,
};

const BcryptTool = () => {
  const [inputText, setInputText] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    try {
      const salt = bcrypt.genSaltSync(parseInt(saltRounds, 10));
      const generatedHash = bcrypt.hashSync(inputText, salt);
      setHash(generatedHash);
    } catch (err) {
      console.error('Error generating hash:', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FingerPrintIcon className="h-6 w-6 mr-2" />
        Bcrypt Tool
      </h2>

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Text to hash
      </label>
      <input
        type="text"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Enter text…"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Salt Rounds
      </label>
      <input
        type="number"
        value={saltRounds}
        onChange={(e) => setSaltRounds(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        min="1"
      />

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-green-600 dark:hover:bg-green-500 mb-4"
      >
        Generate Hash
      </button>

      {hash && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
              bcrypt hash
            </span>
            <button onClick={handleCopy} className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400">
              {copied ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
            <code className="text-gray-800 dark:text-gray-200 break-all">{hash}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default BcryptTool;