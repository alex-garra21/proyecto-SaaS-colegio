import { Router } from 'express';
import { 
  getBackupStats, 
  getBackupHistory, 
  generarBackupWeb, 
  descargarBackupHistorico,
  getAutomatedBackupStatus,
  descargarBackupAutomatico
} from '../controllers/backupController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Proteger todas las rutas de backups para que solo los administradores autenticados tengan acceso
router.use(authenticateToken as any);
router.use(requireAdmin as any);

router.get('/stats', getBackupStats as any);
router.get('/history', getBackupHistory as any);
router.post('/generate', generarBackupWeb as any);
router.get('/download/:id', descargarBackupHistorico as any);
router.get('/automated/status', getAutomatedBackupStatus as any);
router.get('/automated/download', descargarBackupAutomatico as any);

export default router;
