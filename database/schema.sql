-- ============================================================================
-- SCRIPT DE INFRAESTRUCTURA Y BASE DE DATOS LOCAL UNIFICADA (SIGE LOCAL)
-- TOTALMENTE IDEMPOTENTE Y LISTO PARA EJECUTARSE EN SSMS
-- ============================================================================

-- 1. GOBERNANZA DE INICIALIZACIÓN LOCAL
-- Crea la base de datos si no existe de forma no destructiva y se posiciona en ella
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = N'SistemaColegioLocal')
BEGIN
    CREATE DATABASE SistemaColegioLocal;
END
GO

USE SistemaColegioLocal;
GO

-- ============================================================================
-- 2. INFRAESTRUCTURA DE SEGURIDAD Y LOGIN DEL SERVIDOR (.ENV COMPATIBLE)
-- Crea el Login y el Usuario de la base de datos local y le asigna privilegios db_owner
-- ============================================================================
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = N'alexreyes2026_SQLLogin_1')
BEGIN
    CREATE LOGIN alexreyes2026_SQLLogin_1 WITH PASSWORD = 'w7lvsbljk1', DEFAULT_DATABASE = SistemaColegioLocal;
END
GO

IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = N'alexreyes2026_SQLLogin_1')
BEGIN
    CREATE USER alexreyes2026_SQLLogin_1 FOR LOGIN alexreyes2026_SQLLogin_1;
END
GO

IF IS_ROLEMEMBER('db_owner', 'alexreyes2026_SQLLogin_1') = 0
BEGIN
    EXEC sp_addrolemember 'db_owner', 'alexreyes2026_SQLLogin_1';
END
GO

-- ============================================================================
-- 3. CREACIÓN IDEMPOTENTE DE ESTRUCTURAS TRANSACCIONALES (OLTP) EN 3FN
-- ============================================================================

-- Tabla 1: Rol
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Rol]') AND type in (N'U'))
BEGIN
    CREATE TABLE Rol (
        IdRol INT IDENTITY(1,1) NOT NULL,
        NombreRol VARCHAR(50) NOT NULL,
        Descripcion VARCHAR(255) NULL,
        CONSTRAINT PK_Rol PRIMARY KEY (IdRol),
        CONSTRAINT UQ_NombreRol UNIQUE (NombreRol)
    );
END
GO

-- Tabla 2: Usuario (Sincronizado al 100% con las columnas Nombres, Apellidos y NombreCompleto de la API)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Usuario]') AND type in (N'U'))
BEGIN
    CREATE TABLE Usuario (
        IdUsuario INT IDENTITY(1,1) NOT NULL,
        Nombres VARCHAR(100) NOT NULL,
        Apellidos VARCHAR(100) NOT NULL,
        NombreCompleto VARCHAR(200) NOT NULL,
        Correo VARCHAR(100) NOT NULL,
        PasswordHash VARBINARY(256) NOT NULL,
        Salt UNIQUEIDENTIFIER NOT NULL,
        Estado BIT DEFAULT 1 NOT NULL,
        FechaRegistro DATETIME DEFAULT GETDATE() NOT NULL,
        CONSTRAINT PK_Usuario PRIMARY KEY (IdUsuario),
        CONSTRAINT UQ_Correo UNIQUE (Correo)
    );
END
GO

-- Tabla 3: UsuarioRol
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[UsuarioRol]') AND type in (N'U'))
BEGIN
    CREATE TABLE UsuarioRol (
        IdUsuario INT NOT NULL,
        IdRol INT NOT NULL,
        CONSTRAINT PK_UsuarioRol PRIMARY KEY (IdUsuario, IdRol),
        CONSTRAINT FK_UsuarioRol_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE,
        CONSTRAINT FK_UsuarioRol_Rol FOREIGN KEY (IdRol) REFERENCES Rol(IdRol) ON DELETE CASCADE
    );
END
GO

