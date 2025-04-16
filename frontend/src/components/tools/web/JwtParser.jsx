import React, { useState, useEffect } from 'react';
import { KeyIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'jwt-parser',
  name: 'JWT Parser',
  description: 'Parse and decode JWT tokens',
  category: 'web',
  path: '/tools/web/jwt-parser',
  icon: KeyIcon,
  order: 2,
};

const JwtParser = () => {
  // Sample JWT for demonstration
  const sampleJwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
  
  const [jwt, setJwt] = useState('');
  const [decodedJwt, setDecodedJwt] = useState({
    header: { alg: "HS256", typ: "JWT" },
    payload: { sub: "1234567890", name: "John Doe", iat: 1516239022 },
    signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
  });
  const [tokenParts, setTokenParts] = useState({
    header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
    payload: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
    signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
  });
  
  const [copied, setCopied] = useState({});
  const [error, setError] = useState('');
  const [hasUserInput, setHasUserInput] = useState(false);

  useEffect(() => {
    if (jwt) {
      parseJwt(jwt);
      setHasUserInput(true);
    }
  }, [jwt]);

  const parseJwt = (token) => {
    if (!token) {
      // Reset to sample values
      setDecodedJwt({
        header: { alg: "HS256", typ: "JWT" },
        payload: { sub: "1234567890", name: "John Doe", iat: 1516239022 },
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      });
      setTokenParts({
        header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        payload: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      });
      setError('');
      setHasUserInput(false);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. JWT should have 3 parts separated by periods.');
      }

      const [headerB64, payloadB64, signatureB64] = parts;
      
      // Store the raw parts
      setTokenParts({
        header: headerB64,
        payload: payloadB64,
        signature: signatureB64
      });

      // Decode header and payload
      let header, payload;
      try {
        // Base64Url decode
        const headerStr = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
        header = JSON.parse(headerStr);
      } catch (e) {
        throw new Error('Failed to decode JWT header');
      }

      try {
        // Base64Url decode
        const payloadStr = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
        payload = JSON.parse(payloadStr);
      } catch (e) {
        throw new Error('Failed to decode JWT payload');
      }

      // Set decoded JWT
      setDecodedJwt({
        header,
        payload,
        signature: signatureB64 // Signature remains encoded
      });

      setError('');
    } catch (err) {
      setError(err.message);
      // Keep the sample data visible on error
      setDecodedJwt({
        header: { alg: "HS256", typ: "JWT" },
        payload: { sub: "1234567890", name: "John Doe", iat: 1516239022 },
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
      });
      setTokenParts({
        header: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",
        payload: "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ",
        signature: "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
      });
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 1500);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return null;
    
    // Check if the timestamp looks like seconds from epoch (10 digits or less)
    const dateObj = timestamp.toString().length <= 10 
      ? new Date(timestamp * 1000) 
      : new Date(timestamp);
    
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    return dateObj.toLocaleString();
  };

  // Format payload fields like exp, iat, nbf
  const getFormattedValue = (key, value) => {
    if (["exp", "iat", "nbf"].includes(key) && !isNaN(value)) {
      const date = formatDate(value);
      if (date) {
        return (
          <div>
            <span>{value}</span>
            <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({date})</span>
          </div>
        );
      }
    }
    return JSON.stringify(value);
  };

  // Load sample JWT
  const loadSampleJwt = () => {
    setJwt(sampleJwt);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <KeyIcon className="h-6 w-6 mr-2" />
        JWT Parser
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter JWT Token
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={jwt}
            onChange={(e) => setJwt(e.target.value)}
            className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Paste your JWT token here"
          />
          <button
            onClick={loadSampleJwt}
            className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Load Sample
          </button>
        </div>
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>

      <div className="space-y-6">
        {/* Raw JWT Sections */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Token Parts</h3>
          
          {/* Header Part */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Header
              </span>
              <button
                onClick={() => handleCopy(tokenParts.header, 'header-raw')}
                className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              >
                {copied['header-raw'] ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <code className={`text-gray-800 dark:text-gray-200 break-all ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                {tokenParts.header}
              </code>
            </div>
          </div>
          
          {/* Payload Part */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Payload
              </span>
              <button
                onClick={() => handleCopy(tokenParts.payload, 'payload-raw')}
                className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              >
                {copied['payload-raw'] ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <code className={`text-gray-800 dark:text-gray-200 break-all ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                {tokenParts.payload}
              </code>
            </div>
          </div>
          
          {/* Signature Part */}
          <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                Signature
              </span>
              <button
                onClick={() => handleCopy(tokenParts.signature, 'signature-raw')}
                className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              >
                {copied['signature-raw'] ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <code className={`text-gray-800 dark:text-gray-200 break-all ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                {tokenParts.signature}
              </code>
            </div>
          </div>
        </div>
        
        {/* Decoded Sections */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">Decoded Data</h3>
          
          {/* Decoded Header */}
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Header
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(decodedJwt.header, null, 2), 'header-json')}
                className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              >
                {copied['header-json'] ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <pre className={`text-gray-800 dark:text-gray-200 ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                {JSON.stringify(decodedJwt.header, null, 2)}
              </pre>
            </div>
          </div>
          
          {/* Decoded Payload */}
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Payload
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(decodedJwt.payload, null, 2), 'payload-json')}
                className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              >
                {copied['payload-json'] ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5" />
                ) : (
                  <ClipboardDocumentIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
              <div className={`text-gray-800 dark:text-gray-200 ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                <table className="w-full text-left">
                  <tbody>
                    {Object.entries(decodedJwt.payload).map(([key, value]) => (
                      <tr key={key} className="border-b dark:border-gray-700">
                        <td className="py-2 pr-4 font-medium">{key}</td>
                        <td className="py-2">{getFormattedValue(key, value)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {!hasUserInput && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic mt-2">
            Showing sample JWT data. Enter a JWT token or click "Load Sample" to see actual results.
          </div>
        )}
      </div>
    </div>
  );
};

export default JwtParser;