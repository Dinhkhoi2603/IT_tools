import React, { useState, useEffect } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const IPv4SubnetCalculator = () => {
    const [input, setInput] = useState("192.168.9.0/24");
    const [subnetInfo, setSubnetInfo] = useState({});

    useEffect(() => {
        calculateSubnet(input);
    }, []);

    const calculateSubnet = (cidrInput) => {
        const match = cidrInput.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\/(\d{1,2})$/);
        if (!match) return;

        const ipParts = match[1].split(".").map(Number);
        const prefix = parseInt(match[2], 10);
        if (ipParts.some(p => p < 0 || p > 255) || prefix < 0 || prefix > 32) return;

        const subnetMask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
        const maskParts = [(subnetMask >>> 24) & 255, (subnetMask >>> 16) & 255, (subnetMask >>> 8) & 255, subnetMask & 255];
        const wildcardParts = maskParts.map(p => 255 - p);
        const networkAddress = ipParts.map((p, i) => p & maskParts[i]);
        const broadcastAddress = networkAddress.map((p, i) => p | wildcardParts[i]);

        setSubnetInfo({
            "Netmask": `${networkAddress.join(".")}/${prefix}`,
            "Network address": networkAddress.join("."),
            "Network mask": maskParts.join("."),
            "Network mask in binary": maskParts.map(p => p.toString(2).padStart(8, "0")).join("."),
            "CIDR notation": `/${prefix}`,
            "Wildcard mask": wildcardParts.join("."),
            "Network size": Math.pow(2, 32 - prefix),
            "First address": networkAddress.join(".").replace(/\d+$/, n => +n + 1),
            "Last address": broadcastAddress.join(".").replace(/\d+$/, n => +n - 1),
            "Broadcast address": broadcastAddress.join("."),
            "IP class": ipParts[0] < 128 ? "A" : ipParts[0] < 192 ? "B" : "C",
        });
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                IPv4 Subnet Calculator
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
                Parse your IPv4 CIDR blocks and get subnet info.
            </p>

            <label className="block text-gray-700 dark:text-gray-300 mb-1">IPv4 CIDR:</label>
            <input
                type="text"
                value={input}
                onChange={(e) => {
                    setInput(e.target.value);
                    calculateSubnet(e.target.value);
                }}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />

            {subnetInfo["Netmask"] && (
                <div className="mt-4 rounded-lg">
                    {Object.entries(subnetInfo).map(([key, value], index) => (
                        <div key={index} className="mt-4 flex items-center">
                            <label className="w-40 text-gray-800 dark:text-gray-300 font-semibold">{key}:</label>
                            <input
                                type="text"
                                readOnly
                                value={value}
                                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                            />
                            <button onClick={() => copyToClipboard(value)} className="ml-2 p-2">
                                <ClipboardIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export const toolMeta = {
    id: "ipv4-subnet",
    name: "IPv4 Subnet",
    description: "Parse your IPv4 CIDR blocks and get all the info you need about your subnet.",
    category: "network",
    path: "/tools/network/ipv4-subnet",
    icon: ClipboardIcon,
};

export default IPv4SubnetCalculator;
