import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import { paletteCollection, paletteDb } from "../../const";

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

  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { palette, username } = req.body;
  if (!palette || !Array.isArray(palette)) {
    return res.status(400).json({ error: "Invalid palette data" });
  }

  if (!username) {
    return res
      .status(400)
      .json({ error: "Username is required to save the palette" });
  }

  try {
    const client = await clientPromise;
    const db = client.db(paletteDb);
    const palettesCollection = db.collection(paletteCollection);

    await palettesCollection.insertOne({
      palette,
      username,
      createdAt: new Date(),
    });

    res
      .status(201)
      .json({ success: true, message: "Palette saved successfully." });
  } catch (error) {
    console.error("Error saving palette:", error);
    res.status(500).json({ error: "Failed to save palette" });
  }
}
