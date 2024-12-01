import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import { paletteCollection, paletteDb } from "../../const";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username is required." });
  }

  try {
    const client = await clientPromise;
    const db = client.db(paletteDb);

    const palettesCollection = db.collection(paletteCollection);
    const palettes = await palettesCollection.find({ username }).toArray();

    return res.status(200).json({ success: true, data: palettes });
  } catch (error) {
    console.error("Error retrieving palettes:", error);
    return res.status(500).json({ error: "Failed to retrieve palettes" });
  }
}
