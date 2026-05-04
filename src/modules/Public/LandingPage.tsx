import React from 'react';
import { School, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <nav className="public-nav">
        <div className="brand">
          <School size={28} color="var(--secondary-color)" />
          <span>Academia Moderna</span>
        </div>
        <div className="nav-links">
          <a href="#features">Características</a>
          <a href="#about">Nosotros</a>
          <Link to="/login" className="btn btn-outline" style={{ marginLeft: '1rem' }}>Iniciar Sesión</Link>
          <Link to="/login" className="btn btn-primary">Portal EduNexus</Link>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1>Transformando la Gestión Escolar hacia el Futuro</h1>
          <p>La plataforma integral que conecta a estudiantes, docentes y padres de familia en un solo ecosistema digital eficiente y seguro.</p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.125rem' }}>
              Acceder al Portal
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="mockup-window">
             <div className="mockup-header">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
             </div>
             <div className="mockup-body">
                <div className="mockup-skeleton"></div>
                <div className="mockup-skeleton line"></div>
                <div className="mockup-skeleton line short"></div>
             </div>
          </div>
        </div>
      </header>

      <section id="features" className="features-section">
        <h2 className="section-title">Todo lo que tu institución necesita</h2>
        <div className="features-grid">
          {[
            'Control de Asistencia Biométrico', 
            'Gestión Financiera y Pagos', 
            'Directorio Docente Automatizado',
            'Portal de Notas para Padres',
            'Módulo de Cursos Integrado',
            'Reportes Predictivos con IA'
          ].map((feature, i) => (
             <div key={i} className="feature-item">
               <CheckCircle color="var(--secondary-color)" size={24} />
               <span>{feature}</span>
             </div>
          ))}
        </div>
      </section>

      <style dangerouslySetInnerHTML={{ __html: `
        .landing-container {
          background: var(--bg-color);
          min-height: 100vh;
        }

        .public-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 5%;
          background: white;
          border-bottom: 1px solid var(--border-color);
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .nav-links a:not(.btn) {
          color: var(--text-secondary);
          font-weight: 500;
          transition: color 0.2s;
        }

        .nav-links a:not(.btn):hover {
          color: var(--primary-color);
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6rem 5%;
          gap: 4rem;
          background: linear-gradient(180deg, white 0%, #f1f3f5 100%);
        }

        .hero-content {
          flex: 1;
          max-width: 600px;
        }

        .hero-content h1 {
          font-size: 3.5rem;
          line-height: 1.1;
          color: var(--primary-color);
          margin-bottom: 1.5rem;
          letter-spacing: -1px;
        }

        .hero-content p {
          font-size: 1.25rem;
          color: var(--text-secondary);
          margin-bottom: 2.5rem;
          line-height: 1.6;
        }

        .hero-visual {
          flex: 1;
          display: flex;
          justify-content: center;
        }

        .mockup-window {
          background: white;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-width: 500px;
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .mockup-header {
          background: #f8f9fa;
          padding: 1rem;
          display: flex;
          gap: 0.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .dot {
          width: 12px; height: 12px; border-radius: 50%;
          background: #e2e8f0;
        }
        .dot:nth-child(1) { background: #fc8181; }
        .dot:nth-child(2) { background: #f6ad55; }
        .dot:nth-child(3) { background: #68d391; }

        .mockup-body {
          padding: 2rem;
        }

        .mockup-skeleton {
          background: #edf2f7;
          height: 150px;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .mockup-skeleton.line {
          height: 24px;
        }

        .mockup-skeleton.short {
          width: 60%;
        }

        .features-section {
          padding: 6rem 5%;
          background: white;
        }

        .section-title {
          text-align: center;
          font-size: 2.5rem;
          color: var(--primary-color);
          margin-bottom: 3rem;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--bg-color);
          border-radius: var(--radius-md);
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }
      `}} />
    </div>
  );
};

export default LandingPage;
