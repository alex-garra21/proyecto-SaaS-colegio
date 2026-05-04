import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DashboardHome from './modules/DashboardHome';
import StudentsModule from './modules/StudentsModule';
import TeachersModule from './modules/TeachersModule';
import CoursesModule from './modules/CoursesModule';
import PaymentsModule from './modules/PaymentsModule';
import LandingPage from './modules/Public/LandingPage';
import Login from './modules/Public/Login';

// Placeholder for other modules
const Placeholder = ({ title }: { title: string }) => (
  <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
    <h2 style={{ color: 'var(--primary-color)' }}>{title}</h2>
    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Esta pantalla está en desarrollo basado en los diseños de Stitch.</p>
  </div>
);

// Auth Wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Private Routes */}
        <Route path="/dashboard/*" element={
          <PrivateRoute>
            <div className="app-container">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<DashboardHome />} />
                  <Route path="estudiantes" element={<StudentsModule />} />
                  <Route path="docentes" element={<TeachersModule />} />
                  <Route path="cursos" element={<CoursesModule />} />
                  <Route path="pagos" element={<PaymentsModule />} />
                  <Route path="configuracion" element={<Placeholder title="Configuración Institucional" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </PrivateRoute>
        } />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
