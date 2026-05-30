import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'kids' | 'kids-yellow' | 'admin-action' | 'danger' | 'success';
  className?: string;
}

export default function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  let baseClass = 'font-bold transition-all duration-200 active:scale-95 ';
  
  if (variant === 'primary') {
    baseClass += 'h-[56px] w-full rounded-xl bg-[#004ddb] text-2xl leading-8 text-white shadow-md hover:-translate-y-1';
  } else if (variant === 'secondary') {
    baseClass += 'rounded bg-[#d3e4fe] px-7 py-4 text-lg text-[#0b1c30] hover:opacity-90';
  } else if (variant === 'kids') {
    baseClass += 'student-pressable rounded-xl bg-[#0058bd] px-6 py-4 text-white hover:opacity-90';
  } else if (variant === 'kids-yellow') {
    baseClass += 'student-pressable rounded-full bg-[#fdd029] px-9 py-5 text-2xl text-[#231b00] hover:opacity-90';
  } else if (variant === 'admin-action') {
    baseClass += 'rounded-lg border border-[#c3c6d7] bg-white px-4 py-3 text-sm text-[#004ac6] hover:bg-[#f7f9fb]';
  } else if (variant === 'danger') {
    baseClass += 'rounded-2xl bg-[#ba1a1a] px-5 py-3 text-white hover:bg-[#93000a]';
  } else if (variant === 'success') {
    baseClass += 'inline-flex items-center justify-center gap-2 rounded-2xl bg-[#007a43] px-5 py-3 text-white hover:bg-[#006b3b]';
  }

  return (
    <button className={`${baseClass} ${className}`} {...props}>
      {children}
    </button>
  );
}
