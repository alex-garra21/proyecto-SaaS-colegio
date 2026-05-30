import { useState, useEffect, type ReactNode } from 'react';
import { Eye, Pencil, Send, Trash2 } from 'lucide-react';
import SearchInput from '../molecules/SearchInput';
import Status from '../atoms/Status';
import AdminBadge from '../atoms/AdminBadge';
import { initials } from '../../utils/helpers';
import { type View } from '../../types';

// Datos estáticos originales preservados al 100%
const teachers = [
  { name: 'Elena Rodriguez', specialty: 'Matematicas', email: 'erodriguez@sige.edu.gt', status: 'Activo', load: 86, committees: 'Evaluacion, Olimpiadas' },
  { name: 'Marco Fuentes', specialty: 'Fisica', email: 'mfuentes@sige.edu.gt', status: 'Revision', load: 72, committees: 'Laboratorio' },
  { name: 'Sofia Morales', specialty: 'Literatura', email: 'smorales@sige.edu.gt', status: 'Activo', load: 64, committees: 'Lectura, Cultura' },
  { name: 'Daniel Herrera', specialty: 'Sociales', email: 'dherrera@sige.edu.gt', status: 'Inactivo', load: 28, committees: 'Civismo' },
];

interface AdminTeachersProps {
  setView: (view: View) => void;
}

export default function AdminTeachers({ setView }: AdminTeachersProps) {
  const [query, setQuery] = useState('');
  const [teachersList, setTeachersList] = useState<any[]>(teachers);
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

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:4000/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          const filteredTeachers = data.filter((u: any) => u.IdRol === 3 || u.IdRol === 2).map((u: any) => ({
            name: u.NombreCompleto || `${u.Nombres} ${u.Apellidos}`,
            specialty: u.NombreRol || (u.IdRol === 2 ? 'Personal Académico' : 'Docente / Profesor'),
            email: u.Correo,
            status: u.Estado ? 'Activo' : 'Inactivo',
            load: u.IdRol === 2 ? 90 : 65,
            committees: u.IdRol === 2 ? 'Dirección' : 'Evaluación',
          }));
          
          if (filteredTeachers.length > 0) {
            setTeachersList(filteredTeachers);
            setSelectedTeacher(filteredTeachers[0]);
            setTeacherForm({
              name: filteredTeachers[0].name,
              email: filteredTeachers[0].email,
              specialty: filteredTeachers[0].specialty,
              phone: '5552-1048',
              course: filteredTeachers[0].load > 80 ? '5 cursos' : '3 cursos',
              committee: filteredTeachers[0].committees,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };
    fetchTeachers();
  }, []);

  const filtered = teachersList.filter((teacher) =>
    `${teacher.name} ${teacher.specialty}`.toLowerCase().includes(query.toLowerCase())
  );

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
                <tr>
                  {['Profesor', 'Especialidad', 'Cursos', 'Comites', 'Estado', 'Acciones'].map((header) => (
                    <th className="px-5 py-3" key={header}>{header}</th>
                  ))}
                </tr>
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

// Subcomponente Panel de Acción Lateral preservado
interface TeacherActionPanelProps {
  teacher: typeof teachers[number];
  panel: 'profile' | 'update' | 'message' | 'deactivate';
  form: { name: string; email: string; specialty: string; phone: string; course: string; committee: string };
  onFormChange: (value: { name: string; email: string; specialty: string; phone: string; course: string; committee: string }) => void;
  onClose: () => void;
}

function TeacherActionPanel({
  teacher,
  panel,
  form,
  onFormChange,
  onClose,
}: TeacherActionPanelProps) {
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

// Presentational Helpers
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

function Person({ name, sub }: { name: string; sub: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-full bg-blue-100 font-black text-blue-700">{initials(name)}</span>
      <div>
        <strong className="block">{name}</strong>
        <span className="text-xs text-slate-500">{sub}</span>
      </div>
    </div>
  );
}
