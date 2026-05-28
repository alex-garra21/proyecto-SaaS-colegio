import { Search } from 'lucide-react';
import CustomSelect from '../atoms/CustomSelect';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterRol: number;
  onRolChange: (value: number) => void;
  filterEstado: number;
  onEstadoChange: (value: number) => void;
}

export default function FilterBar({
  searchTerm,
  onSearchChange,
  filterRol,
  onRolChange,
  filterEstado,
  onEstadoChange
}: FilterBarProps) {
  const rolOptions = [
    { value: 0, label: 'Todos los Roles' },
    { value: 1, label: 'Administrador' },
    { value: 2, label: 'Personal Académico' },
    { value: 3, label: 'Profesor Docente' },
    { value: 4, label: 'Alumno Regular' },
    { value: 5, label: 'Padre de Familia' }
  ];

  const estadoOptions = [
    { value: 0, label: 'Todos los Estatus' },
    { value: 1, label: 'Activo' },
    { value: 2, label: 'Inactivo' }
  ];

  return (
    <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 flex flex-col sm:flex-row gap-3.5 items-center w-full">
      {/* Buscador */}
      <div className="relative w-full sm:flex-1">
        <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          placeholder="Buscar por nombre o correo..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 pl-8 pr-3 text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-950 dark:focus:border-slate-400 focus:outline-none transition-colors"
        />
      </div>

      {/* Filtro de Rol */}
      <div className="w-full sm:w-48 shrink-0">
        <CustomSelect
          value={filterRol}
          onChange={onRolChange}
          options={rolOptions}
        />
      </div>

      {/* Filtro de Estatus */}
      <div className="w-full sm:w-40 shrink-0">
        <CustomSelect
          value={filterEstado}
          onChange={onEstadoChange}
          options={estadoOptions}
        />
      </div>
    </div>
  );
}
