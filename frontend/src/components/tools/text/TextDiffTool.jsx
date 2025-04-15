import { useState, useEffect } from "react";
import { diffWords } from "diff";
import { DocumentTextIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "text-diff-tool",
    name: "Text Diff Tool",
    description: "Compare two pieces of text and highlight the differences between them.",
    category: "text",
    path: "/tools/text/text-diff-tool",
    icon: DocumentTextIcon,
    order: 2,
};

const TextDiffTool = () => {
    const [originalText, setOriginalText] = useState("original text khôi hihi");
    const [modifiedText, setModifiedText] = useState("modified text haha hihi");
    const [highlightedLeft, setHighlightedLeft] = useState("");
    const [highlightedRight, setHighlightedRight] = useState("");

    useEffect(() => {
        const diffs = diffWords(originalText, modifiedText);

        const left = diffs
            .map((part) => {
                if (part.removed) {
                    return `<span class="bg-green-200">${part.value}</span>`;
                } else if (!part.added) {
                    return `<span>${part.value}</span>`;
                }
                return "";
            })
            .join("");

        const right = diffs
            .map((part) => {
                if (part.added) {
                    return `<span class="bg-red-200">${part.value}</span>`;
                } else if (!part.removed) {
                    return `<span>${part.value}</span>`;
                }
                return "";
            })
            .join("");

        setHighlightedLeft(left);
        setHighlightedRight(right);
    }, [originalText, modifiedText]);

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">Text Diff</h1>
            <p className="text-gray-500">Highlight differences directly while typing.</p>

            <div className="grid grid-cols-2 gap-4">
                {/* Original Text Input */}
                <div>
                    <label className="block mb-1 text-gray-700 font-semibold">Original</label>
                    <textarea
                        className="w-full p-3 border rounded-lg font-mono resize-none h-32"
                        value={originalText}
                        onChange={(e) => setOriginalText(e.target.value)}
                    />
                    <div
                        className="mt-2 p-3 border bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedLeft }}
                    />
                </div>

                {/* Modified Text Input */}
                <div>
                    <label className="block mb-1 text-gray-700 font-semibold">Modified</label>
                    <textarea
                        className="w-full p-3 border rounded-lg font-mono resize-none h-32"
                        value={modifiedText}
                        onChange={(e) => setModifiedText(e.target.value)}
                    />
                    <div
                        className="mt-2 p-3 border bg-gray-50 rounded font-mono text-sm whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: highlightedRight }}
                    />
                </div>
            </div>
        </div>
    );
};

export default TextDiffTool;
