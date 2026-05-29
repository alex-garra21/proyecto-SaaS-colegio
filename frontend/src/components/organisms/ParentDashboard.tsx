import { useState, useMemo } from 'react';
import { 
  Star, ShieldCheck, Heart, 
  AlertCircle, Clock, Brain, 
  HelpCircle, ChevronRight, CheckCircle2 
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Tipo de Pago Persistido según interfacesAcademicas.ts
interface PagoPersistido {
  mesCiclo: number;
  monto: number;
}

interface HijoRecord {
  id: string;
  nombre: string;
  grado: string;
  seccion: string;
  asistencia: number; // porcentaje
  promedio: number;
  conducta: string;
  pagos: PagoPersistido[];
  recomendacionIA: string;
}

export default function ParentDashboard() {
  const { showToast } = useToast();
  
  // Encargado tiene 2 hijos registrados en el colegio
  const [hijos, setHijos] = useState<HijoRecord[]>([
    {
      id: 'ALU-10294',
      nombre: 'Juanito Pérez',
      grado: 'Primero Básico',
      seccion: 'Sección A',
      asistencia: 96,
      promedio: 88,
      conducta: 'Excelente',
      pagos: [
        { mesCiclo: 1, monto: 400 }, // Enero
        { mesCiclo: 2, monto: 400 }, // Febrero
        { mesCiclo: 3, monto: 400 }, // Marzo
        { mesCiclo: 4, monto: 400 }, // Abril
        { mesCiclo: 5, monto: 400 }  // Mayo
      ],
      recomendacionIA: 'La IA del colegio detecta un rendimiento inferior en los temas de cinemática y leyes de Newton. Se le aconseja al alumno realizar las tutorías de Física los días jueves y utilizar el módulo de ejercicios interactivos en línea.'
    },
    {
      id: 'ALU-10298',
      nombre: 'Sofía Pérez',
      grado: 'Tercero Básico',
      seccion: 'Sección B',
      asistencia: 98,
      promedio: 94,
      conducta: 'Sobresaliente',
      pagos: [
        { mesCiclo: 1, monto: 400 }, // Enero
        { mesCiclo: 2, monto: 400 }, // Febrero
        { mesCiclo: 3, monto: 400 }  // Marzo
      ],
      recomendacionIA: 'Sofía mantiene un rendimiento sobresaliente en Lenguaje y Literatura. Se recomienda inscribirla en el Club de Debate de la tarde para potenciar sus altas capacidades de retórica.'
    }
  ]);

  const [activeHijoId, setActiveHijoId] = useState<string>('ALU-10294');
  const activeHijo = useMemo(() => hijos.find(h => h.id === activeHijoId)!, [hijos, activeHijoId]);

  // --- LÓGICA DE COBRO GUATEMALTECO DE interfacesAcademicas.ts ---
  const mesActualEvaluado = useMemo(() => {
    const mesCalendarioActual = new Date().getMonth() + 1; // 1 = Enero, 12 = Diciembre
    if (mesCalendarioActual > 10) return 10; // Enero (1) a Octubre (10)
    if (mesCalendarioActual < 1) return 1;
    return mesCalendarioActual;
  }, []);

  const ultimoMesPagadoRegistrado = useMemo(() => {
    return activeHijo.pagos.length > 0 
      ? Math.max(...activeHijo.pagos.map(p => p.mesCiclo)) 
      : 0;
  }, [activeHijo]);
  
  const cuentaEsSolvente = useMemo(() => {
    return ultimoMesPagadoRegistrado >= mesActualEvaluado;
  }, [ultimoMesPagadoRegistrado, mesActualEvaluado]);

  const cantidadMesesAtrasados = useMemo(() => {
    return mesActualEvaluado - ultimoMesPagadoRegistrado;
  }, [mesActualEvaluado, ultimoMesPagadoRegistrado]);

  const handlePagarVentanillaSimular = () => {
    if (cuentaEsSolvente) {
      showToast('Tu cuenta de colegiatura ya se encuentra solvente para el mes actual.', 'success');
      return;
    }
    const siguienteMes = ultimoMesPagadoRegistrado + 1;
    setHijos(prev => prev.map(h => {
      if (h.id === activeHijoId) {
        return {
          ...h,
          pagos: [...h.pagos, { mesCiclo: siguienteMes, monto: 400 }]
        };
      }
      return h;
    }));
    showToast(`Pago de colegiatura mensualidad del mes ${siguienteMes} realizado con éxito en ventanilla virtual.`, 'success');
  };

  return (
    <div className="space-y-6 text-slate-800 animate-in fade-in duration-300 font-sans">
      
      {/* Cabecera Empática para Padres */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 flex items-center gap-1">
            <Heart size={12} className="fill-emerald-500 text-emerald-500" />
            Portal de Padres (ParentPortal)
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
            ¡Bienvenido de nuevo, Padre de Familia!
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitorea el progreso de tus hijos, el estado de solvencia de colegiaturas y las recomendaciones predictivas del colegio.
          </p>
        </div>

        {/* Picker de Hijos (rounded-xl empático) */}
        <div className="flex items-center gap-2 bg-white border border-slate-150 p-1.5 rounded-xl self-start">
          {hijos.map(h => (
            <button
              key={h.id}
              onClick={() => {
                setActiveHijoId(h.id);
                showToast(`Visualizando el expediente de ${h.nombre}.`, 'success');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeHijoId === h.id
                  ? 'bg-slate-950 text-white shadow-sm'
                  : 'bg-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              {h.nombre.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Principal Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Expediente del Hijo (Columna 2/3 - Bento Grid) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bento Grid de Tarjetas de Expediente */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Promedio General */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] mb-3">
                  <Star size={18} className="fill-blue-500 text-blue-500" />
                </div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Promedio Escolar
                </span>
                <strong className="text-3xl font-black text-slate-900 mt-1 block">
                  {activeHijo.promedio}%
                </strong>
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold mt-3 block">
                ¡Rendimiento Académico Aprobado!
              </span>
            </div>

            {/* Asistencia */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 mb-3">
                  <Clock size={18} />
                </div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Asistencia a Clase
                </span>
                <strong className="text-3xl font-black text-slate-900 mt-1 block">
                  {activeHijo.asistencia}%
                </strong>
              </div>
              <span className="text-[10px] text-slate-450 mt-3 block font-mono">
                Solo 2 ausencias justificadas
              </span>
            </div>

            {/* Conducta */}
            <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm text-left flex flex-col justify-between">
              <div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3">
                  <ShieldCheck size={18} />
                </div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Conducta del Alumno
                </span>
                <strong className="text-2xl font-black text-slate-900 mt-1 block">
                  {activeHijo.conducta}
                </strong>
              </div>
              <span className="text-[10px] text-indigo-600 font-semibold mt-3 block">
                Comportamiento intachable
              </span>
            </div>

          </div>

          {/* Predictor de Solvencia Financiera (interfacesAcademicas.ts) */}
          <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 mb-4 gap-2">
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900">
                  Estado de Matrícula y Mensualidades
                </h3>
                <p className="text-[11px] text-[#64748B]">
                  Cálculo automático de solvencia según colegiaturas guatemaltecas (Enero - Octubre)
                </p>
              </div>
              
              {cuentaEsSolvente ? (
                <span className="px-3.5 py-1 text-[10px] font-bold rounded-full bg-blue-50 text-[#2563EB] border border-blue-100 flex items-center gap-1 select-none">
                  <CheckCircle2 size={12} />
                  AL DÍA / SOLVENTE
                </span>
              ) : (
                <span className="px-3.5 py-1 text-[10px] font-bold rounded-full bg-red-50 text-red-600 border border-red-100 animate-pulse flex items-center gap-1 select-none">
                  <AlertCircle size={12} />
                  PENDIENTE DE PAGO ({cantidadMesesAtrasados} {cantidadMesesAtrasados === 1 ? 'Mes' : 'Meses'})
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                <span className="block text-slate-400 mb-1">Mes de Curso Exigido:</span>
                <strong className="text-sm text-slate-900">Mes Número {mesActualEvaluado} (Junio)</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-150">
                <span className="block text-slate-400 mb-1">Último Pago Asentado:</span>
                <strong className="text-sm text-slate-900">Mes Número {ultimoMesPagadoRegistrado}</strong>
              </div>
            </div>

            {/* Acción de Pago simulado en ventanilla virtual */}
            {!cuentaEsSolvente && (
              <div className="mt-4 bg-amber-50 border border-amber-100 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                  <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={16} />
                  <p className="text-[11px] text-amber-800 leading-normal">
                    <strong>Pagar Colegiatura:</strong> Tienes cuotas pendientes. Cancela de inmediato para evitar la restricción en la visualización de calificaciones académicas.
                  </p>
                </div>
                
                <button
                  onClick={handlePagarVentanillaSimular}
                  className="rounded-lg bg-slate-950 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition shadow-md whitespace-nowrap cursor-pointer"
                >
                  Pagar Q400.00
                </button>
              </div>
            )}
            
            {cuentaEsSolvente && (
              <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="text-[#2563EB] shrink-0" size={16} />
                <p className="text-[11px] text-blue-800 leading-normal">
                  <strong>¡Gracias por tu pago puntual!</strong> Las colegiaturas se encuentran al día. Tu hijo tiene acceso total y sin demoras a las actividades curriculares.
                </p>
              </div>
            )}
          </div>

        </div>

        {/* Recomendaciones IA y Boletas (Columna 1/3) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Predicciones IA de SIGE */}
          <div className="rounded-2xl bg-slate-950 p-6 shadow-xl text-white space-y-4 border border-slate-800 text-left">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 leading-none">
              <Brain size={16} className="text-indigo-400 animate-pulse" />
              Métricas Predictivas IA
            </h3>

            <div className="space-y-4">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Riesgo Académico Estimado
                </span>
                <h4 className="text-2xl font-black text-white leading-none mt-1">
                  {activeHijo.promedio >= 90 ? '2.4%' : '24.5%'}
                </h4>
              </div>

              <div className="border-t border-slate-800 pt-3">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Recomendaciones Personalizadas
                </span>
                <p className="text-[10px] text-slate-350 leading-relaxed">
                  {activeHijo.recomendacionIA}
                </p>
              </div>
            </div>
          </div>

          {/* Enlaces de Ayuda y PBX */}
          <div className="bg-white border border-slate-150 rounded-2xl p-5 shadow-sm space-y-3 text-left">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-2">
              <HelpCircle size={15} className="text-emerald-500" />
              Soporte y Dudas de Matrícula
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Si el expediente escolar o los pagos asentados en ventanilla física no coinciden, escribe de inmediato a secretaría.
            </p>
            <button
              onClick={() => alert('Información Escolar:\nPBX: +502 2300-4200 (Ext. 101)\nsecretaria@sige.edu.gt')}
              className="flex w-full items-center justify-between rounded-xl bg-slate-50 hover:bg-slate-100 px-3.5 py-2.5 text-xs font-bold text-slate-800 transition border border-slate-100 cursor-pointer"
            >
              <span>Llamar a Secretaría</span>
              <ChevronRight size={14} className="text-slate-400" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
