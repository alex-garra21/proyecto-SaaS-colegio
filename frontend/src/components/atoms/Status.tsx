export default function Status({ value }: { value: string }) {
  const tone = value.includes('Riesgo') || value.includes('Conflictiva') || value.includes('Pendiente') 
    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300' 
    : value.includes('Inactivo') 
      ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-300' 
      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
      
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-black ${tone}`}>
      {value}
    </span>
  );
}
