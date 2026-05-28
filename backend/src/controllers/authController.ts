import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { getPool } from '../config/db.js';

interface UsuarioAutenticado {
  IdUsuario: number;
  Nombre: string;
  Correo: string;
  IdRol: number;
  Estado?: boolean | number;
}

interface LoginBody {
  correo?: string;
  password?: string;
}

export async function login(req: Request, res: Response): Promise<void> {
  const { correo, password } = req.body as LoginBody;

  if (!correo?.trim() || !password) {
    res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET no está configurado en el servidor.' });
    return;
  }

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('Password', sql.VarChar(100), password)
      .execute<UsuarioAutenticado>('sp_AutenticarUsuario');

    if (!result.recordset || result.recordset.length === 0) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    const usuario = result.recordset[0];
    if (!usuario) {
      res.status(401).json({ message: 'Credenciales incorrectas' });
      return;
    }

    if (usuario.Estado === false || usuario.Estado === 0) {
      res.status(403).json({ message: 'ACCOUNT_DEACTIVATED' });
      return;
    }

    const token = jwt.sign(
      {
        IdUsuario: usuario.IdUsuario,
        Nombre: usuario.Nombre,
        IdRol: usuario.IdRol,
      },
      jwtSecret,
      { expiresIn: '8h' },
    );

    res.json({
      token,
      usuario: {
        idUsuario: usuario.IdUsuario,
        nombre: usuario.Nombre,
        correo: usuario.Correo,
        idRol: usuario.IdRol,
      },
    });
  } catch (error: any) {
    console.error('Error en sp_AutenticarUsuario:', error);
    res.status(500).json({ 
      message: 'Error al autenticar usuario.', 
      error: error?.message || String(error)
    });
  }
}

export async function registerStudent(req: Request, res: Response): Promise<void> {
  const { nombres, apellidos, correo, password } = req.body as {
    nombres?: string;
    apellidos?: string;
    correo?: string;
    password?: string;
  };

  if (!nombres?.trim() || !apellidos?.trim() || !correo?.trim() || !password) {
    res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    return;
  }

  // Validar formato básico de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(correo.trim())) {
    res.status(400).json({ message: 'El formato de correo electrónico no es válido.' });
    return;
  }

  try {
    const pool = await getPool();

    // 1. Verificar si el correo ya existe
    const existsResult = await pool
      .request()
      .input('Correo', sql.VarChar(100), correo.trim())
      .query('SELECT 1 FROM Usuario WHERE Correo = @Correo');

    if (existsResult.recordset && existsResult.recordset.length > 0) {
      res.status(400).json({ message: 'El correo electrónico ya se encuentra registrado.' });
      return;
    }

    // 2. Invocar sp_RegistrarUsuario forzando IdRol = 4 (Alumno)
    const idRolAlumno = 4;
    await pool
      .request()
      .input('Nombres', sql.VarChar(100), nombres.trim())
      .input('Apellidos', sql.VarChar(100), apellidos.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('Password', sql.VarChar(100), password)
      .input('IdRol', sql.Int, idRolAlumno)
      .execute('sp_RegistrarUsuario');

    // 3. Registrar auditoría de Auto-Registro en Bitácora
    await pool
      .request()
      .input('Nombres', sql.VarChar(100), nombres.trim())
      .input('Apellidos', sql.VarChar(100), apellidos.trim())
      .input('Correo', sql.VarChar(100), correo.trim())
      .input('IdRol', sql.Int, idRolAlumno)
      .query(`
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
          1, 
          'INSERT', 
          'Usuario', 
          CONCAT_WS(' | ', 
            'Nombre: ' + @Nombres + ' ' + @Apellidos, 
            'Correo: ' + @Correo, 
            'Rol ID: ' + CAST(@IdRol AS VARCHAR(10)) + ' (Auto-Registro Alumno)'
          )
        )
      `);

    res.status(201).json({ message: 'Usuario registrado exitosamente como Alumno.' });
  } catch (error: any) {
    console.error('Error en registerStudent:', error);
    res.status(500).json({
      message: 'Error al registrar la cuenta.',
      error: error?.message || String(error)
    });
  }
}
