import React, { useState, useEffect, useRef } from 'react';
import { PhotoIcon, CodeBracketIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { Tab } from '@headlessui/react';

export const toolMeta = {
  id: 'svg-placeholder',
  name: 'SVG Placeholder',
  description: 'Generate custom SVG placeholders for your applications',
  category: 'imgvid',
  path: '/tools/images-video/svg-placeholder',
  icon: PhotoIcon,
  order: 6,
};

const SvgPlaceholder = () => {
  const [width, setWidth] = useState(300);
  const [height, setHeight] = useState(150);
  const [text, setText] = useState('300×150');
  const [fontSize, setFontSize] = useState(24);
  const [bgColor, setBgColor] = useState('#E2E8F0');
  const [textColor, setTextColor] = useState('#64748B');
  const [svgCode, setSvgCode] = useState('');
  const [copied, setCopied] = useState(false);
  
  const svgRef = useRef(null);

  // Generate SVG based on current settings
  useEffect(() => {
    const generatedSvg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}"/>
  <text 
    x="50%" 
    y="50%" 
    font-family="Arial, sans-serif" 
    font-size="${fontSize}" 
    fill="${textColor}" 
    text-anchor="middle" 
    dominant-baseline="middle">${text}</text>
</svg>`;

    setSvgCode(generatedSvg);
  }, [width, height, text, fontSize, bgColor, textColor]);

  // Update visual preview when code is manually edited
  const handleCodeChange = (e) => {
    setSvgCode(e.target.value);
    try {
      // Try to extract dimensions from the SVG code
      const widthMatch = e.target.value.match(/width="([^"]+)"/);
      const heightMatch = e.target.value.match(/height="([^"]+)"/);
      
      if (widthMatch && !isNaN(parseInt(widthMatch[1]))) {
        setWidth(parseInt(widthMatch[1]));
      }
      
      if (heightMatch && !isNaN(parseInt(heightMatch[1]))) {
        setHeight(parseInt(heightMatch[1]));
      }

      // Other properties could be extracted too, but it gets complex with color formats, etc.
    } catch (error) {
      // Ignore parsing errors - let the user continue editing
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([svgCode], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `placeholder-${width}x${height}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <PhotoIcon className="h-6 w-6 mr-2" />
        SVG Placeholder Generator
      </h2>

      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-1 mb-4">
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-white'
              : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`
          }>
            Visual Editor
          </Tab>
          <Tab className={({ selected }) =>
            `w-full rounded-lg py-2.5 text-sm font-medium leading-5
            ${selected
              ? 'bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-white'
              : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`
          }>
            Code Editor
          </Tab>
        </Tab.List>
        
        <Tab.Panels className="mb-4">
          {/* Visual Editor Panel */}
          <Tab.Panel>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Dimensions
                  </label>
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Width (px)</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={width}
                        onChange={(e) => setWidth(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-gray-500 dark:text-gray-400">Height (px)</label>
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value) || 1)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Text
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Placeholder text"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Background Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="flex-grow p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Text Color
                    </label>
                    <div className="flex items-center">
                      <input
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="mr-2"
                      />
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="flex-grow p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                <div 
                  className="overflow-auto max-w-full max-h-[240px] flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: svgCode }}
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  {width}×{height} pixels
                </div>
              </div>
            </div>
          </Tab.Panel>
          
          {/* Code Editor Panel */}
          <Tab.Panel>
            <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 p-1 mb-4">
              <textarea
                value={svgCode}
                onChange={handleCodeChange}
                className="w-full h-64 p-2 font-mono text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none"
                spellCheck="false"
              />
            </div>
            
            <div className="flex justify-center bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <div 
                className="overflow-auto max-w-full max-h-[240px] flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: svgCode }}
                ref={svgRef}
              />
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>

      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={handleCopy}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
        >
          {copied ? (
            <>
              <ClipboardDocumentCheckIcon className="h-5 w-5 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
              Copy SVG
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
        >
          <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
          Download SVG
        </button>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Use SVG placeholders for responsive, lightweight, and customizable placeholders in your projects.</p>
        <p className="mt-1">SVGs scale perfectly without pixelation and have much smaller file sizes than raster images.</p>
      </div>
    </div>
  );
};

export default SvgPlaceholder;