import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

export function generateSessionId() {
  return uuidv4();
}

export function createSessionCookie(sessionId: string) {
  const options = {
    maxAge: 60 * 60 * 24 * 365,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  };

  return serialize("sessionId", sessionId, options);
}
