import { useMemo, useState, type FormEvent, type ReactNode } from 'react';
import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Edit3,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  Mail,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';

type AdminPage = 'dashboard' | 'teachers' | 'subjects' | 'committees';

type Teacher = {
  id: number;
  name: string;
  specialty: string;
  email: string;
  phone: string;
  committees: string[];
  status: 'Active' | 'Review' | 'Inactive';
  load: number;
};

const initialTeachers: Teacher[] = [
  {
    id: 1,
    name: 'Elena Rodriguez',
    specialty: 'MATHEMATICS',
    email: 'erodriguez@edunexus.edu',
    phone: '+502 5555-1101',
    committees: ['Evaluacion', 'Olimpiadas'],
    status: 'Active',
    load: 86,
  },
  {
    id: 2,
    name: 'Marco Fuentes',
    specialty: 'PHYSICS',
    email: 'mfuentes@edunexus.edu',
    phone: '+502 5555-1102',
    committees: ['Laboratorio'],
    status: 'Review',
    load: 72,
  },
  {
    id: 3,
    name: 'Sofia Morales',
    specialty: 'LITERATURE',
    email: 'smorales@edunexus.edu',
    phone: '+502 5555-1103',
    committees: ['Lectura', 'Cultura'],
    status: 'Active',
    load: 64,
  },
  {
    id: 4,
    name: 'Daniel Herrera',
    specialty: 'SOCIAL STUDIES',
    email: 'dherrera@edunexus.edu',
    phone: '+502 5555-1104',
    committees: ['Civismo'],
    status: 'Inactive',
    load: 28,
  },
];

const subjects = [
  { name: 'Matematicas I', teacher: 'Elena Rodriguez', activities: 18, status: 'Operativa' },
  { name: 'Fisica Experimental', teacher: 'Marco Fuentes', activities: 12, status: 'Conflictiva' },
  { name: 'Literatura Universal', teacher: 'Sofia Morales', activities: 15, status: 'Operativa' },
  { name: 'Estudios Sociales', teacher: 'Daniel Herrera', activities: 9, status: 'Revision' },
];

const committeeRows = [
  { name: 'Comite de Evaluacion', lead: 'Elena Rodriguez', members: 6, status: 'Operativo' },
  { name: 'Comision de Laboratorio', lead: 'Marco Fuentes', members: 4, status: 'Revision' },
  { name: 'Club de Lectura', lead: 'Sofia Morales', members: 8, status: 'Operativo' },
];

