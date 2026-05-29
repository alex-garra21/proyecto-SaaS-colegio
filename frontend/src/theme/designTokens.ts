/**
 * Centralización de Tokens de UI y Gobernanza de Color para SIGE
 * Cumpliendo estrictamente con las directrices estéticas de .cursorrules
 */

export const designTokens = {
  // Paleta Cromática Principal
  colors: {
    brand: {
      primary: 'bg-slate-950 dark:bg-slate-900',
      primaryHover: 'hover:bg-slate-800 dark:hover:bg-slate-700',
      primaryText: 'text-slate-900 dark:text-slate-50',
      secondaryText: 'text-slate-500 dark:text-slate-400',
      borderLight: 'border-slate-100 dark:border-slate-800/80',
      borderFocus: 'focus:border-slate-900 dark:focus:border-slate-100',
      bgApp: 'bg-slate-50 dark:bg-slate-950',
      bgCard: 'bg-white dark:bg-slate-900/60',
      sigeBlue: 'bg-[#2563EB] dark:bg-[#3b82f6]',
      sigeBlueHover: 'hover:bg-[#1d4ed8] dark:hover:bg-[#2563eb]',
      sigeBlueText: 'text-[#2563EB] dark:text-[#3b82f6]',
      sigeSlateText: 'text-[#64748B] dark:text-[#94a3b8]',
      sigeSlateBorder: 'border-[#E2E8F0] dark:border-[#334155]',
    },
    status: {
      success: {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-100 dark:border-emerald-900/40',
        icon: 'text-emerald-600 dark:text-emerald-400',
      },
      error: {
        bg: 'bg-red-50 dark:bg-red-950/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-100 dark:border-red-900/40',
        icon: 'text-red-600 dark:text-red-400',
      },
      warning: {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-100 dark:border-amber-900/40',
        icon: 'text-amber-600 dark:text-amber-400',
        accentBg: 'bg-amber-500 dark:bg-amber-600',
      },
    },
  },

  // Efecto Premium Glassmorphism
  glassmorphism: {
    premium: 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-100/80 dark:border-slate-800/50 shadow-2xl',
    card: 'backdrop-blur-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl',
  },

  // Tipografías y Espaciado Adaptativos
  typography: {
    h1: 'text-4xl font-extrabold tracking-tight',
    h2: 'text-3xl font-extrabold tracking-tight',
    h3: 'text-lg font-semibold',
    label: 'text-xs font-semibold uppercase tracking-wider',
    body: 'text-sm text-slate-500 dark:text-slate-400 leading-relaxed',
  },

  // Transiciones y Microinteracciones
  transitions: {
    default: 'transition-all duration-300 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    bounce: 'transition-all duration-300 cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};
