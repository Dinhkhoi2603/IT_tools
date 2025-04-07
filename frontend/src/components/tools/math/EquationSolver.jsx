import React, { useState } from 'react';
import { CalculatorIcon } from '@heroicons/react/24/outline';

const EquationSolver = () => {
    const [degree, setDegree] = useState(2);
    const [coefficients, setCoefficients] = useState({});
    const [roots, setRoots] = useState([]);
    const [error, setError] = useState('');

    const handleInputChange = (index, value) => {
        setCoefficients({
            ...coefficients,
            [index]: parseFloat(value) || 0,
        });
    };

    const renderEquationInput = () => {
        const elements = [];
        for (let i = degree; i >= 0; i--) {
            elements.push(
                <div key={i} className="flex items-center space-x-1">
                    <input
                        type="text"
                        className="w-20 p-1 border rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center"
                        value={coefficients[i] || ''} // Đặt giá trị của ô nhập
                        onChange={(e) => handleInputChange(i, e.target.value)}
                        placeholder={`a${i}`}
                    />
                    {i > 1 && <span className="text-lg text-gray-800 dark:text-white">x<sup>{i}</sup></span>}
                    {i === 1 && <span className="text-lg text-gray-800 dark:text-white">x</span>}
                    {i !== 0 && <span className="text-lg text-gray-800 dark:text-white">+</span>}
                </div>
            );
        }
        elements.push(
            <span key="equals" className="text-lg text-gray-800 dark:text-white ml-1">= 0</span>
        );
        return (
            <div className="flex flex-wrap items-center gap-2 mb-4">
                {elements}
            </div>
        );
    };

    const solve = () => {
        setError('');
        setRoots([]);

        const coeffs = [];
        for (let i = degree; i >= 0; i--) {
            coeffs.push(coefficients[i] || 0);
        }

        try {
            if (degree === 1) {
                const [a, b] = coeffs;
                if (a === 0) throw new Error("Không phải phương trình bậc nhất");
                const x = -b / a;
                setRoots([`x = ${x}`]);
            } else if (degree === 2) {
                const [a, b, c] = coeffs;
                if (a === 0) throw new Error("Không phải phương trình bậc hai");
                const delta = b * b - 4 * a * c;
                if (delta < 0) {
                    setRoots(['Vô nghiệm']);
                } else if (delta === 0) {
                    const x = -b / (2 * a);
                    setRoots([`x = ${x}`]);
                } else {
                    const sqrtDelta = Math.sqrt(delta);
                    const x1 = (-b + sqrtDelta) / (2 * a);
                    const x2 = (-b - sqrtDelta) / (2 * a);
                    setRoots([`x₁ = ${x1}`, `x₂ = ${x2}`]);
                }
            } else if (degree === 3) {
                const [a, b, c, d] = coeffs;
                if (a === 0) throw new Error("Không phải phương trình bậc ba");
                const roots = solveCubic(a, b, c, d);
                setRoots(roots);
            } else if (degree === 4) {
                const [a, b, c, d, e] = coeffs;
                if (a === 0) throw new Error("Không phải phương trình bậc tư");
                const roots = solveQuartic(a, b, c, d, e);
                setRoots(roots);
            } else {
                setRoots(['Chưa hỗ trợ giải bậc ≥ 5']);
            }
        } catch (err) {
            setError(err.message);
        }
    };

    const solveCubic = (a, b, c, d) => {
        const f = ((3 * c / a) - ((b * b) / (a * a))) / 3;
        const g = ((2 * b * b * b) / (a * a * a) - (9 * b * c) / (a * a) + (27 * d / a)) / 27;
        const h = (g * g) / 4 + (f * f * f) / 27;

        if (h > 0) {
            // Một nghiệm thực
            const r = -(g / 2) + Math.sqrt(h);
            const s = Math.cbrt(r);
            const t = -(g / 2) - Math.sqrt(h);
            const u = Math.cbrt(t);
            const x = (s + u) - (b / (3 * a));
            return [`x = ${x}`];
        } else if (f === 0 && g === 0 && h === 0) {
            // Tất cả các nghiệm đều bằng nhau
            const x = -Math.cbrt(d / a);
            return [`x = ${x}`];
        } else {
            // Ba nghiệm thực
            const i = Math.sqrt((g * g) / 4 - h);
            const j = Math.cbrt(i);
            const k = Math.acos(-(g / (2 * i)));
            const l = -j;
            const m = Math.cos(k / 3);
            const n = Math.sqrt(3) * Math.sin(k / 3);
            const p = -(b / (3 * a));
            const x1 = 2 * j * m + p;
            const x2 = l * (m + n) + p;
            const x3 = l * (m - n) + p;
            return [`x₁ = ${x1}`, `x₂ = ${x2}`, `x₃ = ${x3}`];
        }
    };

    const solveQuartic = (a, b, c, d, e) => {
        const a1 = b / a;
        const a2 = c / a;
        const a3 = d / a;
        const a4 = e / a;

        const Q = (3 * a2 - a1 * a1) / 9;
        const R = (9 * a1 * a2 - 27 * a3 - 2 * a1 * a1 * a1) / 54;
        const D = Q * Q * Q + R * R;

        let roots = [];

        if (D > 0) {
            const S = Math.cbrt(R + Math.sqrt(D));
            const T = Math.cbrt(R - Math.sqrt(D));
            const x1 = -a1 / 3 + (S + T);
            roots.push(`x₁ = ${x1}`);
            // Tìm nghiệm còn lại
            const x2 = -1 / 2 * (S + T) - a1 / 3;
            const x3 = Math.sqrt(S * T) * Math.sqrt(-Q) + x2;
            const x4 = -Math.sqrt(S * T) * Math.sqrt(-Q) + x2;
            roots.push(`x₂ = ${x2}`, `x₃ = ${x3}`, `x₄ = ${x4}`);
        } else if (D === 0) {
            const S = Math.cbrt(R);
            const x1 = -a1 / 3 + 2 * S;
            const x2 = -a1 / 3 - S;
            roots.push(`x₁ = ${x1}`, `x₂ = ${x2}`);
        } else {
            const theta = Math.acos(R / Math.sqrt(-Q * -Q * -Q));
            const x1 = 2 * Math.sqrt(-Q) * Math.cos(theta / 3) - a1 / 3;
            const x2 = 2 * Math.sqrt(-Q) * Math.cos((theta + 2 * Math.PI) / 3) - a1 / 3;
            const x3 = 2 * Math.sqrt(-Q) * Math.cos((theta + 4 * Math.PI) / 3) - a1 / 3;
            roots.push(`x₁ = ${x1}`, `x₂ = ${x2}`, `x₃ = ${x3}`);
        }

        return roots;
    };

    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white flex items-center">
                <CalculatorIcon className="h-8 w-8 mr-2" />
                Giải Phương Trình
            </h2>

            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Chọn bậc phương trình:
                </label>
                <select
                    value={degree}
                    onChange={(e) => {
                        const newDegree = parseInt(e.target.value);
                        setDegree(newDegree);
                        setCoefficients({}); // Reset coefficients
                        setRoots([]); // Clear roots
                        setError(''); // Clear error
                    }}
                    className="p-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {[1, 2, 3, 4].map((d) => (
                        <option key={d} value={d}>Bậc {d}</option>
                    ))}
                </select>
            </div>

            <div className="mb-6">
                {renderEquationInput()}
            </div>

            <button
                onClick={solve}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 ease-in-out"
            >
                Giải phương trình
            </button>

            <div className="mt-6">
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                {roots.length > 0 && (
                    <ul className="list-disc list-inside text-gray-800 dark:text-white mt-2">
                        {roots.map((r, idx) => (
                            <li key={idx} className="mt-1">{r}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export const toolMeta = {
    id: 'equation-solver',
    name: 'Equation Solver',
    description: 'Giải phương trình bậc n từ hệ số',
    category: 'math',
    path: '/tools/math/equation-solver',
    icon: CalculatorIcon,
    order: 3,
};

export default EquationSolver;
