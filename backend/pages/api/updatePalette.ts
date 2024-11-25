// pages/api/updatePalette.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "PUT, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "PUT") {
    res.setHeader("Allow", ["PUT"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { paletteId } = req.query;
  const { palette, username } = req.body;

  if (!palette || !username || !paletteId) {
    return res.status(400).json({ error: "Missing required data" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("your-database-name");
    const palettesCollection = db.collection("palettes");

    const result = await palettesCollection.findOneAndUpdate(
      {
        _id: new ObjectId(paletteId as string),
        username: username,
      },
      {
        $set: {
          palette: palette,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    console.log(result);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Error updating palette:", error);
    res.status(500).json({ error: "Failed to update palette" });
  }
}
