'use client';
import React, { useEffect, useState } from 'react';
import { fromZonedTime, toZonedTime, formatInTimeZone } from 'date-fns-tz';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const calculateTimeRemaining = (raceDate: string, timeZone: string): TimeRemaining | null => {
  const now = new Date();

  // Convert now to the specified time zone
  const nowInZone = toZonedTime(now, timeZone);

  // Convert race date to a Date object in the specified time zone
  const raceDateObj = toZonedTime(new Date(raceDate), timeZone);

  const timeDifference = raceDateObj.getTime() - nowInZone.getTime();

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

const calculateProgress = (current: number, max: number): number => {
  return (current / max) * 100;
};

const CircularProgress = ({ value, max, label, color }: { value: number; max: number; label: string; color: string }) => {
  const progress = calculateProgress(value, max);
  const circleRadius = 45;
  const circumference = 2 * Math.PI * circleRadius;

  return (
    <div className="circular-timer">
      <svg className="progress-circle" width="120" height="120">
        <circle
          className="progress-circle-bg"
          stroke="grey"
          cx="60"
          cy="60"
          r={circleRadius}
          strokeWidth="10"
          fill="transparent"
        />
        <circle
          className="progress-circle-bar"
          stroke={color}
          cx="60"
          cy="60"
          r={circleRadius}
          strokeWidth="10"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={(1 - progress / 100) * circumference}
          strokeLinecap="round"
        />
      </svg>
      <div className="circle-label">
        <div className="circle-value">{value}</div>
        <div className="circle-text">{label}</div>
      </div>
    </div>
  );
};

interface RaceCountdownProps {
  raceDate: string; // This should include both the date and the time, e.g., '2024-08-25T06:00:00'
  timeZone: string;
  onRaceEnd: () => void;
}

const RaceCountdown: React.FC<RaceCountdownProps> = ({ raceDate, timeZone, onRaceEnd }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(calculateTimeRemaining(raceDate, timeZone));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const remainingTime = calculateTimeRemaining(raceDate, timeZone);
      if (!remainingTime) {
        clearInterval(intervalId);
        onRaceEnd();
      } else {
        setTimeRemaining(remainingTime);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [raceDate, timeZone, onRaceEnd]);

  if (!timeRemaining) {
    return <div>Race date is in the past or invalid</div>;
  }

  return (
    <div className="time-circles">
      <CircularProgress value={timeRemaining.days} max={365} label="Days" color="#ff4500" /> {/* Red for days */}
      <CircularProgress value={timeRemaining.hours} max={24} label="Hours" color="#f0ad4e" /> {/* Yellow for hours */}
      <CircularProgress value={timeRemaining.minutes} max={60} label="Minutes" color="#28a745" /> {/* Green for minutes */}
      <CircularProgress value={timeRemaining.seconds} max={60} label="Seconds" color="#007bff" /> {/* Blue for seconds */}
    </div>
  );
};

export default RaceCountdown;
