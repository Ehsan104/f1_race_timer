// src/components/F1Component.tsx
'use client';
import React, { useState } from 'react';
import F1RaceData from './F1RaceData';
import RaceCountdown from './RaceCountdown';

const F1Component: React.FC = () => {
  const [nextRaceDate, setNextRaceDate] = useState<string | null>(null);

  return (
    <div>
      <h1>F1 Race Countdown</h1>
      <F1RaceData setNextRaceDate={setNextRaceDate} />
      {nextRaceDate ? (
        <RaceCountdown raceDate={nextRaceDate} />
      ) : (
        <p>No upcoming races found</p>
      )}
    </div>
  );
};

export default F1Component;
