import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
