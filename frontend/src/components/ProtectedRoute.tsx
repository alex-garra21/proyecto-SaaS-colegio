import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

type ProtectedRouteProps = {
  allowedRoles?: number[];
  children: React.ReactNode;
  onFallbackNavigate?: () => void;
};

export default function ProtectedRoute({
  allowedRoles,
  children,
  onFallbackNavigate,
}: ProtectedRouteProps) {
  const { token, user } = useAuth();

  // Si no hay sesión iniciada, retornamos nulo o un indicador simple (App.tsx manejará redirigir al Login)
  if (!token) {
    return null;
  }

  // Si el usuario está cargando
  if (!user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-600">Cargando perfil de usuario...</p>
        </div>
      </div>
    );
  }

  // Verificar si el rol actual está permitido
  if (allowedRoles && !allowedRoles.includes(user.idRol)) {
    // Retornamos una pantalla de "Acceso Denegado" espectacular e interactiva
    return (
      <div className="flex min-height-[80vh] w-full flex-col items-center justify-center p-8 text-center">
        <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-50 text-red-600 shadow-sm transition-all duration-300 hover:scale-105">
          <ShieldAlert size={48} strokeWidth={1.5} className="animate-pulse" />
          <div className="absolute -inset-1 rounded-full border border-red-100 opacity-75"></div>
        </div>

        <h1 className="mb-2 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Acceso Denegado
        </h1>
        
        <p className="mx-auto mb-8 max-w-md text-slate-600 leading-relaxed">
          Lo sentimos, tu cuenta con el rol de <span className="font-semibold text-slate-900">
            {roleName(user.idRol)}
          </span> no dispone de privilegios autorizados para ingresar a este módulo administrativo.
        </p>

        {onFallbackNavigate && (
          <button
            onClick={onFallbackNavigate}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-slate-950/20"
          >
            <ArrowLeft size={16} />
            Regresar al Inicio Seguro
          </button>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

function roleName(idRol: number): string {
  switch (idRol) {
    case 1:
      return 'Administrador';
    case 2:
      return 'Personal Académico';
    case 3:
      return 'Docente / Profesor';
    case 4:
      return 'Alumno';
    case 5:
      return 'Padre de Familia';
    default:
      return 'Usuario';
  }
}
