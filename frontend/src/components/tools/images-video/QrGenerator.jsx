import React, { useState, useRef } from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

// You'll need to install: npm install qrcode.react
import { QRCodeSVG } from 'qrcode.react';

export const toolMeta = {
  id: 'qr-code-generator',
  name: 'QR Code Generator',
  description: 'Generate customizable QR codes',
  category: 'images-video',
  path: '/tools/images-video/qr-code-generator',
  icon: QrCodeIcon,
  order: 4,
};

const QrCodeGenerator = () => {
  const [text, setText] = useState('https://example.com');
  const [size, setSize] = useState(200);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [includeMargin, setIncludeMargin] = useState(true);
  const [errorLevel, setErrorLevel] = useState('M');
  
  const qrRef = useRef();
  
  const handleDownload = () => {
    if (!qrRef.current) return;
    
    const canvas = document.createElement('canvas');
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const width = svg.width.baseVal.value;
    const height = svg.height.baseVal.value;
    
    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0);
      
      const pngFile = canvas.toDataURL("image/png");
      
      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.download = "qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <QrCodeIcon className="h-6 w-6 mr-2" />
        QR Code Generator
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Controls */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Text or URL
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows="3"
              placeholder="Enter text or URL"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Size: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Foreground Color
              </label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="mr-2"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-grow p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Correction Level
            </label>
            <select
              value={errorLevel}
              onChange={(e) => setErrorLevel(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={includeMargin}
                onChange={(e) => setIncludeMargin(e.target.checked)}
                className="mr-2"
              />
              Include Margin
            </label>
          </div>
        </div>
        
        {/* QR Code Preview */}
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
            <QRCodeSVG
              ref={qrRef}
              value={text || 'https://example.com'}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level={errorLevel}
              includeMargin={includeMargin}
              className="mx-auto"
            />
          </div>
          
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Download QR Code
          </button>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Tip: Higher error correction levels make QR codes more resilient to damage but increase density.</p>
      </div>
    </div>
  );
};

export default QrCodeGenerator;