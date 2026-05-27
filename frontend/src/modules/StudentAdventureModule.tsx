import { useMemo, useState, type ReactNode } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Flame,
  Library,
  Medal,
  Palette,
  PlayCircle,
  Sparkles,
  Star,
  Trophy,
} from 'lucide-react';

type AdventureSection = 'inicio' | 'cursos' | 'calendario' | 'tareas' | 'logros' | 'biblioteca';

const sections: Array<{ id: AdventureSection; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'calendario', label: 'Calendario' },
  { id: 'tareas', label: 'Tareas' },
  { id: 'logros', label: 'Logros' },
  { id: 'biblioteca', label: 'Biblioteca' },
];

const courses = [
  { name: 'Matematicas', teacher: 'Profe Ana', progress: 78, icon: Sparkles, color: 'bg-blue-600' },
  { name: 'Lectura', teacher: 'Profe Marcos', progress: 62, icon: BookOpen, color: 'bg-emerald-500' },
  { name: 'Ciencias', teacher: 'Profe Laura', progress: 84, icon: Flame, color: 'bg-orange-500' },
  { name: 'Arte', teacher: 'Profe Sofia', progress: 45, icon: Palette, color: 'bg-violet-600' },
];

const tasks = [
  { title: 'Tabla del 7', course: 'Matematicas', due: 'Hoy, 4:00 PM', points: 40, status: 'Pendiente' },
  { title: 'Resumen: El bosque encantado', course: 'Lectura', due: 'Manana', points: 25, status: 'En progreso' },
  { title: 'Diario del experimento de plantas', course: 'Ciencias', due: 'Viernes', points: 30, status: 'Nuevo' },
];

const achievements = [
  { title: 'Racha de 5 dias', text: 'Entro a clase toda la semana.', icon: Flame, unlocked: true },
  { title: 'Lector curioso', text: 'Termino 3 lecturas del mes.', icon: BookOpen, unlocked: true },
  { title: 'Mente matematica', text: 'Completa 10 retos numericos.', icon: Medal, unlocked: false },
  { title: 'Explorador de ciencias', text: 'Entrega 4 actividades practicas.', icon: Award, unlocked: false },
];

const resources = [
  { title: 'El viaje de Leo', type: 'Cuento interactivo', minutes: 12 },
  { title: 'Fracciones con pizza', type: 'Video', minutes: 8 },
  { title: 'Mini laboratorio: semillas', type: 'Guia', minutes: 15 },
  { title: 'Atlas de animales', type: 'Libro digital', minutes: 20 },
];

const calendarEvents = [
  { day: '04', title: 'Clase de Matematicas', tag: 'Clase' },
  { day: '10', title: 'Lectura guiada', tag: 'Lectura' },
  { day: '16', title: 'Entrega de proyecto', tag: 'Proyecto' },
  { day: '24', title: 'Reto de ciencias', tag: 'Reto' },
];

