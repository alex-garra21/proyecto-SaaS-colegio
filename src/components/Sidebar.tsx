import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  School,
  Pencil
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Estudiantes', path: '/dashboard/estudiantes' },
    { icon: <GraduationCap size={20} />, label: 'Docentes', path: '/dashboard/docentes' },
    { icon: <BookOpen size={20} />, label: 'Cursos y Grados', path: '/dashboard/cursos' },
    { icon: <CreditCard size={20} />, label: 'Pagos', path: '/dashboard/pagos' },
    { icon: <Settings size={20} />, label: 'Configuración', path: '/dashboard/configuracion' },
    { icon: <Pencil size={20} />, label: 'Ajustes', path: '/dashboard/ajustes' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <School color="#3A86FF" size={32} />
        <span className="brand-name">EduNexus</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          className="nav-item logout-btn"
          onClick={() => {
            localStorage.removeItem('isAuthenticated');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .sidebar {
          width: 260px;
          background-color: var(--primary-color);
          color: white;
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          height: 100vh;
          position: sticky;
          top: 0;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding: 0 0.5rem;
        }

        .brand-name {
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          border-radius: var(--radius-md);
          color: rgba(255, 255, 255, 0.7);
          transition: all 0.2s;
          font-weight: 500;
        }

        .nav-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: white;
        }

        .nav-item.active {
          background-color: var(--secondary-color);
          color: white;
        }

        .sidebar-footer {
          margin-top: auto;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
        }

        .logout-btn {
          width: 100%;
          background: none;
          color: #ff4d4d;
        }

        .logout-btn:hover {
          background-color: rgba(255, 77, 77, 0.1);
          color: #ff4d4d;
        }
      `}} />
    </aside>
  );
};

export default Sidebar;
