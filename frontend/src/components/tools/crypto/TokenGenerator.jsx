import React, { useState, useEffect } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Metadata for the tool
export const toolMeta = {
  id: 'token-gen', // ID duy nhất cho tool
  name: 'Token Generator', // Tên hiển thị trên sidebar và card
  description: 'Generate random strings, tokens, or passwords.', // Mô tả ngắn
  category: 'crypto', // ID của category (phải khớp tên thư mục cha)
  path: '/tools/crypto/token-generator', // Đường dẫn URL cho tool này
  icon: KeyIcon, // Component Icon (hoặc KeySvg nếu dùng SVG)
  // order: 1, // (Tùy chọn) Thứ tự hiển thị trong category
};

const TokenGenerator = () => {
  // Sample token to show immediately
  const sampleToken = "8f7d2a1e5c9b3f6";

  // Token options
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(1);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecial, setIncludeSpecial] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  
  // Generated tokens
  const [tokens, setTokens] = useState([sampleToken]);
  const [copied, setCopied] = useState(null);
  
  // Character sets
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const special = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
  const similar = 'il1Lo0O';
  
  // Generate tokens on initial load or when options change
  useEffect(() => {
    generateTokens();
  }, []);
  
  const generateTokens = () => {
    let charset = '';
    
    // Build character set based on selected options
    if (includeLowercase) charset += lowercase;
    if (includeUppercase) charset += uppercase;
    if (includeNumbers) charset += numbers;
    if (includeSpecial) charset += special;
    
    // Remove similar characters if option selected
    if (excludeSimilar) {
      for (let i = 0; i < similar.length; i++) {
        charset = charset.replace(similar[i], '');
      }
    }
    
    // Handle case where no character set is selected
    if (!charset) {
      setTokens(['Please select at least one character set']);
      return;
    }
    
    const newTokens = [];
    
    // Generate the requested number of tokens
    for (let i = 0; i < count; i++) {
      let token = '';
      for (let j = 0; j < length; j++) {
        token += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      newTokens.push(token);
    }
    
    setTokens(newTokens);
    setCopied(null);
  };
  
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopied(index);
    setTimeout(() => setCopied(null), 1500);
  };
  
  const handleCopyAll = () => {
    navigator.clipboard.writeText(tokens.join('\n'));
    setCopied('all');
    setTimeout(() => setCopied(null), 1500);
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <KeyIcon className="h-6 w-6 mr-2" />
        Token Generator
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Options Panel */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Token Length: {length}
            </label>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>4</span>
              <span>16</span>
              <span>32</span>
              <span>48</span>
              <span>64</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number of Tokens: {count}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>1</span>
              <span>5</span>
              <span>10</span>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Character Sets
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="lowercase"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                  className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor="lowercase" className="text-sm text-gray-700 dark:text-gray-300">
                  Lowercase (a-z)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="uppercase"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                  className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor="uppercase" className="text-sm text-gray-700 dark:text-gray-300">
                  Uppercase (A-Z)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="numbers"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                  className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor="numbers" className="text-sm text-gray-700 dark:text-gray-300">
                  Numbers (0-9)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="special"
                  checked={includeSpecial}
                  onChange={() => setIncludeSpecial(!includeSpecial)}
                  className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor="special" className="text-sm text-gray-700 dark:text-gray-300">
                  Special Characters (!@#$%^&*...)
                </label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="exclude-similar"
                  checked={excludeSimilar}
                  onChange={() => setExcludeSimilar(!excludeSimilar)}
                  className="mr-2 h-4 w-4 text-brand-green focus:ring-brand-green border-gray-300 rounded dark:border-gray-600"
                />
                <label htmlFor="exclude-similar" className="text-sm text-gray-700 dark:text-gray-300">
                  Exclude Similar Characters (i, l, 1, L, o, 0, O)
                </label>
              </div>
            </div>
          </div>
          
          <button
            onClick={generateTokens}
            className="w-full py-2 px-4 bg-gray-400 text-white rounded hover:bg-green-600 dark:hover:bg-green-500transition-colors"
          >
            Generate Tokens
          </button>
        </div>
        
        {/* Results Panel */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-medium text-gray-800 dark:text-white">
              Generated Tokens
            </h3>
            {tokens.length > 1 && (
              <button
                onClick={handleCopyAll}
                className="text-sm text-gray-600 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400 flex items-center"
              >
                {copied === 'all' ? (
                  <>
                    <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                    Copied All
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    Copy All
                  </>
                )}
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {tokens.map((token, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <div className="font-mono text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
                  {token}
                </div>
                <button
                  onClick={() => handleCopy(token, index)}
                  className="ml-2 text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                >
                  {copied === index ? (
                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                  ) : (
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <p>Tokens are generated using a cryptographically secure random number generator.</p>
            <p className="mt-1">For secure passwords, use a length of at least 12 characters and mix character types.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenGenerator;