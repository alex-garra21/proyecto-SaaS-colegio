import { Router } from 'express';
import { getBitacoras, generarBackup } from '../controllers/adminController.js';

const router: Router = Router();

router.get('/bitacoras', getBitacoras);
router.post('/backups', generarBackup);

export default router;
