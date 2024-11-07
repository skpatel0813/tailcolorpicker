// pages/api/login.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/db';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { generateSessionId } from '../../utils/session';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('your-database-name'); // Replace with your actual database name
      const users = db.collection('users');

      // Find the user by username
      const user = await users.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid username or password.' });
      }

      // Generate a session ID and store it in MongoDB
      const sessionId = generateSessionId();
      await db.collection('sessions').insertOne({
        sessionId,
        username: user.username,
        createdAt: new Date(),
      });

      // Set the session cookie
      res.setHeader('Set-Cookie', serialize('sessionId', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      }));

      return res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
