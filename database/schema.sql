-- ============================================================================
-- SCRIPT DE RECONSTRUCCIÓN AUTOMÁTICA E INTEGRAL (SISTEMA COLEGIO)
-- ============================================================================
USE master;
GO

-- 1. Control de Existencia de Base de Datos: Limpia instalaciones previas
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'SistemaColegio')
BEGIN
    -- Cierra las conexiones activas en la web para poder borrarla sin bloqueos
    ALTER DATABASE SistemaColegio SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE SistemaColegio;
END
GO

-- 2. Control de Existencia del Login: Evita conflictos de duplicados en el servidor
IF EXISTS (SELECT name FROM sys.server_principals WHERE name = N'usuario_colegio')
BEGIN
    DROP LOGIN usuario_colegio;
END
GO

-- 3. Creación limpia de la infraestructura base
CREATE DATABASE SistemaColegio;
GO

-- Crear el Login de servidor indispensable para la conexión de la API [cite: 79, 80]
CREATE LOGIN usuario_colegio WITH PASSWORD = 'SIGUE-Proy-2026';
GO

USE SistemaColegio;
GO

-- Crear el Usuario interno de la BD asociado al Login [cite: 81]
CREATE USER usuario_colegio FOR LOGIN usuario_colegio; 
GO

-- Crear los roles de seguridad interna del motor 
CREATE ROLE AdminRole;
CREATE ROLE AcadRole;
CREATE ROLE ProfRole;
CREATE ROLE ReportRole;
GO

-- Mapear los privilegios de administración del motor al usuario de la aplicación [cite: 85]
EXEC sp_addrolemember 'AdminRole', 'usuario_colegio';
GO

-- ============================================================================
-- 4. CREACIÓN DE ESTRUCTURAS TRANSACCIONALES (OLTP) EN 3FN
-- ============================================================================

CREATE TABLE Rol (
    IdRol INT IDENTITY(1,1) NOT NULL,
    NombreRol VARCHAR(50) NOT NULL,
    Descripcion VARCHAR(255) NULL,
    CONSTRAINT PK_Rol PRIMARY KEY (IdRol),
    CONSTRAINT UQ_NombreRol UNIQUE (NombreRol)
);

CREATE TABLE Usuario (
    IdUsuario INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    Correo VARCHAR(100) NOT NULL,
    PasswordHash VARBINARY(256) NOT NULL,
    Salt UNIQUEIDENTIFIER NOT NULL,
    Estado BIT DEFAULT 1 NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE() NOT NULL,
    CONSTRAINT PK_Usuario PRIMARY KEY (IdUsuario),
    CONSTRAINT UQ_Correo UNIQUE (Correo)
);

CREATE TABLE UsuarioRol (
    IdUsuario INT NOT NULL,
    IdRol INT NOT NULL,
    CONSTRAINT PK_UsuarioRol PRIMARY KEY (IdUsuario, IdRol),
    CONSTRAINT FK_UsuarioRol_Usuario FOREIGN KEY (IdUsuario) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE,
    CONSTRAINT FK_UsuarioRol_Rol FOREIGN KEY (IdRol) REFERENCES Rol(IdRol) ON DELETE CASCADE
);

CREATE TABLE Grado (
    IdGrado INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(50) NOT NULL,
    CONSTRAINT PK_Grado PRIMARY KEY (IdGrado)
);

CREATE TABLE Materia (
    IdMateria INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    IdGrado INT NOT NULL,
    CONSTRAINT PK_Materia PRIMARY KEY (IdMateria),
    CONSTRAINT FK_Materia_Grado FOREIGN KEY (IdGrado) REFERENCES Grado(IdGrado)
);

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

CREATE TABLE SeccionAlumno (
    IdSeccion INT NOT NULL,
    IdAlumno INT NOT NULL,
    CONSTRAINT PK_SeccionAlumno PRIMARY KEY (IdSeccion, IdAlumno),
    CONSTRAINT FK_SeccionAlumno_Seccion FOREIGN KEY (IdSeccion) REFERENCES Seccion(IdSeccion) ON DELETE CASCADE,
    CONSTRAINT FK_SeccionAlumno_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario) ON DELETE CASCADE
);

