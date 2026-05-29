import React, { useState, useMemo } from 'react';
import { 
  Plus, BookOpen, Layers, Calendar, 
  Users, CheckSquare, ShieldAlert, 
  DollarSign, Receipt, AlertCircle 
} from 'lucide-react';
import CustomSelect from '../atoms/CustomSelect';
import { useToast } from '../../context/ToastContext';
import type { CursoBase } from '../../interfacesAcademicas';

interface SeccionAsignada {
  id: string;
  nombreAsignacion: string;
  gradoId: 'FIRST_BASIC' | 'SECOND_BASIC' | 'THIRD_BASIC';
  cicloAnio: number;
  estudiantesIds: string[];
}

interface PeriodoHorario {
  id: string;
  docenteId: string;
  docenteNombre: string;
  cursoId: string;
  cursoNombre: string;
  seccionId: string;
  seccionNombre: string;
  diaSemana: number; // 1 = Lunes, 5 = Viernes
  horaInicio: string; // "HH:MM"
  horaFin: string;
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

  // --- 1. ESTADOS PARA CATÁLOGOS BASE ---
  const [cursos, setCursos] = useState<CursoBase[]>([
    { id: 'CUR-MAT', nombre: 'Matemáticas' },
    { id: 'CUR-LEN', nombre: 'Lenguaje y Literatura' },
    { id: 'CUR-FIS', nombre: 'Física Clásica' },
    { id: 'CUR-CIE', nombre: 'Ciencias Naturales' }
  ]);
  const [nuevoCursoNombre, setNuevoCursoNombre] = useState('');
  const [selectedGrado, setSelectedGrado] = useState<number>(1); // 1 = Primero Básico, 2 = Segundo Básico, 3 = Tercero Básico
  const [ciclos, setCiclos] = useState<{ anio: number; activo: boolean }[]>([
    { anio: 2025, activo: false },
    { anio: 2026, activo: true }
  ]);

  const gradoOptions = [
    { value: 1, label: 'Primero Básico' },
    { value: 2, label: 'Segundo Básico' },
    { value: 3, label: 'Tercero Básico' }
  ];

