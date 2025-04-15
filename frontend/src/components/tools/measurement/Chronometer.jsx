import React, { useEffect, useRef, useState } from "react";
import { ClockIcon, PlayIcon, PauseIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export const toolMeta = {
    id: 'chronometer',
    name: 'Chronometer',
    description: 'Monitor the duration of a thing. Basically a chronometer with simple chronometer features.',
    category: 'measure',
    path: '/tools/measure/chronometer',
    icon: ClockIcon,
    order: 2,
};

const Chronometer = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - elapsedTime;
            timerRef.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }

        return () => clearInterval(timerRef.current);
    }, [isRunning]);

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = Math.floor((time % 60000) / 1000);
        const milliseconds = time % 1000;
        return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(milliseconds).padStart(3, "0")}`;
    };

    const handleStartStop = () => {
        setIsRunning((prev) => !prev);
    };

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
            <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-1 flex items-center">
                <ClockIcon className="w-7 h-7 mr-2 text-brand-green" />
                Chronometer
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Monitor the duration of a thing. Basically a chronometer with simple chronometer features.
            </p>

            <div className="flex justify-center items-center mb-6">
                <div className="text-6xl font-mono text-gray-800 dark:text-white">
                    {formatTime(elapsedTime)}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <button
                    onClick={handleStartStop}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition ${
                        isRunning
                            ? "bg-red-100 text-red-600 hover:bg-red-200"
                            : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                >
                    {isRunning ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
                    {isRunning ? "Pause" : "Start"}
                </button>
                <button
                    onClick={handleReset}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 hover:bg-gray-300 px-6 py-2 rounded-lg font-medium transition"
                >
                    <ArrowPathIcon className="w-5 h-5" />
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Chronometer;
