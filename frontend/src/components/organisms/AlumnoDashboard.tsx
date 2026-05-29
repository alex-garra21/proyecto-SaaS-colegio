import { useState } from 'react';
import { 
  Sparkles, BookOpen, Flame, Palette, 
  Star, Trophy, PlayCircle, 
  Clock 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

type ActiveSection = 'inicio' | 'cursos' | 'tareas' | 'logros';

export default function AlumnoDashboard() {
  const { showToast } = useToast();
  const [activeSection, setActiveSection] = useState<ActiveSection>('inicio');
  const [estrellas, setEstrellas] = useState(128);

  const handleResolverReto = () => {
    setEstrellas(prev => prev + 15);
    showToast('¡Felicidades, Aventurero! Completaste el Reto del Día y ganaste 15 estrellas.', 'success');
  };

  const courses = [
    { name: 'Matemáticas', teacher: 'Profe Ana', progress: 78, icon: Sparkles, color: 'bg-blue-500', border: 'border-b-8 border-blue-700 hover:bg-blue-600' },
    { name: 'Lectura', teacher: 'Profe Marcos', progress: 62, icon: BookOpen, color: 'bg-emerald-500', border: 'border-b-8 border-emerald-700 hover:bg-emerald-600' },
    { name: 'Ciencias', teacher: 'Profe Laura', progress: 84, icon: Flame, color: 'bg-orange-500', border: 'border-b-8 border-orange-700 hover:bg-orange-600' },
    { name: 'Arte', teacher: 'Profe Sofía', progress: 45, icon: Palette, color: 'bg-violet-500', border: 'border-b-8 border-violet-700 hover:bg-violet-600' }
  ];

  const tasks = [
    { title: 'Tabla del 7 y Retos', course: 'Matemáticas', due: 'Hoy, 4:00 PM', points: 40 },
    { title: 'Lectura: El bosque encantado', course: 'Lectura', due: 'Mañana', points: 25 },
    { title: 'Diario del experimento de plantas', course: 'Ciencias', due: 'Viernes', points: 30 }
  ];

  const achievements = [
    { title: 'Racha de 5 días', text: 'Entraste a clase toda la semana sin faltar.', icon: Flame, unlocked: true },
    { title: 'Lector curioso', text: 'Completaste 3 lecturas en la biblioteca digital.', icon: BookOpen, unlocked: true },
    { title: 'Mente matemática', text: 'Resuelve 10 retos numéricos sin equivocarte.', icon: Trophy, unlocked: false }
  ];

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in duration-300 font-sans select-none">
      
      {/* Banner Principal Lúdico (Aventura Kids) con esquinas redondeadas 2xl */}
      <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
        <div className="grid gap-6 bg-gradient-to-br from-blue-50 via-white to-emerald-50 p-6 md:grid-cols-[1fr_220px] md:p-8">
          <div className="max-w-3xl text-left">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-700">
              <Sparkles size={12} className="animate-spin" style={{ animationDuration: '3s' }} />
              Aventura Kids • SIGE
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-blue-700 md:text-5xl">
              ¡Hola, Aventurero!
            </h1>
            <p className="mt-4 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-600">
              Continúa tus cursos divertidos, completa tus tareas del colegio y gana estrellas brillantes por cada reto académico finalizado con éxito.
            </p>
            
            <div className="mt-5 flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveSection('tareas')}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-b-4 border-blue-800"
              >
                <PlayCircle size={16} />
                <span>Empezar Desafíos</span>
              </button>

              <button
                onClick={handleResolverReto}
                className="inline-flex items-center gap-2 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-yellow-950 px-5 py-3 text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] transition-all cursor-pointer border-b-4 border-yellow-600"
              >
                <Star size={16} className="fill-yellow-950" />
                <span>¡Resolver Reto del Día!</span>
              </button>
            </div>
          </div>

          {/* Globo de Estrellas Circular con bordes y relieve 3D */}
          <div className="flex aspect-square flex-col items-center justify-center rounded-full border-[10px] border-yellow-300 bg-white text-center shadow-lg md:self-center h-44 w-44 mx-auto md:mx-0">
            <span className="text-5xl font-black leading-none text-blue-700">{estrellas}</span>
            <strong className="mt-1 text-xs text-slate-700 uppercase tracking-widest">Estrellas</strong>
            <small className="mt-1 text-[9px] font-bold text-slate-400">+15 ganadas hoy</small>
          </div>
        </div>

        {/* Navegación del Portal Lúdico (Pills con rounded-full) */}
        <div className="flex gap-2 overflow-x-auto border-t border-slate-100 bg-white p-3">
          {(['inicio', 'cursos', 'tareas', 'logros'] as ActiveSection[]).map((sec) => (
            <button
              key={sec}
              onClick={() => setActiveSection(sec)}
              className={`shrink-0 rounded-full px-4 py-2 text-xs font-extrabold transition-all duration-200 cursor-pointer ${
                activeSection === sec
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {sec === 'inicio' && 'Inicio de Aventura'}
              {sec === 'cursos' && 'Mis Cursos'}
              {sec === 'tareas' && 'Mis Tareas'}
              {sec === 'logros' && 'Mis Logros'}
            </button>
          ))}
        </div>
      </section>

      {/* --- VISTA: INICIO DE AVENTURA --- */}
      {activeSection === 'inicio' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Siguientes retos a resolver (Columna 2/3) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-blue-500" />
                Siguientes Tareas en tu Agenda
              </h3>

              <div className="space-y-3">
                {tasks.map(t => (
                  <button
                    key={t.title}
                    onClick={() => {
                      setActiveSection('tareas');
                      showToast(`Iniciando el reto de ${t.course}.`, 'success');
                    }}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left transition hover:border-blue-100 hover:bg-blue-50 cursor-pointer"
                  >
                    <div>
                      <strong className="block text-sm text-slate-900">{t.title}</strong>
                      <span className="text-[11px] text-slate-500 font-semibold">{t.course} - Entrega: {t.due}</span>
                    </div>
                    <span className="rounded-full bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-black text-blue-700 flex items-center gap-1">
                      <Star size={13} className="fill-blue-600 text-blue-600" />
                      +{t.points} pts
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Panel Nivel y Trofeos (Columna 1/3) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Tu Nivel de Héroe
              </h3>

              <div className="rounded-xl border border-yellow-200 bg-yellow-50/50 p-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-yellow-300 text-yellow-950 shadow-sm">
                    <Trophy size={22} />
                  </div>
                  <div>
                    <strong className="block text-sm text-slate-900">Aventurero Nivel 5</strong>
                    <span className="text-[11px] font-semibold text-slate-500 block mt-0.5">Siguiente meta: 150 estrellas</span>
                  </div>
                </div>
                {/* Barra de progreso redondeada full */}
                <div className="w-full bg-yellow-200 h-2.5 rounded-full overflow-hidden mt-4">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(estrellas / 150) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- VISTA: MIS CURSOS (TARJETAS 3D CON RELIEVE INFERIOR) --- */}
      {activeSection === 'cursos' && (
        <div>
          <div className="text-left px-1 mb-5">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
              Módulos Curriculares
            </h4>
            <h3 className="text-lg font-bold text-slate-800 mt-1">
              Selecciona una materia para abrir tu libreta
            </h3>
          </div>

          {/* Rejilla de Materias Cuadradas con relieve 3D */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {courses.map(c => {
              const Icon = c.icon;
              return (
                <button
                  key={c.name}
                  onClick={() => {
                    setActiveSection('tareas');
                    showToast(`Cargando panel de tareas para ${c.name}...`, 'success');
                  }}
                  className={`w-full aspect-square ${c.color} ${c.border} text-white rounded-3xl p-5 flex flex-col justify-between items-start text-left shadow-md transform hover:-translate-y-1 transition-all cursor-pointer focus:outline-none`}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-sm">
                    <Icon size={22} />
                  </div>

                  <div className="w-full">
                    <span className="text-[10px] font-black uppercase tracking-wider opacity-85 block mb-1">
                      {c.teacher}
                    </span>
                    <h4 className="text-lg font-extrabold leading-tight">
                      {c.name}
                    </h4>

                    {/* Barra de Progreso Lúdica */}
                    <div className="w-full bg-white/25 h-2 rounded-full overflow-hidden mt-3">
                      <div className="h-full bg-white rounded-full" style={{ width: `${c.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-bold mt-2 opacity-95">
                      <span>Progreso:</span>
                      <span>{c.progress}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* --- VISTA: MIS TAREAS --- */}
      {activeSection === 'tareas' && (
        <div>
          <div className="text-left px-1 mb-5">
            <h3 className="text-lg font-bold text-slate-800">
              Desafíos Escolares Activos
            </h3>
            <p className="text-xs text-slate-500">
              Completa cada reto y obtén recompensas de estrellas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.title}
                className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between min-h-[180px] hover:shadow-md transition"
              >
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black text-blue-700 mb-3 select-none">
                    <Clock size={12} />
                    Entrega: {task.due}
                  </span>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Materia: {task.course}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-4 text-xs font-bold">
                  <span className="text-[#2563EB]">+{task.points} estrellas</span>
                  <button
                    onClick={() => {
                      showToast(`¡Has entregado tu tarea de ${task.course}! El docente la revisará pronto.`, 'success');
                      setEstrellas(prev => prev + task.points);
                    }}
                    className="rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-3.5 py-2 text-[11px] font-bold shadow-sm transition cursor-pointer"
                  >
                    Entregar Reto
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- VISTA: MIS LOGROS (TROFEOS) --- */}
      {activeSection === 'logros' && (
        <div>
          <div className="text-left px-1 mb-5">
            <h3 className="text-lg font-bold text-slate-800">
              Tus Trofeos y Medallas del Portal
            </h3>
            <p className="text-xs text-slate-500">
              Desbloquea logros por ser un excelente estudiante en el colegio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((a) => {
              const Icon = a.icon;
              return (
                <div
                  key={a.title}
                  className={`border rounded-2xl p-5 text-center flex flex-col justify-between items-center shadow-sm ${
                    a.unlocked 
                      ? 'border-yellow-200 bg-yellow-50/20' 
                      : 'border-slate-150 bg-white opacity-85'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-sm ${
                    a.unlocked ? 'bg-yellow-300 text-yellow-950 animate-bounce' : 'bg-slate-100 text-slate-400'
                  }`} style={{ animationDuration: '4s' }}>
                    <Icon size={22} />
                  </div>

                  <div className="my-4">
                    <h4 className="text-sm font-extrabold text-slate-900">
                      {a.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 leading-normal max-w-xs">
                      {a.text}
                    </p>
                  </div>

                  <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                    a.unlocked ? 'bg-emerald-50 border border-emerald-100 text-emerald-700' : 'bg-slate-50 border border-slate-100 text-slate-400'
                  }`}>
                    {a.unlocked ? 'Completado' : 'Bloqueado'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
