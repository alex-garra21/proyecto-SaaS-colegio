import React, { useState, useEffect } from 'react';
import { 
  Plus, BookOpen, Layers, Calendar, 
  Users, CheckSquare, ShieldAlert, 
  DollarSign, Receipt, AlertCircle, Trash2
} from 'lucide-react';
import CustomSelect from '../atoms/CustomSelect';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface SeccionAsignada {
  id: number;
  nombreAsignacion: string;
  gradoId: number;
  letraSeccion: string;
  cicloAnio: number;
  codigoAula: string;
}

interface PeriodoHorario {
  id: number;
  numeroPeriodo: number;
  horaInicio: string;
  horaFin: string;
  esReceso: boolean;
}

interface HorarioClaseRow {
  id: number;
  seccionId: number;
  seccionNombre: string;
  cursoId: number;
  cursoNombre: string;
  docenteId: number;
  docenteNombre: string;
  diaSemana: number;
  horaInicio: string;
  horaFin: string;
  periodoId: number;
  numeroPeriodo: number;
  cicloId?: number;
  cicloAnio?: number;
}

interface CicloEscolarRow {
  id: number;
  anio: number;
  estado: boolean;
}

interface StudentMatriculaRow {
  id: number;
  nombre: string;
  correo: string;
  matriculadoSeccionId: number | null;
  matriculadoSeccionNombre: string | null;
  encargadoNombre: string | null;
  encargadoId: number | null;
}

interface PagoAsentado {
  id: string;
  estudianteId: string;
  estudianteNombre: string;
  mesCiclo: number; // 1-10
  monto: number;
  referenciaRecibo: string;
  fechaTransaccion: string;
}

interface ControlAcademicoDashboardProps {
  activeSubTab: 'catalogos' | 'secciones' | 'vinculaciones' | 'caja';
}

