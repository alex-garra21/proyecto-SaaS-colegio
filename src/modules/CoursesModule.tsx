import React from 'react';
import { Search, Plus, Book, MoreHorizontal, Users } from 'lucide-react';

const CoursesModule = () => {
  const grades = [
    {
      id: 1,
      name: '1ro Básico',
      level: 'Educación Media',
      studentsCount: 35,
      courses: [
        { name: 'Matemáticas I', teacher: 'Laura Mendoza' },
        { name: 'Idioma Español', teacher: 'María Cifuentes' },
        { name: 'Ciencias Naturales', teacher: 'Carlos Fuentes' }
      ]
    },
    {
      id: 2,
      name: '2do Básico',
      level: 'Educación Media',
      studentsCount: 32,
      courses: [
        { name: 'Matemáticas II', teacher: 'Laura Mendoza' },
        { name: 'Idioma Español', teacher: 'María Cifuentes' },
        { name: 'Estudios Sociales', teacher: 'Por asignar' }
      ]
    },
    {
      id: 3,
      name: '5to Primaria',
      level: 'Educación Primaria',
      studentsCount: 28,
      courses: [
        { name: 'Ciencias Naturales', teacher: 'Carlos Fuentes' },
        { name: 'Educación Física', teacher: 'Jorge Pérez' }
      ]
    }
  ];

  return (
    <div className="module-container">
      <header className="module-header">
        <div>
          <h1>Gestión de Cursos y Grados</h1>
          <p className="subtitle">Configura la estructura académica de la institución.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">Crear Curso</button>
          <button className="btn btn-primary">
            <Plus size={20} />
            Nuevo Grado
          </button>
        </div>
      </header>

      <div className="grades-list">
        {grades.map((grade) => (
          <div key={grade.id} className="grade-card card">
            <div className="grade-header">
              <div className="grade-title">
                <h2>{grade.name}</h2>
                <span className="level-badge">{grade.level}</span>
              </div>
              <div className="grade-stats">
                <div className="stat">
                  <Users size={16} />
                  <span>{grade.studentsCount} alumnos</span>
                </div>
                <button className="btn-icon"><MoreHorizontal size={20} /></button>
              </div>
            </div>
            
            <div className="courses-container">
              <h4>Cursos Asignados ({grade.courses.length})</h4>
              <div className="courses-grid">
                {grade.courses.map((course, idx) => (
                  <div key={idx} className="course-item">
                    <div className="course-icon">
                      <Book size={18} />
                    </div>
                    <div className="course-details">
                      <p className="course-name">{course.name}</p>
                      <p className="course-teacher">{course.teacher}</p>
                    </div>
                  </div>
                ))}
                <button className="add-course-btn">
                  <Plus size={16} />
                  Añadir Curso
                </button>
              </div>
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

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .grades-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .grade-card {
          padding: 1.5rem;
        }

        .grade-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .grade-title h2 {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }

        .level-badge {
          background: rgba(58, 134, 255, 0.1);
          color: var(--secondary-color);
          padding: 0.25rem 0.75rem;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
          font-weight: 600;
        }

        .grade-stats {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-weight: 500;
          background: #f1f3f5;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
        }

        .btn-icon {
          background: none;
          color: var(--text-secondary);
          padding: 0.5rem;
          border-radius: var(--radius-sm);
        }

        .btn-icon:hover {
          background: #f1f3f5;
        }

        .courses-container h4 {
          color: var(--text-secondary);
          margin-bottom: 1rem;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .courses-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 1rem;
        }

        .course-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          background: #f8f9fa;
        }

        .course-icon {
          width: 40px;
          height: 40px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          box-shadow: var(--shadow-sm);
        }

        .course-name {
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 0.125rem;
        }

        .course-teacher {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .add-course-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          background: none;
          color: var(--secondary-color);
          font-weight: 600;
          transition: all 0.2s;
        }

        .add-course-btn:hover {
          background: rgba(58, 134, 255, 0.05);
          border-color: var(--secondary-color);
        }
      `}} />
    </div>
  );
};

export default CoursesModule;
