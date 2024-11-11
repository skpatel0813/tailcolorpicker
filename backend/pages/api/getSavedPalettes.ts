import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/db';  // Ensure that clientPromise connects to your MongoDB instance

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS setup for allowing requests from a specific frontend
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request (this is common with CORS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle non-GET methods by returning a 405 error
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  // Get the username from the query string (this is passed from the frontend)
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db('your-database-name'); // Replace with your actual database name

    // Retrieve the user's saved palettes based on the provided username
    const palettesCollection = db.collection('palettes');
    const palettes = await palettesCollection.find({ username }).toArray();

    // Respond with the palettes for the provided username
    return res.status(200).json({ success: true, data: palettes });
  } catch (error) {
    console.error('Error retrieving palettes:', error);
    return res.status(500).json({ error: 'Failed to retrieve palettes' });
  }
}
