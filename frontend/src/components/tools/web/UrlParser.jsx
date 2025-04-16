import React, { useState, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'url-parser',
  name: 'URL Parser',
  description: 'Parse and analyze URL components',
  category: 'web',
  path: '/tools/web/url-parser',
  icon: GlobeAltIcon,
  order: 1,
};

const UrlParser = () => {
  // Initialize with placeholder values
  const [url, setUrl] = useState('');
  const [urlParts, setUrlParts] = useState({
    href: '-',
    protocol: '-',
    host: '-',
    hostname: '-',
    port: '-',
    pathname: '-',
    search: '-',
    hash: '-',
    origin: '-',
  });
  const [queryParams, setQueryParams] = useState([
    { key: 'example', value: 'value' },
    { key: 'another', value: 'parameter' },
  ]);
  const [copied, setCopied] = useState({});
  const [error, setError] = useState('');
  const [hasUserInput, setHasUserInput] = useState(false);

  useEffect(() => {
    if (url) {
      parseUrl(url);
      setHasUserInput(true);
    }
  }, [url]);

  const parseUrl = (urlString) => {
    if (!urlString) {
      // Reset to placeholder values
      setUrlParts({
        href: '-',
        protocol: '-',
        host: '-',
        hostname: '-',
        port: '-',
        pathname: '-',
        search: '-',
        hash: '-',
        origin: '-',
      });
      setQueryParams([
        { key: 'example', value: 'value' },
        { key: 'another', value: 'parameter' },
      ]);
      setError('');
      setHasUserInput(false);
      return;
    }

    try {
      // Try to prepend https:// if no protocol is specified
      let parsedUrl;
      try {
        parsedUrl = new URL(urlString);
      } catch (e) {
        if (!urlString.match(/^[a-zA-Z]+:\/\//)) {
          parsedUrl = new URL(`https://${urlString}`);
        } else {
          throw e;
        }
      }

      // Extract URL components
      const parts = {
        href: parsedUrl.href,
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || '-',
        pathname: parsedUrl.pathname,
        search: parsedUrl.search || '-',
        hash: parsedUrl.hash || '-',
        origin: parsedUrl.origin,
      };

      // Extract query parameters
      const params = [];
      parsedUrl.searchParams.forEach((value, key) => {
        params.push({ key, value });
      });
      
      // If no query params were found, keep the placeholder ones but mark them as examples
      if (params.length === 0 && !hasUserInput) {
        params.push({ key: 'example', value: 'value' });
        params.push({ key: 'another', value: 'parameter' });
      }

      setUrlParts(parts);
      setQueryParams(params);
      setError('');
    } catch (err) {
      setError('Invalid URL');
      // Reset to placeholder values on error
      setUrlParts({
        href: '-',
        protocol: '-',
        host: '-',
        hostname: '-',
        port: '-',
        pathname: '-',
        search: '-',
        hash: '-',
        origin: '-',
      });
      setQueryParams([]);
    }
  };

  const handleCopy = (text, key) => {
    if (text === '-') return; // Don't copy placeholder values
    
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [key]: true });
    setTimeout(() => setCopied({ ...copied, [key]: false }), 1500);
  };

  const isPlaceholder = (value) => value === '-' || (!hasUserInput && (value === 'example' || value === 'parameter'));

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <GlobeAltIcon className="h-6 w-6 mr-2" />
        URL Parser
      </h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Enter URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          placeholder="https://example.com/path?param=value#fragment"
        />
        {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
      </div>

      {/* Always display the results section */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white">URL Components</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(urlParts).map(([key, value]) => (
            <div key={key} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {key}
                </span>
                {!isPlaceholder(value) && (
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                  >
                    {copied[key] ? (
                      <ClipboardDocumentCheckIcon className="h-5 w-5" />
                    ) : (
                      <ClipboardDocumentIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
              </div>
              <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
                <code className={`text-gray-800 dark:text-gray-200 break-all ${isPlaceholder(value) ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                  {value}
                </code>
              </div>
            </div>
          ))}
        </div>

        {/* Always show the query parameters section with placeholders or actual data */}
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mt-6">Query Parameters</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Parameter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Copy
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {queryParams.length > 0 ? (
                queryParams.map((param, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                      {param.key}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white overflow-x-auto">
                      <div className="max-w-md overflow-x-auto">
                        <code className={`break-all ${!hasUserInput ? 'text-opacity-50 dark:text-opacity-50' : ''}`}>
                          {param.value}
                        </code>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      {hasUserInput && (
                        <button
                          onClick={() => handleCopy(param.value, `param-${index}`)}
                          className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                        >
                          {copied[`param-${index}`] ? (
                            <ClipboardDocumentCheckIcon className="h-5 w-5" />
                          ) : (
                            <ClipboardDocumentIcon className="h-5 w-5" />
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No query parameters found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!hasUserInput && (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 italic mt-2">
            Showing placeholder data. Enter a URL to see actual results.
          </div>
        )}
      </div>
    </div>
  );
};

export default UrlParser;