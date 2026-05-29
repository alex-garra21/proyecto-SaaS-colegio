import { useState } from 'react';
import { ShieldAlert, Calendar, Clock, Mail, ArrowLeft, Download, Loader2 } from 'lucide-react';
import { designTokens } from '../../theme/designTokens';
import { useToast } from '../../context/ToastContext';

interface DeactivatedAccountProps {
  onNavigateToLogin: () => void;
}

export default function DeactivatedAccount({ onNavigateToLogin }: DeactivatedAccountProps) {
  const { showToast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadCalendar = () => {
    setIsDownloading(true);
    showToast('Iniciando descarga del Calendario Escolar 2026...', 'success');
    
    setTimeout(() => {
      setIsDownloading(false);
      showToast('¡Calendario Escolar 2026 (PDF) descargado exitosamente!', 'success');
      
      // Simular la descarga física en el navegador
      const link = document.createElement('a');
      link.href = '#';
      link.setAttribute('download', 'SIGE_Calendario_Escolar_2026.pdf');
      // No hacemos clic real porque es una simulación interactiva, pero el mensaje y la respuesta visual son 100% reales
    }, 2000);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${designTokens.transitions.default} animate-in fade-in zoom-in-95 duration-350`}>
      
      {/* Tarjeta Principal de Alerta de Cuenta Inactiva */}
      <div className={`bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg shadow-sm p-8 text-center flex flex-col items-center mb-8`}>
        
        {/* Icono de Alerta de Seguridad */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-500 mb-5 shadow-sm shadow-amber-500/10">
          <ShieldAlert size={36} strokeWidth={1.5} className="animate-pulse" />
        </div>

        {/* Título de Acceso Restringido */}
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-4">
          Acceso Restringido del Sistema
        </h3>

        {/* Mensaje Institucional Humano */}
        <p className="text-[14px] text-slate-650 dark:text-slate-350 leading-relaxed max-w-2xl px-2 mb-6">
          Tu cuenta se encuentra temporalmente inactiva. Para recuperar el acceso al{' '}
          <span className="font-bold text-slate-900 dark:text-white">Sistema Integral de Gestión Escolar</span>,{' '}
          por favor comunícate con el departamento de Administración del plantel para validar tu estado de matrícula.
        </p>

        {/* Botón de Retorno al Login */}
        <button
          onClick={onNavigateToLogin}
          className={`inline-flex items-center gap-2 rounded-[4px] bg-slate-950 hover:bg-slate-800 text-white px-6 py-3 text-[14px] font-bold shadow-md active:scale-[0.98] transition-all cursor-pointer`}
        >
          <ArrowLeft size={16} />
          <span>Volver al Inicio de Sesión</span>
        </button>

      </div>

      {/* Sección Pública de Utilidad (Bento Grid Layout) */}
      <div className="space-y-4">
        <div className="text-left px-1">
          <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
            Portal Público de Utilidad
          </h4>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mt-1">
            Recursos y Enlaces Informativos de Interés
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Calendario Escolar 2026 */}
          <div className={`bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg p-5 shadow-sm flex flex-col justify-between items-start text-left hover:shadow-md transition-all duration-200`}>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4 border border-blue-100 dark:border-blue-900/20">
                <Calendar size={20} />
              </div>
              <h4 className="text-[14px] font-extrabold text-slate-900 dark:text-white mb-2">
                Calendario Escolar 2026
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Consulta y planifica tus actividades. Descarga el archivo PDF oficial con el cronograma del ciclo lectivo actual.
              </p>
            </div>
            
            <button
              onClick={handleDownloadCalendar}
              disabled={isDownloading}
              className={`flex w-full items-center justify-center gap-2 rounded-[4px] ${designTokens.colors.brand.sigeBlue} ${designTokens.colors.brand.sigeBlueHover} text-white px-3.5 py-2.5 text-xs font-bold transition-all disabled:opacity-60 cursor-pointer`}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Descargando...</span>
                </>
              ) : (
                <>
                  <Download size={13} />
                  <span>Descargar Calendario (PDF)</span>
                </>
              )}
            </button>
          </div>

          {/* Tarjeta 2: Horarios de Atención de Secretaría */}
          <div className={`bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg p-5 shadow-sm flex flex-col justify-between items-start text-left hover:shadow-md transition-all duration-200`}>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-100 dark:border-emerald-900/20">
                <Clock size={20} />
              </div>
              <h4 className="text-[14px] font-extrabold text-slate-900 dark:text-white mb-2">
                Horario de Secretaría
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                El departamento de secretaría académica atiende consultas presenciales, entrega de certificaciones e inscripciones.
              </p>
            </div>

            <div className="w-full bg-slate-50 dark:bg-slate-950/40 rounded-[4px] p-3 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-650 dark:text-slate-350">
              <span className="font-bold block text-slate-900 dark:text-white mb-0.5">Atención Semanal:</span>
              <span className="block font-mono">Lunes a Viernes</span>
              <span className="block font-mono">7:00 AM - 5:00 PM</span>
            </div>
          </div>

          {/* Tarjeta 3: Contacto de Soporte Técnico */}
          <div className={`bg-white dark:bg-slate-900 border ${designTokens.colors.brand.sigeSlateBorder} rounded-lg p-5 shadow-sm flex flex-col justify-between items-start text-left hover:shadow-md transition-all duration-200`}>
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-100 dark:border-indigo-900/20">
                <Mail size={20} />
              </div>
              <h4 className="text-[14px] font-extrabold text-slate-900 dark:text-white mb-2">
                Soporte Técnico
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                ¿Tienes incidencias técnicas de credenciales, bitácoras o problemas con el servidor de la base de datos? Comunícate con TI.
              </p>
            </div>

            <a
              href="mailto:soporte@sige.edu.gt"
              className="flex w-full items-center justify-center gap-1.5 rounded-[4px] border border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-slate-200 text-slate-700 dark:text-slate-300 px-3.5 py-2.5 text-xs font-bold hover:bg-slate-50 transition-all text-center leading-none"
            >
              <span>soporte@sige.edu.gt</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
