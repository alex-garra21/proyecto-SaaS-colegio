import React, { useMemo } from 'react';

export interface PagoPersistido {
  mesCiclo: number;
  monto: number;
}

interface FinancialSolvencyPredictorProps {
  pagosPersistidos?: PagoPersistido[];
}

export const FinancialSolvencyPredictor: React.FC<FinancialSolvencyPredictorProps> = ({
  pagosPersistidos = [
    { mesCiclo: 1, monto: 400 }, // Enero
    { mesCiclo: 2, monto: 400 }, // Febrero
    { mesCiclo: 3, monto: 400 }  // Marzo
  ]
}) => {
  // Regla de negocio: El ciclo regular guatemalteco comprende de Enero (Mes 1) a Octubre (Mes 10)
  const mesActualEvaluado = useMemo(() => {
    const mesCalendarioActual = new Date().getMonth() + 1; // 1 = Enero, 12 = Diciembre
    if (mesCalendarioActual > 10) return 10; // Tope financiero de cobro escolar al final de Octubre
    if (mesCalendarioActual < 1) return 1;
    return mesCalendarioActual;
  }, []);

  const ultimoMesPagadoRegistrado = useMemo(() => {
    return pagosPersistidos.length > 0 
      ? Math.max(...pagosPersistidos.map(p => p.mesCiclo)) 
      : 0;
  }, [pagosPersistidos]);
  
  const cuentaEsSolvente = useMemo(() => {
    return ultimoMesPagadoRegistrado >= mesActualEvaluado;
  }, [ultimoMesPagadoRegistrado, mesActualEvaluado]);

  const cantidadMesesAtrasados = useMemo(() => {
    return mesActualEvaluado - ultimoMesPagadoRegistrado;
  }, [mesActualEvaluado, ultimoMesPagadoRegistrado]);

  return (
    <div className="p-6 rounded-xl border border-outline-variant bg-surface-container-lowest shadow-sm font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-outline-variant">
        <div>
          <h3 className="text-base font-bold text-on-surface">Estado de Matrícula y Mensualidades</h3>
          <p className="text-xs text-on-surface-variant">Cálculo automático basado en cobros en ventanilla</p>
        </div>
        
        {cuentaEsSolvente ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-primary">
            AL DÍA / SOLVENTE
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-error animate-pulse">
            PENDIENTE DE PAGO ({cantidadMesesAtrasados} {cantidadMesesAtrasados === 1 ? 'Mes' : 'Meses'})
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-on-surface-variant">
        <div className="p-3 bg-surface-container-low rounded-md border border-outline-variant">
          <span className="block text-slate-400 mb-1">Mes de Curso Exigido:</span>
          <strong className="text-sm text-on-surface">Mes Número {mesActualEvaluado}</strong>
        </div>
        <div className="p-3 bg-surface-container-low rounded-md border border-outline-variant">
          <span className="block text-slate-400 mb-1">Último Pago Asentado:</span>
          <strong className="text-sm text-on-surface">Mes Número {ultimoMesPagadoRegistrado}</strong>
        </div>
      </div>
    </div>
  );
};