import { useMemo, useState, type ReactNode } from 'react';
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Flame,
  GraduationCap,
  Home,
  Library,
  Medal,
  Palette,
  PlayCircle,
  Settings,
  Sparkles,
  Star,
  Trophy,
  UserRound,
} from 'lucide-react';

type StudentPage = 'inicio' | 'cursos' | 'calendario' | 'notas' | 'tareas' | 'logros' | 'biblioteca' | 'ajustes';

const navItems: Array<{ id: StudentPage; label: string; icon: ReactNode }> = [
  { id: 'inicio', label: 'Inicio', icon: <Home size={20} /> },
  { id: 'cursos', label: 'Mis Cursos', icon: <GraduationCap size={20} /> },
  { id: 'calendario', label: 'Calendario', icon: <CalendarDays size={20} /> },
  { id: 'logros', label: 'Logros', icon: <Trophy size={20} /> },
  { id: 'biblioteca', label: 'Biblioteca', icon: <Library size={20} /> },
  { id: 'ajustes', label: 'Ajustes', icon: <Settings size={20} /> },
];

const courses = [
  { name: 'Matematicas', teacher: 'Profe Ana', progress: 78, color: '#0c70ea', icon: <Sparkles size={24} />, action: 'Resolver reto' },
  { name: 'Lectura', teacher: 'Profe Marcos', progress: 62, color: '#00873b', icon: <BookOpen size={24} />, action: 'Leer cuento' },
  { name: 'Ciencias', teacher: 'Profe Laura', progress: 84, color: '#a65900', icon: <Flame size={24} />, action: 'Ver experimento' },
  { name: 'Arte', teacher: 'Profe Sofia', progress: 45, color: '#735c00', icon: <Palette size={24} />, action: 'Subir dibujo' },
];

const tasks = [
  { title: 'Tabla del 7', course: 'Matematicas', due: 'Hoy, 4:00 PM', points: 40, status: 'Pendiente' },
  { title: 'Resumen: El bosque encantado', course: 'Lectura', due: 'Manana', points: 25, status: 'En progreso' },
  { title: 'Diario del experimento de plantas', course: 'Ciencias', due: 'Viernes', points: 30, status: 'Nuevo' },
];

const grades = [
  { course: 'Matematicas', grade: 92, note: 'Excelente resolucion de problemas' },
  { course: 'Lectura', grade: 88, note: 'Buen ritmo y comprension' },
  { course: 'Ciencias', grade: 94, note: 'Muy buena observacion' },
  { course: 'Arte', grade: 85, note: 'Sigue practicando composicion' },
];

const achievements = [
  { title: 'Racha de 5 dias', text: 'Entraste a clase toda la semana.', icon: <Flame size={28} />, unlocked: true },
  { title: 'Lector curioso', text: 'Terminaste 3 lecturas del mes.', icon: <BookOpen size={28} />, unlocked: true },
  { title: 'Mente matematica', text: 'Completa 10 retos numericos.', icon: <Medal size={28} />, unlocked: false },
  { title: 'Explorador de ciencias', text: 'Entrega 4 actividades practicas.', icon: <Award size={28} />, unlocked: false },
];

const resources = [
  { title: 'El viaje de Leo', type: 'Cuento interactivo', minutes: 12 },
  { title: 'Fracciones con pizza', type: 'Video', minutes: 8 },
  { title: 'Mini laboratorio: semillas', type: 'Guia', minutes: 15 },
  { title: 'Atlas de animales', type: 'Libro digital', minutes: 20 },
];

const pageToNav: Record<StudentPage, StudentPage> = {
  inicio: 'inicio',
  cursos: 'cursos',
  calendario: 'calendario',
  notas: 'cursos',
  tareas: 'cursos',
  logros: 'logros',
  biblioteca: 'biblioteca',
  ajustes: 'ajustes',
};

