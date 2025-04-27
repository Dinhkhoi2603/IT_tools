import { useEffect, useState } from "react";
import figlet from "figlet";
import standard from "figlet/importable-fonts/Standard.js";
import slant from "figlet/importable-fonts/Slant.js";
import threeXfive from "figlet/importable-fonts/3x5.js";
import banner from "figlet/importable-fonts/Banner.js";
import poison from "figlet/importable-fonts/Poison.js";
import { SparklesIcon, ArrowPathIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

// Parse fonts cho browser
figlet.parseFont("Standard", standard);
figlet.parseFont("Slant", slant);
figlet.parseFont("3x5", threeXfive);
figlet.parseFont("Banner", banner);
figlet.parseFont("Poison", poison);

export const toolMeta = {
    id: "ascii-art-generator",
    name: "ASCII Art Generator",
    description: "Create ASCII art text with many fonts and styles.",
    category: "text",
    path: "/tools/text/ascii-art-generator",
    icon: SparklesIcon,
    order: 3,
};

const AsciiArtGenerator = () => {
    const [text, setText] = useState("hello");
    const [font, setFont] = useState("Standard");
    const [width, setWidth] = useState(80);
    const [asciiArt, setAsciiArt] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        generateAscii();
    }, [text, font, width]);

    const generateAscii = () => {
        figlet.text(
            text,
            {
                font,
                width,
                horizontalLayout: "default",
                verticalLayout: "default",
            },
            (err, result) => {
                if (err) {
                    console.error("Error generating ASCII art:", err);
                    setAsciiArt("Error generating ASCII art.");
                } else {
                    setAsciiArt(result);
                }
            }
        );
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(asciiArt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomFont = () => {
        const fonts = ["Standard", "Slant", "3x5", "Banner", "Poison"];
        const random = fonts[Math.floor(Math.random() * fonts.length)];
        setFont(random);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <SparklesIcon className="w-7 h-7 mr-2 text-brand-green" />
                ASCII Art Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create ASCII art text with many fonts and styles.
            </p>

            {/* Controls */}
            <div className="space-y-6 mb-6">
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Text</label>
                    <textarea
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-4"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Font</label>
                    <select
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        value={font}
                        onChange={(e) => setFont(e.target.value)}
                    >
                        {["Standard", "Slant", "3x5", "Banner", "Poison"].map((f) => (
                            <option key={f} value={f}>
                                {f}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Width</label>
                    <input
                        type="number"
                        min="20"
                        max="120"
                        value={width}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        onChange={(e) => setWidth(Number(e.target.value))}
                    />
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white rounded-md hover:bg-blue-200 dark:hover:bg-blue-600"
                        onClick={randomFont}
                    >
                        <ArrowPathIcon className="w-5 h-5" />
                        Random Font
                    </button>
                </div>
            </div>

            {/* Output */}
            <textarea
                readOnly
                rows={10}
                value={asciiArt}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-4"
            />

            {/* Actions */}
            <div className="flex justify-between items-center gap-3">
                <div className="relative">
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                        <ClipboardDocumentCheckIcon className="w-5 h-5" />
                        Copy
                    </button>
                    {copied && (
                        <div className="absolute top-full mt-1 text-xs text-green-600 dark:text-green-400">
                            Copied!
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AsciiArtGenerator;
