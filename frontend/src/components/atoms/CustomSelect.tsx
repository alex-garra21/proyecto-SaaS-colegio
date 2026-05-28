import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: number;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: number;
  onChange: (val: number) => void;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  disabled = false
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Encontrar la etiqueta seleccionada actualmente
  const selectedOption = options.find((opt) => opt.value === value);

  // Escuchador para cerrar el dropdown al hacer clic fuera del componente
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelectOption = (optValue: number) => {
    onChange(optValue);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-left">
      {/* Botón principal */}
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-1.5 px-3 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all duration-150 ease-in-out hover:border-slate-300 dark:hover:border-slate-600 focus:border-slate-950 dark:focus:border-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-950 dark:focus:ring-slate-400 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
      >
        <span className="truncate">{selectedOption ? selectedOption.label : 'Seleccionar...'}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 dark:text-slate-500 transition-transform duration-200 ease-in-out shrink-0 ${
            isOpen ? 'rotate-180 text-slate-700 dark:text-slate-200' : ''
          }`}
        />
      </button>

      {/* Contenedor flotante */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 py-1 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-1 duration-150">
          <ul className="divide-y divide-slate-50 dark:divide-slate-750">
            {options.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelectOption(opt.value)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-xs text-left cursor-pointer transition-colors duration-100 ${
                      isSelected
                        ? 'bg-slate-50 dark:bg-slate-700/50 text-slate-950 dark:text-white font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/30 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-950 dark:bg-white shrink-0 ml-2"></span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
