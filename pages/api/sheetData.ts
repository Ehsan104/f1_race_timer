import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'creds.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: '1I2tPSslrHlhyZ_QZf4w8YX78QCAwWjUbLmfMdJmlvfI',
      range: 'calender-f1-2024!A1:C25',
    });

    res.status(200).json(response.data.values);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
