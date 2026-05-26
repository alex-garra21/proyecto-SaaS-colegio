import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  FileText,
  CheckSquare,
  BookOpen,
  Brain,
  LogOut,
  HelpCircle,
  Settings,
  GraduationCap
} from 'lucide-react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { user, logout } = useAuth();

  const role = user?.idRol ?? null;

  const menuItems = useMemo(() => {
    const items = [];

    if (role === 1) {
      items.push(
        {
          id: 'backups',
          label: 'Módulo de Backups',
          icon: Database,
          description: 'Respaldo Completo'
        },
        {
          id: 'bitacoras',
          label: 'Bitácoras',
          icon: FileText,
          description: 'Auditoría Transaccional'
        }
      );
    } else if (role === 3) {
      items.push({
        id: 'calificaciones',
        label: 'Asentar Notas',
        icon: CheckSquare,
        description: 'sp_AsignarCalificacion'
      });
    } else if (role === 4 || role === 5) {
      items.push(
        {
          id: 'boleta',
          label: 'Visualizar Boleta',
          icon: BookOpen,
          description: 'Historial Académico'
        },
        {
          id: 'ia-metrics',
          label: 'Métricas de IA',
          icon: Brain,
          description: 'Rendimiento Predictivo'
        }
      );
    }

    return items;
  }, [role]);

  const roleLabel = (idRol: number): string => {
    if (idRol === 1) return 'Administrador';
    if (idRol === 3) return 'Profesor Docente';
    if (idRol === 4) return 'Alumno Regular';
    if (idRol === 5) return 'Padre de Familia';
    return 'Usuario Portal';
  };

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-slate-100 bg-white p-5 select-none">
      {/* 1. Header Superior del Sistema */}
      <div className="space-y-6">
        <div className="flex flex-col space-y-1.5 px-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white shadow-md">
              <GraduationCap size={18} strokeWidth={2} />
            </div>
            <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-none">
              SIGE
            </h2>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
            Portal del Colegio
          </span>
        </div>

        {/* 2. Menú de Navegación Adaptable por Rol */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-slate-50 text-slate-900 font-semibold border-l-2 border-slate-900 pl-2.5 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                }`}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.8}
                  className={isActive ? 'text-slate-950' : 'text-slate-400'}
                />
                <div className="flex-1 min-w-0">
                  <span className="block text-[11px] font-medium">{item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Sección Inferior: Configuración, Soporte y Perfil */}
      <div className="space-y-4">
        {/* Configuración y Ayuda (Estilo exacto al Dashboard del ejemplo) */}
        <div className="space-y-0.5 border-t border-slate-100 pt-4">
          <button
            onClick={() => alert('Configuración del Sistema:\nEstás en la versión SaaS Premium 2026. Los ajustes de perfil están bloqueados por políticas de la base de datos.')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-colors text-[11px] font-medium cursor-pointer"
          >
            <Settings size={15} className="text-slate-400" />
            <span>Configuración</span>
          </button>

          <button
            onClick={() => alert('Soporte Técnico:\nPara ayuda con la conexión a SQL Server o credenciales de la bitácora, escribe a soporte@sige.edu.gt.')}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-colors text-[11px] font-medium cursor-pointer"
          >
            <HelpCircle size={15} className="text-slate-400" />
            <span>Ayuda</span>
          </button>
        </div>

        {/* Bloque de Perfil de Usuario con Avatar y Logout integrado (Fiel al Layout del ejemplo) */}
        {user && (
          <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50 border border-slate-100 p-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* Avatar circular premium con iniciales */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white font-bold text-xs shadow-sm">
                {user.nombre.substring(0, 2).toUpperCase()}
              </div>
              <div className="min-w-0">
                <span className="block text-[11px] font-bold text-slate-900 truncate leading-tight">
                  {user.nombre}
                </span>
                <span className="block text-[9px] text-slate-400 font-medium truncate leading-none mt-0.5">
                  {roleLabel(user.idRol)}
                </span>
              </div>
            </div>

            {/* Botón de Logout minimalista en la tarjeta de perfil */}
            <button
              onClick={logout}
              title="Cerrar sesión"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
