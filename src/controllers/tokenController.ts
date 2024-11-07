import { Request, Response } from 'express';
import { generateToken } from '../utils/generateToken';
import { tokenWordCount } from '../middlewares/rateLimit';

export function generateTokenController(req: Request, res: Response): void {
  const { email } = req.body;
  console.log(`Request received to generate token for email: ${email}`);
  if (!email) {
    console.log('Email not provided');
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const token = generateToken(email);
  tokenWordCount[token] = 0;
  console.log("Token stored in tokenWordCount after generation:", tokenWordCount);

  res.json({ token });
}
