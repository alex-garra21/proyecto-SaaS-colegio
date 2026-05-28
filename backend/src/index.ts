import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import { initializeStoredProcedures } from './config/db.js';
import cron from 'node-cron';
import { runAutomatedBackup } from './controllers/backupController.js';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const port = Number(process.env.PORT) || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/backup', backupRoutes);

app.listen(port, async () => {
  console.log(`API escuchando en http://localhost:${port}`);
  
  // Ejecutar auto-migración de los Stored Procedures para Gestión de Usuarios
  await initializeStoredProcedures();

  // Ejecutar un respaldo automático inicial al arrancar el servidor
  try {
    await runAutomatedBackup();
  } catch (err: any) {
    console.error('Error al inicializar respaldo automático de arranque:', err.message);
  }

  // Programar respaldo automático cíclico cada 30 minutos
  cron.schedule('*/30 * * * *', async () => {
    console.log('[CRON] Iniciando ciclo de respaldo automático programado de 30 minutos...');
    await runAutomatedBackup();
  });
});
