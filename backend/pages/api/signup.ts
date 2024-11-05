import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../utils/db';
import bcrypt from 'bcrypt';

interface SignupRequestBody {
  username: string;
  password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end(); // Respond to preflight request
    return;
  }

  // Set CORS headers for actual requests
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'POST') {
    const { username, password }: SignupRequestBody = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required.' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('your-database-name'); // replace with your actual database name
      const users = db.collection('users');

      // Check if the user already exists
      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: 'User already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert the new user
      await users.insertOne({
        username,
        password: hashedPassword,
      });

      return res.status(201).json({ message: 'User created successfully.' });
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error.' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'OPTIONS']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
