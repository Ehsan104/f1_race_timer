// src/components/F1RaceData.tsx
'use client';
import React, { useEffect } from 'react';
import Papa from 'papaparse';

interface Race {
  Date: string;
  Grand_Prix: string;
  Location: string;
}

interface F1RaceDataProps {
  setNextRaceDate: (date: string) => void;
  setNextRace: (race: string) => void;
  setFutureRaces: (races: Race[]) => void;
}

const F1RaceData: React.FC<F1RaceDataProps> = ({ setNextRaceDate, setNextRace, setFutureRaces }) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/calendar-f1-2024.csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvData = await response.text();
        console.log('CSV Data:', csvData);

        Papa.parse<Race>(csvData, {
          header: true,
          complete: (results) => {
            console.log('Parsed CSV data:', results.data);
            const futureRaces = results.data.filter(race => new Date(race.Date) > new Date());
            setFutureRaces(futureRaces);
            if (futureRaces.length > 0) {
              const nextRace = futureRaces[0];
              setNextRaceDate(nextRace.Date);
              setNextRace(`${nextRace.Grand_Prix} at ${nextRace.Location}`);
            }
          },
          error: (error: {message: string}) => {
            throw new Error(error.message);
          }
        });
      } catch (error: any) {
        console.error('Error fetching or parsing CSV data:', error);
      }
    };

    fetchData();
  }, [setNextRaceDate, setNextRace, setFutureRaces]);

  return null;
};

export default F1RaceData;
