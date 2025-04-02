import React, { useState, useEffect } from 'react';
import { FingerPrintIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import CryptoJS from 'crypto-js';


// Tool metadata for discovery system
export const toolMeta = {
  id: 'hash-text',
  name: 'Hash Text',
  description: 'Generate various hash values from text input',
  category: 'crypto',
  path: '/tools/crypto/hash-text',
  icon: FingerPrintIcon,
  order: 2,
};

const HashText = () => {
  const [inputText, setInputText] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const [copied, setCopied] = useState({
    md5: false,
    sha1: false,
    sha256: false,
    sha512: false
  });

  useEffect(() => {
    // Reset copy states after 1.5 seconds
    const timeouts = Object.keys(copied).map(key => {
      if (copied[key]) {
        return setTimeout(() => {
          setCopied(prev => ({ ...prev, [key]: false }));
        }, 1500);
      }
      return null;
    }).filter(Boolean);
    
    return () => timeouts.forEach(timeout => clearTimeout(timeout));
  }, [copied]);

  // Generate hashes when input text changes
  useEffect(() => {
    const generateHashes = async () => {
      if (!inputText) {
        setHashes({
          md5: '',
          sha1: '',
          sha256: '',
          sha512: ''
        });
        return;
      }

      try {
        // Calculate MD5 using crypto-js
        const md5Hash = CryptoJS.MD5(inputText).toString();

        // Convert string to ArrayBuffer
        const encoder = new TextEncoder();
        const data = encoder.encode(inputText);
        
        // Generate SHA-1 hash
        const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
        const sha1Hash = Array.from(new Uint8Array(sha1Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Generate SHA-256 hash
        const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
        const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // Generate SHA-512 hash
        const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
        const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        // For MD5, we'd normally use a library
        // Using a placeholder since we can't do MD5 with Web Crypto API
        //const md5Hash = "MD5 requires external library (placeholder)";
        
        setHashes({
          md5: md5Hash,
          sha1: sha1Hash,
          sha256: sha256Hash,
          sha512: sha512Hash
        });
      } catch (err) {
        console.error('Error generating hashes:', err);
      }
    };

    generateHashes();
  }, [inputText]);

  const handleCopy = async (hashType) => {
    try {
      await navigator.clipboard.writeText(hashes[hashType]);
      setCopied({ ...copied, [hashType]: true });
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <FingerPrintIcon className="h-6 w-6 mr-2" />
        Hash Text
      </h2>
      
      <div className="mb-4">
        <label htmlFor="inputText" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Input Text
        </label>
        <textarea
          id="inputText"
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-green focus:border-brand-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows="4"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to hash..."
        />
      </div>
      
      <div className="space-y-4">
        {Object.entries(hashes).map(([hashType, hashValue]) => (
          <div key={hashType} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">
                {hashType}
              </span>
              {hashValue && (
                <button 
                  onClick={() => handleCopy(hashType)}
                  className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                >
                  {copied[hashType] ? (
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              )}
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <code className="text-gray-800 dark:text-gray-200 break-all">{hashValue || '-'}</code>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HashText;