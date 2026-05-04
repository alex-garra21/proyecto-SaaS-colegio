import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Eye, X } from 'lucide-react';

const StudentsModule = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', grade: '', parent: '' });

  useEffect(() => {
    const saved = localStorage.getItem('students_data');
    if (saved) {
      setStudents(JSON.parse(saved));
    } else {
      const initial = [
        { id: 'AL-001', name: 'Ana García', grade: '3ro Primaria', parent: 'Carlos García', status: 'Activo' },
        { id: 'AL-002', name: 'Roberto Méndez', grade: '5to Primaria', parent: 'Elena Méndez', status: 'Activo' }
      ];
      setStudents(initial);
      localStorage.setItem('students_data', JSON.stringify(initial));
    }
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `AL-00${students.length + 1}`;
    const student = { ...newStudent, id, status: 'Activo' };
    const updated = [...students, student];
    setStudents(updated);
    localStorage.setItem('students_data', JSON.stringify(updated));
    setShowModal(false);
    setNewStudent({ name: '', grade: '', parent: '' });
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div>
          <h1>Gestión de Estudiantes</h1>
          <p className="subtitle">Administra la información de los alumnos matriculados.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={20} />
          Registrar Estudiante
        </button>
      </header>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content card">
            <div className="modal-header">
              <h2>Registrar Estudiante</h2>
              <button className="btn-icon" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddStudent} className="modal-form">
              <input type="text" placeholder="Nombre completo" required value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} />
              <input type="text" placeholder="Grado" required value={newStudent.grade} onChange={e => setNewStudent({...newStudent, grade: e.target.value})} />
              <input type="text" placeholder="Nombre del Padre/Tutor" required value={newStudent.parent} onChange={e => setNewStudent({...newStudent, parent: e.target.value})} />
              <button type="submit" className="btn btn-primary full-width">Guardar</button>
            </form>
          </div>
        </div>
      )}

      <div className="filters-bar card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="Buscar por nombre o ID..." />
        </div>
        <div className="filter-group">
          <select className="filter-select">
            <option value="">Grado</option>
            <option value="1">1ro Primaria</option>
            <option value="2">2do Primaria</option>
          </select>
          <button className="btn btn-outline">
            <Filter size={18} />
            Filtros
          </button>
        </div>
      </div>

      <div className="table-container card">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre Completo</th>
              <th>Grado</th>
              <th>Padre/Tutor</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td className="id-cell">{student.id}</td>
                <td className="name-cell">{student.name}</td>
                <td>{student.grade}</td>
                <td>{student.parent}</td>
                <td>
                  <span className={`status-badge ${student.status.toLowerCase()}`}>
                    {student.status}
                  </span>
                </td>
                <td className="actions-cell">
                  <button title="Ver Detalle"><Eye size={18} /></button>
                  <button title="Editar"><Edit size={18} /></button>
                  <button title="Más"><MoreHorizontal size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

        .table-container {
          padding: 0;
          overflow: hidden;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .data-table th {
          background: #f8f9fa;
          padding: 1rem 1.5rem;
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .data-table td {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .id-cell {
          font-weight: 600;
          color: var(--secondary-color);
        }

        .name-cell {
          font-weight: 500;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 99px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.activo {
          background: #e6fffa;
          color: #047481;
        }

        .status-badge.inactivo {
          background: #fff5f5;
          color: #c53030;
        }

        .actions-cell {
          display: flex;
          gap: 0.75rem;
          color: var(--text-secondary);
        }

        .actions-cell button {
          background: none;
          color: inherit;
          transition: color 0.2s;
        }

        .actions-cell button:hover {
          color: var(--secondary-color);
        }
      `}} />
    </div>
  );
};

export default StudentsModule;
