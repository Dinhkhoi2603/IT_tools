import React, { useState, useEffect } from 'react';
import { CalculatorIcon, ClipboardDocumentIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';
import { evaluate } from 'mathjs';

// Tool metadata for discovery system
export const toolMeta = {
    id: 'math-evaluator',
    name: 'Math Evaluator',
    description: 'Evaluate math expressions from input text',
    category: 'math',
    path: '/tools/math/evaluator',
    icon: CalculatorIcon,
    order: 3,
};

const MathEvaluator = () => {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const timeout = copied ? setTimeout(() => setCopied(false), 1500) : null;
        return () => clearTimeout(timeout);
    }, [copied]);

    useEffect(() => {
        try {
            if (expression.trim() === '') {
                setResult('');
                return;
            }

            // Evaluate expression safely
            // NOTE: In real-world usage, consider using a library like math.js for better safety
            const evalResult = evaluate(expression); // eslint-disable-line no-eval
            setResult(evalResult.toString());
        } catch (err) {
            setResult('Error: Invalid expression');
        }
    }, [expression]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
        } catch (err) {
            console.error('Failed to copy result: ', err);
        }
    };

    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
                <CalculatorIcon className="h-6 w-6 mr-2" />
                Math Evaluator
            </h2>

            <div className="mb-4">
                <label htmlFor="expression" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Math Expression
                </label>
                <input
                    id="expression"
                    type="text"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-brand-green focus:border-brand-green bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={expression}
                    onChange={(e) => setExpression(e.target.value)}
                    placeholder="e.g. 5 + 7 * (3 - 2)"
                />
            </div>

            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase">Result</span>
                    {result && result !== 'Error: Invalid expression' && (
                        <button
                            onClick={handleCopy}
                            className="text-gray-500 hover:text-brand-green dark:text-gray-400 dark:hover:text-green-400"
                        >
                            {copied ? (
                                <ClipboardDocumentCheckIcon className="h-5 w-5" />
                            ) : (
                                <ClipboardDocumentIcon className="h-5 w-5" />
                            )}
                        </button>
                    )}
                </div>
                <div className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600 overflow-x-auto">
                    <code className="text-gray-800 dark:text-gray-200 break-all">{result || '-'}</code>
                </div>
            </div>
        </div>
    );
};

export default MathEvaluator;
