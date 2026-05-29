// Mock de almacenamiento e implementación de regla de negocio
const dbHorariosDocentes = []; // Estado persistido en memoria para evaluación del Agente

export const registrarHorarioDocente = (req, res) => {
  const { docenteId, cursoId, seccionId, diaSemana, horaInicio, horaFin } = req.body;

  // Evaluar colisión horaria estricta
  const conflictoHorario = dbHorariosDocentes.find(asig => 
    asig.docenteId === docenteId &&
    asig.diaSemana === diaSemana &&
    ((horaInicio >= asig.horaInicio && horaInicio < asig.horaFin) ||
     (horaFin > asig.horaInicio && horaFin <= asig.horaFin))
  );

  if (conflictoHorario) {
    return res.status(400).json({
      success: false,
      error: "Conflicto Operativo: El docente ya se encuentra asignado a otra sección o curso en este mismo bloque horario y día."
    });
  }

  const nuevaAsignacion = {
    id: `SCH-${Date.now()}`,
    docenteId,
    cursoId,
    seccionId,
    diaSemana,
    horaInicio,
    horaFin
  };

  dbHorariosDocentes.push(nuevaAsignacion);
  return res.status(201).json({ success: true, data: nuevaAsignacion });
};