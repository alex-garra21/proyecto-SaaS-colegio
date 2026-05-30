import { Router } from 'express';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { 
  getBackupStats, 
  getBackupHistory, 
  generarBackupWeb, 
  descargarBackupHistorico,
  getAutomatedBackupStatus,
  descargarBackupAutomatico,
  restaurarBackup
} from '../controllers/backupController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Configuración de multer temporal
const tmpStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tmpPath = path.join(process.cwd(), 'storage', 'tmp');
    if (!fs.existsSync(tmpPath)) {
      fs.mkdirSync(tmpPath, { recursive: true });
    }
    cb(null, tmpPath);
  },
  filename: (req, file, cb) => {
    cb(null, `restore_${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage: tmpStorage });

// Proteger todas las rutas de backups para que solo los administradores autenticados tengan acceso
router.use(authenticateToken as any);
router.use(requireAdmin as any);

router.get('/stats', getBackupStats as any);
router.get('/history', getBackupHistory as any);
router.post('/generate', generarBackupWeb as any);
router.get('/download/:id', descargarBackupHistorico as any);
router.get('/automated/status', getAutomatedBackupStatus as any);
router.get('/automated/download', descargarBackupAutomatico as any);
router.post('/restore', upload.single('backupFile'), restaurarBackup as any);

export default router;
