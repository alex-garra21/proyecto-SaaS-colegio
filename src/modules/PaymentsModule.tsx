import React from 'react';
import { Search, FileText, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const PaymentsModule = () => {
  const transactions = [
    { id: 'TRX-1001', student: 'Ana García', grade: '3ro Primaria', concept: 'Colegiatura Junio', amount: '$150.00', date: '05/06/2026', status: 'Pagado' },
    { id: 'TRX-1002', student: 'Roberto Méndez', grade: '5to Primaria', concept: 'Colegiatura Junio', amount: '$150.00', date: '04/06/2026', status: 'Pagado' },
    { id: 'TRX-1003', student: 'Diego López', grade: '2do Primaria', concept: 'Colegiatura Junio', amount: '$150.00', date: '01/06/2026', status: 'Pendiente' },
    { id: 'TRX-1004', student: 'Lucía Torres', grade: '1ro Básico', concept: 'Mora Mayo', amount: '$15.00', date: '28/05/2026', status: 'Atrasado' },
    { id: 'TRX-1005', student: 'Karla Rivas', grade: '4to Primaria', concept: 'Materiales Anuales', amount: '$50.00', date: '15/01/2026', status: 'Pagado' },
  ];

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Pagado': return <CheckCircle size={16} className="text-success" />;
      case 'Pendiente': return <Clock size={16} className="text-warning" />;
      case 'Atrasado': return <AlertCircle size={16} className="text-error" />;
      default: return null;
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'Pagado': return 'status-success';
      case 'Pendiente': return 'status-warning';
      case 'Atrasado': return 'status-error';
      default: return '';
    }
  };

  return (
    <div className="module-container">
      <header className="module-header">
        <div>
          <h1>Control de Pagos</h1>
          <p className="subtitle">Gestión financiera, cobros y estado de cuenta de alumnos.</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline">
            <Download size={20} />
            Exportar Reporte
          </button>
          <button className="btn btn-primary">
            <FileText size={20} />
            Registrar Pago
          </button>
        </div>
      </header>

      <div className="financial-summary">
        <div className="summary-card card">
          <p className="summary-label">Recaudado este mes</p>
          <h2 className="summary-value text-primary">$18,450.00</h2>
        </div>
        <div className="summary-card card">
          <p className="summary-label">Pendiente de cobro</p>
          <h2 className="summary-value text-warning">$3,200.00</h2>
        </div>
        <div className="summary-card card">
          <p className="summary-label">En Mora (Atrasado)</p>
          <h2 className="summary-value text-error">$850.00</h2>
        </div>
      </div>

      <div className="table-container card">
        <div className="table-header">
          <h3>Historial de Transacciones</h3>
          <div className="search-box">
            <Search size={18} />
            <input type="text" placeholder="Buscar alumno o recibo..." />
          </div>
        </div>
        
        <table className="data-table">
          <thead>
            <tr>
              <th>ID Recibo</th>
              <th>Estudiante / Grado</th>
              <th>Concepto</th>
              <th>Monto</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((trx) => (
              <tr key={trx.id}>
                <td className="id-cell">{trx.id}</td>
                <td>
                  <div className="student-info">
                    <p className="student-name">{trx.student}</p>
                    <p className="student-grade">{trx.grade}</p>
                  </div>
                </td>
                <td>{trx.concept}</td>
                <td className="amount-cell">{trx.amount}</td>
                <td>{trx.date}</td>
                <td>
                  <div className={`status-pill ${getStatusClass(trx.status)}`}>
                    {getStatusIcon(trx.status)}
                    <span>{trx.status}</span>
                  </div>
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

        .header-actions {
          display: flex;
          gap: 1rem;
        }

        .financial-summary {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-card {
          padding: 1.5rem;
          border-left: 4px solid var(--secondary-color);
        }

        .summary-card:nth-child(2) {
          border-left-color: var(--warning-color);
        }

        .summary-card:nth-child(3) {
          border-left-color: var(--error-color);
        }

        .summary-label {
          color: var(--text-secondary);
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .summary-value {
          font-size: 2rem;
          font-weight: 700;
        }

        .text-primary { color: var(--primary-color); }
        .text-warning { color: var(--warning-color); }
        .text-error { color: var(--error-color); }
        .text-success { color: var(--success-color); }

        .table-container {
          padding: 0;
          overflow: hidden;
        }

        .table-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border-color);
        }

        .table-header h3 {
          color: var(--primary-color);
          font-size: 1.125rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f1f3f5;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          width: 300px;
        }

        .search-box input {
          background: none;
          border: none;
          outline: none;
          width: 100%;
          font-family: inherit;
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
          vertical-align: middle;
        }

        .id-cell {
          font-family: monospace;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .student-name {
          font-weight: 600;
          color: var(--text-primary);
        }

        .student-grade {
          font-size: 0.8125rem;
          color: var(--text-secondary);
        }

        .amount-cell {
          font-weight: 600;
          color: var(--primary-color);
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.75rem;
          border-radius: 99px;
          font-size: 0.8125rem;
          font-weight: 600;
        }

        .status-success {
          background: #e6fffa;
          color: #047481;
        }

        .status-warning {
          background: #fffaf0;
          color: #c05621;
        }

        .status-error {
          background: #fff5f5;
          color: #c53030;
        }
      `}} />
    </div>
  );
};

export default PaymentsModule;
