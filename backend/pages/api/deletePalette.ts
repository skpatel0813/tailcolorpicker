// pages/api/deletePalette.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../utils/db";
import { ObjectId } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
  res.setHeader("Access-Control-Allow-Methods", "DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "DELETE") {
    res.setHeader("Allow", ["DELETE"]);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { paletteId, username } = req.query;

  if (!paletteId) {
    return res.status(400).json({ error: "Palette ID is required" });
  }

  if (!username) {
    return res
      .status(400)
      .json({ error: "Username is required to delete the palette" });
  }

  try {
    const client = await clientPromise;
    const db = client.db("your-database-name"); // Replace with your actual database name
    const palettesCollection = db.collection("palettes");

    // Ensure the user can only delete their own palettes
    const result = await palettesCollection.deleteOne({
      _id: new ObjectId(paletteId as string),
      username: username,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        error: "Palette not found or you do not have permission to delete it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Palette deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting palette:", error);
    res.status(500).json({ error: "Failed to delete palette" });
  }
}