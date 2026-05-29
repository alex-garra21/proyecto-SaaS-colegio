import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CustomSelect from '../atoms/CustomSelect';
import {
  UserPlus, Mail, Loader2, AlertCircle, X,
  ArrowUpDown, ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight
} from 'lucide-react';

interface UserData {
  IdUsuario: number;
  NombreCompleto: string;
  Nombres: string;
  Apellidos: string;
  Correo: string;
  Estado: boolean;
  FechaRegistro: string;
  IdRol: number;
  NombreRol: string;
}

export default function Alumnos() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados de manipulación
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'IdUsuario' | 'NombreCompleto' | 'FechaRegistro'>('IdUsuario');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados del modal de agregar alumno
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNombres, setModalNombres] = useState('');
  const [modalApellidos, setModalApellidos] = useState('');
  const [modalFechaNacimiento, setModalFechaNacimiento] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword] = useState('Sige123*'); // password genérico inicial
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Cargar usuarios con rol Alumno (idRol === 4)
  const fetchAlumnos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Fallo al obtener los estudiantes de la base de datos.');
      }

      const data = await res.json() as UserData[];
      // Filtrar únicamente los alumnos (idRol === 4)
      const alumnosOnly = data.filter(u => u.IdRol === 4);
      setUsersList(alumnosOnly);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAlumnos();
    }
  }, [token]);

  // Bucle debounced para generación de correo institucional
  useEffect(() => {
    const nombresClean = modalNombres.trim();
    const apellidosClean = modalApellidos.trim();

    if (!nombresClean || !apellidosClean) {
      setModalEmail('');
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';
        const queryParams = new URLSearchParams({
          nombres: nombresClean,
          apellidos: apellidosClean
        });

        const res = await fetch(`${apiBaseUrl}/api/users/generar-correo?${queryParams.toString()}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.correoGenerado) {
            setModalEmail(data.correoGenerado);
          }
        }
      } catch (err) {
        console.error('Error de red al generar correo:', err);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [modalNombres, modalApellidos, token]);

  // Algoritmo de Código Estudiante (Background)
  // Formato strict: [A-E]{1}[0-9]{3}[A-Z]{3}
  const generateStudentCode = () => {
    const lettersAE = ['A', 'B', 'C', 'D', 'E'];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    
    // Traer todos los códigos ya guardados en localStorage para evitar duplicados
    const allStoredMetadata = Object.keys(localStorage)
      .filter(key => key.startsWith('sige_user_meta_'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          return {};
        }
      });
    const existingCodes = allStoredMetadata.map(meta => meta.codigoEstudiante).filter(Boolean);

    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      attempts++;
      const firstLetter = lettersAE[Math.floor(Math.random() * lettersAE.length)];
      const digits = Math.floor(100 + Math.random() * 900).toString(); // 3 dígitos
      let lastLetters = '';
      for (let i = 0; i < 3; i++) {
        lastLetters += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      code = `${firstLetter}${digits}${lastLetters}`;
      if (!existingCodes.includes(code)) {
        isUnique = true;
      }
    }
    return code;
  };

  // Registrar alumno manual
  const handleAddAlumnoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registeredNombres = modalNombres.trim();
    const registeredApellidos = modalApellidos.trim();

    if (!registeredNombres || !registeredApellidos || !modalEmail.trim() || !modalFechaNacimiento) {
      setModalError('Todos los campos son obligatorios.');
      return;
    }

    setModalError(null);
    setModalLoading(true);

    try {
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBaseUrl}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombres: registeredNombres,
          apellidos: registeredApellidos,
          correo: modalEmail.trim(),
          password: modalPassword,
          idRol: 4 // Alumno por defecto
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Fallo al registrar el alumno.');
      }

      // Obtener la lista actualizada de usuarios para asociar la metadata al ID real creado
      const listRes = await fetch(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const latestData = await listRes.json() as UserData[];
      const createdUser = latestData.find(u => u.Correo.toLowerCase() === modalEmail.trim().toLowerCase());

      const finalStudentCode = generateStudentCode();

      if (createdUser) {
        // Almacenar metadatos extendidos de forma persistente asociada al ID de usuario
        const metadata = {
          idUsuario: createdUser.IdUsuario,
          codigoEstudiante: finalStudentCode,
          fechaNacimiento: modalFechaNacimiento
        };
        localStorage.setItem(`sige_user_meta_${createdUser.IdUsuario}`, JSON.stringify(metadata));
      }

      const fullname = `${registeredNombres} ${registeredApellidos}`;
      showToast(`¡Alumno ${fullname} registrado con Código ${finalStudentCode}!`, 'success');
      
      // Resetear
      setModalNombres('');
      setModalApellidos('');
      setModalEmail('');
      setModalFechaNacimiento('');
      
      setIsModalOpen(false);
      fetchAlumnos();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error de comunicación.');
      showToast(`Error de registro: ${err.message}`, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Guardar cambio de rol al instante (Transaccional)
  const handleRoleChange = async (userId: number, newRolId: number) => {
    try {
      const apiBaseUrl = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000';
      const res = await fetch(`${apiBaseUrl}/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idRol: Number(newRolId) })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error al cambiar de rol.');
      }

      showToast(`Se ha actualizado el rol del alumno exitosamente.`, 'success');
      fetchAlumnos(); // Recargar listado
    } catch (err: any) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  // Filtrado y Ordenamiento
  const filteredAlumnos = useMemo(() => {
    return usersList.filter(u => {
      return u.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
             u.Correo.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [usersList, searchTerm]);

  const sortedAlumnos = useMemo(() => {
    const sorted = [...filteredAlumnos];
    sorted.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredAlumnos, sortField, sortOrder]);

  const paginatedAlumnos = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedAlumnos.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedAlumnos, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredAlumnos.length / itemsPerPage));

  const handleSort = (field: 'IdUsuario' | 'NombreCompleto' | 'FechaRegistro') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Traer código de alumno desde localStorage para renderizado
  const getStudentCode = (userId: number) => {
    try {
      const metaStr = localStorage.getItem(`sige_user_meta_${userId}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        return meta.codigoEstudiante || 'S/C';
      }
    } catch {}
    return 'A128BFC'; // código mockup de fallback
  };

  // Opciones permitidas para cambiar el rol de un Alumno
  const roleOptions = [
    { value: 4, label: 'Alumno' },
    { value: 3, label: 'Docente' },
    { value: 5, label: 'Padre' }
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 font-sans">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB]">
            Módulo Operativo de SIGE
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Gestión de Alumnos
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Consulta de expedientes académicos de estudiantes, altas y traslados de roles autorizados.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-md bg-[#2563EB] hover:bg-[#1d4ed8] text-white px-4 py-2.5 text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-[0.98]"
        >
          <UserPlus size={15} />
          <span>Agregar Alumno Manual</span>
        </button>
      </div>

      {/* Caja de Búsqueda */}
      <div className="flex items-center gap-3 rounded-lg bg-white border border-[#E2E8F0] p-4 shadow-sm">
        <input
          type="text"
          placeholder="Buscar alumno por nombre o correo..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="block w-full max-w-md rounded-md border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#2563EB] focus:bg-white focus:outline-none"
        />
      </div>

      {/* Tabla de Resultados */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider select-none">
                <th className="py-3 px-5">Código Alumno</th>
                <th onClick={() => handleSort('NombreCompleto')} className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 hover:text-slate-800 transition-colors">
                  <div className="flex items-center">
                    <span>Nombre del Estudiante</span>
                    <ArrowUpDown size={11} className="ml-1 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-5">Correo Institucional</th>
                <th className="py-3 px-5">Rol Autorizado</th>
                <th className="py-3 px-5 text-center">Estado</th>
                <th onClick={() => handleSort('FechaRegistro')} className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 hover:text-slate-800 transition-colors">
                  <div className="flex items-center">
                    <span>Fecha Registro</span>
                    <ArrowUpDown size={11} className="ml-1 text-slate-400" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-[#2563EB]" />
                      <span>Cargando estudiantes...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-red-500 font-semibold">
                    Error al cargar datos: {error}
                  </td>
                </tr>
              ) : filteredAlumnos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 italic">
                    No se encontraron alumnos que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                paginatedAlumnos.map((row) => (
                  <tr key={row.IdUsuario} className="hover:bg-slate-50/50 transition-colors">
                    {/* Código Alumno */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-800 select-all">
                      <span className="bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5">
                        {getStudentCode(row.IdUsuario)}
                      </span>
                    </td>
                    {/* Nombre del Estudiante */}
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{row.NombreCompleto}</td>
                    {/* Correo */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono">{row.Correo}</td>
                    {/* Rol Dropdown (Cambio de Rol Exclusivo) */}
                    <td className="py-3.5 px-5 min-w-[150px]">
                      <CustomSelect
                        value={row.IdRol}
                        onChange={(val) => handleRoleChange(row.IdUsuario, val)}
                        options={roleOptions}
                      />
                    </td>
                    {/* Estado */}
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-flex items-center gap-0.5 rounded px-2 py-0.5 text-[9px] font-bold border ${
                        row.Estado
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                          : 'bg-red-50 border-red-100 text-red-700'
                      }`}>
                        {row.Estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    {/* Fecha Registro */}
                    <td className="py-3.5 px-5 font-mono text-slate-400">
                      {new Date(row.FechaRegistro).toISOString().substring(0, 10)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredAlumnos.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] text-slate-500 font-semibold">
              Mostrando del {Math.min(filteredAlumnos.length, (currentPage - 1) * itemsPerPage + 1)} al {Math.min(filteredAlumnos.length, currentPage * itemsPerPage)} de {filteredAlumnos.length} alumnos
            </span>
            <div className="flex gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <ChevronsLeft size={13} />
              </button>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <ChevronLeft size={13} />
              </button>
              <span className="text-[10px] font-bold text-slate-800 bg-slate-100 border border-slate-200 rounded px-2.5 py-1">
                Página {currentPage} de {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <ChevronRight size={13} />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
                className="flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 cursor-pointer shadow-sm"
              >
                <ChevronsRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL AGREGAR ALUMNO */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => { if (!modalLoading) setIsModalOpen(false); }}></div>
          <div className="relative w-full max-w-md bg-white rounded-lg border border-[#E2E8F0] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 z-10 text-left">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-950 text-white">
                  <UserPlus size={15} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Agregar Alumno Manual
                </h3>
              </div>
              <button
                disabled={modalLoading}
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {modalError && (
              <div className="flex items-start gap-2.5 rounded-lg bg-red-50 border border-red-100 p-3.5 text-xs text-red-700">
                <AlertCircle size={16} className="text-red-650 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error en la transacción:</span>
                  <p className="mt-0.5 text-red-600/90">{modalError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleAddAlumnoSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Nombres
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Juan Carlos"
                  value={modalNombres}
                  onChange={(e) => setModalNombres(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Apellidos
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Pérez Gómez"
                  value={modalApellidos}
                  onChange={(e) => setModalApellidos(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Fecha de Nacimiento
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={modalFechaNacimiento}
                    onChange={(e) => setModalFechaNacimiento(e.target.value)}
                    className="block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              {/* Campo Correo Institucional (ReadOnly debounced) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Correo Institucional Autogenerado
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    readOnly
                    placeholder="Escribe nombres para computar..."
                    value={modalEmail}
                    className="block w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-500 focus:outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={modalLoading}
                  className="px-4 py-2 rounded-md text-xs font-bold border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || !modalNombres.trim() || !modalApellidos.trim() || !modalEmail}
                  className="flex items-center gap-1.5 px-4.5 py-2 rounded-md text-xs font-bold bg-[#2563EB] hover:bg-[#1d4ed8] text-white shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {modalLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
                  ) : (
                    <span>Registrar e Inyectar Alumno</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
