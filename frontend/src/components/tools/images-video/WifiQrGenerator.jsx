import React, { useState, useRef } from 'react';
import { WifiIcon } from '@heroicons/react/24/outline';
import { ArrowDownTrayIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

// You'll need to install: npm install qrcode.react
import { QRCodeSVG } from 'qrcode.react';

export const toolMeta = {
  id: 'wifi-qr-generator',
  name: 'WiFi QR Generator',
  description: 'Create QR codes for WiFi networks',
  category: 'images-video',
  path: '/tools/images-video/wifi-qr-generator',
  icon: WifiIcon,
  order: 5,
};

const WifiQrGenerator = () => {
  const [ssid, setSsid] = useState('My WiFi Network');
  const [password, setPassword] = useState('mypassword123');
  const [encryption, setEncryption] = useState('WPA');
  const [hidden, setHidden] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [size, setSize] = useState(200);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [fgColor, setFgColor] = useState('#000000');
  const [includeMargin, setIncludeMargin] = useState(true);
  
  const qrRef = useRef();
  
  // Generate WiFi QR code content in the standard format
  const getWifiQrContent = () => {
    let content = 'WIFI:';
    
    // SSID
    content += `S:${escapeSpecialChars(ssid)};`;
    
    // Type of authentication
    content += `T:${encryption};`;
    
    // Password (if not open network)
    if (encryption !== 'nopass' && password) {
      content += `P:${escapeSpecialChars(password)};`;
    }
    
    // Hidden network
    if (hidden) {
      content += 'H:true;';
    }
    
    // End
    content += ';';
    
    return content;
  };
  
  // Escape special characters as per WiFi QR code specification
  const escapeSpecialChars = (text) => {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/;/g, '\\;')
      .replace(/,/g, '\\,')
      .replace(/:/g, '\\:');
  };

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
      downloadLink.download = "wifi-qrcode.png";
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };
  
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <WifiIcon className="h-6 w-6 mr-2" />
        WiFi QR Code Generator
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* WiFi Controls */}
        <div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Network Name (SSID)
            </label>
            <input
              type="text"
              value={ssid}
              onChange={(e) => setSsid(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter network name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                placeholder="Enter password"
                disabled={encryption === 'nopass'}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={encryption === 'nopass'}
              >
                {showPassword ? 
                  <EyeSlashIcon className="h-5 w-5" /> : 
                  <EyeIcon className="h-5 w-5" />
                }
              </button>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Security Type
            </label>
            <select
              value={encryption}
              onChange={(e) => setEncryption(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="WPA">WPA/WPA2/WPA3</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={hidden}
                onChange={(e) => setHidden(e.target.checked)}
                className="mr-2"
              />
              Hidden Network
            </label>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              QR Code Options
            </h3>
          
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
          </div>
        </div>
        
        {/* QR Code Preview */}
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4 p-4 bg-white dark:bg-gray-900 rounded-lg shadow-sm">
            <QRCodeSVG
              ref={qrRef}
              value={getWifiQrContent()}
              size={size}
              bgColor={bgColor}
              fgColor={fgColor}
              level="M"
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
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm text-blue-800 dark:text-blue-200">
            <p>Scan this QR code with your phone's camera to automatically connect to this WiFi network.</p>
          </div>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>Note: Most Android devices and iPhones running iOS 11+ support WiFi QR codes natively through the camera app.</p>
      </div>
    </div>
  );
};

export default WifiQrGenerator;