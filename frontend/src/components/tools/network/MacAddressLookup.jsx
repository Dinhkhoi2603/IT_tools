import React, { useState } from "react";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const MacAddressLookup = () => {
    const [macAddress, setMacAddress] = useState("");
    const [vendorInfo, setVendorInfo] = useState(null);
    const [loading, setLoading] = useState(false);

    const isValidMac = (mac) => {
        return /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(mac);
    };

    const lookupMacAddress = async () => {
        if (!isValidMac(macAddress)) {
            alert("Invalid MAC Address format!");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/mac/${macAddress}`);
            if (!response.ok) throw new Error("MAC Address not found");

            const data = await response.json();
            if (data.length > 0) {
                setVendorInfo({
                    vendor: data[0].company || "Unknown",
                    address: `${data[0].addressL1 ?? ""}, ${data[0].addressL3 ?? ""}, ${data[0].country ?? ""}`,
                });
            } else {
                setVendorInfo({ vendor: "Unknown", address: "N/A" });
            }
        } catch (error) {
            setVendorInfo({ vendor: "Unknown", address: "N/A" });
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert("Copied: " + text);
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                MAC Address Lookup
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
                Find the vendor and manufacturer of a device by its MAC address.
            </p>
            <input
                type="text"
                value={macAddress}
                onChange={(e) => setMacAddress(e.target.value)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                placeholder="Enter MAC Address (e.g., 20:37:06:12:34:56)"
            />
            <button
                onClick={lookupMacAddress}
                className="mt-2 p-2 bg-blue-600 text-white rounded"
                disabled={loading}
            >
                {loading ? "Looking up..." : "Lookup"}
            </button>
            {vendorInfo && (
                <div className="mt-4 p-4 border rounded bg-gray-100 dark:bg-gray-700">
                    <p className="text-lg font-semibold">Vendor Info:</p>
                    <p>{vendorInfo.vendor}</p>
                    <p>{vendorInfo.address}</p>
                    <button
                        onClick={() => copyToClipboard(`${vendorInfo.vendor}, ${vendorInfo.address}`)}
                        className="mt-2 p-2 bg-gray-300 dark:bg-gray-600 rounded"
                    >
                        <ClipboardIcon className="h-5 w-5 inline" /> Copy Info
                    </button>
                </div>
            )}
        </div>
    );
};

export const toolMeta = {
    id: "mac-address-lookup",
    name: "Mac Address Lookup",
    description: "Find the vendor and manufacturer of a device by its MAC address.",
    category: "network",
    path: "/tools/network/mac-address-lookup",
    icon: ClipboardIcon,
};

export default MacAddressLookup;