-- Tabla 4: Grado
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Grado]') AND type in (N'U'))
BEGIN
    CREATE TABLE Grado (
        IdGrado INT IDENTITY(1,1) NOT NULL,
        Nombre VARCHAR(50) NOT NULL,
        CONSTRAINT PK_Grado PRIMARY KEY (IdGrado)
    );
END
GO

-- Tabla 5: Materia
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Materia]') AND type in (N'U'))
BEGIN
    CREATE TABLE Materia (
        IdMateria INT IDENTITY(1,1) NOT NULL,
        Nombre VARCHAR(100) NOT NULL,
        IdGrado INT NOT NULL,
        CONSTRAINT PK_Materia PRIMARY KEY (IdMateria),
        CONSTRAINT FK_Materia_Grado FOREIGN KEY (IdGrado) REFERENCES Grado(IdGrado)
    );
END
GO

-- Tabla 6: Seccion
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Seccion]') AND type in (N'U'))
BEGIN
    CREATE TABLE Seccion (
        IdSeccion INT IDENTITY(1,1) NOT NULL,
        IdProfesor INT NOT NULL,
        IdMateria INT NOT NULL,
        Anio INT NOT NULL,
        LetraSeccion VARCHAR(10) NOT NULL,
        CONSTRAINT PK_Seccion PRIMARY KEY (IdSeccion),
        CONSTRAINT UQ_Seccion UNIQUE (IdMateria, Anio, LetraSeccion),
        CONSTRAINT FK_Seccion_Materia FOREIGN KEY (IdMateria) REFERENCES Materia(IdMateria),
        CONSTRAINT FK_Seccion_Profesor FOREIGN KEY (IdProfesor) REFERENCES Usuario(IdUsuario)
    );
END
GO

-- Tabla 7: SeccionAlumno
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[SeccionAlumno]') AND type in (N'U'))
BEGIN
    CREATE TABLE SeccionAlumno (
        IdSeccion INT NOT NULL,
        IdAlumno INT NOT NULL,
        CONSTRAINT PK_SeccionAlumno PRIMARY KEY (IdSeccion, IdAlumno),
        CONSTRAINT FK_SeccionAlumno_Seccion FOREIGN KEY (IdSeccion) REFERENCES Seccion(IdSeccion) ON DELETE CASCADE,
        CONSTRAINT FK_SeccionAlumno_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE
    );
END
GO

-- Tabla 8: Tema
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Tema]') AND type in (N'U'))
BEGIN
    CREATE TABLE Tema (
        IdTema INT IDENTITY(1,1) NOT NULL,
        Nombre VARCHAR(100) NOT NULL,
        IdMateria INT NOT NULL,
        CONSTRAINT PK_Tema PRIMARY KEY (IdTema),
        CONSTRAINT FK_Tema_Materia FOREIGN KEY (IdMateria) REFERENCES Materia(IdMateria)
    );
END
GO

-- Tabla 9: Actividad
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Actividad]') AND type in (N'U'))
BEGIN
    CREATE TABLE Actividad (
        IdActividad INT IDENTITY(1,1) NOT NULL,
        IdSeccion INT NOT NULL,
        IdTema INT NOT NULL,
        Titulo VARCHAR(100) NOT NULL,
        Descripcion VARCHAR(MAX) NOT NULL,
        FechaInicio DATETIME NOT NULL,
        FechaFin DATETIME NOT NULL,
        Ponderacion DECIMAL(5,2) NOT NULL,
        Tipo VARCHAR(50) NOT NULL,
        CONSTRAINT PK_Actividad PRIMARY KEY (IdActividad),
        CONSTRAINT FK_Actividad_Seccion FOREIGN KEY (IdSeccion) REFERENCES Seccion(IdSeccion),
        CONSTRAINT FK_Actividad_Tema FOREIGN KEY (IdTema) REFERENCES Tema(IdTema)
    );
END
GO

