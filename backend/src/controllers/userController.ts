import type { Request, Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/db.js';
import type { AuthenticatedRequest } from '../middleware/authMiddleware.js';

interface UserRow {
  IdUsuario: number;
  NombreCompleto: string;
  Nombres: string;
  Apellidos: string;
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
        u.NombreCompleto,
        u.Nombres,
        u.Apellidos,
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

export async function getDocentesActivos(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        u.IdUsuario,
        u.NombreCompleto,
        u.Correo,
        r.NombreRol
      FROM Usuario u
      INNER JOIN UsuarioRol ur ON u.IdUsuario = ur.IdUsuario
      INNER JOIN Rol r ON ur.IdRol = r.IdRol
      WHERE r.NombreRol = 'Profesor' AND u.Estado = 1
      ORDER BY u.NombreCompleto ASC
    `);

    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al consultar docentes activos.', error: error?.message });
  }
}

export async function createUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { nombres, apellidos, correo, password, idRol } = req.body as {
    nombres?: string;
    apellidos?: string;
    correo?: string;
    password?: string;
    idRol?: number;
  };

  const operadorId = req.user?.IdUsuario ?? null;

  if (!nombres?.trim() || !apellidos?.trim() || !correo?.trim() || !password || !idRol) {
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
      .input('Nombres', sql.VarChar(100), nombres.trim())
      .input('Apellidos', sql.VarChar(100), apellidos.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('Password', sql.VarChar(100), password)
      .input('IdRol', sql.Int, idRol)
      .execute('sp_RegistrarUsuario');

    // 3. Registrar auditoría estructurada por pipes en Bitácora
    await pool
      .request()
      .input('OperadorId', sql.Int, operadorId)
      .input('Nombres', sql.VarChar(100), nombres.trim())
      .input('Apellidos', sql.VarChar(100), apellidos.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('IdRol', sql.Int, idRol)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
          @OperadorId, 
          'INSERT', 
          'Usuario', 
          CONCAT_WS(' | ', 
            'Nombre: ' + @Nombres + ' ' + @Apellidos, 
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

export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { id } = req.params;

  if (!id || typeof id !== 'string') {
    res.status(400).json({ message: 'Identificador de usuario no válido.' });
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

  if (operadorId === targetId) {
    res.status(403).json({ message: 'Acción bloqueada. No puedes darte de baja a ti mismo.' });
    return;
  }

  try {
    const pool = await getPool();

    // 1. Obtener detalles del usuario antes de la remoción
    const userResult = await pool
      .request()
      .input('IdUsuario', sql.Int, targetId)
      .query('SELECT NombreCompleto, Correo FROM Usuario WHERE IdUsuario = @IdUsuario');

    if (userResult.recordset.length === 0) {
      res.status(404).json({ message: 'Usuario no encontrado.' });
      return;
    }

    const usuario = userResult.recordset[0];

    // 2. Realizar baja lógica segura (Estado = 0)
    await pool
      .request()
      .input('IdUsuario', sql.Int, targetId)
      .query('UPDATE Usuario SET Estado = 0 WHERE IdUsuario = @IdUsuario');

    // 3. Registrar auditoría con pipes y acción 'DELETE'
    const detalleBitacora = `IdUsuario Afectado: ${targetId} | Nombre: ${usuario.NombreCompleto} | Correo: ${usuario.Correo} | Estado: Eliminado`;

    await pool
      .request()
      .input('OperadorId', sql.Int, operadorId)
      .input('Detalle', sql.VarChar(500), detalleBitacora)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (@OperadorId, 'DELETE', 'Usuario', @Detalle)
      `);

    res.json({ message: `Se ha desactivado y removido el acceso al usuario ${usuario.NombreCompleto} de la plataforma.` });
  } catch (error: any) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      message: 'Error en el servidor al procesar la baja segura del usuario.',
      error: error?.message || String(error)
    });
  }
}

export async function getRoles(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT IdRol, NombreRol 
      FROM Rol 
      ORDER BY NombreRol ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    console.error('Error al obtener lista de roles:', error);
    res.status(500).json({
      message: 'Error al consultar los roles de la base de datos.',
      error: error?.message || String(error)
    });
  }
}

export async function generateInstitutionalEmail(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { nombres, apellidos } = req.query as { nombres?: string; apellidos?: string };

  if (!nombres?.trim() || !apellidos?.trim()) {
    res.status(400).json({ message: 'Los nombres y apellidos son requeridos para generar el correo.' });
    return;
  }

  try {
    // 1. Construcción limpia del prefijo base (en minúsculas y sin espacios)
    const arrNombres = nombres.trim().split(/\s+/);
    const arrApellidos = apellidos.trim().split(/\s+/);

    const inicialNombre = arrNombres[0] ? arrNombres[0].charAt(0) : '';
    const primerApellido = arrApellidos[0] || '';
    const inicialSegundoApellido = arrApellidos[1] ? arrApellidos[1].charAt(0) : '';

    // Limpiamos acentos/tildes de la raíz
    const prefijoBase = `${inicialNombre}${primerApellido}${inicialSegundoApellido}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remueve tildes de forma segura
      .replace(/[^a-z0-9]/g, "");     // Remueve eñes o caracteres especiales

    // 2. Traer de la BD todos los correos que empiecen con ese prefijo
    const pool = await getPool();
    const result = await pool.request()
      .input('prefijo', sql.VarChar(100), `${prefijoBase}%`)
      .query(`
        SELECT LOWER(Correo) AS Correo 
        FROM Usuario 
        WHERE Correo LIKE @prefijo + '@sige.edu.gt' 
           OR Correo LIKE @prefijo + '[0-9]%@sige.edu.gt'
      `);

    const correosExistentes = result.recordset.map((r: any) => r.Correo.trim());

    // 3. Algoritmo Iterativo de Disponibilidad (Bucle Infalible)
    let correlativo = 0;
    let correoPropuesto = `${prefijoBase}@sige.edu.gt`;

    while (correosExistentes.includes(correoPropuesto)) {
        correlativo++;
        correoPropuesto = `${prefijoBase}${correlativo}@sige.edu.gt`;
    }

    // 4. Retornar el resultado único garantizado (Ambas llaves para máxima compatibilidad)
    res.status(200).json({ 
      correoGenerado: correoPropuesto,
      correoGenerated: correoPropuesto 
    });
  } catch (error: any) {
    console.error('Error al generar correo institucional:', error);
    res.status(500).json({
      message: 'Error al generar el correo institucional en el servidor.',
      error: error?.message || String(error)
    });
  }
}
