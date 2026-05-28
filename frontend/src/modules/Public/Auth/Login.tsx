import { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { designTokens } from '../../../theme/designTokens';
import LoginForm from './LoginForm';
import RestrictedAccess from './RestrictedAccess';
import RegisterForm from './RegisterForm';

export default function Login() {
  const [currentView, setCurrentView] = useState<'login' | 'restricted' | 'register'>('login');

  return (
    <div className={`flex min-h-screen w-full items-center justify-center ${designTokens.colors.brand.bgApp} px-4 py-12 sm:px-6 lg:px-8`}>
      {/* Círculos decorativos premium de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/40 dark:bg-slate-800/10 blur-3xl"></div>
        <div className="absolute -bottom-[25%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-50/50 dark:bg-blue-950/10 blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-950/10 mb-4 transition-all duration-300 hover:scale-105">
            <GraduationCap size={30} strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            SIGE
          </h2>
          <p className={`mt-2 ${designTokens.typography.body}`}>
            Sistema Integral de Gestión Escolar
          </p>
        </div>

        <div className={`${designTokens.glassmorphism.premium} px-8 py-10 rounded-2xl`}>
          {currentView === 'login' && (
            <LoginForm 
              onNavigateToRegister={() => setCurrentView('register')} 
              onNavigateToRestricted={() => setCurrentView('restricted')} 
            />
          )}

          {currentView === 'restricted' && (
            <RestrictedAccess 
              onNavigateToLogin={() => setCurrentView('login')} 
            />
          )}

          {currentView === 'register' && (
            <RegisterForm 
              onNavigateToLogin={() => setCurrentView('login')} 
            />
          )}
        </div>
      </div>
    </div>
  );
}
