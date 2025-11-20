import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dictRouter from './routes/dict.js';
import pronounceRouter from './routes/pronunciation.js';
import imageRouter from './routes/image.js';
import studyHistoryRouter from './routes/study-history.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dict', dictRouter);
app.use('/api/pronunciation', pronounceRouter);
app.use('/api/image', imageRouter);
app.use('/api/study-history', studyHistoryRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
