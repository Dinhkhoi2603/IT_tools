import React, { useState, useEffect } from "react";
import { CalculatorIcon } from "@heroicons/react/24/outline";

const MatrixInput = ({ matrix, setMatrix, rows, cols, title }) => {
    const handleChange = (rowIndex, colIndex, value) => {
        const newMatrix = matrix.map((row, rIdx) =>
            row.map((col, cIdx) =>
                rIdx === rowIndex && cIdx === colIndex ? parseFloat(value) || 0 : col
            )
        );
        setMatrix(newMatrix);
    };

    return (
        <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <div className="grid gap-2">
                {matrix.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2">
                        {row.map((value, colIndex) => (
                            <input
                                key={colIndex}
                                type="text"
                                className="w-16 h-10 border border-gray-300 rounded px-2 text-center"
                                value={value}
                                onChange={(e) =>
                                    handleChange(rowIndex, colIndex, e.target.value)
                                }
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const createEmptyMatrix = (rows, cols) =>
    Array.from({ length: rows }, () => Array(cols).fill(0));

const MatrixCalculator = () => {
    const [rows, setRows] = useState(2);
    const [cols, setCols] = useState(2);
    const [matrixA, setMatrixA] = useState(createEmptyMatrix(2, 2));
    const [matrixB, setMatrixB] = useState(createEmptyMatrix(2, 2));
    const [result, setResult] = useState([]);
    const [operation, setOperation] = useState(null);

    useEffect(() => {
        setMatrixA(createEmptyMatrix(rows, cols));
        setMatrixB(createEmptyMatrix(rows, cols));
        setResult([]);
    }, [rows, cols]);

    const calculate = (op) => {
        let res = [];

        if (op === "add" || op === "subtract") {
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    row.push(
                        op === "add"
                            ? matrixA[i][j] + matrixB[i][j]
                            : matrixA[i][j] - matrixB[i][j]
                    );
                }
                res.push(row);
            }
        }

        if (op === "multiply") {
            if (cols !== rows) {
                alert("Số cột của A phải bằng số hàng của B để nhân!");
                return;
            }
            for (let i = 0; i < rows; i++) {
                const row = [];
                for (let j = 0; j < cols; j++) {
                    let sum = 0;
                    for (let k = 0; k < cols; k++) {
                        sum += matrixA[i][k] * matrixB[k][j];
                    }
                    row.push(sum);
                }
                res.push(row);
            }
        }

        setOperation(op);
        setResult(res);
    };

    const operationSymbol = {
        add: "+",
        subtract: "-",
        multiply: "×",
    };

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <CalculatorIcon className="w-6 h-6" />
                Tính Toán Ma Trận
            </h1>

            <div className="flex items-center mb-6 gap-4">
                <label>Chọn kích thước:</label>
                <select
                    value={rows}
                    onChange={(e) => {
                        setRows(Number(e.target.value));
                        setCols(Number(e.target.value));
                    }}
                    className="border px-2 py-1 rounded"
                >
                    {[2, 3, 4, 5].map((size) => (
                        <option key={size} value={size}>
                            {size} x {size}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <MatrixInput
                    title="Ma trận A"
                    matrix={matrixA}
                    setMatrix={setMatrixA}
                    rows={rows}
                    cols={cols}
                />

                <div className="flex flex-col gap-3">
                    <button
                        className="bg-gradient-to-b from-green-400 to-green-600 text-white px-4 py-2 rounded hover:from-green-500 hover:to-green-700 transition"
                        onClick={() => calculate("add")}
                    >
                        A + B
                    </button>
                    <button
                        className="bg-gradient-to-b from-green-400 to-green-600 text-white px-4 py-2 rounded hover:from-green-500 hover:to-green-700 transition"
                        onClick={() => calculate("subtract")}
                    >
                        A - B
                    </button>
                    <button
                        className="bg-gradient-to-b from-green-400 to-green-600 text-white px-4 py-2 rounded hover:from-green-500 hover:to-green-700 transition"
                        onClick={() => calculate("multiply")}
                    >
                        A × B
                    </button>
                </div>



                <MatrixInput
                    title="Ma trận B"
                    matrix={matrixB}
                    setMatrix={setMatrixB}
                    rows={rows}
                    cols={cols}
                />
            </div>

            {result.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-2">
                        Kết quả (A {operationSymbol[operation]} B):
                    </h2>
                    <div className="grid gap-2">
                        {result.map((row, rowIndex) => (
                            <div key={rowIndex} className="flex gap-2">
                                {row.map((value, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className="w-16 h-10 border border-gray-300 rounded flex items-center justify-center bg-gray-100"
                                    >
                                        {value}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export const toolMeta = {
    id: "matrix-calculator",
    name: "Matrix Calculator",
    description: "Calculator for matrix operations: addition, subtraction, multiplication",
    category: "math",
    path: "/tools/math/matrix-calculator",
    icon: CalculatorIcon,
    order: 3,
};

export default MatrixCalculator;
