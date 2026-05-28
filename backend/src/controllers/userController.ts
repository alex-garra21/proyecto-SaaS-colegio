import type { Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/db.js';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';

interface UserRow {
  IdUsuario: number;
  Nombre: string;
  Correo: string;
  Estado: boolean;
  FechaRegistro: Date;
  IdRol: number;
  NombreRol: string;
}

export async function getUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query<UserRow>(`
      SELECT 
        u.IdUsuario,
        u.Nombre,
        u.Correo,
        u.Estado,
        u.FechaRegistro,
        r.IdRol,
        r.NombreRol
      FROM Usuario u
      INNER JOIN UsuarioRol ur ON u.IdUsuario = ur.IdUsuario
      INNER JOIN Rol r ON ur.IdRol = r.IdRol
      ORDER BY u.IdUsuario DESC
    `);

    res.json(result.recordset);
  } catch (error: any) {
    console.error('Error al obtener lista de usuarios:', error);
    res.status(500).json({
      message: 'Error al consultar los usuarios de la base de datos.',
      error: error?.message || String(error)
    });
  }
}

export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { nombre, correo, password, idRol } = req.body as {
    nombre?: string;
    correo?: string;
    password?: string;
    idRol?: number;
  };

  const operadorId = req.user?.IdUsuario ?? null;

  if (!nombre?.trim() || !correo?.trim() || !password || !idRol) {
    res.status(400).json({ message: 'Todos los campos son requeridos para el registro.' });
    return;
  }

  try {
    const pool = await getPool();

    // 1. Verificar si el correo ya existe
    const existsResult = await pool
      .request()
      .input('Correo', sql.VarChar(100), correo.trim())
      .query('SELECT 1 FROM Usuario WHERE Correo = @Correo');

    if (existsResult.recordset.length > 0) {
      res.status(400).json({ message: 'El correo electrónico ya está registrado en el sistema.' });
      return;
    }

    // 2. Invocar el procedimiento almacenado sp_RegistrarUsuario
    await pool
      .request()
      .input('Nombre', sql.VarChar(100), nombre.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('Password', sql.VarChar(100), password)
      .input('IdRol', sql.Int, idRol)
      .execute('sp_RegistrarUsuario');

    // 3. Registrar auditoría estructurada por pipes en Bitácora
    await pool
      .request()
      .input('OperadorId', sql.Int, operadorId)
      .input('Nombre', sql.VarChar(100), nombre.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('IdRol', sql.Int, idRol)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
          @OperadorId, 
          'INSERT', 
          'Usuario', 
          CONCAT_WS(' | ', 
            'Nombre: ' + @Nombre, 
            'Correo: ' + @Correo, 
            'Rol ID: ' + CAST(@IdRol AS VARCHAR(10))
          )
        )
      `);

    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error: any) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({
      message: 'Error de servidor al guardar el usuario.',
      error: error?.message || String(error)
    });
  }
}

export async function updateUserRole(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { idRol } = req.body;
  const { id } = req.params;

  // Imprime un console.log de req.params.id y req.body.idRol al inicio del método para depurar qué está llegando.
  console.log('[DEBUG] updateUserRole - req.params.id:', id, '| req.body.idRol:', idRol);

  if (!id || typeof id !== 'string') {
    res.status(400).json({ message: 'Identificador de usuario no válido.' });
    return;
  }

  // Agrega una validación estricta al inicio para interceptar el valor
  if (idRol === undefined || idRol === null || isNaN(parseInt(idRol.toString(), 10))) {
    res.status(400).json({ message: 'El campo idRol es requerido y debe ser un número válido' });
    return;
  }

  const targetId = parseInt(id, 10);
  if (isNaN(targetId)) {
    res.status(400).json({ message: 'Identificador de usuario no válido.' });
    return;
  }

  const operadorId = req.user?.IdUsuario;

  if (!operadorId) {
    res.status(401).json({ message: 'Sesión no válida.' });
    return;
  }

  // Protección Crítica contra Auto-Bloqueo
  if (operadorId === targetId) {
    res.status(403).json({ message: 'Acción bloqueada. No puedes cambiar tu propio rol para evitar el auto-bloqueo.' });
    return;
  }

  // Depuración táctica
  console.log('--- DEPURACIÓN CAMBIO DE ROL ---', { params: req.params, body: req.body });

  try {
    const pool = await getPool();
    const request = new sql.Request(pool);
    
    // Asegúrate de pasar los inputs limpios al request de mssql
    request.input('IdUsuario', sql.Int, parseInt(id, 10));
    request.input('NuevoIdRol', sql.Int, parseInt(idRol.toString(), 10));
    await request.execute('sp_ActualizarRolUsuario');

    res.json({ message: 'Rol de usuario actualizado exitosamente.' });
  } catch (error: any) {
    console.error('Error en updateUserRole:', error);
    res.status(500).json({ 
      message: `Error Real de BD: ${error.message || 'Sin mensaje'}` 
    });
  }
}

export async function toggleUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ message: 'Identificador de usuario no válido.' });
    return;
  }

  const targetId = parseInt(id);
  const operadorId = req.user?.IdUsuario;

  if (!operadorId) {
    res.status(401).json({ message: 'Sesión no válida.' });
    return;
  }

  // Protección Crítica contra Auto-Bloqueo
  if (operadorId === targetId) {
    res.status(403).json({ message: 'Acción bloqueada. No puedes desactivar tu propia cuenta para evitar el auto-bloqueo.' });
    return;
  }

  try {
    const pool = await getPool();
    const request = new sql.Request(pool);
    request.input('IdUsuarioAfectado', sql.Int, targetId);
    request.input('IdUsuarioAdmin', sql.Int, operadorId);
    await request.execute('sp_AlternarEstadoUsuario');

    res.json({ message: 'Estado del usuario alternado exitosamente.' });
  } catch (error: any) {
    console.error('Error al alternar estado del usuario:', error);
    res.status(500).json({
      message: 'Error en la base de datos al cambiar el estado.',
      error: error?.message || String(error)
    });
  }
}
