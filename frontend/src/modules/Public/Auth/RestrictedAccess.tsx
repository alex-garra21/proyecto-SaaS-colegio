import { ShieldAlert } from 'lucide-react';
import { designTokens } from '../../../theme/designTokens';

interface RestrictedAccessProps {
  onNavigateToLogin: () => void;
}

export default function RestrictedAccess({ onNavigateToLogin }: RestrictedAccessProps) {
  return (
    <div className="flex flex-col items-center text-center py-2 animate-in fade-in zoom-in-95 duration-350">
      {/* Icono de alerta llamativo */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mb-6 shadow-md shadow-amber-500/10">
        <ShieldAlert size={36} strokeWidth={1.5} className="animate-pulse" />
      </div>
      
      {/* Título */}
      <h3 className={`${designTokens.typography.h3} text-slate-900 dark:text-slate-100 font-extrabold mb-4 text-xl`}>
        Acceso Restringido
      </h3>
      
      {/* Mensaje detallado */}
      <p className={`${designTokens.typography.body} text-sm mb-8 px-1 text-slate-600 dark:text-slate-400`}>
        Tu cuenta se encuentra actualmente desactivada en la plataforma. Por favor, comunícate con la administración del centro educativo para verificar el estado de tu matrícula o restablecer tus credenciales de acceso.
      </p>
      
      {/* Botón principal */}
      <button
        type="button"
        onClick={onNavigateToLogin}
        className={`relative flex w-full justify-center items-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 ${designTokens.transitions.default} hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer`}
      >
        Volver a iniciar sesión
      </button>
    </div>
  );
}
