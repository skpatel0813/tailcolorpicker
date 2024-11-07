// utils/session.ts
import { serialize } from 'cookie';
import { v4 as uuidv4 } from 'uuid';

interface CookieOptions {
  httpOnly?: boolean;
  secure?: boolean;
  path?: string;
  sameSite?: 'strict' | 'lax' | 'none';
}

export function createSessionCookie(sessionId: string) {
  const options = {
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
  };

  return serialize('session_id', sessionId, options);
}


// Helper function to create a new session ID
export function generateSessionId() {
  return uuidv4();
}