CREATE TABLE Tema (
    IdTema INT IDENTITY(1,1) NOT NULL,
    Nombre VARCHAR(100) NOT NULL,
    IdMateria INT NOT NULL,
    CONSTRAINT PK_Tema PRIMARY KEY (IdTema),
    CONSTRAINT FK_Tema_Materia FOREIGN KEY (IdMateria) REFERENCES Materia(IdMateria)
);

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

CREATE TABLE RecursoEntrega (
    IdRecurso INT IDENTITY(1,1) NOT NULL,
    IdEntrega INT NOT NULL,
    Tipo VARCHAR(50) NOT NULL,
    URL VARCHAR(255) NOT NULL,
    CONSTRAINT PK_RecursoEntrega PRIMARY KEY (IdRecurso),
    CONSTRAINT FK_RecursoEntrega_Entrega FOREIGN KEY (IdEntrega) REFERENCES Entrega(IdEntrega) ON DELETE CASCADE
);

CREATE TABLE Calificacion (
    IdCalificacion INT IDENTITY(1,1) NOT NULL,
    IdEntrega INT NOT NULL,
    Nota DECIMAL(5,2) NOT NULL,
    Observacion VARCHAR(MAX) NULL,
    FechaCalificacion DATETIME DEFAULT GETDATE() NOT NULL,
    CONSTRAINT PK_Calificacion PRIMARY KEY (IdCalificacion),
    CONSTRAINT FK_Calificacion_Entrega FOREIGN KEY (IdEntrega) REFERENCES Entrega(IdEntrega) ON DELETE CASCADE,
    CONSTRAINT CK_Nota CHECK (Nota BETWEEN 0 AND 100)
);

CREATE TABLE RelacionFamiliar (
    IdRelacion INT IDENTITY(1,1) NOT NULL,
    IdPadre INT NOT NULL,
    IdAlumno INT NOT NULL,
    CONSTRAINT PK_RelacionFamiliar PRIMARY KEY (IdRelacion),
    CONSTRAINT UQ_RelacionFamiliar UNIQUE (IdPadre, IdAlumno),
    CONSTRAINT FK_RelacionFamiliar_Padre FOREIGN KEY (IdPadre) REFERENCES Usuario(IdUsuario),
    CONSTRAINT FK_RelacionFamiliar_Alumno FOREIGN KEY (IdAlumno) REFERENCES Usuario(IdUsuario)
);

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

CREATE TABLE Bitacora (
    IdBitacora INT IDENTITY(1,1) NOT NULL,
    IdUsuario INT NULL,
    Accion VARCHAR(100) NOT NULL,
    TablaAfectada VARCHAR(100) NOT NULL,
    Fecha DATETIME DEFAULT GETDATE() NOT NULL,
    Detalle VARCHAR(MAX) NOT NULL,
    CONSTRAINT PK_Bitacora PRIMARY KEY (IdBitacora)
);

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

CREATE TABLE MonitoreoConsulta (
    IdMonitoreo INT IDENTITY(1,1) NOT NULL,
    Consulta VARCHAR(MAX) NOT NULL,
    TiempoEjecucion DECIMAL(10,4) NOT NULL,
    Fecha DATETIME DEFAULT GETDATE() NOT NULL,
    CONSTRAINT PK_MonitoreoConsulta PRIMARY KEY (IdMonitoreo)
);
GO

-- ============================================================================
-- 5. INTERFACES DE PROGRAMACIÓN (PROCEDIMIENTOS ALMACENADOS)
-- ============================================================================

