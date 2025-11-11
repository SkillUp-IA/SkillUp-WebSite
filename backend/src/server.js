import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import authRoutes from './routes/auth.routes.js';
import profileRoutes from './routes/profile.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js'; 
import recommendRoutes from './routes/recommend.routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// estáticos
app.use('/data', express.static(path.join(__dirname, '../data')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); 

app.get('/health', (_, res) => res.json({ ok: true }));

app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', aiRoutes);
app.use('/', uploadRoutes); 
app.use('/', recommendRoutes);

app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
