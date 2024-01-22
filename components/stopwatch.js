import { useState, useEffect } from 'react';

const Stopwatch = ({time, setTime}) => {
    const [isRunning, setIsRunning] = useState(true);

    useEffect(() => {
        let interval;

        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning]);

    const startStopHandler = () => {
        setIsRunning(!isRunning);
    };

    const resetHandler = () => {
        setIsRunning(false);
        setTime(0);
    };

    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    return (
        <div className={"underline decoration-yellow-400 underline-offset-4"}>
            <div className={"text-3xl font-bold"}>{formatTime(time)}</div>
        </div>
    );
};

export default Stopwatch;