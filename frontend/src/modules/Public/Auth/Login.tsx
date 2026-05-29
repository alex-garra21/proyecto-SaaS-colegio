import { useState } from 'react';
import { designTokens } from '../../../theme/designTokens';
import LoginForm from '../../../components/organisms/LoginForm';
import RegisterForm from '../../../components/organisms/RegisterForm';
import DeactivatedAccount from '../../../components/organisms/DeactivatedAccount';

export default function Login() {
  const [currentView, setCurrentView] = useState<'login' | 'deactivated' | 'register'>('login');

  return (
    <div className={`relative flex min-h-screen w-full items-center justify-center ${designTokens.colors.brand.bgApp} px-4 py-12 sm:px-6 lg:px-8 transition-all duration-300`}>
      {/* Círculos decorativos premium de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[20%] w-[60%] h-[60%] rounded-full bg-slate-200/40 dark:bg-slate-800/10 blur-3xl"></div>
        <div className="absolute -bottom-[25%] -right-[20%] w-[60%] h-[60%] rounded-full bg-blue-50/50 dark:bg-blue-950/10 blur-3xl"></div>
      </div>

      {/* Ancho dinámico del contenedor principal para adaptarse a las vistas (Bento Grid vs Formularios pequeños) */}
      <div className={`relative w-full ${currentView === 'deactivated' ? 'max-w-4xl' : 'max-w-md'} transition-all duration-500 ease-in-out`}>
        {currentView === 'login' && (
          <LoginForm 
            onNavigateToRegister={() => setCurrentView('register')} 
            onNavigateToRestricted={() => setCurrentView('deactivated')} 
          />
        )}

        {currentView === 'deactivated' && (
          <DeactivatedAccount 
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
  );
}
