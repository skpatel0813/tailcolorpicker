import { serialize } from 'cookie';
import { v4 as uuidv4 } from 'uuid';

// Helper function to generate a new session ID
export function generateSessionId() {
  return uuidv4();
}

// Function to create the session cookie
export function createSessionCookie(sessionId: string) {
  const options = {
    maxAge: 60 * 60 * 24 * 365, // 1 year in seconds
    httpOnly: true, // Can't be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    path: '/', // Available throughout the site
    sameSite: 'lax', // Prevents CSRF attacks
  };

  return serialize('sessionId', sessionId, options); // Session cookie named 'sessionId'
}