export default function StudentAdventureModule() {
  const [page, setPage] = useState<StudentPage>('inicio');
  const [name, setName] = useState('Leo');
  const [interests, setInterests] = useState(['Lectura', 'Ciencias']);
  const average = useMemo(() => Math.round(grades.reduce((sum, item) => sum + item.grade, 0) / grades.length), []);

  const goTo = (nextPage: StudentPage) => setPage(nextPage);
  const toggleInterest = (interest: string) => {
    setInterests((current) =>
      current.includes(interest) ? current.filter((item) => item !== interest) : [...current, interest],
    );
  };

  return (
    <div className="ak-shell -m-8 min-h-[calc(100vh-4rem)] bg-[#f8f9ff] text-[#151c26]">
      <header className="sticky top-0 z-20 flex min-h-[88px] items-center justify-between border-b border-[#dce3f1] bg-[#f8f9ff]/95 px-6 backdrop-blur md:px-10">
        <button className="text-left" onClick={() => goTo('inicio')}>
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#0058bd]">Portal de alumno</p>
          <h1 className="mt-1 text-4xl font-black tracking-normal text-[#0058bd]">Aventura Kids</h1>
        </button>
        <div className="flex items-center gap-3">
          <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eff4ff] text-[#0058bd]" onClick={() => goTo('inicio')} title="Notificaciones">
            <Bell size={20} />
          </button>
          <button className="grid h-11 w-11 place-items-center rounded-full bg-[#eff4ff] text-[#0058bd]" onClick={() => goTo('logros')} title="Mis estrellas">
            <Star size={20} />
          </button>
          <button className="hidden min-h-11 items-center gap-2 rounded-full bg-[#eff4ff] py-1 pl-1 pr-4 text-sm font-black text-[#0058bd] md:flex" onClick={() => goTo('ajustes')}>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[#0c70ea] text-white">{name.slice(0, 1)}</span>
            Hola, {name}
          </button>
        </div>
      </header>

      <div className="grid md:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="sticky top-[88px] hidden h-[calc(100vh-88px)] flex-col gap-4 border-r border-[#dce3f1] bg-white p-4 md:flex">
          <div className="flex items-center gap-3 rounded-2xl border border-[#f3df82] bg-[#fff8d7] p-4">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-[#fdd029] text-[#5a4300]">
              <Trophy size={24} />
            </span>
            <div>
              <strong className="block text-[#0058bd]">Explorador</strong>
              <span className="text-sm font-bold text-[#715a00]">Nivel 5</span>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className={`flex min-h-12 items-center gap-3 rounded-2xl px-4 text-left text-sm font-black transition ${
                  pageToNav[page] === item.id
                    ? 'bg-[#0c70ea] text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.16)]'
                    : 'text-[#5d6472] hover:bg-[#eff4ff] hover:text-[#0058bd]'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <button className="mt-auto flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#0058bd] px-4 font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)]" onClick={() => goTo('tareas')}>
            <PlayCircle size={20} />
            Ir a clase
          </button>
        </aside>

        <main className="mx-auto w-full max-w-[1180px] px-4 py-8 pb-28 md:px-10 md:pb-10">
          {page === 'inicio' && (
            <div className="space-y-8">
              <section className="grid min-h-[310px] items-center gap-6 rounded-[2rem] border border-[#dce3f1] bg-[radial-gradient(circle_at_84%_20%,rgba(253,208,41,0.45),transparent_24%),linear-gradient(135deg,#d8e2ff_0%,#f8f9ff_56%,#c8f7d3_100%)] p-8 md:grid-cols-[1fr_220px] md:p-10">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.24em] text-[#5d6472]">Martes de aprendizaje</p>
                  <h2 className="mt-3 max-w-3xl text-5xl font-black leading-[1.05] tracking-normal text-[#0058bd] md:text-6xl">
                    Listo para una nueva aventura, {name}?
                  </h2>
                  <p className="mt-5 max-w-2xl text-lg leading-7 text-[#5d6472]">
                    Continua tus cursos, revisa tus tareas y gana estrellas por cada reto completado.
                  </p>
                  <button className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-2xl bg-[#0058bd] px-6 font-black text-white shadow-[inset_0_-4px_0_rgba(0,0,0,0.18)]" onClick={() => goTo('tareas')}>
                    Empezar ahora <ChevronRight size={18} />
                  </button>
                </div>
                <div className="mx-auto flex aspect-square w-48 flex-col items-center justify-center rounded-full border-8 border-[#fdd029] bg-white text-center shadow-xl">
                  <span className="text-5xl font-black leading-none text-[#0058bd]">128</span>
                  <strong className="mt-1 text-[#5d6472]">estrellas</strong>
                  <small className="mt-1 font-bold text-[#5d6472]">+18 esta semana</small>
                </div>
              </section>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <MetricCard label="Promedio" value={`${average}%`} icon={<Star size={22} />} />
                <MetricCard label="Tareas activas" value={String(tasks.length)} icon={<Clock size={22} />} />
                <MetricCard label="Racha" value="5 dias" icon={<Flame size={22} />} />
                <MetricCard label="Logros" value="2/4" icon={<Trophy size={22} />} />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <Panel title="Siguiente actividad" action="Ver calendario" onAction={() => goTo('calendario')}>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <button key={task.title} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-[#eff4ff] p-4 text-left transition hover:bg-[#e7eefc]" onClick={() => goTo('tareas')}>
                        <div>
                          <strong className="block text-[#151c26]">{task.title}</strong>
                          <span className="text-sm font-semibold text-[#5d6472]">{task.course} - {task.due}</span>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-[#0058bd]">{task.points} pts</span>
                      </button>
                    ))}
                  </div>
                </Panel>

                <Panel title="Cursos destacados" action="Ver cursos" onAction={() => goTo('cursos')}>
                  <div className="space-y-3">
                    {courses.slice(0, 3).map((course) => (
                      <button key={course.name} className="flex w-full items-center gap-3 rounded-2xl bg-[#eff4ff] p-3 text-left" onClick={() => goTo('cursos')}>
                        <span className="grid h-12 w-12 place-items-center rounded-2xl text-white" style={{ background: course.color }}>{course.icon}</span>
                        <div>
                          <strong className="block text-[#151c26]">{course.name}</strong>
                          <small className="font-bold text-[#5d6472]">{course.progress}% completado</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>
            </div>
          )}

          {page === 'cursos' && (
            <PageFrame title="Mis cursos" subtitle="Tus clases activas, progreso y accesos rapidos.">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {courses.map((course) => (
                  <article key={course.name} className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-6 shadow-sm">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: course.color }}>{course.icon}</div>
                    <h3 className="mt-5 text-xl font-black text-[#0058bd]">{course.name}</h3>
                    <p className="font-bold text-[#5d6472]">{course.teacher}</p>
                    <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#eff4ff]">
                      <span className="block h-full rounded-full" style={{ width: `${course.progress}%`, background: course.color }} />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <strong className="text-[#0058bd]">{course.progress}%</strong>
                      <button className="rounded-full bg-[#0058bd] px-4 py-2 text-sm font-black text-white" onClick={() => goTo('tareas')}>{course.action}</button>
                    </div>
                  </article>
                ))}
              </div>
            </PageFrame>
          )}

          {page === 'calendario' && (
            <PageFrame title="Calendario" subtitle="Eventos de clase, entregas y retos del mes.">
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Panel title="Junio 2026">
                  <div className="grid grid-cols-7 gap-2">
                    {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => <strong key={`${day}-${index}`} className="text-center text-sm text-[#5d6472]">{day}</strong>)}
                    {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                      <button key={day} className={`aspect-square rounded-full text-sm font-black transition hover:bg-[#eff4ff] ${day === 4 ? 'border-2 border-[#0058bd] text-[#0058bd]' : 'bg-white text-[#151c26]'}`} onClick={() => goTo('tareas')}>
                        {day}
                      </button>
                    ))}
                  </div>
                </Panel>
                <Panel title="Proximos eventos">
                  <div className="space-y-3">
                    {['Clase de Matematicas', 'Lectura guiada', 'Entrega de proyecto'].map((event, index) => (
                      <button key={event} className="flex w-full items-center gap-3 rounded-2xl bg-[#eff4ff] p-4 text-left" onClick={() => goTo('tareas')}>
                        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0058bd] font-black text-white">{[4, 10, 16][index]}</span>
                        <div>
                          <strong className="block">{event}</strong>
                          <small className="font-bold text-[#5d6472]">{index === 0 ? 'Hoy' : index === 1 ? 'Manana' : 'Junio'}</small>
                        </div>
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>
            </PageFrame>
          )}

          {page === 'notas' && (
            <PageFrame title="Mis notas" subtitle="Resumen academico por curso.">
              <div className="mb-5 flex items-center justify-between gap-4 rounded-[1.75rem] bg-[#0058bd] p-6 text-white">
                <div>
                  <span className="block text-5xl font-black leading-none">{average}%</span>
                  <strong>Promedio general</strong>
                </div>
                <button className="rounded-full bg-white/15 px-5 py-3 font-black" onClick={() => goTo('logros')}>Ver logros</button>
              </div>
              <div className="space-y-3">
                {grades.map((grade) => (
                  <article key={grade.course} className="flex items-center justify-between rounded-2xl border border-[#dce3f1] bg-white p-4">
                    <div>
                      <strong className="block">{grade.course}</strong>
                      <span className="font-semibold text-[#5d6472]">{grade.note}</span>
                    </div>
                    <b className="text-2xl text-[#0058bd]">{grade.grade}</b>
                  </article>
                ))}
              </div>
            </PageFrame>
          )}

          {page === 'tareas' && (
            <PageFrame title="Centro de tareas" subtitle="Actividades por entregar y recursos para completar clase.">
              <div className="mb-5 flex flex-col justify-between gap-4 rounded-[1.75rem] border border-[#f3df82] bg-[#fff8d7] p-6 md:flex-row md:items-center">
                <div>
                  <h3 className="text-2xl font-black text-[#5a4300]">2 tareas en progreso</h3>
                  <p className="font-semibold text-[#715a00]">Completa actividades para sumar estrellas.</p>
                </div>
                <button className="rounded-full bg-[#0058bd] px-5 py-3 font-black text-white" onClick={() => goTo('logros')}>Ver recompensas</button>
              </div>
              <div className="grid gap-5 lg:grid-cols-3">
                {tasks.map((task) => (
                  <article key={task.title} className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-6">
                    <span className="inline-flex items-center gap-2 rounded-full bg-[#eff4ff] px-3 py-1 text-sm font-black text-[#0058bd]"><Clock size={16} />{task.status}</span>
                    <h3 className="mt-5 text-xl font-black text-[#0058bd]">{task.title}</h3>
                    <p className="font-bold text-[#5d6472]">{task.course}</p>
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-black text-[#5d6472]">{task.due}</span>
                      <button className="rounded-full bg-[#0058bd] px-4 py-2 font-black text-white">Continuar</button>
                    </div>
                  </article>
                ))}
              </div>
            </PageFrame>
          )}

          {page === 'logros' && (
            <PageFrame title="Logros" subtitle="Insignias, estrellas y progreso de explorador.">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {achievements.map((achievement) => (
                  <article key={achievement.title} className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-6 text-center">
                    <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${achievement.unlocked ? 'bg-[#fdd029] text-[#5a4300]' : 'bg-[#eff4ff] text-[#5d6472]'}`}>{achievement.icon}</div>
                    <h3 className="mt-4 text-lg font-black text-[#0058bd]">{achievement.title}</h3>
                    <p className="mt-2 min-h-12 font-semibold text-[#5d6472]">{achievement.text}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-black text-[#0058bd]"><CheckCircle2 size={16} />{achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}</span>
                  </article>
                ))}
              </div>
            </PageFrame>
          )}

          {page === 'biblioteca' && (
            <PageFrame title="Biblioteca" subtitle="Lecturas, videos y guias recomendadas para ti.">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {resources.map((resource) => (
                  <article key={resource.title} className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-6">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#eff4ff] text-[#0058bd]"><BookOpen size={24} /></div>
                    <h3 className="mt-5 text-xl font-black text-[#0058bd]">{resource.title}</h3>
                    <p className="font-bold text-[#5d6472]">{resource.type}</p>
                    <span className="mt-3 block font-black text-[#5d6472]">{resource.minutes} min</span>
                    <button className="mt-5 w-full rounded-full bg-[#0058bd] px-4 py-3 font-black text-white" onClick={() => goTo('tareas')}>Abrir recurso</button>
                  </article>
                ))}
              </div>
            </PageFrame>
          )}

          {page === 'ajustes' && (
            <PageFrame title="Ajustes de perfil" subtitle="Personaliza tu portal de aprendizaje.">
              <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
                <Panel title="Perfil">
                  <div className="flex items-center gap-4">
                    <UserRound size={86} className="text-[#0058bd]" />
                    <label className="flex-1 font-black text-[#5d6472]">
                      Nombre visible
                      <input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-2xl border border-[#dce3f1] bg-white px-4 py-3 font-semibold text-[#151c26] outline-none focus:border-[#0058bd]" />
                    </label>
                  </div>
                </Panel>
                <Panel title="Intereses">
                  <div className="flex flex-wrap gap-3">
                    {['Lectura', 'Ciencias', 'Arte', 'Matematicas', 'Musica', 'Deportes'].map((interest) => (
                      <button key={interest} className={`inline-flex min-h-11 items-center gap-2 rounded-full px-4 font-black ${interests.includes(interest) ? 'bg-[#0058bd] text-white' : 'bg-[#eff4ff] text-[#5d6472]'}`} onClick={() => toggleInterest(interest)}>
                        <CheckCircle2 size={16} />
                        {interest}
                      </button>
                    ))}
                  </div>
                </Panel>
              </div>
            </PageFrame>
          )}
        </main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-30 grid grid-cols-5 gap-1 border-t border-[#dce3f1] bg-white p-2 md:hidden">
        {navItems.filter((item) => item.id !== 'calendario').map((item) => (
          <button key={item.id} className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2 text-[11px] font-black ${pageToNav[page] === item.id ? 'bg-[#eff4ff] text-[#0058bd]' : 'text-[#5d6472]'}`} onClick={() => goTo(item.id)}>
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  );
}

function MetricCard({ label, value, icon }: { label: string; value: string; icon: ReactNode }) {
  return (
    <article className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-5 shadow-sm">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eff4ff] text-[#0058bd]">{icon}</div>
      <span className="mt-5 block font-semibold text-[#5d6472]">{label}</span>
      <strong className="block text-3xl font-black text-[#0058bd]">{value}</strong>
    </article>
  );
}

function Panel({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: ReactNode }) {
  return (
    <section className="rounded-[1.75rem] border border-[#dce3f1] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-xl font-black text-[#0058bd]">{title}</h3>
        {action && <button className="font-black text-[#0058bd]" onClick={onAction}>{action}</button>}
      </div>
      {children}
    </section>
  );
}

function PageFrame({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <section>
      <header className="mb-6">
        <h2 className="text-4xl font-black tracking-normal text-[#0058bd]">{title}</h2>
        <p className="mt-2 text-lg font-semibold text-[#5d6472]">{subtitle}</p>
      </header>
      {children}
    </section>
  );
}
