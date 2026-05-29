import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  FileText,
  CheckSquare,
  BookOpen,
  Brain,
  Sparkles,
  LogOut,
  HelpCircle,
  Settings,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

type SidebarProps = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenConfig?: () => void;
};

export default function Sidebar({ activeTab, setActiveTab, onOpenConfig }: SidebarProps) {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

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
        },
        {
          id: 'usuarios',
          label: 'Gestión Usuarios',
          icon: GraduationCap,
          description: 'Control de Usuarios'
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
          id: 'aventura-kids',
          label: 'Aventura Kids',
          icon: Sparkles,
          description: 'Portal de Alumno'
        },
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
    <aside className={`relative flex h-screen shrink-0 flex-col justify-between border-r border-slate-100 bg-white select-none transition-all duration-300 ease-in-out ${
      isCollapsed ? 'w-20 p-3' : 'w-64 p-5'
    }`}>
      {/* Botón de Expansión/Contracción Premium */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-800 shadow-sm hover:shadow-md transition-all cursor-pointer z-20 focus:outline-none"
        title={isCollapsed ? 'Expandir menú' : 'Colapsar menú'}
      >
        {isCollapsed ? <ChevronRight size={13} strokeWidth={2.5} /> : <ChevronLeft size={13} strokeWidth={2.5} />}
      </button>

      {/* 1. Header Superior del Sistema */}
      <div className="space-y-6">
        <div className={`flex flex-col space-y-1.5 ${isCollapsed ? 'items-center px-0' : 'px-2'}`}>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white shadow-md">
              <GraduationCap size={18} strokeWidth={2} />
            </div>
            {!isCollapsed && (
              <h2 className="text-sm font-bold tracking-tight text-slate-900 leading-none animate-in fade-in duration-300">
                SIGE
              </h2>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 animate-in fade-in duration-300">
              Portal del Colegio
            </span>
          )}
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
                className={`flex items-center transition-all duration-150 cursor-pointer ${
                  isCollapsed 
                    ? 'justify-center p-2.5 rounded-xl w-12 h-12 mx-auto' 
                    : 'w-full gap-3 rounded-lg px-3 py-2.5 text-left'
                } ${
                  isActive
                    ? `bg-slate-50 text-slate-900 font-semibold shadow-sm ${!isCollapsed ? 'border-l-2 border-slate-900 pl-2.5' : ''}`
                    : 'text-slate-500 hover:bg-slate-50/50 hover:text-slate-800'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 2 : 1.8}
                  className={isActive ? 'text-slate-950 shrink-0' : 'text-slate-400 shrink-0'}
                />
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 animate-in fade-in duration-350">
                    <span className="block text-[11px] font-medium truncate">{item.label}</span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Sección Inferior: Configuración, Soporte y Perfil */}
      <div className="space-y-4">
        {/* Configuración y Ayuda */}
        <div className="space-y-0.5 border-t border-slate-100 pt-4">
          <button
            onClick={onOpenConfig || (() => alert('Configuración del Sistema:\nEstás en la versión SaaS Premium 2026. Los ajustes de perfil están bloqueados por políticas de la base de datos.'))}
            className={`flex items-center text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-colors text-[11px] font-medium cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5 rounded-xl w-12 h-10 mx-auto' : 'w-full gap-3 rounded-lg px-3 py-2'
            }`}
            title={isCollapsed ? 'Configuración' : undefined}
          >
            <Settings size={15} className="text-slate-400 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Configuración</span>}
          </button>

          <button
            onClick={() => alert('Soporte Técnico:\nPara ayuda con la conexión a SQL Server o credenciales de la bitácora, escribe a soporte@sige.edu.gt.')}
            className={`flex items-center text-slate-500 hover:bg-slate-50/50 hover:text-slate-800 transition-colors text-[11px] font-medium cursor-pointer ${
              isCollapsed ? 'justify-center p-2.5 rounded-xl w-12 h-10 mx-auto' : 'w-full gap-3 rounded-lg px-3 py-2'
            }`}
            title={isCollapsed ? 'Ayuda' : undefined}
          >
            <HelpCircle size={15} className="text-slate-400 shrink-0" />
            {!isCollapsed && <span className="animate-in fade-in duration-300">Ayuda</span>}
          </button>
        </div>

        {/* Bloque de Perfil de Usuario con Avatar y Logout integrado */}
        {user && (
          <div className={`flex border border-slate-100 transition-all duration-300 ${
            isCollapsed 
              ? 'flex-col items-center gap-3 p-2.5 rounded-xl bg-slate-50' 
              : 'items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5'
          }`}>
            {isCollapsed ? (
              <>
                {/* Avatar circular */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white font-bold text-xs shadow-sm" title={`${user.nombre} (${roleLabel(user.idRol)})`}>
                  {user.nombre.substring(0, 2).toUpperCase()}
                </div>
                
                {/* Botón de Logout */}
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Avatar circular premium con iniciales */}
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-white font-bold text-xs shadow-sm">
                    {user.nombre.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0 animate-in fade-in duration-300">
                    <span className="block text-[11px] font-bold text-slate-900 truncate leading-tight">
                      {user.nombre}
                    </span>
                    <span className="block text-[9px] text-slate-400 font-medium truncate leading-none mt-0.5">
                      {roleLabel(user.idRol)}
                    </span>
                  </div>
                </div>

                {/* Botón de Logout */}
                <button
                  onClick={logout}
                  title="Cerrar sesión"
                  className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
