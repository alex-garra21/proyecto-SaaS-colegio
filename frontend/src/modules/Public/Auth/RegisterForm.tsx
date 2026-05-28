import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { designTokens } from '../../../theme/designTokens';

interface RegisterFormProps {
  onNavigateToLogin: () => void;
}

export default function RegisterForm({ onNavigateToLogin }: RegisterFormProps) {
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efecto con Debounce de 500ms para Generación Automática de Correo Institucional (Público)
  useEffect(() => {
    const nombresClean = nombres.trim();
    const apellidosClean = apellidos.trim();

    if (!nombresClean || !apellidosClean) {
      setCorreo('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const queryParams = new URLSearchParams({
          nombres: nombresClean,
          apellidos: apellidosClean
        });

        // Este endpoint es público a nivel API para soportar tanto auto-registro como creación manual
        const res = await fetch(`http://localhost:4000/api/usuarios/generar-correo?${queryParams.toString()}`);

        if (res.ok) {
          const data = await res.json();
          if (data && data.correoGenerado) {
            setCorreo(data.correoGenerado);
          }
        } else {
          console.error('Error al generar correo institucional:', res.statusText);
        }
      } catch (err) {
        console.error('Error de red al generar correo institucional:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nombres, apellidos]);

  const getPasswordInputClass = () => {
    const baseClass = "block w-full rounded-xl border py-3 pl-11 pr-11 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all duration-200 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60";
    
    if (confirmPassword.length === 0) {
      return `${baseClass} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:border-slate-900 dark:focus:border-slate-100`;
    }
    
    if (password === confirmPassword) {
      return `${baseClass} border-green-500 dark:border-green-600 bg-green-50/10 dark:bg-green-950/10 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20`;
    } else {
      return `${baseClass} border-red-500 dark:border-red-600 bg-red-50/10 dark:bg-red-950/10 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombres.trim() || !apellidos.trim() || !correo.trim() || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden.');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres por seguridad.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombres: nombres.trim(),
          apellidos: apellidos.trim(),
          correo: correo.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Fallo al procesar el auto-registro.');
      }

      setSuccess('¡Cuenta de Alumno creada con éxito! Ahora puedes iniciar sesión.');
      setNombres('');
      setApellidos('');
      setCorreo('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Error en el servidor al registrar la cuenta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in duration-300">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-6">
        Registro de Nuevo Alumno
      </h3>

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl bg-red-50 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-medium">Error al registrarse</p>
            <p className="mt-0.5 text-red-600/90 dark:text-red-400/90">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-4 text-sm text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 animate-in slide-in-from-top-2 duration-200">
            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <p className="font-medium">¡Registro Exitoso!</p>
              <p className="mt-0.5 text-emerald-600/90 dark:text-emerald-400/90">{success}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onNavigateToLogin}
            className={`relative flex w-full justify-center items-center gap-2 rounded-xl bg-slate-950 px-4 py-3.5 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 ${designTokens.transitions.default} hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none cursor-pointer`}
          >
            <span>Ir a Iniciar Sesión ahora &rarr;</span>
          </button>
        </div>
      )}

      {!success && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombres y Apellidos en dos columnas responsivas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-1.5`}>
                Nombres
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={nombres}
                  onChange={(e) => setNombres(e.target.value)}
                  placeholder="ej. Juan Carlos"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 dark:focus:border-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
                />
              </div>
            </div>

            <div>
              <label className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-1.5`}>
                Apellidos
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <User size={18} strokeWidth={1.8} />
                </div>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={apellidos}
                  onChange={(e) => setApellidos(e.target.value)}
                  placeholder="ej. Pérez Gómez"
                  className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 py-3 pl-11 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-sm transition-all duration-200 focus:border-slate-900 dark:focus:border-slate-100 focus:bg-white dark:focus:bg-slate-950 focus:outline-none focus:ring-4 focus:ring-slate-950/5 disabled:opacity-60"
                />
              </div>
            </div>
          </div>

          <div>
            <label className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-1.5`}>
              Correo Institucional
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={18} strokeWidth={1.8} />
              </div>
              <input
                type="email"
                required
                readOnly
                value={correo}
                placeholder="Se generará automáticamente..."
                className="block w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/60 py-3 pl-11 pr-4 text-slate-500 dark:text-slate-400 placeholder:text-slate-400 text-sm cursor-not-allowed opacity-80 focus:outline-none select-none"
              />
            </div>
          </div>

          <div>
            <label className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-1.5`}>
              Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={18} strokeWidth={1.8} />
              </div>
              <input
                type={showPassword ? 'password' : 'text'}
                required
                disabled={isLoading}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={getPasswordInputClass()}
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

          <div>
            <label className={`block ${designTokens.typography.label} text-slate-500 dark:text-slate-400 mb-1.5`}>
              Confirmar Contraseña
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={18} strokeWidth={1.8} />
              </div>
              <input
                type={showConfirmPassword ? 'password' : 'text'}
                required
                disabled={isLoading}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={getPasswordInputClass()}
              />
              <button
                type="button"
                disabled={isLoading}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
              >
                {showConfirmPassword ? (
                  <Eye size={18} strokeWidth={1.8} />
                ) : (
                  <EyeOff size={18} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
            className={`relative flex w-full justify-center items-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-950/10 ${designTokens.transitions.default} hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md focus:outline-none mt-4 cursor-pointer`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white/80" />
                <span>Registrando cuenta...</span>
              </>
            ) : (
              <span>Crear Cuenta</span>
            )}
          </button>
        </form>
      )}

      {/* Enlace para volver al login */}
      <div className="mt-5 text-center">
        <button
          type="button"
          onClick={onNavigateToLogin}
          className="text-xs font-semibold text-slate-500 hover:text-slate-950 hover:underline dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-all"
        >
          ¿Ya tienes cuenta? Volver al Login
        </button>
      </div>
    </div>
  );
}
