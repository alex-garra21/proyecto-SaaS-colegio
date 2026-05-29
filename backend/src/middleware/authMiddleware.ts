import type { Response, NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

export interface DecodedUser {
  IdUsuario: number;
  Nombre: string;
  IdRol: number;
}

// Interfaz extendida para evitar errores de tipo en Express Request
export interface AuthenticatedRequest extends Request {
  user?: DecodedUser;
}

export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Acceso denegado. Token de sesión no proporcionado.' });
    return;
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    res.status(500).json({ message: 'JWT_SECRET no configurado en el servidor.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as DecodedUser;
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Fallo en la validación del token:', error);
    res.status(403).json({ message: 'Sesión expirada o inválida. Inicie sesión de nuevo.' });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || req.user.IdRol !== 1) {
    res.status(403).json({ message: 'Acceso restringido. Privilegios de Administrador requeridos.' });
    return;
  }
  next();
}

export function requireAdminOrControlAcademico(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  if (!req.user || (req.user.IdRol !== 1 && req.user.IdRol !== 2)) {
    res.status(403).json({ message: 'Acceso restringido. Privilegios de Administrador o Control Académico requeridos.' });
    return;
  }
  next();
}
