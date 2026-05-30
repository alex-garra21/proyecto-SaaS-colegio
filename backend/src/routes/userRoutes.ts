import { Router } from 'express';
import { getUsers, getDocentesActivos, createUser, updateUserRole, toggleUserStatus, deleteUser, generateInstitutionalEmail } from '../controllers/userController.js';
import { authenticateToken, requireAdminOrControlAcademico } from '../middleware/authMiddleware.js';

const router: Router = Router();

// Proteger todas las rutas bajo autenticación JWT y rol de Administrador o Control Académico
router.use(authenticateToken as any);
router.use(requireAdminOrControlAcademico as any);

router.get('/', getUsers as any);
router.get('/docentes-activos', getDocentesActivos as any);
router.get('/generar-correo', generateInstitutionalEmail as any);
router.post('/', createUser as any);
router.put('/:id/role', updateUserRole as any);
router.put('/:id/status', toggleUserStatus as any);
router.delete('/:id', deleteUser as any);

export default router;
