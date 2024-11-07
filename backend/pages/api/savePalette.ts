// pages/api/savePalette.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
  }

  const { palette } = req.body;
  if (!palette || !Array.isArray(palette)) {
    return res.status(400).json({ error: 'Invalid palette data' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('your-database-name'); // Replace with your actual database name
    const sessionsCollection = db.collection('sessions');

    // Find the username associated with the sessionId
    const session = await sessionsCollection.findOne({ sessionId });
    if (!session) {
      return res.status(401).json({ error: 'Session not found. Please log in.' });
    }

    const { username } = session;

    const palettesCollection = db.collection('palettes');

    // Insert palette data with username and timestamp
    await palettesCollection.insertOne({
      palette,
      username, // Save using the username
      createdAt: new Date(),
    });

    res.status(201).json({ success: true, message: 'Palette saved successfully.' });
  } catch (error) {
    console.error('Error saving palette:', error);
    res.status(500).json({ error: 'Failed to save palette' });
  }
}
