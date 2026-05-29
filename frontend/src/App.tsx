import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Database,
  Download,
  FileSpreadsheet,
  FileText,
  Flame,
  GraduationCap,
  HelpCircle,
  Home,
  Library,
  LineChart,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';

type Role = 'admin' | 'teacher' | 'student' | 'family';
type User = { email: string; name: string; role: Role };
type View = string;

const demoUsers: Record<string, User & { password: string }> = {
  'admin.prof@demo.com': { email: 'admin.prof@demo.com', password: '123456', name: 'Admin Profesores', role: 'admin' },
  'profe@demo.com': { email: 'profe@demo.com', password: '123456', name: 'Profesor Demo', role: 'teacher' },
  'alumno@demo.com': { email: 'alumno@demo.com', password: '123456', name: 'Leo Alumno', role: 'student' },
  'familia@demo.com': { email: 'familia@demo.com', password: '123456', name: 'Familia Demo', role: 'family' },
};

const teachers = [
  { name: 'Elena Rodriguez', specialty: 'Matematicas', email: 'erodriguez@sige.edu.gt', status: 'Activo', load: 86, committees: 'Evaluacion, Olimpiadas' },
  { name: 'Marco Fuentes', specialty: 'Fisica', email: 'mfuentes@sige.edu.gt', status: 'Revision', load: 72, committees: 'Laboratorio' },
  { name: 'Sofia Morales', specialty: 'Literatura', email: 'smorales@sige.edu.gt', status: 'Activo', load: 64, committees: 'Lectura, Cultura' },
  { name: 'Daniel Herrera', specialty: 'Sociales', email: 'dherrera@sige.edu.gt', status: 'Inactivo', load: 28, committees: 'Civismo' },
];

const subjects = [
  { name: 'Matematicas I', teacher: 'Elena Rodriguez', grade: '5to Primaria', activities: 18, status: 'Operativa' },
  { name: 'Fisica Experimental', teacher: 'Marco Fuentes', grade: 'Basico', activities: 12, status: 'Conflictiva' },
  { name: 'Literatura Universal', teacher: 'Sofia Morales', grade: 'Basico', activities: 15, status: 'Operativa' },
];

const studentTasks = [
  { title: 'Tabla del 7', course: 'Matematicas', due: 'Hoy 4:00 PM', status: 'Pendiente', points: 40 },
  { title: 'Resumen del bosque encantado', course: 'Lectura', due: 'Manana', status: 'En progreso', points: 25 },
  { title: 'Diario de experimento', course: 'Ciencias', due: 'Viernes', status: 'Nuevo', points: 30 },
];

const grades = [
  { course: 'Matematicas', score: 92, note: 'Excelente razonamiento numerico' },
  { course: 'Lectura', score: 88, note: 'Buen ritmo de comprension' },
  { course: 'Ciencias', score: 94, note: 'Observacion destacada' },
  { course: 'Arte', score: 85, note: 'Creatividad en progreso' },
];

const resources = [
  { title: 'Fracciones con pizza', type: 'Video', minutes: 8 },
  { title: 'Mini laboratorio de semillas', type: 'Guia', minutes: 15 },
  { title: 'Atlas de animales', type: 'Libro digital', minutes: 20 },
  { title: 'Plantilla de proyecto', type: 'Descargable', minutes: 4 },
];

