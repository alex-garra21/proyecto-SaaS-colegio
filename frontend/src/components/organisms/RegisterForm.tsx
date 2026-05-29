import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react';
import { designTokens } from '../../theme/designTokens';

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

  // Generación Automática Debounced (500ms) del Correo Institucional
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

        // Consumir API pública de colisiones del backend
        const res = await fetch(`http://localhost:4000/api/usuarios/generar-correo?${queryParams.toString()}`);

        if (res.ok) {
          const data = await res.json();
          if (data && data.correoGenerado) {
            setCorreo(data.correoGenerado);
          }
        } else {
          console.error('Error al solicitar generación automática de correo:', res.statusText);
        }
      } catch (err) {
        console.error('Error en red para generación de correo:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [nombres, apellidos]);

  // Validación Cromática Simétrica
  const getPasswordInputClass = () => {
    const baseClass = `block w-full rounded-[4px] border py-2.5 pl-10 pr-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[14px] transition-all duration-200 focus:outline-none disabled:opacity-60 ${designTokens.transitions.fast}`;
    
    // Si alguno está vacío, mostrar estilo neutro/base
    if (!password || !confirmPassword) {
      return `${baseClass} border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500`;
    }
    
    // Si no coinciden
    if (password !== confirmPassword) {
      return `${baseClass} border-[#ba1a1a] bg-[#ba1a1a]/10 dark:bg-[#ba1a1a]/5 focus:border-[#ba1a1a] focus:ring-1 focus:ring-[#ba1a1a]`;
    }
    
    // Si coinciden
    return `${baseClass} border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/15 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombres.trim() || !apellidos.trim() || !correo.trim() || !password || !confirmPassword) {
      setError('Por favor, completa todos los campos del formulario.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas ingresadas no coinciden. Revisa los campos de seguridad.');
      return;
    }

    if (password.length < 6) {
      setError('Por motivos de seguridad escolar, la contraseña debe contener al menos 6 caracteres.');
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
        throw new Error(data?.message || 'Fallo al procesar el registro en el servidor escolar.');
      }

      setSuccess('Tu cuenta de alumno ha sido creada exitosamente. El área de administración registrará tus materias asignadas.');
      setNombres('');
      setApellidos('');
      setCorreo('');
      setPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      console.error('Error de registro:', err);
      setError(err?.message || 'Error de conexión con el servidor. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${designTokens.transitions.default} animate-in fade-in duration-300`}>
      <div className={`w-full bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg shadow-sm p-8`}>
        
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm mb-3">
            <span className="text-lg font-bold">SIGE</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">
            Registro de Alumnos
          </h3>
          <p className={`text-xs mt-1 text-center ${designTokens.colors.brand.sigeSlateText}`}>
            Crea tu cuenta institucional del colegio
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-[4px] bg-red-50 dark:bg-red-950/30 p-4 text-[13px] text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold">Error al registrar cuenta</p>
              <p className="mt-0.5 text-red-600/90 dark:text-red-400/90">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="space-y-5 animate-in fade-in duration-300">
            <div className="flex items-start gap-3 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/30 p-4 text-[13px] text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40 animate-in slide-in-from-top-2 duration-200">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold">¡Registro Completado!</p>
                <p className="mt-0.5 text-emerald-600/90 dark:text-emerald-400/90">{success}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onNavigateToLogin}
              className={`flex w-full justify-center items-center gap-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-white px-4 py-3 text-[14px] font-bold shadow-md active:scale-[0.98] transition-all cursor-pointer`}
            >
              <span>Ir a Iniciar Sesión</span>
            </button>
          </div>
        )}

        {!success && (
          <form className="space-y-4 text-left" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Nombres
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)}
                    placeholder="ej. Juan Carlos"
                    className={`block w-full rounded-[4px] border ${designTokens.colors.brand.sigeSlateBorder} bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-9 pr-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[14px] transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                  Apellidos
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                    <User size={15} strokeWidth={1.8} />
                  </div>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={apellidos}
                    onChange={(e) => setApellidos(e.target.value)}
                    placeholder="ej. Pérez Gómez"
                    className={`block w-full rounded-[4px] border ${designTokens.colors.brand.sigeSlateBorder} bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-9 pr-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[14px] transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60`}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Correo Institucional (Lectura)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Mail size={16} strokeWidth={1.8} />
                </div>
                <input
                  type="email"
                  required
                  readOnly
                  value={correo}
                  placeholder="Se generará en base a nombres..."
                  className={`block w-full rounded-[4px] border ${designTokens.colors.brand.sigeSlateBorder} bg-slate-100 dark:bg-slate-900/60 py-2.5 pl-10 pr-4 text-slate-500 dark:text-slate-400 placeholder:text-slate-400 text-[14px] cursor-not-allowed select-none focus:outline-none`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={16} strokeWidth={1.8} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? (
                    <Eye size={16} strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock size={16} strokeWidth={1.8} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
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
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? (
                    <Eye size={16} strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={16} strokeWidth={1.8} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
              className={`flex w-full justify-center items-center gap-2 rounded-[4px] ${designTokens.colors.brand.sigeBlue} ${designTokens.colors.brand.sigeBlueHover} px-4 py-3 text-[14px] font-bold text-white shadow-sm disabled:opacity-50 disabled:pointer-events-none mt-6 cursor-pointer ${designTokens.transitions.default}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white/80" />
                  <span>Procesando registro...</span>
                </>
              ) : (
                <span>Registrarse</span>
              )}
            </button>
          </form>
        )}

        {/* Enlace para volver al login */}
        <div className="mt-5 text-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer transition-colors"
          >
            <ArrowLeft size={12} />
            <span>¿Ya tienes cuenta? Volver a Iniciar Sesión</span>
          </button>
        </div>

      </div>
    </div>
  );
}
