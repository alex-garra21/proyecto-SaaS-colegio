import React from 'react';
import { Search, Plus, Filter, MoreVertical, Mail, Phone } from 'lucide-react';

const TeachersModule = () => {
  const teachers = [
    { id: 'DOC-01', name: 'Laura Mendoza', specialty: 'Matemáticas', grades: '1ro - 3ro Básico', email: 'lmendoza@edunexus.edu', phone: '+502 5555-0101', status: 'Activo' },
    { id: 'DOC-02', name: 'Carlos Fuentes', specialty: 'Ciencias Naturales', grades: '4to - 6to Primaria', email: 'cfuentes@edunexus.edu', phone: '+502 5555-0102', status: 'Activo' },
    { id: 'DOC-03', name: 'María Cifuentes', specialty: 'Literatura', grades: '1ro - 3ro Básico', email: 'mcifuentes@edunexus.edu', phone: '+502 5555-0103', status: 'Inactivo' },
    { id: 'DOC-04', name: 'Jorge Pérez', specialty: 'Educación Física', grades: 'Todos los grados', email: 'jperez@edunexus.edu', phone: '+502 5555-0104', status: 'Activo' },
  ];

  return (
    <div className="module-container">
      <header className="module-header">
        <div>
          <h1>Directorio de Docentes</h1>
          <p className="subtitle">Gestiona el personal académico y sus asignaciones.</p>
        </div>
        <button className="btn btn-primary">
          <Plus size={20} />
          Agregar Docente
        </button>
      </header>

      <div className="filters-bar card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nombre o especialidad..." />
        </div>
        <div className="filter-group">
          <select className="filter-select">
            <option value="">Especialidad</option>
            <option value="matematicas">Matemáticas</option>
            <option value="ciencias">Ciencias</option>
          </select>
          <button className="btn btn-outline">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      <div className="teachers-grid">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="teacher-card card">
            <div className="teacher-header">
              <div className="teacher-avatar">
                {teacher.name.charAt(0)}
              </div>
              <div className="teacher-actions">
                <span className={`status-dot ${teacher.status.toLowerCase()}`}></span>
                <button className="btn-icon"><MoreVertical size={18} /></button>
              </div>
            </div>
            
            <div className="teacher-info">
              <h3>{teacher.name}</h3>
              <p className="specialty">{teacher.specialty}</p>
              
              <div className="info-badges">
                <span className="badge">ID: {teacher.id}</span>
                <span className="badge">{teacher.grades}</span>
              </div>
            </div>

            <div className="teacher-contact">
              <div className="contact-item">
                <Mail size={16} />
                <span>{teacher.email}</span>
              </div>
              <div className="contact-item">
                <Phone size={16} />
                <span>{teacher.phone}</span>
              </div>
            </div>
            
            <div className="teacher-footer">
              <button className="btn btn-outline full-width">Ver Perfil Completo</button>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .module-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .module-header h1 {
          font-size: 1.75rem;
          color: var(--primary-color);
          margin-bottom: 0.25rem;
        }

        .subtitle {
          color: var(--text-secondary);
        }

        .filters-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f1f3f5;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          width: 350px;
        }

        .search-box input {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          font-family: inherit;
        }

        .filter-group {
          display: flex;
          gap: 1rem;
        }

        .filter-select {
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          outline: none;
        }

        .teachers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .teacher-card {
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
        }

        .teacher-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .teacher-avatar {
          width: 56px;
          height: 56px;
          background: var(--primary-color);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .teacher-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }

        .status-dot.activo { background: var(--success-color); }
        .status-dot.inactivo { background: var(--error-color); }

        .btn-icon {
          background: none;
          color: var(--text-secondary);
          padding: 0.25rem;
        }

        .btn-icon:hover {
          color: var(--primary-color);
        }

        .teacher-info {
          margin-bottom: 1.5rem;
        }

        .teacher-info h3 {
          font-size: 1.25rem;
          color: var(--text-primary);
          margin-bottom: 0.25rem;
        }

        .specialty {
          color: var(--secondary-color);
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .info-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .badge {
          background: #f1f3f5;
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm);
          font-size: 0.75rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .teacher-contact {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          border-top: 1px solid var(--border-color);
          padding-top: 1.25rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .teacher-footer {
          margin-top: auto;
        }

        .full-width {
          width: 100%;
        }
      `}} />
    </div>
  );
};

export default TeachersModule;
