import React, { useState, useEffect } from "react";
import { DocumentTextIcon, ArrowPathIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    description: "Generate placeholder text with control over paragraphs, sentences, and words.",
    category: "text",
    path: "/tools/text/lorem-ipsum-generator",
    icon: DocumentTextIcon,
    order: 4,
};

const generateLorem = (paragraphs, sentences, words, startWithLorem, asHtml) => {
    const getRandomWord = () => {
        const words = [
            "lorem", "ipsum", "dolor", "sit", "amet", "consectetur",
            "adipiscing", "elit", "sed", "do", "eiusmod", "tempor",
            "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua"
        ];
        return words[Math.floor(Math.random() * words.length)];
    };

    const generateSentence = () => {
        const sentenceWords = Array.from({ length: words }, getRandomWord);
        const sentence = sentenceWords.join(" ");
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    };

    const generateParagraph = () => {
        const sents = Array.from({ length: sentences }, generateSentence);
        return sents.join(" ");
    };

    const result = Array.from({ length: paragraphs }, (_, idx) => {
        const p = generateParagraph();
        return asHtml
            ? `<p>${startWithLorem && idx === 0 ? "Lorem ipsum " + p : p}</p>`
            : (startWithLorem && idx === 0 ? "Lorem ipsum " + p : p);
    });

    return result.join(asHtml ? "\n" : "\n\n");
};

const Toggle = ({ label, checked, onChange }) => (
    <label className="flex items-center cursor-pointer space-x-2">
        <div className="relative">
            <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
            <div className={`w-10 h-5 rounded-full shadow-inner ${checked ? 'bg-green-500' : 'bg-gray-300'} transition-colors dark:${checked ? 'bg-green-600' : 'bg-gray-600'}`}></div>
            <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
        </div>
        <span className={`text-gray-700 dark:text-gray-300 ${checked ? 'text-green-500' : ''}`}>{label}</span>
    </label>
);

const LoremIpsumGenerator = () => {
    const [paragraphs, setParagraphs] = useState(3);
    const [sentences, setSentences] = useState(4);
    const [words, setWords] = useState(6);
    const [startWithLorem, setStartWithLorem] = useState(true);
    const [asHtml, setAsHtml] = useState(true);
    const [output, setOutput] = useState("");
    const [copied, setCopied] = useState(false);

    const regenerate = () => {
        const result = generateLorem(paragraphs, sentences, words, startWithLorem, asHtml);
        setOutput(result);
    };

    useEffect(() => {
        regenerate();
    }, [paragraphs, sentences, words, startWithLorem, asHtml]);

    const handleCopy = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // reset after 2s
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <DocumentTextIcon className="w-7 h-7 mr-2 text-brand-green" />
                Lorem Ipsum Generator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Generate placeholder text with custom length, sentence, and formatting options.
            </p>

            {/* Controls */}
            <div className="space-y-6 mb-6">
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Paragraphs</label>
                    <input type="range" min={1} max={50} value={paragraphs} onChange={(e) => setParagraphs(Number(e.target.value))} className="w-full" />
                    <div className="text-sm text-right text-gray-500">{paragraphs}</div>
                </div>
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Sentences per paragraph</label>
                    <input type="range" min={1} max={50} value={sentences} onChange={(e) => setSentences(Number(e.target.value))} className="w-full" />
                    <div className="text-sm text-right text-gray-500">{sentences}</div>
                </div>
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Words per sentence</label>
                    <input type="range" min={1} max={50} value={words} onChange={(e) => setWords(Number(e.target.value))} className="w-full" />
                    <div className="text-sm text-right text-gray-500">{words}</div>
                </div>

                <div className="flex items-center justify-between">
                    <Toggle label="Start with lorem ipsum?" checked={startWithLorem} onChange={() => setStartWithLorem(!startWithLorem)} />
                    <Toggle label="As HTML?" checked={asHtml} onChange={() => setAsHtml(!asHtml)} />
                </div>
            </div>

            {/* Output */}
            <textarea
                readOnly
                rows={10}
                value={output}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-4"
            />

            {/* Actions */}
            <div className="flex justify-between items-center gap-3">
                <button
                    onClick={regenerate}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white rounded-md hover:bg-blue-200 dark:hover:bg-blue-600"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Refresh
                </button>
                <div className="relative">
                    <button
                        onClick={handleCopy}
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

export default LoremIpsumGenerator;
