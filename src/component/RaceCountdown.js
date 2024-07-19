import React, { useState, useEffect } from 'react';

const calculateTimeRemaining = (raceDate) => {
  const now = new Date();
  const timeDifference = raceDate - now;

  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
};

const RaceCountdown = ({ raceDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining(raceDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(raceDate));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [raceDate]);

  if (!timeRemaining) {
    return <div>Loading...</div>;
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