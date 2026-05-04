import React, { useState } from 'react';
import { School, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulando inicio de sesión guardando en localStorage
    if (email && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify({ email, role: 'admin' }));
      // Inicializar datos de prueba si no existen
      if (!localStorage.getItem('students_data')) {
        localStorage.setItem('students_data', JSON.stringify([
          { id: 'AL-001', name: 'Ana García', grade: '3ro Primaria', parent: 'Carlos García', status: 'Activo' },
          { id: 'AL-002', name: 'Roberto Méndez', grade: '5to Primaria', parent: 'Elena Méndez', status: 'Activo' }
        ]));
      }
      // Forzar redirección y recarga de estado (o manejar con AuthContext)
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-container">
            <School size={36} color="var(--secondary-color)" />
          </div>
          <h2>Bienvenido de nuevo</h2>
          <p>Ingresa a tu cuenta de EduNexus para continuar.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Correo Electrónico</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="ejemplo@edunexus.edu" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Contraseña</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
          </div>

          <div className="login-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span>Recordarme</span>
            </label>
            <a href="#" className="forgot-password">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="btn btn-primary full-width">
            Iniciar Sesión
          </button>
        </form>
        
        <div className="login-footer">
          <p>¿No tienes una cuenta? <a href="#">Contacta a soporte</a></p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, var(--primary-color) 0%, #2b3a55 100%);
          padding: 2rem;
        }

        .login-card {
          background: white;
          padding: 3rem;
          border-radius: var(--radius-lg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 440px;
        }

        .login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .logo-container {
          background: rgba(58, 134, 255, 0.1);
          width: 72px;
          height: 72px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .login-header h2 {
          color: var(--primary-color);
          font-size: 1.75rem;
          margin-bottom: 0.5rem;
        }

        .login-header p {
          color: var(--text-secondary);
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .input-group label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: var(--text-secondary);
        }

        .input-with-icon input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-family: inherit;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .input-with-icon input:focus {
          outline: none;
          border-color: var(--secondary-color);
          box-shadow: 0 0 0 3px rgba(58, 134, 255, 0.1);
        }

        .login-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
        }

        .checkbox-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .forgot-password {
          color: var(--secondary-color);
          font-weight: 500;
        }

        .login-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.875rem;
          color: var(--text-secondary);
          border-top: 1px solid var(--border-color);
          padding-top: 1.5rem;
        }

        .login-footer a {
          color: var(--secondary-color);
          font-weight: 500;
        }
      `}} />
    </div>
  );
};

export default Login;
