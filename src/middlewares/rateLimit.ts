import { Request, Response, NextFunction } from 'express';

// Updated structure for tokenWordCount to include date
interface TokenUsage {
  count: number;
  date: string;
}

export const tokenWordCount: { [token: string]: TokenUsage } = {};

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
  console.log('Checking rate limit...');

  const token = req.body.token;
  const words = req.body.text.split(/\s+/).length;
  const dailyLimit = 80000; // CHANGE TO TEST EASIER
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format

  // Initialize token data if it doesn't exist or if it's a new day
  if (!tokenWordCount[token] || tokenWordCount[token].date !== currentDate) {
    tokenWordCount[token] = { count: 0, date: currentDate };
    console.log(`Resetting count for token ${token} for the new day.`);
  }

  const currentUsage = tokenWordCount[token].count;
  console.log(`Current word usage for token ${token}: ${currentUsage} / ${dailyLimit}`);

  // Check if the token has exceeded the daily word limit
  if (currentUsage + words > dailyLimit) {
    console.log(`Daily word limit exceeded for token: ${token}`);
    res.status(402).json({ error: 'Daily word limit exceeded' });
    return;
  }

  // Update the token’s word count for the day
  tokenWordCount[token].count += words;
  console.log(`Token ${token} has used ${tokenWordCount[token].count} words today`);
  
  next();
}
