import { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ConfigurationModal from './components/ConfigurationModal';
import Login from './modules/Public/Login';
import ControlAcademicoDashboard from './components/organisms/ControlAcademicoDashboard';
import DocenteDashboard from './components/organisms/DocenteDashboard';
import ParentDashboard from './components/organisms/ParentDashboard';
import AlumnoDashboard from './components/organisms/AlumnoDashboard';
import Usuarios from './modules/Admin/Usuarios';
import Backups from './modules/Admin/Backups';
import Alumnos from './components/organisms/Alumnos';
import Encargados from './components/organisms/Encargados';
import Docentes from './components/organisms/Docentes';
import {
  AlertTriangle,
  Search,
  Sparkles
} from 'lucide-react';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const getDefaultTab = () => {
    if (!user) return 'login';
    if (user.idRol === 1) return 'backups';
    if (user.idRol === 2) return 'control-academico';
    if (user.idRol === 3) return 'calificaciones';
    if (user.idRol === 4) return 'aventura-kids';
    if (user.idRol === 5) return 'parent-portal';
    return 'login';
  };

  // Ajustar la pestaña activa por defecto según el rol del usuario cuando se autentique
  useEffect(() => {
    if (isAuthenticated && user) {
      setActiveTab(getDefaultTab());
    } else {
      setActiveTab('login');
    }
  }, [isAuthenticated, user]);

  // --- ENLACES Y ESTADOS REALES DE BASE DE DATOS (CONEXIÓN SQL SERVER) ---

  // 2. Módulo Bitácora: Cargar datos auténticos de SQL Server
  const [bitacorasList, setBitacorasList] = useState<any[]>([]);
  const [isLoadingBitacoras, setIsLoadingBitacoras] = useState(false);
  const [bitacoraError, setBitacoraError] = useState<string | null>(null);
  const [searchBitacora, setSearchBitacora] = useState('');
  const [filterAction, setFilterAction] = useState('ALL');

  const fetchBitacoras = async () => {
    setIsLoadingBitacoras(true);
    setBitacoraError(null);
    try {
      const res = await fetch('http://localhost:4000/api/admin/bitacoras');
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.error || errData?.message || 'Error de comunicación.');
      }
      const data = await res.json();
      setBitacorasList(data);
    } catch (err: any) {
      console.error(err);
      setBitacoraError(err.message || 'Error de conexión con la API.');
    } finally {
      setIsLoadingBitacoras(false);
    }
  };

  // Efecto para recargar la bitácora real de base de datos
  useEffect(() => {
    if (isAuthenticated && user?.idRol === 1 && activeTab === 'bitacoras') {
      fetchBitacoras();
    }
  }, [isAuthenticated, user, activeTab]);



  const filteredBitacora = bitacorasList.filter(b => {
    const usuarioStr = b.Usuario || 'Sistema/Trigger';
    const tablaStr = b.TablaAfectada || '';
    const detalleStr = b.Detalle || '';
    const matchesSearch = usuarioStr.toLowerCase().includes(searchBitacora.toLowerCase()) || 
                          tablaStr.toLowerCase().includes(searchBitacora.toLowerCase()) ||
                          detalleStr.toLowerCase().includes(searchBitacora.toLowerCase());
    const matchesAction = filterAction === 'ALL' || (b.Accion && b.Accion.startsWith(filterAction));
    return matchesSearch && matchesAction;
  });

  const totalLogs = bitacorasList.length;
  const insertCount = bitacorasList.filter(b => b.Accion && b.Accion.startsWith('INSERT')).length;
  const updateCount = bitacorasList.filter(b => b.Accion && b.Accion.startsWith('UPDATE')).length;
  const deleteCount = bitacorasList.filter(b => b.Accion && b.Accion.startsWith('DELETE')).length;



  // 4. Módulo Boleta (Alumno) State
  const mockBoleta = [
    { materia: 'Matemáticas Avanzadas', tareas: '95', examenes: '85', final: 88.0, estado: 'Aprobado' },
    { materia: 'Física Clásica', tareas: '62', examenes: '55', final: 57.1, estado: 'Reprobado' },
    { materia: 'Ciencias y Laboratorio', tareas: '88', examenes: '92', final: 90.8, estado: 'Aprobado' },
    { materia: 'Historia Universal', tareas: '100', examenes: '95', final: 96.5, estado: 'Aprobado' },
    { materia: 'Química Orgánica', tareas: '75', examenes: '80', final: 78.5, estado: 'Aprobado' }
  ];

  const overallGpa = (mockBoleta.reduce((acc, curr) => acc + curr.final, 0) / mockBoleta.length).toFixed(1);

  // 5. Módulo Métricas IA (Alumno/Padre)
  const mockPrediction = {
    riesgo: 24.5, // 24.5% de riesgo académico
    materiaDebil: 'Física Clásica',
    recomendacion: 'La IA del colegio detecta un rendimiento inferior en los temas de cinemática y leyes de Newton. Se le aconseja al alumno realizar las tutorías del Profesor los días jueves y utilizar el módulo de ejercicios interactivos en línea.'
  };

  const mockMetricas = [
    { nombre: 'Velocidad de Resolución', valor: 72, color: 'bg-emerald-500' },
    { nombre: 'Precisión en Prácticas', valor: 84, color: 'bg-indigo-500' },
    { nombre: 'Dificultad de Ejercicios', valor: 58, color: 'bg-amber-500' }
  ];

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans antialiased text-slate-800">
      {/* Sidebar de Navegación Lateral */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onOpenConfig={() => setIsConfigOpen(true)} />

      {/* Área de Contenido Principal a la derecha */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Cuerpo del Módulo Dinámico con Rejilla de Columnas (2/3 de Ancho y 1/3 Lateral, exacto al ejemplo) */}
        <main className="flex-grow p-8 max-w-7xl w-full mx-auto">
          
          {/* TAB 0: CONTROL ACADÉMICO (CONTROL ACADÉMICO: ROL 2) */}
          {activeTab === 'control-academico' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <ControlAcademicoDashboard activeSubTab="catalogos" />
            </ProtectedRoute>
          )}

          {activeTab === 'control-academico-secciones' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <ControlAcademicoDashboard activeSubTab="secciones" />
            </ProtectedRoute>
          )}

          {activeTab === 'control-academico-vinculaciones' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <ControlAcademicoDashboard activeSubTab="vinculaciones" />
            </ProtectedRoute>
          )}

          {activeTab === 'colegiaturas' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <ControlAcademicoDashboard activeSubTab="caja" />
            </ProtectedRoute>
          )}

          {/* SUB-TABS CONTROL ACADÉMICO */}
          {activeTab === 'control-academico-alumnos' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <Alumnos />
            </ProtectedRoute>
          )}

          {activeTab === 'control-academico-encargados' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <Encargados />
            </ProtectedRoute>
          )}

          {activeTab === 'control-academico-docentes' && (
            <ProtectedRoute allowedRoles={[2]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <Docentes />
            </ProtectedRoute>
          )}

          {/* TAB 1: MÓDULO DE BACKUPS (ADMIN: ROL 1) */}
          {activeTab === 'backups' && (
            <ProtectedRoute allowedRoles={[1]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <Backups />
            </ProtectedRoute>
          )}

          {/* TAB 2: BITÁCORAS DE AUDITORÍA (ADMIN: ROL 1) */}
          {activeTab === 'bitacoras' && (
            <ProtectedRoute allowedRoles={[1]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Bitácoras del Sistema
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Historial de auditoría interna de base de datos. Bloquea eliminaciones físicas mediante auditorías automáticas en triggers.
                  </p>
                </div>

                {/* Estructura con 2/3 y 1/3 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Columna Principal (2/3) - Listado de Transacciones */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Filtros e Interactividad */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl bg-white border border-slate-100 p-4 shadow-sm">
                      <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Buscar por operador o tabla..."
                          value={searchBitacora}
                          onChange={(e) => setSearchBitacora(e.target.value)}
                          className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none"
                        />
                      </div>

                      <div className="flex gap-1 w-full sm:w-auto overflow-x-auto">
                        {['ALL', 'INSERT', 'UPDATE', 'DELETE'].map((action) => (
                          <button
                            key={action}
                            onClick={() => setFilterAction(action)}
                            className={`rounded-lg px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                              filterAction === action
                                ? 'bg-slate-950 text-white shadow-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/50'
                            }`}
                          >
                            {action === 'ALL' ? 'Todos' : action}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tabla de Bitácora */}
                    <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-2.5 px-4">ID</th>
                              <th className="py-2.5 px-4">Usuario</th>
                              <th className="py-2.5 px-4">Acción</th>
                              <th className="py-2.5 px-4">Tabla</th>
                              <th className="py-2.5 px-4">Detalle</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600 font-mono text-[10px]">
                            {isLoadingBitacoras ? (
                              <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-slate-400 font-sans">
                                  <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
                                    <span>Conectando y cargando bitácora desde SQL Server...</span>
                                  </div>
                                </td>
                              </tr>
                            ) : bitacoraError ? (
                              <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-red-600 font-sans bg-red-50/20 border-b border-red-100">
                                  <span>Fallo al conectar con la base de datos local: <b>{bitacoraError}</b></span>
                                </td>
                              </tr>
                            ) : filteredBitacora.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="py-8 px-4 text-center text-slate-400 italic font-sans bg-slate-50/30">
                                  La tabla de Bitácora está vacía en la base de datos 'SistemaColegio' (La lista está vacía).
                                </td>
                              </tr>
                            ) : (
                              filteredBitacora.map((bit) => (
                                <tr key={bit.IdBitacora} className="hover:bg-slate-50/50 transition-colors">
                                  <td className="py-3 px-4 text-slate-400">{bit.IdBitacora}</td>
                                  <td className="py-3 px-4 font-semibold text-slate-800 font-sans">{bit.Usuario || 'Sistema / Trigger'}</td>
                                  <td className="py-3 px-4">
                                    <span
                                      className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold border ${
                                        bit.Accion === 'INSERT'
                                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                          : bit.Accion === 'UPDATE'
                                          ? 'bg-blue-50 border-blue-100 text-blue-700'
                                          : bit.Accion === 'DELETE'
                                          ? 'bg-red-50 border-red-100 text-red-700'
                                          : 'bg-slate-50 border-slate-100 text-slate-700'
                                      }`}
                                    >
                                      {bit.Accion}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4 text-slate-700 font-bold">{bit.TablaAfectada}</td>
                                  <td className="py-3 px-4 text-slate-500 break-all font-mono text-[9px]">{bit.Detalle}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Columna Lateral (1/3) */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Live Stats */}
                    <div className="rounded-xl bg-slate-950 p-5 shadow-xl text-white space-y-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Volumen de Auditoría
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1 leading-none">
                          {totalLogs.toLocaleString()}
                        </h2>
                        <span className="text-[9px] text-slate-400 block mt-1">Registros totales en Bitácora</span>
                      </div>

                      <div className="border-t border-slate-800 pt-3 text-[10px] space-y-1.5 text-slate-400">
                        <div className="flex justify-between">
                          <span>Operaciones INSERT:</span>
                          <span className="font-bold text-slate-200">{insertCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operaciones UPDATE:</span>
                          <span className="font-bold text-slate-200">{updateCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Operaciones DELETE:</span>
                          <span className="font-bold text-slate-200">{deleteCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Insights de Auditoría */}
                    <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-50 pb-2">
                        Políticas de Integridad
                      </h3>
                      <div className="flex gap-2 bg-red-50/50 p-3 rounded-lg border border-red-100 text-[10px] text-slate-600 leading-normal">
                        <AlertTriangle className="text-red-600 shrink-0 mt-0.5" size={14} />
                        <span><b>Resguardo Histórico:</b> El trigger de borrado intercepta bajas físicas en la tabla <code className="font-mono text-[9px]">Calificacion</code> y las redirige hacia la bitácora física de auditoría.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          )}

          {/* TAB 2.5: GESTIÓN DE USUARIOS (ADMIN: ROL 1) */}
          {activeTab === 'usuarios' && (
            <ProtectedRoute allowedRoles={[1]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <Usuarios />
            </ProtectedRoute>
          )}

          {/* TAB 3: ASENTAR CALIFICACIONES (PROFESOR: ROL 3) */}
          {activeTab === 'calificaciones' && (
            <ProtectedRoute allowedRoles={[3]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <DocenteDashboard />
            </ProtectedRoute>
          )}

          {/* TAB 4: AVENTURA KIDS (ALUMNO: ROL 4) */}
          {activeTab === 'aventura-kids' && (
            <ProtectedRoute allowedRoles={[4]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <AlumnoDashboard />
            </ProtectedRoute>
          )}

          {/* TAB 4.5: PORTAL DE PADRES (PADRE: ROL 5) */}
          {activeTab === 'parent-portal' && (
            <ProtectedRoute allowedRoles={[5]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <ParentDashboard />
            </ProtectedRoute>
          )}

          {/* TAB 4: VISUALIZAR BOLETA (ALUMNO/PADRE: ROL 4 O 5) */}
          {activeTab === 'boleta' && (
            <ProtectedRoute allowedRoles={[4, 5]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Boleta de Calificaciones
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Historial académico en tiempo real. La nota definitiva se consolida a partir del acumulado de tareas y exámenes.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Tabla Principal Boleta (2/3 de ancho) */}
                  <div className="lg:col-span-2 space-y-6">
                    <div className="rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                          Consolidado de Asignaturas del Ciclo
                        </h3>
                        <span className="rounded bg-slate-950 text-[9px] px-2 py-0.5 text-white font-bold">
                          Ciclo Técnico 2026
                        </span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                              <th className="py-3 px-4">Asignatura</th>
                              <th className="py-3 px-4">Tareas (35%)</th>
                              <th className="py-3 px-4">Exámenes (65%)</th>
                              <th className="py-3 px-4 text-center">Calificación Final</th>
                              <th className="py-3 px-4 text-center">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-600">
                            {mockBoleta.map((m, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-3 px-4 font-semibold text-slate-900">{m.materia}</td>
                                <td className="py-3 px-4 font-mono text-slate-400">{m.tareas} / 100</td>
                                <td className="py-3 px-4 font-mono text-slate-400">{m.examenes} / 100</td>
                                <td className="py-3 px-4 text-center font-mono font-bold">
                                  <span className={m.final >= 60 ? 'text-emerald-600' : 'text-red-500'}>
                                    {m.final.toFixed(1)}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <span
                                    className={`inline-flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-[9px] font-bold border ${
                                      m.final >= 60
                                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                                        : 'bg-red-50 border-red-100 text-red-700'
                                    }`}
                                  >
                                    {m.estado}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Columna Lateral (1/3 de ancho) */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Tarjeta Promedio Acumulado (Estilo Live Attendance Stats) */}
                    <div className="rounded-xl bg-slate-950 p-5 shadow-xl text-white space-y-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Promedio General (GPA)
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1 leading-none">
                          {overallGpa}
                        </h2>
                        <span className="text-[9px] text-slate-400 block mt-1">Acumulado ponderado de materias</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-left">
                        <div>
                          <span className="block text-[9px] uppercase tracking-wide text-slate-500">Materias</span>
                          <span className="text-xs font-bold text-slate-200">5 Cursadas</span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wide text-slate-500">Estatus</span>
                          <span className="text-xs font-bold text-slate-200">Aprobado</span>
                        </div>
                      </div>
                    </div>

                    {/* Insights Académicos */}
                    <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-50">
                        Atención del Alumno
                      </h3>
                      <div className="flex gap-2.5 bg-amber-50/50 p-3 rounded-lg border border-amber-100/60 text-[10px] text-slate-600 leading-normal">
                        <AlertTriangle className="text-amber-600 shrink-0 mt-0.5" size={14} />
                        <span><b>Alerta en Física Clásica:</b> Tu nota final (57.1) está por debajo de los requisitos mínimos del colegio. Te aconsejamos contactar con tu profesor para planes de mejoramiento.</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ProtectedRoute>
          )}

          {/* TAB 5: MÉTRICAS IA (ALUMNO/PADRE: ROL 4 O 5) */}
          {activeTab === 'ia-metrics' && (
            <ProtectedRoute allowedRoles={[4, 5]} onFallbackNavigate={() => setActiveTab(getDefaultTab())}>
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
                    Métricas de IA Predictivas
                  </h1>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Análisis automatizado en base a tu rendimiento, velocidad y precisión resguardado en la base de datos local.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Métricas Cognitivas (2/3 de ancho) */}
                  <div className="lg:col-span-2 space-y-6">
                    {/* Indicadores Cognitivos */}
                    <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-50 mb-4">
                        Indicadores de Rendimiento Cognitivo (MetricasRendimiento)
                      </h3>

                      <div className="space-y-5">
                        {mockMetricas.map((met, idx) => (
                          <div key={idx} className="space-y-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center text-[10px] font-semibold text-slate-700">
                              <span className="uppercase tracking-wider">{met.nombre}</span>
                              <span className="font-mono text-slate-900 font-bold">{met.valor}%</span>
                            </div>
                            <div className="w-full bg-slate-200/50 h-2 rounded-full overflow-hidden">
                              <div className={`h-full ${met.color} rounded-full`} style={{ width: `${met.valor}%` }}></div>
                            </div>
                            <p className="text-[9px] text-slate-400">
                              {met.nombre === 'Velocidad de Resolución' && 'Mide la agilidad para responder evaluaciones académicas en tiempo y forma.'}
                              {met.nombre === 'Precisión en Prácticas' && 'Mide el porcentaje de respuestas asertivas correctas guardadas en la bitácora.'}
                              {met.nombre === 'Dificultad de Ejercicios' && 'Mide el nivel de retos complejos afrontados y resueltos.'}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Columna Lateral Predictiva (1/3 de ancho - Fiel a Live Stats) */}
                  <div className="lg:col-span-1 space-y-6">
                    {/* Riesgo de Reprobación */}
                    <div className="rounded-xl bg-slate-950 p-5 shadow-xl text-white space-y-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                          Riesgo Académico de Reprobación
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1 leading-none">
                          {mockPrediction.riesgo}%
                        </h2>
                        <span className="text-[9px] text-emerald-400 font-bold block mt-1">Riesgo Académico Bajo</span>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-left">
                        <div>
                          <span className="block text-[9px] uppercase tracking-wide text-slate-500">Materia Débil</span>
                          <span className="text-xs font-bold text-slate-200">{mockPrediction.materiaDebil}</span>
                        </div>
                        <div>
                          <span className="block text-[9px] uppercase tracking-wide text-slate-500">Predicción IA</span>
                          <span className="text-xs font-bold text-slate-200">Bajo Riesgo</span>
                        </div>
                      </div>
                    </div>

                    {/* Recomendación de IA en widget */}
                    <div className="rounded-xl bg-white border border-slate-100 p-5 shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-50">
                        Consejo Predictivo de IA
                      </h3>
                      <div className="flex gap-2 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-[10px] text-slate-600 leading-normal">
                        <Sparkles className="text-indigo-600 shrink-0 mt-0.5" size={14} />
                        <span>{mockPrediction.recomendacion}</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </ProtectedRoute>
          )}

        </main>
      </div>

      <ConfigurationModal isOpen={isConfigOpen} onClose={() => setIsConfigOpen(false)} />
    </div>
  );
}
