import express from 'express';
import { generateTokenController } from './controllers/tokenController';
import { justifyTextController } from './controllers/justifyController';
import { authenticateToken } from './middlewares/authenticateToken';
import { rateLimit } from './middlewares/rateLimit';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Define routes
app.post('/api/token', generateTokenController);
app.post('/api/justify', authenticateToken, rateLimit, justifyTextController);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
