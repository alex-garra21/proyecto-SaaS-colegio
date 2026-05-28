import type { Request, Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/db.js';

interface BitacoraRow {
  IdBitacora: number;
  Usuario: string | null;
  Accion: string;
  TablaAfectada: string;
  Fecha: Date;
  Detalle: string;
}

export async function getBitacoras(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    // Consulta en 3FN que asocia el log de bitácora con el nombre del usuario operador (si existe)
    const result = await pool.request().query<BitacoraRow>(`
      SELECT 
        b.IdBitacora,
        u.NombreCompleto AS Usuario,
        b.Accion,
        b.TablaAfectada,
        b.Fecha,
        b.Detalle
      FROM Bitacora b
      LEFT JOIN Usuario u ON b.IdUsuario = u.IdUsuario
      ORDER BY b.Fecha DESC
    `);

    res.json(result.recordset);
  } catch (error: any) {
    console.error('Error al obtener bitácoras de la base de datos:', error);
    res.status(500).json({ 
      message: 'Error al obtener bitácoras desde SQL Server.',
      error: error?.message || String(error)
    });
  }
}

export async function generarBackup(req: Request, res: Response): Promise<void> {
  const { rutaCarpeta } = req.body as { rutaCarpeta?: string };

  if (!rutaCarpeta?.trim()) {
    res.status(400).json({ message: 'La ruta física del servidor es requerida.' });
    return;
  }

  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Llamar al SP transaccional sp_GenerarBackupCompleto
    await request
      .input('RutaCarpeta', sql.VarChar(255), rutaCarpeta.trim())
      .execute('sp_GenerarBackupCompleto');

    // Registrar en bitácora la generación del backup
    await pool.request().query(`
      INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
      VALUES (NULL, 'BACKUP', 'DATABASE', 'Respaldo físico generado en: ${rutaCarpeta.replace(/'/g, "''")}')
    `);

    res.json({ 
      message: 'Respaldo de base de datos generado con éxito en el disco del servidor.',
      ruta: rutaCarpeta.trim()
    });
  } catch (error: any) {
    console.error('Error al ejecutar sp_GenerarBackupCompleto:', error);
    res.status(500).json({ 
      message: 'Error de infraestructura física al ejecutar el respaldo.',
      error: error?.message || String(error)
    });
  }
}
