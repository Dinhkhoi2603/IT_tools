import { useEffect, useState } from "react";
import { ClipboardDocumentCheckIcon, PhoneIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: "phone-parser-formatter",
    name: "Phone Parser and Formatter",
    description: "Parse, validate and format phone numbers.",
    category: "data",
    path: "/tools/data/phone-parser-formatter",
    icon: PhoneIcon,
    order: 4,
};

const countries = [
    { code: "VN", name: "Vietnam" },
    { code: "US", name: "United States" },
    { code: "JP", name: "Japan" },
    { code: "FR", name: "France" },
    { code: "DE", name: "Germany" },
];

const PhoneParserFormatter = () => {
    const [country, setCountry] = useState("VN");
    const [phone, setPhone] = useState("");
    const [copied, setCopied] = useState(false);
    const [info, setInfo] = useState(null);

    useEffect(() => {
        if (phone.trim() === "") {
            setInfo(null);
            return;
        }

        // Gửi request đến backend để phân tích số điện thoại
        const fetchPhoneInfo = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/phone/parse", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phone,
                        country,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setInfo(data);
                } else {
                    const error = await response.text();
                    setInfo({ error: error });
                }
            } catch (error) {
                setInfo({ error: "Something went wrong!" });
            }
        };

        fetchPhoneInfo();
    }, [phone, country]);

    const copyToClipboard = () => {
        if (info?.e164) {
            navigator.clipboard.writeText(info.e164);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <PhoneIcon className="w-7 h-7 mr-2 text-brand-green" />
                Phone Parser and Formatter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Parse, validate and format phone numbers. Get information about the phone number, like the country code, type, etc.
            </p>

            <div className="space-y-6 mb-6">
                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Default country code</label>
                    <select
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                    >
                        {countries.map((c) => (
                            <option key={c.code} value={c.code}>
                                {c.name} (+{c.code})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Phone number</label>
                    <input
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-100"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number..."
                    />
                </div>
            </div>

            {info && !info.error && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 dark:text-gray-100">
                        <div><strong>Country</strong>: {info.country}</div>
                        <div><strong>Country Name</strong>: {info.countryName}</div>
                        <div><strong>Country calling code</strong>: {info.callingCode}</div>
                        <div><strong>Is valid?</strong>: {info.isValid ? "Yes" : "No"}</div>
                        <div><strong>Is possible?</strong>: {info.isPossible ? "Yes" : "No"}</div>
                        <div><strong>Type</strong>: {info.type || "Unknown"}</div>
                        <div><strong>International format</strong>: {info.international}</div>
                        <div><strong>National format</strong>: {info.national}</div>
                        <div><strong>E.164 format</strong>: {info.e164}</div>
                        <div><strong>RFC3966 format</strong>: {info.rfc3966}</div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            <ClipboardDocumentCheckIcon className="w-5 h-5" />
                            Copy E.164
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

export default PhoneParserFormatter;
