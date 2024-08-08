'use client';
import React, { useEffect } from 'react';
import Papa from 'papaparse';

interface Race {
  Date: string;
  Grand_Prix: string;
  Location: string;
  Start_Time: string;
  Time_Zone: string;
}

interface F1RaceDataProps {
  setNextRaceDate: (date: string) => void;
  setNextRace: (race: string) => void;
  setFutureRaces: (races: Race[]) => void;
  setNextTimeZone: (timeZone: string) => void;
}

const F1RaceData: React.FC<F1RaceDataProps> = ({
  setNextRaceDate,
  setNextRace,
  setFutureRaces,
  setNextTimeZone,
}) => {
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
            const futureRaces = results.data.filter(race => new Date(`${race.Date}T${race.Start_Time}:00`) > new Date());
            setFutureRaces(futureRaces);
            if (futureRaces.length > 0) {
              const nextRace = futureRaces[0];
              setNextRaceDate(`${nextRace.Date}T${nextRace.Start_Time}:00`);
              setNextRace(`${nextRace.Grand_Prix} at ${nextRace.Location}`);
              setNextTimeZone(nextRace.Time_Zone);
            }
          },
          error: (error: { message: string }) => {
            throw new Error(error.message);
          }
        });
      } catch (error: any) {
        console.error('Error fetching or parsing CSV data:', error);
      }
    };

    fetchData();
  }, [setNextRaceDate, setNextRace, setFutureRaces, setNextTimeZone]);

  return null;
};

export default F1RaceData;