-- Tabla 10: Entrega
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Entrega]') AND type in (N'U'))
BEGIN
    CREATE TABLE Entrega (
        IdEntrega INT IDENTITY(1,1) NOT NULL,
        IdActividad INT NOT NULL,
        IdAlumno INT NOT NULL,
        FechaEntrega DATETIME NOT NULL,
        Estado VARCHAR(50) NOT NULL,
        CONSTRAINT PK_Entrega PRIMARY KEY (IdEntrega),
        CONSTRAINT FK_Entrega_Actividad FOREIGN KEY (IdActividad) REFERENCES Actividad(IdActividad),
        CONSTRAINT FK_Entrega_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario)
    );
END
GO

-- Tabla 11: RecursoEntrega
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RecursoEntrega]') AND type in (N'U'))
BEGIN
    CREATE TABLE RecursoEntrega (
        IdRecurso INT IDENTITY(1,1) NOT NULL,
        IdEntrega INT NOT NULL,
        Tipo VARCHAR(50) NOT NULL,
        URL VARCHAR(255) NOT NULL,
        CONSTRAINT PK_RecursoEntrega PRIMARY KEY (IdRecurso),
        CONSTRAINT FK_RecursoEntrega_Entrega FOREIGN KEY (IdEntrega) REFERENCES Entrega(IdEntrega) ON DELETE CASCADE
    );
END
GO

-- Tabla 12: Calificacion (Validación CHECK estricta de la nota entre 0 y 100)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Calificacion]') AND type in (N'U'))
BEGIN
    CREATE TABLE Calificacion (
        IdCalificacion INT IDENTITY(1,1) NOT NULL,
        IdEntrega INT NOT NULL,
        Nota DECIMAL(5,2) NOT NULL,
        Observacion VARCHAR(MAX) NULL,
        FechaCalificacion DATETIME DEFAULT GETDATE() NOT NULL,
        CONSTRAINT PK_Calificacion PRIMARY KEY (IdCalificacion),
        CONSTRAINT FK_Calificacion_Entrega FOREIGN KEY (IdEntrega) REFERENCES Entrega(IdEntrega) ON DELETE CASCADE,
        CONSTRAINT CK_Nota CHECK (Nota BETWEEN 0.00 AND 100.00)
    );
END
GO

-- Tabla 13: RelacionFamiliar (Restricción de unicidad compuesta entre Padre e Hijo)
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[RelacionFamiliar]') AND type in (N'U'))
BEGIN
    CREATE TABLE RelacionFamiliar (
        IdRelacion INT IDENTITY(1,1) NOT NULL,
        IdPadre INT NOT NULL,
        IdAlumno INT NOT NULL,
        CONSTRAINT PK_RelacionFamiliar PRIMARY KEY (IdRelacion),
        CONSTRAINT UQ_RelacionFamiliar UNIQUE (IdPadre, IdAlumno),
        CONSTRAINT FK_RelacionFamiliar_Padre FOREIGN KEY (IdPadre) REFERENCES Usuario(IdUsuario),
        CONSTRAINT FK_RelacionFamiliar_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario)
    );
END
GO

-- Tabla 14: Notificacion
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Notificacion]') AND type in (N'U'))
BEGIN
    CREATE TABLE Notificacion (
        IdNotificacion INT IDENTITY(1,1) NOT NULL,
        IdUsuario INT NOT NULL,
        Tipo VARCHAR(50) NOT NULL,
        Mensaje VARCHAR(MAX) NOT NULL,
        Fecha DATETIME DEFAULT GETDATE() NOT NULL,
        Leido BIT DEFAULT 0 NOT NULL,
        CONSTRAINT PK_Notificacion PRIMARY KEY (IdNotificacion),
        CONSTRAINT FK_Notificacion_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE
    );
END
GO

-- Tabla 15: Bitacora
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Bitacora]') AND type in (N'U'))
BEGIN
    CREATE TABLE Bitacora (
        IdBitacora INT IDENTITY(1,1) NOT NULL,
        IdUsuario INT NULL,
        Accion VARCHAR(100) NOT NULL,
        TablaAfectada VARCHAR(100) NOT NULL,
        Fecha DATETIME DEFAULT GETDATE() NOT NULL,
        Detalle VARCHAR(MAX) NOT NULL,
        CONSTRAINT PK_Bitacora PRIMARY KEY (IdBitacora)
    );
