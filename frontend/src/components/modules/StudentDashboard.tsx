import { useState, type ReactNode } from 'react';
import { Sparkles, BookOpen, Flame, Award, ClipboardList, Star, Trophy, FileText, Upload, LogOut, Search, GraduationCap } from 'lucide-react';
import { type View } from '../../types';

// Datos de imagen mock originales
export const studentImages = {
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAP6V5-Iw1D18QCTA-9cZEfiaHulbz_rvgTe7ZntCR2j5kGUcXliNvDtNtMTC1l5KfyQkn4fCPHIuK_w7_xv5HSXaDHegu-5T7dZBkdLqwsYUiEEXCxQ4R-lyLJIl_P8wi9E1Wb1xiiM3m_WUCLKC3cAWn0tBCCtoZeEMhgWXSnjIINEiGX599Vtk8vTq9jLNPkigEqkdq6henQGrUqZ4Gj5yF3Sn5dMi8UJ-1jPIue285VuJbbeWXh34z3bsCX-zZdTuCfULQmYsMP',
  robot: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAyAm_NiIVUCJt-amlxMonBG_hHsKNfG88rvArg77P37tiI36FgrNoteBDJYcJ_WqY3Le4GCNN_UHfPKgBAZPHzRHBdJ6M_4Wr1IEcVWklPda2S1HSVQX3lQkuZpqgfgfNS073c4GMlkrkoyYmkPELsteBIAflTe-ThRxPJEwmaZXnpRKba0mV72DswglYjqCpF1mGxumR7ftZCYVzcn6rFgWgUprjBLJ4ot8_b3fteFJm7BZi-9tYxkUCOXOwe811_4ej-gw5z5RHW',
  math: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlI9Zus2u7-xt0a-ulLZAhQ4k-5fZfjwZECxayM-mv6o5r5wXJPX7VIo13POgvOsYL3xUY6J5nZZyAqCUJcvq-7kuJVTKCukraoYj2P9PYtGcM7hggoyqG3JPglGBykU2p6tNT14iqhhf_ei1LoiN47gc2TFimOA9-6mezfz0RSf5hG3vHFpE4mlCdGIMb5HGbovNp6bhj_8-Gj00fWcJpfAvh_sVa9AKHClRaYitS1QBzfZjNacW6BzP3jvmPp8SbX6iM_FLTaXX3',
  science: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDEPbNpmm30orgcGxE9GI5NKCA28WbP78Oz-xhHHyMbqHhQMV11niVfCXHRlYIaDcOfWl4PdAtKfDdM7hjllfHCJlT351RKCXRLl4h6-DmnC-nOFs_30cBVPNQ5P-PMnpI86yUXlL1-Ikcu-1P_criL9_pAN1mC4-YLDQE1KgXjH7s7gqkTCkvKAhgdB6wxQBiOwF4P7EQAww0R1Zc4fBpLSzE2iL9Lau_kciaK7tg-4-yQbewO1IecQF9YqUqzakrJNgCdulmxQIV3',
  language: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJr9hOq-Pw7sL_A4s2PzIpoO-ME-ihKD2viynqIFDEsgH_sv0Lb-4VoRnjHF1CnhXDYGgglHBSrjQuWO-PW1D1_vOOl67--uXTtAqtgr_N7if-JXoL6PUGmfxg9uL4blZWaU9oTJQUpha0lXOvYgWTQdyXW7guL59Tn09uBhbD8AXG4urAa80lXUM8oE5cwxmijJ8fA-vYqYqtpfjPGOinBixo9_v7Y_D5UmdkTG9zG90UqS4oz1II2W78xMLBZQVW4tpZMyX0-L_z',
  teacher: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOjJVXbEHMshCCvHxywUGhDqmTi6Gj8kgJRrVK9u4sT8lWQxuCs2cOF0NzOT8e7ZZ8SclUssDHm_ee7bhX4VUh95DW7v9w0LFEK3ufhU7AGJHGi31kyHe-s1c_m2KocePIV0drTAIB_DSrUp3LVn0HoHbHKpfMEfvziEIwDsxgU2CB-xJBg4BRu1YRYcqQdTMf_HOHXovnMm0PVf_B1OVa5EljVWWmzJquoZiUWP50GPPybYiSa0XFb9zDdY_BGRNdPZpowsl-1o8a',
  dog: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCS1k8QQ3nI9evmL_9bhsBk3Pj-71ViWBX5nv0bSZDwxoMfjVEkmJugH9XCxp5QuADwRQ4U0_wlYVYAo5Yl38pTuTwCF0NDpbYGKLv2L_OnlnEi8uyBTNHppBAxffYe1NmmPAIhj4z8nh-nQIrSWaT-oRIG2nGK28g6GuoXcMo_zGWQPorFwo-f1BcnJ4x4JkuqJi6rOQFgxmbsORYfYDjOf1dVNx45OICuMm7Dj9BR181PC9jTNpbXrdsNJx8fmqGtIz7o1sD3bCL8',
  profile: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBS_lD_fciRt06MfFxeIVmdjMXs9QfSRPGK26QB5bT92gMD6rVAT4kwOJCHRgq_1FeklduxutSfm1lNMI4L1FOZUICsbmTpzJuZ448R4qp164xDcPFrCYRx1PbZ11ZNQ02dHdM8_lWZ8J61tDaY0TpiuqZa1hTbjiX0Jm4MZNndUtpp7fe7dptphKIkQcN_tOAVYDxhMcFTXFDX3DRxfR6K0G9os0sKSz1CDbuzVBK2A-nHrf2aUtWg1zvqmu8rRKtxPIxIP8DH4oQS',
};

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

