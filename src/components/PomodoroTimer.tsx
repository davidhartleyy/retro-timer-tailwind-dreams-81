import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimerProps {}

const FlipDigit: React.FC<{ value: string; isFlipping: boolean }> = ({ value, isFlipping }) => {
  return (
    <div className="relative w-full h-full perspective-1000">
      <div className={`flip-card ${isFlipping ? 'flip' : ''}`}>
        <div className="flip-card-inner">
          <div className="flip-card-front">
            <div className="text-white text-7xl font-mono font-bold leading-none text-center">
              {value}
            </div>
          </div>
          <div className="flip-card-back">
            <div className="text-white text-7xl font-mono font-bold leading-none text-center">
              {value}
            </div>
          </div>
        </div>
      </div>
      {/* Horizontal divider line */}
      <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700 z-10"></div>
    </div>
  );
};

const Timer: React.FC<TimerProps> = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [prevTime, setPrevTime] = useState(30 * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initialTime = 30 * 60; // 30 minutes

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setPrevTime(timeLeft);
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Timer finished - play relaxing sound
      setIsActive(false);
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPrevTime(initialTime);
    setTimeLeft(initialTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return { mins, secs };
  };

  const { mins, secs } = formatTime(timeLeft);
  const { mins: prevMins, secs: prevSecs } = formatTime(prevTime);
  const progressPercentage = ((initialTime - timeLeft) / initialTime) * 100;

  // Check if digits should flip
  const shouldFlipMinsTens = Math.floor(mins / 10) !== Math.floor(prevMins / 10);
  const shouldFlipMinsOnes = (mins % 10) !== (prevMins % 10);
  const shouldFlipSecsTens = Math.floor(secs / 10) !== Math.floor(prevSecs / 10);
  const shouldFlipSecsOnes = (secs % 10) !== (prevSecs % 10);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Hidden audio element for relaxing sound */}
      <audio
        ref={audioRef}
        src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
        preload="auto"
      />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          {/* Progress indicator */}
          <div className="mb-12 flex flex-col items-center">
            <div className="w-64 h-2 bg-gray-700 rounded-full mb-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="text-amber-400 text-sm font-medium mb-4">
              {Math.round(progressPercentage)}% Complete
            </div>
          </div>

          {/* Flip Clock Display */}
          <div className="flex items-center justify-center mb-12 gap-4">
            {/* Minutes */}
            <div className="relative">
              <div className="bg-black border-4 border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-b from-gray-900 to-black p-8 min-w-[160px] h-40 flex">
                  {/* Minutes tens digit */}
                  <div className="flex-1 relative">
                    <FlipDigit 
                      value={Math.floor(mins / 10).toString()} 
                      isFlipping={shouldFlipMinsTens} 
                    />
                  </div>
                  {/* Minutes ones digit */}
                  <div className="flex-1 relative">
                    <FlipDigit 
                      value={(mins % 10).toString()} 
                      isFlipping={shouldFlipMinsOnes} 
                    />
                  </div>
                </div>
                {/* Bottom shadow for 3D effect */}
                <div className="h-2 bg-gradient-to-b from-gray-800 to-gray-900"></div>
              </div>
              <div className="text-amber-400 text-sm font-medium mt-3 text-center">MINUTES</div>
            </div>

            {/* Colon separator */}
            <div className="text-white text-6xl font-mono font-bold mx-4 animate-pulse">:</div>

            {/* Seconds */}
            <div className="relative">
              <div className="bg-black border-4 border-gray-800 rounded-lg shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-b from-gray-900 to-black p-8 min-w-[160px] h-40 flex">
                  {/* Seconds tens digit */}
                  <div className="flex-1 relative">
                    <FlipDigit 
                      value={Math.floor(secs / 10).toString()} 
                      isFlipping={shouldFlipSecsTens} 
                    />
                  </div>
                  {/* Seconds ones digit */}
                  <div className="flex-1 relative">
                    <FlipDigit 
                      value={(secs % 10).toString()} 
                      isFlipping={shouldFlipSecsOnes} 
                    />
                  </div>
                </div>
                {/* Bottom shadow for 3D effect */}
                <div className="h-2 bg-gradient-to-b from-gray-800 to-gray-900"></div>
              </div>
              <div className="text-amber-400 text-sm font-medium mt-3 text-center">SECONDS</div>
            </div>
          </div>

          {/* Timer Label */}
          <div className="mb-12">
            <div className="text-white text-2xl font-semibold mb-2">
              30-Minute Focus Timer
            </div>
            <div className="text-gray-400 text-sm">
              {timeLeft === 0 ? 'Time\'s up! Well done.' : 'Stay focused and productive'}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6">
            <Button
              onClick={toggleTimer}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-none shadow-xl rounded-full px-10 py-4 text-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              {isActive ? (
                <Pause className="w-6 h-6 mr-3" />
              ) : (
                <Play className="w-6 h-6 mr-3" />
              )}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            
            <Button
              onClick={resetTimer}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-gray-800 rounded-full px-8 py-4 text-lg font-semibold transition-all duration-200"
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              Reset
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;