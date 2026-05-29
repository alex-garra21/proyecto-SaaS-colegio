-- Esqueleto Relacional Base - Sistema Integral de Gestión Escolar (SIGE)

CREATE TABLE CatCursos (
    CursoID VARCHAR(20) PRIMARY KEY,
    NombreCurso NVARCHAR(100) NOT NULL
);

CREATE TABLE CatGrados (
    GradoID VARCHAR(20) PRIMARY KEY, -- 'FIRST_BASIC', 'SECOND_BASIC', 'THIRD_BASIC'
    NombreGrado NVARCHAR(50) NOT NULL
);

CREATE TABLE CatCiclos (
    AnioCiclo INT PRIMARY KEY
);

-- Tabla de Asignación e Identificación de Secciones por Ciclo Escolar
CREATE TABLE SeccionesAsignadas (
    SeccionID INT IDENTITY(1,1) PRIMARY KEY,
    NombreAsignacion NVARCHAR(100) NOT NULL, -- Ej: 'Primero Básico Sección A'
    GradoID VARCHAR(20) FOREIGN KEY REFERENCES CatGrados(GradoID),
    AnioCiclo INT FOREIGN KEY REFERENCES CatCiclos(AnioCiclo)
);

-- Alumnos matriculados en una Sección y Ciclo específico
CREATE TABLE MatriculaAlumnos (
    MatriculaID INT IDENTITY(1,1) PRIMARY KEY,
    EstudianteID VARCHAR(50) NOT NULL, -- Relación con el core de usuarios del proyecto
    SeccionID INT FOREIGN KEY REFERENCES SeccionesAsignadas(SeccionID)
);

-- Rotación de Docentes en cursos y secciones (Control de colisiones)
CREATE TABLE AsignacionHorariosDocentes (
    HorarioID INT IDENTITY(1,1) PRIMARY KEY,
    DocenteID VARCHAR(50) NOT NULL,
    CursoID VARCHAR(20) FOREIGN KEY REFERENCES CatCursos(CursoID),
    SeccionID INT FOREIGN KEY REFERENCES SeccionesAsignadas(SeccionID),
    DiaSemana INT NOT NULL, -- 1 a 5
    HoraInicio TIME NOT NULL,
    HoraFin TIME NOT NULL
);

-- Registro de Caja Manual para validación de solvencia en el portal de padres
CREATE TABLE RegistroPagosManuales (
    PagoID INT IDENTITY(1,1) PRIMARY KEY,
    EstudianteID VARCHAR(50) NOT NULL,
    MesCiclo INT NOT NULL, -- 1 al 10
    Monto NUMERIC(10,2) NOT NULL,
    ReferenciaRecibo NVARCHAR(50) NOT NULL,
    FechaRegistro DATETIME DEFAULT GETDATE()
);