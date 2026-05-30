import { type ReactNode } from 'react';
import { Upload, Users, LineChart, ShieldCheck, ClipboardList, Plus } from 'lucide-react';
import DataTable from '../organisms/DataTable';
import Status from '../atoms/Status';

interface TeacherGradesProps {
  title?: string;
  subtitle?: string;
  planning?: boolean;
}

export function TeacherPlanning() {
  return <TeacherGrades title="Matemáticas Avanzadas: Sección B" subtitle="Salón 402 • Lun, Mié, Vie 09:00 - 10:30 AM" planning />;
}

export default function TeacherGrades({
  title = 'Notas y Reportes',
  subtitle = 'Administra notas, revisa alertas estadísticas y genera reportes académicos.',
  planning = false,
}: TeacherGradesProps) {
  return (
    <TeacherPage
      title={title}
      subtitle={subtitle}
      actions={
        <div className="flex gap-3">
          <button className="rounded bg-[#d3e4fe] px-7 py-4 text-lg text-[#0b1c30] font-bold inline-flex items-center">
            <Upload className="mr-2" size={18} />
            Exportar Registros
          </button>
          <button className="rounded bg-[#00288e] px-7 py-4 text-lg font-bold text-white inline-flex items-center">
            <Users className="mr-2" size={18} />
            Inscribir Alumno
          </button>
        </div>
      }
    >
      <div className="grid gap-7 xl:grid-cols-[1fr_380px]">
        <div className="space-y-7">
          <div className="grid gap-5 md:grid-cols-3">
            <TeacherStat title="Promedio" value="84.2%" detail="" icon={<LineChart />} tone="green" />
            <TeacherStat title="Asistencia" value="96.5%" detail="" icon={<ShieldCheck />} />
            <TeacherStat title="Tareas Pendientes" value="12" detail="" icon={<ClipboardList />} />
          </div>

          <TeacherCard title={planning ? 'Planificación de 100 puntos' : 'Libro de Calificaciones'}>
            <DataTable
              headers={['Nombre', 'Test Unidad 1', 'Quiz Cálculo', 'Parcial', 'Lab Álgebra']}
              rows={[
                ['Elena Rodriguez', '92', '88', '95', '100'],
                ['Marcus Thorne', '76', '81', '78', '85'],
                ['Sarah Jenkins', '98', '94', '91', '89'],
                ['Amara Okafor', '64', '72', '58', '70'],
              ]}
            />
          </TeacherCard>

          <TeacherCard
            title="Lista de Estudiantes"
            toolbar={<button className="text-[#00288e] font-bold">Ver los 24 alumnos</button>}
          >
            <DataTable
              headers={['Nombre', 'ID', 'Estado', 'Acciones']}
              rows={[
                ['Elena Rodriguez', '#MTH-2023-001', <Status value="Activo" />, '⋮'],
                ['Marcus Thorne', '#MTH-2023-002', <Status value="Activo" />, '⋮'],
                ['Sarah Jenkins', '#MTH-2023-003', <Status value="Ausente" />, '⋮'],
              ]}
            />
          </TeacherCard>
        </div>

        <TeacherCard
          title="Tareas"
          toolbar={
            <button className="grid h-11 w-11 place-items-center rounded-full bg-[#00288e] text-white">
              <Plus />
            </button>
          }
        >
          <div className="space-y-5">
            {['Proyecto Final Cálculo', 'Quiz Semanal de Trigonometría', 'Tarea de Álgebra Vectorial'].map(
              (task, index) => (
                <article
                  className={`rounded-lg border p-5 ${
                    index === 0 ? 'border-[#c4c5d5] bg-[#eff4ff]' : 'border-[#c4c5d5] bg-white'
                  }`}
                  key={task}
                >
                  <span
                    className={`rounded px-3 py-1 text-sm font-bold ${
                      index === 0 ? 'bg-[#95f8a7] text-[#005323]' : 'bg-[#dde1ff] text-[#00288e]'
                    }`}
                  >
                    {['En Progreso', 'Programada', 'En Revisión'][index]}
                  </span>
                  <h4 className="mt-4 text-xl">{task}</h4>
                  <p className="mt-3 text-[#303241]">Vence: {['24 oct, 2023', '28 oct, 2023', '20 oct'][index]}</p>
                  <div className="mt-4 h-1.5 rounded bg-[#d3e4fe]">
                    <span
                      className="block h-full rounded bg-[#006d30]"
                      style={{ width: `${[75, 20, 100][index]}%` }}
                    />
                  </div>
                </article>
              )
            )}
          </div>
          <button className="mt-72 w-full rounded border-2 border-dashed border-[#c4c5d5] py-4 text-xl font-semibold">
            + Añadir etapa
          </button>
        </TeacherCard>
      </div>
    </TeacherPage>
  );
}

// Presentational layouts and stat helpers
function TeacherPage({
  title,
  subtitle,
  children,
  actions,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1320px] space-y-6 text-[#102033]" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
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

function TeacherCard({
  title,
  children,
  toolbar,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  toolbar?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`overflow-hidden rounded-2xl border border-[#d5deea] bg-white shadow-[0_10px_30px_rgba(20,50,90,0.06)] ${className}`}>
      {(title || toolbar) && (
        <div className="flex items-center justify-between gap-4 border-b border-[#eef3f9] px-5 py-4">
          <h3 className="text-lg font-black text-[#102033]">{title}</h3>
          {toolbar}
        </div>
      )}
      <div className="p-5">{children}</div>
    </section>
  );
}

function TeacherStat({
  title,
  value,
  detail,
  icon,
  tone = 'lavender',
}: {
  title: string;
  value: string;
  detail: string;
  icon: ReactNode;
  tone?: 'green' | 'red' | 'lavender' | 'blue';
}) {
  const toneClass =
    tone === 'green'
      ? 'bg-[#dff8e6] text-[#095827]'
      : tone === 'red'
      ? 'bg-[#ffe1dd] text-[#9a2118]'
      : tone === 'blue'
      ? 'bg-[#dceaff] text-[#0a3a92]'
      : 'bg-[#ebe7ff] text-[#4338ca]';
  return (
    <article className="rounded-2xl border border-[#d5deea] bg-white p-5 shadow-[0_10px_30px_rgba(20,50,90,0.05)]">
      <div className="mb-4 flex items-start justify-between gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${toneClass}`}>{icon}</span>
        <p
          className={`max-w-36 text-right text-xs font-black leading-5 ${
            tone === 'green' ? 'text-[#095827]' : tone === 'red' ? 'text-[#ba1a1a]' : 'text-[#57708d]'
          }`}
        >
          {detail}
        </p>
      </div>
      <p className="text-sm font-bold text-[#57708d]">{title}</p>
      <strong className="mt-1 block text-4xl font-black leading-tight text-[#102033]">{value}</strong>
    </article>
  );
}
