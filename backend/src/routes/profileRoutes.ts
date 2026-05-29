import { Router } from 'express';
import { updateProfileData, updateProfilePassword } from '../controllers/profileController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Proteger ambas rutas bajo autenticación JWT obligatoria
router.use(authenticateToken as any);

router.put('/datos', updateProfileData as any);
router.put('/password', updateProfilePassword as any);

export default router;
