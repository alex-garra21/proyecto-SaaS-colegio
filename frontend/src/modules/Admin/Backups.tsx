import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  Database,
  CheckCircle,
  ShieldCheck,
  Calendar,
  Download,
  Loader2
} from 'lucide-react';

export default function Backups() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [backupSize, setBackupSize] = useState('24.8 MB');
  const [uptime, setUptime] = useState('99.98%');
  const [motorStatus, setMotorStatus] = useState('ONLINE');
  const [backupHistory, setBackupHistory] = useState<any[]>([]);
  const [isGeneratingBackup, setIsGeneratingBackup] = useState(false);
  const [isDownloadingId, setIsDownloadingId] = useState<number | null>(null);

  // Estados para el Respaldo Automático de 30 minutos
  const [automatedStatus, setAutomatedStatus] = useState<string | null>(null);
  const [isDownloadingAutomated, setIsDownloadingAutomated] = useState(false);

  const fetchBackupData = async () => {
    try {
      const statsRes = await fetch('http://localhost:4000/api/backup/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setBackupSize(`${statsData.sizeMB} MB`);
          setUptime(statsData.uptime || '99.98%');
          setMotorStatus(statsData.motorStatus || 'ONLINE');
        }
      }

      const historyRes = await fetch('http://localhost:4000/api/backup/history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (historyRes.ok) {
        const historyData = await historyRes.json();
        setBackupHistory(historyData);
      }
    } catch (error) {
      console.error('Error al cargar datos del backup:', error);
    }
  };

  const fetchAutomatedStatus = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/backup/automated/status', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setAutomatedStatus(data.lastExecution);
        }
      }
    } catch (error) {
      console.error('Error al cargar estado del backup automático:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchBackupData();
      fetchAutomatedStatus();
    }
  }, [token]);

  const handleGenerateBackup = async () => {
    setIsGeneratingBackup(true);
    try {
      const res = await fetch('http://localhost:4000/api/backup/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al ejecutar backup');
      }

      // Descargar el archivo binario mediante stream asíncrono seguro
      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = 'SIGE_Backup_Manual.bak';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/i);
        if (match && match[1]) {
          filename = match[1].trim();
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast(`¡Respaldo ${filename} generado y descargado con éxito!`, 'success');
      
      // Refrescar historial, tamaño y ciclos
      await fetchBackupData();
      await fetchAutomatedStatus();
    } catch (err: any) {
      console.error(err);
      showToast(`Error al ejecutar el respaldo: ${err.message}`, 'error');
    } finally {
      setIsGeneratingBackup(false);
    }
  };

  const handleDownloadHistory = async (id: number) => {
    setIsDownloadingId(id);
    try {
      const res = await fetch(`http://localhost:4000/api/backup/download/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al descargar el respaldo histórico');
      }

      const blob = await res.blob();
      const contentDisposition = res.headers.get('Content-Disposition');
      let filename = `SIGE_Backup_${id}.bak`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename=(.+)/i);
        if (match && match[1]) {
          filename = match[1].trim();
        }
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast(`¡Respaldo ${filename} descargado con éxito!`, 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error de descarga: ${err.message}`, 'error');
    } finally {
      setIsDownloadingId(null);
    }
  };

  const handleDownloadAutomated = async () => {
    setIsDownloadingAutomated(true);
    try {
      const res = await fetch('http://localhost:4000/api/backup/automated/download', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || 'Error al descargar el respaldo automático');
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'SIGE_Automated_Latest.bak');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast('¡Respaldo automático SIGE_Automated_Latest.bak descargado con éxito!', 'success');
    } catch (err: any) {
      console.error(err);
      showToast(`Error de descarga: ${err.message}`, 'error');
    } finally {
      setIsDownloadingAutomated(false);
    }
  };

  const formattedDate = new Date().toLocaleDateString('es-GT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      
      {/* Cabecera del Módulo */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Módulo de Backups
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Descarga de respaldo físico de la base de datos <code className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">SistemaColegio</code> en la nube.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 shadow-sm capitalize">
          <Calendar size={14} className="text-slate-400" />
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Grid Adaptable al Diseño */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Principal Izquierda (2/3 de ancho) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Tarjeta de Formulario de Generación Manual */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[300px]">
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">
                  <Database size={24} className="animate-pulse text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Respaldo Manual en la Nube
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Genera y descarga un archivo físico binario completo <code className="font-mono text-[9px] bg-slate-50 dark:bg-slate-800 p-0.5 rounded">.bak</code> con integridad referencial verificada de forma instantánea.
                </p>
              </div>

              <div className="w-full space-y-3">
                <button
                  onClick={handleGenerateBackup}
                  disabled={isGeneratingBackup}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 dark:bg-slate-100 hover:bg-slate-855 dark:hover:bg-white text-white dark:text-slate-950 px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer font-sans"
                >
                  {isGeneratingBackup ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <Database size={13} />
                      <span>Generar y Descargar Respaldo</span>
                    </>
                  )}
                </button>
                <span className="block text-[9px] text-slate-400 dark:text-slate-500">Transmisión asíncrona compatible con Vercel.</span>
              </div>
            </div>

            {/* Tarjeta de Respaldo Automático del Sistema */}
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center justify-between text-center min-h-[300px]">
              <div className="flex flex-col items-center">
                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700">
                  <svg className="h-6 w-6 text-emerald-500 dark:text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Respaldo Automático del Sistema
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                  Copia de seguridad cíclica autogenerada por el motor de base de datos de SIGE cada 30 minutos de forma persistente.
                </p>
              </div>

              <div className="w-full space-y-3">
                <div className="bg-slate-50 dark:bg-slate-800/60 rounded-lg p-2.5 border border-slate-100/60 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="font-semibold text-slate-700 dark:text-slate-350 block">Último ciclo completado:</span>
                  <span className="font-mono text-slate-600 dark:text-slate-300">{automatedStatus || 'En inicialización...'}</span>
                </div>
                
                <button
                  onClick={handleDownloadAutomated}
                  disabled={isDownloadingAutomated}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2.5 text-xs font-bold shadow-md hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer font-sans"
                >
                  {isDownloadingAutomated ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Transmitiendo...</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      <span>Descargar Copia de 30 mins</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Columna Lateral Derecha (1/3 de ancho) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Tarjeta de Estadísticas de Servidor */}
          <div className="rounded-xl bg-slate-950 p-5 shadow-xl text-white space-y-5 border border-slate-800">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                Estado del Motor Local
              </span>
              <h2 className="text-3xl font-extrabold tracking-tight text-white mt-1 leading-none">
                {uptime}
              </h2>
              <span className="text-[9px] text-emerald-400 font-bold block mt-1">Uptime del Servidor SQL ({motorStatus})</span>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 text-left">
              <div>
                <span className="block text-[9px] uppercase tracking-wide text-slate-500">BD Físico</span>
                <span className="text-xs font-bold text-slate-200">SistemaColegio</span>
              </div>
              <div>
                <span className="block text-[9px] uppercase tracking-wide text-slate-500">Backup Size</span>
                <span className="text-xs font-bold text-slate-200">{backupSize}</span>
              </div>
            </div>
          </div>

          {/* Curator Insights */}
          <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm space-y-3.5">
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider pb-2 border-b border-slate-50 dark:border-slate-800">
              Monitoreo del Servidor
            </h3>

            <div className="space-y-3">
              <div className="flex gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
                <ShieldCheck className="text-emerald-500 shrink-0 mt-0.5" size={15} />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-200">Uso de Roles Nativos:</h4>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Conexión bajo privilegios exclusivos de <code className="font-mono text-[8px] bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-855 rounded px-0.5">AdminRole</code>.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
                <CheckCircle className="text-indigo-500 shrink-0 mt-0.5" size={15} />
                <div>
                  <h4 className="text-[10px] font-bold text-slate-900 dark:text-slate-200">Seguridad Relacional:</h4>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                    Descarga directa de archivos sin almacenamiento persistente en disco web local, blindado contra robos físicos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historial en la base (ancho total) */}
      <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-950 dark:text-slate-200 uppercase tracking-wider">
            Historial de Respaldos Físicos Guardados
          </h3>
          <span className="inline-flex items-center gap-1 rounded bg-slate-950 dark:bg-slate-855 text-[9px] px-2.5 py-1 text-white font-bold select-none">
            Servidor SQL Activo
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                <th className="py-3 px-5">ID</th>
                <th className="py-3 px-5">Fecha Respaldo</th>
                <th className="py-3 px-5">Tamaño</th>
                <th className="py-3 px-5">Estado</th>
                <th className="py-3 px-5 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              {backupHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 dark:text-slate-500 font-sans text-xs">
                    Cargando historial de respaldos físicos desde Somee...
                  </td>
                </tr>
              ) : (
                backupHistory.map((hist) => (
                  <tr key={hist.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-400 dark:text-slate-500">{hist.id}</td>
                    <td className="py-3.5 px-5 font-medium text-slate-900 dark:text-slate-200 font-mono">{hist.fecha}</td>
                    <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400">{hist.size}</td>
                    <td className="py-3.5 px-5">
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 dark:text-emerald-400 border border-emerald-100/40 dark:border-emerald-900/40">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        {hist.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <button
                        onClick={() => handleDownloadHistory(hist.id)}
                        disabled={isDownloadingId !== null}
                        className="inline-flex items-center justify-center p-1.5 rounded-lg text-slate-700 dark:text-slate-350 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer disabled:opacity-40"
                        title="Descargar este respaldo"
                      >
                        {isDownloadingId === hist.id ? (
                          <Loader2 className="h-4 w-4 animate-spin text-slate-900 dark:text-white" />
                        ) : (
                          <Download size={14} className="text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
