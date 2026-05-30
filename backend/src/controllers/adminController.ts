import type { Request, Response } from 'express';
import sql from 'mssql';
import { getPool } from '../config/db.js';

interface BitacoraRow {
  IdBitacora: number;
  Usuario: string | null;
  Accion: string;
  TablaAfectada: string;
  Fecha: Date;
  Detalle: string;
}

export async function getBitacoras(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    // Consulta en 3FN que asocia el log de bitácora con el nombre del usuario operador (si existe)
    const result = await pool.request().query<BitacoraRow>(`
      SELECT 
        b.IdBitacora,
        u.NombreCompleto AS Usuario,
        b.Accion,
        b.TablaAfectada,
        b.Fecha,
        b.Detalle
      FROM Bitacora b
      LEFT JOIN Usuario u ON b.IdUsuario = u.IdUsuario
      ORDER BY b.Fecha DESC
    `);

    res.json(result.recordset);
  } catch (error: any) {
    console.error('Error al obtener bitácoras de la base de datos:', error);
    res.status(500).json({ 
      message: 'Error al obtener bitácoras desde SQL Server.',
      error: error?.message || String(error)
    });
  }
}

export async function generarBackup(req: Request, res: Response): Promise<void> {
  const { rutaCarpeta } = req.body as { rutaCarpeta?: string };

  if (!rutaCarpeta?.trim()) {
    res.status(400).json({ message: 'La ruta física del servidor es requerida.' });
    return;
  }

  try {
    const pool = await getPool();
    const request = pool.request();
    
    // Llamar al SP transaccional sp_GenerarBackupCompleto
    await request
      .input('RutaCarpeta', sql.VarChar(255), rutaCarpeta.trim())
      .execute('sp_GenerarBackupCompleto');

    // Registrar en bitácora la generación del backup
    await pool.request().query(`
      INSERT INTO Bitacora (IdUsuario, Accion, TablaAfectada, Detalle)
      VALUES (NULL, 'BACKUP', 'DATABASE', 'Respaldo físico generado en: ${rutaCarpeta.replace(/'/g, "''")}')
    `);

    res.json({ 
      message: 'Respaldo de base de datos generado con éxito en el disco del servidor.',
      ruta: rutaCarpeta.trim()
    });
  } catch (error: any) {
    console.error('Error al ejecutar sp_GenerarBackupCompleto:', error);
    res.status(500).json({ 
      message: 'Error de infraestructura física al ejecutar el respaldo.',
      error: error?.message || String(error)
    });
  }
}

// --- SUITE V2: CONTROL ACADÉMICO Y SECCIONES ---

export async function getSecciones(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        s.IdSeccion AS id,
        CONCAT(g.Nombre, ' Sección ', s.LetraSeccion) AS nombreAsignacion,
        s.IdGrado AS gradoId,
        s.LetraSeccion AS letraSeccion,
        s.Anio AS cicloAnio,
        s.CodigoAula AS codigoAula
      FROM SeccionV2 s
      INNER JOIN Grado g ON s.IdGrado = g.IdGrado
      ORDER BY s.Anio DESC, g.Nombre ASC, s.LetraSeccion ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener secciones.', error: error?.message });
  }
}

export async function createSeccion(req: Request, res: Response): Promise<void> {
  const { idGrado, letraSeccion, anio, codigoAula } = req.body as {
    idGrado: number;
    letraSeccion: string;
    anio: number;
    codigoAula: string;
  };

  if (!idGrado || !letraSeccion?.trim() || !anio || !codigoAula?.trim()) {
    res.status(400).json({ message: 'Todos los campos son requeridos.' });
    return;
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('IdGrado', sql.Int, idGrado)
      .input('LetraSeccion', sql.VarChar(10), letraSeccion.trim())
      .input('Anio', sql.Int, anio)
      .input('CodigoAula', sql.VarChar(50), codigoAula.trim())
      .query(`
        INSERT INTO SeccionV2 (IdGrado, LetraSeccion, Anio, CodigoAula)
        VALUES (@IdGrado, @LetraSeccion, @Anio, @CodigoAula)
      `);
    res.status(201).json({ message: 'Sección creada exitosamente.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la sección.', error: error?.message });
  }
}

