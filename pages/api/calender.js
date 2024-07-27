// pages/api/calendar.js
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

export default function handler(req, res) {
  const filePath = path.join(process.cwd(), 'src/data/calendar-f1-2024.csv');
  const file = fs.readFileSync(filePath, 'utf8');

  Papa.parse(file, {
    header: true,
    complete: (results) => {
      res.status(200).json(results.data);
    },
    error: (error) => {
      res.status(500).json({ error: error.message });
    },
  });
}
