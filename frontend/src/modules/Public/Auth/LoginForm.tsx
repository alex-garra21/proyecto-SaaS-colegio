import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { designTokens } from '../../../theme/designTokens';

interface LoginFormProps {
  onNavigateToRegister: () => void;
  onNavigateToRestricted: () => void;
}

export default function LoginForm({ onNavigateToRegister, onNavigateToRestricted }: LoginFormProps) {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!correo.trim() || !password) {
      setError('Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(correo.trim(), password);
    } catch (err: any) {
      console.error('Error de login:', err);
      const errMsg = err?.message || '';
      if (errMsg.includes('ACCOUNT_DEACTIVATED') || errMsg.includes('403')) {
        onNavigateToRestricted();
      } else {
        setError(errMsg || 'Error de conexión. Inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Iniciar sesión en tu cuenta
      </h3>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium">Error de autenticación</p>
            <p className="mt-0.5 text-red-600/90 dark:text-red-400/90">{error}</p>
          </div>
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-2`}>
            Correo Electrónico
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Mail size={18} strokeWidth={1.8} />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="ejemplo@colegio.edu"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-3.5 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 dark:focus:border-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400`}>
              Contraseña
            </label>
          </div>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
              <Lock size={18} strokeWidth={1.8} />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'password' : 'text'}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-3.5 pl-11 pr-11 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 dark:focus:border-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <Eye size={18} strokeWidth={1.8} />
              ) : (
                <EyeOff size={18} strokeWidth={1.8} />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`relative flex w-full justify-center items-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 ${designTokens.transitions.default} hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:opacity-75 disabled:pointer-events-none mt-4 cursor-pointer`}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white/80" />
              <span>Validando credenciales...</span>
            </>
          ) : (
            <span>Ingresar al Sistema</span>
          )}
        </button>
      </form>

      {/* Enlace para ir al auto-registro */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onNavigateToRegister}
          className="text-xs font-semibold text-slate-500 hover:text-slate-950 hover:underline dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-all"
        >
          ¿Eres nuevo alumno? Regístrate aquí
        </button>
      </div>

      {/* Nota informativa institucional de otros roles */}
      <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-5">
        <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-105 dark:border-slate-800/40 rounded-xl p-4 space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Registro para otros roles:
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
            Si eres personal administrativo, docente o padre de familia, puedes crear tu cuenta temporalmente como Alumno y solicitar en administración tu actualización de cuenta, o bien puedes pedir en administración que se te comparta un link de registro directo para tu rol.
          </p>
        </div>
      </div>
    </div>
  );
}
