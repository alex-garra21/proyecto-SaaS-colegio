import React, { useMemo } from 'react';

export interface PagoPersistido {
  mesCiclo: number;
  monto: number;
}

export interface CursoBase {
  id: string; // UUID o código correlativo (ej: "CUR-MAT")
  nombre: string; // Ej: "Matemáticas", "Lenguaje"
}

export interface GradoBase {
  id: 'FIRST_BASIC' | 'SECOND_BASIC' | 'THIRD_BASIC';
  nombre: string; // "Primero Básico", "Segundo Básico", "Tercero Básico"
}

export interface CicloLectivo {
  anio: number; // Ej: 2025, 2026
}

export interface AsignacionSeccion {
  id: string;
  nombreAsignacion: string; // Ej: "Primero Básico Sección A"
  gradoId: 'FIRST_BASIC' | 'SECOND_BASIC' | 'THIRD_BASIC';
  cicloAnio: number;
  estudiantesIds: string[]; // Listado masivo asignado por Control Académico
}

export interface HorarioDocenteCurso {
  id: string;
  docenteId: string;
  cursoId: string;
  seccionId: string;
  diaSemana: number; // 1 = Lunes, 5 = Viernes
  horaInicio: string; // Formato "HH:MM" (ej: "07:30")
  horaFin: string; // Formato "HH:MM" (ej: "08:15")
}

export interface PagoMensualidadManual {
  id: string;
  estudianteId: string;
  mesCiclo: number; // 1 = Enero, 10 = Octubre (Meses de cobro regular en Guatemala)
  monto: number;
  referenciaRecibo: string;
  fechaTransaccion: string; // ISO String
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
    <div className="p-6 rounded-xl border border-slate-100 bg-white shadow-sm font-sans">
      <div className="flex items-center justify-between pb-4 border-b border-dashed border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900">Estado de Matrícula y Mensualidades</h3>
          <p className="text-xs text-slate-500">Cálculo automático basado en cobros en ventanilla</p>
        </div>
        
        {cuentaEsSolvente ? (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-blue-50 text-blue-600">
            AL DÍA / SOLVENTE
          </span>
        ) : (
          <span className="px-3 py-1 text-xs font-bold rounded-full bg-red-50 text-red-600 animate-pulse">
            PENDIENTE DE PAGO ({cantidadMesesAtrasados} {cantidadMesesAtrasados === 1 ? 'Mes' : 'Meses'})
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-xs text-slate-500">
        <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
          <span className="block text-slate-400 mb-1">Mes de Curso Exigido:</span>
          <strong className="text-sm text-slate-900">Mes Número {mesActualEvaluado}</strong>
        </div>
        <div className="p-3 bg-slate-50 rounded-md border border-slate-100">
          <span className="block text-slate-400 mb-1">Último Pago Asentado:</span>
          <strong className="text-sm text-slate-900">Mes Número {ultimoMesPagadoRegistrado}</strong>
        </div>
      </div>
    </div>
  );
};