const navByRole: Record<Role, Array<{ id: View; label: string; icon: ReactNode }>> = {
  admin: [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <Home size={19} /> },
    { id: 'admin-teachers', label: 'Profesores', icon: <GraduationCap size={19} /> },
    { id: 'admin-subjects', label: 'Materias', icon: <BookOpen size={19} /> },
    { id: 'admin-committees', label: 'Comites', icon: <Users size={19} /> },
    { id: 'admin-reports', label: 'Reportes y OLAP', icon: <BarChart3 size={19} /> },
    { id: 'admin-backups', label: 'Backups', icon: <Database size={19} /> },
  ],
  teacher: [
    { id: 'teacher-dashboard', label: 'Dashboard', icon: <Home size={19} /> },
    { id: 'teacher-grades', label: 'Clases y notas', icon: <ClipboardList size={19} /> },
    { id: 'teacher-task', label: 'Nueva tarea', icon: <Plus size={19} /> },
    { id: 'teacher-resources', label: 'Biblioteca', icon: <Library size={19} /> },
    { id: 'teacher-committees', label: 'Comites', icon: <Users size={19} /> },
    { id: 'teacher-support', label: 'Soporte', icon: <HelpCircle size={19} /> },
  ],
  student: [
    { id: 'student-home', label: 'Inicio', icon: <Home size={19} /> },
    { id: 'student-classes', label: 'Mis clases', icon: <GraduationCap size={19} /> },
    { id: 'student-tasks', label: 'Misiones', icon: <ClipboardList size={19} /> },
    { id: 'student-grades', label: 'Notas', icon: <Star size={19} /> },
    { id: 'student-calendar', label: 'Calendario', icon: <CalendarDays size={19} /> },
    { id: 'student-library', label: 'Biblioteca', icon: <Library size={19} /> },
  ],
  family: [
    { id: 'family-dashboard', label: 'Resumen', icon: <Home size={19} /> },
    { id: 'family-students', label: 'Alumnos', icon: <Users size={19} /> },
    { id: 'family-progress', label: 'Seguimiento', icon: <LineChart size={19} /> },
    { id: 'family-payments', label: 'Pagos', icon: <CreditCard size={19} /> },
    { id: 'family-calendar', label: 'Calendario', icon: <CalendarDays size={19} /> },
    { id: 'family-messages', label: 'Comunicacion', icon: <MessageSquare size={19} /> },
  ],
};

const defaultView: Record<Role, View> = {
  admin: 'admin-dashboard',
  teacher: 'teacher-dashboard',
  student: 'student-home',
  family: 'family-dashboard',
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('login');
  const [loginError, setLoginError] = useState('');

  const login = (email: string, password: string) => {
    const found = demoUsers[email.trim().toLowerCase()];
    if (!found || found.password !== password) {
      setLoginError('Credenciales demo invalidas. Usa la contrasena 123456.');
      return;
    }
    const nextUser = { email: found.email, name: found.name, role: found.role };
    setUser(nextUser);
    setView(defaultView[nextUser.role]);
    setLoginError('');
  };

  const logout = () => {
    setUser(null);
    setView('login');
  };

  if (!user) {
    return <LoginScreen onLogin={login} error={loginError} />;
  }

  return (
    <div className={`min-h-screen ${user.role === 'student' ? 'bg-[#f8f9ff]' : 'bg-slate-50 dark:bg-slate-950'} text-slate-900 dark:text-slate-50`}>
      <AppShell user={user} view={view} onView={setView} onLogout={logout}>
        <RoleContent user={user} view={view} setView={setView} />
      </AppShell>
    </div>
  );
}

