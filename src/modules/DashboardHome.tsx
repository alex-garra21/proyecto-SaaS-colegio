import React from 'react';
import { Users, GraduationCap, BookOpen, CreditCard, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const DashboardHome = () => {
  const stats = [
    { label: 'Total Estudiantes', value: '450', icon: <Users size={24} />, trend: '+12%', trendUp: true },
    { label: 'Docentes Activos', value: '32', icon: <GraduationCap size={24} />, trend: '+2%', trendUp: true },
    { label: 'Cursos Abiertos', value: '18', icon: <BookOpen size={24} />, trend: '0%', trendUp: true },
    { label: 'Ingresos Mensuales', value: '$12,450', icon: <CreditCard size={24} />, trend: '-5%', trendUp: false },
  ];

  return (
    <div className="dashboard-container">
      <header className="module-header">
        <div>
          <h1>Panel de Control</h1>
          <p className="subtitle">Bienvenido al sistema de gestión EduNexus.</p>
        </div>
      </header>

      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card card">
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <span className={`stat-trend ${stat.trendUp ? 'up' : 'down'}`}>
                {stat.trendUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                {stat.trend}
              </span>
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{stat.value}</h3>
              <p className="stat-label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <h3>Actividad Reciente</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div>
                <p><strong>Ana García</strong> se ha registrado en 3ro Primaria</p>
                <span>Hace 2 horas</span>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot"></div>
              <div>
                <p>Pago recibido de <strong>Roberto Méndez</strong></p>
                <span>Hace 5 horas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          background: rgba(58, 134, 255, 0.1);
          color: var(--secondary-color);
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
        }

        .stat-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .stat-trend.up { color: var(--success-color); }
        .stat-trend.down { color: var(--error-color); }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-color);
        }

        .stat-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .activity-list {
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .activity-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--secondary-color);
          margin-top: 6px;
        }

        .activity-item p {
          font-size: 0.9375rem;
        }

        .activity-item span {
          font-size: 0.75rem;
          color: var(--text-secondary);
        }
      `}} />
    </div>
  );
};

export default DashboardHome;
