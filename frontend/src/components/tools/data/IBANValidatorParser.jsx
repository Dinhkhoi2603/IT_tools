import { useState, useEffect } from "react";
import { ClipboardDocumentCheckIcon, BanknotesIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "iban-validator-parser",
    name: "IBAN Validator and Parser",
    description: "Validate and parse IBAN numbers.",
    category: "text",
    path: "/tools/text/iban-validator-parser",
    icon: BanknotesIcon,
    order: 5,
};

const IBANValidatorParser = () => {
    const [iban, setIban] = useState("");
    const [info, setInfo] = useState(null);
    const [copiedField, setCopiedField] = useState(null);

    useEffect(() => {
        if (iban.trim() === "") {
            setInfo(null);
            return;
        }

        const fetchIBANInfo = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/iban/parse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ iban }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setInfo(data);
                } else {
                    const error = await response.text();
                    setInfo({ error });
                }
                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setInfo({ error: "Something went wrong!" });
            }
        };

        fetchIBANInfo();
    }, [iban]);

    const copyToClipboard = (value, field) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <BanknotesIcon className="w-7 h-7 mr-2 text-brand-green" />
                IBAN Validator and Parser
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Validate and parse IBAN numbers. Check if an IBAN is valid and get the country, BBAN, if it is a QR-IBAN and the IBAN friendly format.
            </p>

            <input
                type="text"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="Enter IBAN..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100 mb-6"
            />

            {info && !info.error && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2 text-sm text-gray-800 dark:text-gray-100">
                    <div><strong>Is IBAN valid?</strong>: {info.isValid ? "Yes" : "No"}</div>
                    <div><strong>Is IBAN a QR-IBAN?</strong>: {info.isQR ? "Yes" : "No"}</div>
                    <div className="flex items-center gap-2">
                        <strong>Country code</strong>: {info.countryCode}
                        <button
                            onClick={() => copyToClipboard(info.countryCode, "country")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "country" && <span className="text-green-500 text-xs">Copied</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>BBAN</strong>: <span className="font-bold">{info.bban}</span>
                        <button
                            onClick={() => copyToClipboard(info.bban, "bban")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "bban" && <span className="text-green-500 text-xs">Copied</span>}
                    </div>
                    <div className="flex items-center gap-2">
                        <strong>IBAN friendly format</strong>: <span className="font-bold">{info.friendlyFormat}</span>
                        <button
                            onClick={() => copyToClipboard(info.friendlyFormat, "friendly")}
                            className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <ClipboardDocumentCheckIcon className="w-4 h-4" />
                        </button>
                        {copiedField === "friendly" && <span className="text-green-500 text-xs">Copied</span>}
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

export default IBANValidatorParser;