function LoginScreen({ onLogin, error }: { onLogin: (email: string, password: string) => void; error: string }) {
  const [email, setEmail] = useState('admin.prof@demo.com');
  const [password, setPassword] = useState('123456');
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(email, password);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative flex flex-col justify-between overflow-hidden p-8 md:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.35),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(16,185,129,0.22),transparent_28%)]" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-600"><GraduationCap size={26} /></div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">SIGE</h1>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200">Sistema Integral de Gestion Escolar</p>
              </div>
            </div>
            <div className="mt-20 max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-300">Propuesta 100% frontend</p>
              <h2 className="mt-4 text-5xl font-black leading-[1.02] md:text-7xl">Un portal completo para cada rol del colegio.</h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Seguridad, CRUD academico, respaldos, reportes PDF/Excel, analisis OLAP y prediccion IA listos para conectar con SQL Server.
              </p>
            </div>
          </div>
          <div className="relative grid gap-3 md:grid-cols-4">
            {Object.values(demoUsers).map((account) => (
              <button key={account.email} onClick={() => setEmail(account.email)} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-left backdrop-blur transition hover:bg-white/15">
                <strong className="block text-sm">{account.role.toUpperCase()}</strong>
                <span className="mt-1 block text-xs text-slate-300">{account.email}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center bg-white p-6 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
          <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-8 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-3xl font-black tracking-tight">Acceso institucional</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Credenciales demo: todos usan contrasena 123456.</p>
            <label className="mt-8 block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Correo</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                <Mail size={18} className="text-slate-400" />
                <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent py-3 text-sm outline-none" />
              </div>
            </label>
            <label className="mt-4 block">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500">Contrasena</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 dark:border-slate-700 dark:bg-slate-800">
                <Lock size={18} className="text-slate-400" />
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" className="w-full bg-transparent py-3 text-sm outline-none" />
              </div>
            </label>
            {error && <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-sm font-semibold text-red-700 dark:border-red-900/40 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500">
              Entrar al sistema <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function AppShell({ user, view, onView, onLogout, children }: { user: User; view: View; onView: (view: View) => void; onLogout: () => void; children: ReactNode }) {
  const isStudent = user.role === 'student';
  const nav = navByRole[user.role];

  return (
    <div className="grid min-h-screen lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className={`hidden border-r p-5 lg:flex lg:flex-col ${isStudent ? 'border-blue-100 bg-white text-[#151c26]' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
        <div className="flex items-center gap-3">
          <div className={`grid h-11 w-11 place-items-center rounded-2xl ${isStudent ? 'bg-[#0c70ea] text-white' : 'bg-slate-950 text-white dark:bg-blue-600'}`}>
            {isStudent ? <Sparkles size={23} /> : <GraduationCap size={23} />}
          </div>
          <div>
            <h1 className={`text-xl font-black ${isStudent ? 'text-[#0058bd]' : ''}`}>{isStudent ? 'Aventura Kids' : 'SIGE'}</h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Sistema Integral de Gestion Escolar</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onView(item.id)}
              className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm font-black transition-all duration-300 ease-in-out ${
                view === item.id
                  ? isStudent
                    ? 'bg-[#0c70ea] text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.16)]'
                    : 'bg-slate-950 text-white shadow-sm dark:bg-blue-600'
                  : isStudent
                    ? 'text-slate-500 hover:bg-blue-50 hover:text-[#0058bd]'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-blue-600">{initials(user.name)}</div>
            <div className="min-w-0">
              <strong className="block truncate text-sm">{user.name}</strong>
              <span className="block truncate text-xs text-slate-500">{user.email}</span>
            </div>
            <button onClick={onLogout} className="ml-auto grid h-9 w-9 place-items-center rounded-xl text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/30"><LogOut size={17} /></button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-8 ${isStudent ? 'border-blue-100 bg-[#f8f9ff]/90' : 'border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/85'}`}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-blue-600">{roleLabel(user.role)}</p>
            <strong>{currentLabel(nav, view)}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800"><Bell size={18} /></button>
            <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800"><Settings size={18} /></button>
          </div>
        </header>
        <main className="p-4 md:p-8">{children}</main>
        <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-4 gap-1 border-t border-slate-200 bg-white p-2 lg:hidden dark:border-slate-800 dark:bg-slate-900">
          {nav.slice(0, 4).map((item) => (
            <button key={item.id} onClick={() => onView(item.id)} className={`flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-black ${view === item.id ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' : 'text-slate-500'}`}>
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
}

function RoleContent({ user, view, setView }: { user: User; view: View; setView: (view: View) => void }) {
  if (user.role === 'admin') return <AdminViews view={view} setView={setView} />;
  if (user.role === 'teacher') return <TeacherViews view={view} setView={setView} />;
  if (user.role === 'student') return <StudentViews view={view} setView={setView} />;
  return <FamilyViews view={view} setView={setView} />;
}

function AdminViews({ view, setView }: { view: View; setView: (view: View) => void }) {
  if (view === 'admin-teachers') return <TeachersDirectory />;
  if (view === 'admin-subjects') return <SubjectsView />;
  if (view === 'admin-committees') return <CommitteesView />;
  if (view === 'admin-reports') return <ReportsView />;
  if (view === 'admin-backups') return <BackupsView />;
  return (
    <Page title="Panel de Control Principal" subtitle="Resumen institucional, telemetria academica y acciones recientes.">
      <StatsGrid>
        <Metric title="Total staff" value="42" detail="+12%" icon={<Users />} />
        <Metric title="Alumnos activos" value="486" detail="+8%" icon={<GraduationCap />} />
        <Metric title="Reportes emitidos" value="31" detail="PDF/Excel" icon={<FileText />} />
        <Metric title="Riesgo IA promedio" value="24%" detail="Bajo" icon={<Sparkles />} />
      </StatsGrid>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card title="Calendario institucional">
          <CalendarBoard />
        </Card>
        <Card title="Acciones criticas">
          <Action title="Crear perfil docente" text="Registra profesor, asigna especialidad y comites." onClick={() => setView('admin-teachers')} />
          <Action title="Generar respaldo" text="Ejecuta sp_GenerarBackupCompleto desde la app." onClick={() => setView('admin-backups')} />
          <Action title="Exportar analitica" text="Prepara reportes PDF y Excel para evaluacion." onClick={() => setView('admin-reports')} />
        </Card>
      </div>
    </Page>
  );
}

function TeachersDirectory() {
  const [query, setQuery] = useState('');
  const filtered = teachers.filter((teacher) => `${teacher.name} ${teacher.specialty}`.toLowerCase().includes(query.toLowerCase()));
  return (
    <Page title="Gestion de profesores" subtitle="Directorio, carga docente, comites y estado operativo.">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <Card title="Teacher Directory" toolbar={<SearchInput value={query} onChange={setQuery} placeholder="Search teachers..." />}>
          <DataTable
            headers={['Profesor', 'Especialidad', 'Comites', 'Estado', 'Carga']}
            rows={filtered.map((teacher) => [
              <Person name={teacher.name} sub={teacher.email} />,
              <Badge>{teacher.specialty}</Badge>,
              teacher.committees,
              <Status value={teacher.status} />,
              <Progress value={teacher.load} />,
            ])}
          />
        </Card>
        <Card title="Crear Perfil de Profesor">
          <FormGrid fields={['Nombre completo', 'Correo institucional', 'Especialidad', 'Telefono']} button="Guardar perfil" />
          <p className="mt-4 rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-800 dark:bg-blue-950/30 dark:text-blue-300">
            La accion debe persistirse con SP transaccional y bitacora: Usuario, ProfesorPerfil y ComiteMiembro.
          </p>
        </Card>
      </div>
    </Page>
  );
}

function SubjectsView() {
  return (
    <Page title="Materias y actividades" subtitle="Planificacion academica, conflictos de horario y recursos por curso.">
      <Card title="Listado academico">
        <DataTable
          headers={['Materia', 'Profesor', 'Grado', 'Actividades', 'Estado']}
          rows={subjects.map((subject) => [subject.name, subject.teacher, subject.grade, subject.activities, <Status value={subject.status} />])}
        />
      </Card>
    </Page>
  );
}

function CommitteesView() {
  return (
    <Page title="Comites y comisiones" subtitle="Colaboracion docente, responsables y seguimiento institucional.">
      <div className="grid gap-5 md:grid-cols-3">
        {['Comite de Evaluacion', 'Comision de Laboratorio', 'Club de Lectura'].map((name, index) => (
          <Card key={name} title={name}>
            <div className="flex items-center gap-3">
              <IconBubble><Users /></IconBubble>
              <div>
                <strong>{['Elena Rodriguez', 'Marco Fuentes', 'Sofia Morales'][index]}</strong>
                <p className="text-sm text-slate-500">{[6, 4, 8][index]} miembros activos</p>
              </div>
            </div>
            <button className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 font-black text-white dark:bg-blue-600">Ver colaboracion</button>
          </Card>
        ))}
      </div>
    </Page>
  );
}

function ReportsView() {
  return (
    <Page title="Reportes, OLAP e IA" subtitle="Cubos de informacion, exportaciones y prediccion academica.">
      <StatsGrid>
        <Metric title="Hechos rendimiento" value="12.4k" detail="DW" icon={<Database />} />
        <Metric title="Precision IA" value="84%" detail="Scikit-learn" icon={<Sparkles />} />
        <Metric title="Exportables" value="PDF/XLSX" detail="Listos" icon={<Download />} />
      </StatsGrid>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Grafico predictivo">
          <ChartBars />
        </Card>
        <Card title="Exportacion">
          <Action title="Reporte academico PDF" text="Boleta, riesgo IA y observaciones." icon={<FileText />} />
          <Action title="Excel de rendimiento" text="CTEs, agregaciones y detalle por materia." icon={<FileSpreadsheet />} />
        </Card>
      </div>
    </Page>
  );
}

function BackupsView() {
  return (
    <Page title="Backups y recuperacion" subtitle="Respaldo fisico desde aplicacion y monitoreo de ejecucion.">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card title="Ejecucion de respaldo">
          <FormGrid fields={['Ruta de carpeta SQL Server', 'Nombre logico del respaldo']} button="Ejecutar backup" />
          <pre className="mt-5 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-xs text-emerald-300">[INFO] sp_GenerarBackupCompleto listo para ejecutar{"\n"}[OK] Auditoria y monitoreo preparados</pre>
        </Card>
        <Card title="Estado del motor">
          <Metric title="Uptime SQL" value="99.98%" detail="Servidor remoto Somee" icon={<ShieldCheck />} />
        </Card>
      </div>
    </Page>
  );
}

function TeacherViews({ view, setView }: { view: View; setView: (view: View) => void }) {
  if (view === 'teacher-grades') {
    return (
      <Page title="Gestion de clases y notas" subtitle="Asienta calificaciones con validacion y observaciones.">
        <Card title="Registro de calificacion">
          <FormGrid fields={['Alumno', 'Actividad', 'Nota 0-100', 'Observacion academica']} button="Guardar nota" />
        </Card>
        <Card title="Notas recientes">
          <DataTable headers={['Alumno', 'Actividad', 'Nota', 'Estado']} rows={[['Juan Perez', 'Examen 1', '88.0', <Status value="Aprobado" />], ['Carlos Ruiz', 'Proyecto', '57.1', <Status value="Riesgo" />]]} />
        </Card>
      </Page>
    );
  }
  if (view === 'teacher-task') return <Page title="Crear nueva tarea" subtitle="Publica misiones, fechas y ponderacion."><Card title="Nueva actividad"><FormGrid fields={['Titulo', 'Materia', 'Fecha inicio', 'Fecha fin', 'Ponderacion', 'Descripcion']} button="Publicar tarea" /></Card></Page>;
  if (view === 'teacher-resources') return <LibraryView title="Biblioteca de recursos" />;
  if (view === 'teacher-committees') return <CommitteesView />;
  if (view === 'teacher-support') return <Page title="Soporte" subtitle="Ayuda operacional y tickets."><Card title="Ticket rapido"><FormGrid fields={['Asunto', 'Modulo', 'Descripcion']} button="Enviar solicitud" /></Card></Page>;
  return (
    <Page title="Dashboard del maestro" subtitle="Clases del dia, rendimiento del salon y pendientes.">
      <StatsGrid>
        <Metric title="Clases hoy" value="4" detail="2 pendientes" icon={<CalendarDays />} />
        <Metric title="Promedio grupo" value="82.4" detail="+3.1" icon={<LineChart />} />
        <Metric title="Tareas por revisar" value="17" detail="Urgente" icon={<ClipboardList />} />
      </StatsGrid>
      <Card title="Siguiente clase"><Action title="Matematicas I - 5to A" text="10:30 AM · Tema: fracciones" onClick={() => setView('teacher-grades')} /></Card>
    </Page>
  );
}

function StudentViews({ view, setView }: { view: View; setView: (view: View) => void }) {
  if (view === 'student-classes') return <StudentPage title="Mis clases" subtitle="Aventura de aprendizaje por materia."><CourseCards onOpen={() => setView('student-tasks')} /></StudentPage>;
  if (view === 'student-tasks') return <StudentPage title="Mis tareas" subtitle="Centro de misiones."><TaskCards /></StudentPage>;
  if (view === 'student-grades') return <StudentPage title="Mis notas y progreso" subtitle="Promedio, observaciones y recomendacion IA."><GradesPanel /></StudentPage>;
  if (view === 'student-calendar') return <StudentPage title="Calendario de aventuras" subtitle="Eventos, entregas y clases especiales."><CalendarBoard /></StudentPage>;
  if (view === 'student-library') return <LibraryView title="Mi biblioteca de recursos" playful />;
  return (
    <StudentPage title="Aventura Kids" subtitle="Listo para una nueva aventura, Leo?">
      <section className="grid min-h-72 items-center gap-6 rounded-[2rem] border border-blue-100 bg-[radial-gradient(circle_at_84%_20%,rgba(253,208,41,0.45),transparent_24%),linear-gradient(135deg,#d8e2ff_0%,#f8f9ff_56%,#c8f7d3_100%)] p-8 md:grid-cols-[1fr_220px]">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.22em] text-slate-500">Martes de aprendizaje</p>
          <h2 className="mt-3 text-5xl font-black leading-tight text-blue-700">Listo para una nueva aventura?</h2>
          <p className="mt-4 text-lg text-slate-600">Completa misiones, gana estrellas y desbloquea logros.</p>
          <button onClick={() => setView('student-tasks')} className="mt-6 rounded-2xl bg-blue-700 px-6 py-3 font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)]">Empezar ahora</button>
        </div>
        <div className="mx-auto flex aspect-square w-48 flex-col items-center justify-center rounded-full border-8 border-yellow-300 bg-white text-center shadow-xl">
          <span className="text-5xl font-black text-blue-700">128</span><strong>estrellas</strong><small>+18 esta semana</small>
        </div>
      </section>
      <StatsGrid>
        <Metric title="Promedio" value="90%" detail="Excelente" icon={<Star />} />
        <Metric title="Racha" value="5 dias" detail="Activa" icon={<Flame />} />
        <Metric title="Logros" value="2/4" detail="Explorador" icon={<Trophy />} />
      </StatsGrid>
    </StudentPage>
  );
}

function FamilyViews({ view, setView }: { view: View; setView: (view: View) => void }) {
  if (view === 'family-students') return <Page title="Seleccion de alumno" subtitle="Consulta perfiles vinculados por relacion familiar."><Card title="Alumnos vinculados"><Action title="Leo Alumno" text="5to Primaria · Riesgo bajo" onClick={() => setView('family-progress')} /></Card></Page>;
  if (view === 'family-progress') return <Page title="Seguimiento academico" subtitle="Notas, prediccion IA y recomendaciones."><GradesPanel /><Card title="Recomendacion IA"><p className="text-slate-500">Mantener practica de fisica los jueves y reforzar lectura guiada.</p></Card></Page>;
  if (view === 'family-payments') return <Page title="Centro de pagos" subtitle="Colegiaturas, mora y comprobantes."><DataTable headers={['Concepto', 'Fecha', 'Monto', 'Estado']} rows={[['Colegiatura junio', '05/06/2026', 'Q 950.00', <Status value="Pagado" />], ['Materiales', '15/06/2026', 'Q 180.00', <Status value="Pendiente" />]]} /></Page>;
  if (view === 'family-calendar') return <Page title="Calendario escolar" subtitle="Eventos y reuniones familiares."><CalendarBoard /></Page>;
  if (view === 'family-messages') return <Page title="Reportes y comunicacion" subtitle="Mensajes con docentes y exportaciones."><Card title="Nuevo mensaje"><FormGrid fields={['Profesor', 'Asunto', 'Mensaje']} button="Enviar mensaje" /></Card></Page>;
  return (
    <Page title="Portal de padres" subtitle="Resumen sereno del desempeno academico y financiero.">
      <StatsGrid>
        <Metric title="Promedio Leo" value="90%" detail="Estable" icon={<Star />} />
        <Metric title="Pagos" value="1 pendiente" detail="Q 180.00" icon={<CreditCard />} />
        <Metric title="Riesgo IA" value="Bajo" detail="24%" icon={<Sparkles />} />
      </StatsGrid>
      <Card title="Accesos rapidos"><Action title="Ver seguimiento" text="Notas y recomendaciones" onClick={() => setView('family-progress')} /><Action title="Centro de pagos" text="Comprobantes y saldos" onClick={() => setView('family-payments')} /></Card>
    </Page>
  );
}

function Page({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1500px] space-y-6 pb-24 lg:pb-0">
      <header>
        <h2 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h2>
        <p className="mt-2 max-w-3xl text-slate-500 dark:text-slate-400">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function StudentPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1180px] space-y-6 pb-24 text-[#151c26] lg:pb-0">
      <header>
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-blue-700">Portal de alumno</p>
        <h2 className="mt-1 text-4xl font-black tracking-normal text-blue-700 md:text-5xl">{title}</h2>
        <p className="mt-2 text-lg font-semibold text-slate-500">{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function StatsGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">{children}</div>;
}

function Metric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <article className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start justify-between gap-3">
        <IconBubble>{icon}</IconBubble>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">{detail}</span>
      </div>
      <p className="text-xs font-black uppercase tracking-wider text-slate-500">{title}</p>
      <strong className="text-3xl font-black">{value}</strong>
    </article>
  );
}

function Card({ title, toolbar, children }: { title: string; toolbar?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h3 className="text-sm font-black uppercase tracking-[0.16em]">{title}</h3>
        {toolbar}
      </div>
      {children}
    </section>
  );
}

function IconBubble({ children }: { children: ReactNode }) {
  return <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">{children}</span>;
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800" />
    </label>
  );
}

function DataTable({ headers, rows }: { headers: string[]; rows: ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-slate-50 text-xs font-black uppercase tracking-wider text-slate-500 dark:bg-slate-800">
          <tr>{headers.map((header) => <th key={header} className="px-5 py-3">{header}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row, index) => <tr key={index} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/60">{row.map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4">{cell}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
  );
}

function Person({ name, sub }: { name: string; sub: string }) {
  return <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-black text-blue-700">{initials(name)}</span><div><strong className="block">{name}</strong><span className="text-xs text-slate-500">{sub}</span></div></div>;
}

function Badge({ children }: { children: ReactNode }) {
  return <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-300">{children}</span>;
}

function Status({ value }: { value: string }) {
  const tone = value.includes('Riesgo') || value.includes('Conflictiva') || value.includes('Pendiente') ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300' : value.includes('Inactivo') ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tone}`}>{value}</span>;
}

function Progress({ value }: { value: number }) {
  return <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"><span className="block h-full rounded-full bg-blue-600" style={{ width: `${value}%` }} /></div>;
}

function FormGrid({ fields, button }: { fields: string[]; button: string }) {
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
      {fields.map((field) => <label key={field} className={field.includes('Descripcion') || field.includes('Mensaje') || field.includes('Observacion') ? 'md:col-span-2' : ''}><span className="text-xs font-black uppercase tracking-wider text-slate-500">{field}</span><input className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800" /></label>)}
      <button className="rounded-2xl bg-slate-950 px-5 py-3 font-black text-white transition hover:bg-slate-800 md:col-span-2 dark:bg-blue-600 dark:hover:bg-blue-500">{button}</button>
    </form>
  );
}

function Action({ title, text, icon, onClick }: { title: string; text: string; icon?: ReactNode; onClick?: () => void }) {
  return <button onClick={onClick} className="mb-3 flex w-full items-center gap-3 rounded-2xl bg-slate-50 p-4 text-left transition-all duration-300 ease-in-out hover:bg-blue-50 dark:bg-slate-800 dark:hover:bg-blue-950/30"><IconBubble>{icon ?? <ArrowRight />}</IconBubble><span><strong className="block">{title}</strong><small className="text-slate-500 dark:text-slate-400">{text}</small></span></button>;
}

function CalendarBoard() {
  return <div className="grid grid-cols-7 gap-2">{Array.from({ length: 30 }, (_, i) => i + 1).map((day) => <button key={day} className={`min-h-16 rounded-2xl border p-2 text-left text-xs font-black transition ${[4, 12, 21].includes(day) ? 'border-blue-300 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/30' : 'border-slate-100 bg-white text-slate-500 dark:border-slate-800 dark:bg-slate-900'}`}>{day}{day === 12 && <span className="mt-1 block truncate rounded bg-amber-100 px-1 py-0.5 text-[10px] text-amber-700">Taller</span>}</button>)}</div>;
}

function ChartBars() {
  return <div className="flex h-56 items-end gap-4 rounded-3xl bg-slate-50 p-5 dark:bg-slate-800">{[52, 76, 64, 88, 72, 94].map((height, index) => <div key={index} className="flex flex-1 flex-col items-center gap-2"><span className="w-full rounded-t-2xl bg-blue-600" style={{ height: `${height}%` }} /><small className="font-black text-slate-400">B{index + 1}</small></div>)}</div>;
}

function CourseCards({ onOpen }: { onOpen: () => void }) {
  return <div className="grid gap-5 md:grid-cols-4">{['Matematicas', 'Lectura', 'Ciencias', 'Arte'].map((course, index) => <Card key={course} title={course}><IconBubble>{[<Sparkles />, <BookOpen />, <Flame />, <Award />][index]}</IconBubble><p className="mt-4 text-slate-500">Progreso {[78, 62, 84, 45][index]}%</p><Progress value={[78, 62, 84, 45][index]} /><button onClick={onOpen} className="mt-5 w-full rounded-2xl bg-blue-700 px-4 py-3 font-black text-white">Continuar</button></Card>)}</div>;
}

function TaskCards() {
  return <div className="grid gap-5 lg:grid-cols-3">{studentTasks.map((task) => <Card key={task.title} title={task.status}><h3 className="text-xl font-black text-blue-700">{task.title}</h3><p className="mt-1 text-slate-500">{task.course} · {task.due}</p><button className="mt-6 rounded-2xl bg-blue-700 px-4 py-3 font-black text-white">Completar mision</button></Card>)}</div>;
}

function GradesPanel() {
  const avg = Math.round(grades.reduce((sum, grade) => sum + grade.score, 0) / grades.length);
  return <div className="grid gap-6 lg:grid-cols-[320px_1fr]"><Card title="Promedio general"><strong className="text-6xl font-black text-blue-700">{avg}%</strong><p className="mt-2 text-slate-500">Riesgo academico bajo</p></Card><Card title="Detalle por materia"><DataTable headers={['Materia', 'Nota', 'Observacion']} rows={grades.map((grade) => [grade.course, <strong>{grade.score}</strong>, grade.note])} /></Card></div>;
}

function LibraryView({ title, playful = false }: { title: string; playful?: boolean }) {
  return <Page title={title} subtitle="Recursos digitales, actividades y descargables."><div className="grid gap-5 md:grid-cols-4">{resources.map((resource) => <Card key={resource.title} title={resource.title}><IconBubble>{playful ? <BookOpen /> : <Upload />}</IconBubble><p className="mt-4 text-slate-500">{resource.type} · {resource.minutes} min</p><button className="mt-5 w-full rounded-2xl bg-slate-950 px-4 py-3 font-black text-white dark:bg-blue-600">Abrir recurso</button></Card>)}</div></Page>;
}

function roleLabel(role: Role) {
  return { admin: 'Profesor Admin', teacher: 'Profesor', student: 'Alumno', family: 'Padre de familia' }[role];
}

function currentLabel(nav: Array<{ id: View; label: string }>, view: View) {
  return nav.find((item) => item.id === view)?.label ?? 'Vista principal';
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();
}
