import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import RaceCountdown from './RaceCountdown';

export function F1Component() {
  const [raceInfo, setRaceInfo] = useState({ title: '', location: '', date: '' });

  useEffect(() => {
    async function fetchRaceInfo() {
      try {
        const response = await fetch('/calender-f1-2024.csv');
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data as { GrandPrix: string, Location: string, Date: string }[];
        if (parsedData && parsedData.length > 0) {
          const nextRace = parsedData[0]; // Assuming the first row is the next race
          setRaceInfo({ title: nextRace.GrandPrix, location: nextRace.Location, date: nextRace.Date });
        }
      } catch (error) {
        console.error('Failed to fetch race data:', error);
      }
    }
    fetchRaceInfo();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-primary-foreground">{raceInfo.title}</h2>
        <p className="text-lg text-secondary-foreground">{raceInfo.location}</p>
        <div className="bg-background p-8 rounded-lg shadow-lg">
          <RaceCountdown raceDate={new Date(raceInfo.date)} />
        </div>
      </div>
    </div>
  );
}