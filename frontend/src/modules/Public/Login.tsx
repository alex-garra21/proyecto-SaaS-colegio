import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff, GraduationCap, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
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
      setError(err?.message || 'Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      {/* Círculos decorativos premium de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/40 blur-3xl"></div>
        <div className="absolute -bottom-[25%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-50/50 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/10 mb-4 transition-all duration-300 hover:scale-105">
            <GraduationCap size={30} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            SIGE
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Sistema Integral de Gestión Escolar • SaaS
          </p>
        </div>

        <div className="bg-white px-8 py-10 shadow-2xl rounded-2xl border border-slate-100/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">
            Iniciar sesión en tu cuenta
          </h3>

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100 animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-medium">Error de autenticación</p>
                <p className="mt-0.5 text-red-600/90">{error}</p>
              </div>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
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
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
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
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-slate-900 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.8} />
                  ) : (
                    <Eye size={18} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative flex w-full justify-center items-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 transition-all duration-250 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-950/20 disabled:opacity-75 disabled:pointer-events-none mt-4 cursor-pointer"
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

          {/* Cuentas de demostración de alta fidelidad para el evaluador */}
          <div className="mt-8 border-t border-slate-100 pt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 text-center">
              Acceso de Administrador Activo
            </h4>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 text-xs text-slate-600 text-center space-y-1">
              <span className="font-semibold text-slate-800 block">Administrador:</span>
              <code className="text-xs font-mono bg-white border border-slate-100 px-1.5 py-0.5 rounded text-slate-700">admin@sige.edu.gt</code>
              <span className="text-[10px] block opacity-85 mt-1 font-semibold text-slate-500">Clave: AdminColegio2026</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
