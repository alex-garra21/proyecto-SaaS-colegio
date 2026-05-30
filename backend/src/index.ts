import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'node:path';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import { initializeStoredProcedures, getPool } from './config/db.js';
import cron from 'node-cron';
import { runAutomatedBackup } from './controllers/backupController.js';
import { getRoles, generateInstitutionalEmail } from './controllers/userController.js';
import sql from 'mssql';

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
app.get('/api/roles', getRoles as any);
app.get('/api/usuarios/generar-correo', generateInstitutionalEmail as any);

// Endpoint transaccional para asentar calificaciones mediante sp_AsignarCalificacion
app.post('/api/calificaciones', async (req, res) => {
  const { idEntrega, nota, observacion } = req.body as { idEntrega?: number; nota?: number; observacion?: string };
  
  if (idEntrega === undefined || idEntrega === null || nota === undefined || nota === null) {
    res.status(400).json({ message: 'Los campos idEntrega y nota son obligatorios.' });
    return;
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('IdEntrega', sql.Int, Number(idEntrega))
      .input('Nota', sql.Decimal(5, 2), Number(nota))
      .input('Observacion', sql.VarChar(sql.MAX), observacion || '')
      .execute('sp_AsignarCalificacion');

    res.status(200).json({ success: true, message: 'Calificación registrada exitosamente en la base de datos local.' });
  } catch (error: any) {
    console.error('Error al ejecutar sp_AsignarCalificacion:', error);
    res.status(500).json({ message: 'Error de servidor al guardar la nota.', error: error.message || String(error) });
  }
});


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
