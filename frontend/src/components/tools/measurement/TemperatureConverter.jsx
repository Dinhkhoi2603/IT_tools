import React, { useState } from 'react';
import { FireIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: 'temperature-converter',
    name: 'Temperature Converter',
    description: 'Degrees temperature conversions for Kelvin, Celsius, Fahrenheit, Rankine, Delisle, Newton, Réaumur, and Rømer.',
    category: 'measure',
    path: '/tools/measure/temperature-converter',
    icon: FireIcon,
    order: 2,
};

const conversions = {
    kelvin: {
        toCelsius: (k) => k - 273.15,
        toFahrenheit: (k) => (k - 273.15) * 9/5 + 32,
        toRankine: (k) => k * 1.8,
        toDelisle: (k) => (373.15 - k) * 3/2,
        toNewton: (k) => (k - 273.15) * 33/100,
        toReaumur: (k) => (k - 273.15) * 4/5,
        toRomer: (k) => (k - 273.15) * 21/40 + 7.5,
    },
    from: {
        celsius: (c) => c + 273.15,
        fahrenheit: (f) => (f - 32) * 5/9 + 273.15,
        rankine: (r) => r * 5/9,
        delisle: (d) => 373.15 - d * 2/3,
        newton: (n) => n * 100/33 + 273.15,
        reaumur: (re) => re * 5/4 + 273.15,
        romer: (ro) => (ro - 7.5) * 40/21 + 273.15,
    },
};

const units = [
    { key: 'kelvin', label: 'Kelvin', symbol: 'K' },
    { key: 'celsius', label: 'Celsius', symbol: '°C' },
    { key: 'fahrenheit', label: 'Fahrenheit', symbol: '°F' },
    { key: 'rankine', label: 'Rankine', symbol: '°R' },
    { key: 'delisle', label: 'Delisle', symbol: '°De' },
    { key: 'newton', label: 'Newton', symbol: '°N' },
    { key: 'reaumur', label: 'Réaumur', symbol: '°Ré' },
    { key: 'romer', label: 'Rømer', symbol: '°Rø' },
];

const TemperatureConverter = () => {
    const [values, setValues] = useState({
        kelvin: 0,
        celsius: -273.15,
        fahrenheit: -459.67,
        rankine: 0,
        delisle: 559.72,
        newton: -90.14,
        reaumur: -218.52,
        romer: -135.91,
    });

    const updateAll = (fromUnit, inputValue) => {
        const k = fromUnit === 'kelvin' ? parseFloat(inputValue) : conversions.from[fromUnit](parseFloat(inputValue));
        const updated = {
            kelvin: k,
            celsius: conversions.kelvin.toCelsius(k),
            fahrenheit: conversions.kelvin.toFahrenheit(k),
            rankine: conversions.kelvin.toRankine(k),
            delisle: conversions.kelvin.toDelisle(k),
            newton: conversions.kelvin.toNewton(k),
            reaumur: conversions.kelvin.toReaumur(k),
            romer: conversions.kelvin.toRomer(k),
        };
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
                <FireIcon className="w-7 h-7 mr-2 text-brand-green" />
                Temperature Converter
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Degrees temperature conversions for Kelvin, Celsius, Fahrenheit, Rankine, Delisle, Newton, Réaumur, and Rømer.
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

export default TemperatureConverter;
