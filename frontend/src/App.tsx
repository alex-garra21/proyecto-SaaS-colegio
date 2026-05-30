import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ArrowRight,
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Database,
  Eye,
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
  Pencil,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Upload,
  Users,
} from 'lucide-react';

type Role = 'admin' | 'teacher' | 'student' | 'family';
type User = { email: string; name: string; role: Role };
type View = string;
type FamilyChild = { id: string; name: string; grade: string; average: number; balance: string; risk: string; subjects: number; avatar: string };

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

const familyChildren: FamilyChild[] = [
  {
    id: 'mateo',
    name: 'Mateo Garcia',
    grade: '5to Grado B',
    average: 92,
    balance: 'Q 950.00',
    risk: 'Bajo',
    subjects: 6,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRYQGhb8N_5TGD0InSxv6DlxoTXTfElSVTfgipyPTYAcGYfZc3ECmWATNiov_XIt3eL4ucwTxj4_BsclvCQQWrE_KwHiP7ZABAJD20_Ogq4WqBzQP8WhemBnuGtCw2ROQruLh_so4_gY-9d6HmiZxriejvj_aSJlzU0lOAdH3INsOC1wl7f9z_1e_Rkgqydv7Q0ZNEU6caeXRYPxrFjlLrrEi6PrRtxzFdkqzGGVYSpt_phFIitlQLSGR4eTkSGajTQ_4vAzWLZ7Xb',
  },
  {
    id: 'sofia',
    name: 'Sofia Garcia',
    grade: '2do Grado A',
    average: 95,
    balance: 'Solvente',
    risk: 'Medio',
    subjects: 5,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxyTgUmvwTLbL4Ny7rE5IDDjrxfTkdz0BYzFutwFeNrVVSKRrPCCESRNTiydOVKgGzwYB6Bd_q4IXgZ6szvb5xnbBVOQShKOJ1Hxvlos7ZJl38ZcUMZyVr5nA8QZddKUTOltPDEpc70yv0vCppWrgWcOCffv-Lq14FL-ZYsjUIWJvN8G_ZVhoVUR3jq_lBvfiG5j0ccSvTu2FqDJSabJ6q2VMNxRAgCnWPM_eWDKmTQ-s1nS8aqJ24WNu-MVjehg6aLVfWhPbnMYq',
  },
];

const navByRole: Record<Role, Array<{ id: View; label: string; icon: ReactNode }>> = {
  admin: [
    { id: 'admin-dashboard', label: 'Dashboard', icon: <Home size={19} /> },
    { id: 'admin-teachers', label: 'Profesores', icon: <GraduationCap size={19} /> },
    { id: 'admin-activities', label: 'Actividades', icon: <CalendarDays size={19} /> },
    { id: 'admin-notices', label: 'Avisos', icon: <Bell size={19} /> },
    { id: 'admin-groups', label: 'Grupos', icon: <Users size={19} /> },
    { id: 'admin-create-committee', label: 'Crear comision', icon: <Plus size={19} /> },
    { id: 'admin-enrollment', label: 'Inscripcion', icon: <ClipboardList size={19} /> },
    { id: 'admin-create-teacher', label: 'Crear profesor', icon: <BookOpen size={19} /> },
  ],
  teacher: [
    { id: 'teacher-dashboard', label: 'Panel de Control', icon: <Home size={19} /> },
    { id: 'teacher-classes', label: 'Gestion de Clases', icon: <ClipboardList size={19} /> },
    { id: 'teacher-resources', label: 'Biblioteca', icon: <Library size={19} /> },
    { id: 'teacher-committees', label: 'Comites', icon: <Users size={19} /> },
    { id: 'teacher-planning', label: 'Planificacion', icon: <CalendarDays size={19} /> },
    { id: 'teacher-grades', label: 'Notas', icon: <LineChart size={19} /> },
    { id: 'teacher-conversations', label: 'Conversaciones', icon: <MessageSquare size={19} /> },
    { id: 'teacher-support', label: 'Soporte', icon: <HelpCircle size={19} /> },
    { id: 'teacher-settings', label: 'Configuracion', icon: <Settings size={19} /> },
  ],
  student: [
    { id: 'student-home', label: 'Inicio', icon: <Home size={19} /> },
    { id: 'student-classes', label: 'Mis Cursos', icon: <GraduationCap size={19} /> },
    { id: 'student-tasks', label: 'Tareas', icon: <ClipboardList size={19} /> },
    { id: 'student-grades', label: 'Notas', icon: <Star size={19} /> },
    { id: 'student-calendar', label: 'Calendario', icon: <CalendarDays size={19} /> },
    { id: 'student-library', label: 'Biblioteca', icon: <Library size={19} /> },
    { id: 'student-diary', label: 'Logros', icon: <Trophy size={19} /> },
    { id: 'student-profile', label: 'Perfil', icon: <Settings size={19} /> },
  ],
  family: [
    { id: 'family-dashboard', label: 'Dashboard', icon: <Home size={19} /> },
    { id: 'family-progress', label: 'Seguimiento', icon: <LineChart size={19} /> },
    { id: 'family-calendar', label: 'Calendario', icon: <CalendarDays size={19} /> },
    { id: 'family-payments', label: 'Pagos', icon: <CreditCard size={19} /> },
    { id: 'family-messages', label: 'Reportes', icon: <MessageSquare size={19} /> },
    { id: 'family-settings', label: 'Configuracion', icon: <Settings size={19} /> },
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
  const [selectedFamilyChild, setSelectedFamilyChild] = useState<FamilyChild>(familyChildren[0]);

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
      <AppShell user={user} view={view} onView={setView} onLogout={logout} selectedFamilyChild={selectedFamilyChild} onFamilyChildChange={setSelectedFamilyChild}>
        <RoleContent user={user} view={view} setView={setView} onLogout={logout} selectedFamilyChild={selectedFamilyChild} onFamilyChildChange={setSelectedFamilyChild} />
      </AppShell>
    </div>
  );
}

