// src/components/RaceCountdown.tsx
'use client';
import React, { useEffect, useState } from 'react';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeRemaining = (raceDate: string): TimeRemaining | null => {
  const now = new Date();
  const raceDateObj = new Date(raceDate);

  // Ensure the race date is valid
  if (isNaN(raceDateObj.getTime())) {
    console.error("Invalid date format");
    return null; // Invalid date
  }

  const timeDifference = raceDateObj.getTime() - now.getTime();

  // Check if the race date is in the past
  if (timeDifference <= 0) {
    console.error("Race date is in the past");
    return null;
  }

  // Calculate the time remaining
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

interface RaceCountdownProps {
  raceDate: string;
}

const RaceCountdown: React.FC<RaceCountdownProps> = ({ raceDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(calculateTimeRemaining(raceDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(raceDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [raceDate]);

  if (!timeRemaining) {
    return <div>Race date is in the past or invalid</div>;
  }

  return (
    <div className="text-center">
      <h1 className="text-xl font-bold">Next F1 Race Countdown</h1>
      <p className="text-lg">
        {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m {timeRemaining.seconds}s
      </p>
    </div>
  );
};

export default RaceCountdown;