export default function ControlAcademicoDashboard({ activeSubTab }: ControlAcademicoDashboardProps) {
  const { showToast } = useToast();
  const { token } = useAuth();

  // --- ESTADOS DE DATOS DINÁMICOS ---
  const [secciones, setSecciones] = useState<SeccionAsignada[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoHorario[]>([]);
  const [horarios, setHorarios] = useState<HorarioClaseRow[]>([]);
  const [matriculas, setMatriculas] = useState<StudentMatriculaRow[]>([]);
  const [cursos, setCursos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [ciclosEscolares, setCiclosEscolares] = useState<CicloEscolarRow[]>([]);

  // Estados de carga
  const [loading, setLoading] = useState(false);

  // --- ESTADOS PARA CATÁLOGOS BASE ---
  const [nuevoCursoNombre, setNuevoCursoNombre] = useState('');

  const gradoOptions = [
    { value: 1, label: 'Primero Básico' },
    { value: 2, label: 'Segundo Básico' },
    { value: 3, label: 'Tercero Básico' }
  ];
  const [nuevoCicloAnio, setNuevoCicloAnio] = useState('');

  // --- ESTADOS PARA SECCIONES ---
  const [seccionGrado, setSeccionGrado] = useState<number>(1);
  const [seccionCiclo, setSeccionCiclo] = useState<string>('');
  const [seccionLetra, setSeccionLetra] = useState<string>('A');
  const [seccionAula, setSeccionAula] = useState<string>('Aula 101');

  // --- ESTADOS PARA HORARIOS PERIODO A PERIODO ---
  const [nuevoPeriodoDocente, setNuevoPeriodoDocente] = useState<string>('');
  const [nuevoPeriodoCurso, setNuevoPeriodoCurso] = useState<string>('');
  const [nuevoPeriodoSeccion, setNuevoPeriodoSeccion] = useState<string>('');
  const [nuevoPeriodoDia, setNuevoPeriodoDia] = useState<number>(1); // 1 = Lunes, 5 = Viernes
  const [nuevoPeriodoHora, setNuevoPeriodoHora] = useState<string>(''); // IdPeriodo
  const [nuevoPeriodoCiclo, setNuevoPeriodoCiclo] = useState<string>(''); // IdCiclo
  
  // Alerta de colisión controlada por backend HTTP 409
  const [colisionBackendError, setColisionBackendError] = useState<boolean>(false);

  // --- ESTADOS PARA VINCULACIÓN Y MATRÍCULA ---
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [matriculaSeccion, setMatriculaSeccion] = useState<string>('');
  const [tutorSeleccionado, setTutorSeleccionado] = useState<string>('');

  // --- ESTADOS PARA COBRO DE CAJA MANUAL ---
  const [pagos, setPagos] = useState<PagoAsentado[]>([
    { id: 'PAG-101', estudianteId: '1', estudianteNombre: 'Juan Pérez', mesCiclo: 1, monto: 400, referenciaRecibo: 'REC-5020', fechaTransaccion: '2026-05-29' },
    { id: 'PAG-102', estudianteId: '2', estudianteNombre: 'María Gómez', mesCiclo: 1, monto: 400, referenciaRecibo: 'REC-5021', fechaTransaccion: '2026-05-29' }
  ]);
  const [pagoEstudiante, setPagoEstudiante] = useState('');
  const [pagoMes, setPagoMes] = useState<number>(2); // Febrero
  const [pagoMonto, setPagoMonto] = useState('400');
  const [pagoRecibo, setPagoRecibo] = useState('');

  // --- CARGA EN CALIENTE DE LA BASE DE DATOS LOCAL ---
  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      // 1. Cargar secciones V2
      const resSec = await fetch('http://localhost:4000/api/admin/secciones', { headers });
      if (resSec.ok) {
        const data = await resSec.json();
        setSecciones(data);
      }

      // 2. Cargar periodos horarios V2
      const resPer = await fetch('http://localhost:4000/api/admin/periodos', { headers });
      if (resPer.ok) {
        const data = await resPer.json();
        setPeriodos(data);
      }

      // 3. Cargar cronograma de HorarioClase
      const resHor = await fetch('http://localhost:4000/api/admin/horarios', { headers });
      if (resHor.ok) {
        const data = await resHor.json();
        setHorarios(data);
      }

      // 4. Cargar nómina de matrículas (Estudiantes, Secciones y Encargados)
      const resMat = await fetch('http://localhost:4000/api/admin/matriculas', { headers });
      if (resMat.ok) {
        const data = await resMat.json();
        setMatriculas(data);
      }

      // 5. Cargar materias (cursos)
      const resCur = await fetch('http://localhost:4000/api/admin/materias', { headers });
      if (resCur.ok) {
        const data = await resCur.json();
        setCursos(data);
      }

      // 6. Cargar todos los usuarios del sistema
      const resUser = await fetch('http://localhost:4000/api/users', { headers });
      if (resUser.ok) {
        const data = await resUser.json();
        setUsuarios(data);
      }

      // 8. Cargar docentes de aula (activos)
      const resDoc = await fetch('http://localhost:4000/api/users/docentes-activos', { headers });
      if (resDoc.ok) {
        const data = await resDoc.json();
        setDocentes(data);
      }

      // 7. Cargar ciclos escolares
      const resCic = await fetch('http://localhost:4000/api/admin/ciclos', { headers });
      if (resCic.ok) {
        const data = await resCic.json();
        setCiclosEscolares(data);
      }
    } catch (err) {
      console.error('Error al conectar con la API de SQL Server:', err);
      showToast('Error al conectar con la base de datos local.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  // --- CONFIGURAR VALORES DE ENTRADA POR DEFECTO ---
  useEffect(() => {
    if (docentes.length > 0 && !nuevoPeriodoDocente) {
      setNuevoPeriodoDocente(String(docentes[0].IdUsuario));
    }
  }, [docentes, nuevoPeriodoDocente]);

  useEffect(() => {
    if (cursos.length > 0 && !nuevoPeriodoCurso) {
      setNuevoPeriodoCurso(String(cursos[0].id));
    }
  }, [cursos, nuevoPeriodoCurso]);

  useEffect(() => {
    if (secciones.length > 0 && !nuevoPeriodoSeccion) {
      setNuevoPeriodoSeccion(String(secciones[0].id));
    }
  }, [secciones, nuevoPeriodoSeccion]);

  useEffect(() => {
    const periodosClase = periodos.filter(p => !p.esReceso && p.numeroPeriodo > 0);
    if (periodosClase.length > 0 && !nuevoPeriodoHora) {
      setNuevoPeriodoHora(String(periodosClase[0].id));
    }
  }, [periodos, nuevoPeriodoHora]);

  useEffect(() => {
    if (secciones.length > 0 && !matriculaSeccion) {
      setMatriculaSeccion(String(secciones[0].id));
    }
  }, [secciones, matriculaSeccion]);

  useEffect(() => {
    if (ciclosEscolares.length > 0) {
      const activo = ciclosEscolares.find(c => c.estado);
      const cicloActivoId = activo ? String(activo.id) : String(ciclosEscolares[0].id);
      if (!nuevoPeriodoCiclo) setNuevoPeriodoCiclo(cicloActivoId);
      if (!seccionCiclo) setSeccionCiclo(cicloActivoId);
    }
  }, [ciclosEscolares, nuevoPeriodoCiclo, seccionCiclo]);

  useEffect(() => {
    const encargados = usuarios.filter(u => u.IdRol === 5);
    if (encargados.length > 0 && !tutorSeleccionado) {
      setTutorSeleccionado(String(encargados[0].IdUsuario));
    }
  }, [usuarios, tutorSeleccionado]);

  useEffect(() => {
    if (matriculas.length > 0 && !pagoEstudiante) {
      setPagoEstudiante(String(matriculas[0].id));
    }
  }, [matriculas, pagoEstudiante]);

  // Resetear alerta de colisión del backend si cambian los parámetros
  useEffect(() => {
    setColisionBackendError(false);
  }, [nuevoPeriodoDocente, nuevoPeriodoCurso, nuevoPeriodoSeccion, nuevoPeriodoDia, nuevoPeriodoHora, nuevoPeriodoCiclo]);

  // --- CONTROLADORES DE EVENTOS ASÍNCRONOS HASTA SQL SERVER ---

  // 1. Agregar Curso (Materia)
  const handleAddCurso = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCursoNombre.trim()) {
      showToast('Por favor, ingresa el nombre del curso.', 'error');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/materias', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          nombre: nuevoCursoNombre.trim()
        })
      });

      if (!res.ok) throw new Error('Fallo al registrar curso.');

      showToast(`Curso "${nuevoCursoNombre}" registrado con éxito en SQL Server.`, 'success');
      setNuevoCursoNombre('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al registrar curso.', 'error');
    }
  };

  // 1.1 Eliminar Curso
  const handleDeleteCurso = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este curso del catálogo global?')) return;
    try {
      const res = await fetch(`http://localhost:4000/api/admin/materias/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Fallo al eliminar curso. Verifica restricciones foráneas.');
      showToast('Curso eliminado con éxito.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al eliminar curso.', 'error');
    }
  };

  // 1.2 Agregar Ciclo Escolar
  const handleAddCiclo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCicloAnio) {
      showToast('Por favor, ingresa el año del ciclo.', 'error');
      return;
    }
    try {
      const res = await fetch('http://localhost:4000/api/admin/ciclos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ anio: Number(nuevoCicloAnio) })
      });
      if (!res.ok) throw new Error('Fallo al registrar ciclo.');
      showToast(`Ciclo ${nuevoCicloAnio} registrado con éxito.`, 'success');
      setNuevoCicloAnio('');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al registrar ciclo.', 'error');
    }
  };

  // 1.3 Activar Ciclo Escolar
  const handleActivarCiclo = async (id: number, anio: number) => {
    if (!window.confirm('⚠️ ¿Estás seguro de cambiar el ciclo activo? Esto afectará los procesos de matrículas y reportería vigentes.')) {
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:4000/api/admin/ciclos/${id}/activar`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Fallo al activar ciclo.');
      showToast(`Ciclo ${anio} activado globalmente.`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al activar ciclo.', 'error');
    }
  };

  // 2. Crear Sección V2
  const handleAddSeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seccionLetra.trim() || !seccionAula.trim()) {
      showToast('Por favor, completa los campos de la sección.', 'error');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/secciones', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idGrado: Number(seccionGrado),
          idCiclo: Number(seccionCiclo),
          letraSeccion: seccionLetra.trim().toUpperCase(),
          codigoAula: seccionAula.trim()
        })
      });

      if (!res.ok) throw new Error('Fallo al estructurar sección.');

      showToast(`Sección "${seccionLetra}" estructurada con éxito en SQL Server.`, 'success');
      setSeccionLetra('A');
      setSeccionAula('Aula 101');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al estructurar sección.', 'error');
    }
  };

  // 3. Programar e Inyectar Horario (Collision checked)
  const handleAddPeriodo = async (e: React.FormEvent) => {
    e.preventDefault();
    setColisionBackendError(false);

    if (!nuevoPeriodoSeccion || !nuevoPeriodoCurso || !nuevoPeriodoDocente || !nuevoPeriodoDia || !nuevoPeriodoHora || !nuevoPeriodoCiclo) {
      showToast('Por favor, completa todos los campos del periodo, incluyendo el ciclo lectivo.', 'error');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/horarios', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idSeccion: Number(nuevoPeriodoSeccion),
          idMateria: Number(nuevoPeriodoCurso),
          idProfesor: Number(nuevoPeriodoDocente),
          diaSemana: Number(nuevoPeriodoDia),
          idPeriodo: Number(nuevoPeriodoHora),
          idCiclo: Number(nuevoPeriodoCiclo)
        })
      });

      // Interceptar código HTTP 409 de colisión horaria
      if (res.status === 409) {
        setColisionBackendError(true);
        showToast('Error: ¡Colisión horaria detectada!', 'error');
        return;
      }

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Fallo al programar periodo horario.');
      }

      showToast('Periodo académico inyectado exitosamente.', 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al programar periodo.', 'error');
    }
  };

  // --- HELPERS PARA SELECCIÓN MASIVA ---
  const toggleStudentSelection = (id: number) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(selectedId => selectedId !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === matriculas.length && matriculas.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(matriculas.map(m => m.id));
    }
  };

  // 4. Matricular Alumnos Seleccionados
  const handleMatricular = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      showToast('Selecciona al menos un estudiante de la tabla de matrículas.', 'error');
      return;
    }
    if (!matriculaSeccion) {
      showToast('Selecciona la sección destino.', 'error');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/matriculas', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idAlumnos: selectedIds,
          idSeccion: Number(matriculaSeccion)
        })
      });

      if (!res.ok) throw new Error('Fallo al asentar matrícula.');

      showToast(`Se han matriculado ${selectedIds.length} alumno(s) exitosamente.`, 'success');
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al asentar matrícula.', 'error');
    }
  };

  // 5. Vincular Encargado / Tutor
  const handleVincularTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      showToast('Selecciona al menos un estudiante de la tabla para vincularlo.', 'error');
      return;
    }
    if (!tutorSeleccionado) {
      showToast('Selecciona al encargado.', 'error');
      return;
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      const res = await fetch('http://localhost:4000/api/admin/vinculaciones', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          idAlumnos: selectedIds,
          idPadre: Number(tutorSeleccionado)
        })
      });

      if (!res.ok) throw new Error('Fallo al vincular tutor.');

      showToast(`Encargado asociado con éxito a ${selectedIds.length} estudiante(s).`, 'success');
      setSelectedIds([]);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Error al vincular tutor familiar.', 'error');
    }
  };

  // 6. Asentar cobro en caja manual
  const handleRegistrarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoRecibo.trim() || !pagoMonto || !pagoEstudiante) {
      showToast('Completa los campos de cobro de caja.', 'error');
      return;
    }

    const estNombre = matriculas.find(m => String(m.id) === pagoEstudiante)?.nombre || 'Estudiante';
    const nuevoPago: PagoAsentado = {
      id: `PAG-${Math.floor(100 + Math.random() * 900)}`,
      estudianteId: pagoEstudiante,
      estudianteNombre: estNombre,
      mesCiclo: pagoMes,
      monto: parseFloat(pagoMonto),
      referenciaRecibo: pagoRecibo.trim(),
      fechaTransaccion: new Date().toISOString().substring(0, 10)
    };

    setPagos(prev => [nuevoPago, ...prev]);
    setPagoRecibo('');
    showToast(`Mensualidad del mes ${pagoMes} asentada con éxito para ${estNombre}.`, 'success');
  };

  // Filtrar periodos para excluir recesos y ordenar jornada
  const periodosClase = periodos.filter(p => !p.esReceso && p.numeroPeriodo > 0);

  return (
    <div className={`space-y-6 text-slate-800 animate-in fade-in duration-300 font-sans`}>
      
      {/* Cabecera del Panel Principal */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB]">
            Portal Administrativo
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Suite de Control Académico
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configuración de catálogos base, estructuración de asignaciones horarias, matrícula de alumnos y control de caja regular.
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8 bg-blue-50/20 border border-blue-100/50 rounded-xl gap-3 text-xs text-blue-600 font-medium">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span>Sincronizando control académico con SQL Server local...</span>
        </div>
      )}

      {/* --- TAB 1: CONFIGURACIÓN BASE (CATÁLOGOS) --- */}
      {activeSubTab === 'catalogos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario Cursos (Left Side - Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <BookOpen size={16} className="text-[#2563EB]" />
                Registrar Curso Individual
              </h3>

              <form onSubmit={handleAddCurso} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Nombre del Curso
                  </label>
                  <input
                    type="text"
                    required
                    value={nuevoCursoNombre}
                    onChange={(e) => setNuevoCursoNombre(e.target.value)}
                    placeholder="ej. Matemáticas, Lenguaje"
                    className="block w-full rounded-[4px] border border-slate-200 py-2.5 px-3 text-slate-900 placeholder:text-slate-400 text-xs focus:border-[#2563EB] focus:outline-none"
                  />
                </div>



                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 text-xs font-bold transition shadow-sm"
                >
                  <Plus size={14} />
                  <span>Insertar Curso en Catálogo</span>
                </button>
              </form>
            </div>

            {/* Listado de cursos activos */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Listado de Cursos Cargados
              </h4>
              <div className="divide-y divide-slate-100 max-h-[180px] overflow-y-auto">
                {cursos.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-2">No hay cursos registrados en el catálogo.</p>
                ) : (
                  cursos.map(c => (
                    <div key={c.id} className="py-2.5 flex justify-between items-center text-xs group">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">ID: {c.id}</span>
                        <span className="font-semibold text-slate-800">{c.nombre}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteCurso(c.id)}
                        className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded transition opacity-0 group-hover:opacity-100"
                        title="Eliminar curso"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Ciclos y Grados Bento Grid (Right Side - Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Ciclos Bento Panel */}
            <div className="bg-white border border-slate-150 rounded-lg p-6 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-[#2563EB]" />
                Gestión de Ciclos Escolares
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Administra e inicializa ciclos académicos. Solo los ciclos activos permiten matrículas y registro financiero.
              </p>

              <form onSubmit={handleAddCiclo} className="flex items-end gap-3 mb-6">
                <div className="flex-1">
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Año del Ciclo
                  </label>
                  <input
                    type="number"
                    min="2000"
                    max="2100"
                    required
                    value={nuevoCicloAnio}
                    onChange={(e) => setNuevoCicloAnio(e.target.value)}
                    placeholder="ej. 2027"
                    className="block w-full rounded-[4px] border border-slate-200 py-2 px-3 text-slate-900 text-xs focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2 px-4 text-xs font-bold transition shadow-sm h-[34px] w-[180px]"
                >
                  <Plus size={14} />
                  <span>Registrar Ciclo</span>
                </button>
              </form>

              <div className="border border-slate-100 rounded-md overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="px-3 py-2 border-b">ID</th>
                      <th className="px-3 py-2 border-b">Año</th>
                      <th className="px-3 py-2 border-b">Estado</th>
                      <th className="px-3 py-2 border-b text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {ciclosEscolares.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-slate-400 italic">No hay ciclos registrados.</td>
                      </tr>
                    ) : (
                      ciclosEscolares.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50 transition">
                          <td className="px-3 py-2 font-mono text-[10px] font-bold text-slate-400">{c.id}</td>
                          <td className="px-3 py-2 font-black text-slate-900">{c.anio}</td>
                          <td className="px-3 py-2">
                            {c.estado ? (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2563EB]"></span>
                                Activo
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
                                Inactivo
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right">
                            {!c.estado && (
                              <button
                                onClick={() => handleActivarCiclo(c.id, c.anio)}
                                className="text-[10px] font-bold uppercase text-[#2563EB] hover:text-white hover:bg-[#2563EB] border border-[#2563EB] px-2 py-1 rounded transition"
                              >
                                Activar
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Catálogo de Grados Fijos */}
            <div className="bg-slate-950 text-white rounded-lg p-6 shadow-xl border border-slate-800 text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-350 mb-3 flex items-center gap-2">
                <Layers size={16} className="text-blue-400" />
                Catálogo Operativo de Grados (SIGE)
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Los grados académicos están parametrizados estrictamente de forma física en la base de datos relacional del monorepo.
              </p>

              <div className="space-y-3 font-mono text-[11px]">
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded">
                  <span className="font-bold text-slate-200">ID: 1</span>
                  <span className="text-blue-400 font-bold">Primero Básico</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded">
                  <span className="font-bold text-slate-200">ID: 2</span>
                  <span className="text-blue-400 font-bold">Segundo Básico</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded">
                  <span className="font-bold text-slate-200">ID: 3</span>
                  <span className="text-blue-400 font-bold">Tercero Básico</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB 2: SECCIONES Y HORARIOS (COLLISION CHECKER) --- */}
      {activeSubTab === 'secciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Creación de Secciones (Left Side - Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <Layers size={16} className="text-[#2563EB]" />
                Estructurar Sección Académica
              </h3>

              <form onSubmit={handleAddSeccion} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Grado Académico
                  </label>
                  <CustomSelect
                    options={gradoOptions}
                    value={seccionGrado}
                    onChange={(val) => setSeccionGrado(val)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Ciclo Activo
                    </label>
                    <select
                      value={seccionCiclo}
                      disabled
                      className="block w-full rounded-[4px] border border-slate-200 bg-slate-50 py-2.5 px-3 text-slate-500 text-xs focus:outline-none cursor-not-allowed font-bold"
                    >
                      {ciclosEscolares.map(c => (
                        <option key={c.id} value={c.id}>{c.anio} {c.estado ? '(Activo)' : ''}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Identificador Letra
                    </label>
                    <input
                      type="text"
                      required
                      value={seccionLetra}
                      onChange={(e) => setSeccionLetra(e.target.value.toUpperCase())}
                      placeholder="ej. A, B, C"
                      maxLength={1}
                      className="block w-full rounded-[4px] border border-slate-200 py-2.5 px-3 text-slate-900 text-xs focus:border-[#2563EB] focus:outline-none text-center font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Código de Aula física
                  </label>
                  <input
                    type="text"
                    required
                    value={seccionAula}
                    onChange={(e) => setSeccionAula(e.target.value)}
                    placeholder="ej. Aula 101, Laboratorio B"
                    className="block w-full rounded-[4px] border border-slate-200 py-2.5 px-3 text-slate-900 text-xs focus:border-[#2563EB] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 text-xs font-bold transition shadow-sm"
                >
                  <Plus size={14} />
                  <span>Crear Asignación de Sección</span>
                </button>
              </form>
            </div>

            {/* Listado de secciones persistidas */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                Secciones Estructuradas Activas (SQL Server)
              </h4>
              <div className="space-y-2">
                {secciones.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No hay secciones registradas.</p>
                ) : (
                  secciones.map(s => (
                    <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex justify-between items-center text-xs">
                      <div>
                        <strong className="block text-slate-900">{s.nombreAsignacion}</strong>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">Aula: {s.codigoAula}</span>
                        <span className="text-[10px] text-slate-400">Año Ciclo: {s.cicloAnio}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded">ID: {s.id}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Collision Checker (Right Side - Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-1 flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#2563EB]" />
                Asignación de Periodos (Validación de Colisiones)
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                El programador validará colisiones horarias del docente o de la sección en tiempo real contra SQL Server.
              </p>

              {/* Form de Programación */}
              <form onSubmit={handleAddPeriodo} className="space-y-4 bg-slate-50/50 p-4 border border-slate-100 rounded-lg">
                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Docente</label>
                    <select
                      value={nuevoPeriodoDocente}
                      onChange={(e) => setNuevoPeriodoDocente(e.target.value)}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      {docentes.length === 0 ? (
                        <option value="">Cargando docentes...</option>
                      ) : (
                        docentes.map(d => (
                          <option key={d.IdUsuario} value={d.IdUsuario}>{d.NombreCompleto}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Curso</label>
                    <select
                      value={nuevoPeriodoCurso}
                      onChange={(e) => setNuevoPeriodoCurso(e.target.value)}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      {cursos.length === 0 ? (
                        <option value="">Cargando cursos...</option>
                      ) : (
                        cursos.map(c => (
                          <option key={c.id} value={c.id}>{c.nombre}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Ciclo Lectivo</label>
                    <select
                      value={nuevoPeriodoCiclo}
                      disabled
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-slate-50 focus:outline-none focus:border-[#2563EB] cursor-not-allowed font-bold text-slate-600"
                    >
                      {ciclosEscolares.length === 0 ? (
                        <option value="">Cargando ciclos...</option>
                      ) : (
                        ciclosEscolares.map(c => (
                          <option key={c.id} value={c.id}>{c.anio} {c.estado ? '(Activo)' : ''}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Sección</label>
                    <select
                      value={nuevoPeriodoSeccion}
                      onChange={(e) => setNuevoPeriodoSeccion(e.target.value)}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      {secciones.length === 0 ? (
                        <option value="">Cargando secciones...</option>
                      ) : (
                        secciones.map(s => (
                          <option key={s.id} value={s.id}>{s.nombreAsignacion}</option>
                        ))
                      )}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Día</label>
                    <select
                      value={nuevoPeriodoDia}
                      onChange={(e) => setNuevoPeriodoDia(parseInt(e.target.value))}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value={1}>Lunes</option>
                      <option value={2}>Martes</option>
                      <option value={3}>Miércoles</option>
                      <option value={4}>Jueves</option>
                      <option value={5}>Viernes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Periodo Horario (Tarde)</label>
                    <select
                      value={nuevoPeriodoHora}
                      onChange={(e) => setNuevoPeriodoHora(e.target.value)}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                    >
                      {periodosClase.length === 0 ? (
                        <option value="">Cargando periodos...</option>
                      ) : (
                        periodosClase.map(p => (
                          <option key={p.id} value={p.id}>{p.numeroPeriodo}° Periodo ({p.horaInicio} - {p.horaFin})</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {/* ALERTA DE COLISIÓN HORARIA DINÁMICA POR RESPUESTA 409 */}
                {colisionBackendError && (
                  <div className="flex gap-2.5 bg-red-50 border border-red-150 text-red-700 text-xs p-3.5 rounded-[4px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="shrink-0 text-red-600 mt-0.5" size={16} />
                    <span>
                      <strong>¡COLISIÓN HORARIA DETECTADA!</strong> El docente o la sección ya tienen programada una clase en este periodo. La transacción ha sido denegada en SQL Server.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={colisionBackendError}
                  className={`flex w-full items-center justify-center gap-2 rounded-[4px] py-2.5 text-xs font-bold transition shadow-sm ${
                    colisionBackendError
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white cursor-pointer'
                  }`}
                >
                  <Plus size={14} />
                  <span>Programar e Inyectar Horario</span>
                </button>
              </form>

              {/* Grid Visual de Horarios Existentes */}
              <div className="mt-6">
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-3">
                  Cronograma Escolar e Incidencias Asignadas
                </h4>
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {horarios.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No hay clases programadas en el cronograma.</p>
                  ) : (
                    horarios.map(h => (
                      <div key={h.id} className="p-3 bg-white border border-slate-150 rounded flex justify-between items-center text-xs shadow-sm">
                        <div>
                          <strong className="block text-slate-900">{h.cursoNombre}</strong>
                          <span className="text-[10px] text-slate-500 block">Docente: {h.docenteNombre}</span>
                          <span className="text-[10px] text-[#64748B]">Sección: {h.seccionNombre} {h.cicloAnio ? `| Ciclo: ${h.cicloAnio}` : ''}</span>
                        </div>
                        <div className="text-right text-[10px] font-mono">
                          <span className="block font-bold text-[#2563EB]">
                            {h.diaSemana === 1 ? 'Lunes' : h.diaSemana === 2 ? 'Martes' : h.diaSemana === 3 ? 'Miércoles' : h.diaSemana === 4 ? 'Jueves' : 'Viernes'}
                          </span>
                          <span className="text-slate-450 block mt-0.5">{h.numeroPeriodo}° Periodo</span>
                          <span className="text-slate-400">({h.horaInicio} - {h.horaFin})</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: MATRÍCULA Y FAMILIAS --- */}
      {activeSubTab === 'vinculaciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Listado de Matrículas en DataTable */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Users size={16} className="text-[#2563EB]" />
                  Nómina y Control de Matrículas
                </h3>
                {selectedIds.length > 0 && (
                  <span className="bg-blue-100 border border-blue-200 text-[#2563EB] text-[9px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider animate-pulse">
                    Seleccionados: {selectedIds.length}
                  </span>
                )}
              </div>

              {/* DataTable responsiva de Tailwind */}
              <div className="rounded-lg border border-slate-150 overflow-hidden shadow-sm bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3.5 px-4 w-10">
                          <input 
                            type="checkbox" 
                            className="cursor-pointer rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                            checked={selectedIds.length === matriculas.length && matriculas.length > 0}
                            onChange={toggleSelectAll}
                          />
                        </th>
                        <th className="py-3.5 px-4">Estudiante</th>
                        <th className="py-3.5 px-4">Sección Asignada</th>
                        <th className="py-3.5 px-4">Encargado Relacionado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
                      {matriculas.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-slate-400 italic">
                            No se encontraron registros de estudiantes en el sistema.
                          </td>
                        </tr>
                      ) : (
                        matriculas.map((m) => (
                          <tr 
                            key={m.id} 
                            onClick={() => toggleStudentSelection(m.id)}
                            className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                              selectedIds.includes(m.id) ? 'bg-blue-50/85 font-semibold' : ''
                            }`}
                          >
                            <td className="py-3.5 px-4">
                              <input 
                                type="checkbox" 
                                className="cursor-pointer rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                                checked={selectedIds.includes(m.id)}
                                onChange={() => {}}
                                onClick={(e) => { e.stopPropagation(); toggleStudentSelection(m.id); }}
                              />
                            </td>
                            <td className="py-3.5 px-4">
                              <div>
                                <span className="block text-slate-900 font-semibold">{m.nombre}</span>
                                <span className="block text-[9px] text-slate-400 font-mono">ID: ALU-0{m.id} | {m.correo}</span>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              {m.matriculadoSeccionNombre ? (
                                <span className="inline-block rounded bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                                  {m.matriculadoSeccionNombre}
                                </span>
                              ) : (
                                <span className="inline-block rounded bg-slate-100 border border-slate-200/50 px-2 py-0.5 text-[9px] font-bold text-slate-400">
                                  Sin Matrícula
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-650">
                              {m.encargadoNombre ? (
                                <span className="text-slate-800">{m.encargadoNombre}</span>
                              ) : (
                                <span className="text-slate-400 italic">No Vinculado</span>
                              )}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 italic mt-3">
                * Haz clic sobre la fila de un estudiante para seleccionarlo y habilitar las acciones de matrícula o vinculación familiar en el panel lateral.
              </p>
            </div>
          </div>

          {/* Acciones de Matrícula y Tutores (Right Side - Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Matrícula de Alumno Seleccionado */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <CheckSquare size={16} className="text-[#2563EB]" />
                Matrícula de Alumno
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Asigna al alumno seleccionado en la tabla a una sección y ciclo lectivo específico en la base de datos local.
              </p>

              <form onSubmit={handleMatricular} className="space-y-4">
                {selectedIds.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-[#2563EB]">
                    <span>Asignar matrícula a: <strong>{selectedIds.length === 1 ? matriculas.find(m => m.id === selectedIds[0])?.nombre : `${selectedIds.length} alumnos seleccionados`}</strong></span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Seleccionar Sección Destino
                  </label>
                  <select
                    value={matriculaSeccion}
                    onChange={(e) => setMatriculaSeccion(e.target.value)}
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Seleccione una sección...</option>
                    {secciones.map(s => (
                      <option key={s.id} value={s.id}>{s.nombreAsignacion}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={selectedIds.length === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-[4px] py-2.5 text-xs font-bold transition shadow-sm cursor-pointer ${
                    selectedIds.length > 0 
                      ? 'bg-slate-950 hover:bg-slate-800 text-white' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <CheckSquare size={14} />
                  <span>Matricular Alumno(s)</span>
                </button>
              </form>
            </div>

            {/* Vinculación Familiar */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#2563EB]" />
                Vincular Encargado / Tutor
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Asocia un único Encargado/Padre de Familia al estudiante seleccionado de la tabla.
              </p>

              <form onSubmit={handleVincularTutor} className="space-y-4">
                {selectedIds.length > 0 && (
                  <div className="bg-blue-50 border border-blue-100 rounded p-3 text-xs text-[#2563EB]">
                    <span>Asociar tutor a: <strong>{selectedIds.length === 1 ? matriculas.find(m => m.id === selectedIds[0])?.nombre : `${selectedIds.length} alumnos seleccionados`}</strong></span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Encargado de Familia
                  </label>
                  <select
                    value={tutorSeleccionado}
                    onChange={(e) => setTutorSeleccionado(e.target.value)}
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="">Selecciona un Encargado...</option>
                    {usuarios.filter(u => u.IdRol === 5).map(u => (
                      <option key={u.IdUsuario} value={u.IdUsuario}>{u.NombreCompleto}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={selectedIds.length === 0}
                  className={`flex w-full items-center justify-center gap-2 rounded-[4px] py-2.5 text-xs font-bold transition shadow-sm cursor-pointer ${
                    selectedIds.length > 0 
                      ? 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <span>Asociar Tutoría Familiar</span>
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* --- TAB 4: CAJA Y MENSUALIDADES --- */}
      {activeSubTab === 'caja' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario Caja Manual (Left Side - Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-[#2563EB]" />
                Registrar Cobro de Mensualidad
              </h3>

              <form onSubmit={handleRegistrarPago} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Estudiante Beneficiario
                  </label>
                  <select
                    value={pagoEstudiante}
                    onChange={(e) => setPagoEstudiante(e.target.value)}
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white focus:outline-none focus:border-[#2563EB]"
                  >
                    {matriculas.map(e => (
                      <option key={e.id} value={e.id}>{e.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Mes del Ciclo [1-10]
                    </label>
                    <select
                      value={pagoMes}
                      onChange={(e) => setPagoMes(parseInt(e.target.value))}
                      className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white"
                    >
                      <option value={1}>1 - Enero</option>
                      <option value={2}>2 - Febrero</option>
                      <option value={3}>3 - Marzo</option>
                      <option value={4}>4 - Abril</option>
                      <option value={5}>5 - Mayo</option>
                      <option value={6}>6 - Junio</option>
                      <option value={7}>7 - Julio</option>
                      <option value={8}>8 - Agosto</option>
                      <option value={9}>9 - Septiembre</option>
                      <option value={10}>10 - Octubre</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Monto (Quetzales)
                    </label>
                    <input
                      type="number"
                      required
                      value={pagoMonto}
                      onChange={(e) => setPagoMonto(e.target.value)}
                      placeholder="Q400.00"
                      className="block w-full rounded-[4px] border border-slate-200 py-2.5 px-3 text-slate-900 text-xs focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Correlativo Recibo Físico
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Receipt size={14} />
                    </div>
                    <input
                      type="text"
                      required
                      value={pagoRecibo}
                      onChange={(e) => setPagoRecibo(e.target.value)}
                      placeholder="REC-90294"
                      className="block w-full rounded-[4px] border border-slate-200 py-2.5 pl-9 pr-3 text-slate-900 text-xs focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <DollarSign size={14} />
                  <span>Asentar Pago en Caja</span>
                </button>
              </form>
            </div>
          </div>

          {/* Historial de transacciones de Caja (Right Side - Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                <Receipt size={16} className="text-[#2563EB]" />
                Auditoría de Caja y Egresos Recientes
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-3">Recibo</th>
                      <th className="py-2.5 px-3">Estudiante</th>
                      <th className="py-2.5 px-3 text-center">Mes</th>
                      <th className="py-2.5 px-3 text-right">Monto</th>
                      <th className="py-2.5 px-3 text-center">Fecha</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-650 font-mono text-[10px]">
                    {pagos.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3 font-semibold text-[#2563EB]">{p.referenciaRecibo}</td>
                        <td className="py-2 px-3 font-sans font-semibold text-slate-800">{p.estudianteNombre}</td>
                        <td className="py-2 px-3 text-center">Mes {p.mesCiclo}</td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono text-[10px]">Q{p.monto.toFixed(2)}</td>
                        <td className="py-2 px-3 text-center text-slate-400">{p.fechaTransaccion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