END
GO

-- Tabla 16: Prediccion
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Prediccion]') AND type in (N'U'))
BEGIN
    CREATE TABLE Prediccion (
        IdPrediccion INT IDENTITY(1,1) NOT NULL,
        IdAlumno INT NOT NULL,
        Riesgo DECIMAL(5,2) NOT NULL,
        IdMateriaDebil INT NOT NULL,
        Recomendacion VARCHAR(MAX) NOT NULL,
        Fecha DATETIME DEFAULT GETDATE() NOT NULL,
        CONSTRAINT PK_Prediccion PRIMARY KEY (IdPrediccion),
        CONSTRAINT FK_Prediccion_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE,
        CONSTRAINT FK_Prediccion_Materia FOREIGN KEY (IdMateriaDebil) REFERENCES Materia(IdMateria)
    );
END
GO

-- Tabla 17: MetricasRendimiento
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MetricasRendimiento]') AND type in (N'U'))
BEGIN
    CREATE TABLE MetricasRendimiento (
        IdMetrica INT IDENTITY(1,1) NOT NULL,
        IdAlumno INT NOT NULL,
        IdTema INT NOT NULL,
        Velocidad DECIMAL(5,2) NOT NULL,
        Precision DECIMAL(5,2) NOT NULL,
        Dificultad DECIMAL(5,2) NOT NULL,
        Fecha DATETIME DEFAULT GETDATE() NOT NULL,
        CONSTRAINT PK_MetricasRendimiento PRIMARY KEY (IdMetrica),
        CONSTRAINT FK_MetricasRendimiento_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario),
        CONSTRAINT FK_MetricasRendimiento_Tema FOREIGN KEY (IdTema) REFERENCES Tema(IdTema)
    );
END
GO

-- Tabla 18: MonitoreoConsulta
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[MonitoreoConsulta]') AND type in (N'U'))
BEGIN
    CREATE TABLE MonitoreoConsulta (
        IdMonitoreo INT IDENTITY(1,1) NOT NULL,
        Consulta VARCHAR(MAX) NOT NULL,
        TiempoEjecucion DECIMAL(10,4) NOT NULL,
        Fecha DATETIME DEFAULT GETDATE() NOT NULL,
        CONSTRAINT PK_MonitoreoConsulta PRIMARY KEY (IdMonitoreo)
    );
END
GO

-- ============================================================================
-- 4. POBLADO IDEMPOTENTE DE CATÁLOGOS BASE
-- ============================================================================

IF NOT EXISTS (SELECT 1 FROM Rol WHERE NombreRol = 'Administrador')
    INSERT INTO Rol (NombreRol, Descripcion) VALUES ('Administrador', 'Control total administrativo del sistema');

IF NOT EXISTS (SELECT 1 FROM Rol WHERE NombreRol = 'Personal Académico')
    INSERT INTO Rol (NombreRol, Descripcion) VALUES ('Personal Académico', 'Coordinación y gestión escolar');

IF NOT EXISTS (SELECT 1 FROM Rol WHERE NombreRol = 'Docente / Profesor')
    INSERT INTO Rol (NombreRol, Descripcion) VALUES ('Docente / Profesor', 'Docencia y asentado de notas');

IF NOT EXISTS (SELECT 1 FROM Rol WHERE NombreRol = 'Alumno')
    INSERT INTO Rol (NombreRol, Descripcion) VALUES ('Alumno', 'Estudiante regular de la institución');

IF NOT EXISTS (SELECT 1 FROM Rol WHERE NombreRol = 'Padre de Familia')
    INSERT INTO Rol (NombreRol, Descripcion) VALUES ('Padre de Familia', 'Supervisor familiar del rendimiento del alumno');
GO