interface StudentDashboardProps {
  view: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

export default function StudentDashboard({ view, setView, onLogout }: StudentDashboardProps) {
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

// Student views subcomponents
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
          );
        })}
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

// Subcomponents and Helper presentational components
function StudentPage({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[1200px] space-y-6 text-[#151c26]" style={{ fontFamily: "'Atkinson Hyperlegible Next', 'Segoe UI', sans-serif" }}>
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-4xl font-extrabold tracking-tight text-[#151c26]">{title}</h2>
          <p className="mt-2 text-lg font-medium text-[#414754]">{subtitle}</p>
        </div>
      </header>
      {children}
    </div>
  );
}

function StudentCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-[2rem] border border-[#e2e8f7] bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] ${className}`}>
      {children}
    </section>
  );
}

function StudentStat({ icon, title, value, detail }: { icon: ReactNode; title: string; value: string; detail: string }) {
  return (
    <article className="rounded-3xl border border-[#e2e8f7] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eff4ff] text-[#0058bd]">{icon}</span>
        <div>
          <p className="text-sm font-bold text-[#414754]">{title}</p>
          <strong className="text-2xl font-black text-[#151c26]">{value}</strong>
        </div>
      </div>
      <span className="rounded-full bg-[#fdd029] px-3 py-1 text-xs font-bold text-[#231b00]">{detail}</span>
    </article>
  );
}

function StudentMission({ title, subject, icon, action }: { title: string; subject: string; icon: ReactNode; action?: () => void }) {
  return (
    <article className="rounded-3xl border border-[#e2e8f7] bg-white p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
      <div>
        <span className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-[#eff4ff] text-[#0058bd]">{icon}</span>
        <h3 className="mt-4 text-xl font-bold text-[#151c26]">{title}</h3>
        <p className="mt-1 font-medium text-[#414754]">{subject}</p>
      </div>
      <button className="student-pressable mt-4 w-full rounded-2xl bg-[#0058bd] py-3 font-bold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)]" onClick={action} type="button">¡Comenzar!</button>
    </article>
  );
}

function StudentChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e2e8f7] bg-white p-3 flex justify-between gap-3 text-sm">
      <span className="font-bold text-[#414754]">{label}:</span>
      <strong className="text-[#151c26]">{value}</strong>
    </div>
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
            {hasEvent && <span className="mt-2 block h-1.5 w-1.5 rounded-full bg-[#0058bd]" />}
          </button>
        );
      })}
    </div>
  );
}