export default function StudentAdventureModule() {
  const [activeSection, setActiveSection] = useState<AdventureSection>('inicio');
  const average = useMemo(() => Math.round((92 + 88 + 94 + 85) / 4), []);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="grid gap-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 md:grid-cols-[1fr_220px] md:p-8">
          <div className="max-w-3xl">
            <span className="text-[10px] font-extrabold uppercase tracking-[0.22em] text-blue-700">
              Portal de alumno
            </span>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-blue-700 md:text-5xl">
              Aventura Kids
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
              Continua tus cursos, revisa tus tareas y gana estrellas por cada reto completado en una vista pensada para alumnos.
            </p>
            <button
              onClick={() => setActiveSection('tareas')}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-blue-100 transition hover:bg-blue-800"
            >
              <PlayCircle size={16} />
              Empezar ahora
            </button>
          </div>

          <div className="flex aspect-square flex-col items-center justify-center rounded-full border-8 border-yellow-300 bg-white text-center shadow-lg md:self-center">
            <span className="text-5xl font-black leading-none text-blue-700">128</span>
            <strong className="mt-1 text-sm text-slate-700">estrellas</strong>
            <small className="mt-1 text-[10px] font-semibold text-slate-400">+18 esta semana</small>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white p-3">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-[11px] font-bold transition ${
                activeSection === section.id
                  ? 'bg-blue-700 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </section>

      {activeSection === 'inicio' && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <MetricCard label="Promedio" value={`${average}%`} icon={Star} />
            <MetricCard label="Tareas activas" value={String(tasks.length)} icon={Clock} />
            <MetricCard label="Racha" value="5 dias" icon={Flame} />
            <MetricCard label="Logros" value="2/4" icon={Trophy} />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Panel title="Siguiente actividad">
              <div className="space-y-3">
                {tasks.map((task) => (
                  <button
                    key={task.title}
                    onClick={() => setActiveSection('tareas')}
                    className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:border-blue-100 hover:bg-blue-50"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">{task.title}</strong>
                      <span className="text-xs text-slate-500">{task.course} - {task.due}</span>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-blue-700">
                      {task.points} pts
                    </span>
                  </button>
                ))}
              </div>
            </Panel>

            <Panel title="Explorador">
              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-yellow-300 text-yellow-950">
                    <Trophy size={24} />
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">Nivel 5</strong>
                    <span className="text-xs font-semibold text-slate-500">Siguiente meta: 150 estrellas</span>
                  </div>
                </div>
              </div>
            </Panel>
          </div>
        </>
      )}

      {activeSection === 'cursos' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courses.map((course) => {
            const Icon = course.icon;
            return (
              <article key={course.name} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className={`grid h-12 w-12 place-items-center rounded-xl text-white ${course.color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 text-base font-extrabold text-slate-900">{course.name}</h3>
                <p className="text-xs font-semibold text-slate-400">{course.teacher}</p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <strong className="text-slate-900">{course.progress}%</strong>
                  <button onClick={() => setActiveSection('tareas')} className="font-bold text-blue-700">
                    Continuar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {activeSection === 'calendario' && (
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Panel title="Junio 2026">
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                <button
                  key={day}
                  onClick={() => setActiveSection('tareas')}
                  className={`aspect-square rounded-full text-xs font-bold transition hover:bg-blue-50 ${
                    day === 4 ? 'border-2 border-blue-700 text-blue-700' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Proximos eventos">
            <div className="space-y-3">
              {calendarEvents.map((event) => (
                <div key={event.title} className="flex gap-3 rounded-xl bg-slate-50 p-3">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-700 text-xs font-black text-white">
                    {event.day}
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">{event.title}</strong>
                    <span className="text-xs font-semibold text-slate-400">{event.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {activeSection === 'tareas' && (
        <div className="grid gap-4 lg:grid-cols-3">
          {tasks.map((task) => (
            <article key={task.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700">
                <Clock size={13} />
                {task.status}
              </span>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">{task.title}</h3>
              <p className="mt-1 text-xs font-semibold text-slate-400">{task.course}</p>
              <div className="mt-5 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">{task.due}</span>
                <button className="rounded-lg bg-slate-950 px-3 py-2 font-bold text-white">Continuar</button>
              </div>
            </article>
          ))}
        </div>
      )}

      {activeSection === 'logros' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon;
            return (
              <article key={achievement.title} className="rounded-2xl border border-slate-100 bg-white p-5 text-center shadow-sm">
                <div className={`mx-auto grid h-14 w-14 place-items-center rounded-full ${achievement.unlocked ? 'bg-yellow-300 text-yellow-950' : 'bg-slate-100 text-slate-400'}`}>
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 text-sm font-extrabold text-slate-900">{achievement.title}</h3>
                <p className="mt-2 min-h-10 text-xs text-slate-500">{achievement.text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide text-blue-700">
                  <CheckCircle2 size={13} />
                  {achievement.unlocked ? 'Desbloqueado' : 'Bloqueado'}
                </span>
              </article>
            );
          })}
        </div>
      )}

      {activeSection === 'biblioteca' && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {resources.map((resource) => (
            <article key={resource.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-blue-50 text-blue-700">
                <Library size={22} />
              </div>
              <h3 className="mt-4 text-base font-extrabold text-slate-900">{resource.title}</h3>
              <p className="text-xs font-semibold text-slate-400">{resource.type}</p>
              <span className="mt-3 block text-xs font-black text-slate-600">{resource.minutes} min</span>
              <button className="mt-4 w-full rounded-xl bg-blue-700 px-3 py-2.5 text-xs font-bold text-white">
                Abrir recurso
              </button>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Star }) {
  return (
    <article className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-700">
        <Icon size={21} />
      </div>
      <span className="mt-4 block text-xs font-semibold text-slate-400">{label}</span>
      <strong className="mt-1 block text-2xl font-black text-blue-700">{value}</strong>
    </article>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-xs font-black uppercase tracking-[0.18em] text-slate-900">{title}</h2>
      {children}
    </section>
  );
}
