import type { Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/db.js';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export async function updateProfileData(req: AuthenticatedRequest, res: Response): Promise<void> {
  const idUsuario = req.user?.IdUsuario;
  const { nombres, apellidos } = req.body as { nombres?: string; apellidos?: string };

  if (!idUsuario) {
    res.status(401).json({ message: 'Sesión no válida o caducada.' });
    return;
  }

  if (!nombres?.trim() || !apellidos?.trim()) {
    res.status(400).json({ message: 'Todos los campos (Nombres, Apellidos) son obligatorios.' });
    return;
  }

  try {
    const pool = await getPool();
    
    // 1. Actualizar nombres del perfil en base de datos
    await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Nombres', sql.VarChar(100), nombres.trim())
      .input('Apellidos', sql.VarChar(100), apellidos.trim())
      .query(`
        UPDATE Usuario 
        SET Nombres = @Nombres, 
            Apellidos = @Apellidos, 
            NombreCompleto = @Nombres + ' ' + @Apellidos 
        WHERE IdUsuario = @IdUsuario
      `);

    // 2. Registrar en Bitácora
    const detalleBitacora = `Actualización de perfil del usuario ID ${idUsuario} | Nombres: ${nombres.trim()} | Apellidos: ${apellidos.trim()}`;
    await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Detalle', sql.VarChar(500), detalleBitacora)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (@IdUsuario, 'UPDATE', 'Usuario', @Detalle)
      `);

    const nombreCompleto = `${nombres.trim()} ${apellidos.trim()}`;
    res.json({ 
      message: 'Datos del perfil actualizados con éxito.',
      nombreCompleto
    });
  } catch (error: any) {
    console.error('Error al actualizar datos del perfil:', error);
    res.status(500).json({
      message: 'Error al actualizar los datos en el servidor.',
      error: error?.message || String(error)
    });
  }
}

export async function updateProfilePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  const idUsuario = req.user?.IdUsuario;
  const { currentPassword, newPassword } = req.body as { currentPassword?: string; newPassword?: string };

  if (!idUsuario) {
    res.status(401).json({ message: 'Sesión no válida o caducada.' });
    return;
  }

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: 'La contraseña actual y la nueva contraseña son requeridas.' });
    return;
  }

  try {
    const pool = await getPool();

    // 1. Obtener Salt y PasswordHash del usuario
    const userResult = await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .query('SELECT Salt, PasswordHash FROM Usuario WHERE IdUsuario = @IdUsuario');

    if (userResult.recordset.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    const { Salt, PasswordHash } = userResult.recordset[0];

    // 2. Verificar contraseña actual con HASHBYTES('SHA2_256')
    const verifyResult = await pool.request()
      .input('Salt', sql.UniqueIdentifier, Salt)
      .input('CurrentPassword', sql.VarChar(100), currentPassword)
      .input('StoredHash', sql.VarBinary(32), PasswordHash)
      .query(`
        SELECT CASE 
          WHEN HASHBYTES('SHA2_256', CAST(@Salt AS VARCHAR(36)) + @CurrentPassword) = @StoredHash THEN 1 
          ELSE 0 
        END AS IsMatch
      `);

    if (verifyResult.recordset[0].IsMatch !== 1) {
      res.status(401).json({ message: 'La contraseña actual ingresada es incorrecta.' });
      return;
    }

    // 3. Generar un nuevo Salt (NEWID()) y calcular el nuevo PasswordHash
    await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('NewPassword', sql.VarChar(100), newPassword)
      .query(`
        DECLARE @NewSalt UNIQUEIDENTIFIER = NEWID();
        DECLARE @NewHash VARBINARY(32) = HASHBYTES('SHA2_256', CAST(@NewSalt AS VARCHAR(36)) + @NewPassword);
        
        UPDATE Usuario 
        SET Salt = @NewSalt, 
            PasswordHash = @NewHash 
        WHERE IdUsuario = @IdUsuario;
      `);

    // 4. Registrar en Bitácora
    const detalleBitacora = `Actualización de contraseña del usuario ID ${idUsuario}`;
    await pool.request()
      .input('IdUsuario', sql.Int, idUsuario)
      .input('Detalle', sql.VarChar(500), detalleBitacora)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (@IdUsuario, 'UPDATE', 'Usuario', @Detalle)
      `);

    res.json({ message: 'Contraseña actualizada con éxito.' });
  } catch (error: any) {
    console.error('Error al actualizar contraseña del perfil:', error);
    res.status(500).json({
      message: 'Error al actualizar la contraseña en el servidor.',
      error: error?.message || String(error)
    });
  }
}
