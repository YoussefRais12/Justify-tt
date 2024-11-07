import { Request, Response, NextFunction } from 'express';

export const tokenWordCount: { [token: string]: number } = {};

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  console.log('Checking rate limit...');
  const token = req.body.token;
  const words = req.body.text.split(/\s+/).length;

  const currentUsage = tokenWordCount[token] || 0;
  const dailyLimit = 80000;
  console.log(`Current word usage for token ${token}: ${currentUsage} / ${dailyLimit}`);

  if (currentUsage + words > dailyLimit) {
    console.log(`Daily word limit exceeded for token: ${token}`);
    res.status(402).json({ error: 'Daily word limit exceeded' });
    return;
  }

  tokenWordCount[token] = currentUsage + words;
  console.log(`Token ${token} has used ${tokenWordCount[token]} words today`);
  next();
}
