// src/components/F1RaceData.tsx
'use client';
import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';

interface Race {
  Date: string;
  Grand_Prix: string;
  Location: string;
}

interface F1RaceDataProps {
  setNextRaceDate: (date: string) => void;
}

const F1RaceData: React.FC<F1RaceDataProps> = ({ setNextRaceDate }) => {
  const [data, setData] = useState<Race[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/data/calendar-f1-2024.csv');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const csvData = await response.text();

        Papa.parse<Race>(csvData, {
          header: true,
          complete: (results) => {
            console.log('Parsed CSV data:', results.data);
            setData(results.data);
            if (results.data.length > 0) {
              const nextRace = results.data.find(race => new Date(race.Date) > new Date());
              if (nextRace) {
                setNextRaceDate(nextRace.Date);
              }
            }
          },
          error: (error: any) => {
            throw new Error(error.message);
          }
        });
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchData();
  }, [setNextRaceDate]);

  return (
    <div>
      <h2>F1 Race Data</h2>
      {error ? (
        <p>Error fetching data: {error}</p>
      ) : data.length > 0 ? (
        <ul>
          {data.map((race, index) => (
            <li key={index}>{race.Location} - {race.Grand_Prix} - {race.Date}</li>
          ))}
        </ul>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default F1RaceData;
