import { CheckCircle, AlertCircle, X } from 'lucide-react';
import type { ToastType } from '../../context/ToastContext';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const isSuccess = type === 'success';
  
  return (
    <div
      className={`pointer-events-auto flex items-center justify-between gap-3 w-full rounded-xl border p-3.5 shadow-xl transition-all duration-300 animate-in slide-in-from-bottom-5 fade-in ${
        isSuccess
          ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300'
          : 'bg-red-50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50 text-red-800 dark:text-red-300'
      }`}
    >
      <div className="flex items-start gap-2.5">
        {isSuccess ? (
          <CheckCircle className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        ) : (
          <AlertCircle className="h-4.5 w-4.5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
        )}
        <span className="text-[11.5px] font-semibold leading-relaxed">{message}</span>
      </div>
      
      <button
        onClick={onClose}
        className={`shrink-0 p-0.5 rounded-lg transition-colors cursor-pointer ${
          isSuccess
            ? 'text-emerald-500 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:text-emerald-700 dark:hover:text-emerald-300'
            : 'text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-700 dark:hover:text-red-300'
        }`}
      >
        <X size={14} />
      </button>
    </div>
  );
}
