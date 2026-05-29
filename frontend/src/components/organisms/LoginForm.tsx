import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, HelpCircle, ShieldCheck, FileText, PhoneCall } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { designTokens } from '../../theme/designTokens';

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
      setError('Por favor, ingresa tu correo electrónico y tu contraseña de acceso.');
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      await login(correo.trim(), password);
    } catch (err: any) {
      console.error('Error al iniciar sesión:', err);
      const errMsg = err?.message || '';
      if (errMsg.includes('ACCOUNT_DEACTIVATED') || errMsg.includes('403')) {
        onNavigateToRestricted();
      } else {
        setError(errMsg || 'Error de comunicación con el servidor. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`w-full ${designTokens.transitions.default} animate-in fade-in duration-300`}>
      {/* Contenedor de la Tarjeta de Iniciar Sesión con 8px rounded y contorno de bajo contraste */}
      <div className={`w-full bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg shadow-sm p-8`}>
        <div className="flex flex-col items-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-950 text-white shadow-sm mb-3">
            <span className="text-lg font-bold">SIGE</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 text-center">
            ¡Hola de nuevo!
          </h3>
          <p className={`text-xs mt-1 text-center ${designTokens.colors.brand.sigeSlateText}`}>
            Accede a tu portal educativo personalizado
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-[4px] bg-red-50 dark:bg-red-950/30 p-4 text-[13px] text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/40 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-semibold">Error de autenticación</p>
              <p className="mt-0.5 text-red-600/90 dark:text-red-400/90">{error}</p>
            </div>
          </div>
        )}

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Mail size={16} strokeWidth={1.8} />
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
                placeholder="ejemplo@sige.edu.gt"
                className={`block w-full rounded-[4px] border ${designTokens.colors.brand.sigeSlateBorder} bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-10 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[14px] transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60`}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Contraseña
              </label>
              <button
                type="button"
                onClick={() => alert('Recuperación de Contraseña:\nPor políticas de seguridad del Sistema Integral de Gestión Escolar, debes solicitar el restablecimiento directo de tu contraseña con el departamento de TI o con el Administrador del plantel.')}
                className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <Lock size={16} strokeWidth={1.8} />
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
                className={`block w-full rounded-[4px] border ${designTokens.colors.brand.sigeSlateBorder} bg-slate-50 dark:bg-slate-950/50 py-2.5 pl-10 pr-10 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 text-[14px] transition-all duration-200 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60`}
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

          <button
            type="submit"
            disabled={isLoading}
            className={`flex w-full justify-center items-center gap-2 rounded-[4px] ${designTokens.colors.brand.sigeBlue} ${designTokens.colors.brand.sigeBlueHover} px-4 py-3 text-[14px] font-bold text-white shadow-sm disabled:opacity-75 disabled:pointer-events-none mt-6 cursor-pointer ${designTokens.transitions.default}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white/80" />
                <span>Validando credenciales...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>

        {/* Enlace al auto-registro */}
        <div className="mt-6 text-center border-t border-slate-100 dark:border-slate-800/80 pt-4">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            ¿No tienes una cuenta?{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer transition-all"
            >
              Regístrate gratis
            </button>
          </p>
        </div>

        {/* Nota informativa de otros roles en español */}
        <div className="mt-5">
          <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800/40 rounded-lg p-3 text-left">
            <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-350">
              Información de acceso para otros roles:
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
              Si perteneces al personal administrativo, docente o eres padre de familia, debes solicitar tus credenciales directamente en el área de secretaría o administración del colegio, donde te proveerán tus accesos de rol correspondientes.
            </p>
          </div>
        </div>
      </div>

      {/* Footer informativo con enlaces públicos alineados */}
      <footer className="mt-8 text-center text-[12px] text-slate-400 dark:text-slate-500 max-w-md mx-auto space-y-4">
        <div className="flex justify-center items-center gap-4 flex-wrap font-medium">
          <button
            type="button"
            onClick={() => alert('Centro de Ayuda SIGE:\nPor favor escribe un correo a soporte@sige.edu.gt o comunícate al PBX del colegio para dudas técnicas sobre el portal.')}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle size={12} />
            <span>Centro de Ayuda</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => alert('Políticas de Privacidad:\nEl Sistema Integral de Gestión Escolar resguarda y audita de forma estricta los datos escolares de los alumnos según la Ley de Acceso a la Información y políticas de protección de datos internas.')}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <ShieldCheck size={12} />
            <span>Privacidad</span>
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => alert('Términos del Servicio:\nEl uso de la plataforma es de carácter exclusivamente educativo e institucional. Queda prohibido compartir credenciales de seguridad.')}
            className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <FileText size={12} />
            <span>Términos</span>
          </button>
        </div>

        <div className="border-t border-slate-200/60 dark:border-slate-800/40 pt-4 flex flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => alert('Contacto de Secretaría:\nHorario: Lunes a Viernes, 7:00 AM a 5:00 PM\nTeléfono: +502 2300-4200 (PBX Ext. 101)\nCorreo: secretaria@sige.edu.gt')}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-850 dark:hover:text-slate-200 transition-colors flex items-center gap-1.5 font-semibold cursor-pointer border border-slate-200 dark:border-slate-800 rounded-[4px] px-3 py-1.5 bg-slate-50/50 hover:bg-slate-50"
          >
            <PhoneCall size={12} className="text-blue-500" />
            <span>Contacto de Secretaría</span>
          </button>
          <p className="mt-2 text-[10px] text-slate-400 select-none">
            &copy; 2026 Sistema Integral de Gestión Escolar. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
