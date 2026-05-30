import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

type JwtAuthPayload = {
  IdUsuario: number;
  Nombre: string;
  IdRol: number;
  exp?: number;
  iat?: number;
};

export type AuthUser = {
  idUsuario: number;
  nombre: string;
  idRol: number;
  correo?: string;
};

type AuthContextValue = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updatedFields: Partial<AuthUser>) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'auth_token';
const USER_STORAGE_KEY = 'auth_user';

function decodeUserFromToken(token: string): AuthUser | null {
  try {
    const payload = jwtDecode<JwtAuthPayload>(token);
    const idUsuario =
      typeof payload?.IdUsuario === 'number' ? payload.IdUsuario : Number(payload?.IdUsuario);
    const nombre = typeof payload?.Nombre === 'string' ? payload.Nombre : String(payload?.Nombre ?? '');
    const idRol = typeof payload?.IdRol === 'number' ? payload.IdRol : Number(payload?.IdRol);

    if (!Number.isFinite(idUsuario) || !nombre || !Number.isFinite(idRol)) return null;

    return {
      idUsuario,
      nombre,
      idRol,
    };
  } catch {
    return null;
  }
}

function getApiBaseUrl(): string {
  // En Vite, import.meta.env se usa para acceder a variables de entorno.
  // Proporcionamos un fallback seguro a http://localhost:4000.
  const env = (import.meta as any).env;
  return env?.VITE_API_BASE_URL || 'http://localhost:4000';
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          if (parsed && typeof parsed.idUsuario === 'number' && typeof parsed.idRol === 'number' && parsed.nombre) {
            return parsed;
          }
        } catch {
          // ignore
        }
      }

      // Si no hay un usuario recuperado con estructura válida, decodificar el token JWT
      const decoded = decodeUserFromToken(storedToken);
      if (decoded) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(decoded));
        return decoded;
      }
    }
    return null;
  });

  const isAuthenticated = !!token && !!user;

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedFields: Partial<AuthUser>) => {
    setUser(prev => {
      if (!prev) return null;
      const nextUser = { ...prev, ...updatedFields };
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  const login = useCallback(
    async (correo: string, password: string) => {
      const apiBaseUrl = getApiBaseUrl();
      const res = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password }),
      });

      if (!res.ok) {
        let message = `Error ${res.status} al autenticar.`;
        try {
          const data = (await res.json()) as { message?: string; error?: string };
          if (data?.error) {
            message = `${data.message} Detalle: ${data.error}`;
          } else if (data?.message) {
            message = data.message;
          }
        } catch {
          // ignore
        }
        throw new Error(message);
      }

      const data = (await res.json()) as {
        token: string;
        usuario?: { idUsuario: number; nombre: string; correo?: string; idRol: number };
      };

      const nextToken = data.token;
      if (!nextToken) throw new Error('Respuesta inválida del servidor: falta el token.');

      localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
      setToken(nextToken);

      const decoded = decodeUserFromToken(nextToken);
      const nextUser: AuthUser | null =
        data.usuario && typeof data.usuario.idRol === 'number'
          ? {
              idUsuario: data.usuario.idUsuario,
              nombre: data.usuario.nombre,
              correo: data.usuario.correo,
              idRol: data.usuario.idRol,
            }
          : decoded
          ? { ...decoded, correo } // Si decodificamos el token, le agregamos el correo usado para login
          : null;

      if (!nextUser) throw new Error('No se pudo obtener el usuario desde el token.');

      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
      setUser(nextUser);
    },
    [],
  );

  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken) {
      let validUser: AuthUser | null = null;

      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          // Verificar que el objeto de sesión recuperado tenga la estructura correcta para esta rama estable
          if (parsed && typeof parsed.idUsuario === 'number' && typeof parsed.idRol === 'number' && parsed.nombre) {
            validUser = parsed;
          }
        } catch {
          // ignore
        }
      }

      // Si no hay un usuario recuperado con estructura válida en localStorage, decodificar el token JWT
      if (!validUser) {
        validUser = decodeUserFromToken(storedToken);
      }

      if (validUser) {
        setToken(storedToken);
        setUser(validUser);
        // Resincronizar la sesión en localStorage con datos correctos
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(validUser));
      } else {
        // Si el token tampoco es decodificable o válido, forzar logout preventivo
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated,
      login,
      logout,
      updateUser,
    }),
    [isAuthenticated, login, logout, token, user, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return ctx;
}
