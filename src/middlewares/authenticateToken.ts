import { Request, Response, NextFunction } from 'express';
import { tokenWordCount } from './rateLimit';

export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
  console.log('Authenticating token...');
  let token = req.headers['authorization']?.trim();

  // Check if the token starts with "Bearer " and strip it out if present
  if (token?.startsWith('Bearer ')) {
    token = token.slice(7); // Remove "Bearer " prefix
  }

  console.log("Provided token:", token);
  console.log("Current tokens in tokenWordCount:", tokenWordCount);

  if (!token) {
    console.log('No token provided');
    res.status(401).json({ error: 'Token is required' });
    return;
  }
  if (!(token in tokenWordCount)) {
    console.log('Invalid or expired token');
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
  console.log('Token authenticated successfully');
  req.body.token = token;
  next();
}