export async function getPeriodos(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        IdPeriodo AS id,
        NumeroPeriodo AS numeroPeriodo,
        CONVERT(VARCHAR(5), HoraInicio, 108) AS horaInicio,
        CONVERT(VARCHAR(5), HoraFin, 108) AS horaFin,
        EsReceso AS esReceso
      FROM PeriodoHorario
      ORDER BY IdPeriodo ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener periodos horarios.', error: error?.message });
  }
}

export async function getHorarios(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        h.IdHorario AS id,
        h.IdSeccion AS seccionId,
        CONCAT(g.Nombre, ' Sección ', s.LetraSeccion) AS seccionNombre,
        h.IdMateria AS cursoId,
        m.Nombre AS cursoNombre,
        h.IdProfesor AS docenteId,
        u.NombreCompleto AS docenteNombre,
        h.DiaSemana AS diaSemana,
        CONVERT(VARCHAR(5), p.HoraInicio, 108) AS horaInicio,
        CONVERT(VARCHAR(5), p.HoraFin, 108) AS horaFin,
        p.IdPeriodo AS periodoId,
        p.NumeroPeriodo AS numeroPeriodo,
        h.IdCiclo AS cicloId,
        ce.Anio AS cicloAnio
      FROM HorarioClase h
      INNER JOIN SeccionV2 s ON h.IdSeccion = s.IdSeccion
      INNER JOIN Grado g ON s.IdGrado = g.IdGrado
      INNER JOIN Materia m ON h.IdMateria = m.IdMateria
      INNER JOIN Usuario u ON h.IdProfesor = u.IdUsuario
      INNER JOIN PeriodoHorario p ON h.IdPeriodo = p.IdPeriodo
      LEFT JOIN CicloEscolar ce ON h.IdCiclo = ce.IdCiclo
      ORDER BY h.DiaSemana ASC, p.HoraInicio ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener horarios.', error: error?.message });
  }
}

export async function createHorario(req: Request, res: Response): Promise<void> {
  const { idSeccion, idMateria, idProfesor, diaSemana, idPeriodo, idCiclo } = req.body as {
    idSeccion: number;
    idMateria: number;
    idProfesor: number;
    diaSemana: number;
    idPeriodo: number;
    idCiclo: number;
  };

  if (!idSeccion || !idMateria || !idProfesor || !diaSemana || !idPeriodo || !idCiclo) {
    res.status(400).json({ message: 'Todos los campos son requeridos, incluyendo el ciclo lectivo.' });
    return;
  }

  try {
    const pool = await getPool();
    const transaction = new sql.Transaction(pool);
    await transaction.begin();

    try {
      await transaction.request()
        .input('IdSeccion', sql.Int, idSeccion)
        .input('IdMateria', sql.Int, idMateria)
        .input('IdProfesor', sql.Int, idProfesor)
        .input('DiaSemana', sql.Int, diaSemana)
        .input('IdPeriodo', sql.Int, idPeriodo)
        .input('IdCiclo', sql.Int, idCiclo)
        .query(`
          INSERT INTO HorarioClase (IdSeccion, IdMateria, IdProfesor, DiaSemana, IdPeriodo, IdCiclo)
          VALUES (@IdSeccion, @IdMateria, @IdProfesor, @DiaSemana, @IdPeriodo, @IdCiclo)
        `);

      await transaction.commit();
      res.status(201).json({ message: 'Horario programado exitosamente.' });
    } catch (err: any) {
      await transaction.rollback();
      throw err;
    }
  } catch (error: any) {
    console.error('Error al insertar HorarioClase:', error);
    const errorMessage = error?.message || '';
    // Captura defensiva de violación de claves únicas por colisión de horario
    if (
      error.number === 2627 || 
      error.number === 2601 || 
      errorMessage.includes('UQ_AntiColision_Profesor') || 
      errorMessage.includes('UQ_AntiColision_Seccion') ||
      errorMessage.includes('colisión') || 
      errorMessage.includes('conflict') || 
      errorMessage.includes('UQ_')
    ) {
      res.status(409).json({ 
        message: '¡COLISIÓN HORARIA DETECTADA! El docente o la sección ya tienen programada una clase en este periodo.',
        error: errorMessage
      });
      return;
    }
    res.status(500).json({ 
      message: 'Error al programar el periodo horario.',
      error: errorMessage
    });
  }
}