  const handleAddCurso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoCursoNombre.trim()) {
      showToast('Por favor, ingresa el nombre del curso.', 'error');
      return;
    }
    const nuevoId = `CUR-${nuevoCursoNombre.trim().substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const nuevo: CursoBase = { id: nuevoId, nombre: nuevoCursoNombre.trim() };
    setCursos(prev => [...prev, nuevo]);
    setNuevoCursoNombre('');
    showToast(`Curso "${nuevo.nombre}" agregado con éxito.`, 'success');
  };

  const handleToggleCiclo = (anio: number) => {
    setCiclos(prev => prev.map(c => c.anio === anio ? { ...c, activo: !c.activo } : c));
    showToast(`Ciclo Lectivo ${anio} actualizado.`, 'success');
  };

  // --- 2. ESTADOS PARA SECCIONES Y HORARIOS (COLLISION CHECKER) ---
  const [secciones, setSecciones] = useState<SeccionAsignada[]>([
    { id: 'SEC-101', nombreAsignacion: 'Primero Básico Sección A', gradoId: 'FIRST_BASIC', cicloAnio: 2026, estudiantesIds: ['1', '2'] },
    { id: 'SEC-102', nombreAsignacion: 'Segundo Básico Sección A', gradoId: 'SECOND_BASIC', cicloAnio: 2026, estudiantesIds: ['3'] }
  ]);

  const [seccionGrado, setSeccionGrado] = useState<number>(1);
  const seccionCiclo = 2026;
  const [seccionLetra, setSeccionLetra] = useState<string>('A');

  const [horarios, setHorarios] = useState<PeriodoHorario[]>([
    {
      id: 'HOR-1',
      docenteId: 'DOC-10',
      docenteNombre: 'Prof. Marcos Alonso',
      cursoId: 'CUR-LEN',
      cursoNombre: 'Lenguaje y Literatura',
      seccionId: 'SEC-101',
      seccionNombre: 'Primero Básico Sección A',
      diaSemana: 1, // Lunes
      horaInicio: '07:30',
      horaFin: '08:15'
    },
    {
      id: 'HOR-2',
      docenteId: 'DOC-12',
      docenteNombre: 'Profe Ana',
      cursoId: 'CUR-MAT',
      cursoNombre: 'Matemáticas',
      seccionId: 'SEC-101',
      seccionNombre: 'Primero Básico Sección A',
      diaSemana: 1, // Lunes
      horaInicio: '08:15',
      horaFin: '09:00'
    }
  ]);

  const [nuevoPeriodoDocente, setNuevoPeriodoDocente] = useState<string>('DOC-10'); // Prof. Marcos Alonso
  const [nuevoPeriodoCurso, setNuevoPeriodoCurso] = useState<string>('CUR-LEN');
  const [nuevoPeriodoSeccion, setNuevoPeriodoSeccion] = useState<string>('SEC-101');
  const [nuevoPeriodoDia, setNuevoPeriodoDia] = useState<number>(1); // Lunes
  const [nuevoPeriodoHora, setNuevoPeriodoHora] = useState<string>('07:30'); // 1 = 07:30-08:15, 2 = 08:15-09:00

  // Validar colisiones horarias en tiempo real
  const colisionDetectada = useMemo(() => {
    let horaInicioTarget = '07:30';
    if (nuevoPeriodoHora === '08:15') {
      horaInicioTarget = '08:15';
    }

    // Buscar si el docente ya tiene una clase asignada en el mismo día y hora
    return horarios.some(h => 
      h.docenteId === nuevoPeriodoDocente && 
      h.diaSemana === nuevoPeriodoDia && 
      h.horaInicio === horaInicioTarget
    );
  }, [horarios, nuevoPeriodoDocente, nuevoPeriodoDia, nuevoPeriodoHora]);

  const handleAddPeriodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (colisionDetectada) {
      showToast('Error: Colisión de horarios detectada para este docente.', 'error');
      return;
    }

    const docNombre = nuevoPeriodoDocente === 'DOC-10' ? 'Prof. Marcos Alonso' : 'Profe Ana';
    const curNombre = cursos.find(c => c.id === nuevoPeriodoCurso)?.nombre || 'Curso';
    const secNombre = secciones.find(s => s.id === nuevoPeriodoSeccion)?.nombreAsignacion || 'Sección';

    let horaInicioTarget = '07:30';
    let horaFinTarget = '08:15';
    if (nuevoPeriodoHora === '08:15') {
      horaInicioTarget = '08:15';
      horaFinTarget = '09:00';
    }

    const nuevo: PeriodoHorario = {
      id: `HOR-${Math.floor(100 + Math.random() * 900)}`,
      docenteId: nuevoPeriodoDocente,
      docenteNombre: docNombre,
      cursoId: nuevoPeriodoCurso,
      cursoNombre: curNombre,
      seccionId: nuevoPeriodoSeccion,
      seccionNombre: secNombre,
      diaSemana: nuevoPeriodoDia,
      horaInicio: horaInicioTarget,
      horaFin: horaFinTarget
    };

    setHorarios(prev => [...prev, nuevo]);
    showToast('Periodo académico asignado exitosamente.', 'success');
  };

  const handleAddSeccion = (e: React.FormEvent) => {
    e.preventDefault();
    const gradoLabel = gradoOptions.find(o => o.value === seccionGrado)?.label || 'Grado';
    const asignacionNombre = `${gradoLabel} Sección ${seccionLetra}`;

    const nuevaSec: SeccionAsignada = {
      id: `SEC-${Math.floor(100 + Math.random() * 900)}`,
      nombreAsignacion: asignacionNombre,
      gradoId: seccionGrado === 1 ? 'FIRST_BASIC' : seccionGrado === 2 ? 'SECOND_BASIC' : 'THIRD_BASIC',
      cicloAnio: seccionCiclo,
      estudiantesIds: []
    };

    setSecciones(prev => [...prev, nuevaSec]);
    showToast(`Sección "${asignacionNombre}" estructurada de forma persistente.`, 'success');
  };

  // --- 3. ESTADOS PARA VINCULACIÓN Y MATRÍCULA ---
  const [estudiantes, setEstudiantes] = useState([
    { id: '1', nombre: 'Juan Pérez', seleccionado: false, matriculado: 'SEC-101' },
    { id: '2', nombre: 'María Gómez', seleccionado: false, matriculado: 'SEC-101' },
    { id: '3', nombre: 'Carlos Ruiz', seleccionado: false, matriculado: 'SEC-102' },
    { id: '4', nombre: 'Luis Morales', seleccionado: false, matriculado: 'Ninguno' },
    { id: '5', nombre: 'Sofía Díaz', seleccionado: false, matriculado: 'Ninguno' }
  ]);

  const [tutorSeleccionado, setTutorSeleccionado] = useState<string | null>(null);
  const [matriculaSeccion, setMatriculaSeccion] = useState('SEC-101');

  const toggleEstudiante = (id: string) => {
    setEstudiantes(prev => prev.map(e => e.id === id ? { ...e, seleccionado: !e.seleccionado } : e));
  };

  const handleVincularTutor = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedCount = estudiantes.filter(e => e.seleccionado).length;
    if (selectedCount === 0 || !tutorSeleccionado) {
      showToast('Selecciona al menos un alumno y un Encargado.', 'error');
      return;
    }
    showToast(`Viculación familiar: ${selectedCount} alumnos asociados a ${tutorSeleccionado}.`, 'success');
    // Resetear
    setEstudiantes(prev => prev.map(e => ({ ...e, seleccionado: false })));
    setTutorSeleccionado(null);
  };

  const handleMatricularMasivo = () => {
    const selectedCount = estudiantes.filter(e => e.seleccionado).length;
    if (selectedCount === 0) {
      showToast('Selecciona alumnos para matricular de forma masiva.', 'error');
      return;
    }

    const secNombre = secciones.find(s => s.id === matriculaSeccion)?.nombreAsignacion || 'Sección';
    setEstudiantes(prev => prev.map(e => e.seleccionado ? { ...e, matriculado: matriculaSeccion, seleccionado: false } : e));
    showToast(`Matrícula exitosa: ${selectedCount} alumnos inscritos en "${secNombre}".`, 'success');
  };

  // --- 4. ESTADOS PARA COBRO DE CAJA MANUAL ---
  const [pagos, setPagos] = useState<PagoAsentado[]>([
    { id: 'PAG-101', estudianteId: '1', estudianteNombre: 'Juan Pérez', mesCiclo: 1, monto: 400, referenciaRecibo: 'REC-5020', fechaTransaccion: '2026-05-29' },
    { id: 'PAG-102', estudianteId: '2', estudianteNombre: 'María Gómez', mesCiclo: 1, monto: 400, referenciaRecibo: 'REC-5021', fechaTransaccion: '2026-05-29' }
  ]);
  const [pagoEstudiante, setPagoEstudiante] = useState('1');
  const [pagoMes, setPagoMes] = useState<number>(2); // Febrero
  const [pagoMonto, setPagoMonto] = useState('400');
  const [pagoRecibo, setPagoRecibo] = useState('');

  const handleRegistrarPago = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pagoRecibo.trim() || !pagoMonto) {
      showToast('Completa los campos de cobro de caja.', 'error');
      return;
    }

    const estNombre = estudiantes.find(e => e.id === pagoEstudiante)?.nombre || 'Estudiante';
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

      {/* --- TAB 1: CONFIGURACIÓN BASE (CATÁLOGOS) --- */}
      {activeSubTab === 'catalogos' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Formulario Cursos (Lef Side - Column 5) */}
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

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Grado Recomendado (Filtro)
                  </label>
                  {/* Queda prohibido select nativo. Usando CustomSelect átomo */}
                  <CustomSelect
                    options={gradoOptions}
                    value={selectedGrado}
                    onChange={(val) => setSelectedGrado(val)}
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
                {cursos.map(c => (
                  <div key={c.id} className="py-2.5 flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{c.nombre}</span>
                    <span className="font-mono text-[10px] text-slate-400 font-bold bg-slate-50 border border-slate-100 rounded px-1.5 py-0.5">{c.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ciclos y Grados Bento Grid (Right Side - Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Ciclos Bento Panel */}
            <div className="bg-white border border-slate-150 rounded-lg p-6 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <Calendar size={16} className="text-[#2563EB]" />
                Ciclos Escolares Activos
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Administra e inicializa ciclos académicos. Solo los ciclos activos permiten matrículas y registro financiero.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {ciclos.map(c => (
                  <button
                    key={c.anio}
                    onClick={() => handleToggleCiclo(c.anio)}
                    className={`p-4 rounded-lg border text-left flex flex-col justify-between h-28 cursor-pointer transition ${
                      c.activo
                        ? 'border-[#2563EB] bg-blue-50/20'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Ciclo Lectivo
                    </span>
                    <span className="text-3xl font-black text-slate-900 block mt-1">{c.anio}</span>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mt-2 ${
                      c.activo ? 'text-[#2563EB]' : 'text-[#64748B]'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${c.activo ? 'bg-[#2563EB]' : 'bg-slate-400'}`}></span>
                      {c.activo ? 'Ciclo Activo' : 'Inactivo'}
                    </span>
                  </button>
                ))}
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
                  <span className="font-bold text-slate-200">FIRST_BASIC</span>
                  <span className="text-blue-400 font-bold">Primero Básico</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded">
                  <span className="font-bold text-slate-200">SECOND_BASIC</span>
                  <span className="text-blue-400 font-bold">Segundo Básico</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-2.5 rounded">
                  <span className="font-bold text-slate-200">THIRD_BASIC</span>
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
          
          {/* Creación de Secciones (Lef Side - Column 5) */}
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
                      Ciclo
                    </label>
                    <input
                      type="number"
                      readOnly
                      value={seccionCiclo}
                      className="block w-full rounded-[4px] border border-slate-200 bg-slate-50 py-2.5 px-3 text-slate-500 text-xs focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Identificador Sección
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
                Secciones Estructuradas Activas
              </h4>
              <div className="space-y-2">
                {secciones.map(s => (
                  <div key={s.id} className="p-3 bg-slate-50 border border-slate-100 rounded flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-slate-900">{s.nombreAsignacion}</strong>
                      <span className="text-[10px] text-[#64748B]">Ciclo Lectivo {s.cicloAnio}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded">{s.id}</span>
                  </div>
                ))}
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
                El programador validará colisiones horarias del docente en tiempo real. Intenta registrar a un docente en el mismo día y hora para ver la alerta de colisión.
              </p>

              {/* Form de Programación */}
              <form onSubmit={handleAddPeriodo} className="space-y-4 bg-slate-50/50 p-4 border border-slate-100 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Docente</label>
                    <select
                      value={nuevoPeriodoDocente}
                      onChange={(e) => setNuevoPeriodoDocente(e.target.value)}
                      className="block w-full border border-slate-200 py-2 px-2.5 rounded bg-white"
                    >
                      <option value="DOC-10">Prof. Marcos Alonso</option>
                      <option value="DOC-12">Profe Ana</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Curso</label>
                    <select
                      value={nuevoPeriodoCurso}
                      onChange={(e) => setNuevoPeriodoCurso(e.target.value)}
                      className="block w-full border border-slate-200 py-2 px-2.5 rounded bg-white"
                    >
                      {cursos.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Sección</label>
                    <select
                      value={nuevoPeriodoSeccion}
                      onChange={(e) => setNuevoPeriodoSeccion(e.target.value)}
                      className="block w-full border border-slate-200 py-2 px-2.5 rounded bg-white"
                    >
                      {secciones.map(s => (
                        <option key={s.id} value={s.id}>{s.nombreAsignacion}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Día</label>
                    <select
                      value={nuevoPeriodoDia}
                      onChange={(e) => setNuevoPeriodoDia(parseInt(e.target.value))}
                      className="block w-full border border-slate-200 py-2 px-2.5 rounded bg-white"
                    >
                      <option value={1}>Lunes</option>
                      <option value={2}>Martes</option>
                      <option value={3}>Miércoles</option>
                      <option value={4}>Jueves</option>
                      <option value={5}>Viernes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-500 uppercase mb-1">Periodo Horario</label>
                    <select
                      value={nuevoPeriodoHora}
                      onChange={(e) => setNuevoPeriodoHora(e.target.value)}
                      className="block w-full border border-slate-200 py-2 px-2.5 rounded bg-white"
                    >
                      <option value="07:30">1° Periodo (07:30 - 08:15)</option>
                      <option value="08:15">2° Periodo (08:15 - 09:00)</option>
                    </select>
                  </div>
                </div>

                {/* ALERTA DE COLISIÓN HORARIA EN TIEMPO REAL */}
                {colisionDetectada && (
                  <div className="flex gap-2.5 bg-red-50 border border-red-100 text-red-700 text-xs p-3 rounded-[4px] animate-in fade-in slide-in-from-top-1 duration-200">
                    <AlertCircle className="shrink-0 text-red-600" size={16} />
                    <span>
                      <strong>¡COLISIÓN HORARIA DETECTADA!</strong> El docente seleccionado ya tiene programada una clase en este periodo del día. La base de datos denegará la transacción.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={colisionDetectada}
                  className={`flex w-full items-center justify-center gap-2 rounded-[4px] py-2.5 text-xs font-bold transition shadow-sm ${
                    colisionDetectada
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-[#2563EB] hover:bg-[#1d4ed8] text-white'
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
                  {horarios.map(h => (
                    <div key={h.id} className="p-3 bg-white border border-slate-150 rounded flex justify-between items-center text-xs shadow-sm">
                      <div>
                        <strong className="block text-slate-900">{h.cursoNombre}</strong>
                        <span className="text-[10px] text-slate-500 block">Docente: {h.docenteNombre}</span>
                        <span className="text-[10px] text-[#64748B]">Sección: {h.seccionNombre}</span>
                      </div>
                      <div className="text-right text-[10px] font-mono">
                        <span className="block font-bold text-[#2563EB]">{h.diaSemana === 1 ? 'Lunes' : 'Martes'}</span>
                        <span className="text-slate-400">{h.horaInicio} - {h.horaFin}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* --- TAB 3: MATRÍCULA Y FAMILIAS --- */}
      {activeSubTab === 'vinculaciones' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Listado Masivo de Alumnos (Lef Side - Column 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Users size={16} className="text-[#2563EB]" />
                  Selección Masiva de Alumnos (`StudentMassPicker`)
                </h3>
                <span className="bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded text-slate-600">
                  {estudiantes.filter(e => e.seleccionado).length} seleccionados
                </span>
              </div>

              {/* Lista interactiva */}
              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                {estudiantes.map(e => (
                  <label key={e.id} className="flex items-center justify-between py-3 px-2.5 hover:bg-slate-50 rounded cursor-pointer transition">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={e.seleccionado}
                        onChange={() => toggleEstudiante(e.id)}
                        className="h-4 w-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]"
                      />
                      <div>
                        <strong className="text-xs text-slate-900">{e.nombre}</strong>
                        <span className="block text-[9px] text-slate-400">ID: ALU-0{e.id}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold border ${
                        e.matriculado === 'Ninguno'
                          ? 'bg-amber-50 border-amber-100 text-amber-700'
                          : 'bg-emerald-50 border-emerald-100 text-emerald-700'
                      }`}>
                        {e.matriculado === 'Ninguno' ? 'Sin Matrícula' : `Inscrito en ${secciones.find(s => s.id === e.matriculado)?.nombreAsignacion || e.matriculado}`}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Acciones de Matrícula y Tutores (Right Side - Column 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Matrícula Masiva */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <CheckSquare size={16} className="text-[#2563EB]" />
                Matrícula de Grupo Activo
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Asigna de forma masiva los alumnos seleccionados del picker a una sección y ciclo lectivo específico.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Seleccionar Sección Destino
                  </label>
                  <select
                    value={matriculaSeccion}
                    onChange={(e) => setMatriculaSeccion(e.target.value)}
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white"
                  >
                    {secciones.map(s => (
                      <option key={s.id} value={s.id}>{s.nombreAsignacion}</option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleMatricularMasivo}
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  <CheckSquare size={14} />
                  <span>Matricular Alumnos Seleccionados</span>
                </button>
              </div>
            </div>

            {/* Vinculación Familiar */}
            <div className="bg-white border border-slate-150 rounded-lg p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
                <Users size={16} className="text-[#2563EB]" />
                Vincular Encargado/Tutor
              </h3>
              <p className="text-[11px] text-[#64748B] mb-4">
                Asocia un único Encargado/Padre de Familia a los alumnos seleccionados para otorgarle acceso a su boleta de calificaciones.
              </p>

              <form onSubmit={handleVincularTutor} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Encargado de Familia
                  </label>
                  <select
                    value={tutorSeleccionado || ''}
                    onChange={(e) => setTutorSeleccionado(e.target.value || null)}
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white"
                  >
                    <option value="">Selecciona un Encargado...</option>
                    <option value="Sr. Carlos Gómez">Sr. Carlos Gómez (Padre)</option>
                    <option value="Sra. Mónica Ruano">Sra. Mónica Ruano (Madre)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[#2563EB] hover:bg-[#1d4ed8] text-white py-2.5 text-xs font-bold transition shadow-sm cursor-pointer"
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
          
          {/* Formulario Caja Manual (Lef Side - Column 5) */}
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
                    className="block w-full border border-slate-200 py-2.5 px-3 text-xs rounded bg-white"
                  >
                    {estudiantes.map(e => (
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
                        <td className="py-2 px-3 text-right font-bold text-slate-900">Q{p.monto.toFixed(2)}</td>
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
