import React, { useState, useEffect } from 'react';
import { CodeBracketIcon } from '@heroicons/react/24/outline';
import { ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export const toolMeta = {
  id: 'xml-json-converter',
  name: 'XML-JSON Converter',
  description: 'Convert between XML and JSON formats',
  category: 'converter',
  path: '/tools/converter/xml-json-converter',
  icon: CodeBracketIcon,
  order: 3,
};

const XmlJsonConverter = () => {
  const [xmlText, setXmlText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [error, setError] = useState({ xml: '', json: '' });
  const [copied, setCopied] = useState({ xml: false, json: false });

  // Convert XML to JSON when XML text changes
  useEffect(() => {
    if (document.activeElement?.id !== 'json-input' && xmlText) {
      try {
        const jsonObj = xmlToJson(xmlText);
        setJsonText(JSON.stringify(jsonObj, null, 2));
        setError({ ...error, xml: '' });
      } catch (err) {
        setError({ ...error, xml: 'Invalid XML: ' + err.message });
      }
    }
  }, [xmlText]);

  // Convert JSON to XML when JSON text changes
  useEffect(() => {
    if (document.activeElement?.id !== 'xml-input' && jsonText) {
      try {
        const jsonObj = JSON.parse(jsonText);
        const xmlString = jsonToXml(jsonObj);
        setXmlText(xmlString);
        setError({ ...error, json: '' });
      } catch (err) {
        setError({ ...error, json: 'Invalid JSON: ' + err.message });
      }
    }
  }, [jsonText]);

  // XML to JSON conversion
  const xmlToJson = (xml) => {
    // Create a DOM parser to convert string to XML document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");
    
    // Check for parsing errors
    const parseError = xmlDoc.getElementsByTagName("parsererror");
    if (parseError.length) {
      throw new Error(parseError[0].textContent);
    }
    
    // Helper function to convert XML node to JSON object
    const convertNodeToJson = (node) => {
      // Create an object to represent this node
      const obj = {};
      
      // Add attributes if they exist
      if (node.attributes && node.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let i = 0; i < node.attributes.length; i++) {
          const attribute = node.attributes[i];
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
      
      // Add child nodes or text content
      if (node.hasChildNodes()) {
        // Group child elements by their tag name
        const childGroups = {};
        
        for (let i = 0; i < node.childNodes.length; i++) {
          const child = node.childNodes[i];
          
          // Handle text nodes
          if (child.nodeType === 3) { // Text node
            const text = child.nodeValue.trim();
            if (text) {
              // If there's only one text node and no other elements
              if (node.childNodes.length === 1) {
                return text;
              } else {
                obj["#text"] = text;
              }
            }
            continue;
          }
          
          // Handle element nodes
          if (child.nodeType === 1) { // Element node
            const childJson = convertNodeToJson(child);
            
            // Group elements with same tag name
            if (!childGroups[child.nodeName]) {
              childGroups[child.nodeName] = [];
            }
            childGroups[child.nodeName].push(childJson);
          }
        }
        
        // Add the grouped child elements to the object
        Object.keys(childGroups).forEach(key => {
          if (childGroups[key].length === 1) {
            obj[key] = childGroups[key][0];
          } else {
            obj[key] = childGroups[key];
          }
        });
      }
      
      return obj;
    };
    
    // Start the conversion with the root element
    const rootElement = xmlDoc.documentElement;
    const result = {};
    result[rootElement.nodeName] = convertNodeToJson(rootElement);
    
    return result;
  };

  // JSON to XML conversion
  const jsonToXml = (obj, parentName = "root") => {
    // Helper function to convert a simple value to XML tag
    const valueToXml = (name, value) => {
      if (value === null || value === undefined) {
        return `<${name}/>`;
      }
      
      return `<${name}>${value}</${name}>`;
    };
    
    // Start with an empty string
    let xml = "";
    
    if (typeof obj === 'object' && obj !== null) {
      // It's an array
      if (Array.isArray(obj)) {
        return obj.map(item => jsonToXml(item, parentName)).join("");
      }
      
      // It's an object
      const attributes = [];
      const children = [];
      
      // Process all properties
      for (const key in obj) {
        // Handle attributes
        if (key === "@attributes") {
          for (const attrKey in obj[key]) {
            attributes.push(`${attrKey}="${obj[key][attrKey]}"`);
          }
        }
        // Handle special text property
        else if (key === "#text") {
          children.push(obj[key]);
        }
        // Handle regular properties
        else {
          children.push(jsonToXml(obj[key], key));
        }
      }
      
      // Build opening tag with attributes
      if (Object.keys(obj).length === 0) {
        xml += `<${parentName}/>`;
      } else {
        xml += `<${parentName}${attributes.length ? " " + attributes.join(" ") : ""}>`;
        
        // Add child elements or text content
        if (children.length) {
          xml += children.join("");
        }
        
        // Close the tag
        xml += `</${parentName}>`;
      }
    } else {
      // It's a primitive value
      xml = valueToXml(parentName, obj);
    }
    
    return xml;
  };

  // Handle copy function
  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => setCopied({ ...copied, [type]: false }), 1500);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
        <CodeBracketIcon className="h-6 w-6 mr-2" />
        XML-JSON Converter
      </h2>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* XML Input */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              XML
            </label>
            <button
              onClick={() => handleCopy(xmlText, 'xml')}
              className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              disabled={!xmlText}
            >
              {copied.xml ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <textarea
            id="xml-input"
            value={xmlText}
            onChange={(e) => setXmlText(e.target.value)}
            className="w-full h-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            placeholder='<root>\n  <item id="1">Value</item>\n</root>'
          />
          {error.xml && (
            <div className="text-red-500 text-sm mt-1">{error.xml}</div>
          )}
        </div>

        {/* JSON Output */}
        <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              JSON
            </label>
            <button
              onClick={() => handleCopy(jsonText, 'json')}
              className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
              disabled={!jsonText}
            >
              {copied.json ? (
                <ClipboardDocumentCheckIcon className="h-5 w-5" />
              ) : (
                <ClipboardDocumentIcon className="h-5 w-5" />
              )}
            </button>
          </div>
          <textarea
            id="json-input"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="w-full h-64 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono"
            placeholder='{\n  "root": {\n    "item": {\n      "@attributes": {\n        "id": "1"\n      },\n      "#text": "Value"\n    }\n  }\n}'
          />
          {error.json && (
            <div className="text-red-500 text-sm mt-1">{error.json}</div>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
        <p>Enter XML or JSON in either box to see the conversion in the other box.</p>
        <p className="mt-1">Note: XML attributes are converted to "@attributes" in JSON, and text content to "#text".</p>
      </div>
    </div>
  );
};

export default XmlJsonConverter;