-- ============================================================================
-- 5. CREACIÓN IDEMPOTENTE DE ÍNDICES DE RENDIMIENTO (TUNING)
-- ============================================================================

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Seccion_Materia_Anio' AND object_id = OBJECT_ID('Seccion'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Seccion_Materia_Anio ON Seccion (IdMateria, Anio);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Entrega_Actividad_Alumno' AND object_id = OBJECT_ID('Entrega'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Entrega_Actividad_Alumno ON Entrega (IdActividad, IdAlumno);
END

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Calificacion_Entrega' AND object_id = OBJECT_ID('Calificacion'))
BEGIN
    CREATE NONCLUSTERED INDEX IX_Calificacion_Entrega ON Calificacion (IdEntrega);
END
GO

-- ============================================================================
-- 6. INTERFACES DE PROGRAMACIÓN (PROCEDIMIENTOS ALMACENADOS AVANZADOS)
-- ============================================================================

-- SP 1: sp_RegistrarUsuario
-- Registro transaccional seguro con hash criptográfico SHA2_256, sal y auditoría
CREATE OR ALTER PROCEDURE sp_RegistrarUsuario
    @Nombres VARCHAR(100),
    @Apellidos VARCHAR(100),
    @Correo VARCHAR(100),
    @Password VARCHAR(100),
    @IdRol INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Salt UNIQUEIDENTIFIER = NEWID();
    DECLARE @NombreCompleto VARCHAR(200) = @Nombres + ' ' + @Apellidos;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO Usuario (Nombres, Apellidos, NombreCompleto, Correo, PasswordHash, Salt)
        VALUES (
            @Nombres, 
            @Apellidos, 
            @NombreCompleto,
            @Correo, 
            HASHBYTES('SHA2_256', CAST(@Salt AS VARCHAR(36)) + @Password), 
            @Salt
        );
        
        DECLARE @NuevoId INT = SCOPE_IDENTITY();
        
        INSERT INTO UsuarioRol (IdUsuario, IdRol)
        VALUES (@NuevoId, @IdRol);
        
        -- Auditoría estructurada por tuberías (Pipes)
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
            @NuevoId, 
            'INSERT', 
            'Usuario', 
            CONCAT_WS(' | ', 
                'Nombre: ' + @Nombres + ' ' + @Apellidos, 
                'Correo: ' + @Correo, 
                'Rol ID: ' + CAST(@IdRol AS VARCHAR(10))
            )
        );
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO

-- SP 2: sp_AutenticarUsuario
-- Retorna el payload de sesión simétrico esperado por AuthContext
CREATE OR ALTER PROCEDURE sp_AutenticarUsuario
    @Correo VARCHAR(100),
    @Password VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Salt UNIQUEIDENTIFIER;
    
    SELECT @Salt = Salt FROM Usuario WHERE Correo = @Correo AND Estado = 1;
    
    IF @Salt IS NOT NULL
    BEGIN
        SELECT u.IdUsuario, u.NombreCompleto, u.Correo, ur.IdRol, u.Estado
        FROM Usuario u
        INNER JOIN UsuarioRol ur ON u.IdUsuario = ur.IdUsuario
        WHERE u.Correo = @Correo 
          AND u.PasswordHash = HASHBYTES('SHA2_256', CAST(@Salt AS VARCHAR(36)) + @Password);
    END
END;
GO

-- SP 3: sp_AsignarCalificacion
-- Asigna calificaciones auditable a la bitácora formateada con Pipes
CREATE OR ALTER PROCEDURE sp_AsignarCalificacion
    @IdEntrega INT,
    @Nota DECIMAL(5,2),
    @Observacion VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF EXISTS (SELECT 1 FROM Calificacion WHERE IdEntrega = @IdEntrega)
        BEGIN
            UPDATE Calificacion
            SET Nota = @Nota, Observacion = @Observacion, FechaCalificacion = GETDATE()
            WHERE IdEntrega = @IdEntrega;
        END
        ELSE
        BEGIN
            INSERT INTO Calificacion (IdEntrega, Nota, Observacion)
            VALUES (@IdEntrega, @Nota, @Observacion);
        END
        
        -- Auditoría formateada con Pipes
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
            NULL,
            'UPDATE',
            'Calificacion',
            CONCAT_WS(' | ',
                'IdEntrega: ' + CAST(@IdEntrega AS VARCHAR(10)),
                'Nota Asignada: ' + CAST(@Nota AS VARCHAR(10)),
                'Observacion: ' + COALESCE(@Observacion, 'Sin observacion')
            )
        );
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO

-- SP 4: sp_ActualizarRolUsuario
-- Cambia dinámicamente el rol del usuario registrando auditoría en bitácora con Pipes
CREATE OR ALTER PROCEDURE sp_ActualizarRolUsuario
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
        
        -- Auditoría formateada con Pipes para backend
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
            1, -- Admin Default Operator
            'UPDATE',
            'UsuarioRol',
            CONCAT_WS(' | ',
                'IdUsuario Afectado: ' + CAST(@IdUsuario AS VARCHAR(10)),
                'Nuevo Rol ID: ' + CAST(@NuevoIdRol AS VARCHAR(10))
            )
        );
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO

-- SP 5: sp_AlternarEstadoUsuario
-- Alterna estatus de cuenta bloqueando auto-bloqueos en API y registrando auditoría en bitácora con Pipes
CREATE OR ALTER PROCEDURE sp_AlternarEstadoUsuario
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
        
        -- Auditoría formateada con Pipes para backend
        INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
        VALUES (
            @IdUsuarioAdmin,
            'UPDATE',
            'Usuario',
            CONCAT_WS(' | ',
                'IdUsuario Afectado: ' + CAST(@IdUsuarioAfectado AS VARCHAR(10)),
                'Estado Resultante: ' + CASE WHEN @NuevoEstado = 1 THEN 'Activo' ELSE 'Inactivo' END
            )
        );
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO

-- SP 6: sp_GenerarBackupCompleto
-- Realiza el respaldo físico completo local en formato .bak
CREATE OR ALTER PROCEDURE sp_GenerarBackupCompleto
    @RutaCarpeta VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Fecha VARCHAR(20) = REPLACE(REPLACE(CONVERT(VARCHAR, GETDATE(), 120), '-', '_'), ':', '_');
    DECLARE @RutaCompleta VARCHAR(500) = CONCAT(@RutaCarpeta, 'SIGE_Backup_', @Fecha, '.bak');
    DECLARE @SQL NVARCHAR(600);
    
    BEGIN TRY
        SET @SQL = N'BACKUP DATABASE SistemaColegioLocal '
                 + N'TO DISK = @Ruta '
                 + N'WITH FORMAT, MEDIANAME = ''AppBackupsLocal'', '
                 + N'NAME = ''Respaldo Completo Automatico SIGE Local''';

        EXEC sp_executesql @SQL, N'@Ruta VARCHAR(500)', @Ruta = @RutaCompleta;
    END TRY
    BEGIN CATCH
        THROW 50003, 'Error crítico de infraestructura al escribir el archivo de respaldo físico local.', 1;
    END CATCH
END;
GO

-- ============================================================================
-- 7. DISPARADORES DE AUDITORÍA (TRIGGERS CON CREATE OR ALTER)
-- ============================================================================

-- Disparador: TR_Auditoria_Calificacion_Eliminada
-- Resguarda eliminaciones en Calificacion volcando datos en bitácora con Pipes
CREATE OR ALTER TRIGGER TR_Auditoria_Calificacion_Eliminada
ON Calificacion
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
    SELECT 
        NULL,
        'DELETE',
        'Calificacion',
        CONCAT_WS(' | ', 
            'IdCalificacion: ' + CAST(d.IdCalificacion AS VARCHAR(10)),
            'IdEntrega: ' + CAST(d.IdEntrega AS VARCHAR(10)),
            'Nota Resguardada: ' + CAST(d.Nota AS VARCHAR(10)),
            'Fecha Registro Original: ' + CONVERT(VARCHAR, d.FechaCalificacion, 120)
        )
    FROM deleted d;
END;
GO