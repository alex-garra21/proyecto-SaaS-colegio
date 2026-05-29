# ARCHIVO MAESTRO DE INGENIERÍA: PLAN DE MÓDULOS, ROLES Y REGLAS DE NEGOCIO (SIGE)
## Fuente de Verdad para Agente Autónomo (Antigravity) — Producción Monorepo

---

## 🎨 1. POLÍTICAS DE DISEÑO CORPORATIVO Y DESIGN TOKENS (`designTokens.ts`)

El agente autónomo debe inyectar estrictamente los siguientes parámetros de diseño visual y espacial en el DOM / Componentes de cada suite. Queda prohibido el uso de estilos libres fuera de esta matriz.

### 1.1 Reglas de Densidad y Geometría
* **Tipografía Global:** `Inter, sans-serif` en todas las interfaces para maximizar el escaneo de datos analíticos.
* **Escala de Espaciado Estricta:** Basada en múltiplos de `8px`.
  * `gap-2` = 8px | `gap-4` = 16px | `gap-6` = 24px
  * `p-2` = 8px   | `p-4` = 16px   | `p-6` = 24px
* **Radios de Curvatura (Border Radius) por Suite:**
  * **Control Académico y Suite Docente (EducatorPro):** Carácter técnico y de alta precisión.
    * Botones, inputs, dropdowns, celdas de cuadrícula: `rounded-md` o `rounded-[4px]`.
    * Tarjetas contenedoras, paneles Bento y layouts principales: `rounded-lg` o `rounded-[8px]`.
  * **Portal de Padres (ParentPortal):** Carácter fluido, empático y accesible.
    * Botones y elementos interactivos: `rounded-xl` (12px).
    * Tarjetas de estudiantes y contenedores: `rounded-2xl` (16px).
  * **Portal de Alumnos (Aventura Kids):** Entorno lúdico e infantil (Early-Readers).
    * Tarjetas cuadradas de materias, botones de juego: `rounded-3xl` (24px) o `rounded-2xl` (16px).
    * Barras de progreso, chips e indicadores rápidos: `rounded-full` (999px).

---

## 🏛️ 2. ESPECIFICACIÓN POR ROL

### 2.1 ROL: CONTROL ACADÉMICO (`/control-academico/*`)
Este rol es el nodo operativo central del sistema. Configura los catálogos base de forma atomizada e independiente para construir la estructura del año escolar, maneja asignaciones masivas y realiza el control de caja manual.

#### A. Vistas e Infraestructura de Componentes (Diseño Atómico)
1. **Vista de Catálogos e Infraestructura Base (`/control-academico/configuracion-base`)**
   * **Atoms:**
     * `InputText`: Campo de texto estilizado, borde `1px solid #c4c5d5`, fuente `Inter`.
     * `ButtonPrimary`: Botón sólido (`h-[40px]`, `bg-[#00288e]`, `text-white`, `rounded-[4px]`).
     * `CustomSelect`: Componente personalizado de selección para Grados (Restringido estrictamente a: Primero Básico, Segundo Básico, Tercero Básico). Queda terminantemente prohibido el uso de la etiqueta select nativa del navegador.
   * **Molecules:**
     * `FormCard`: Tarjeta contenedora (`bg-white`, `rounded-[8px]`, `p-4`, `shadow-sm`) con formulario independiente para inserción de cursos individuales (ej. Matemáticas, Lenguaje).
     * `CycleGridItem`: Elemento de rejilla interactivo para activar Ciclos Escolares (ej. 2025, 2026).
   * **Organisms:**
     * `BentoGridEntities`: Cuadrícula asimétrica (`grid grid-cols-1 lg:grid-cols-12 gap-6`) que organiza visualmente los tres paneles independientes de alta densidad: Cursos, Grados y Ciclos Lectivos.

2. **Vista de Estructuración y Asignación de Secciones (`/control-academico/secciones`)**
   * **Molecules:**
     * `SectionAssignmentForm`: Formulario combinatorio que une un **Curso + Grado + Ciclo Lectivo** y le asigna un nombre unificado de persistencia (Ej: `"Primero Básico Sección A"`, `"Primero Básico Sección B"`).
   * **Organisms:**
     * `ScheduleValidatorGrid`: Rejilla horaria visual interactiva que organiza los periodos de clases y valida colisiones y duplicidades horarias del cuerpo docente en tiempo de ejecución.

3. **Vista de Vinculación Familiar y Matrícula (`/control-academico/vinculaciones`)**
   * **Molecules:**
     * `StudentMassPicker`: Lista interactiva densa con checkboxes para selección múltiple de alumnos precargados.
     * `TutorSingleSelector`: Buscador con autocompletado para asignar uno o múltiples alumnos a un único encargado/padre de familia.
   * **Organisms:**
     * `MassEnrollmentPanel`: Contenedor principal para matricular un grupo filtrado de estudiantes a una sección activa específica de un ciclo escolar.

4. **Vista de Registro de Caja y Mensualidades (`/control-academico/pagos`)**
   * **Molecules:**
     * `ManualPaymentForm`: Interfaz de captura manual de egresos/ingresos financieros (Campos: Estudiante, Mes del ciclo [1-10], Monto en Quetzales, Correlativo/Referencia física).

#### B. Lógica de Negocio Funcional y Contratos de Datos

```typescript
// Interfaces estrictas para el tipado de entidades en Control Académico
export interface CursoBase {
  id: string; // UUID o código correlativo (ej: "CUR-MAT")
  nombre: string; // Ej: "Matemáticas", "Lenguaje"
}

export interface GradoBase {
  id: 'FIRST_BASIC' | 'SECOND_BASIC' | 'THIRD_BASIC';
  nombre: string; // "Primero Básico", "Segundo Básico", "Tercero Básico"
}

export interface CicloLectivo {
  anio: number; // Ej: 2025, 2026
}

export interface AsignacionSeccion {
  id: string;
  nombreAsignacion: string; // Ej: "Primero Básico Sección A"
  gradoId: 'FIRST_BASIC' | 'SECOND_BASIC' | 'THIRD_BASIC';
  cicloAnio: number;
  estudiantesIds: string[]; // Listado masivo asignado por Control Académico
}

export interface HorarioDocenteCurso {
  id: string;
  docenteId: string;
  cursoId: string;
  seccionId: string;
  diaSemana: number; // 1 = Lunes, 5 = Viernes
  horaInicio: string; // Formato "HH:MM" (ej: "07:30")
  horaFin: string; // Formato "HH:MM" (ej: "08:15")
}

export interface PagoMensualidadManual {
  id: string;
  estudianteId: string;
  mesCiclo: number; // 1 = Enero, 10 = Octubre (Meses de cobro regular en Guatemala)
  monto: number;
  referenciaRecibo: string;
  fechaTransaccion: string; // ISO String
}