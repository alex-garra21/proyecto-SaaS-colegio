import dotenv from 'dotenv';
import sql from 'mssql';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const serverEnv = process.env.DB_SERVER ?? 'localhost';
let serverHost = serverEnv;
let instanceName: string | undefined = undefined;

if (serverEnv.includes('\\')) {
  const parts = serverEnv.split('\\');
  const part0 = parts[0] ?? '';
  serverHost = part0 === '.' ? 'localhost' : part0;
  instanceName = parts[1];
}

const dbConfig: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: serverHost,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: instanceName,
  },
};

let pool: sql.ConnectionPool | null = null;

export async function getPool(): Promise<sql.ConnectionPool> {
  if (!pool) {
    pool = await new sql.ConnectionPool(dbConfig).connect();
  }
  return pool;
}

export async function initializeStoredProcedures(): Promise<void> {
  try {
    const activePool = await getPool();
    console.log('[DB] Inicializando procedimientos almacenados de Gestión de Usuarios...');

    // 1. Crear sp_ActualizarRolUsuario si no existe
    await activePool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_ActualizarRolUsuario]') AND type in (N'P', N'PC'))
      BEGIN
          EXEC('
          CREATE PROCEDURE sp_ActualizarRolUsuario
              @IdUsuario INT,
              @NuevoIdRol INT
          AS
          BEGIN
              SET NOCOUNT ON;
              BEGIN TRY
                  BEGIN TRANSACTION;
                  
                  DELETE FROM UsuarioRol WHERE IdUsuario = @IdUsuario;
                  
                  INSERT INTO UsuarioRol (IdUsuario, IdRol)
                  VALUES (@IdUsuario, @NuevoIdRol);
                  
                  INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
                  VALUES (
                      1,
                      ''UPDATE'',
                      ''UsuarioRol'',
                      CONCAT_WS('' | '',
                          ''IdUsuario: '' + CAST(@IdUsuario AS VARCHAR(10)),
                          ''Nuevo IdRol: '' + CAST(@NuevoIdRol AS VARCHAR(10))
                      )
                  );
                  
                  COMMIT TRANSACTION;
              END TRY
              BEGIN CATCH
                  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                  DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
                  RAISERROR(@ErrMsg, 16, 1);
              END CATCH
          END
          ')
      END
    `);

    // 2. Crear sp_AlternarEstadoUsuario si no existe
    await activePool.request().query(`
      IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[sp_AlternarEstadoUsuario]') AND type in (N'P', N'PC'))
      BEGIN
          EXEC('
          CREATE PROCEDURE sp_AlternarEstadoUsuario
              @IdUsuarioAfectado INT,
              @IdUsuarioAdmin INT
          AS
          BEGIN
              SET NOCOUNT ON;
              DECLARE @NuevoEstado BIT;
              
              BEGIN TRY
                  BEGIN TRANSACTION;
                  
                  SELECT @NuevoEstado = CASE WHEN Estado = 1 THEN 0 ELSE 1 END
                  FROM Usuario
                  WHERE IdUsuario = @IdUsuarioAfectado;
                  
                  UPDATE Usuario
                  SET Estado = @NuevoEstado
                  WHERE IdUsuario = @IdUsuarioAfectado;
                  
                  INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
                  VALUES (
                      @IdUsuarioAdmin,
                      ''UPDATE'',
                      ''Usuario'',
                      CONCAT_WS('' | '',
                          ''IdUsuario: '' + CAST(@IdUsuarioAfectado AS VARCHAR(10)),
                          ''Nuevo Estado: '' + CAST(@NuevoEstado AS VARCHAR(1))
                      )
                  );
                  
                  COMMIT TRANSACTION;
              END TRY
              BEGIN CATCH
                  IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
                  DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
                  RAISERROR(@ErrMsg, 16, 1);
              END CATCH
          END
          ')
      END
    `);

    console.log('[DB] Procedimientos almacenados inicializados exitosamente.');
  } catch (error) {
    console.error('[DB-ERROR] Error al inicializar procedimientos almacenados:', error);
  }
}
