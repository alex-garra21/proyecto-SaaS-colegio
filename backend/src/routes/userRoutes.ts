import { Router } from 'express';
import { getUsers, createUser, updateUserRole, toggleUserStatus, deleteUser, generateInstitutionalEmail } from '../controllers/userController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Proteger todas las rutas bajo autenticación JWT y rol exclusivo de Administrador (idRol = 1)
router.use(authenticateToken as any);
router.use(requireAdmin as any);

router.get('/', getUsers as any);
router.get('/generar-correo', generateInstitutionalEmail as any);
router.post('/', createUser as any);
router.put('/:id/role', updateUserRole as any);
router.put('/:id/status', toggleUserStatus as any);
router.delete('/:id', deleteUser as any);

export default router;
