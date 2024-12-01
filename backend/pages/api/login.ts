import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { generateSessionId } from "../../utils/session";
import { paletteDb, usersCollection } from "../../const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "POST") {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required." });
    }

    try {
      const client = await clientPromise;
      const db = client.db(paletteDb);
      const users = db.collection(usersCollection);

      const user = await users.findOne({ username });
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid username or password." });
      }

      const sessionId = generateSessionId();
      await db.collection("sessions").insertOne({
        sessionId,
        username: user.username,
        createdAt: new Date(),
      });

      res.setHeader("Set-Cookie", [
        serialize("sessionId", sessionId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        }),
        serialize("username", username, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "Lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        }),
      ]);

      return res.status(200).json({ message: "Login successful." });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    res.setHeader("Allow", ["POST", "OPTIONS"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
