import React, { useState, useRef, useEffect,useCallback } from "react";
import Navbar from "../components/Navbar";
import ActionButton from "../components/ActionButton";  
import { FOCUS_DEFAULT, BREAK_DEFAULT } from "../assets/constants";




const RADIUS = 105; 
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const FocusTimer = () => {
  const [focusDuration, setFocusDuration] = useState(FOCUS_DEFAULT);
  const [breakDuration, setBreakDuration] = useState(BREAK_DEFAULT);
  const [isFocus, setIsFocus] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(FOCUS_DEFAULT);
  const [isRunning, setIsRunning] = useState(false);
  const [cycles, setCycles] = useState(0);
  const [shake, setShake] = useState(false);

  const intervalRef = useRef(null);

   const audioRef = useRef(null);

   useEffect(() => {
     audioRef.current = new Audio(
       "https://www.soundjay.com/button/sounds/button-3.mp3"
     );
   }, []);

   const playSound = useCallback(() => {
     if (audioRef.current) {
       audioRef.current.currentTime = 0;
       audioRef.current
         .play()
         .catch((e) => console.warn("Playback failed:", e));
     }
   }, []);
  // Timer logic
  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((sec) => {
        if (sec > 1) return sec - 1;
        // Timer complete
        clearInterval(intervalRef.current);
        setIsRunning(false);
        setShake(true);
        playSound();
        setTimeout(() => setShake(false), 1000);
        if (isFocus) {
          setCycles((c) => c + 1);
          setTimeout(() => {
            setIsFocus(false);
            setSecondsLeft(breakDuration);
            //setIsRunning(false);
          }, 1200);
        } else {
          setTimeout(() => {
            setIsFocus(true);
            setSecondsLeft(focusDuration);
           // setIsRunning(false);
          }, 1200);
        }
        return 0;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
   
  }, [isRunning, isFocus, focusDuration, breakDuration]);

  // Reset 
  useEffect(() => {
    if (isFocus) setSecondsLeft(focusDuration);
    else setSecondsLeft(breakDuration);
    setIsRunning(false);
    
  }, [focusDuration, breakDuration]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(isFocus ? focusDuration : breakDuration);
    setShake(false);
  };

 // custom durations
const handleDurationChange = useCallback(
  (type, value) => {
    const v = Math.max(1, Number(value));
    if (type === "focus") setFocusDuration(v * 60);
    else setBreakDuration(v * 60);
  },
  [setFocusDuration, setBreakDuration]
);
const pad = useCallback((n) => n.toString().padStart(2, "0"), []);

  const min = pad(Math.floor(secondsLeft / 60));
  const sec = pad(secondsLeft % 60);

  return (
    <>
      <Navbar />
      <div className="bg-secondary text-primarytext min-h-screen flex flex-col items-center justify-center">
        <div>
          <h1 className="text-3xl -mt-28 font-bold mb-6 ">
            Pomodoro Focus Timer
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-center">
          {/*  Clock  */}
          <div
            className={`relative w-56 h-56 flex items-center justify-center rounded-full shadow-lg bg-secondary bg-opacity-20 border-8 border-primary transition-all duration-300 ${
              shake ? "animate-shake" : ""
            }`}
          >
            <svg className="absolute 1top-2 -left-2" width="260" height="235">
              <circle
                cx="112"
                cy="118"
                r={RADIUS}
                stroke="#2563eb"
                strokeWidth="14"
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={
                  (secondsLeft / (isFocus ? focusDuration : breakDuration)) *
                    CIRCUMFERENCE || 0
                }
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <div className="z-10 flex flex-col items-center">
              <span className="text-5xl font-mono">
                {min}:{sec}
              </span>
              <span className="mt-2 text-lg font-semibold">
                {isFocus ? "Focus" : "Break"}
              </span>
            </div>
          </div>
          {/* Controls */}
          <div className="flex flex-col gap-4 items-center">
            <div className="flex gap-3">
              <ActionButton
                label="Start"
                onClick={handleStart}
                color="green"
                disabled={isRunning}
              />

              <ActionButton
                label="Pause"
                onClick={handlePause}
                color="yellow"
                disabled={!isRunning}
              />

              <ActionButton label="Reset" onClick={handleReset} color="red" />
            </div>
            {/* Custom durations */}
            <div className="flex  gap-4 items-center">
              <label>
                Focus&nbsp;
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={Math.floor(focusDuration / 60)}
                  onChange={(e) =>
                    handleDurationChange("focus", e.target.value)
                  }
                  className="w-14 text-black p-1 rounded border"
                />
                &nbsp;min
              </label>
              <label>
                Break&nbsp;
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={Math.floor(breakDuration / 60)}
                  onChange={(e) =>
                    handleDurationChange("break", e.target.value)
                  }
                  className="w-14 text-black p-1 rounded border"
                />
                &nbsp;min
              </label>
            </div>
            <div className="mt-4 text-lg">
              Pomodoro cycles today:{" "}
              <span className="font-bold text-primary">{cycles}</span>
            </div>
          </div>
        </div>
        {/* Animation CSS */}
        <style>
          {`
          @keyframes shake {
            0% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
            100% { transform: translateX(0); }
          }
          .animate-shake {
            animation: shake 0.7s;
          }
        `}
        </style>
      </div>
    </>
  );
};

export default FocusTimer;
