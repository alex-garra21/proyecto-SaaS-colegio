import { useState } from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps {
  label?: string;
  value: string | number;
  options: Option[];
  onChange: (value: any) => void;
  className?: string;
}

export default function CustomSelect({ label, value, options, onChange, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative ${className}`}>
      {label && (
        <span className="block text-xs font-black uppercase tracking-wider text-[#5d6b82] mb-2">
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="admin-input h-12 w-full rounded-2xl border border-[#c3c6d7] bg-white px-4 text-left text-sm text-[#191c1e] outline-none flex items-center justify-between transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
      >
        <span>{selectedOption?.label}</span>
        <span className="text-[#5d6b82] text-xs">▼</span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-2xl border border-[#c3c6d7] bg-white shadow-xl max-h-60 overflow-y-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left text-sm hover:bg-[#f7f9fb] transition ${
                option.value === value ? 'bg-[#eef4ff] font-bold text-[#004ac6]' : 'text-[#191c1e]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
