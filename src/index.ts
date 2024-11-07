import express from 'express';
import path from 'path';
import { generateTokenController } from './controllers/tokenController';
import { justifyTextController } from './controllers/justifyController';
import { authenticateToken } from './middlewares/authenticateToken';
import { rateLimit } from './middlewares/rateLimit';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, '../public')));

// Define routes
app.post('/api/token', generateTokenController);
app.post('/api/justify', authenticateToken, rateLimit, justifyTextController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
