import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import CustomSelect from '../../components/atoms/CustomSelect';
import FilterBar from '../../components/molecules/FilterBar';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Loader2,
  AlertCircle,
  X,
  CheckCircle,
  ShieldAlert,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Trash2
} from 'lucide-react';

interface UserData {
  IdUsuario: number;
  Nombre: string;
  Correo: string;
  Estado: boolean;
  FechaRegistro: string;
  IdRol: number;
  NombreRol: string;
}

export default function Usuarios() {
  const { token, user: activeAdmin } = useAuth();
  const { showToast } = useToast();
  
  const [usersList, setUsersList] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para Modal de Confirmación de Baja Segura
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<UserData | null>(null);

  const handleConfirmDeactivate = async () => {
    if (!userToDeactivate) return;
    
    const userId = userToDeactivate.IdUsuario;
    const userName = userToDeactivate.Nombre;
    
    setIsConfirmModalOpen(false);
    
    if (!userToDeactivate.Estado) {
      showToast(`El usuario ${userName} ya se encuentra desactivado.`, 'error');
      setUserToDeactivate(null);
      return;
    }
    
    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al desactivar el usuario.');
      }

      // Actualizar estado en la UI a Inactivo
      setUsersList(prev =>
        prev.map(u => (u.IdUsuario === userId ? { ...u, Estado: false } : u))
      );

      showToast(`Se ha desactivado el usuario ${userName} de la plataforma.`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error al desactivar: ${err.message}`, 'error');
    } finally {
      setUserToDeactivate(null);
    }
  };

  // Estados de manipulación de datos (Búsqueda, Filtrado, Ordenamiento y Paginación)
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState<number>(0); // 0 = Todos los Roles
  const [filterEstado, setFilterEstado] = useState<number>(0); // 0 = Todos los Estatus

  const [sortField, setSortField] = useState<'IdUsuario' | 'Nombre' | 'NombreRol' | 'FechaRegistro'>('IdUsuario');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Estados del modal de agregar usuario
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalName, setModalName] = useState('');
  const [modalEmail, setModalEmail] = useState('');
  const [modalPassword, setModalPassword] = useState('');
  const [modalRol, setModalRol] = useState<number>(3); // Profesor por defecto
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState<string | null>(null);

  // Cargar usuarios desde el backend
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al cargar usuarios de la base de datos.');
      }

      const data = await res.json() as UserData[];
      setUsersList(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // Resetear paginación al alterar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterRol, filterEstado]);

  // ==========================================
  // LÓGICA DE MANIPULACIÓN DE DATOS COMBINADA
  // ==========================================

  // 1. Filtrado en Cascada (Cascading Filter)
  const filteredUsers = useMemo(() => {
    return usersList.filter(u => {
      const matchesSearch = 
        u.Nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.Correo.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRol = 
        filterRol === 0 || 
        u.IdRol === filterRol;
      
      const matchesEstado = 
        filterEstado === 0 || 
        (filterEstado === 1 && u.Estado) || 
        (filterEstado === 2 && !u.Estado);

      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [usersList, searchTerm, filterRol, filterEstado]);

  // 2. Ordenamiento Dinámico
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers];
    sorted.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      } else if (sortField === 'FechaRegistro') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredUsers, sortField, sortOrder]);

  // 3. Paginación Robusta (De 10 en 10)
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedUsers, currentPage, itemsPerPage]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));

  // Manejador del ordenamiento de columnas
  const handleSort = (field: 'IdUsuario' | 'Nombre' | 'NombreRol' | 'FechaRegistro') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: 'IdUsuario' | 'Nombre' | 'NombreRol' | 'FechaRegistro') => {
    if (sortField !== field) {
      return <ArrowUpDown size={11} className="ml-1.5 text-slate-400 dark:text-slate-500 inline shrink-0" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp size={11} className="ml-1.5 text-slate-900 dark:text-slate-200 inline shrink-0 font-bold" />
    ) : (
      <ArrowDown size={11} className="ml-1.5 text-slate-900 dark:text-slate-200 inline shrink-0 font-bold" />
    );
  };

  // Guardar cambio de rol al instante (Transaccional)
  const handleRoleChange = async (userId: number, newRolId: number) => {
    // Blindaje Absoluto Anti-Autobloqueo
    if (activeAdmin?.idUsuario === userId) {
      showToast('Acción bloqueada preventivamente: no puedes auto-demotarte.', 'error');
      return;
    }

    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ idRol: Number(newRolId) })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Error desconocido');
      }

      // Mapeo interno rápido para traducir el ID numérico del rol a su nombre comercial
      const roleNames: Record<number, string> = {
        1: 'Administrador',
        2: 'Personal Académico',
        3: 'Profesor Docente',
        4: 'Alumno Regular',
        5: 'Padre de Familia'
      };
      const nombreDelRol = roleNames[newRolId] || 'Rol';
      const targetUser = usersList.find(u => u.IdUsuario === userId);
      const userName = targetUser ? targetUser.Nombre : 'Usuario';

      // Actualizar el estado local con transiciones suaves
      setUsersList(prev =>
        prev.map(u => (u.IdUsuario === userId ? { ...u, IdRol: newRolId } : u))
      );
      
      showToast(`Se ha cambiado el rol de ${userName} a ${nombreDelRol}.`, 'success');

    } catch (err: any) {
      console.error(err);
      showToast(err.message, 'error');
    }
  };

  // Alternar el estado (Activo/Inactivo) al instante (Transaccional)
  const handleToggleStatus = async (userId: number) => {
    // Blindaje Absoluto Anti-Autobloqueo
    if (activeAdmin?.idUsuario === userId) {
      showToast('Acción bloqueada preventivamente: no puedes desactivar tu propia cuenta.', 'error');
      return;
    }

    const targetUser = usersList.find(u => u.IdUsuario === userId);
    if (!targetUser) return;
    const userName = targetUser.Nombre;
    const nextState = !targetUser.Estado;

    try {
      const res = await fetch(`http://localhost:4000/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al alternar el estado.');
      }

      // Alternar estado en la UI
      setUsersList(prev =>
        prev.map(u => (u.IdUsuario === userId ? { ...u, Estado: !u.Estado } : u))
      );

      if (nextState) {
        showToast(`Se ha activado el usuario ${userName} exitosamente.`, 'success');
      } else {
        showToast(`Se ha desactivado el usuario ${userName} de la plataforma.`, 'success');
      }

    } catch (err: any) {
      console.error(err);
      showToast(`Error al cambiar el estado: ${err.message}`, 'error');
    }
  };

  // Registrar usuario manual
  const handleAddUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const registeredName = modalName.trim();
    if (!registeredName || !modalEmail.trim() || !modalPassword || !modalRol) {
      setModalError('Todos los campos del formulario son obligatorios.');
      return;
    }

    setModalError(null);
    setModalSuccess(null);
    setModalLoading(true);

    try {
      const res = await fetch('http://localhost:4000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombre: registeredName,
          correo: modalEmail.trim(),
          password: modalPassword,
          idRol: modalRol
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Fallo al registrar el usuario.');
      }

      setModalSuccess(`¡Usuario ${registeredName} registrado correctamente!`);
      showToast(`¡Usuario ${registeredName} registrado correctamente!`, 'success');
      setModalName('');
      setModalEmail('');
      setModalPassword('');
      setModalRol(3);

      // Recargar lista después de un breve delay
      setTimeout(() => {
        setIsModalOpen(false);
        setModalSuccess(null);
        fetchUsers();
      }, 1500);

    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error de comunicación.');
      showToast(`Error de registro: ${err.message}`, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* Cabecera del Módulo */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Control de Usuarios
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Administración completa de accesos, asignación de roles de seguridad y bloqueos temporales en SQL Server.
          </p>
        </div>

        <button
          onClick={() => {
            setModalError(null);
            setModalSuccess(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-950 dark:bg-slate-100 px-4 py-2.5 text-xs font-semibold text-white dark:text-slate-950 shadow-sm hover:bg-slate-800 dark:hover:bg-white active:scale-98 transition-all cursor-pointer"
        >
          <UserPlus size={15} />
          Agregar Usuario Manual
        </button>
      </div>

      {/* Listado de Usuarios a ancho completo */}
      <div className="w-full space-y-6">
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
            
            {/* Header del Card */}
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <h3 className="text-xs font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider">
                Usuarios Registrados en el Sistema
              </h3>
              <span className="rounded bg-slate-100 dark:bg-slate-800 text-[10px] px-2.5 py-1 text-slate-600 dark:text-slate-300 font-bold select-none">
                Total: {filteredUsers.length === usersList.length ? `${usersList.length} cuentas` : `${filteredUsers.length} de ${usersList.length} filtrados`}
              </span>
            </div>

            {/* BARRA DE CONTROLES SUPERIORES - Molécula Unificada Responsiva */}
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filterRol={filterRol}
              onRolChange={setFilterRol}
              filterEstado={filterEstado}
              onEstadoChange={setFilterEstado}
            />

            {/* Tabla de Resultados */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[11px] border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider select-none">
                    <th 
                      onClick={() => handleSort('IdUsuario')}
                      className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <span>ID</span>
                        {renderSortIcon('IdUsuario')}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('Nombre')}
                      className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <span>Usuario / Correo</span>
                        {renderSortIcon('Nombre')}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleSort('NombreRol')}
                      className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <span>Rol Asignado</span>
                        {renderSortIcon('NombreRol')}
                      </div>
                    </th>
                    <th className="py-3 px-5 text-center">Estatus</th>
                    <th 
                      onClick={() => handleSort('FechaRegistro')}
                      className="py-3 px-5 cursor-pointer hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                    >
                      <div className="flex items-center">
                        <span>Fecha Registro</span>
                        {renderSortIcon('FechaRegistro')}
                      </div>
                    </th>
                    <th className="py-3 px-5 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-sans">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-slate-900 dark:text-white" />
                          <span className="font-medium text-xs">Consultando base de datos transaccional...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-5 text-center text-red-600 dark:text-red-400 bg-red-50/20 dark:bg-red-950/10">
                        <div className="flex items-center justify-center gap-2">
                          <AlertCircle size={16} />
                          <span>Fallo de red o permisos: <b>{error}</b></span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 px-5 text-center text-slate-400 dark:text-slate-500 italic">
                        La lista está vacía. No hay usuarios que coincidan con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    paginatedUsers.map((row) => {
                      // Determinar si la fila es el administrador actual logueado (Prevención de Auto-Bloqueo / Auto-Baja)
                      const isSelf = activeAdmin?.idUsuario === row.IdUsuario;
                      
                      return (
                        <tr key={row.IdUsuario} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          {/* ID */}
                          <td className="py-3.5 px-5 font-mono text-slate-400 dark:text-slate-500">{row.IdUsuario}</td>
                          
                          {/* Usuario / Correo */}
                          <td className="py-3.5 px-5 min-w-[180px]">
                            <span className="block font-semibold text-slate-900 dark:text-slate-200 truncate">
                               {row.Nombre}
                            </span>
                            <span className="block text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                              {row.Correo}
                            </span>
                          </td>
                          
                          {/* Rol Dropdown (Átomo CustomSelect reutilizado y blindado) */}
                          <td className="py-3.5 px-5 min-w-[160px]">
                            {isSelf ? (
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-lg px-2.5 py-1.5 w-full select-none cursor-not-allowed">
                                <ShieldAlert size={12} className="text-slate-400 dark:text-slate-500" />
                                <span>Administrador (Tú)</span>
                              </div>
                            ) : (
                              <CustomSelect
                                value={row.IdRol}
                                onChange={(val) => handleRoleChange(row.IdUsuario, val)}
                                options={[
                                  { value: 1, label: 'Administrador' },
                                  { value: 2, label: 'Personal Académico' },
                                  { value: 3, label: 'Profesor Docente' },
                                  { value: 4, label: 'Alumno Regular' },
                                  { value: 5, label: 'Padre de Familia' }
                                ]}
                              />
                            )}
                          </td>
                          
                          {/* Estatus Switch (Con protección de auto-bloqueo robusta y clases del Dark Mode) */}
                          <td className="py-3.5 px-5 text-center min-w-[100px]">
                            {isSelf ? (
                              <button
                                disabled
                                onClick={() => {
                                  if (isSelf) return; // Retorno temprano inmediato por seguridad de auto-bloqueo
                                }}
                                className="inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[9px] font-bold border pointer-events-none opacity-40 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 select-none"
                              >
                                <span className="h-1 w-1 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                                Activo
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  if (isSelf) return; // Retorno temprano inmediato redundante por seguridad extrema
                                  handleToggleStatus(row.IdUsuario);
                                }}
                                className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-[9px] font-bold border transition-all cursor-pointer ${
                                  row.Estado
                                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100'
                                    : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/40 text-red-700 dark:text-red-400 hover:bg-red-100'
                                }`}
                              >
                                <span className={`h-1 w-1 rounded-full ${row.Estado ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                                {row.Estado ? 'Activo' : 'Inactivo'}
                              </button>
                            )}
                          </td>
                          
                          {/* Fecha Registro */}
                          <td className="py-3.5 px-5 font-mono text-slate-400 dark:text-slate-500 truncate">
                            {new Date(row.FechaRegistro).toISOString().replace('T', ' ').substring(0, 19)}
                          </td>

                          {/* Acciones */}
                          <td className="py-3.5 px-5 text-center min-w-[80px]">
                            <button
                              disabled={isSelf}
                              onClick={() => {
                                setUserToDeactivate(row);
                                setIsConfirmModalOpen(true);
                              }}
                              className={`inline-flex items-center justify-center p-1.5 rounded-lg transition-colors cursor-pointer ${
                                isSelf 
                                  ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-500' 
                                  : 'text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                              }`}
                              title={isSelf ? "No puedes darte de baja a ti mismo" : "Baja Segura"}
                            >
                              <Trash2 size={15} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* PANEL DE PAGINACIÓN ROBUSTA */}
            {filteredUsers.length > 0 && (
              <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/20 dark:bg-slate-900/10 select-none">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  Mostrando del {Math.min(filteredUsers.length, (currentPage - 1) * itemsPerPage + 1)} al {Math.min(filteredUsers.length, currentPage * itemsPerPage)} de {filteredUsers.length} registros
                </span>
                
                <div className="flex items-center gap-1">
                  {/* Primero */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                    title="Primera Página"
                  >
                    <ChevronsLeft size={13} />
                  </button>

                  {/* Anterior */}
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                    title="Página Anterior"
                  >
                    <ChevronLeft size={13} />
                  </button>

                  {/* Indicador de Página */}
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1">
                    Página {currentPage} de {totalPages}
                  </span>

                  {/* Siguiente */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                    title="Página Siguiente"
                  >
                    <ChevronRight size={13} />
                  </button>

                  {/* Último */}
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                    title="Última Página"
                  >
                    <ChevronsRight size={13} />
                  </button>
                </div>
              </div>
            )}

          </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN: BAJA SEGURA */}
      {isConfirmModalOpen && userToDeactivate && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          {/* Backdrop con Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={() => setIsConfirmModalOpen(false)}
          ></div>

          {/* Tarjeta del Modal de Confirmación */}
          <div className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200 z-10 text-left">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/30">
                <Trash2 size={20} />
              </div>
              <h3 className="text-sm font-bold">
                Confirmar Baja Segura
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              ¿Está seguro de remover el acceso a <span className="font-semibold text-slate-900 dark:text-white">{userToDeactivate.Nombre}</span>?
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsConfirmModalOpen(false)}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeactivate}
                className="rounded-lg bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                Confirmar Baja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL EMERGENTE: AGREGAR USUARIO MANUAL (Glassmorphism + Transiciones) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          {/* Backdrop con Blur */}
          <div 
            className="absolute inset-0 bg-slate-950/40 dark:bg-slate-950/60 backdrop-blur-sm"
            onClick={() => {
              if (!modalLoading) setIsModalOpen(false);
            }}
          ></div>

          {/* Tarjeta del Formulario Modal */}
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-6 space-y-4 animate-in zoom-in-95 duration-200 z-10 text-left">
            
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-5 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950">
                  <UserPlus size={15} />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Agregar Usuario Manual
                </h3>
              </div>
              <button
                disabled={modalLoading}
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Banners de Éxito / Error */}
            {modalError && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/40 p-3.5 text-xs text-red-700 dark:text-red-400">
                <AlertCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Error en la transacción:</span>
                  <p className="mt-0.5 text-red-600/90 dark:text-red-400/95">{modalError}</p>
                </div>
              </div>
            )}

            {modalSuccess && (
              <div className="flex items-start gap-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-400 animate-in fade-in duration-300">
                <CheckCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Registro Exitoso:</span>
                  <p className="mt-0.5 text-emerald-600/90 dark:text-emerald-400/95">{modalSuccess}</p>
                </div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleAddUserSubmit} className="space-y-4">
              
              {/* Nombre */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    required
                    disabled={modalLoading || !!modalSuccess}
                    value={modalName}
                    onChange={(e) => setModalName(e.target.value)}
                    placeholder="Ej: Alexander Reyes"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-950 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Correo */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                    <Mail size={14} />
                  </span>
                  <input
                    type="email"
                    required
                    disabled={modalLoading || !!modalSuccess}
                    value={modalEmail}
                    onChange={(e) => setModalEmail(e.target.value)}
                    placeholder="ejemplo@sige.edu.gt"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-950 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Contraseña de Acceso
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 dark:text-slate-500">
                    <Lock size={14} />
                  </span>
                  <input
                    type="password"
                    required
                    disabled={modalLoading || !!modalSuccess}
                    value={modalPassword}
                    onChange={(e) => setModalPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-2 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-950 dark:focus:border-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* Rol Dropdown (CustomSelect premium reutilizado) */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1.5">
                  Rol Inicial
                </label>
                <CustomSelect
                  disabled={modalLoading || !!modalSuccess}
                  value={modalRol}
                  onChange={(val) => setModalRol(val)}
                  options={[
                    { value: 1, label: 'Administrador' },
                    { value: 2, label: 'Personal Académico' },
                    { value: 3, label: 'Profesor Docente' },
                    { value: 4, label: 'Alumno Regular' },
                    { value: 5, label: 'Padre de Familia' }
                  ]}
                />
              </div>

              {/* Acciones del Formulario */}
              <div className="flex gap-3 justify-end pt-3 border-t border-slate-50 dark:border-slate-800">
                <button
                  type="button"
                  disabled={modalLoading || !!modalSuccess}
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={modalLoading || !!modalSuccess}
                  className="flex items-center gap-1.5 rounded-lg bg-slate-950 dark:bg-slate-100 px-5 py-2 text-xs font-semibold text-white dark:text-slate-950 shadow-sm hover:bg-slate-800 dark:hover:bg-white transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {modalLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin" />
                      <span>Guardando...</span>
                    </>
                  ) : (
                    <span>Guardar Usuario</span>
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
