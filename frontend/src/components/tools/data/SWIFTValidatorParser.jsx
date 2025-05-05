import { useState, useEffect } from "react";
import { ClipboardDocumentCheckIcon, BuildingLibraryIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "swift-validator-parser",
    name: "SWIFT-BIC Validator Parser",
    description: "Validate and parse SWIFT-BIC codes.",
    category: "data",
    path: "/tools/data/swift-bic-validator-parser",
    icon: BuildingLibraryIcon,
    order: 6,
};

const SWIFTValidatorParser = () => {
    const [swiftCode, setSwiftCode] = useState("");
    const [info, setInfo] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        if (swiftCode.trim() === "") {
            setInfo(null);
            return;
        }

        const fetchSWIFTInfo = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/swift/parse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ swiftCode }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setInfo(data);
                } else {
                    const error = await response.text();
                    setInfo({ error });
                }
            } catch (err) {
                setInfo({ error: "Something went wrong!" });
            }
        };

        fetchSWIFTInfo();
    }, [swiftCode]);

    const copyToClipboard = (value, field) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <BuildingLibraryIcon className="w-7 h-7 mr-2 text-blue-600" />
                SWIFT/BIC Validator and Parser
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Validate and parse SWIFT/BIC codes. See if the code is valid and view its associated bank, country, and location.
            </p>

            <input
                type="text"
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
                placeholder="Enter SWIFT/BIC code..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-6"
            />

            {info && !info.error && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2 text-sm text-gray-800 dark:text-gray-100">
                    <div><strong>Is SWIFT valid?</strong>: {info.isValid ? "Yes" : "No"}</div>
                    <div className="flex items-center gap-2">
                        <strong>Bank</strong>: <span className="font-bold">{info.bankName}</span>
                        <button
                            onClick={() => copyToClipboard(info.bankName, "bank")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "bank" && <span className="text-green-500 text-xs">Copied</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>Country</strong>: {info.country}
                        <button
                            onClick={() => copyToClipboard(info.country, "country")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "country" && <span className="text-green-500 text-xs">Copied</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>City</strong>: {info.city}
                        <button
                            onClick={() => copyToClipboard(info.city, "city")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "city" && <span className="text-green-500 text-xs">Copied</span>}
                    </div>
                </div>
            )}

            {info?.error && (
                <div className="bg-red-50 dark:bg-red-800 border border-red-200 dark:border-red-700 rounded-lg p-4 text-red-600 dark:text-red-400">
                    {info.error}
                </div>
            )}
        </div>
    );
};

export default SWIFTValidatorParser;