function LoginScreen({ onLogin, error }: { onLogin: (email: string, password: string) => void; error: string }) {
  const [publicView, setPublicView] = useState<'blog' | 'login'>('blog');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onLogin(email, password);
  };

  if (publicView === 'blog') {
    return <PublicBlog onLogin={() => setPublicView('login')} />;
  }

  return (
    <div
      className="flex min-h-screen flex-col bg-[#fbf9f8] text-[#1b1c1c]"
      style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}
    >
      <header className="fixed top-0 z-50 w-full bg-[#fbf9f8]/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 md:px-10">
          <div
            className="select-none text-[32px] font-extrabold leading-10 text-[#004ddb] md:text-[48px] md:leading-[56px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            EduWonder
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <button className="text-lg leading-7 text-[#434655] transition-transform duration-200 hover:-translate-y-0.5" onClick={() => setPublicView('blog')} type="button">
              Recursos
            </button>
            <button className="text-lg leading-7 text-[#434655] transition-transform duration-200 hover:-translate-y-0.5" onClick={() => setPublicView('blog')} type="button">
              Blog
            </button>
          </nav>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 pb-8 pt-28">
        <div className="w-full max-w-[480px]">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-grid h-20 w-20 place-items-center rounded-full bg-[#dce1ff] text-[#004ddb]">
              <BookOpen size={48} strokeWidth={2.4} />
            </div>
            <h1
              className="mb-2 text-[32px] font-bold leading-10 text-[#1b1c1c]"
              style={{ color: '#1b1c1c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              ¡Hola de nuevo!
            </h1>
            <p className="text-lg leading-7 text-[#434655]">Accede a tu portal educativo personalizado</p>
          </div>

          <div className="rounded-xl border border-[#eae8e7] bg-white p-8 shadow-[0_10px_25px_-5px_rgba(42,102,255,0.08)] transition-all">
            <form className="space-y-6" onSubmit={submit}>
              <div className="space-y-2">
                <label
                  className="block text-sm font-semibold leading-5 tracking-[0.02em] text-[#434655]"
                  htmlFor="email"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737687]" size={22} />
                  <input
                    className="h-[56px] w-full rounded-lg border-2 border-[#eae8e7] bg-[#fbf9f8] pl-12 pr-4 text-lg leading-7 text-[#1b1c1c] outline-none transition-colors focus:border-[#004ddb]"
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ejemplo@eduwonder.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <label
                    className="block text-sm font-semibold leading-5 tracking-[0.02em] text-[#434655]"
                    htmlFor="password"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    Contraseña
                  </label>
                  <a
                    className="text-sm font-semibold leading-5 tracking-[0.02em] text-[#004ddb] transition-all hover:underline"
                    href="#"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737687]" size={22} />
                  <input
                    className="h-[56px] w-full rounded-lg border-2 border-[#eae8e7] bg-[#fbf9f8] pl-12 pr-20 text-lg leading-7 text-[#1b1c1c] outline-none transition-colors focus:border-[#004ddb]"
                    id="password"
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#737687] transition-colors hover:text-[#004ddb]"
                    onClick={() => setShowPassword((current) => !current)}
                    type="button"
                  >
                    {showPassword ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="h-5 w-5 rounded border-2 border-[#737687] accent-[#004ddb]"
                  id="remember"
                  type="checkbox"
                />
                <label
                  className="select-none text-sm font-semibold leading-5 tracking-[0.02em] text-[#434655]"
                  htmlFor="remember"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Mantener sesión iniciada
                </label>
              </div>

              {error && (
                <p className="rounded-lg border border-[#ffdad6] bg-[#fff2f0] p-3 text-sm font-bold text-[#93000a]">
                  {error}
                </p>
              )}

              <button
                className="h-[56px] w-full rounded-xl bg-[#004ddb] text-2xl font-bold leading-8 text-white shadow-md transition-all duration-200 hover:-translate-y-1 active:scale-95"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                type="submit"
              >
                Entrar
              </button>
            </form>

            <div className="mt-8 border-t border-[#eae8e7] pt-6 text-center">
              <p className="text-lg leading-7 text-[#434655]">
                ¿No tienes una cuenta? <a className="font-bold text-[#006e28] hover:underline" href="#">Regístrate gratis</a>
              </p>
            </div>

          </div>

          <div className="mt-8 grid grid-cols-2 gap-6 opacity-70">
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[#006e28]" size={22} />
              <span className="text-sm leading-5">Seguridad Protegida</span>
            </div>
            <div className="flex items-center justify-end gap-2">
              <Award className="text-[#834f00]" size={22} />
              <span className="text-sm leading-5">Contenido Curado</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-auto w-full bg-[#e4e2e2] py-8">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-10">
          <div className="space-y-4">
            <div
              className="text-2xl font-bold leading-8 text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              EduWonder
            </div>
            <p className="text-sm leading-5 text-[#434655]">
              © 2026 EduWonder. Plataforma diseñada para conectar la gestión escolar, el aprendizaje y el acompañamiento familiar.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className="mb-2 text-sm font-semibold leading-5 tracking-[0.02em] text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Compañía
            </span>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Contacto</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Privacidad</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Términos de servicio</a>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className="mb-2 text-sm font-semibold leading-5 tracking-[0.02em] text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Soporte
            </span>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Centro de ayuda</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PublicBlog({ onLogin }: { onLogin: () => void }) {
  const articles = [
    {
      title: '10 Estrategias para Fomentar la Lectura Critica en Primaria',
      category: 'Actividades en el Aula',
      text: 'Descubre como transformar el rincon de lectura en un espacio de debate dinamico y pensamiento profundo para los mas pequenos.',
      author: 'Elena Rodriguez',
      date: '12 Mar, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVdbznWYSGyY9hDxxzIGcMl8RAyukfOBab4_2Xr8NRxLkNyuHLIGfOIVVvfsD-sShdJNvxXPNesqsv5iXOx3bIw_bneH5wxRrPreKir0o_Acp24PYr4chPffKFvoiSC_0X1yydxNyz0Qs7xoehh9Hjk4Kuzmyxr1Ej4QCYROR0Tl_eich6SMs_NbjbkMNoZELHCFarnhxHnclpVMkcJcTGWOOC-3P2KuUQUrRPAHzavd0Eo2Vjt8_DuM7b23Zh6FIu_PnrBRfB6BWM',
      featured: true,
    },
    {
      title: 'Equilibrio Digital: Como gestionar el tiempo de pantalla',
      category: 'Consejos para Padres',
      author: 'Marcos Alonso',
      date: '10 Mar, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuKmOp2GYgyxyo8_HOiUG_4_0hFV0RzfUIMudw16CbJ_DLETGwjTjR-4RwjMOHGPZnQwmMjv2odAlY0IUKdBFYUOdIsQn14AzUjH9ZRz_w05QJ7KSEXNHmIzjYkjwgQbWvzodZ1XpaD5SCJ3uzyvA2AlevzJNDt9dBHAqmpnsva5E6l1Bpq2xpFdR9mZpw-eK4D6i-5nnbKykLNCXxJIWR3913LWxbZAcRwmssiqNwz_Egd7SeVePP3gQGUKQHJ-K5piXdwTYQqZv9',
    },
    {
      title: 'Feria de Ciencias 2024: Los proyectos mas innovadores',
      category: 'Noticias Escolares',
      author: 'Lucia Castro',
      date: '08 Mar, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSMZCxMWWcfQB8Ekqv1LFps66cLQc0_rcqcbSYwMIBOQPfUO5SsDC-SuZwYqX0suYG9V-t3BY2nQb-Y9pMJlWg3sbd8cWR9B5zgdQwxH6ay1tCOOloLECAdZcbHzaSastPk368FYJdfNelZFy3kKBzLicgzf-I5HxbbTeOOYt3Qz5D_LlLqjZ4kpDGUOu-PL5LcUNKtJnhyhOwQs5nEH_UIb3zGQicICU6YFtv5HzMm0YxsbK7XbxblEpDOUuLACCnLXxUj_yBKXKg',
    },
    {
      title: 'Arte y Geometria: Un taller practico para 3er grado',
      category: 'Actividades en el Aula',
      author: 'Sara Mendez',
      date: '05 Mar, 2024',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2dMLIWuyQ4HZLRXjzGxxZTHoziIe8E2X-CJc1AjCJdvVueAsiEkC4hKfs5aneJsoqneB0GxgBvBfV9cX3Scaps-lxO6ulzTGXnX9-cql6PSelYqYgGMz_-RJ2UjPj-a98HVhEeLWXIrRmIOKUJuo3IEliBEVPvsMSczvus9tRgFyKFuIuz1BW7M1W9ent7Gy-Zxcq7JpkmeXjjma0yKqgCkn3j2BP6pCLymoCZzP_Tx6zYvoVa9WvJx5HXOBbef1LhictdmoXmBmO',
    },
  ];

  const heroImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDoWqpsb9Z2Vs2Nt7hUK86Mpq07IogT23oZ_2uI7GyPyeb_t-pqRftst_b85fccTGHezhmJ-EvnUgcvV709Yzbh1ed6c6fu8Yu9LoIPGTo-5kfzkaBR8jh_gSihqWd3dcSXAdSjFM1nT9X997n_iE_SZQQhDDFGyhEmLOnimvhviFEavX2N6WUYDjj7OFmJqG-KnggvnJ9snyOgX1eUUKbVhOQWC0u-4sJP1xRnplp3kRXmLYF-OIx9bXXLYnAUDv_9pI6AmoOaktHR';

  return (
    <div
      className="min-h-screen bg-[#fbf9f8] text-[#1b1c1c]"
      style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}
    >
      <header className="fixed top-0 z-50 w-full bg-[#fbf9f8]/80 shadow-sm backdrop-blur-md">
        <nav className="mx-auto flex max-w-[1200px] items-center justify-between px-4 py-4 md:px-10">
          <span
            className="text-[32px] font-extrabold leading-10 text-[#004ddb] md:text-[48px] md:leading-[56px]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            EduWonder
          </span>
          <div className="hidden items-center gap-8 md:flex">
            <a className="border-b-2 border-[#004ddb] text-lg font-bold leading-7 text-[#004ddb]" href="#">
              Blog
            </a>
            <a className="text-lg leading-7 text-[#434655] transition-transform duration-200 hover:-translate-y-0.5" href="#">
              Resources
            </a>
            <a className="text-lg leading-7 text-[#434655] transition-transform duration-200 hover:-translate-y-0.5" href="#">
              About Us
            </a>
          </div>
          <button
            className="rounded-full bg-[#004ddb] px-6 py-3 text-sm font-bold leading-5 tracking-[0.02em] text-white shadow-md transition-all active:scale-95"
            onClick={onLogin}
            type="button"
          >
            Login
          </button>
        </nav>
      </header>

      <main className="pt-24">
        <section className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 py-8 md:px-10 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-[#6ffb85] px-4 py-2 text-sm font-semibold leading-5 tracking-[0.02em] text-[#00732a]">
              Explora. Aprende. Crece.
            </span>
            <h1
              className="text-[42px] font-extrabold leading-[1.08] text-[#1b1c1c] md:text-[48px] md:leading-[56px]"
              style={{ color: '#1b1c1c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              Donde la curiosidad encuentra su camino.
            </h1>
            <p className="max-w-xl text-xl leading-8 text-[#434655]">
              Una plataforma disenada para inspirar a maestros, guiar a padres y empoderar a alumnos. Recursos educativos modernos con un toque de magia.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                className="flex h-12 items-center gap-2 rounded-xl bg-[#004ddb] px-8 font-bold text-white shadow-lg transition-transform hover:-translate-y-1"
                onClick={onLogin}
                type="button"
              >
                Empieza hoy
                <ArrowRight size={18} />
              </button>
              <a className="grid h-12 place-items-center rounded-xl bg-[#eae8e7] px-8 font-bold text-[#004ddb] transition-colors hover:bg-[#e4e2e2]" href="#blog">
                Ver Recursos
              </a>
            </div>
          </div>
          <div className="group relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#2a66ff]/10 blur-2xl transition-all duration-500 group-hover:bg-[#2a66ff]/20" />
            <img
              alt="Estudiantes en el aula"
              className="relative h-[500px] w-full rounded-[2rem] object-cover shadow-2xl"
              src={heroImage}
            />
          </div>
        </section>

        <section className="bg-[#f5f3f3] py-8" id="blog">
          <div className="mx-auto max-w-[1200px] px-4 md:px-10">
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2
                  className="mb-2 text-[32px] font-bold leading-10 text-[#1b1c1c]"
                  style={{ color: '#1b1c1c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  Nuestro Blog Educativo
                </h2>
                <p className="text-[#434655]">Ideas frescas para la comunidad de EduWonder.</p>
              </div>
              <div className="hidden gap-2 md:flex">
                <button className="grid h-10 w-10 place-items-center rounded-full border border-[#737687]/20 bg-[#fbf9f8] text-[#434655] transition-colors hover:bg-[#004ddb] hover:text-white" type="button">
                  {'<'}
                </button>
                <button className="grid h-10 w-10 place-items-center rounded-full border border-[#737687]/20 bg-[#fbf9f8] text-[#434655] transition-colors hover:bg-[#004ddb] hover:text-white" type="button">
                  {'>'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) =>
                article.featured ? (
                  <article
                    className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#fbf9f8] shadow-[0_10px_25px_-5px_rgba(42,102,255,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(42,102,255,0.15)] md:col-span-2 md:flex-row lg:col-span-2"
                    key={article.title}
                  >
                    <div className="h-64 overflow-hidden md:h-auto md:w-1/2">
                      <img alt={article.category} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" src={article.image} />
                    </div>
                    <div className="flex flex-col justify-between p-8 md:w-1/2">
                      <div>
                        <span className="mb-4 inline-block rounded-full bg-[#6ffb85]/30 px-3 py-1 text-sm font-bold uppercase tracking-wider text-[#00732a]">
                          {article.category}
                        </span>
                        <h3
                          className="mb-4 text-2xl font-bold leading-8 text-[#1b1c1c]"
                          style={{ color: '#1b1c1c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {article.title}
                        </h3>
                        <p className="text-lg leading-7 text-[#434655]">{article.text}</p>
                      </div>
                      <div className="mt-8 flex items-center gap-3">
                        <div className="grid h-10 w-10 place-items-center rounded-full bg-[#dce1ff] text-sm font-bold text-[#00164e]">ER</div>
                        <div>
                          <p className="text-sm font-semibold leading-5 text-[#1b1c1c]">{article.author}</p>
                          <p className="text-sm leading-5 text-[#434655]">{article.date}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ) : (
                  <article
                    className="flex h-full flex-col overflow-hidden rounded-3xl bg-[#fbf9f8] shadow-[0_10px_25px_-5px_rgba(42,102,255,0.08)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_15px_30px_-5px_rgba(42,102,255,0.15)]"
                    key={article.title}
                  >
                    <div className="h-56 overflow-hidden">
                      <img alt={article.category} className="h-full w-full object-cover transition-transform duration-700 hover:scale-110" src={article.image} />
                    </div>
                    <div className="flex flex-grow flex-col p-6">
                      <span className="mb-3 inline-block self-start rounded-full bg-[#6ffb85]/30 px-3 py-1 text-sm font-bold uppercase tracking-wider text-[#00732a]">
                        {article.category}
                      </span>
                      <h3
                        className="mb-3 flex-grow text-2xl font-bold leading-8 text-[#1b1c1c]"
                        style={{ color: '#1b1c1c', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                      >
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-3 border-t border-[#737687]/10 pt-4">
                        <div className="grid h-8 w-8 place-items-center rounded-full bg-[#2a66ff] text-xs font-bold text-white">{article.author.split(' ').map((word) => word[0]).join('')}</div>
                        <div>
                          <p className="text-sm font-semibold leading-5 text-[#1b1c1c]">{article.author}</p>
                          <p className="text-sm leading-5 text-[#434655]">{article.date}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                ),
              )}

              <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl bg-[#2a66ff] p-8 text-center text-[#fcfaff]">
                <Mail size={40} />
                <h3
                  className="text-2xl font-bold leading-8 text-[#fcfaff]"
                  style={{ color: '#fcfaff', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  ¿Quieres más recursos?
                </h3>
                <p className="text-lg leading-7">Suscríbete a nuestra newsletter semanal para recibir actividades y consejos exclusivos.</p>
                <div className="w-full space-y-2">
                  <input className="h-12 w-full rounded-xl border-2 border-white/30 bg-white/20 px-4 text-white outline-none placeholder:text-white/70 focus:border-white" placeholder="Tu correo electrónico" type="email" />
                  <button className="h-12 w-full rounded-xl bg-white font-bold text-[#004ddb] transition-transform active:scale-95" type="button">
                    Suscribirme
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 w-full bg-[#e4e2e2] py-8">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-6 px-4 md:grid-cols-3 md:px-10">
          <div className="space-y-4">
            <span
              className="text-2xl font-bold leading-8 text-[#1b1c1c]"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              EduWonder
            </span>
            <p className="max-w-xs text-lg leading-7 text-[#434655]">Transformando la educación a través de la tecnología y la pasión por enseñar.</p>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-bold uppercase leading-5 tracking-[0.02em] text-[#004ddb]">Navegación</h4>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Contact</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Privacy Policy</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">Terms of Service</a>
            <a className="text-sm leading-5 text-[#434655] transition-colors hover:text-[#004ddb]" href="#">FAQ</a>
          </div>
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase leading-5 tracking-[0.02em] text-[#004ddb]">Redes Sociales</h4>
            <div className="flex gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eae8e7] text-[#434655]">S</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eae8e7] text-[#434655]">W</span>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eae8e7] text-[#434655]">G</span>
            </div>
            <p className="mt-4 text-sm leading-5 text-[#434655]">© 2026 EduWonder. Bridging curiosity and knowledge.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function AppShell({ user, view, onView, onLogout, selectedFamilyChild, onFamilyChildChange, children }: { user: User; view: View; onView: (view: View) => void; onLogout: () => void; selectedFamilyChild: FamilyChild; onFamilyChildChange: (child: FamilyChild) => void; children: ReactNode }) {
  const isStudent = user.role === 'student';
  const isAdmin = user.role === 'admin';
  const isFamily = user.role === 'family';
  const isTeacher = user.role === 'teacher';
  const nav = navByRole[user.role];
  const [showAdminProfile, setShowAdminProfile] = useState(false);
  const [showFamilySelector, setShowFamilySelector] = useState(false);

  if (isFamily) {
    return (
      <div className="min-h-screen bg-[#f3faff] text-[#021f29]" style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}>
        <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-[#003b43]/10 bg-[#f3faff] p-4 lg:flex">
          <strong className="mb-8 text-3xl font-black text-[#003b43]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ParentPortal</strong>
          <div className="px-4">
            <button className="w-full rounded-xl border border-[#003b43]/10 bg-[#d1ecfa] p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(26,83,92,0.08)]" onClick={() => setShowFamilySelector(true)} type="button">
              <div className="flex items-center gap-3">
                <span className="h-12 w-12 overflow-hidden rounded-full border-2 border-[#cbe7f5] bg-[#79f3ea]">
                  <img alt={selectedFamilyChild.name} className="h-full w-full object-cover" src={selectedFamilyChild.avatar} />
                </span>
                <div>
                  <strong className="block text-[#003b43]">{selectedFamilyChild.name}</strong>
                  <span className="text-sm text-[#40484a]">{selectedFamilyChild.grade}</span>
                </div>
                <ArrowRight className="ml-auto text-[#003b43]" size={18} />
              </div>
            </button>
          </div>
          <nav className="mt-8 flex flex-1 flex-col gap-2 px-3">
            {nav.map((item) => (
              <button
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-left text-lg transition ${view === item.id ? 'bg-[#79f3ea] font-bold text-[#006f69]' : 'text-[#40484a] hover:bg-[#d8f2ff] hover:text-[#003b43]'}`}
                key={item.id}
                onClick={() => onView(item.id)}
                type="button"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="px-4">
            <div className="rounded-xl bg-[#d1ecfa] p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-white font-black text-[#006a65]">MG</span>
                <div>
                  <p className="font-bold text-[#003b43]">Perfil: {selectedFamilyChild.name.split(' ')[0]}</p>
                  <p className="text-[10px] uppercase tracking-wider text-[#40484a]">{selectedFamilyChild.grade}</p>
                </div>
              </div>
              <button className="mt-4 w-full rounded-lg bg-[#003b43] py-3 font-bold text-white" onClick={() => onView('family-progress')} type="button">Ver notas</button>
            </div>
          </div>
        </aside>
        <main className="min-h-screen px-4 pb-24 pt-8 md:px-10 lg:ml-64 lg:pb-8">
          {children}
        </main>
        {showFamilySelector && (
          <FamilyStudentSelection
            current={selectedFamilyChild}
            onClose={() => setShowFamilySelector(false)}
            onSelect={(child) => {
              onFamilyChildChange(child);
              setShowFamilySelector(false);
            }}
          />
        )}
        <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 gap-1 border-t border-[#003b43]/10 bg-white p-2 lg:hidden">
          {nav.map((item) => (
            <button className={`flex flex-col items-center gap-1 rounded-lg py-2 text-[11px] font-bold ${view === item.id ? 'bg-[#79f3ea] text-[#006f69]' : 'text-[#40484a]'}`} key={item.id} onClick={() => onView(item.id)} type="button">
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    );
  }

  if (isTeacher) {
    const teacherPrimary = nav.filter((item) => !['teacher-settings', 'teacher-support'].includes(item.id));
    const teacherBottom = nav.filter((item) => ['teacher-settings', 'teacher-support'].includes(item.id));
    return (
      <div className="teacher-page min-h-screen bg-[#f4f7fb] text-[#102033]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
        <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[272px] flex-col overflow-y-auto border-r border-[#d5deea] bg-[#edf4ff] lg:flex">
          <div className="px-6 py-7">
            <div className="flex items-start gap-3">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#0a3a92] text-white shadow-sm"><GraduationCap size={26} /></span>
              <div>
                <strong className="block text-2xl font-black leading-tight text-[#0a3a92]">EduPro</strong>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#57708d]">Suite docente</span>
                <p className="mt-2 text-sm font-medium text-[#3b4c61]">Ciclo 2026 · Secundaria</p>
              </div>
            </div>
          </div>
          <div className="mx-5 rounded-2xl border border-[#d5deea] bg-white/70 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#57708d]">Alerta docente</p>
            <strong className="mt-2 block text-sm text-[#102033]">3 alumnos requieren seguimiento</strong>
            <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-[#dff8e6] px-3 py-2 text-xs font-bold text-[#095827]" onClick={() => onView('teacher-grades')} type="button">
              <Bell size={14} />
              Revisar alertas
            </button>
          </div>
          <nav className="mt-5 flex flex-1 flex-col gap-1 px-4">
            {teacherPrimary.map((item) => (
              <button
                className={`flex min-h-11 items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
                  view === item.id
                    ? 'bg-[#0a3a92] text-white shadow-sm'
                    : 'text-[#435670] hover:bg-white hover:text-[#0a3a92]'
                }`}
                key={item.id}
                onClick={() => onView(item.id)}
                type="button"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto border-t border-[#d5deea] p-4">
            <button className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0a3a92] px-4 py-4 text-sm font-black text-white shadow-sm transition hover:bg-[#072c70]" onClick={() => onView('teacher-classes')} type="button">
              <Plus size={18} />
              Crear Nueva Tarea
            </button>
            <div className="space-y-1">
              {teacherBottom.map((item) => (
                <button
                  className={`flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${view === item.id ? 'bg-white text-[#0a3a92]' : 'text-[#435670] hover:bg-white'}`}
                  key={item.id}
                  onClick={() => onView(item.id)}
                  type="button"
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <div className="min-w-0 lg:ml-[272px]">
          <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-[#d5deea] bg-white/92 px-6 backdrop-blur">
            <div>
              <strong className="block text-xl font-black text-[#0a3a92]">Panel del profesor</strong>
              <span className="text-sm font-medium text-[#57708d]">{currentLabel(nav, view)}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7990aa]" size={18} />
                <input className="teacher-input h-11 w-80 rounded-xl border border-[#d5deea] bg-[#f6f9fd] pl-11 pr-4 text-sm" placeholder="Buscar alumnos, tareas, cursos..." />
              </div>
              <button className="relative grid h-11 w-11 place-items-center rounded-xl border border-[#d5deea] bg-white text-[#435670]" type="button"><Bell size={19} /><span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#d62929]" /></button>
              <button className="grid h-11 w-11 place-items-center rounded-xl border border-[#d5deea] bg-white text-[#435670]" onClick={() => onView('teacher-support')} type="button"><HelpCircle size={19} /></button>
              <button className="flex items-center gap-3 rounded-xl border border-[#d5deea] bg-white px-3 py-2" onClick={() => onView('teacher-settings')} type="button">
                <img alt="Teacher Profile" className="h-11 w-11 rounded-full border border-[#c4c5d5] object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrQKiIPwNY-qF4RxWy9l5EcLneeb_mO7O7xXyaVU13eMTeEWrZUlOfCKaZjEkjDDPw6to0lz0QsFynRzBKeX7OEBDJkCoJ-HZIuupYURSoTAfWJBdQ0F0G4OlY7V65CcAowZ3jlgZahU_s9Ihj5a3_x94YrTKncBeg1csj_boWrF6-oRIr5GDFo1jP-FQhlQt_PNd1WC72HHvIIQI_Bpg6Rl39wKvabJStyKR7NBgNK_CVkToJDKazMO-JnXB1XG-qvO50wmmrve4" />
                <span className="hidden md:block text-left"><strong className="block text-sm text-[#102033]">Elena Ross</strong><small className="text-[#57708d]">Profesora guía</small></span>
              </button>
            </div>
          </header>
          <main className="px-5 py-6 md:px-8">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid min-h-screen ${isAdmin ? 'bg-[#f7f9fb] lg:grid-cols-[260px_minmax(0,1fr)]' : 'lg:grid-cols-[280px_minmax(0,1fr)]'}`}>
      <aside className={`hidden border-r p-5 lg:flex lg:flex-col ${isAdmin ? 'border-[#c3c6d7] bg-[#505f76] text-[#d3e4fe]' : isStudent ? 'border-blue-100 bg-white text-[#151c26]' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'}`}>
        <div className="flex items-center gap-3">
          <div className={`grid h-11 w-11 place-items-center ${isAdmin ? 'rounded-xl bg-[#2563eb] text-[#eeefff] shadow-sm' : isStudent ? 'rounded-2xl bg-[#0c70ea] text-white' : 'rounded-2xl bg-slate-950 text-white dark:bg-blue-600'}`}>
            {isStudent ? <Sparkles size={23} /> : <GraduationCap size={23} />}
          </div>
          <div className={isStudent ? 'rounded-2xl bg-white px-3 py-2' : ''}>
            <strong className={`block text-xl font-black leading-tight ${isAdmin ? 'text-white' : isStudent ? 'text-[#003b8f]' : ''}`}>{isAdmin ? 'EduAdmin Pro' : isStudent ? 'Aventura Kids' : 'SIGE'}</strong>
            <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${isAdmin ? 'text-[#d3e4fe]' : isStudent ? 'text-[#5f6f8f]' : 'text-slate-400'}`}>{isAdmin ? 'Administrative Portal' : 'Sistema Integral de Gestion Escolar'}</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-1 flex-col gap-2">
          {nav.map((item) => (
            <button
              key={item.id}
              onClick={() => onView(item.id)}
              className={`flex min-h-12 items-center gap-3 px-4 text-left text-sm font-bold transition-all duration-200 ease-in-out ${
                view === item.id
                  ? isAdmin
                    ? 'rounded-xl border-l-4 border-[#004ac6] bg-[#2563eb] text-[#eeefff] shadow-sm'
                    : isStudent
                    ? 'bg-[#0c70ea] text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.16)]'
                    : 'bg-slate-950 text-white shadow-sm dark:bg-blue-600'
                  : isAdmin
                    ? 'rounded-xl text-[#d3e4fe] hover:bg-white/10 hover:text-white'
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
        {isAdmin ? (
          <div className="border-t border-white/15 pt-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#d3e4fe] transition hover:bg-white/10 hover:text-white" onClick={() => setShowAdminProfile(true)} type="button">
              <Settings size={18} />
              Configuracion
            </button>
            <button className="mt-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-[#d3e4fe] transition hover:bg-white/10 hover:text-white" onClick={onLogout} type="button">
              <LogOut size={18} />
              Cerrar sesion
            </button>
          </div>
        ) : !isStudent && (
          <div className="rounded-3xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white dark:bg-blue-600">{initials(user.name)}</div>
              <div className="min-w-0">
                <strong className="block truncate text-sm">{user.name}</strong>
                <span className="block truncate text-xs text-slate-500">{user.email}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      <div className="min-w-0">
        {!isAdmin && (
          <header className={`sticky top-0 z-20 flex h-16 items-center justify-between border-b px-4 backdrop-blur md:px-8 ${isStudent ? 'border-[#d8e2ff] bg-white/95 shadow-sm' : 'border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/85'}`}>
            <>
              <div>
                <p className={`text-[10px] font-black uppercase tracking-[0.22em] ${isStudent ? 'text-[#0058bd]' : 'text-blue-600'}`}>{roleLabel(user.role)}</p>
                <strong className={isStudent ? 'text-[#151c26]' : ''}>{currentLabel(nav, view)}</strong>
              </div>
              <div className="flex items-center gap-2">
                <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800"><Bell size={18} /></button>
                <button className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 dark:bg-slate-800"><Settings size={18} /></button>
              </div>
            </>
          </header>
        )}
        <main className={isAdmin ? 'bg-[#f7f9fb] p-5 md:p-8' : 'p-4 md:p-8'}>{children}</main>
        {isAdmin && showAdminProfile && <AdminProfilePanel user={user} onClose={() => setShowAdminProfile(false)} />}
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

function AdminProfilePanel({ user, onClose }: { user: User; onClose: () => void }) {
  const [profile, setProfile] = useState({
    name: user.name,
    email: user.email,
    phone: '5550-1900',
    role: 'Administrador de profesores',
    department: 'Coordinacion academica',
  });

  return (
    <div className="fixed inset-0 z-40 bg-[#172033]/35 p-4 backdrop-blur-sm">
      <div className="ml-auto h-full max-w-[520px] overflow-y-auto rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004ac6]">Perfil administrativo</p>
            <h2 className="mt-2 text-3xl font-black text-[#191c1e]">Configuracion de perfil</h2>
            <p className="mt-2 text-sm text-[#434655]">Actualiza los datos visibles del administrador de profesores.</p>
          </div>
          <button className="rounded-full border border-[#c3c6d7] px-3 py-2 text-sm font-bold text-[#434655]" onClick={onClose} type="button">Cerrar</button>
        </div>
        <div className="mt-6 flex items-center gap-4 rounded-xl bg-[#f7f9fb] p-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#2563eb] text-xl font-black text-white">{initials(profile.name)}</span>
          <div>
            <strong className="block text-lg text-[#191c1e]">{profile.name}</strong>
            <span className="text-sm text-[#434655]">{profile.role}</span>
          </div>
        </div>
        <form className="mt-6 grid gap-4" onSubmit={(event) => event.preventDefault()}>
          {[
            ['name', 'Nombre completo'],
            ['email', 'Correo institucional'],
            ['phone', 'Telefono'],
            ['role', 'Rol'],
            ['department', 'Area responsable'],
          ].map(([key, label]) => (
            <label key={key}>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">{label}</span>
              <input
                className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                onChange={(event) => setProfile((current) => ({ ...current, [key]: event.target.value }))}
                value={profile[key as keyof typeof profile]}
              />
            </label>
          ))}
          <button className="rounded-2xl bg-[#1f5eff] px-5 py-3 font-black text-white transition hover:bg-[#004ac6]" onClick={onClose} type="button">Guardar cambios</button>
        </form>
      </div>
    </div>
  );
}

function FamilyStudentSelection({ current, onSelect, onClose }: { current: FamilyChild; onSelect: (child: FamilyChild) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen flex-col bg-[#f3faff] text-[#021f29]" style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#1a535c 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
      <header className="relative z-10 flex h-20 items-center justify-between px-6 md:px-10">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-[#003b43]" size={32} />
          <strong className="text-3xl font-black text-[#003b43]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ParentPortal</strong>
        </div>
        <button className="rounded-full px-4 py-2 font-bold text-[#40484a] transition hover:bg-[#d1ecfa] hover:text-[#003b43]" onClick={onClose} type="button">Volver al portal</button>
      </header>
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black text-[#003b43]" style={{ color: '#003b43', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>¡Hola de nuevo!</h1>
          <p className="mt-3 text-xl text-[#40484a]">¿A quién deseas supervisar hoy?</p>
        </div>
        <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
          {familyChildren.map((child) => {
            const selected = current.id === child.id;
            return (
              <article className="group relative flex flex-col items-center rounded-xl border border-[#003b43]/10 bg-white p-6 text-center transition duration-300 hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(26,83,92,0.08)]" key={child.id}>
                <div className="relative mb-4">
                  <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-[#cbe7f5] p-1">
                    <img alt={child.name} className="h-full w-full rounded-full object-cover" src={child.avatar} />
                  </div>
                  {selected && (
                    <span className="absolute bottom-0 right-0 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-[#7cf6ec] text-[#00201e] shadow-sm">
                      <ShieldCheck size={22} />
                    </span>
                  )}
                </div>
                <h2 className="text-3xl font-black text-[#021f29]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{child.name.split(' ')[0]}</h2>
                <p className="mt-2 rounded-full border border-[#003b43]/5 bg-[#e6f6ff] px-4 py-1 font-bold text-[#40484a]">{child.grade}</p>
                <div className="my-5 h-px w-full bg-[#003b43]/5" />
                <div className="mb-5 flex gap-5 text-sm font-bold text-[#40484a]">
                  <span className="inline-flex items-center gap-1"><BookOpen size={16} /> {child.subjects} Materias</span>
                  <span className="inline-flex items-center gap-1"><LineChart size={16} /> {(child.average / 10).toFixed(1)} Promedio</span>
                </div>
                <button className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#003b43] font-bold text-[#003b43] transition group-hover:scale-[1.02] group-hover:bg-[#003b43] group-hover:text-white" onClick={() => onSelect(child)} type="button">
                  Seleccionar Perfil
                  <ArrowRight size={22} />
                </button>
              </article>
            );
          })}
        </div>
        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm font-bold text-[#40484a]">¿Necesitas ayuda? <a className="text-[#003b43] underline" href="#">Contacta a soporte</a></p>
        </div>
      </main>
    </div>
  );
}

function RoleContent({ user, view, setView, onLogout, selectedFamilyChild, onFamilyChildChange }: { user: User; view: View; setView: (view: View) => void; onLogout: () => void; selectedFamilyChild: FamilyChild; onFamilyChildChange: (child: FamilyChild) => void }) {
  if (user.role === 'admin') return <AdminViews view={view} setView={setView} />;
  if (user.role === 'teacher') return <TeacherViews view={view} setView={setView} onLogout={onLogout} />;
  if (user.role === 'student') return <StudentViews view={view} setView={setView} onLogout={onLogout} />;
  return <FamilyViews view={view} setView={setView} selectedChild={selectedFamilyChild} onChildChange={onFamilyChildChange} onLogout={onLogout} />;
}

function AdminViews({ view, setView }: { view: View; setView: (view: View) => void }) {
  if (view === 'admin-teachers') return <AdminTeachers setView={setView} />;
  if (view === 'admin-activities') return <AdminActivities />;
  if (view === 'admin-notices') return <AdminNotices />;
  if (view === 'admin-groups') return <AdminGroups setView={setView} />;
  if (view === 'admin-create-committee') return <AdminCreateCommittee />;
  if (view === 'admin-enrollment') return <AdminEnrollment />;
  if (view === 'admin-create-teacher') return <AdminCreateTeacher />;
  return <AdminDashboard setView={setView} />;
}

function AdminDashboard({ setView }: { setView: (view: View) => void }) {
  return (
    <AdminPage title="Panel de Control Principal" subtitle="Informacion relevante para administracion academica y seguimiento institucional.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminMetric title="Profesores" value="142" detail="+8 activos este mes" icon={<GraduationCap />} />
        <AdminMetric title="Alumnos" value="1,284" detail="15 inscripciones nuevas" icon={<Users />} />
        <AdminMetric title="Materias activas" value="64" detail="3 con conflicto" icon={<BookOpen />} />
        <AdminMetric title="Actividades" value="28" detail="7 esta semana" icon={<CalendarDays />} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <AdminCard title="Calendario Institucional" toolbar={<button className="text-sm font-bold text-[#004ac6]" onClick={() => setView('admin-activities')} type="button">Gestionar calendario</button>}>
          <AdminCalendar />
        </AdminCard>
        <AdminCard title="Actividades Recientes">
          <AdminActivityFeed />
        </AdminCard>
      </div>
      <AdminCard title="Acciones Rapidas">
        <div className="grid gap-3 md:grid-cols-3">
          <AdminAction title="Nueva Inscripcion" text="Recibir expediente de estudiante" icon={<ClipboardList />} onClick={() => setView('admin-enrollment')} />
          <AdminAction title="Crear Perfil de Profesor" text="Registrar datos y rol institucional" icon={<GraduationCap />} onClick={() => setView('admin-create-teacher')} />
          <AdminAction title="Nuevo Comite" text="Definir miembros y responsabilidades" icon={<Users />} onClick={() => setView('admin-create-committee')} />
        </div>
      </AdminCard>
    </AdminPage>
  );
}

function AdminTeachers({ setView }: { setView: (view: View) => void }) {
  const [query, setQuery] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState(teachers[0]);
  const [teacherPanel, setTeacherPanel] = useState<'profile' | 'update' | 'message' | 'deactivate' | null>(null);
  const [teacherForm, setTeacherForm] = useState({
    name: teachers[0].name,
    email: teachers[0].email,
    specialty: teachers[0].specialty,
    phone: '5552-1048',
    course: teachers[0].load > 80 ? '5 cursos' : '3 cursos',
    committee: teachers[0].committees,
  });
  const filtered = teachers.filter((teacher) => `${teacher.name} ${teacher.specialty}`.toLowerCase().includes(query.toLowerCase()));
  const selectTeacher = (teacher: typeof teachers[number]) => {
    setSelectedTeacher(teacher);
    setTeacherForm({
      name: teacher.name,
      email: teacher.email,
      specialty: teacher.specialty,
      phone: teacher.name.includes('Marco') ? '5554-2210' : teacher.name.includes('Sofia') ? '5551-7788' : teacher.name.includes('Daniel') ? '5559-3021' : '5552-1048',
      course: teacher.load > 80 ? '5 cursos' : '3 cursos',
      committee: teacher.committees,
    });
  };
  const openTeacherPanel = (teacher: typeof teachers[number], panel: typeof teacherPanel) => {
    selectTeacher(teacher);
    setTeacherPanel(panel);
  };

  return (
    <AdminPage title="Gestion de Profesores" subtitle="Administrar perfiles, cursos asignados, comites, carga academica y datos institucionales.">
      <div className="grid gap-6">
        <AdminCard title="Teacher Directory" toolbar={<SearchInput value={query} onChange={setQuery} placeholder="Buscar profesor..." />}>
          <div className="overflow-x-auto rounded-2xl border border-[#c3c6d7]">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-[#1f2d44] text-xs font-black uppercase tracking-wider text-[#9ab0cf]">
                <tr>{['Profesor', 'Especialidad', 'Cursos', 'Comites', 'Estado', 'Acciones'].map((header) => <th className="px-5 py-3" key={header}>{header}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#d8deea]">
                {filtered.map((teacher) => {
                  const selected = selectedTeacher.email === teacher.email;
                  return (
                    <tr className={`cursor-pointer transition ${selected ? 'bg-[#eef4ff]' : 'bg-white hover:bg-[#f7f9fb]'}`} key={teacher.email} onClick={() => selectTeacher(teacher)}>
                      <td className="px-5 py-4"><Person name={teacher.name} sub={teacher.email} /></td>
                      <td className="px-5 py-4"><AdminBadge>{teacher.specialty}</AdminBadge></td>
                      <td className="px-5 py-4">{teacher.load > 80 ? '5 cursos' : '3 cursos'}</td>
                      <td className="px-5 py-4">{teacher.committees}</td>
                      <td className="px-5 py-4"><Status value={teacher.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#dbe1ff] text-[#004ac6] transition hover:scale-105" onClick={(event) => { event.stopPropagation(); openTeacherPanel(teacher, 'profile'); }} title="Ver perfil" type="button"><Eye size={17} /></button>
                          <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#fff1c7] text-[#775900] transition hover:scale-105" onClick={(event) => { event.stopPropagation(); openTeacherPanel(teacher, 'update'); }} title="Actualizar" type="button"><Pencil size={17} /></button>
                          <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#d9f7e8] text-[#006b3b] transition hover:scale-105" onClick={(event) => { event.stopPropagation(); openTeacherPanel(teacher, 'message'); }} title="Mandar mensaje" type="button"><Send size={17} /></button>
                          <button className="grid h-9 w-9 place-items-center rounded-lg bg-[#ffdad6] text-[#93000a] transition hover:scale-105" onClick={(event) => { event.stopPropagation(); openTeacherPanel(teacher, 'deactivate'); }} title="Desactivar o eliminar" type="button"><Trash2 size={17} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </AdminCard>
        <div>
          <button className="rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-sm font-bold text-[#004ac6]" onClick={() => setView('admin-create-teacher')} type="button">Crear nuevo profesor</button>
        </div>
      </div>
      {teacherPanel && (
        <TeacherActionPanel
          form={teacherForm}
          onClose={() => setTeacherPanel(null)}
          onFormChange={setTeacherForm}
          panel={teacherPanel}
          teacher={selectedTeacher}
        />
      )}
    </AdminPage>
  );
}

function TeacherActionPanel({
  teacher,
  panel,
  form,
  onFormChange,
  onClose,
}: {
  teacher: typeof teachers[number];
  panel: 'profile' | 'update' | 'message' | 'deactivate';
  form: { name: string; email: string; specialty: string; phone: string; course: string; committee: string };
  onFormChange: (value: { name: string; email: string; specialty: string; phone: string; course: string; committee: string }) => void;
  onClose: () => void;
}) {
  const [message, setMessage] = useState(`Hola ${teacher.name.split(' ')[0]}, necesito comentarte un tema institucional.`);
  const titleByPanel = {
    profile: 'Perfil del profesor',
    update: 'Actualizar profesor',
    message: 'Mensaje directo',
    deactivate: 'Desactivar o eliminar',
  };

  return (
    <div className="fixed inset-0 z-40 bg-[#172033]/35 p-4 backdrop-blur-sm">
      <div className="ml-auto h-full max-w-[540px] overflow-y-auto rounded-2xl border border-[#c3c6d7] bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004ac6]">Gestion de profesores</p>
            <h2 className="mt-2 text-3xl font-black text-[#191c1e]">{titleByPanel[panel]}</h2>
            <p className="mt-2 text-sm text-[#434655]">{teacher.name} · {teacher.email}</p>
          </div>
          <button className="rounded-full border border-[#c3c6d7] px-3 py-2 text-sm font-bold text-[#434655]" onClick={onClose} type="button">Cerrar</button>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-xl bg-[#f7f9fb] p-4">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-[#dbe1ff] text-xl font-black text-[#004ac6]">{initials(teacher.name)}</span>
          <div>
            <strong className="block text-lg text-[#191c1e]">{teacher.name}</strong>
            <span className="text-sm text-[#434655]">{teacher.specialty} · {teacher.status}</span>
          </div>
        </div>

        {panel === 'profile' && (
          <div className="mt-6 grid gap-3">
            {[
              ['Especialidad', teacher.specialty],
              ['Correo institucional', teacher.email],
              ['Cursos asignados', teacher.load > 80 ? '5 cursos' : '3 cursos'],
              ['Comites', teacher.committees],
              ['Carga academica', `${teacher.load}%`],
              ['Estado', teacher.status],
            ].map(([label, value]) => (
              <div className="rounded-xl border border-[#e0e3e5] bg-white p-4" key={label}>
                <p className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">{label}</p>
                <strong className="mt-1 block text-[#191c1e]">{value}</strong>
              </div>
            ))}
          </div>
        )}

        {panel === 'update' && (
          <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            {[
              ['name', 'Nombre completo'],
              ['email', 'Correo institucional'],
              ['specialty', 'Especialidad'],
              ['phone', 'Telefono'],
              ['course', 'Curso asignado'],
              ['committee', 'Comite'],
            ].map(([key, label]) => (
              <label key={key}>
                <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">{label}</span>
                <input
                  className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                  onChange={(event) => onFormChange({ ...form, [key]: event.target.value })}
                  value={form[key as keyof typeof form]}
                />
              </label>
            ))}
            <button className="rounded-2xl bg-[#1f5eff] px-5 py-3 font-black text-white transition hover:bg-[#004ac6] md:col-span-2" onClick={onClose} type="button">Guardar cambios</button>
          </form>
        )}

        {panel === 'message' && (
          <div className="mt-6 grid gap-4">
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">Mensaje para {teacher.name}</span>
              <textarea className="admin-input mt-2 min-h-40 w-full rounded-2xl border border-[#c3c6d7] px-4 py-3 text-sm outline-none" onChange={(event) => setMessage(event.target.value)} value={message} />
            </label>
            <div className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-[#434655]">
              El mensaje quedara preparado como comunicacion directa entre el administrador y el profesor.
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007a43] px-5 py-3 font-black text-white transition hover:bg-[#006b3b]" onClick={onClose} type="button"><Send size={18} /> Enviar mensaje</button>
          </div>
        )}

        {panel === 'deactivate' && (
          <div className="mt-6 grid gap-4">
            <div className="rounded-xl border border-[#ffdad6] bg-[#fff2f0] p-4">
              <h3 className="text-lg font-bold text-[#93000a]">Accion sensible</h3>
              <p className="mt-2 text-sm text-[#434655]">Puedes desactivar al profesor para impedir acceso temporal, o marcarlo para eliminacion administrativa cuando deje de laborar en la institucion.</p>
            </div>
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">Motivo</span>
              <textarea className="admin-input mt-2 min-h-28 w-full rounded-2xl border border-[#c3c6d7] px-4 py-3 text-sm outline-none" placeholder="Describe el motivo de la accion..." />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <button className="rounded-2xl bg-[#b26a00] px-5 py-3 font-black text-white transition hover:bg-[#8f5600]" onClick={onClose} type="button">Desactivar acceso</button>
              <button className="rounded-2xl bg-[#ba1a1a] px-5 py-3 font-black text-white transition hover:bg-[#93000a]" onClick={onClose} type="button">Marcar baja laboral</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminActivities() {
  const activities = [
    { subject: 'Matematicas - 5to', activity: 'Olimpiada interna', owner: 'Elena Rodriguez', date: '12 Oct', status: 'Activo', resources: 'Aulas 3 y 4, proyectores', notes: 'Confirmar jurado y reconocimientos.' },
    { subject: 'Ciencias - Basico', activity: 'Feria STEM', owner: 'Marco Fuentes', date: '18 Oct', status: 'Pendiente', resources: 'Laboratorio, mesas, extensiones', notes: 'Falta validar lista de materiales.' },
    { subject: 'Arte - Primaria', activity: 'Muestra creativa', owner: 'Sara Mendez', date: '24 Oct', status: 'Conflictiva', resources: 'Salon multiusos', notes: 'Comparte horario con actividad de ciencias.' },
  ];
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [selectedActivity, setSelectedActivity] = useState(activities[0]);
  const shownActivities = statusFilter === 'Todos' ? activities : activities.filter((activity) => activity.status === statusFilter);
  const exportActivities = () => {
    const csv = ['Materia,Actividad,Responsable,Fecha,Estado', ...shownActivities.map((activity) => [activity.subject, activity.activity, activity.owner, activity.date, activity.status].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'actividades_admin_profesores.csv';
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <AdminPage title="Materias y Actividades" subtitle="Programacion y administracion de actividades academicas, extracurriculares y conflictos de horario.">
      <AdminCard title="Actividades Planificadas" toolbar={<div className="flex gap-2"><button className="rounded border border-[#c3c6d7] bg-white px-3 py-2 text-sm font-bold text-[#004ac6]" onClick={() => setFilterOpen((current) => !current)} type="button">Filtrar</button><button className="rounded border border-[#c3c6d7] bg-white px-3 py-2 text-sm font-bold text-[#004ac6]" onClick={exportActivities} type="button">Exportar</button></div>}>
        {filterOpen && (
          <div className="mb-4 flex flex-wrap gap-2 rounded-xl border border-[#d8deea] bg-[#f7f9fb] p-3">
            {['Todos', 'Activo', 'Pendiente', 'Conflictiva'].map((status) => (
              <button className={`rounded-full px-4 py-2 text-sm font-bold transition ${statusFilter === status ? 'bg-[#dbe1ff] text-[#004ac6]' : 'bg-white text-[#434655] hover:bg-[#eef4ff]'}`} key={status} onClick={() => setStatusFilter(status)} type="button">{status}</button>
            ))}
          </div>
        )}
        <div className="overflow-x-auto rounded-2xl border border-[#c3c6d7]">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-[#1f2d44] text-xs font-black uppercase tracking-wider text-[#9ab0cf]">
              <tr>{['Materia / Grado', 'Actividad', 'Responsable', 'Fecha', 'Estado'].map((header) => <th className="px-5 py-3" key={header}>{header}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-[#d8deea]">
              {shownActivities.map((activity) => {
                const selected = selectedActivity.activity === activity.activity;
                return (
                  <tr className={`cursor-pointer transition ${selected ? 'bg-[#eef4ff]' : 'bg-white hover:bg-[#f7f9fb]'}`} key={activity.activity} onClick={() => setSelectedActivity(activity)}>
                    <td className="px-5 py-4">{activity.subject}</td>
                    <td className="px-5 py-4">{activity.activity}</td>
                    <td className="px-5 py-4">{activity.owner}</td>
                    <td className="px-5 py-4">{activity.date}</td>
                    <td className="px-5 py-4"><Status value={activity.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </AdminCard>
      <div className="grid gap-6 lg:grid-cols-2">
        <AdminCard title={`Actividad seleccionada: ${selectedActivity.activity}`}>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            {[
              ['activity', 'Nombre de actividad'],
              ['subject', 'Curso o area'],
              ['date', 'Fecha'],
              ['owner', 'Responsable'],
              ['resources', 'Recursos necesarios'],
              ['notes', 'Observaciones'],
            ].map(([key, label]) => (
              <label className={key === 'notes' ? 'md:col-span-2' : ''} key={key}>
                <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">{label}</span>
                <input
                  className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                  onChange={(event) => setSelectedActivity((current) => ({ ...current, [key]: event.target.value }))}
                  value={selectedActivity[key as keyof typeof selectedActivity]}
                />
              </label>
            ))}
            <button className="rounded-2xl bg-[#1f5eff] px-5 py-3 font-black text-white transition hover:bg-[#004ac6] md:col-span-2" type="submit">Guardar actividad</button>
          </form>
        </AdminCard>
        <AdminCard title="Alertas de programacion">
          <AdminAction title="Conflicto de horario" text="Arte y Ciencias comparten salon a las 10:00" icon={<Bell />} />
          <AdminAction title="Recurso pendiente" text="Solicitar equipo de audio para actividad extracurricular" icon={<ClipboardList />} />
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function AdminNotices() {
  const [title, setTitle] = useState('Reunion general de profesores');
  const [message, setMessage] = useState('Favor revisar el calendario institucional y confirmar asistencia antes del viernes.');
  const [priority, setPriority] = useState('Alta');
  const [notices, setNotices] = useState([
    { title: 'Actualizacion de calendario', message: 'Se movio la reunion de comites para el jueves.', priority: 'Media', read: 18 },
    { title: 'Entrega de reportes', message: 'Los reportes de unidad deben cerrarse antes del lunes.', priority: 'Alta', read: 9 },
  ]);
  const publishNotice = () => {
    if (!title.trim() || !message.trim()) return;
    setNotices((current) => [{ title: title.trim(), message: message.trim(), priority, read: 0 }, ...current]);
    setTitle('');
    setMessage('');
    setPriority('Media');
  };

  return (
    <AdminPage title="Avisos a Profesores" subtitle="Publicar notificaciones institucionales para todos los profesores y dar seguimiento a su lectura.">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AdminCard title="Nuevo aviso general">
          <div className="grid gap-4">
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">Titulo del aviso</span>
              <input className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] px-4 py-3 text-sm" onChange={(event) => setTitle(event.target.value)} value={title} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">Mensaje para profesores</span>
              <textarea className="admin-input mt-2 min-h-32 w-full rounded-2xl border border-[#c3c6d7] px-4 py-3 text-sm outline-none" onChange={(event) => setMessage(event.target.value)} value={message} />
            </label>
            <label>
              <span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">Prioridad</span>
              <select className="admin-input mt-2 h-12 w-full rounded-2xl border border-[#c3c6d7] px-4 text-sm" onChange={(event) => setPriority(event.target.value)} value={priority}>
                <option>Alta</option>
                <option>Media</option>
                <option>Baja</option>
              </select>
            </label>
            <button className="rounded-2xl bg-[#1f5eff] px-5 py-3 font-black text-white transition hover:bg-[#004ac6]" onClick={publishNotice} type="button">Publicar aviso a todos</button>
          </div>
        </AdminCard>
        <AdminCard title="Alcance de notificacion">
          <div className="grid gap-3">
            <AdminMetric title="Profesores notificados" value="142" detail="Envio inmediato" icon={<Bell />} />
            <p className="rounded-xl bg-[#f7f9fb] p-4 text-sm text-[#434655]">
              Cada profesor vera el aviso como notificacion dentro de su portal. El conteo de lectura queda listo para integrarse con backend.
            </p>
          </div>
        </AdminCard>
      </div>
      <AdminCard title="Avisos publicados">
        <div className="grid gap-3">
          {notices.map((notice) => (
            <article className="rounded-xl border border-[#d8deea] bg-white p-4" key={`${notice.title}-${notice.message}`}>
              <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                <div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${notice.priority === 'Alta' ? 'bg-[#ffdad6] text-[#93000a]' : notice.priority === 'Media' ? 'bg-[#fff1c7] text-[#6f4d00]' : 'bg-[#dbe1ff] text-[#004ac6]'}`}>{notice.priority}</span>
                  <h3 className="mt-3 text-xl font-bold text-[#191c1e]">{notice.title}</h3>
                  <p className="mt-2 text-sm text-[#434655]">{notice.message}</p>
                </div>
                <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-sm font-bold text-[#004ac6]">{notice.read}/142 leidos</span>
              </div>
            </article>
          ))}
        </div>
      </AdminCard>
    </AdminPage>
  );
}

function AdminGroups({ setView }: { setView: (view: View) => void }) {
  const committees = [
    {
      name: 'Comite de Convivencia',
      description: 'Promueve clima escolar positivo y mediacion.',
      members: ['Elena Rodriguez', 'Sofia Morales', 'Admin Profesores'],
      activities: 3,
      meeting: '12 Oct',
    },
    {
      name: 'Comision de Evaluacion',
      description: 'Da seguimiento a criterios y reportes de evaluacion.',
      members: ['Marco Fuentes', 'Elena Rodriguez', 'Admin Profesores'],
      activities: 4,
      meeting: '15 Oct',
    },
    {
      name: 'Gestion de Riesgos',
      description: 'Coordina protocolos, simulacros y recursos.',
      members: ['Daniel Herrera', 'Marco Fuentes', 'Admin Profesores'],
      activities: 2,
      meeting: '20 Oct',
    },
  ];
  const [panel, setPanel] = useState<{ type: 'members' | 'chat'; name: string } | null>(null);
  const [committeeMembers, setCommitteeMembers] = useState<Record<string, string[]>>(
    Object.fromEntries(committees.map((committee) => [committee.name, committee.members])),
  );
  const [chatMessages, setChatMessages] = useState<Record<string, Array<{ author: string; text: string; recipient: string }>>>(
    Object.fromEntries(committees.map((committee) => [committee.name, [
      { author: committee.members[0], text: 'Comparto agenda propuesta para la reunion y puntos pendientes.', recipient: 'General' },
      { author: 'Admin Profesores', text: 'Perfecto, revisare responsables y confirmare fecha con direccion.', recipient: 'General' },
    ]])),
  );
  const [chatText, setChatText] = useState('');
  const [chatRecipient, setChatRecipient] = useState('General');
  const activeCommittee = committees.find((committee) => committee.name === panel?.name);
  const activeMembers = panel ? committeeMembers[panel.name] ?? [] : [];

  const toggleMember = (committee: string, member: string) => {
    setCommitteeMembers((current) => {
      const members = current[committee] ?? [];
      return {
        ...current,
        [committee]: members.includes(member) ? members.filter((item) => item !== member) : [...members, member],
      };
    });
  };
  const sendCommitteeMessage = () => {
    if (!panel || !chatText.trim()) return;
    setChatMessages((current) => ({
      ...current,
      [panel.name]: [...(current[panel.name] ?? []), { author: 'Admin Profesores', text: chatText.trim(), recipient: chatRecipient }],
    }));
    setChatText('');
  };

  return (
    <AdminPage title="Gestion de Comites" subtitle="Supervisar grupos, reuniones, miembros, responsabilidades y comunicacion interna.">
      <div className="grid gap-4 md:grid-cols-3">
        <AdminMetric title="Total Comites" value="12" detail="3 activos prioritarios" icon={<Users />} />
        <AdminMetric title="Miembros Activos" value="48" detail="6 incorporaciones" icon={<GraduationCap />} />
        <AdminMetric title="Actividades" value="23" detail="5 en curso" icon={<ClipboardList />} />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {committees.map((committee) => (
          <AdminCard key={committee.name} title={committee.name}>
            <p className="text-sm text-[#434655]">{committee.description}</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><strong>{committeeMembers[committee.name]?.length ?? committee.members.length}</strong> miembros activos</p>
              <p><strong>{committee.activities}</strong> actividades planeadas</p>
              <p><strong>Proxima reunion:</strong> {committee.meeting}</p>
              <p className="text-[#5d6b82]"><strong>Admin fijo:</strong> Admin Profesores</p>
            </div>
            <div className="mt-5 flex gap-2">
              <button className="rounded bg-[#004ac6] px-4 py-2 text-sm font-bold text-white" onClick={() => setPanel({ type: 'members', name: committee.name })} type="button">Editar miembros</button>
              <button className="rounded border border-[#c3c6d7] bg-white px-4 py-2 text-sm font-bold text-[#004ac6]" onClick={() => setPanel({ type: 'chat', name: committee.name })} type="button">Chat</button>
            </div>
          </AdminCard>
        ))}
      </div>
      {panel && activeCommittee && (
        <AdminCard
          title={panel.type === 'members' ? `Miembros de ${panel.name}` : `Chat de ${panel.name}`}
          toolbar={<button className="rounded border border-[#c3c6d7] bg-white px-3 py-2 text-sm font-bold text-[#434655]" onClick={() => setPanel(null)} type="button">Cerrar</button>}
        >
          {panel.type === 'members' ? (
            <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
              <div className="grid gap-3 md:grid-cols-2">
                {teachers.map((teacher) => {
                  const selected = activeMembers.includes(teacher.name);
                  return (
                    <button
                      className={`rounded-xl border p-4 text-left transition ${selected ? 'border-[#004ac6] bg-[#dbe1ff]' : 'border-[#c3c6d7] bg-white hover:border-[#004ac6]'}`}
                      key={teacher.email}
                      onClick={() => toggleMember(panel.name, teacher.name)}
                      type="button"
                    >
                      <strong className="block text-[#191c1e]">{teacher.name}</strong>
                      <span className="text-sm text-[#434655]">{teacher.specialty} · {teacher.email}</span>
                      <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${selected ? 'bg-[#004ac6] text-white' : 'bg-[#f2f4f6] text-[#434655]'}`}>{selected ? 'Asignado' : 'Agregar'}</span>
                    </button>
                  );
                })}
              </div>
              <aside className="rounded-xl border border-[#e0e3e5] bg-[#f7f9fb] p-4">
                <h4 className="font-bold text-[#191c1e]">Miembros actuales</h4>
                <div className="mt-3 space-y-2">
                  {activeMembers.map((member) => (
                    <div className="flex items-center justify-between rounded-lg bg-white p-3 text-sm" key={member}>
                      <span className="font-semibold text-[#191c1e]">{member}</span>
                      {member === 'Admin Profesores' ? (
                        <span className="rounded-full bg-[#dbe1ff] px-2 py-1 text-xs font-bold text-[#004ac6]">Admin fijo</span>
                      ) : (
                        <button className="font-bold text-[#ba1a1a]" onClick={() => toggleMember(panel.name, member)} type="button">Quitar</button>
                      )}
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
              <div className="rounded-xl border border-[#e0e3e5] bg-[#f7f9fb] p-4">
                <div className="space-y-3">
                  {(chatMessages[panel.name] ?? []).map((message, index) => (
                    <div className={`max-w-[86%] rounded-xl p-3 shadow-sm ${message.author === 'Admin Profesores' ? 'ml-auto bg-[#dbe1ff]' : 'bg-white'}`} key={`${message.author}-${index}`}>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className={`text-sm font-bold ${message.author === 'Admin Profesores' ? 'text-[#003ea8]' : 'text-[#191c1e]'}`}>{message.author}</p>
                        <span className="rounded-full bg-[#eef4ff] px-2 py-0.5 text-[11px] font-bold text-[#004ac6]">{message.recipient === 'General' ? 'General' : `Privado: ${message.recipient}`}</span>
                      </div>
                      <p className="mt-1 text-sm text-[#434655]">{message.text}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-[180px_1fr_auto]">
                  <select className="admin-input h-11 rounded-xl border border-[#c3c6d7] px-3 text-sm" onChange={(event) => setChatRecipient(event.target.value)} value={chatRecipient}>
                    <option>General</option>
                    {activeMembers.filter((member) => member !== 'Admin Profesores').map((member) => <option key={member}>{member}</option>)}
                  </select>
                  <input className="admin-input h-11 rounded-xl border border-[#c3c6d7] px-4 text-sm" onChange={(event) => setChatText(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') sendCommitteeMessage(); }} placeholder="Escribir mensaje para el comite..." value={chatText} />
                  <button className="rounded-xl bg-[#004ac6] px-5 text-sm font-bold text-white" onClick={sendCommitteeMessage} type="button">Enviar</button>
                </div>
              </div>
              <aside className="rounded-xl border border-[#e0e3e5] bg-white p-4">
                <h4 className="font-bold text-[#191c1e]">Participantes</h4>
                <div className="mt-3 space-y-2">
                  {activeMembers.map((member) => (
                    <div className="flex items-center gap-3 rounded-lg bg-[#f7f9fb] p-3" key={member}>
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-[#dbe1ff] text-xs font-black text-[#004ac6]">{initials(member)}</span>
                      <span className="text-sm font-semibold text-[#191c1e]">{member}</span>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          )}
        </AdminCard>
      )}
      <button className="rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white" onClick={() => setView('admin-create-committee')} type="button">Crear nuevo comite</button>
    </AdminPage>
  );
}

function AdminCreateCommittee() {
  const [members, setMembers] = useState(['Elena Rodriguez', 'Marco Fuentes']);
  return (
    <AdminPage title="Establecer Nueva Comision" subtitle="Crear grupos, asignar finalidad, responsabilidades, miembros y espacio de coordinacion.">
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          <AdminCard title="Informacion de la Comision">
            <FormGrid fields={['Nombre del comite o comision', 'Finalidad institucional', 'Fecha de inicio', 'Coordinador responsable', 'Responsabilidades principales', 'Indicadores de seguimiento']} button="Guardar informacion" />
          </AdminCard>
          <AdminCard title="Agregar Miembros">
            <div className="grid gap-3 md:grid-cols-3">
              {teachers.slice(0, 3).map((teacher) => (
                <button className="rounded-lg border border-[#c3c6d7] bg-white p-4 text-left transition hover:border-[#004ac6]" key={teacher.email} onClick={() => setMembers((current) => current.includes(teacher.name) ? current : [...current, teacher.name])} type="button">
                  <strong className="block text-[#191c1e]">{teacher.name}</strong>
                  <span className="text-sm text-[#434655]">{teacher.specialty}</span>
                  <span className="mt-3 inline-flex rounded bg-[#dbe1ff] px-3 py-1 text-xs font-bold text-[#003ea8]">Add</span>
                </button>
              ))}
            </div>
          </AdminCard>
        </div>
        <div className="space-y-6">
          <AdminCard title="Selected Members">
            <div className="space-y-3">
              {members.map((member) => (
                <div className="flex items-center justify-between rounded-lg bg-[#f2f4f6] p-3" key={member}>
                  <span className="font-semibold text-[#191c1e]">{member}</span>
                  <button className="text-sm font-bold text-[#ba1a1a]" onClick={() => setMembers((current) => current.filter((item) => item !== member))} type="button">Eliminar</button>
                </div>
              ))}
            </div>
          </AdminCard>
          <AdminCard title="Committee Chat">
            <div className="space-y-3 rounded-lg bg-[#f7f9fb] p-4">
              <p className="rounded-lg bg-white p-3 text-sm"><strong>Elena:</strong> Propongo reunirnos el viernes para definir responsables.</p>
              <p className="rounded-lg bg-[#dbe1ff] p-3 text-sm"><strong>Marco:</strong> Confirmo disponibilidad y compartire agenda.</p>
              <input className="w-full rounded border border-[#c3c6d7] px-3 py-2 text-sm" placeholder="Escribir mensaje al comite..." />
            </div>
          </AdminCard>
          <button className="w-full rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white" type="button">Crear comision</button>
        </div>
      </div>
    </AdminPage>
  );
}

function AdminEnrollment() {
  return (
    <AdminPage title="Student Admission Form" subtitle="Inscripcion y recepcion de nuevos estudiantes, encargados y documentos de admision.">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <AdminCard title="Datos del estudiante">
            <FormGrid fields={['Nombre completo', 'Fecha de nacimiento', 'Grado solicitado', 'Codigo temporal', 'Direccion', 'Observaciones medicas']} button="Guardar estudiante" />
          </AdminCard>
          <AdminCard title="Encargados">
            <FormGrid fields={['Nombre encargado principal', 'Telefono', 'Correo', 'Relacion familiar']} button="Agregar encargado" />
          </AdminCard>
          <AdminCard title="Documentos">
            <div className="grid gap-4 md:grid-cols-2">
              {['Certificado de nacimiento', 'Constancia de notas', 'Documento de encargado', 'Fotografia'].map((doc) => (
                <label className="rounded-lg border-2 border-dashed border-[#c3c6d7] bg-[#f7f9fb] p-5 text-center" key={doc}>
                  <Upload className="mx-auto text-[#004ac6]" />
                  <span className="mt-2 block text-sm font-bold text-[#191c1e]">{doc}</span>
                  <input className="mt-3 w-full text-xs" type="file" />
                </label>
              ))}
            </div>
          </AdminCard>
        </div>
        <AdminCard title="Admissions Snapshot">
          <AdminMetric title="Pendientes" value="18" detail="Expedientes incompletos" icon={<ClipboardList />} />
          <div className="mt-4 space-y-3 text-sm text-[#434655]">
            <p>Validar documentos antes de generar usuario institucional.</p>
            <p>Enviar confirmacion al encargado al finalizar la inscripcion.</p>
          </div>
          <button className="mt-5 w-full rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white" type="button">Finalizar inscripcion</button>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function AdminCreateTeacher() {
  const [teacherRole, setTeacherRole] = useState('Docente titular');
  return (
    <AdminPage title="Create Teacher Profile" subtitle="Registro de profesor, datos profesionales, cursos, comites y rol institucional.">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <AdminCard title="Personal Information">
            <FormGrid fields={['Nombre completo', 'Correo institucional', 'Telefono', 'Direccion']} button="Guardar informacion personal" />
          </AdminCard>
          <AdminCard title="Professional Details">
            <FormGrid fields={['Especialidad', 'Titulo academico', 'Cursos asignados', 'Comites asignados', 'Fecha de contratacion', 'Jornada']} button="Guardar perfil docente" />
          </AdminCard>
          <AdminCard title="Rol a desempeñar">
            <div className="grid gap-3 md:grid-cols-3">
              {['Docente titular', 'Coordinador de area', 'Tutor de grado', 'Apoyo academico', 'Encargado de comite', 'Docente extracurricular'].map((role) => (
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${teacherRole === role ? 'border-[#004ac6] bg-[#eef4ff]' : 'border-[#c3c6d7] bg-white hover:bg-[#f7f9fb]'}`} key={role}>
                  <input className="h-4 w-4 accent-[#004ac6]" checked={teacherRole === role} name="teacher-role" onChange={() => setTeacherRole(role)} type="radio" />
                  <span className="text-sm font-bold text-[#191c1e]">{role}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-[#f7f9fb] p-4 text-sm text-[#434655]">Rol seleccionado: <strong>{teacherRole}</strong>. Los permisos del sistema los definira el backend segun este rol.</p>
          </AdminCard>
        </div>
        <AdminCard title="Profile Preview">
          <div className="rounded-lg border-2 border-dashed border-[#c3c6d7] bg-[#f7f9fb] p-8 text-center">
            <GraduationCap className="mx-auto text-[#004ac6]" size={48} />
            <p className="mt-3 text-sm font-bold text-[#434655]">Agregar fotografia del profesor</p>
            <input className="mt-4 w-full text-xs" type="file" />
          </div>
          <div className="mt-5 space-y-3">
            <AdminAction title="Bitacora transaccional" text="Registrar cambios en Usuario y ProfesorPerfil" icon={<Database />} />
            <AdminAction title="Verificacion" text="Validar correo institucional antes de activar" icon={<ShieldCheck />} />
          </div>
          <button className="mt-5 w-full rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white" type="button">Crear profesor</button>
        </AdminCard>
      </div>
    </AdminPage>
  );
}

function AdminPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="admin-page mx-auto max-w-[1600px] space-y-6 pb-20 text-[#191c1e]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004ac6]">EduAdmin Pro</p>
          <h2 className="mt-2 text-4xl font-black tracking-tight text-[#191c1e]">{title}</h2>
          <p className="mt-2 max-w-3xl text-base leading-7 text-[#434655]">{subtitle}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

function AdminCard({ title, toolbar, children }: { title: string; toolbar?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h3 className="text-lg font-bold text-[#191c1e]">{title}</h3>
        {toolbar}
      </div>
      {children}
    </section>
  );
}

function AdminMetric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#dbe1ff] text-[#004ac6]">{icon}</span>
        <span className="rounded-full bg-[#f2f4f6] px-3 py-1 text-xs font-bold text-[#434655]">{detail}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-wider text-[#737686]">{title}</p>
      <strong className="text-3xl font-black text-[#191c1e]">{value}</strong>
    </article>
  );
}

function AdminAction({ title, text, icon, onClick }: { title: string; text: string; icon: ReactNode; onClick?: () => void }) {
  return (
    <button className="flex w-full items-center gap-3 rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] p-4 text-left transition hover:border-[#004ac6] hover:bg-[#f2f4f6]" onClick={onClick} type="button">
      <span className="grid h-10 w-10 place-items-center rounded bg-[#dbe1ff] text-[#004ac6]">{icon}</span>
      <span>
        <strong className="block text-sm text-[#191c1e]">{title}</strong>
        <small className="text-[#434655]">{text}</small>
      </span>
    </button>
  );
}

function AdminBadge({ children }: { children: ReactNode }) {
  return <span className="rounded-full bg-[#dbe1ff] px-3 py-1 text-xs font-bold text-[#003ea8]">{children}</span>;
}

function AdminCalendar() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 35 }, (_, index) => index + 1).map((day) => (
        <button className={`min-h-16 rounded border p-2 text-left text-xs font-bold ${[5, 12, 18, 24].includes(day) ? 'border-[#004ac6] bg-[#dbe1ff] text-[#00174b]' : 'border-[#e0e3e5] bg-[#f7f9fb] text-[#434655]'}`} key={day} type="button">
          {day}
          {day === 12 && <span className="mt-1 block rounded bg-[#ffdcc3] px-1 py-0.5 text-[10px] text-[#6e3900]">Comite</span>}
        </button>
      ))}
    </div>
  );
}

function AdminActivityFeed() {
  const items = [
    ['Carlos Mendez', 'registrado como profesor de Matematicas', <GraduationCap />],
    ['Feria STEM', 'marcada con conflicto de recursos', <Bell />],
    ['15 alumnos', 'completaron proceso de inscripcion', <Users />],
    ['Comite de Convivencia', 'programo reunion para el viernes', <MessageSquare />],
  ];
  return (
    <div className="space-y-3">
      {items.map(([title, text, icon]) => (
        <div className="flex gap-3 rounded-lg bg-[#f7f9fb] p-3" key={`${title}`}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded bg-[#dbe1ff] text-[#004ac6]">{icon}</span>
          <p className="text-sm text-[#434655]"><strong className="text-[#191c1e]">{title}</strong> {text}</p>
        </div>
      ))}
    </div>
  );
}

function TeacherViews({ view, setView, onLogout }: { view: View; setView: (view: View) => void; onLogout: () => void }) {
  if (view === 'teacher-classes') return <TeacherClasses />;
  if (view === 'teacher-resources') return <TeacherResources setView={setView} />;
  if (view === 'teacher-committees') return <TeacherCommittees />;
  if (view === 'teacher-planning') return <TeacherPlanning />;
  if (view === 'teacher-grades') return <TeacherGrades />;
  if (view === 'teacher-conversations') return <TeacherConversations />;
  if (view === 'teacher-support') return <TeacherSupport />;
  if (view === 'teacher-settings') return <TeacherSettings onLogout={onLogout} />;
  return <TeacherDashboard setView={setView} />;
}

const teacherImages = {
  notebook: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbNEyIpi0Sfl8jckD5kOjmEluW8IKk_krWdykOka-ep_azS3lHTP9Xn1VFTG9wJgpfUH8moAWXPY2iHiJCPuExXh1zeBSDqIXF1n9QvjSNTHc_g_1ikEK4zAhElmYLBNdgrnqaWCuNuT6k7fkKtOG5y_ZCjcoOQr-tvU1QYC2I5vm-X0IxK1_NlLcjWnoei9iWQ8rglmofUg8NnzSlKZsEcLOCHq26mg8AUG4HJlNwMudTZa-N748qwVlsSqHU4rG-mGcWackJMsU',
  brushes: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbFHwYIBZL0wsBz7b9YtkWfNaY-2VDvMkZBcz5VVqdYOPIlTn9PVZkg_sqxVLf-pZBQL5DfonW0sZmg7HQgHGa9WxF5a15V9uJeMC7FjDBOy82YIwvhFKctQL4z5uID4gqW1ES3aDNzfYP4PxKXAaFEp0mVKAf_cgKBFR_FW5MWRyyq4Y_JARXo5pzT7MMdu510iQ1AfdoicT8PwT1norrlYVJxVD75ydV-raLtlBSb4rALAOBPVZoZ2mv8Jcxd0QEEl6JDHGIvWg',
  workspace: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAIAl6yafS1QkbV4kJh90BG22Ohgm5WewQh-kRPkk7FzVQes1zQ5MLgor5cCvH4kC6La4SC44bJQMMQqeqQiBt8pkvdidjwD893pSL-7FZPoXp9W63aqjIN7XOSiuVCG8hdhvkDQp35smPER8KcjAQ75Qaa7AQQdOfOiORsd0I4Yrh4tt1bkV88m1FAZ8dt7TGEqBoM1ryVhV2IJQhY9Qi4S79lIBkXXJ6SX50Au31N5i5AhXWHINBEugZvQ39oauU_wSkQ10ADbM',
  support: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvdCFpAyF-VLJLjip0LdnD9OduZSpLpFZb0vamsIgutCUqwRlfjn6VHNFj7lJ-8N4_w5eRyzQ--bv34n2D7-z-7E3eHKJYE4SUEsvqu4UYjWJUDxYE71HssLHaBTlaT34kZV4gSRPcWgY1QjhgmHiMq7oLl2etFXoxISEmXQuAX2qLbVuW2LiJ-Wb0Rk6NtOl8Urcc55xW9GcpWpzFFOHhNpNDnALLDZHLyMioIxjuHwZ1ngBk2MGk0zesZRl-z3C-YLgRLUaaHJ4',
};

function TeacherPage({ title, subtitle, children, actions }: { title?: string; subtitle?: string; children: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 text-[#102033]">
      {title && (
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black leading-tight text-[#102033]">{title}</h1>
            {subtitle && <p className="mt-2 max-w-3xl text-base leading-6 text-[#57708d]">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </div>
  );
}

function TeacherCard({ title, children, toolbar, className = '' }: { title?: string; children: ReactNode; toolbar?: ReactNode; className?: string }) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#d5deea] bg-white shadow-[0_10px_30px_rgba(20,50,90,0.06)] ${className}`}>
      {(title || toolbar) && <div className="flex items-center justify-between gap-4 border-b border-[#eef3f9] px-5 py-4"><h3 className="text-lg font-black text-[#102033]">{title}</h3>{toolbar}</div>}
      <div className="p-5">{children}</div>
    </section>
  );
}

function TeacherStat({ title, value, detail, icon, tone = 'lavender' }: { title: string; value: string; detail: string; icon: ReactNode; tone?: 'green' | 'red' | 'lavender' | 'blue' }) {
  const toneClass = tone === 'green' ? 'bg-[#dff8e6] text-[#095827]' : tone === 'red' ? 'bg-[#ffe1dd] text-[#9a2118]' : tone === 'blue' ? 'bg-[#dceaff] text-[#0a3a92]' : 'bg-[#ebe7ff] text-[#4338ca]';
  return (
    <article className="rounded-2xl border border-[#d5deea] bg-white p-5 shadow-[0_10px_30px_rgba(20,50,90,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}>{icon}</span>
        <p className={`max-w-36 text-right text-xs font-black leading-5 ${tone === 'green' ? 'text-[#095827]' : tone === 'red' ? 'text-[#ba1a1a]' : 'text-[#57708d]'}`}>{detail}</p>
      </div>
      <p className="text-sm font-bold text-[#57708d]">{title}</p>
      <strong className="mt-1 block text-4xl font-black leading-tight text-[#102033]">{value}</strong>
    </article>
  );
}

function TeacherDashboard({ setView }: { setView: (view: View) => void }) {
  const todayClasses = [
    ['Matematicas Avanzadas', '5to B', 'Unidad 3', '09:00', teacherImages.notebook, 'Proyecto de proporcionalidad y repaso de tareas pendientes.'],
    ['Ciencias Naturales', '5to A', 'Unidad 2', '11:30', teacherImages.brushes, 'Laboratorio guiado y registro de observaciones para biblioteca.'],
  ];
  return (
    <TeacherPage title="Tablero de trabajo docente" subtitle="Resumen operativo para conectar clases, tareas, notas, biblioteca, comites y alertas familiares.">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <TeacherStat title="Alumnos activos" value="158" detail="4 secciones" icon={<Users />} tone="blue" />
        <TeacherStat title="Entregas por revisar" value="24" detail="8 vencen hoy" icon={<ClipboardList />} tone="red" />
        <TeacherStat title="Promedio de cursos" value="86%" detail="3 alertas" icon={<LineChart />} tone="green" />
        <TeacherStat title="Comites activos" value="3" detail="2 tareas nuevas" icon={<Users />} />
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-5">
          <TeacherCard title="Clases de hoy" toolbar={<button className="text-sm font-black text-[#0a3a92]" onClick={() => setView('teacher-planning')} type="button">Abrir planificacion</button>}>
            <div className="space-y-4">
              {todayClasses.map(([title, grade, unit, time, image, desc]) => (
                <button className="group flex w-full flex-col gap-5 rounded-2xl border border-[#d5deea] bg-[#fbfdff] p-4 text-left transition hover:border-[#0a3a92] md:flex-row md:items-center" key={title} onClick={() => setView('teacher-classes')} type="button">
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#eff4ff]"><img alt="Class icon" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" src={image} /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-[#dff8e6] px-3 py-1 text-xs font-black text-[#095827]">{grade}</span><span className="text-xs font-bold text-[#57708d]">{unit}</span></div>
                    <strong className="mt-2 block text-xl font-black leading-7 text-[#102033]">{title}</strong>
                    <p className="mt-1 text-sm leading-5 text-[#57708d]">{desc}</p>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:block md:text-right">
                    <strong className="block text-2xl font-black text-[#0a3a92]">{time}</strong>
                    <small className="font-bold text-[#57708d]">32 alumnos</small>
                  </div>
                </button>
              ))}
            </div>
          </TeacherCard>
          <TeacherCard title="Flujo rapido de backend">
            <div className="grid gap-3 md:grid-cols-4">
              {[
                ['Crear tarea', 'courseId, unitId, dueDate, score', 'teacher-classes', <ClipboardList />],
                ['Publicar recurso', 'resourceId, targetClassIds', 'teacher-resources', <Library />],
                ['Registrar notas', 'studentId, activityId, grade', 'teacher-grades', <LineChart />],
                ['Avisar familia', 'alertId, guardianId, severity', 'teacher-conversations', <MessageSquare />],
              ].map(([title, text, target, icon]) => (
                <button className="rounded-2xl border border-[#d5deea] bg-[#f6f9fd] p-4 text-left transition hover:border-[#0a3a92]" key={title as string} onClick={() => setView(target as View)} type="button">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#dceaff] text-[#0a3a92]">{icon}</span>
                  <strong className="mt-3 block text-sm text-[#102033]">{title}</strong>
                  <small className="mt-1 block text-[#57708d]">{text}</small>
                </button>
              ))}
            </div>
          </TeacherCard>
        </div>
        <aside className="space-y-5">
          <TeacherCard title="Actividades proximas">
            <div className="space-y-4">{[['Oct', '24', 'Entrega de proyecto', 'Matematicas 5B'], ['Oct', '26', 'Reunion de comite', 'Evaluacion docente'], ['Nov', '01', 'Feria cientifica', 'Actividad extracurricular']].map(([month, day, title, meta]) => <div className="flex gap-4 rounded-2xl bg-[#f6f9fd] p-3" key={title}><span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-[#d5deea] bg-white text-center text-[#0a3a92]"><b className="text-xs uppercase">{month}</b><strong className="text-2xl">{day}</strong></span><p><strong className="block text-sm text-[#102033]">{title}</strong><span className="text-sm text-[#57708d]">{meta}</span></p></div>)}</div>
            <button className="mt-4 w-full rounded-xl border border-[#d5deea] bg-white px-5 py-3 text-sm font-black text-[#0a3a92]" onClick={() => setView('teacher-planning')} type="button">Abrir calendario</button>
          </TeacherCard>
          <TeacherCard title="Alarma academica">
            <div className="rounded-2xl border border-[#ffd0ca] bg-[#fff3f1] p-4">
              <strong className="text-[#9a2118]">Ana Lopez · riesgo alto</strong>
              <p className="mt-2 text-sm text-[#57708d]">Promedio 58%, 3 tareas sin entregar. Esta alerta debe sincronizarse con padre y admin.</p>
              <button className="mt-4 rounded-xl bg-[#9a2118] px-4 py-2 text-sm font-black text-white" onClick={() => setView('teacher-conversations')} type="button">Notificar seguimiento</button>
            </div>
          </TeacherCard>
        </aside>
      </div>
    </TeacherPage>
  );
}

function TeacherClasses() {
  return (
    <TeacherPage title="Gestion de clases y actividades" subtitle="Selecciona curso, seccion, unidad y publica tareas que luego vera el alumno y podran monitorear sus padres." actions={<button className="rounded-xl bg-[#0a3a92] px-5 py-3 text-sm font-black text-white" type="button">Publicar actividad</button>}>
      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <TeacherCard title="Ruta academica">
            <div className="grid gap-4 md:grid-cols-4">
              {['Curso', 'Seccion', 'Unidad', 'Tipo'].map((label, index) => (
                <label className="text-sm font-black text-[#435670]" key={label}>{label}
                  <select className="teacher-input mt-2 h-11 w-full rounded-xl border px-3 text-sm">
                    <option>{['Matematicas', '5to B', 'Unidad 3', 'Tarea'][index]}</option>
                    <option>Ciencias</option>
                    <option>Lenguaje</option>
                  </select>
                </label>
              ))}
            </div>
          </TeacherCard>
          <TeacherCard title="Contenido de la actividad">
            <label className="block text-sm font-black text-[#435670]">Titulo<input className="teacher-input mt-2 h-12 w-full rounded-xl border px-4 text-sm" placeholder="Ej: Proyecto de proporcionalidad" /></label>
            <label className="mt-4 block text-sm font-black text-[#435670]">Instrucciones<textarea className="teacher-input mt-2 min-h-36 w-full rounded-xl border p-4 text-sm" placeholder="Describe pasos, criterios de entrega y materiales necesarios." /></label>
          </TeacherCard>
          <TeacherCard title="Recursos adjuntos" toolbar={<button className="inline-flex items-center gap-2 text-sm font-black text-[#0a3a92]" type="button"><Library size={16} />Tomar de biblioteca</button>}>
            <div className="grid min-h-44 place-items-center rounded-2xl border-2 border-dashed border-[#d5deea] bg-[#f6f9fd] text-center">
              <div><Upload className="mx-auto text-[#0a3a92]" size={34} /><p className="mt-3 font-black text-[#102033]">Subir archivo o pegar enlace</p><p className="text-sm text-[#57708d]">PDF, DOCX, imagen, video o ejercicio de plataforma</p></div>
            </div>
            <div className="mt-4 flex max-w-sm items-center justify-between rounded-xl border border-[#d5deea] bg-white px-4 py-3 text-sm"><span className="flex items-center gap-2"><FileText className="text-[#0a3a92]" />Guia_Lectura.pdf</span><Trash2 className="text-[#ba1a1a]" size={18} /></div>
          </TeacherCard>
        </div>
        <aside className="space-y-5">
          <TeacherCard title="Configuracion">
            <label className="block text-sm font-black text-[#435670]">Fecha de entrega<input className="teacher-input mt-2 h-11 w-full rounded-xl border px-3 text-sm" type="date" /></label>
            <label className="mt-4 block text-sm font-black text-[#435670]">Puntaje maximo<input className="teacher-input mt-2 h-11 w-full rounded-xl border px-3 text-sm" defaultValue="100" /></label>
            <div className="mt-5 space-y-3 border-t border-[#eef3f9] pt-4">{['Notificar alumnos', 'Notificar padres si vence', 'Permitir entrega tardia'].map((item, index) => <label className="flex items-center gap-3 text-sm font-bold text-[#435670]" key={item}><input className="h-5 w-5 accent-[#0a3a92]" defaultChecked={index < 2} type="checkbox" />{item}</label>)}</div>
          </TeacherCard>
          <TeacherCard title="Conexiones">
            <div className="space-y-3 text-sm text-[#57708d]">
              <p><strong className="text-[#102033]">Alumno:</strong> aparece en Tareas y Calendario.</p>
              <p><strong className="text-[#102033]">Padres:</strong> reciben aviso si no entrega.</p>
              <p><strong className="text-[#102033]">Admin:</strong> ve actividad y carga docente.</p>
            </div>
          </TeacherCard>
        </aside>
      </div>
    </TeacherPage>
  );
}

function TeacherResources({ setView }: { setView: (view: View) => void }) {
  return (
    <TeacherPage>
      <div className="border-t border-[#c4c5d5] pt-10"><div className="mb-10 flex justify-between"><button className="h-12 w-32 rounded border border-[#c4c5d5] bg-white"><Search size={18} className="mx-auto" /></button><div className="flex gap-4"><button className="grid h-12 w-12 place-items-center rounded bg-[#dce9ff] text-[#00288e]"><Library /></button><button className="grid h-12 w-12 place-items-center rounded text-[#303241]"><ClipboardList /></button></div></div></div>
      <div className="grid gap-7 md:grid-cols-4">
        {[
          ['PDF', 'Sigma Practice.pdf', 'Oct 12, 2023', 'Abrir', 'bg-[#d7def0]', <FileText />],
          ['Web Link', 'Laboratorio virtual', 'Subido a Mis Recursos', 'Iniciar', 'bg-[#e4f8e7]', <Flame />],
          ['Slide Deck', 'Guía de exposición', 'Comités', 'Vista Previa', 'bg-[#f2f3fc]', <BookOpen />],
        ].map(([type, title, date, action, color, icon]) => (
          <article className="min-h-[520px] rounded-lg border border-[#c4c5d5] bg-white" key={title as string}>
            <div className={`relative grid h-40 place-items-center ${color}`}>{icon}<span className="absolute right-4 top-3 rounded bg-white px-3 py-1 text-xl">{type}</span></div>
            <div className="flex h-[360px] flex-col justify-end p-6"><button className="self-end text-3xl">⋮</button><div className="mt-auto border-t border-[#c4c5d5] pt-5"><p className="text-[#303241]">{date}</p><button className="mt-2 text-xl text-[#00288e]" type="button">{action}</button></div></div>
          </article>
        ))}
        <button className="grid min-h-[520px] place-items-center rounded-lg border border-dashed border-[#c4c5d5] bg-[#f1f5ff]" onClick={() => setView('teacher-classes')} type="button"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-[#d3e4fe] text-[#00288e]"><Plus size={32} /></span></button>
      </div>
      <div className="grid gap-7 xl:grid-cols-[1fr_380px]">
        <TeacherCard><div className="space-y-5">{['Rúbrica agregada a Literatura Avanzada', 'Guía_Lectura.pdf subido a Mis Recursos'].map((item, index) => <button className="flex w-full items-center justify-between rounded border border-[#e2e8f0] bg-white p-5 text-left" key={item}><span className="flex items-center gap-5"><span className={`grid h-14 w-14 place-items-center rounded ${index === 0 ? 'bg-[#e4f8e7] text-[#006d30]' : 'bg-[#d3e4fe] text-[#00288e]'}`}>{index === 0 ? <ShieldCheck /> : <Upload />}</span>{item}</span><ArrowRight /></button>)}</div></TeacherCard>
        <section className="relative overflow-hidden rounded-lg bg-[#00288e] p-8 text-white"><Users className="absolute -bottom-8 -right-8 h-36 w-36 text-white/10" /><h3 className="text-3xl">Pro Tip: Comités</h3><p className="mt-5 text-xl leading-8">Colabora con otros maestros uniéndote a un comité de materia. Comparte planes de lecciones y rúbricas de calificación al instante.</p><button className="mt-8 rounded bg-white px-7 py-3 text-xl text-[#00288e]" onClick={() => setView('teacher-committees')} type="button">Buscar Comités</button></section>
      </div>
    </TeacherPage>
  );
}

function TeacherCommittees() {
  return (
    <TeacherPage title="Panel de Comités" subtitle="Gestiona programas extracurriculares y colaboraciones de equipo." actions={<div className="flex gap-3"><button className="rounded border border-[#c4c5d5] bg-white px-7 py-4 text-lg">Filtrar Vista</button><button className="rounded bg-[#00288e] px-7 py-4 text-lg font-bold text-white">Acción Rápida</button></div>}>
      <div className="grid gap-7 xl:grid-cols-[390px_1fr]">
        <div className="space-y-7"><TeacherCard title="Tus Comités" toolbar={<span className="rounded-full bg-[#00288e] px-5 py-2 text-xs text-white">4 ACTIVOS</span>}>{['Consejo de Atletismo', 'Junta de Artes y Teatro', 'Centro de Innovación STEM'].map((name, index) => <button className={`mb-3 flex w-full items-center gap-5 rounded border p-4 text-left ${index === 0 ? 'border-transparent bg-[#e8efff]' : 'border-[#c4c5d5] bg-white'}`} key={name}><span className={`grid h-14 w-14 place-items-center rounded ${index === 0 ? 'bg-[#95f8a7] text-[#006d30]' : 'bg-[#dde1ff] text-[#00288e]'}`}><Users /></span><span><strong className="block text-lg">{name}</strong><small>{[12, 8, 6][index]} Miembros • Sincro semanal</small></span></button>)}</TeacherCard><TeacherCard title="Actividad Reciente"><div className="space-y-6"><p><strong>Ms. Henderson</strong> completó <span className="text-[#00288e]">Reserva de Campo</span></p><p><strong>Mr. Chen</strong> subió <span className="text-[#00288e]">Propuesta_Presupuesto_v2.pdf</span></p></div></TeacherCard></div>
        <div className="space-y-7"><section className="relative overflow-hidden rounded-2xl bg-[#111b45] p-10 text-white"><span className="rounded bg-[#006d30] px-4 py-2 text-sm font-bold">PRÓXIMO EVENTO</span><h2 className="mt-7 text-4xl font-bold">Gala Anual de Primavera 2024</h2><p className="mt-3 text-xl">Organizado por la Junta de Artes y Teatro • 12 de Abril</p><div className="mt-7 h-2 max-w-sm rounded bg-white/20"><span className="block h-full rounded bg-[#95f8a7]" style={{ width: '65%' }} /></div></section><TeacherCard title="Tablero de Planeación" toolbar={<span className="text-3xl">...</span>}><div className="grid gap-4 md:grid-cols-3">{['POR HACER (3)', 'EN PROGRESO (2)', 'HECHO'].map((col, colIndex) => <div key={col}><h4 className="mb-4 font-bold text-[#303241]">{col}</h4>{['Confirmar renta de equipo de sonido', 'Diseño de póster para Feria de Ciencias'].slice(0, colIndex === 2 ? 1 : 2).map((task, index) => <article className="mb-4 rounded border border-[#c4c5d5] bg-white p-4" key={task}><span className="rounded bg-[#dde1ff] px-3 py-1 text-xs font-bold text-[#00288e]">{index ? 'CREATIVO' : 'LOGÍSTICA'}</span><p className="mt-3 text-lg">{task}</p><small>4 comentarios</small></article>)}</div>)}</div></TeacherCard></div>
      </div>
    </TeacherPage>
  );
}

function TeacherPlanning() {
  return <TeacherGrades title="Matemáticas Avanzadas: Sección B" subtitle="Salón 402 • Lun, Mié, Vie 09:00 - 10:30 AM" planning />;
}

function TeacherGrades({ title = 'Notas y Reportes', subtitle = 'Administra notas, revisa alertas estadísticas y genera reportes académicos.', planning = false }: { title?: string; subtitle?: string; planning?: boolean }) {
  return (
    <TeacherPage title={title} subtitle={subtitle} actions={<div className="flex gap-3"><button className="rounded bg-[#d3e4fe] px-7 py-4 text-lg text-[#0b1c30]"><Upload className="mr-2 inline" />Exportar Registros</button><button className="rounded bg-[#00288e] px-7 py-4 text-lg font-bold text-white"><Users className="mr-2 inline" />Inscribir Alumno</button></div>}>
      <div className="grid gap-7 xl:grid-cols-[1fr_380px]">
        <div className="space-y-7"><div className="grid gap-5 md:grid-cols-3"><TeacherStat title="Promedio" value="84.2%" detail="" icon={<LineChart />} tone="green" /><TeacherStat title="Asistencia" value="96.5%" detail="" icon={<ShieldCheck />} /><TeacherStat title="Tareas Pendientes" value="12" detail="" icon={<ClipboardList />} /></div><TeacherCard title={planning ? 'Planificación de 100 puntos' : 'Libro de Calificaciones'}><DataTable headers={['Nombre', 'Test Unidad 1', 'Quiz Cálculo', 'Parcial', 'Lab Álgebra']} rows={[['Elena Rodriguez', '92', '88', '95', '100'], ['Marcus Thorne', '76', '81', '78', '85'], ['Sarah Jenkins', '98', '94', '91', '89'], ['Amara Okafor', '64', '72', '58', '70']]} /></TeacherCard><TeacherCard title="Lista de Estudiantes" toolbar={<button className="text-[#00288e]">Ver los 24 alumnos</button>}><DataTable headers={['Nombre', 'ID', 'Estado', 'Acciones']} rows={[['Elena Rodriguez', '#MTH-2023-001', <Status value="Activo" />, '⋮'], ['Marcus Thorne', '#MTH-2023-002', <Status value="Activo" />, '⋮'], ['Sarah Jenkins', '#MTH-2023-003', <Status value="Ausente" />, '⋮']]} /></TeacherCard></div>
        <TeacherCard title="Tareas" toolbar={<button className="grid h-11 w-11 place-items-center rounded-full bg-[#00288e] text-white"><Plus /></button>}><div className="space-y-5">{['Proyecto Final Cálculo', 'Quiz Semanal de Trigonometría', 'Tarea de Álgebra Vectorial'].map((task, index) => <article className={`rounded-lg border p-5 ${index === 0 ? 'border-[#c4c5d5] bg-[#eff4ff]' : 'border-[#c4c5d5] bg-white'}`} key={task}><span className={`rounded px-3 py-1 text-sm font-bold ${index === 0 ? 'bg-[#95f8a7] text-[#005323]' : 'bg-[#dde1ff] text-[#00288e]'}`}>{['En Progreso', 'Programada', 'En Revisión'][index]}</span><h4 className="mt-4 text-xl">{task}</h4><p className="mt-3 text-[#303241]">Vence: {['24 oct, 2023', '28 oct, 2023', '20 oct'][index]}</p><div className="mt-4 h-1.5 rounded bg-[#d3e4fe]"><span className="block h-full rounded bg-[#006d30]" style={{ width: `${[75, 20, 100][index]}%` }} /></div></article>)}</div><button className="mt-72 w-full rounded border-2 border-dashed border-[#c4c5d5] py-4 text-xl">+ Añadir etapa</button></TeacherCard>
      </div>
    </TeacherPage>
  );
}

function TeacherConversations() {
  const [message, setMessage] = useState('');
  return <TeacherPage title="Conversaciones" subtitle="Comunicación con alumnos, padres de familia y personal administrativo."><div className="grid gap-7 xl:grid-cols-[360px_1fr]"><TeacherCard title="Bandeja">{['Padre de Mateo García', 'Ana López', 'Admin Profesores', 'Comité de Evaluación'].map((contact, index) => <button className={`mb-3 w-full rounded border p-4 text-left ${index === 0 ? 'border-[#00288e] bg-[#eff4ff]' : 'border-[#c4c5d5] bg-white'}`} key={contact}><strong>{contact}</strong><p className="text-[#444653]">{index === 0 ? 'Solicitud de apoyo con tarea pendiente' : 'Conversación activa'}</p></button>)}</TeacherCard><TeacherCard title="Padre de Mateo García"><div className="min-h-96 space-y-4 rounded bg-[#eff4ff] p-6"><p className="max-w-[75%] rounded bg-white p-4"><strong>Padre:</strong> Quisiera saber cómo apoyar la tarea pendiente.</p><p className="ml-auto max-w-[75%] rounded bg-[#dce9ff] p-4"><strong>Profesor:</strong> Compartiré una guía corta de repaso.</p></div><div className="mt-5 flex gap-3"><input className="admin-input h-14 flex-1 rounded border border-[#c4c5d5] px-5 text-lg" onChange={(event) => setMessage(event.target.value)} placeholder="Escribir mensaje..." value={message} /><button className="rounded bg-[#00288e] px-7 text-white" onClick={() => setMessage('')} type="button"><Send /></button></div></TeacherCard></div></TeacherPage>;
}

function TeacherSupport() {
  return (
    <TeacherPage title="Soporte y Ayuda">
      <section className="relative overflow-hidden rounded-lg bg-[#00288e] p-10 text-white"><img className="absolute right-0 top-0 h-full w-1/2 object-cover mix-blend-overlay grayscale" src={teacherImages.support} alt="Support workspace" /><div className="relative max-w-2xl"><h2 className="text-5xl font-bold">¿Cómo podemos ayudarte hoy?</h2><p className="mt-7 text-2xl leading-10">Explora nuestra base de conocimientos, tutoriales y contacta a nuestro equipo técnico.</p><button className="mt-9 rounded bg-white px-8 py-5 text-xl text-[#00288e]" type="button">Abrir un Ticket de Soporte</button></div></section>
      <div className="flex items-center justify-between"><h2 className="text-4xl font-bold text-[#0b1c30]">Categorías Populares</h2><button className="text-xl text-[#00288e]">Ver todas</button></div>
      <div className="grid gap-7 md:grid-cols-4">{[['Cuentas y Acceso', 'Problemas de inicio de sesión, contraseñas y perfiles.'], ['Gestión de Calificaciones', 'Configuración de criterios, escalas y promedios.'], ['Material Didáctico', 'Carga de archivos, biblioteca y recursos externos.'], ['Configuración Técnica', 'Integraciones, notificaciones y preferencias.']].map(([title, text], index) => <TeacherCard key={title}><span className="grid h-14 w-14 place-items-center rounded bg-[#eff4ff] text-[#00288e]">{[<CreditCard />, <Star />, <BookOpen />, <Settings />][index]}</span><h3 className="mt-6 text-2xl font-medium">{title}</h3><p className="mt-3 text-xl leading-8 text-[#303241]">{text}</p></TeacherCard>)}</div>
      <div className="grid gap-7 lg:grid-cols-[1fr_380px]"><TeacherCard title="Ticket rápido"><FormGrid fields={['Asunto', 'Módulo', 'Prioridad', 'Descripción']} button="Enviar solicitud" /></TeacherCard><TeacherCard title="Preguntas Frecuentes">{['¿Cómo recupero mi contraseña?', '¿Puedo importar datos de Excel?', '¿Existe una app móvil?'].map((q) => <button className="mb-4 flex w-full justify-between rounded border border-[#c4c5d5] bg-white p-5 text-left text-xl" key={q}>{q}<span>⌄</span></button>)}<div className="rounded bg-[#d3e4fe] p-6 text-center"><p>¿No encuentras lo que buscas?</p><button className="mt-4 rounded bg-[#00288e] px-6 py-3 text-white">Habla con un Asesor</button></div></TeacherCard></div>
    </TeacherPage>
  );
}

function TeacherSettings({ onLogout }: { onLogout: () => void }) {
  return <TeacherPage title="Configuración" subtitle="Datos personales, preferencias y sesión del profesor."><div className="grid gap-7 xl:grid-cols-[1fr_380px]"><TeacherCard title="Datos personales"><FormGrid fields={['Nombre completo', 'Correo institucional', 'Teléfono', 'Especialidad']} button="Guardar datos" /></TeacherCard><TeacherCard title="Sesión"><p className="text-xl text-[#303241]">Administra tu cuenta docente y cierra la sesión de este dispositivo.</p><button className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded bg-[#00288e] px-5 py-4 text-xl font-bold text-white" onClick={onLogout} type="button"><LogOut size={20} />Cerrar sesión</button></TeacherCard></div></TeacherPage>;
}

function StudentViews({ view, setView, onLogout }: { view: View; setView: (view: View) => void; onLogout: () => void }) {
  if (view === 'student-classes') return <StudentClasses onOpen={() => setView('student-tasks')} />;
  if (view === 'student-tasks') return <StudentTasks />;
  if (view === 'student-grades') return <StudentGrades />;
  if (view === 'student-calendar') return <StudentCalendar />;
  if (view === 'student-library') return <StudentLibrary />;
  if (view === 'student-diary') return <StudentDiary onOpenLibrary={() => setView('student-library')} />;
  if (view === 'student-profile') return <StudentProfile onLogout={onLogout} />;
  return (
    <StudentPage title="Aventura Kids" subtitle="Listo para una nueva aventura, Leo?">
      <section className="relative grid min-h-72 items-center gap-6 overflow-hidden rounded-[2rem] bg-[#0c70ea] p-8 shadow-[0_8px_24px_rgba(0,0,0,0.06)] md:grid-cols-[1fr_260px]">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-20 h-52 w-52 rounded-full bg-white/10" />
        <div className="relative z-10">
          <span className="inline-flex rounded-full bg-[#6ffb85] px-4 py-2 text-sm font-bold text-[#005321]">Martes de aprendizaje</span>
          <h2 className="mt-4 text-4xl font-bold leading-tight text-white md:text-5xl">¡Hola, Explorador!</h2>
          <p className="mt-4 max-w-xl text-xl font-medium leading-8 text-white/90">Tienes misiones nuevas, recursos de tus profes y medallas esperando por ti.</p>
          <button onClick={() => setView('student-tasks')} className="student-pressable mt-6 rounded-full bg-[#fdd029] px-9 py-5 text-2xl font-bold text-[#231b00]" type="button">¡Empezar ahora!</button>
        </div>
        <div className="relative mx-auto">
          <span className="student-float absolute -left-4 -top-4 grid h-12 w-12 place-items-center rounded-full bg-[#76fd94] text-[#002109] shadow-lg"><Sparkles size={22} /></span>
          <img alt="Mascota Guia" className="student-bounce-hover h-64 w-64 object-contain drop-shadow-2xl" src={studentImages.robot} />
          <div className="absolute -bottom-2 -right-2 rounded-3xl border-4 border-white bg-[#fdd029] px-5 py-3 text-center shadow-lg">
            <span className="block text-3xl font-bold text-[#231b00]">128</span>
            <small className="font-bold text-[#574500]">estrellas</small>
          </div>
        </div>
      </section>
      <div className="grid gap-5 md:grid-cols-3">
        <StudentStat icon={<Star />} title="Promedio" value="90%" detail="Excelente" />
        <StudentStat icon={<Flame />} title="Racha" value="5 dias" detail="Activa" />
        <StudentStat icon={<Trophy />} title="Logros" value="2/4" detail="Explorador" />
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <StudentMission title="Desafio Matematico" subject="Fracciones divertidas" icon={<Sparkles />} action={() => setView('student-tasks')} />
        <StudentMission title="Lectura Magica" subject="Cuento de aventuras" icon={<BookOpen />} action={() => setView('student-library')} />
        <StudentMission title="Mi Diario IA" subject="Tus superpoderes hoy" icon={<Trophy />} action={() => setView('student-diary')} />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.4fr_0.8fr]">
        <StudentCard>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="flex items-center gap-3 text-3xl font-bold text-[#0058bd]"><ClipboardList /> Mis Misiones de Hoy</h3>
            <span className="rounded-full bg-[#d8e2ff] px-4 py-2 font-bold text-[#001a41]">2/4 completado</span>
          </div>
          <div className="space-y-4">
            {[
              ['Desafio Matematico', 'Practica las sumas del 1 al 20', 'Completado'],
              ['Lectura Magica', 'Lee el cuento El Dragon Azul', 'Completado'],
              ['Idioma Aventurero', 'Aprende 5 palabras nuevas', 'Pendiente'],
            ].map(([title, text, state], index) => (
              <button className={`student-card-hover flex w-full items-center gap-4 rounded-3xl border-2 p-4 text-left ${state === 'Completado' ? 'border-transparent bg-[#eff4ff]' : 'border-dashed border-[#c1c6d6] bg-white'}`} key={title} onClick={() => setView('student-tasks')} type="button">
                <span className={`grid h-14 w-14 place-items-center rounded-full ${index === 0 ? 'bg-[#00873b] text-white' : index === 1 ? 'bg-[#fdd029] text-[#231b00]' : 'bg-[#d8e2ff] text-[#001a41]'}`}>{[<Sparkles />, <BookOpen />, <GraduationCap />][index]}</span>
                <span className="flex-1">
                  <strong className="block text-xl text-[#151c26]">{title}</strong>
                  <small className="text-base font-medium text-[#414754]">{text}</small>
                </span>
                <span className={`rounded-full px-3 py-1 text-sm font-bold ${state === 'Completado' ? 'bg-[#76fd94] text-[#002109]' : 'bg-[#d8e2ff] text-[#001a41]'}`}>{state}</span>
              </button>
            ))}
          </div>
        </StudentCard>
        <StudentCard>
          <h3 className="mb-4 text-center text-xl font-bold text-[#414754]">Mis Medallas Ganadas</h3>
          <div className="grid grid-cols-3 gap-3">
            {[<Trophy />, <BookOpen />, <Sparkles />, <Star />, <Flame />, <Award />].map((medal, index) => (
              <span className={`student-medal-shimmer grid aspect-square place-items-center rounded-full border-4 border-white text-2xl font-bold shadow-md ${index % 2 === 0 ? 'bg-[#fdd029] text-[#231b00]' : 'bg-[#76fd94] text-[#002109]'}`} key={index}>{medal}</span>
            ))}
          </div>
        </StudentCard>
      </div>
    </StudentPage>
  );
}

const studentImages = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6V5-Iw1D18QCTA-9cZEfiaHulbz_rvgTe7ZntCR2j5kGUcXliNvDtNtMTC1l5KfyQkn4fCPHIuK_w7_xv5HSXaDHegu-5T7dZBkdLqwsYUiEEXCxQ4R-lyLJIl_P8wi9E1Wb1xiiM3m_WUCLKC3cAWn0tBCCtoZeEMhgWXSnjIINEiGX599Vtk8vTq9jLNPkigEqkdq6henQGrUqZ4Gj5yF3Sn5dMi8UJ-1jPIue285VuJbbeWXh34z3bsCX-zZdTuCfULQmYsMP',
  robot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyAm_NiIVUCJt-amlxMonBG_hHsKNfG88rvArg77P37tiI36FgrNoteBDJYcJ_WqY3Le4GCNN_UHfPKgBAZPHzRHBdJ6M_4Wr1IEcVWklPda2S1HSVQX3lQkuZpqgfgfNS073c4GMlkrkoyYmkPELsteBIAflTe-ThRxPJEwmaZXnpRKba0mV72DswglYjqCpF1mGxumR7ftZCYVzcn6rFgWgUprjBLJ4ot8_b3fteFJm7BZi-9tYxkUCOXOwe811_4ej-gw5z5RHW',
  math: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlI9Zus2u7-xt0a-ulLZAhQ4k-5fZfjwZECxayM-mv6o5r5wXJPX7VIo13POgvOsYL3xUY6J5nZZyAqCUJcvq-7kuJVTKCukraoYj2P9PYtGcM7hggoyqG3JPglGBykU2p6tNT14iqhhf_ei1LoiN47gc2TFimOA9-6mezfz0RSf5hG3vHFpE4mlCdGIMb5HGbovNp6bhj_8-Gj00fWcJpfAvh_sVa9AKHClRaYitS1QBzfZjNacW6BzP3jvmPp8SbX6iM_FLTaXX3',
  science: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEPbNpmm30orgcGxE9GI5NKCA28WbP78Oz-xhHHyMbqHhQMV11niVfCXHRlYIaDcOfWl4PdAtKfDdM7hjllfHCJlT351RKCXRLl4h6-DmnC-nOFs_30cBVPNQ5P-PMnpI86yUXlL1-Ikcu-1P_criL9_pAN1mC4-YLDQE1KgXjH7s7gqkTCkvKAhgdB6wxQBiOwF4P7EQAww0R1Zc4fBpLSzE2iL9Lau_kciaK7tg-4-yQbewO1IecQF9YqUqzakrJNgCdulmxQIV3',
  language: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJr9hOq-Pw7sL_A4s2PzIpoO-ME-ihKD2viynqIFDEsgH_sv0Lb-4VoRnjHF1CnhXDYGgglHBSrjQuWO-PW1D1_vOOl67--uXTtAqtgr_N7if-JXoL6PUGmfxg9uL4blZWaU9oTJQUpha0lXOvYgWTQdyXW7guL59Tn09uBhbD8AXG4urAa80lXUM8oE5cwxmijJ8fA-vYqYqtpfjPGOinBixo9_v7Y_D5UmdkTG9zG90UqS4oz1II2W78xMLBZQVW4tpZMyX0-L_z',
  teacher: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOjJVXbEHMshCCvHxywUGhDqmTi6Gj8kgJRrVK9u4sT8lWQxuCs2cOF0NzOT8e7ZZ8SclUssDHm_ee7bhX4VUh95DW7v9w0LFEK3ufhU7AGJHGi31kyHe-s1c_m2KocePIV0drTAIB_DSrUp3LVn0HoHbHKpfMEfvziEIwDsxgU2CB-xJBg4BRu1YRYcqQdTMf_HOHXovnMm0PVf_B1OVa5EljVWWmzJquoZiUWP50GPPybYiSa0XFb9zDdY_BGRNdPZpowsl-1o8a',
  dog: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS1k8QQ3nI9evmL_9bhsBk3Pj-71ViWBX5nv0bSZDwxoMfjVEkmJugH9XCxp5QuADwRQ4U0_wlYVYAo5Yl38pTuTwCF0NDpbYGKLv2L_OnlnEi8uyBTNHppBAxffYe1NmmPAIhj4z8nh-nQIrSWaT-oRIG2nGK28g6GuoXcMo_zGWQPorFwo-f1BcnJ4x4JkuqJi6rOQFgxmbsORYfYDjOf1dVNx45OICuMm7Dj9BR181PC9jTNpbXrdsNJx8fmqGtIz7o1sD3bCL8',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS_lD_fciRt06MfFxeIVmdjMXs9QfSRPGK26QB5bT92gMD6rVAT4kwOJCHRgq_1FeklduxutSfm1lNMI4L1FOZUICsbmTpzJuZ448R4qp164xDcPFrCYRx1PbZ11ZNQ02dHdM8_lWZ8J61tDaY0TpiuqZa1hTbjiX0Jm4MZNndUtpp7fe7dptphKIkQcN_tOAVYDxhMcFTXFDX3DRxfR6K0G9os0sKSz1CDbuzVBK2A-nHrf2aUtWg1zvqmu8rRKtxPIxIP8DH4oQS',
};

function StudentClasses({ onOpen }: { onOpen: () => void }) {
  const courses = [
    { title: 'Matematicas', progress: 78, color: '#0058bd', image: studentImages.math, icon: <Sparkles /> },
    { title: 'Ciencias', progress: 84, color: '#00873b', image: studentImages.science, icon: <Flame /> },
    { title: 'Lenguaje', progress: 62, color: '#735c00', image: studentImages.language, icon: <BookOpen /> },
    { title: 'Arte y Dibujo', progress: 45, color: '#ba1a1a', image: studentImages.robot, icon: <Award /> },
  ];

  return (
    <StudentPage title="Mis Cursos" subtitle="¡Hola Leo! Estos son todos los cursos que llevas. ¿Por dónde quieres empezar?">
      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course, index) => (
          <article className={`student-card-hover overflow-hidden rounded-[2rem] border border-[#e2e8f7] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)] ${index === 0 ? 'lg:col-span-2 lg:grid lg:grid-cols-[1.1fr_0.9fr]' : ''}`} key={course.title}>
            <div className="p-7">
              <span className="mb-5 inline-grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ backgroundColor: course.color }}>{course.icon}</span>
              <h3 className="text-3xl font-bold" style={{ color: course.color }}>{course.title}</h3>
              <p className="mt-2 text-lg font-medium text-[#414754]">Aventura de aprendizaje con retos, recursos y progreso guiado.</p>
              <div className="mt-6 h-4 rounded-full bg-[#e2e8f7]">
                <span className="block h-full rounded-full bg-[#0c70ea]" style={{ width: `${course.progress}%` }} />
              </div>
              <div className="mt-3 flex items-center justify-between text-sm font-bold text-[#414754]">
                <span>Progreso</span>
                <span>{course.progress}%</span>
              </div>
              <button className="student-pressable mt-6 rounded-xl bg-[#0058bd] px-6 py-4 font-bold text-white" onClick={onOpen} type="button">Continuar Aventura</button>
            </div>
            <img alt={course.title} className={`${index === 0 ? 'h-80 lg:h-full' : 'h-56'} w-full object-cover`} src={course.image} />
          </article>
        ))}
      </div>
    </StudentPage>
  );
}

function StudentTasks() {
  const taskOptions = [
    {
      title: 'Las Fracciones Divertidas',
      course: 'Matematicas',
      short: 'Dibuja y representa fracciones con una pizza.',
      kind: 'Entrega de archivo',
      due: 'Viernes 18',
      instructions: 'Dibuja una pizza, dividela en 4 partes iguales, colorea 2 partes y sube una foto o PDF.',
      mode: 'upload',
      color: '#0058bd',
      soft: '#d8e2ff',
    },
    {
      title: 'Comprension: El Dragon Azul',
      course: 'Lenguaje',
      short: 'Responde una pregunta corta del cuento.',
      kind: 'Ejercicio en linea',
      due: 'Jueves 17',
      instructions: 'Lee el cuento y responde: ¿Que aprendio el dragon al final de la historia?',
      mode: 'exercise',
      color: '#735c00',
      soft: '#ffe085',
    },
    {
      title: 'Mini laboratorio de semillas',
      course: 'Ciencias',
      short: 'Sube evidencia de tu experimento.',
      kind: 'Entrega de evidencia',
      due: 'Lunes 21',
      instructions: 'Toma una foto de tu experimento y escribe que cambio observaste en la semilla.',
      mode: 'upload',
      color: '#006b2d',
      soft: '#76fd94',
    },
  ];
  const [openTask, setOpenTask] = useState('');

  return (
    <StudentPage title="Centro de Tareas" subtitle="Espacio para revisar instrucciones y subir tus entregas.">
      <div className="grid gap-5">
        {taskOptions.map((task, index) => {
          const isOpen = openTask === task.title;
          return (
          <article
            className="student-card-hover overflow-hidden rounded-[2rem] border-2 bg-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]"
            key={task.title}
            style={{ borderColor: isOpen ? task.color : '#e2e8f7' }}
          >
            <button className="grid w-full gap-4 p-6 text-left md:grid-cols-[72px_1fr_auto]" onClick={() => setOpenTask(isOpen ? '' : task.title)} type="button">
              <span className="grid h-16 w-16 place-items-center rounded-2xl text-white" style={{ backgroundColor: task.color }}>{[<Sparkles />, <BookOpen />, <Flame />][index]}</span>
              <span>
                <span className="inline-flex rounded-full px-3 py-1 text-xs font-bold" style={{ backgroundColor: task.soft, color: '#151c26' }}>{task.course}</span>
                <strong className="mt-3 block text-2xl text-[#151c26]">{task.title}</strong>
                <small className="mt-1 block text-base font-medium text-[#414754]">{task.short}</small>
              </span>
              <span className="self-center rounded-full bg-[#eff4ff] px-4 py-2 text-sm font-bold text-[#0058bd]">{isOpen ? 'Ocultar' : 'Ver tarea'}</span>
            </button>
            {isOpen && (
              <div className="border-t border-[#e2e8f7] bg-[#f8f9ff] p-6">
                <div className="grid gap-4 md:grid-cols-3">
                  <StudentChip label="Tipo" value={task.kind} />
                  <StudentChip label="Entrega" value={task.due} />
                  <StudentChip label="Recompensa" value="+20 estrellas" />
                </div>
                <p className="mt-5 text-lg font-medium text-[#414754]">{task.instructions}</p>
                {task.mode === 'upload' ? (
                  <div className="mt-5 rounded-xl border-4 border-dashed border-[#adc6ff] bg-white p-8 text-center transition hover:bg-[#eff4ff]">
                    <span className="student-pressable mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#0c70ea] text-white"><Upload size={38} /></span>
                    <p className="mt-4 text-xl font-bold text-[#0058bd]">Subir archivo de esta tarea</p>
                    <input className="mt-5 w-full max-w-sm rounded-xl border-2 border-[#c1c6d6] bg-white px-4 py-3 text-[#151c26]" type="file" />
                  </div>
                ) : (
                  <div className="mt-5 rounded-xl border-2 border-[#adc6ff] bg-white p-6">
                    <textarea className="min-h-40 w-full rounded-xl border-2 border-[#c1c6d6] bg-white p-4 text-[#151c26] outline-none focus:border-[#0058bd]" placeholder="Escribe tu respuesta aqui..." />
                    <button className="student-pressable mt-5 rounded-xl bg-[#0058bd] px-6 py-4 font-bold text-white" type="button">Enviar ejercicio</button>
                  </div>
                )}
              </div>
            )}
          </article>
        )})}
      </div>
    </StudentPage>
  );
}

function StudentGrades() {
  return (
    <StudentPage title="Mis Notas y Progreso" subtitle="Consulta notas de unidad, materia y tareas calificadas.">
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <StudentCard>
          <div className="grid place-items-center rounded-[2rem] bg-[#0058bd] p-8 text-center text-white">
            <Star className="text-[#fdd029]" size={50} />
            <strong className="mt-4 text-6xl font-bold">90%</strong>
            <span className="mt-2 font-bold">Promedio general</span>
          </div>
          <div className="mt-5 flex items-center gap-3 rounded-3xl bg-[#eff4ff] p-4">
            <img alt="Teacher Avatar" className="h-16 w-16 rounded-2xl object-cover" src={studentImages.teacher} />
            <p className="font-medium text-[#414754]">Tu maestra dice: sigue practicando lectura guiada y fracciones.</p>
          </div>
        </StudentCard>
        <StudentCard>
          <div className="space-y-4">
            {grades.map((grade) => (
              <div className="rounded-3xl border border-[#e2e8f7] bg-[#f8f9ff] p-4" key={grade.course}>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#151c26]">{grade.course}</h3>
                    <p className="font-medium text-[#414754]">{grade.note}</p>
                  </div>
                  <span className="rounded-2xl bg-[#fdd029] px-4 py-2 text-2xl font-bold text-[#231b00]">{grade.score}</span>
                </div>
                <div className="mt-4 h-4 rounded-full bg-[#dce3f1]"><span className="block h-full rounded-full bg-[#00873b]" style={{ width: `${grade.score}%` }} /></div>
              </div>
            ))}
          </div>
        </StudentCard>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {[
          ['Unidad 1: Los Planetas', '100%', '#00873b'],
          ['Unidad 2: Animales de la Selva', '92%', '#0c70ea'],
          ['Unidad 3: Sumas Divertidas', '45%', '#fdd029'],
        ].map(([unit, value, color]) => (
          <StudentCard key={unit}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-[#151c26]">{unit}</h3>
              <span className="font-bold text-[#0058bd]">{value}</span>
            </div>
            <div className="mt-4 h-6 overflow-hidden rounded-full bg-[#e2e8f7]">
              <span className="block h-full rounded-full transition-all duration-1000" style={{ width: value, backgroundColor: color }} />
            </div>
          </StudentCard>
        ))}
      </div>
      <StudentCard>
        <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h3 className="text-2xl font-bold text-[#151c26]">Notas de tareas por curso</h3>
            <p className="text-lg font-medium text-[#414754]">Detalle de entregas calificadas, pendientes y observaciones del docente.</p>
          </div>
          <select className="rounded-xl border-2 border-[#c1c6d6] bg-white px-4 py-3 font-bold text-[#151c26]">
            <option>Matematicas</option>
            <option>Lenguaje</option>
            <option>Ciencias</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ['Tabla del 7', '10/10', 'Excelente rapidez'],
            ['Fracciones Divertidas', 'Pendiente', 'Esperando entrega'],
            ['Problemas con dibujos', '8/10', 'Revisar procedimiento'],
          ].map(([task, score, note]) => (
            <div className="rounded-3xl border border-[#e2e8f7] bg-[#f8f9ff] p-5" key={task}>
              <h4 className="text-lg font-bold text-[#151c26]">{task}</h4>
              <span className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-bold ${score === 'Pendiente' ? 'bg-[#ffe085] text-[#231b00]' : 'bg-[#76fd94] text-[#002109]'}`}>{score}</span>
              <p className="mt-3 font-medium text-[#414754]">{note}</p>
            </div>
          ))}
        </div>
      </StudentCard>
    </StudentPage>
  );
}

function StudentCalendar() {
  const events = ['Examen de Matematicas', 'Entrega de lectura', 'Taller de Arte'];
  return (
    <StudentPage title="Calendario de Aventuras" subtitle="Organiza tus retos, examenes y actividades especiales.">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <StudentCard>
          <div className="mb-5 flex items-center justify-between">
            <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eff4ff] font-bold text-[#0058bd]" type="button">{'<'}</button>
            <h3 className="text-2xl font-bold text-[#151c26]">Octubre 2026</h3>
            <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eff4ff] font-bold text-[#0058bd]" type="button">{'>'}</button>
          </div>
          <CalendarBoard />
        </StudentCard>
        <aside className="space-y-4">
          {events.map((event, index) => (
            <StudentCard key={event}>
              <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-[#d8e2ff] text-[#0058bd]">{[<ClipboardList />, <BookOpen />, <Award />][index]}</span>
              <h3 className="mt-4 text-xl font-bold text-[#151c26]">{event}</h3>
              <p className="mt-1 font-medium text-[#414754]">{['12 Oct', '18 Oct', '24 Oct'][index]} · Aventura programada</p>
            </StudentCard>
          ))}
        </aside>
      </div>
    </StudentPage>
  );
}

function StudentLibrary() {
  return (
    <StudentPage title="Mi Biblioteca de Recursos" subtitle="Recursos que tus profesores prepararon para tus cursos.">
      <div className="rounded-[2rem] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
        <label className="relative block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#414754]" />
          <input className="h-14 w-full rounded-xl border-2 border-[#e2e8f7] bg-[#f8f9ff] pl-12 pr-4 text-lg font-medium text-[#151c26] outline-none focus:border-[#0058bd]" placeholder="¿Que recurso buscas hoy?" />
        </label>
        <div className="mt-4 flex gap-2 overflow-x-auto">
          {["Todos", "PDFs", "Videos", "Enlaces"].map((filter, index) => (
            <button className={`h-12 whitespace-nowrap rounded-full px-6 font-bold ${index === 0 ? "bg-[#0058bd] text-white" : "bg-[#e2e8f7] text-[#414754] hover:bg-[#d8e2ff]"}`} key={filter} type="button">{filter}</button>
          ))}
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {resources.map((resource, index) => (
          <StudentCard key={resource.title}>
            <span className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#fdd029] text-[#231b00]">{[<BookOpen />, <FileText />, <Upload />][index % 3]}</span>
            <h3 className="mt-5 text-xl font-bold text-[#151c26]">{resource.title}</h3>
            <p className="mt-2 font-medium text-[#414754]">{resource.type} · {resource.minutes} min</p>
            <button className="mt-5 w-full rounded-3xl bg-[#0058bd] px-5 py-3 font-bold text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.2)]" type="button">Abrir recurso</button>
          </StudentCard>
        ))}
        <div className="rounded-[2rem] bg-[#0c70ea] p-7 text-center text-white shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
          <img alt="Teacher Avatar" className="mx-auto mb-4 h-20 w-20 rounded-full border-4 border-[#d8e2ff] object-cover" src={studentImages.teacher} />
          <p className="text-lg font-bold italic">"¡Recuerda revisar el material antes del examen del viernes!"</p>
          <p className="mt-2 text-sm font-bold text-white/80">- Profe Ana</p>
        </div>
      </div>
    </StudentPage>
  );
}

function StudentDiary({ onOpenLibrary }: { onOpenLibrary: () => void }) {
  return (
    <StudentPage title="Tus Superpoderes Hoy" subtitle="Recomendaciones IA, medallas y diario de aventura.">
      <section className="grid gap-6 rounded-[2rem] bg-[#d8e2ff] p-7 shadow-[0_8px_24px_rgba(0,0,0,0.06)] lg:grid-cols-[1fr_300px]">
        <div>
          <span className="student-float inline-grid h-14 w-14 place-items-center rounded-2xl bg-[#0058bd] text-white"><Sparkles /></span>
          <h2 className="mt-4 text-3xl font-bold text-[#151c26]">Refuerza Matematicas con una aventura corta</h2>
          <p className="mt-3 text-lg font-medium leading-8 text-[#414754]">La IA detecto que hoy puedes mejorar fracciones con un recurso visual de 12 minutos.</p>
          <button className="student-pressable mt-6 rounded-xl bg-[#0058bd] px-6 py-4 font-bold text-white" onClick={onOpenLibrary} type="button">Ver recurso recomendado</button>
        </div>
        <img alt="Mascota motivadora" className="student-float h-72 w-full object-contain" src={studentImages.dog} />
      </section>
      <div className="grid gap-5 md:grid-cols-3">
        {['Explorador Constante', 'Matematico Estrella', 'Lector Curioso'].map((medal, index) => (
          <StudentCard key={medal}>
            <span className={`student-medal-shimmer mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-white shadow-lg ${index === 0 ? 'bg-[#fdd029] text-[#231b00]' : index === 1 ? 'bg-[#76fd94] text-[#002109]' : 'bg-[#d8e2ff] text-[#001a41]'}`}>
              <Trophy size={44} />
            </span>
            <h3 className="mt-4 text-center text-xl font-bold text-[#151c26]">{medal}</h3>
          </StudentCard>
        ))}
      </div>
    </StudentPage>
  );
}

function StudentProfile({ onLogout }: { onLogout: () => void }) {
  const interests = ['Espacio', 'Dibujo', 'Ciencia', 'Musica', 'Historia', 'Lectura', 'Deportes', 'Tecnologia', 'Animales'];
  const [selectedInterests, setSelectedInterests] = useState(['Dibujo', 'Ciencia']);
  const toggleInterest = (interest: string) => {
    setSelectedInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  return (
    <StudentPage title="Mi Perfil de Explorador" subtitle="Elige tu companero de aventuras y personaliza tus intereses.">
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <StudentCard>
          <div className="mx-auto aspect-square max-w-64 overflow-hidden rounded-full border-8 border-[#fdd029] bg-[#eff4ff]">
            <img alt="Main Avatar" className="h-full w-full object-cover" src={studentImages.profile} />
          </div>
          <h3 className="mt-5 text-center text-2xl font-bold text-[#151c26]">Leo el Valiente</h3>
          <p className="text-center font-medium text-[#414754]">Nivel 5 · 1,240 estrellas</p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            {[studentImages.avatar, studentImages.dog, studentImages.robot].map((image, index) => (
              <button className={`rounded-2xl border-2 p-2 transition active:scale-95 ${index === 0 ? 'border-[#0058bd] bg-[#d8e2ff]' : 'border-transparent bg-[#eff4ff] hover:border-[#0058bd]'}`} key={image} type="button">
                <img alt="Avatar opcional" className="aspect-square w-full rounded-full object-cover" src={image} />
              </button>
            ))}
          </div>
          <button className="student-pressable mt-6 w-full rounded-xl bg-[#fdd029] px-5 py-4 font-bold text-[#231b00]" type="button">Guardar cambios</button>
        </StudentCard>
        <StudentCard>
          <h3 className="text-2xl font-bold text-[#151c26]">Mis Gustos e Intereses</h3>
          <p className="mt-2 text-lg font-medium text-[#414754]">Selecciona lo que mas te emociona aprender. Estos datos ayudan al sistema a recomendar recursos y actividades.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            {interests.map((interest, index) => (
              <button
                className={`student-card-hover rounded-full border-2 px-5 py-3 font-bold ${
                  selectedInterests.includes(interest)
                    ? 'border-[#0058bd] bg-[#0c70ea] text-white shadow-md'
                    : index % 2 === 0
                      ? 'border-transparent bg-[#d8e2ff] text-[#001a41]'
                      : 'border-transparent bg-[#76fd94] text-[#002109]'
                }`}
                key={interest}
                onClick={() => toggleInterest(interest)}
                type="button"
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-[2rem] border border-[#e2e8f7] bg-[#eff4ff] p-5">
            <h4 className="text-lg font-bold text-[#151c26]">Intereses guardados para recomendaciones</h4>
            <p className="mt-2 font-medium text-[#414754]">{selectedInterests.join(', ') || 'Selecciona al menos un interes.'}</p>
          </div>
          <div className="mt-8 rounded-[2rem] bg-[#f8f9ff] p-5">
            <h4 className="text-xl font-bold text-[#151c26]">Mensaje motivador</h4>
            <p className="mt-2 text-lg font-medium text-[#414754]">Leo, tu constancia esta desbloqueando nuevas aventuras. Sigue explorando.</p>
          </div>
          <div className="mt-6 rounded-[2rem] border border-[#e2e8f7] bg-white p-5">
            <h4 className="text-xl font-bold text-[#151c26]">Opciones del perfil</h4>
            <button className="student-pressable mt-4 inline-flex items-center gap-2 rounded-xl bg-[#fdd029] px-6 py-4 font-bold text-[#231b00]" onClick={onLogout} type="button">
              <LogOut size={18} />
              Cerrar sesion
            </button>
          </div>
        </StudentCard>
      </div>
    </StudentPage>
  );
}

function FamilyViews({ view, setView, selectedChild, onChildChange, onLogout }: { view: View; setView: (view: View) => void; selectedChild: FamilyChild; onChildChange: (child: FamilyChild) => void; onLogout: () => void }) {
  const [familyMessage, setFamilyMessage] = useState('');
  const [paymentType, setPaymentType] = useState('Colegiatura mensual');

  if (view === 'family-progress') return <FamilyProgress child={selectedChild} childrenList={familyChildren} onChildChange={onChildChange} />;
  if (view === 'family-calendar') return <FamilyCalendar child={selectedChild} childrenList={familyChildren} onChildChange={onChildChange} />;
  if (view === 'family-payments') return <FamilyPayments child={selectedChild} childrenList={familyChildren} onChildChange={onChildChange} paymentType={paymentType} onPaymentType={setPaymentType} />;
  if (view === 'family-messages') return <FamilyReports child={selectedChild} childrenList={familyChildren} message={familyMessage} onChildChange={onChildChange} onMessage={setFamilyMessage} />;
  if (view === 'family-settings') return <FamilySettings child={selectedChild} childrenList={familyChildren} onChildChange={onChildChange} onLogout={onLogout} />;
  return <FamilyDashboard child={selectedChild} childrenList={familyChildren} onChildChange={onChildChange} setView={setView} />;
}

function FamilyPage({ title, subtitle, children }: { title: string; subtitle: string; child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 pb-24 text-[#021f29] lg:pb-0" style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}>
      <header>
        <div>
          <h2 className="text-4xl font-black tracking-normal text-[#003b43] md:text-5xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h2>
          <p className="mt-2 max-w-3xl text-lg leading-7 text-[#40484a]">{subtitle}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

function FamilyCard({ title, children, toolbar }: { title: string; children: ReactNode; toolbar?: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#003b43]/10 bg-white/90 p-5 shadow-[0_12px_30px_rgba(0,59,67,0.06)]">
      <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h3 className="text-xl font-black text-[#003b43]">{title}</h3>
        {toolbar}
      </div>
      {children}
    </section>
  );
}

function FamilyDashboard({ child, childrenList, onChildChange, setView }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void; setView: (view: View) => void }) {
  return (
    <FamilyPage title={`Resumen de ${child.name.split(' ')[0]}`} subtitle={`Actividades de la semana, colegiatura, avances y tareas importantes de ${child.name}.`} child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.66fr]">
        <FamilyCard title="Progreso Academico" toolbar={<span className="rounded-full bg-[#79f3ea]/70 px-3 py-1 text-sm font-bold text-[#006f69]">Completado: 75%</span>}>
          <p className="text-lg text-[#40484a]">Promedio General: {(child.average / 10).toFixed(1)}</p>
          <div className="mt-10 flex h-40 items-end gap-4">
            {[
              ['MAT', 92],
              ['ESP', 88],
              ['CIE', 95],
              ['ING', 84],
              ['HIS', 90],
            ].map(([label, value]) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={label}>
                <div className="relative h-full w-full rounded-t-lg bg-[#003b43]/10">
                  <span className="absolute bottom-0 block w-full rounded-t-lg bg-[#006a65] transition-all" style={{ height: `${value}%` }} />
                </div>
                <span className="text-xs font-bold text-[#40484a]">{label}</span>
              </div>
            ))}
          </div>
        </FamilyCard>
        <section className="rounded-xl bg-[#00484f] p-6 text-white shadow-[0_18px_40px_rgba(0,59,67,0.22)]">
          <div className="flex items-center gap-3">
            <CreditCard />
            <span className="text-sm font-bold uppercase tracking-[0.16em] text-[#b6ecf6]">Estado de cuenta</span>
          </div>
          <strong className="mt-5 block text-5xl font-black text-white">{child.balance === 'Solvente' ? 'Q0.00' : child.balance}</strong>
          <p className="mt-2 text-lg text-[#dff4ff]">{child.balance === 'Solvente' ? 'Sin pagos pendientes' : 'Pendiente: Colegiatura Octubre'}</p>
          <p className="mt-24 font-bold text-[#79f3ea]">Vence en 3 dias</p>
          <button className="mt-6 w-full rounded-lg bg-[#008277] py-4 font-black text-[#00201e]" onClick={() => setView('family-payments')} type="button">Pagar Ahora</button>
        </section>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
        <FamilyCard title="Tareas Proximas" toolbar={<ArrowRight className="text-[#40484a]" />}>
          <div className="space-y-3">
            {[
              ['Cuestionario Algebra', 'Matematicas · Manana', 'Urgente'],
              ['Proyecto Celula', 'Biologia · 15 Oct', 'En progreso'],
              ['Ensayo English Lit', 'Ingles · 20 Oct', 'Listo'],
            ].map(([day, event, type]) => (
              <button className="flex w-full items-center justify-between gap-4 rounded-lg border border-[#003b43]/5 bg-[#f3faff] p-4 text-left transition hover:bg-[#e6f6ff]" key={day} onClick={() => setView('family-progress')} type="button">
                <span><strong className="block text-[#003b43]">{day}</strong><small className="text-[#40484a]">{event}</small></span>
                <span className={`rounded px-3 py-1 text-xs font-bold ${type === 'Urgente' ? 'bg-[#ffdad6] text-[#93000a]' : type === 'En progreso' ? 'bg-[#cbe7f5] text-[#003b43]' : 'bg-[#79f3ea]/50 text-[#006f69]'}`}>{type}</span>
              </button>
            ))}
          </div>
        </FamilyCard>
        <FamilyCard title="Notificaciones">
          <div className="space-y-3">
            <div className="rounded-xl bg-[#f3faff] p-4"><strong className="text-[#003b43]">Avance positivo</strong><p className="text-sm text-[#40484a]">Mejoro participacion en Matematicas.</p></div>
            <div className="rounded-xl bg-[#fff1c7] p-4"><strong className="text-[#6f4d00]">Tarea pendiente</strong><p className="text-sm text-[#40484a]">Falta subir evidencia de lectura.</p></div>
            <button className="w-full rounded-xl bg-[#003b43] px-4 py-3 font-bold text-white" onClick={() => setView('family-progress')} type="button">Ver seguimiento completo</button>
          </div>
        </FamilyCard>
      </div>
    </FamilyPage>
  );
}

function FamilyProgress({ child, childrenList, onChildChange }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void }) {
  const courses = [
    ['Matematicas', 92, 'Excelente razonamiento numerico'],
    ['Lenguaje', 86, 'Reforzar entrega de lecturas'],
    ['Ciencias', 94, 'Muy buen desempeno experimental'],
    ['Sociales', 84, 'Participacion constante'],
  ] as const;
  return (
    <FamilyPage title="Seguimiento academico" subtitle={`Desempeno amplio de ${child.name} por curso, unidad y recomendacion de acompanamiento.`} child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <FamilyCard title="Resumen academico">
          <div className="grid place-items-center rounded-xl bg-[#003b43] p-8 text-center text-white">
            <Star className="text-[#79f3ea]" size={46} />
            <strong className="mt-4 text-6xl text-white">{child.average}%</strong>
            <span className="mt-2 font-bold text-[#dff4ff]">Promedio general</span>
          </div>
          <p className="mt-4 rounded-xl bg-[#e6f6ff] p-4 text-sm text-[#40484a]">Recomendacion: mantener una rutina corta de repaso y revisar entregas cada jueves.</p>
        </FamilyCard>
        <FamilyCard title="Cursos de la unidad">
          <div className="space-y-4">
            {courses.map(([course, score, note]) => (
              <div className="rounded-xl border border-[#c0c8ca] bg-[#f3faff] p-4" key={course}>
                <div className="flex items-center justify-between gap-4">
                  <div><h4 className="font-black text-[#003b43]">{course}</h4><p className="text-sm text-[#40484a]">{note}</p></div>
                  <span className="rounded-full bg-[#79f3ea] px-4 py-2 font-black text-[#00201e]">{score}%</span>
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white"><span className="block h-full rounded-full bg-[#006a65]" style={{ width: `${score}%` }} /></div>
              </div>
            ))}
          </div>
        </FamilyCard>
      </div>
    </FamilyPage>
  );
}

function FamilyCalendar({ child, childrenList, onChildChange }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void }) {
  const events = ['Feria STEM', 'Reunion de padres', 'Entrega de boletines', 'Festival deportivo'];
  return (
    <FamilyPage title="Calendario escolar" subtitle={`Actividades anuales, eventos de curso y extracurriculares donde puede participar ${child.name}.`} child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <FamilyCard title="Octubre 2026">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }, (_, index) => index + 1).map((day) => {
              const active = [4, 12, 18, 26].includes(day);
              return <div className={`min-h-20 rounded-lg border p-2 text-sm font-bold ${active ? 'border-[#006a65] bg-[#79f3ea] text-[#00201e]' : 'border-[#c0c8ca] bg-[#f3faff] text-[#40484a]'}`} key={day}>{day}{active && <span className="mt-2 block text-[10px]">Actividad</span>}</div>;
            })}
          </div>
        </FamilyCard>
        <FamilyCard title="Proximos eventos">
          <div className="space-y-3">
            {events.map((event, index) => <div className="rounded-xl bg-[#e6f6ff] p-4" key={event}><strong className="text-[#003b43]">{event}</strong><p className="text-sm text-[#40484a]">{[4, 12, 18, 26][index]} de octubre · {index % 2 ? 'Institucional' : 'Curso'}</p></div>)}
          </div>
        </FamilyCard>
      </div>
    </FamilyPage>
  );
}

function FamilyPayments({ child, childrenList, onChildChange, paymentType, onPaymentType }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void; paymentType: string; onPaymentType: (value: string) => void }) {
  const generateSlip = () => {
    const content = `Boleta de pago\nAlumno: ${child.name}\nConcepto: ${paymentType}\nMonto sugerido: Q 950.00\nBanco: Banco Escolar / Transferencia`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `boleta_${child.id}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };
  return (
    <FamilyPage title="Centro de pagos" subtitle="Pago de colegiatura, otros conceptos institucionales, boleta y transferencia bancaria." child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <FamilyCard title="Concepto de pago">
          <div className="grid gap-4 md:grid-cols-2">
            <label><span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Tipo de pago</span><select className="mt-2 w-full rounded-lg border border-[#c0c8ca] bg-white px-4 py-3 text-[#003b43]" onChange={(event) => onPaymentType(event.target.value)} value={paymentType}>{['Colegiatura mensual', 'Inscripcion', 'Libros', 'Uniforme', 'Actividad extracurricular'].map((item) => <option key={item}>{item}</option>)}</select></label>
            <label><span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Monto</span><input className="admin-input mt-2 w-full rounded-lg border border-[#c0c8ca] px-4 py-3" defaultValue="Q 950.00" /></label>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <button className="rounded-xl bg-[#006a65] px-5 py-3 font-black text-white" type="button">Pagar con tarjeta</button>
            <button className="rounded-xl border border-[#006a65] bg-white px-5 py-3 font-black text-[#006a65]" onClick={generateSlip} type="button">Generar boleta</button>
          </div>
        </FamilyCard>
        <FamilyCard title="Transferencia a bancos">
          <div className="space-y-3 text-sm text-[#40484a]">
            <p><strong className="text-[#003b43]">Banco Escolar:</strong> 001-245879-3</p>
            <p><strong className="text-[#003b43]">Banco Nacional:</strong> 554-001992-8</p>
            <p>Enviar comprobante con nombre del alumno y concepto de pago.</p>
          </div>
        </FamilyCard>
      </div>
      <FamilyCard title="Historial reciente">
        <DataTable headers={['Concepto', 'Fecha', 'Monto', 'Estado']} rows={[['Colegiatura mayo', '05/05/2026', 'Q 950.00', <Status value="Pagado" />], ['Colegiatura junio', '05/06/2026', 'Q 950.00', <Status value={child.balance === 'Solvente' ? 'Pagado' : 'Pendiente'} />]]} />
      </FamilyCard>
    </FamilyPage>
  );
}

function FamilyReports({ child, childrenList, onChildChange, message, onMessage }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void; message: string; onMessage: (value: string) => void }) {
  const reportsAvailable = child.balance === 'Solvente';
  return (
    <FamilyPage title="Reportes y comunicacion" subtitle="Reportes de conducta, desempeno, notas finales de unidad y comunicacion directa con catedraticos." child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <FamilyCard title="Reportes de unidad">
          {reportsAvailable ? (
            <div className="space-y-3">
              {['No entrego tarea de lectura', 'Llamado de atencion por conducta', 'Boletin final de unidad'].map((report, index) => <div className="rounded-xl border border-[#c0c8ca] bg-[#f3faff] p-4" key={report}><strong className="text-[#003b43]">{report}</strong><p className="text-sm text-[#40484a]">{index === 2 ? 'Disponible por cierre de notas.' : 'Reporte registrado por el docente.'}</p></div>)}
            </div>
          ) : (
            <div className="rounded-xl border border-[#ffdad6] bg-[#fff2f0] p-4"><strong className="text-[#93000a]">Reportes bloqueados</strong><p className="mt-2 text-sm text-[#40484a]">Disponibles solo con notas finales de unidad y solvencia de matricula.</p></div>
          )}
        </FamilyCard>
        <FamilyCard title="Mensaje al catedratico">
          <label><span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Profesor</span><select className="mt-2 w-full rounded-lg border border-[#c0c8ca] bg-white px-4 py-3 text-[#003b43]"><option>Elena Rodriguez - Matematicas</option><option>Marco Fuentes - Ciencias</option><option>Sofia Morales - Lenguaje</option></select></label>
          <label className="mt-4 block"><span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Mensaje</span><textarea className="admin-input mt-2 min-h-36 w-full rounded-lg border border-[#c0c8ca] px-4 py-3" onChange={(event) => onMessage(event.target.value)} placeholder="Escribe tu consulta..." value={message} /></label>
          <button className="mt-4 w-full rounded-xl bg-[#003b43] px-5 py-3 font-black text-white" type="button">Enviar comunicacion</button>
        </FamilyCard>
      </div>
    </FamilyPage>
  );
}

function FamilySettings({ child, childrenList, onChildChange, onLogout }: { child: FamilyChild; childrenList: FamilyChild[]; onChildChange: (child: FamilyChild) => void; onLogout: () => void }) {
  const [parentProfile, setParentProfile] = useState({
    name: 'Familia Morales',
    email: 'familia@demo.com',
    phone: '5558-2140',
    address: 'Zona 10, Ciudad de Guatemala',
  });
  const [cards, setCards] = useState([
    { brand: 'Visa', last4: '4242', expiry: '12/26', main: true },
    { brand: 'Mastercard', last4: '8812', expiry: '08/25', main: false },
  ]);
  const [newCard, setNewCard] = useState({ brand: 'Visa', last4: '', expiry: '' });
  const addCard = () => {
    if (!newCard.last4.trim() || !newCard.expiry.trim()) return;
    setCards((current) => [...current, { ...newCard, last4: newCard.last4.slice(-4), main: false }]);
    setNewCard({ brand: 'Visa', last4: '', expiry: '' });
  };

  return (
    <FamilyPage title="Configuracion de cuenta" subtitle="Datos personales del padre o encargado y administracion de metodos de pago." child={child} childrenList={childrenList} onChildChange={onChildChange}>
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <FamilyCard title="Datos personales">
          <div className="mb-5 flex items-center gap-4 rounded-xl bg-[#e6f6ff] p-4">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[#79f3ea] text-xl font-black text-[#003b43]">FM</span>
            <div>
              <strong className="block text-xl text-[#003b43]">{parentProfile.name}</strong>
              <span className="text-sm text-[#40484a]">Encargado principal · {child.name}</span>
            </div>
          </div>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
            {[
              ['name', 'Nombre completo'],
              ['email', 'Correo electronico'],
              ['phone', 'Telefono'],
              ['address', 'Direccion'],
            ].map(([key, label]) => (
              <label className={key === 'address' ? 'md:col-span-2' : ''} key={key}>
                <span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">{label}</span>
                <input
                  className="admin-input mt-2 w-full rounded-lg border border-[#c0c8ca] bg-white px-4 py-3 text-[#003b43] outline-none focus:border-[#006a65] focus:ring-2 focus:ring-[#006a65]/15"
                  onChange={(event) => setParentProfile((current) => ({ ...current, [key]: event.target.value }))}
                  value={parentProfile[key as keyof typeof parentProfile]}
                />
              </label>
            ))}
            <button className="rounded-lg bg-[#003b43] px-5 py-3 font-black text-white md:col-span-2" type="button">Guardar datos</button>
          </form>
        </FamilyCard>

        <FamilyCard title="Preferencias de cuenta">
          <div className="space-y-3">
            {[
              ['Notificaciones de pagos', 'Recibir recordatorios antes del vencimiento'],
              ['Reportes academicos', 'Avisar cuando haya un reporte nuevo'],
              ['Comunicacion docente', 'Notificar respuestas de catedraticos'],
            ].map(([title, text]) => (
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-[#003b43]/10 bg-[#f3faff] p-4" key={title}>
                <span><strong className="block text-[#003b43]">{title}</strong><small className="text-[#40484a]">{text}</small></span>
                <input className="h-5 w-5 accent-[#006a65]" defaultChecked type="checkbox" />
              </label>
            ))}
            <div className="rounded-xl border border-[#ffdad6] bg-[#fff2f0] p-4">
              <strong className="block text-[#93000a]">Sesion de cuenta</strong>
              <p className="mt-1 text-sm text-[#40484a]">Cierra la sesion del portal de padres en este dispositivo.</p>
              <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#003b43] px-5 py-3 font-black text-white transition hover:bg-[#00504c]" onClick={onLogout} type="button">
                <LogOut size={18} />
                Cerrar sesion
              </button>
            </div>
          </div>
        </FamilyCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <FamilyCard title="Metodos de pago">
          <div className="grid gap-4 md:grid-cols-2">
            {cards.map((card) => (
              <article className={`rounded-xl border p-4 ${card.main ? 'border-[#5dd9d0] bg-[#d8f2ff]' : 'border-[#c0c8ca] bg-white'}`} key={`${card.brand}-${card.last4}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-lg font-black text-[#003b43]">{card.brand} •••• {card.last4}</p>
                    <p className="text-sm text-[#40484a]">Expira {card.expiry}</p>
                  </div>
                  {card.main && <span className="rounded-full bg-[#79f3ea] px-3 py-1 text-xs font-bold text-[#00201e]">Principal</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="rounded-lg border border-[#006a65] px-3 py-2 text-sm font-bold text-[#006a65]" onClick={() => setCards((current) => current.map((item) => ({ ...item, main: item.last4 === card.last4 })))} type="button">Usar</button>
                  <button className="rounded-lg border border-[#ba1a1a] px-3 py-2 text-sm font-bold text-[#ba1a1a]" onClick={() => setCards((current) => current.filter((item) => item.last4 !== card.last4))} type="button">Quitar</button>
                </div>
              </article>
            ))}
          </div>
        </FamilyCard>

        <FamilyCard title="Agregar tarjeta">
          <div className="grid gap-4">
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Tipo</span>
              <select className="admin-input mt-2 w-full rounded-lg border border-[#c0c8ca] px-4 py-3 text-[#003b43]" onChange={(event) => setNewCard((current) => ({ ...current, brand: event.target.value }))} value={newCard.brand}>
                <option>Visa</option>
                <option>Mastercard</option>
                <option>American Express</option>
              </select>
            </label>
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Ultimos 4 digitos</span>
              <input className="admin-input mt-2 w-full rounded-lg border border-[#c0c8ca] px-4 py-3 text-[#003b43]" maxLength={4} onChange={(event) => setNewCard((current) => ({ ...current, last4: event.target.value }))} placeholder="4242" value={newCard.last4} />
            </label>
            <label>
              <span className="text-xs font-bold uppercase tracking-wider text-[#40484a]">Expiracion</span>
              <input className="admin-input mt-2 w-full rounded-lg border border-[#c0c8ca] px-4 py-3 text-[#003b43]" onChange={(event) => setNewCard((current) => ({ ...current, expiry: event.target.value }))} placeholder="12/28" value={newCard.expiry} />
            </label>
            <button className="rounded-lg bg-[#006a65] px-5 py-3 font-black text-white" onClick={addCard} type="button">Agregar metodo</button>
          </div>
        </FamilyCard>
      </div>
    </FamilyPage>
  );
}

function StudentPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto max-w-[1200px] space-y-6 pb-24 text-[#151c26] lg:pb-0" style={{ fontFamily: "'Quicksand', 'Segoe UI', sans-serif" }}>
      <header className="rounded-[2rem] border border-[#d8e2ff] bg-white px-6 py-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0058bd]">Aventura Kids</p>
        <h2 className="mt-1 text-4xl font-bold tracking-normal md:text-5xl" style={{ color: '#0058bd' }}>{title}</h2>
        <p className="mt-2 max-w-3xl text-xl font-medium leading-8" style={{ color: '#243047' }}>{subtitle}</p>
      </header>
      {children}
    </div>
  );
}

function StudentCard({ children }: { children: ReactNode }) {
  return <section className="rounded-[2rem] border border-[#e2e8f7] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">{children}</section>;
}

function StudentStat({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <StudentCard>
      <div className="mb-4 flex items-start justify-between">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eff4ff] text-[#0058bd]">{icon}</span>
        <span className="rounded-full bg-[#76fd94] px-3 py-1 text-sm font-bold text-[#002109]">{detail}</span>
      </div>
      <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#414754]">{title}</p>
      <strong className="text-4xl font-bold text-[#151c26]">{value}</strong>
    </StudentCard>
  );
}

function StudentMission({ title, subject, icon, action }: { title: string; subject: string; icon: ReactNode; action: () => void }) {
  return (
    <button className="rounded-[2rem] border border-[#e2e8f7] bg-white p-6 text-left shadow-[0_8px_24px_rgba(0,0,0,0.06)] transition hover:-translate-y-1" onClick={action} type="button">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#fdd029] text-[#231b00]">{icon}</span>
      <h3 className="text-2xl font-bold text-[#151c26]">{title}</h3>
      <p className="mt-2 text-lg font-medium text-[#414754]">{subject}</p>
      <span className="mt-5 inline-flex rounded-3xl bg-[#0058bd] px-5 py-3 font-bold text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)]">Ver aventura</span>
    </button>
  );
}

function StudentChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-4">
      <p className="text-sm font-bold uppercase tracking-[0.12em] text-[#414754]">{label}</p>
      <strong className="text-xl font-bold text-[#151c26]">{value}</strong>
    </div>
  );
}

function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="relative block w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="admin-input w-full rounded-2xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm outline-none transition focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800" />
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

function Status({ value }: { value: string }) {
  const tone = value.includes('Riesgo') || value.includes('Conflictiva') || value.includes('Pendiente') ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300' : value.includes('Inactivo') ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tone}`}>{value}</span>;
}

function FormGrid({ fields, button }: { fields: string[]; button: string }) {
  return (
    <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => event.preventDefault()}>
      {fields.map((field) => <label key={field} className={field.includes('Descripcion') || field.includes('Mensaje') || field.includes('Observacion') ? 'md:col-span-2' : ''}><span className="text-xs font-black uppercase tracking-wider text-[#5d6b82]">{field}</span><input className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15" /></label>)}
      <button className="rounded-2xl bg-[#1f5eff] px-5 py-3 font-black text-white transition hover:bg-[#004ac6] md:col-span-2">{button}</button>
    </form>
  );
}

function CalendarBoard() {
  return (
    <div className="grid grid-cols-7 gap-2">
      {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
        const hasEvent = [4, 12, 21].includes(day);
        return (
          <button
            key={day}
            className={`min-h-16 rounded-2xl border p-2 text-left text-xs font-black transition hover:-translate-y-0.5 ${
              hasEvent
                ? 'border-[#adc6ff] bg-[#d8e2ff] text-[#001a41]'
                : 'border-[#e2e8f7] bg-white text-[#414754] hover:bg-[#eff4ff]'
            }`}
            type="button"
          >
            {day}
            {day === 12 && <span className="mt-1 block truncate rounded bg-[#fdd029] px-1 py-0.5 text-[10px] text-[#231b00]">Taller</span>}
          </button>
        );
      })}
    </div>
  );
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


