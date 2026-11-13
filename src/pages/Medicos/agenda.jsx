import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import Layout_Medicos from "./Layout_Medicos";
import Calendar from "./Calendar";
import WeekSchedule from "../../components/uso/WeekSchedule";

// Material UI Icons
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import ViewWeekRoundedIcon from "@mui/icons-material/ViewWeekRounded";

import "./Agenda.css";

dayjs.locale("es");

/* ---------- Helpers ---------- */

// Debe coincidir con el prop `dateFormat` de WeekSchedule (por defecto "DD MMMM YYYY")
const DATE_FORMAT = "DD MMMM YYYY";

// Rangos del filtro de horario (horas en formato 24h, `to` incluido).
// Es lo que WeekSchedule usa para los botones "00:00 - 05:00", "06:00 - 10:00", etc.
const RANGOS_HORARIO = [
  { label: "00:00 - 05:00", from: 0, to: 5 },
  { label: "06:00 - 10:00", from: 6, to: 10 },
  { label: "11:00 - 15:00", from: 11, to: 15 },
  { label: "16:00 - 21:00", from: 16, to: 21 },
  { label: "22:00 - 23:59", from: 22, to: 23 },
];

// Genera las horas del horario del doctor:
// ("08:00", "13:00", 30) -> ["08:00 AM", "08:30 AM", ...]
// Para un horario de día completo usa ("00:00", "24:00", 60).
function generarHoras(inicio, fin, intervaloMin = 60) {
  const aMinutos = (t) => {
    const [h, m = 0] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const horas = [];
  for (let min = aMinutos(inicio); min < aMinutos(fin); min += intervaloMin) {
    horas.push(dayjs().startOf("day").add(min, "minute").format("hh:mm A"));
  }
  return horas;
}

// Convierte una cita del backend al formato que entiende WeekSchedule
function citaASlot(cita) {
  const f = dayjs(cita.fechaCita); // "2026-03-10 10:30"
  return {
    date: f.format(DATE_FORMAT), // "10 marzo 2026"
    time: f.format("hh:mm A"), // "10:30 AM"
    paciente: `${cita.nombre} ${cita.apellidoP}`,
    motivo: cita.motivoCita,
    tipo: cita.tipoCita,
  };
}

function Agenda({ data = [], horarioDoctor }) {
  // Citas estáticas / de prueba
  const citasFijas = [
    {
      fechaCita: "2026-03-01 08:00",
      nombre: "Juan",
      apellidoP: "Pérez",
      motivoCita: "Consulta general",
      tipoCita: "Presencial",
    },
    {
      fechaCita: "2026-03-10 10:30",
      nombre: "María",
      apellidoP: "López",
      motivoCita: "Control médico",
      tipoCita: "Presencial",
    },
    {
      fechaCita: "2026-03-21 09:00",
      nombre: "Carlos",
      apellidoP: "Gómez",
      motivoCita: "Revisión",
      tipoCita: "Virtual",
    },
  ];

  const citasParaCalendario = data.length > 0 ? data : citasFijas;

  // Horario del doctor. Idealmente llega por props o desde tu API.
  // diasLaborales: 1 = lunes ... 7 = domingo (isoWeekday)
  const horario = horarioDoctor ?? {
    inicio: "00:00",
    fin: "24:00",
    intervaloMin: 30,
    diasLaborales: [1, 2, 3, 4, 5],
  };

  const horas = useMemo(
    () => generarHoras(horario.inicio, horario.fin, horario.intervaloMin),
    [horario.inicio, horario.fin, horario.intervaloMin]
  );

  const slotsOcupados = useMemo(
    () => citasParaCalendario.map(citaASlot),
    [citasParaCalendario]
  );

  // Bloquea los días en que el doctor no atiende
  const diaNoLaboral = (day) =>
    !horario.diasLaborales.includes(day.isoWeekday());

  const [slotSeleccionado, setSlotSeleccionado] = useState(null);

  // Vista activa: "semana" (horario semanal) o "mes" (calendario normal)
  const [vista, setVista] = useState("semana");

  const cambiarVista = (_, nuevaVista) => {
    // ToggleButtonGroup devuelve null si se hace clic en el botón ya activo
    if (nuevaVista !== null) setVista(nuevaVista);
  };

  return (
    <Layout_Medicos>
      <div className="agenda-wrapper">
        {/* ENCABEZADO Y BARRAS DE ACCIONES */}
        <header className="agenda-header-card">
          <div className="header-info">
            <div className="header-badge">
              <CalendarMonthRoundedIcon fontSize="small" />
              <span>Gestión de Tiempo</span>
            </div>
            <h1 className="header-title">Agenda Médica</h1>
            <p className="header-subtitle">
              Administración clínica de citas, horarios y modalidades de atención.
            </p>
          </div>

          <Link to="/Medicos/citas" className="btn-add-cita">
            <AddRoundedIcon />
            <span>Nueva Cita</span>
          </Link>
        </header>

        {/* VISTA DE AGENDA (semanal o calendario) */}
        <div className="calendar-glass-card">
          <div className="calendar-header-title agenda-view-header">
            <div className="agenda-view-title">
              {vista === "semana" ? (
                <ScheduleRoundedIcon className="calendar-icon" />
              ) : (
                <EventNoteRoundedIcon className="calendar-icon" />
              )}
              <h3>
                {vista === "semana" ? "Horario semanal" : "Calendario de Consultas"}
              </h3>
            </div>

            <ToggleButtonGroup
              value={vista}
              exclusive
              size="small"
              onChange={cambiarVista}
              aria-label="Cambiar vista de agenda"
            >
              <ToggleButton value="semana" aria-label="Vista semanal">
                <ViewWeekRoundedIcon fontSize="small" />
                <span className="agenda-toggle-label">Semana</span>
              </ToggleButton>
              <ToggleButton value="mes" aria-label="Vista calendario">
                <CalendarMonthRoundedIcon fontSize="small" />
                <span className="agenda-toggle-label">Calendario</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div className="calendar-embed-container">
            {vista === "semana" ? (
              <WeekSchedule
                title={null}
                readOnly
                hours={horas}
                timeRanges={RANGOS_HORARIO}
                appointments={slotsOcupados}
                isSlotDisabled={diaNoLaboral}
                availableLabel="Disponible"
                // Para probar con las citas de prueba (marzo 2026), descomenta:
                // initialDate="2026-03-10"
                onSelectSlot={setSlotSeleccionado}
                renderBookedSlot={(cita) => (
                  <div className="ws-booked-info">
                    <strong>{cita.paciente}</strong>
                    <span>
                      {cita.tipo} · {cita.motivo}
                    </span>
                  </div>
                )}
              />
            ) : (
              <Calendar citas={citasParaCalendario} />
            )}
          </div>
        </div>
      </div>
    </Layout_Medicos>
  );
}

export default Agenda;