CREATE PROCEDURE sp_RegistrarUsuario
    @Nombre VARCHAR(100),
    @Correo VARCHAR(100),
    @Password VARCHAR(100),
    @IdRol INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Salt UNIQUEIDENTIFIER = NEWID();
    
    BEGIN TRY
        BEGIN TRANSACTION; -- [cite: 154]
        
        INSERT INTO Usuario (Nombre, Correo, PasswordHash, Salt)
        VALUES (
            @Nombre, 
            @Correo, 
            HASHBYTES('SHA2_256', CAST(@Password AS VARCHAR(100)) + CAST(@Salt AS VARCHAR(36))), 
            @Salt
        );
        
        DECLARE @NuevoId INT = SCOPE_IDENTITY();
        
        INSERT INTO UsuarioRol (IdUsuario, IdRol)
        VALUES (@NuevoId, @IdRol);
        
        COMMIT TRANSACTION; -- [cite: 154, 165]
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; -- [cite: 154, 166]
        THROW 50001, 'Error al registrar el usuario. Verifique los datos o duplicidad.', 1;
    END CATCH
END;
GO

CREATE PROCEDURE sp_AutenticarUsuario
    @Correo VARCHAR(100),
    @Password VARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Salt UNIQUEIDENTIFIER;
    
    SELECT @Salt = Salt FROM Usuario WHERE Correo = @Correo AND Estado = 1;
    
    IF @Salt IS NOT NULL
    BEGIN
        SELECT u.IdUsuario, u.Nombre, u.Correo, ur.IdRol
        FROM Usuario u
        INNER JOIN UsuarioRol ur ON u.IdUsuario = ur.IdUsuario
        WHERE u.Correo = @Correo 
          AND u.PasswordHash = HASHBYTES('SHA2_256', CAST(@Password AS VARCHAR(100)) + CAST(@Salt AS VARCHAR(36)));
    END
END;
GO

CREATE PROCEDURE sp_AsignarCalificacion
    @IdEntrega INT,
    @Nota DECIMAL(5,2),
    @Observacion VARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION; -- [cite: 154]
        
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
        
        COMMIT TRANSACTION; -- [cite: 154, 165]
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION; -- [cite: 154, 166]
        DECLARE @ErrMsg NVARCHAR(4000) = ERROR_MESSAGE();
        RAISERROR(@ErrMsg, 16, 1);
    END CATCH
END;
GO

-- ============================================================================
-- 6. AUTOMATIZACIÓN DE AUDITORÍA, OPTIMIZACIÓN Y RESPALDOS
-- ============================================================================

CREATE TRIGGER TR_Auditoria_Calificacion_Eliminada
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

CREATE NONCLUSTERED INDEX IX_Seccion_Materia_Anio ON Seccion (IdMateria, Anio);
CREATE NONCLUSTERED INDEX IX_Entrega_Actividad_Alumno ON Entrega (IdActividad, IdAlumno);
CREATE NONCLUSTERED INDEX IX_Calificacion_Entrega ON Calificacion (IdEntrega);
GO

CREATE PROCEDURE sp_GenerarBackupCompleto
    @RutaCarpeta VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @Fecha VARCHAR(20) = REPLACE(REPLACE(CONVERT(VARCHAR, GETDATE(), 120), '-', '_'), ':', '_');
    DECLARE @RutaCompleta VARCHAR(500) = CONCAT(@RutaCarpeta, 'SIGE_Backup_', @Fecha, '.bak');
    DECLARE @SQL NVARCHAR(600);
    
    BEGIN TRY
        SET @SQL = N'BACKUP DATABASE SistemaColegio '
                 + N'TO DISK = @Ruta '
                 + N'WITH FORMAT, MEDIANAME = ''AppBackups'', '
                 + N'NAME = ''Respaldo Completo Automatico SIGE''';

        EXEC sp_executesql @SQL, N'@Ruta VARCHAR(500)', @Ruta = @RutaCompleta;
    END TRY
    BEGIN CATCH
        THROW 50003, 'Error crítico de infraestructura al escribir el archivo de respaldo físico.', 1;
    END CATCH
END;
GO