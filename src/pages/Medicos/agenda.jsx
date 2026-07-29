import React from "react";
import { Link } from "react-router-dom";
import Layout_Medicos from "./Layout_Medicos";
import Calendar from "./Calendar";

// Material UI Icons
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import PersonPinRoundedIcon from "@mui/icons-material/PersonPinRounded";

import "./Agenda.css";

function Agenda({ data = [] }) {
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


        {/* CONTENEDOR PRINCIPAL DEL CALENDARIO */}
        <div className="calendar-glass-card">
          <div className="calendar-header-title">
            <EventNoteRoundedIcon className="calendar-icon" />
            <h3>Calendario de Consultas</h3>
          </div>

          <div className="calendar-embed-container">
            <Calendar citas={citasParaCalendario} />
          </div>
        </div>
      </div>
    </Layout_Medicos>
  );
}

export default Agenda;