import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import bcrypt from "bcrypt";
import { paletteDb, usersCollection } from "../../const";

interface SignupRequestBody {
  username: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.status(200).end();
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "POST") {
    const { username, password }: SignupRequestBody = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    try {
      const client = await clientPromise;
      const db = client.db(paletteDb);
      const users = db.collection(usersCollection);

      const existingUser = await users.findOne({ username });
      if (existingUser) {
        return res.status(409).json({ error: "User already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await users.insertOne({
        username,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
