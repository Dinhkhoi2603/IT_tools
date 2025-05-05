import { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "email-parser-validator",
    name: "Email Parser Validator",
    description: "Parse, validate and extract parts of an email address.",
    category: "data",
    path: "/tools/data/email-parser-validator",
    icon: EnvelopeIcon,
    order: 5,
};

const EmailParserValidator = () => {
    const [email, setEmail] = useState("");
    const [info, setInfo] = useState(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (email.trim() === "") {
            setInfo(null);
            return;
        }

        const fetchEmailInfo = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/email/parse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setInfo(data);
                } else {
                    const error = await response.text();
                    setInfo({ error });
                }
            } catch (error) {
                setInfo({ error: "Something went wrong!" });
            }
        };

        fetchEmailInfo();
    }, [email]);

    const copyToClipboard = () => {
        if (info?.email) {
            navigator.clipboard.writeText(info.email);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <EnvelopeIcon className="w-7 h-7 mr-2 text-blue-600" />
                Email Parser and Validator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Parse, validate and extract parts of an email address. Check if the format is correct and get domain info.
            </p>

            <div className="space-y-6 mb-6">
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Email Address</label>
                    <input
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address..."
                    />
                </div>
            </div>

            {info && !info.error && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-100">
                        <div><strong>Email</strong>: {info.email}</div>
                        <div><strong>Is valid?</strong>: {info.valid ? "Yes" : "No"}</div>
                        <div><strong>Username</strong>: {info.username}</div>
                        <div><strong>Domain</strong>: {info.domain}</div>
                        <div><strong>MX Records Found?</strong>: {info.hasMXRecord ? "Yes" : "No"}</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            Copy Email
                        </button>
                        {copied && (
                            <span className="ml-2 text-sm text-green-600 dark:text-green-400">Copied!</span>
                        )}
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

export default EmailParserValidator;
