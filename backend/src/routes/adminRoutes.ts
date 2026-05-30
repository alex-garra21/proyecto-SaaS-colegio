import { Router } from 'express';
import { 
  getBitacoras, 
  generarBackup,
  getSecciones,
  createSeccion,
  getPeriodos,
  getHorarios,
  createHorario,
  getMatriculas,
  createMatricula,
  createVinculacion,
  getMaterias,
  createMateria,
  getCiclos
} from '../controllers/adminController.js';

const router: Router = Router();

router.get('/bitacoras', getBitacoras);
router.post('/backups', generarBackup);

// --- SUITE V2: CONTROL ACADÉMICO ---
router.get('/secciones', getSecciones);
router.post('/secciones', createSeccion);
router.get('/periodos', getPeriodos);
router.get('/horarios', getHorarios);
router.post('/horarios', createHorario);
router.get('/matriculas', getMatriculas);
router.post('/matriculas', createMatricula);
router.post('/vinculaciones', createVinculacion);
router.get('/materias', getMaterias);
router.post('/materias', createMateria);
router.get('/ciclos', getCiclos);

export default router;
