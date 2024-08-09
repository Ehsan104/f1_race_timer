'use client';
import React, { useState, useEffect } from 'react';
import F1RaceData from './F1RaceData';
import RaceCountdown from './RaceCountdown';
import './F1Component.css';

interface Race {
  Date: string;
  Grand_Prix: string;
  Location: string;
  Start_Time: string;
  Time_Zone: string;
}

const F1Component: React.FC = () => {
  const [nextRaceDate, setNextRaceDate] = useState<string | null>(null);
  const [nextRace, setNextRace] = useState<string | null>(null);
  const [nextTimeZone, setNextTimeZone] = useState<string | null>(null);
  const [futureRaces, setFutureRaces] = useState<Race[]>([]);

  const handleRaceEnd = () => {
    console.log('Race ended, fetching next race');
    if (futureRaces.length > 1) {
      const [, ...remainingRaces] = futureRaces;
      setFutureRaces(remainingRaces);
      const nextRace = remainingRaces[0];
      setNextRaceDate(`${nextRace.Date}T${nextRace.Start_Time}:00`);
      setNextRace(`${nextRace.Grand_Prix} at ${nextRace.Location}`);
      setNextTimeZone(nextRace.Time_Zone);
    } else {
      setNextRaceDate(null);
      setNextRace(null);
      setNextTimeZone(null);
    }
  };

  useEffect(() => {
    localStorage.setItem('nextRaceDate', nextRaceDate || '');
  }, [nextRaceDate]);

  return (
    <div className="f1-container">
      <h1 className="header">F1 Race Countdown</h1>
      <F1RaceData
        setNextRaceDate={(date: string) => setNextRaceDate(date)}
        setNextRace={setNextRace}
        setFutureRaces={setFutureRaces}
        setNextTimeZone={setNextTimeZone}
      />
      {nextRace && <h2 className="next-race">Next Race: {nextRace}</h2>}
      {nextRaceDate && nextTimeZone && (
        <RaceCountdown raceDate={nextRaceDate} timeZone={nextTimeZone} onRaceEnd={handleRaceEnd} />
      )}
      <div className="separator"></div>
      <div className="future-races">
        <h3>Future Races</h3>
        <ul>
          {futureRaces.slice(1).map((race, index) => (
            <li key={index}>
              {race.Grand_Prix} - {race.Date} 
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default F1Component;
