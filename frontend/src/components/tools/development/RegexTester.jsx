import React, { useState, useEffect } from 'react';
import { CodeBracketSquareIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'regex-tester',
  name: 'Regex Tester',
  description: 'Test and debug regular expressions',
  category: 'development',
  path: '/tools/development/regex-tester',
  icon: CodeBracketSquareIcon,
  order: 3,
};

const RegexTester = () => {
  // Example regex and test string for demonstration
  const initialPattern = '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b';
  const initialText = `Contact us at info@example.com or support@company.co.uk.
Please don't email to admin@test or invalid@domain.`;
  
  const [pattern, setPattern] = useState(initialPattern);
  const [flags, setFlags] = useState('i');
  const [text, setText] = useState(initialText);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [highlightedText, setHighlightedText] = useState('');
  const [matchCount, setMatchCount] = useState(0);

  // Common regex patterns
  const commonRegexPatterns = [
    { name: 'Email', pattern: '\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b', flags: 'i' },
    { name: 'URL', pattern: '(https?:\\/\\/)?([\\w\\-])+\\.{1}([a-zA-Z]{2,63})([\\/\\w-]*)*\\/?\\??([^#\\n\\r]*)?#?([^\\n\\r]*)', flags: 'i' },
    { name: 'IP Address', pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b', flags: '' },
    { name: 'Date (MM/DD/YYYY)', pattern: '\\b(0?[1-9]|1[0-2])[\\/\\-](0?[1-9]|[12]\\d|3[01])[\\/\\-](19|20)\\d{2}\\b', flags: '' },
    { name: 'Phone Number', pattern: '\\b\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}\\b', flags: '' },
    { name: 'HTML Tag', pattern: '<([a-z][a-z0-9]*)\\\s*[^>]*>(.*?)<\\\\/\\1>', flags: 'i' },
  ];

  useEffect(() => {
    testRegex();
  }, [pattern, flags, text]);

  const testRegex = () => {
    if (!pattern) {
      setMatches([]);
      setError(null);
      setHighlightedText('');
      setMatchCount(0);
      return;
    }

    try {
      // Create the regex with flags
      const regex = new RegExp(pattern, flags);
      
      // Check for matches
      let match;
      const foundMatches = [];
      let count = 0;
      
      // If global flag is set, find all matches
      if (flags.includes('g')) {
        while ((match = regex.exec(text)) !== null) {
          count++;
          foundMatches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
        }
      } else {
        // Otherwise, just find the first match
        match = regex.exec(text);
        if (match) {
          count = 1;
          foundMatches.push({
            value: match[0],
            index: match.index,
            groups: match.slice(1),
            length: match[0].length
          });
        }
      }
      
      setMatches(foundMatches);
      setError(null);
      setMatchCount(count);
      
      // Create highlighted text for display
      generateHighlightedText(foundMatches);
      
    } catch (err) {
      setError(`Invalid regex: ${err.message}`);
      setMatches([]);
      setHighlightedText('');
      setMatchCount(0);
    }
  };

  const generateHighlightedText = (foundMatches) => {
    if (foundMatches.length === 0) {
      setHighlightedText(escapeHtml(text));
      return;
    }

    let result = '';
    let lastIndex = 0;
    
    // Sort matches by index to ensure proper order
    const sortedMatches = [...foundMatches].sort((a, b) => a.index - b.index);
    
    sortedMatches.forEach(match => {
      // Add text before the match
      result += escapeHtml(text.substring(lastIndex, match.index));
      // Add the highlighted match
      result += `<span class="bg-yellow-200 dark:bg-yellow-700">${escapeHtml(match.value)}</span>`;
      lastIndex = match.index + match.length;
    });
    
    // Add any remaining text
    result += escapeHtml(text.substring(lastIndex));
    
    setHighlightedText(result);
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pattern);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleLoadExample = (examplePattern) => {
    setPattern(examplePattern.pattern);
    setFlags(examplePattern.flags);
  };

  const handleFlagToggle = (flag) => {
    setFlags(prev => 
      prev.includes(flag) ? prev.replace(flag, '') : prev + flag
    );
  };

  const flagOptions = [
    { flag: 'g', description: 'Global - Find all matches' },
    { flag: 'i', description: 'Case Insensitive' },
    { flag: 'm', description: 'Multiline - Affects ^ and $' },
    { flag: 's', description: 'Dot All - . matches newlines' },
    { flag: 'u', description: 'Unicode' },
    { flag: 'y', description: 'Sticky - Match at current position' }
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <CodeBracketSquareIcon className="h-6 w-6 mr-2" />
        Regex Tester
      </h2>

      {/* Common Patterns */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Common Patterns
        </label>
        <div className="flex flex-wrap gap-2">
          {commonRegexPatterns.map((item, index) => (
            <button
              key={index}
              onClick={() => handleLoadExample(item)}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-xs text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Pattern Input */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            RegEx Pattern
          </label>
          <button
            onClick={handleCopy}
            className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400 flex items-center text-xs"
          >
            {copied ? (
              <>
                <ClipboardDocumentCheckIcon className="h-4 w-4 mr-1" />
                Copied
              </>
            ) : (
              <>
                <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                Copy
              </>
            )}
          </button>
        </div>
        <div className="flex rounded-md shadow-sm">
          <div className="flex-grow">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-600 dark:text-gray-400">
                /
              </span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="w-full pl-5 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
                placeholder="Enter regex pattern"
              />
            </div>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-1 flex items-center text-gray-600 dark:text-gray-400">
              /
            </span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              className="w-16 pl-3 py-2 border border-l-0 border-gray-300 dark:border-gray-600 rounded-r-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
              placeholder="flags"
              maxLength={6}
            />
          </div>
        </div>
        {error && <div className="mt-1 text-sm text-red-500">{error}</div>}
      </div>

      {/* Flags Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Flags
        </label>
        <div className="flex flex-wrap gap-2">
          {flagOptions.map(option => (
            <button
              key={option.flag}
              onClick={() => handleFlagToggle(option.flag)}
              className={`px-2 py-1 text-xs rounded ${
                flags.includes(option.flag) 
                  ? 'bg-brand-green text-white' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
              title={option.description}
            >
              {option.flag} - {option.description}
            </button>
          ))}
        </div>
      </div>

      {/* Test String Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test String
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          rows="4"
          placeholder="Enter text to test against the regex pattern"
        />
      </div>

      {/* Results */}
      <div className="mb-4">
        <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">
          Results {matchCount > 0 && `(${matchCount} match${matchCount === 1 ? '' : 'es'})`}
        </h3>
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md overflow-auto whitespace-pre-wrap max-h-60">
          {highlightedText ? (
            <div dangerouslySetInnerHTML={{ __html: highlightedText }} className="text-gray-800 dark:text-gray-200" />
          ) : (
            <span className="text-gray-500 dark:text-gray-400">No match found</span>
          )}
        </div>
      </div>

      {/* Match Details */}
      {matches.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium text-gray-800 dark:text-white mb-2">Match Details</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Match
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Position
                  </th>
                  {matches.some(m => m.groups.length > 0) && (
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Groups
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {matches.map((match, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-white">
                      {match.value}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                      {match.index} - {match.index + match.length}
                    </td>
                    {matches.some(m => m.groups.length > 0) && (
                      <td className="px-4 py-2 whitespace-pre-wrap font-mono text-sm text-gray-900 dark:text-white">
                        {match.groups.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {match.groups.map((group, groupIndex) => (
                              <li key={groupIndex}>
                                ${groupIndex + 1}: {group}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "-"
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p className="mb-1">
          <strong>Tip:</strong> The "g" flag enables finding all matches (instead of just the first one).
        </p>
        <p>
          Click any of the common patterns above to quickly test standard regex patterns.
        </p>
      </div>
    </div>
  );
};

export default RegexTester;