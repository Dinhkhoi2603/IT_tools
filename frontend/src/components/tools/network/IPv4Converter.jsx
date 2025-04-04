    import React, { useState,useEffect } from "react";
    import { ClipboardIcon } from "@heroicons/react/24/outline";

    // Component chính của Tool
    const IPv4Converter = () => {
        const [ip, setIp] = useState("192.168.1.1");
        const [decimal, setDecimal] = useState("");
        const [hexadecimal, setHexadecimal] = useState("");
        const [binary, setBinary] = useState("");
        const [ipv6, setIpv6] = useState("");
        const [ipv6Short, setIpv6Short] = useState("");
        useEffect(() => {
            convertIP(ip); // gọi chuyển đổi khi component mount
        }, []);
        // Xử lý chuyển đổi
        const convertIP = (input) => {
            const parts = input.split(".").map(Number);
            if (parts.length !== 4 || parts.some((p) => p < 0 || p > 255)) {
                return;
            }

            // Chuyển IPv4 thành Decimal
            const decimalValue =
                parts[0] * (256 ** 3) +
                parts[1] * (256 ** 2) +
                parts[2] * 256 +
                parts[3];

            // Chuyển IPv4 thành Hexadecimal
            const hexParts = parts.map((p) => p.toString(16).toUpperCase().padStart(2, "0"));
            const hexValue = hexParts.join("");

            // Chuyển IPv4 thành Binary
            const binValue = parts.map((p) => p.toString(2).padStart(8, "0")).join(".");

            // Chuyển IPv4 thành IPv6
            const ipv6Value = `0000:0000:0000:0000:0000:ffff:${hexParts[0]}${hexParts[1]}:${hexParts[2]}${hexParts[3]}`;
            const ipv6ShortValue = `::ffff:${(parts[0] << 8 | parts[1]).toString(16).padStart(4, "0")}:${(parts[2] << 8 | parts[3]).toString(16).padStart(4, "0")}`;

            setDecimal(decimalValue.toString());
            setHexadecimal(hexValue);
            setBinary(binValue);
            setIpv6(ipv6Value);
            setIpv6Short(ipv6ShortValue);
        };

        // Xử lý copy
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text);
            alert("Copied: " + text);
        };

        return (
            <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    IPv4 Address Converter
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Convert an IPv4 address into decimal, binary, hexadecimal, or an IPv6 representation.
                </p>

                <label className="block text-gray-700 dark:text-gray-300 mb-1">The IPv4 address:</label>
                <input
                    type="text"
                    value={ip}
                    onChange={(e) => {
                        setIp(e.target.value);
                        convertIP(e.target.value);
                    }}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                />

                {[{ label: "Decimal", value: decimal }, { label: "Hexadecimal", value: hexadecimal }, { label: "Binary", value: binary }, { label: "IPv6", value: ipv6 }, { label: "IPv6 (short)", value: ipv6Short }].map((item, index) => (
                    <div key={index} className="mt-4 flex items-center">
                        <label className="w-32 text-gray-800 dark:text-gray-300">{item.label}:</label>
                        <input
                            type="text"
                            readOnly
                            value={item.value}
                            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                        />
                        <button onClick={() => copyToClipboard(item.value)} className="ml-2 p-2">
                            <ClipboardIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    // Metadata của Tool
    export const toolMeta = {
        id: "ipv4-converter",
        name: "IPv4 Converter",
        description: "Convert an IPv4 address to decimal, binary, hexadecimal, and IPv6.",
        category: "network",
        path: "/tools/network/ipv4-converter",
        icon: ClipboardIcon,
    };

    export default IPv4Converter;
