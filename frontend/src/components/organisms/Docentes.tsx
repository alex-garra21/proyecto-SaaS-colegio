import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  UserPlus, Mail, Loader2, AlertCircle, X,
  ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Shield, Phone, FileText
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

export default function Docentes() {
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

  // Estados del modal de agregar docente
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalNombres, setModalNombres] = useState('');
  const [modalApellidos, setModalApellidos] = useState('');
  const [modalDpi, setModalDpi] = useState('');
  const [modalFechaNacimiento, setModalFechaNacimiento] = useState('');
  const [modalTelefono, setModalTelefono] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword] = useState('Sige123*'); // password genérico inicial
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Cargar docentes (idRol === 3)
  const fetchDocentes = async () => {
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
        throw new Error('Fallo al obtener los docentes de la base de datos.');
      }

      const data = await res.json() as UserData[];
      const docentesOnly = data.filter(u => u.IdRol === 3);
      setUsersList(docentesOnly);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDocentes();
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

  // Algoritmo de Código Docente (Background)
  // Formato: D + 5 dígitos (el primero no puede ser cero, e.g. D18492)
  const generateTeacherCode = () => {
    const allStoredMetadata = Object.keys(localStorage)
      .filter(key => key.startsWith('sige_user_meta_'))
      .map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          return {};
        }
      });
    const existingCodes = allStoredMetadata.map(meta => meta.codigoDocente).filter(Boolean);

    let code = '';
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 100) {
      attempts++;
      const firstDigit = Math.floor(1 + Math.random() * 9).toString(); // 1-9 (no cero)
      let otherDigits = '';
      for (let i = 0; i < 4; i++) {
        otherDigits += Math.floor(Math.random() * 10).toString(); // 0-9
      }
      code = `D${firstDigit}${otherDigits}`;
      if (!existingCodes.includes(code)) {
        isUnique = true;
      }
    }
    return code;
  };

  // Registrar docente manual
  const handleAddDocenteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registeredNombres = modalNombres.trim();
    const registeredApellidos = modalApellidos.trim();

    if (!registeredNombres || !registeredApellidos || !modalEmail.trim() || !modalFechaNacimiento || !modalDpi || !modalTelefono) {
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
          idRol: 3 // Docente por defecto
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Fallo al registrar el docente.');
      }

      // Obtener la lista de usuarios para asociar la metadata al ID real creado
      const listRes = await fetch(`${apiBaseUrl}/api/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const latestData = await listRes.json() as UserData[];
      const createdUser = latestData.find(u => u.Correo.toLowerCase() === modalEmail.trim().toLowerCase());

      const finalTeacherCode = generateTeacherCode();

      if (createdUser) {
        // Almacenar metadatos extendidos de forma persistente asociada al ID de usuario
        const metadata = {
          idUsuario: createdUser.IdUsuario,
          dpi: modalDpi,
          telefono: modalTelefono,
          fechaNacimiento: modalFechaNacimiento,
          codigoDocente: finalTeacherCode
        };
        localStorage.setItem(`sige_user_meta_${createdUser.IdUsuario}`, JSON.stringify(metadata));
      }

      const fullname = `${registeredNombres} ${registeredApellidos}`;
      showToast(`¡Docente ${fullname} registrado con Código ${finalTeacherCode}!`, 'success');
      
      // Resetear
      setModalNombres('');
      setModalApellidos('');
      setModalEmail('');
      setModalFechaNacimiento('');
      setModalDpi('');
      setModalTelefono('');
      
      setIsModalOpen(false);
      fetchDocentes();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error de comunicación.');
      showToast(`Error de registro: ${err.message}`, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  // Filtrado y Ordenamiento
  const filteredDocentes = useMemo(() => {
    return usersList.filter(u => {
      return u.NombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
             u.Correo.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [usersList, searchTerm]);

  const sortedDocentes = useMemo(() => {
    const sorted = [...filteredDocentes];
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
  }, [filteredDocentes, sortField, sortOrder]);

  const paginatedDocentes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedDocentes.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedDocentes, currentPage]);

  const totalPages = Math.max(1, Math.ceil(filteredDocentes.length / itemsPerPage));

  const handleSort = (field: 'IdUsuario' | 'NombreCompleto' | 'FechaRegistro') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Traer Código Docente desde localStorage
  const getTeacherCode = (userId: number) => {
    try {
      const metaStr = localStorage.getItem(`sige_user_meta_${userId}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        return meta.codigoDocente || 'S/C';
      }
    } catch {}
    return 'D10294'; // mockup fallback
  };

  // Traer DPI desde localStorage
  const getDpi = (userId: number) => {
    try {
      const metaStr = localStorage.getItem(`sige_user_meta_${userId}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        return meta.dpi || 'S/DPI';
      }
    } catch {}
    return '1998 29918 0101'; // mockup fallback
  };

  // Traer Teléfono desde localStorage
  const getTelefono = (userId: number) => {
    try {
      const metaStr = localStorage.getItem(`sige_user_meta_${userId}`);
      if (metaStr) {
        const meta = JSON.parse(metaStr);
        return meta.telefono || 'S/TEL';
      }
    } catch {}
    return '5998-1002'; // mockup fallback
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 font-sans">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#2563EB]">
            Módulo Operativo de SIGE
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            Gestión de Docentes
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Consulta de claustro docente, códigos de servicio académico y asignación de perfiles autorizados.
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
          <span>Agregar Docente Manual</span>
        </button>
      </div>

      {/* Caja de Búsqueda */}
      <div className="flex items-center gap-3 rounded-lg bg-white border border-[#E2E8F0] p-4 shadow-sm">
        <input
          type="text"
          placeholder="Buscar docente por nombre o correo..."
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
                <th className="py-3 px-5">Código Docente</th>
                <th onClick={() => handleSort('NombreCompleto')} className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 hover:text-slate-800 transition-colors">
                  <div className="flex items-center">
                    <span>Nombre del Docente</span>
                    <ArrowUpDown size={11} className="ml-1 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-5">DPI</th>
                <th className="py-3 px-5">Teléfono</th>
                <th className="py-3 px-5">Correo Institucional</th>
                <th className="py-3 px-5">Rol Asignado</th>
                <th className="py-3 px-5 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 text-xs">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4.5 w-4.5 animate-spin text-[#2563EB]" />
                      <span>Cargando docentes...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-red-500 font-semibold">
                    Error al cargar datos: {error}
                  </td>
                </tr>
              ) : filteredDocentes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400 italic">
                    No se encontraron docentes.
                  </td>
                </tr>
              ) : (
                paginatedDocentes.map((row) => (
                  <tr key={row.IdUsuario} className="hover:bg-slate-50/50 transition-colors">
                    {/* Código Docente */}
                    <td className="py-3.5 px-5 font-mono font-bold text-slate-800 select-all">
                      <span className="bg-slate-50 border border-slate-150 rounded px-1.5 py-0.5 font-bold">
                        {getTeacherCode(row.IdUsuario)}
                      </span>
                    </td>
                    {/* Nombre */}
                    <td className="py-3.5 px-5 font-semibold text-slate-900">{row.NombreCompleto}</td>
                    {/* DPI */}
                    <td className="py-3.5 px-5 font-mono text-slate-700">
                      {getDpi(row.IdUsuario)}
                    </td>
                    {/* Teléfono */}
                    <td className="py-3.5 px-5 font-mono text-slate-600">
                      {getTelefono(row.IdUsuario)}
                    </td>
                    {/* Correo */}
                    <td className="py-3.5 px-5 text-slate-500 font-mono">{row.Correo}</td>
                    {/* Rol Bloqueado (UX Defensa de privilegios) */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-150 rounded px-2 py-1 w-full select-none cursor-not-allowed opacity-60">
                        <Shield size={11} className="text-slate-400" />
                        <span>Docente (Fijo)</span>
                      </div>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredDocentes.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
            <span className="text-[10px] text-slate-500 font-semibold">
              Mostrando del {Math.min(filteredDocentes.length, (currentPage - 1) * itemsPerPage + 1)} al {Math.min(filteredDocentes.length, currentPage * itemsPerPage)} de {filteredDocentes.length} docentes
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

      {/* MODAL AGREGAR DOCENTE */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm z-50 animate-in fade-in duration-200">
          <div className="absolute inset-0" onClick={() => { if (!modalLoading) setIsModalOpen(false); }}></div>
          <div className="relative w-full max-w-md bg-white rounded-lg border border-[#E2E8F0] shadow-2xl p-6 space-y-4 animate-in zoom-in-95 duration-200 z-10 text-left">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-950 text-white">
                  <UserPlus size={15} />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Agregar Docente Manual
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

            <form onSubmit={handleAddDocenteSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Nombres
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Ana María"
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
                    placeholder="ej. Castillo"
                    value={modalApellidos}
                    onChange={(e) => setModalApellidos(e.target.value)}
                    className="block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    DPI (CUI)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <FileText size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="1849 20394 0101"
                      value={modalDpi}
                      onChange={(e) => setModalDpi(e.target.value)}
                      className="block w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Número de Teléfono
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400">
                      <Phone size={14} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="4001-9284"
                      value={modalTelefono}
                      onChange={(e) => setModalTelefono(e.target.value)}
                      className="block w-full rounded-md border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Fecha de Nacimiento
                </label>
                <input
                  type="date"
                  required
                  value={modalFechaNacimiento}
                  onChange={(e) => setModalFechaNacimiento(e.target.value)}
                  className="block w-full rounded-md border border-slate-200 bg-white py-2 px-3 text-xs text-slate-900 focus:border-[#2563EB] focus:outline-none"
                />
              </div>

              {/* Correo Autogenerado */}
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
                    <span>Registrar e Inyectar Docente</span>
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
