// pages/api/getSavedPalettes.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const sessionId = req.cookies.sessionId;
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized. Please log in.' });
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

    // Retrieve all palettes for the authenticated user using the username
    const palettes = await palettesCollection.find({ username }).toArray();
    res.status(200).json({ success: true, data: palettes });
  } catch (error) {
    console.error('Error retrieving palettes:', error);
    res.status(500).json({ error: 'Failed to retrieve palettes' });
  }
}
