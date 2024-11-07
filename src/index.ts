import express from 'express';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store for rate limiting (not persistent, resets when server restarts)
const tokenWordCount: { [token: string]: number } = {};

// Function to generate a unique token based on email
function generateToken(email: string): string {
  console.log(`Generating token for email: ${email}`);
  const token = crypto.createHash('sha256').update(email + Date.now().toString()).digest('hex');
  console.log(`Generated token: ${token}`);
  return token;
}

// Middleware to authenticate using the token
function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction): void {
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
      res.status(403).json({ error: 'Invadlid or expired token' });
      return;
    }
    console.log('Token authenticated successfully');
    req.body.token = token;
    next();
  }
8  

// Rate-limiting check
function rateLimit(req: express.Request, res: express.Response, next: express.NextFunction): void {
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

// Endpoint to generate a token
app.post('/api/token', function (req: express.Request, res: express.Response): void {
  const { email } = req.body;
  console.log(`Request received to generate token for email: ${email}`);
  if (!email) {
    console.log('Email not provided');
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const token = generateToken(email);
  tokenWordCount[token] = 0; // Initialize word count for rate limiting
  console.log("Token stored in tokenWordCount after generation:", tokenWordCount);

  res.json({ token });
});

// Endpoint to justify text
app.post('/api/justify', authenticateToken, rateLimit, (req: express.Request, res: express.Response) => {
  console.log('Justifying text...');
  const text = req.body.text;
  if (!text) {
    console.log('No text provided');
    res.status(400).json({ error: 'Text is required' });
    return;
  }

  const justifiedText = justifyText(text);
  console.log('Text justified successfully');
  res.setHeader('Content-Type', 'text/plain');
  res.send(justifiedText);
});

// Helper function to justify text to 80 characters per line
function justifyText(text: string): string {
  console.log('Starting text justification');
  const words = text.split(/\s+/);
  let line = '';
  const lines = [];

  for (const word of words) {
    if ((line + word).length > 80) {
      const spacesToAdd = 80 - line.length;
      const gaps = line.split(' ').length - 1;
      if (gaps > 0) {
        const extraSpacePerGap = Math.floor(spacesToAdd / gaps);
        const remainder = spacesToAdd % gaps;

        line = line.replace(/ /g, (match, offset) =>
          offset < remainder ? ' '.repeat(extraSpacePerGap + 2) : ' '.repeat(extraSpacePerGap + 1)
        );
      }
      lines.push(line);
      line = word;
    } else {
      line += (line ? ' ' : '') + word;
    }
  }
  lines.push(line);
  console.log('Finished text justification');
  return lines.join('\n');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