export default function AdminTeachersModule() {
  const [page, setPage] = useState<AdminPage>('dashboard');
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ALL');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(initialTeachers[0]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', email: '', phone: '' });

  const filteredTeachers = useMemo(() => {
    return teachers.filter((teacher) => {
      const matchesQuery = `${teacher.name} ${teacher.specialty} ${teacher.email}`.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = status === 'ALL' || teacher.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status, teachers]);

  const activeTeachers = teachers.filter((teacher) => teacher.status === 'Active').length;
  const pendingReviews = teachers.filter((teacher) => teacher.status === 'Review').length;
  const avgLoad = Math.round(teachers.reduce((sum, teacher) => sum + teacher.load, 0) / teachers.length);

  const createTeacher = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTeacher: Teacher = {
      id: Date.now(),
      name: form.name,
      specialty: form.specialty.toUpperCase(),
      email: form.email,
      phone: form.phone,
      committees: ['Asignacion pendiente'],
      status: 'Review',
      load: 40,
    };
    setTeachers((current) => [nextTeacher, ...current]);
    setSelectedTeacher(nextTeacher);
    setShowCreate(false);
    setForm({ name: '', specialty: '', email: '', phone: '' });
    setPage('teachers');
  };

  return (
    <div className="-m-8 min-h-[calc(100vh-4rem)] bg-[#f7f9fb] text-[#191c1e]">
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden border-r border-[#c3c6d7] bg-[#505f76] text-[#d3e4fe] lg:flex lg:flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-black text-[#eeefff]">EduAdmin Pro</h1>
            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-[#eeefff]/70">Administrative Portal</p>
          </div>
          <nav className="flex-1 space-y-2 px-4">
            <AdminNavItem active={page === 'dashboard'} icon={<LayoutDashboard size={20} />} label="Dashboard" onClick={() => setPage('dashboard')} />
            <AdminNavItem active={page === 'teachers'} icon={<GraduationCap size={20} />} label="Teachers" onClick={() => setPage('teachers')} />
            <AdminNavItem active={page === 'subjects'} icon={<BookOpen size={20} />} label="Subjects & Activities" onClick={() => setPage('subjects')} />
            <AdminNavItem active={page === 'committees'} icon={<Users size={20} />} label="Committees" onClick={() => setPage('committees')} />
          </nav>
          <div className="space-y-2 border-t border-white/10 p-4">
            <button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold hover:bg-white/10"><Settings size={18} />Settings</button>
            <button className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left font-semibold hover:bg-white/10"><HelpCircle size={18} />Help</button>
          </div>
        </aside>

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#c3c6d7] bg-[#f7f9fb] px-6">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#434655]" size={18} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="w-full rounded-full border-0 bg-[#f2f4f6] py-2 pl-10 pr-4 text-sm outline-none ring-0 focus:ring-2 focus:ring-[#0053db]/20"
                placeholder="Search teachers, subjects or committees..."
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="relative grid h-10 w-10 place-items-center rounded-full hover:bg-[#f2f4f6]">
                <Bell size={20} />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ba1a1a]" />
              </button>
              <button className="grid h-10 w-10 place-items-center rounded-full hover:bg-[#f2f4f6]"><HelpCircle size={20} /></button>
              <div className="hidden h-8 w-px bg-[#c3c6d7] md:block" />
              <div className="hidden text-right md:block">
                <p className="text-xs font-bold">Admin User</p>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#004ac6]">Super Admin</p>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-full border border-[#c3c6d7] bg-white font-black text-[#004ac6]">AU</div>
            </div>
          </header>

          <main className="mx-auto w-full max-w-[1600px] space-y-6 p-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#004ac6]">Gestion academica institucional</p>
                <h2 className="mt-1 text-3xl font-black tracking-tight text-[#191c1e]">
                  {page === 'dashboard' && 'Panel de Control Principal'}
                  {page === 'teachers' && 'Teacher Directory'}
                  {page === 'subjects' && 'Subjects & Activities'}
                  {page === 'committees' && 'Committees & Commissions'}
                </h2>
                <p className="mt-1 text-[#434655]">
                  Manage educator assignments, specialties, institutional committees and teaching workload.
                </p>
              </div>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-6 py-3 font-black text-white shadow-sm transition hover:brightness-110 active:scale-95"
              >
                <Plus size={18} />
                Crear Perfil de Profesor
              </button>
            </div>

            {page === 'dashboard' && (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <AdminMetric title="Total Staff" value={String(teachers.length)} detail="+12%" icon={<Users size={26} />} />
                  <AdminMetric title="Pending Reviews" value={String(pendingReviews)} detail="Requires action" icon={<ClipboardList size={26} />} />
                  <AdminMetric title="Active Teachers" value={String(activeTeachers)} detail="Stable" icon={<ShieldCheck size={26} />} />
                  <AdminMetric title="Avg Load" value={`${avgLoad}%`} detail="+4.2%" icon={<CalendarDays size={26} />} />
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
                  <Surface title="Calendario institucional">
                    <div className="grid grid-cols-7 gap-2">
                      {Array.from({ length: 30 }, (_, index) => index + 1).map((day) => (
                        <button key={day} className={`min-h-16 rounded-xl border p-2 text-left text-xs font-bold ${[6, 12, 21].includes(day) ? 'border-[#004ac6] bg-[#dbe1ff] text-[#004ac6]' : 'border-[#e0e3e5] bg-white text-[#434655]'}`}>
                          {day}
                          {day === 12 && <span className="mt-1 block truncate rounded bg-[#ffdcc3] px-1 py-0.5 text-[10px] text-[#824500]">Taller</span>}
                        </button>
                      ))}
                    </div>
                  </Surface>
                  <Surface title="Actividad reciente">
                    <div className="space-y-3">
                      <Activity icon={<Plus size={18} />} title="New teacher profile" meta="Elena Rodriguez updated assignments" />
                      <Activity icon={<AlertCircle size={18} />} title="Schedule conflict" meta="Fisica Experimental requires revision" />
                      <Activity icon={<CheckCircle2 size={18} />} title="Committee approved" meta="Club de Lectura listo para operar" />
                    </div>
                  </Surface>
                </div>
              </div>
            )}

            {page === 'teachers' && (
              <div className="grid gap-6 xl:grid-cols-[1fr_390px]">
                <Surface title="Teacher Directory">
                  <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div className="flex gap-2 overflow-x-auto">
                      {['ALL', 'Active', 'Review', 'Inactive'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setStatus(item)}
                          className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-wider ${status === item ? 'bg-[#004ac6] text-white' : 'bg-[#f2f4f6] text-[#434655]'}`}
                        >
                          {item === 'ALL' ? 'Todos' : item}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#434655]">{filteredTeachers.length} resultados</span>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-[#c3c6d7]">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-[#f2f4f6] text-[12px] font-black uppercase tracking-wider text-[#434655]">
                        <tr>
                          <th className="px-5 py-3">Teacher</th>
                          <th className="px-5 py-3">Specialty</th>
                          <th className="px-5 py-3">Committees</th>
                          <th className="px-5 py-3">Status</th>
                          <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e0e3e5] bg-white">
                        {filteredTeachers.map((teacher) => (
                          <tr key={teacher.id} className="transition hover:bg-[#f7f9fb]">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d0e1fb] font-black text-[#004ac6]">{initials(teacher.name)}</span>
                                <div>
                                  <strong className="block text-[#191c1e]">{teacher.name}</strong>
                                  <span className="text-xs font-semibold text-[#434655]">{teacher.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <span className="rounded bg-[#d0e1fb] px-2 py-1 text-[11px] font-black text-[#38485d]">{teacher.specialty}</span>
                            </td>
                            <td className="px-5 py-4 text-[#434655]">{teacher.committees.join(', ')}</td>
                            <td className="px-5 py-4"><StatusBadge status={teacher.status} /></td>
                            <td className="px-5 py-4 text-right">
                              <button className="font-black text-[#004ac6]" onClick={() => setSelectedTeacher(teacher)}>Open</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Surface>

                <TeacherDetails teacher={selectedTeacher} />
              </div>
            )}

            {page === 'subjects' && (
              <Surface title="Subjects & Activities">
                <div className="overflow-hidden rounded-xl border border-[#c3c6d7]">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead className="bg-[#f2f4f6] text-[12px] font-black uppercase tracking-wider text-[#434655]">
                      <tr>
                        <th className="px-5 py-3">Subject</th>
                        <th className="px-5 py-3">Teacher</th>
                        <th className="px-5 py-3">Activities</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e0e3e5] bg-white">
                      {subjects.map((subject) => (
                        <tr key={subject.name}>
                          <td className="px-5 py-4 font-bold">{subject.name}</td>
                          <td className="px-5 py-4 text-[#434655]">{subject.teacher}</td>
                          <td className="px-5 py-4 font-black text-[#004ac6]">{subject.activities}</td>
                          <td className="px-5 py-4">
                            <span className={`rounded px-2 py-1 text-[11px] font-black ${subject.status === 'Conflictiva' ? 'bg-[#ffdcc3] text-[#824500]' : 'bg-[#d0e1fb] text-[#38485d]'}`}>{subject.status}</span>
                          </td>
                          <td className="px-5 py-4 text-right"><button className="font-black text-[#004ac6]">Editar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Surface>
            )}

            {page === 'committees' && (
              <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                <Surface title="Comites y comisiones">
                  <div className="grid gap-4 md:grid-cols-3">
                    {committeeRows.map((committee) => (
                      <article key={committee.name} className="rounded-xl border border-[#c3c6d7] bg-white p-5">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[#d0e1fb] text-[#004ac6]"><Users size={22} /></div>
                        <h3 className="mt-4 font-black">{committee.name}</h3>
                        <p className="text-sm font-semibold text-[#434655]">{committee.lead}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <span className="text-sm font-black text-[#004ac6]">{committee.members} miembros</span>
                          <span className="rounded bg-[#dbe1ff] px-2 py-1 text-[10px] font-black text-[#003ea8]">{committee.status}</span>
                        </div>
                      </article>
                    ))}
                  </div>
                </Surface>
                <Surface title="Nuevo comite">
                  <form className="space-y-4">
                    <Field label="Nombre" placeholder="Comite academico" />
                    <Field label="Lider" placeholder="Seleccionar profesor" />
                    <button type="button" className="w-full rounded-xl bg-[#004ac6] px-4 py-3 font-black text-white">Crear comite</button>
                  </form>
                </Surface>
              </div>
            )}
          </main>
        </div>
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#191c1e]/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e0e3e5] p-5">
              <div>
                <h3 className="text-xl font-black">Crear Perfil de Profesor</h3>
                <p className="text-sm text-[#434655]">Registro rapido con asignacion inicial en revision.</p>
              </div>
              <button className="grid h-9 w-9 place-items-center rounded-full hover:bg-[#f2f4f6]" onClick={() => setShowCreate(false)}><X size={18} /></button>
            </div>
            <form className="space-y-4 p-5" onSubmit={createTeacher}>
              <Field label="Nombre completo" value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="Nombre del profesor" required />
              <Field label="Especialidad" value={form.specialty} onChange={(value) => setForm((current) => ({ ...current, specialty: value }))} placeholder="Mathematics" required />
              <Field label="Correo institucional" value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} placeholder="docente@edunexus.edu" type="email" required />
              <Field label="Telefono" value={form.phone} onChange={(value) => setForm((current) => ({ ...current, phone: value }))} placeholder="+502 5555-0000" required />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="rounded-xl bg-[#f2f4f6] px-5 py-3 font-black text-[#434655]" onClick={() => setShowCreate(false)}>Cancelar</button>
                <button type="submit" className="rounded-xl bg-[#004ac6] px-5 py-3 font-black text-white">Guardar Perfil</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminNavItem({ active, icon, label, onClick }: { active: boolean; icon: ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-semibold transition active:scale-95 ${
        active ? 'border-l-4 border-[#004ac6] bg-[#2563eb] text-[#eeefff]' : 'text-[#d3e4fe] hover:bg-white/10'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function AdminMetric({ title, value, detail, icon }: { title: string; value: string; detail: string; icon: ReactNode }) {
  return (
    <article className="rounded-xl border border-[#c3c6d7] bg-white p-5 transition hover:border-[#004ac6]">
      <div className="mb-4 flex items-start justify-between">
        <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#dbe1ff] text-[#004ac6]">{icon}</div>
        <span className="rounded bg-[#dbe1ff] px-2 py-1 text-[11px] font-black text-[#004ac6]">{detail}</span>
      </div>
      <p className="text-[12px] font-black uppercase tracking-wider text-[#434655]">{title}</p>
      <strong className="text-3xl font-black text-[#191c1e]">{value}</strong>
    </article>
  );
}

function Surface({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#c3c6d7] bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[12px] font-black uppercase tracking-[0.16em] text-[#191c1e]">{title}</h3>
      {children}
    </section>
  );
}

function Activity({ icon, title, meta }: { icon: ReactNode; title: string; meta: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f2f4f6] p-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d0e1fb] text-[#004ac6]">{icon}</span>
      <div>
        <strong className="block text-sm">{title}</strong>
        <span className="text-xs font-semibold text-[#434655]">{meta}</span>
      </div>
    </div>
  );
}

function TeacherDetails({ teacher }: { teacher: Teacher | null }) {
  if (!teacher) {
    return (
      <Surface title="Teacher Details">
        <p className="text-sm text-[#434655]">Selecciona un profesor para ver su perfil.</p>
      </Surface>
    );
  }

  return (
    <aside className="rounded-xl border border-[#c3c6d7] bg-white shadow-sm">
      <div className="border-b border-[#e0e3e5] p-6 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#d0e1fb] text-2xl font-black text-[#004ac6]">{initials(teacher.name)}</div>
        <h3 className="mt-4 text-xl font-black">{teacher.name}</h3>
        <p className="text-sm font-bold text-[#434655]">{teacher.specialty}</p>
      </div>
      <div className="space-y-4 p-6">
        <InfoLine icon={<Mail size={18} />} label="Email" value={teacher.email} />
        <InfoLine icon={<HelpCircle size={18} />} label="Telefono" value={teacher.phone} />
        <InfoLine icon={<Users size={18} />} label="Comites" value={teacher.committees.join(', ')} />
        <div className="rounded-xl border border-[#004ac6]/20 bg-[#dbe1ff]/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-black text-[#004ac6]">Teaching Load</span>
            <strong>{teacher.load}%</strong>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
            <span className="block h-full rounded-full bg-[#004ac6]" style={{ width: `${teacher.load}%` }} />
          </div>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#004ac6] px-4 py-3 font-black text-white">
          <Edit3 size={16} />
          Save Changes
        </button>
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-[#434655]">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type={type}
        required={required}
        className="w-full rounded-xl border border-[#c3c6d7] bg-[#f7f9fb] px-4 py-3 text-sm outline-none focus:border-[#004ac6] focus:bg-white"
      />
    </label>
  );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="text-[#004ac6]">{icon}</span>
      <div>
        <span className="block text-[11px] font-black uppercase tracking-wider text-[#434655]">{label}</span>
        <strong className="text-sm">{value}</strong>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Teacher['status'] }) {
  const classes = {
    Active: 'bg-[#d0e1fb] text-[#38485d]',
    Review: 'bg-[#ffdcc3] text-[#824500]',
    Inactive: 'bg-[#ffdad6] text-[#93000a]',
  };
  return <span className={`rounded px-2 py-1 text-[11px] font-black ${classes[status]}`}>{status}</span>;
}

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}
