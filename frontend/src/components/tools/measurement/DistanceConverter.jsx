import React, { useState } from 'react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline'

export const toolMeta = {
    id: 'distance-converter',
    name: 'Distance Converter',
    description: 'Convert between meters, kilometers, miles, feet, inches, and more.',
    category: 'measure',
    path: '/tools/measure/distance-converter',
    icon: ArrowsPointingOutIcon ,
    order: 3,
};

const units = [
    { key: 'meter', label: 'Meter', symbol: 'm' },
    { key: 'kilometer', label: 'Kilometer', symbol: 'km' },
    { key: 'mile', label: 'Mile', symbol: 'mi' },
    { key: 'yard', label: 'Yard', symbol: 'yd' },
    { key: 'foot', label: 'Foot', symbol: 'ft' },
    { key: 'inch', label: 'Inch', symbol: 'in' },
    { key: 'nauticalMile', label: 'Nautical Mile', symbol: 'nmi' },
];

const conversionToMeter = {
    meter: 1,
    kilometer: 1000,
    mile: 1609.34,
    yard: 0.9144,
    foot: 0.3048,
    inch: 0.0254,
    nauticalMile: 1852,
};

const DistanceConverter = () => {
    const [values, setValues] = useState(() => {
        const initial = {};
        units.forEach((unit) => {
            initial[unit.key] = unit.key === 'meter' ? 1 : 0;
        });
        return initial;
    });

    const updateAll = (fromUnit, value) => {
        const meterValue = parseFloat(value) * conversionToMeter[fromUnit];
        const updated = {};
        units.forEach((unit) => {
            updated[unit.key] = +(meterValue / conversionToMeter[unit.key]).toFixed(6);
        });
        setValues(updated);
    };

    const handleKeyDown = (e, key) => {
        if (e.key === 'Enter') {
            updateAll(key, e.target.value);
        }
    };

    const handleChange = (e, key) => {
        setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <ArrowsPointingOutIcon className="w-7 h-7 mr-2 text-brand-green" />
                Distance Converter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Convert distances between meters, kilometers, miles, yards, feet, inches, and nautical miles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {units.map((unit) => (
                    <div
                        key={unit.key}
                        className="flex flex-col sm:flex-row sm:items-center bg-gray-50 dark:bg-gray-800 p-3 rounded-lg shadow-sm"
                    >
                        <label className="w-full sm:w-32 text-gray-700 dark:text-gray-300 font-medium mb-2 sm:mb-0">
                            {unit.label}
                        </label>
                        <input
                            type="number"
                            className="flex-grow p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-right text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-green"
                            value={values[unit.key]}
                            onChange={(e) => handleChange(e, unit.key)}
                            onKeyDown={(e) => handleKeyDown(e, unit.key)}
                        />
                        <span className="w-16 text-center mt-2 sm:mt-0 text-gray-500 dark:text-gray-400">
              {unit.symbol}
            </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DistanceConverter;
