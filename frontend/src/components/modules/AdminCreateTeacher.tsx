import { useState, type ReactNode } from 'react';
import { GraduationCap, ShieldCheck, CheckCircle } from 'lucide-react';

export default function AdminCreateTeacher() {
  const [teacherRole, setTeacherRole] = useState('Docente titular');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('123456'); // Default default secure initial password
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('El nombre completo, el correo institucional y la contraseña inicial son obligatorios.');
      return;
    }

    // Dividir Nombres y Apellidos
    const nameParts = fullName.trim().split(' ');
    const nombres = nameParts[0] || '';
    const apellidos = nameParts.slice(1).join(' ') || 'Docente';

    // Mapear el rol seleccionado al ID de Rol de la base de datos:
    // Coordinador de área y Apoyo académico se registran como Personal Académico (IdRol = 2)
    // El resto se registra como Docente / Profesor (IdRol = 3)
    const idRol = ['Coordinador de area', 'Apoyo academico'].includes(teacherRole) ? 2 : 3;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombres,
          apellidos,
          correo: email.trim().toLowerCase(),
          password,
          idRol
        })
      });

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        setErrorMessage(responseData.message || 'Error al registrar al docente en la base de datos.');
        return;
      }

      // Disparar Toast de Éxito Emocional
      setToastMessage(fullName.trim());
      setErrorMessage(null);

      // Reiniciar formulario
      setFullName('');
      setEmail('');
      setPassword('123456');

      // Desvanecer Toast automáticamente después de 4 segundos
      setTimeout(() => {
        setToastMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error('Error al registrar profesor:', err);
      setErrorMessage('Error de conexión con el servidor.');
    }
  };

  return (
    <AdminPage title="Create Teacher Profile" subtitle="Registro transaccional de nuevos profesores coordinado directamente con la base de datos local.">
      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <AdminCard title="Información de la Cuenta (Usuario)">
            <div className="grid gap-4">
              <label>
                <span className="text-sm font-black uppercase tracking-wider text-[#5d6b82]">Nombre completo del docente</span>
                <input
                  className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Elena Rodríguez"
                  value={fullName}
                />
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <label>
                  <span className="text-sm font-black uppercase tracking-wider text-[#5d6b82]">Correo institucional</span>
                  <input
                    className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="erodriguez@sige.edu.gt"
                    type="email"
                    value={email}
                  />
                </label>
                <label>
                  <span className="text-sm font-black uppercase tracking-wider text-[#5d6b82]">Contraseña inicial</span>
                  <input
                    className="admin-input mt-2 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#191c1e] outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    type="password"
                    value={password}
                  />
                </label>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Rol transaccional a asignar">
            <div className="grid gap-3 md:grid-cols-3">
              {['Docente titular', 'Coordinador de area', 'Tutor de grado', 'Apoyo academico', 'Encargado de comite', 'Docente extracurricular'].map((role) => (
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition ${teacherRole === role ? 'border-[#004ac6] bg-[#eef4ff]' : 'border-[#c3c6d7] bg-white hover:bg-[#f7f9fb]'}`} key={role}>
                  <input className="h-4 w-4 accent-[#004ac6]" checked={teacherRole === role} name="teacher-role" onChange={() => setTeacherRole(role)} type="radio" />
                  <span className="text-sm font-bold text-[#191c1e]">{role}</span>
                </label>
              ))}
            </div>
            <p className="mt-4 rounded-xl bg-[#f7f9fb] p-4 text-sm text-[#434655]">Rol seleccionado: <strong>{teacherRole}</strong>. El backend registrará al docente en SQL Server con el rol de <strong>{['Coordinador de area', 'Apoyo academico'].includes(teacherRole) ? 'Personal Académico (ID: 2)' : 'Docente / Profesor (ID: 3)'}</strong>.</p>
          </AdminCard>
        </div>

        <AdminCard title="Perfil e Integridad">
          <div className="rounded-lg border-2 border-dashed border-[#c3c6d7] bg-[#f7f9fb] p-8 text-center">
            <GraduationCap className="mx-auto text-[#004ac6]" size={48} />
            <p className="mt-3 text-sm font-bold text-[#434655]">Registro de Infraestructura</p>
            <p className="mt-2 text-xs text-[#5d6b82]">Este perfil se insertará atómicamente y generará su sal criptográfica en SQL Server.</p>
          </div>
          <div className="mt-5 space-y-3">
            <div className="flex w-full items-center gap-3 rounded-lg border border-[#e0e3e5] bg-[#f7f9fb] p-4 text-left">
              <span className="grid h-10 w-10 place-items-center rounded bg-[#dbe1ff] text-[#004ac6]"><ShieldCheck size={20} /></span>
              <span>
                <strong className="block text-sm text-[#191c1e]">Gobernanza SQL</strong>
                <small className="text-[#434655]">Encriptación SHA2_256</small>
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-4 rounded-lg bg-[#fff2f0] border border-[#ffdad6] p-3 text-sm font-bold text-[#93000a]">
              {errorMessage}
            </div>
          )}

          <button
            className="mt-5 w-full rounded-lg bg-[#004ac6] px-5 py-3 text-sm font-bold text-white transition-all hover:bg-[#003da3] active:scale-95 shadow-md"
            onClick={handleSubmit}
            type="button"
          >
            Crear perfil de profesor
          </button>
        </AdminCard>
      </div>

      {/* Floating glassmorphic Success Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4 rounded-2xl border border-emerald-100 bg-white/95 px-6 py-4 shadow-[0_12px_32px_-4px_rgba(16,24,40,0.15)] backdrop-blur-md animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-emerald-500">
            <CheckCircle size={22} />
          </div>
          <div>
            <strong className="block text-sm font-bold text-[#191c1e]">¡Usuario Registrado!</strong>
            <span className="text-xs text-[#5d6b82]">¡Usuario {toastMessage} registrado correctamente!</span>
          </div>
        </div>
      )}
    </AdminPage>
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

function AdminCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-xl border border-[#e0e3e5] bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h3 className="text-lg font-bold text-[#191c1e]">{title}</h3>
      </div>
      {children}
    </section>
  );
}
