import { Router } from 'express';
import { login, registerStudent } from '../controllers/authController.js';

const router: Router = Router();

router.post('/login', login);
router.post('/register-student', registerStudent);

export default router;
