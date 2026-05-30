import { type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Buscar...', className = '', ...props }: SearchInputProps) {
  return (
    <div className={`relative w-full md:w-80 ${className}`}>
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7990aa]" size={18} />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="admin-input h-11 w-full rounded-xl border border-[#c3c6d7] bg-[#f6f9fd] pl-11 pr-4 text-sm outline-none transition focus:border-[#004ac6] focus:ring-2 focus:ring-[#004ac6]/15"
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
}
