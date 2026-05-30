import { type InputHTMLAttributes, type ReactNode } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export default function InputField({
  label,
  icon,
  className = '',
  containerClassName = '',
  ...props
}: InputFieldProps) {
  return (
    <div className={`grid gap-1 ${containerClassName}`}>
      {label && (
        <span className="block text-sm font-semibold leading-5 tracking-[0.02em] text-[#434655]">
          {label}
        </span>
      )}
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737687] flex items-center">
            {icon}
          </div>
        )}
        <input
          className={`h-[56px] w-full rounded-lg border-2 border-[#eae8e7] bg-[#fbf9f8] text-lg leading-7 text-[#1b1c1c] outline-none transition-colors focus:border-[#004ddb] ${
            icon ? 'pl-12' : 'px-4'
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
}
