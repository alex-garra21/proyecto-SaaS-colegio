import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import {
  X,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  Key,
  Settings
} from 'lucide-react';
import { designTokens } from '../theme/designTokens';

interface ConfigurationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConfigurationModal({ isOpen, onClose }: ConfigurationModalProps) {
  const { user, token, updateUser } = useAuth();
  const { showToast } = useToast();

  // Gestión de Pestañas: 'datos' o 'password'
  const [activeTab, setActiveTab] = useState<'datos' | 'password'>('datos');

  // Estado - Pestaña 1: Actualizar Datos
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');

  // Estado - Pestaña 2: Actualizar Contraseña
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Estados de visibilidad de contraseñas de forma individual
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Estados comunes de carga y error
  const [isLoading, setIsLoading] = useState(false);

  // Inicializar nombres y apellidos al abrir o al cambiar de usuario
  useEffect(() => {
    if (isOpen && user?.nombre) {
      const parts = user.nombre.trim().split(/\s+/);
      let defaultNombres = '';
      let defaultApellidos = '';
      if (parts.length > 0) {
        if (parts.length === 1) {
          defaultNombres = parts[0];
        } else if (parts.length === 2) {
          defaultNombres = parts[0];
          defaultApellidos = parts[1];
        } else {
          // Si tiene más de 2 partes (ej: Juan Carlos Reyes Riveiro), dividimos por la mitad
          const half = Math.ceil(parts.length / 2);
          defaultNombres = parts.slice(0, half).join(' ');
          defaultApellidos = parts.slice(half).join(' ');
        }
      }
      setNombres(defaultNombres);
      setApellidos(defaultApellidos);
    }

    // Resetear pestaña de contraseñas cuando se cierra/abre
    if (!isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowCurrent(false);
      setShowNew(false);
      setShowConfirm(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';

  // Guardar Cambios de Perfil (Datos)
  const handleSaveData = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombres.trim() || !apellidos.trim()) {
      showToast('Los campos de Nombres y Apellidos son requeridos.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/perfil/datos`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombres: nombres.trim(),
          apellidos: apellidos.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al actualizar el perfil.');
      }

      // Actualizar el estado de sesión global
      updateUser({ nombre: data.nombreCompleto });
      
      showToast('¡Datos de perfil actualizados con éxito!', 'success');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Ocurrió un error al actualizar los datos.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cambiar Contraseña
  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast('Todos los campos de contraseña son requeridos.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('La nueva contraseña y su confirmación no coinciden.', 'error');
      return;
    }

    if (newPassword.length < 6) {
      showToast('La nueva contraseña debe tener al menos 6 caracteres.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${apiBaseUrl}/api/perfil/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña.');
      }

      showToast('¡Contraseña actualizada de manera segura!', 'success');
      
      // Limpiar inputs
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Error de contraseña actual incorrecta.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Lógica reactiva para el color de los bordes e inputs en la confirmación de la contraseña
  const tieneContenido = confirmPassword.length > 0;
  const sonIdenticas = newPassword === confirmPassword;

  const getPasswordInputClass = () => {
    const base = "w-full rounded-xl border py-2 pl-9 pr-10 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:outline-none transition-all disabled:opacity-60";
    if (tieneContenido) {
      if (sonIdenticas) {
        return `${base} border-green-500 focus:ring-green-500 bg-green-50/10 focus:border-green-500`;
      } else {
        return `${base} border-red-500 focus:ring-red-500 bg-red-50/10 focus:border-red-500`;
      }
    }
    return `${base} border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 focus:border-slate-900 dark:focus:border-slate-100 focus:ring-slate-900/5`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all duration-300 select-none animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>

      {/* Modal Card */}
      <div className={`relative w-full max-w-md rounded-2xl overflow-hidden transform transition-all duration-300 animate-in zoom-in-95 duration-200 ${designTokens.glassmorphism.premium}`}>
        {/* Header del Modal */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 px-6 py-4.5 bg-slate-50/50 dark:bg-slate-900/30">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-slate-950 dark:bg-slate-800 text-white shadow-sm">
              <Settings size={15} className="animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-slate-100">
                Configuración de Cuenta
              </h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                Gestiona tus datos personales y credenciales de acceso
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-800 dark:text-slate-500 dark:hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer"
            title="Cerrar modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Selector de Pestañas Premium */}
        <div className="flex border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/30 dark:bg-slate-900/10 px-6 pt-2">
          <button
            onClick={() => setActiveTab('datos')}
            className={`flex-1 pb-2.5 pt-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'datos'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            Actualizar datos
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 pb-2.5 pt-2 text-center text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'password'
                ? 'border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'
            }`}
          >
            Actualizar contraseña
          </button>
        </div>

        {/* Contenido del Formulario */}
        <div className="p-6">
          {activeTab === 'datos' ? (
            <form onSubmit={handleSaveData} className="space-y-4 animate-in fade-in duration-200">
              {/* Nombres */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Nombres
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 flex items-center text-slate-400 dark:text-slate-500">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="Ej. Alexander"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-slate-900 dark:focus:border-slate-100 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Apellidos */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Apellidos
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 flex items-center text-slate-400 dark:text-slate-500">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="Ej. Reyes"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 py-2 pl-9 pr-4 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-slate-900 dark:focus:border-slate-100 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !nombres.trim() || !apellidos.trim()}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950"></div>
                  ) : (
                    <Save size={13} />
                  )}
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSavePassword} className="space-y-4 animate-in fade-in duration-200">
              {/* Contraseña Actual */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Contraseña Actual
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 flex items-center text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 py-2 pl-9 pr-10 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:border-slate-900 dark:focus:border-slate-100 focus:ring-2 focus:ring-slate-900/5 focus:outline-none transition-all disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    disabled={isLoading}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                    title={showCurrent ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Nueva Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 flex items-center text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showNew ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={getPasswordInputClass()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    disabled={isLoading}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                    title={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Confirmar Nueva Contraseña */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 flex items-center text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading}
                    className={getPasswordInputClass()}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isLoading}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 cursor-pointer"
                    title={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-800 dark:hover:text-slate-200 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={
                    isLoading || 
                    !currentPassword || 
                    !tieneContenido || 
                    !sonIdenticas
                  }
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-semibold bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isLoading ? (
                    <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-slate-950/30 dark:border-t-slate-950"></div>
                  ) : (
                    <Key size={13} />
                  )}
                  <span>Cambiar Contraseña</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