export async function getMatriculas(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        u.IdUsuario AS id,
        u.NombreCompleto AS nombre,
        u.Correo AS correo,
        sa.IdSeccion AS matriculadoSeccionId,
        CONCAT(g.Nombre, ' Sección ', sv.LetraSeccion) AS matriculadoSeccionNombre,
        tutor.NombreCompleto AS encargadoNombre,
        tutor.IdUsuario AS encargadoId
      FROM Usuario u
      INNER JOIN UsuarioRol ur ON u.IdUsuario = ur.IdUsuario
      LEFT JOIN SeccionAlumno sa ON u.IdUsuario = sa.IdAlumno
      LEFT JOIN SeccionV2 sv ON sa.IdSeccion = sv.IdSeccion
      LEFT JOIN Grado g ON sv.IdGrado = g.IdGrado
      LEFT JOIN RelacionFamiliar rf ON u.IdUsuario = rf.IdAlumno
      LEFT JOIN Usuario tutor ON rf.IdPadre = tutor.IdUsuario
      WHERE ur.IdRol = 4 -- Rol de Alumno
      ORDER BY u.NombreCompleto ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener matrícula de alumnos.', error: error?.message });
  }
}

export async function createMatricula(req: Request, res: Response): Promise<void> {
  const { idAlumno, idSeccion } = req.body as { idAlumno: number; idSeccion: number };

  if (!idAlumno || !idSeccion) {
    res.status(400).json({ message: 'El alumno y la sección son obligatorios.' });
    return;
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('IdAlumno', sql.Int, idAlumno)
      .input('IdSeccion', sql.Int, idSeccion)
      .query(`
        -- Un alumno solo pertenece a una sección activa, limpiamos asignación previa
        DELETE FROM SeccionAlumno WHERE IdAlumno = @IdAlumno;
        
        INSERT INTO SeccionAlumno (IdSeccion, IdAlumno)
        VALUES (@IdSeccion, @IdAlumno);
      `);
    res.status(201).json({ message: 'Alumno matriculado exitosamente.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al matricular alumno.', error: error?.message });
  }
}

export async function createVinculacion(req: Request, res: Response): Promise<void> {
  const { idAlumno, idPadre } = req.body as { idAlumno: number; idPadre: number };

  if (!idAlumno || !idPadre) {
    res.status(400).json({ message: 'El alumno y el encargado son obligatorios.' });
    return;
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('IdAlumno', sql.Int, idAlumno)
      .input('IdPadre', sql.Int, idPadre)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM RelacionFamiliar WHERE IdPadre = @IdPadre AND IdAlumno = @IdAlumno)
        BEGIN
            INSERT INTO RelacionFamiliar (IdPadre, IdAlumno)
            VALUES (@IdPadre, @IdAlumno);
        END
      `);
    res.status(201).json({ message: 'Encargado vinculado exitosamente.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al vincular encargado.', error: error?.message });
  }
}

export async function getMaterias(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        IdMateria AS id,
        Nombre AS nombre
      FROM Materia
      ORDER BY Nombre ASC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener materias.', error: error?.message });
  }
}

export async function createMateria(req: Request, res: Response): Promise<void> {
  const { nombre } = req.body as { nombre: string };

  if (!nombre?.trim()) {
    res.status(400).json({ message: 'El nombre es obligatorio.' });
    return;
  }

  try {
    const pool = await getPool();
    await pool.request()
      .input('Nombre', sql.VarChar(100), nombre.trim())
      .query(`
        INSERT INTO Materia (Nombre)
        VALUES (@Nombre)
      `);
    res.status(201).json({ message: 'Materia agregada exitosamente.' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al crear la materia.', error: error?.message });
  }
}

export async function getCiclos(req: Request, res: Response): Promise<void> {
  try {
    const pool = await getPool();
    const result = await pool.request().query(`
      SELECT 
        IdCiclo AS id,
        Anio AS anio,
        Estado AS estado
      FROM CicloEscolar
      ORDER BY Anio DESC
    `);
    res.json(result.recordset);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener ciclos escolares.', error: error?.message });
  }
}
