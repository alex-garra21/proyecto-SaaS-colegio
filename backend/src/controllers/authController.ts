import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import { getPool } from '../config/db.js';

interface UsuarioAutenticado {
  IdUsuario: number;
  Nombre: string;
  Correo: string;
  IdRol: number;
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

    const usuario = result.recordset[0];
    if (!usuario) {
      res.status(401).json({ message: 'Credenciales inválidas.' });
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
