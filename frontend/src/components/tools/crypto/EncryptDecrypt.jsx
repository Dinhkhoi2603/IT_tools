//// filepath: d:\IT_tools\frontend\src\components\tools\crypto\EncryptionTool.jsx
import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { LockClosedIcon,EyeSlashIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Tool metadata for discovery system
export const toolMeta = {
  id: 'encryption-tool',
  name: 'Encryption Tool',
  description: 'Encrypt / Decrypt text with AES, TripleDES, Rabbit, or RC4',
  category: 'crypto',
  path: '/tools/crypto/encryption-tool',
  icon: LockClosedIcon,
  order: 4,
};

const algorithms = [
  { label: 'AES', value: 'AES' },
  { label: 'TripleDES', value: 'TripleDES' },
  { label: 'Rabbit', value: 'Rabbit' },
  { label: 'RC4', value: 'RC4' },
];

const EncryptionTool = () => {
  const [algorithm, setAlgorithm] = useState('AES');
  const [mode, setMode] = useState('encrypt');
  const [inputText, setInputText] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleEncryptDecrypt = () => {
    if (!inputText || !secretKey) {
      setOutputText('Please provide both text and secret key.');
      return;
    }

    try {
      if (mode === 'encrypt') {
        let result;
        switch (algorithm) {
          case 'AES':
            result = CryptoJS.AES.encrypt(inputText, secretKey).toString();
            break;
          case 'TripleDES':
            result = CryptoJS.TripleDES.encrypt(inputText, secretKey).toString();
            break;
          case 'Rabbit':
            result = CryptoJS.Rabbit.encrypt(inputText, secretKey).toString();
            break;
          case 'RC4':
            result = CryptoJS.RC4.encrypt(inputText, secretKey).toString();
            break;
          default:
            result = '';
        }
        setOutputText(result);
      } else {
        let bytes;
        switch (algorithm) {
          case 'AES':
            bytes = CryptoJS.AES.decrypt(inputText, secretKey);
            break;
          case 'TripleDES':
            bytes = CryptoJS.TripleDES.decrypt(inputText, secretKey);
            break;
          case 'Rabbit':
            bytes = CryptoJS.Rabbit.decrypt(inputText, secretKey);
            break;
          case 'RC4':
            bytes = CryptoJS.RC4.decrypt(inputText, secretKey);
            break;
          default:
            bytes = '';
        }
        setOutputText(bytes.toString(CryptoJS.enc.Utf8));
      }
    } catch (err) {
      console.error('Error:', err);
      setOutputText('Failed to process. Check console for details.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <LockClosedIcon className="h-6 w-6 mr-2" />
        Encryption / Decryption Tool
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Algorithm
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {algorithms.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Mode
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              value="encrypt"
              checked={mode === 'encrypt'}
              onChange={() => setMode('encrypt')}
              className="mr-2"
            />
            Encrypt
          </label>
          <label className="flex items-center text-gray-700 dark:text-gray-300">
            <input
              type="radio"
              value="decrypt"
              checked={mode === 'decrypt'}
              onChange={() => setMode('decrypt')}
              className="mr-2"
            />
            Decrypt
          </label>
        </div>
      </div>

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Text
      </label>
      <textarea
        rows="3"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Enter text to encrypt/decrypt…"
      />

      <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Secret Key
      </label>
      <input
        type="text"
        value={secretKey}
        onChange={(e) => setSecretKey(e.target.value)}
        className="w-full mb-4 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        placeholder="Enter secret key…"
      />

      <button
        onClick={handleEncryptDecrypt}
        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-green-600 dark:hover:bg-green-500 mb-4"
      >
        {mode === 'encrypt' ? 'Encrypt' : 'Decrypt'}
      </button>

      {outputText && (
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
              Result
            </span>
            <button
              onClick={handleCopy}
              className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
            >
              {copied ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
            <code className="text-gray-800 dark:text-gray-200 break-all">{outputText}</code>
          </div>
        </div>
      )}
    </div>
  );
};

export default EncryptionTool;