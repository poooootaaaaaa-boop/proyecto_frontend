import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Layout_Medicos from "./Layout_Medicos";

// Material UI Components
import { Chip, TablePagination, Avatar } from "@mui/material";

// Iconos
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import HourglassTopRoundedIcon from "@mui/icons-material/HourglassTopRounded";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";

import "./Dashboard_medicos.css";

const API_URL = import.meta.env.VITE_API_URL;

function Dashboard_medicos() {
  const [citas, setCitas] = useState([]);
  const [consultas, setConsultas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  
  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const userStorage = localStorage.getItem("usuario");
    if (userStorage) {
      try {
        setUsuario(JSON.parse(userStorage));
      } catch (e) {
        console.error("Error al parsear el usuario:", e);
      }
    }
  }, []);

  useEffect(() => {
    Axios.get(`${API_URL}/MostrarConsulta`)
      .then((res) => setConsultas(res.data || []))
      .catch((error) => console.error("Error cargando consultas:", error));
  }, []);

  useEffect(() => {
    const doctor_id = 1; 
    Axios.get(`${API_URL}/citas-doctor/${doctor_id}`)
      .then((res) => setCitas(res.data || []))
      .catch((err) => console.error("Error cargando citas:", err));
  }, []);

  // Formato de fecha actual
  const hoyDate = new Date();
  const hoyISO = `${hoyDate.getFullYear()}-${String(hoyDate.getMonth() + 1).padStart(2, "0")}-${String(hoyDate.getDate()).padStart(2, "0")}`;

  const citasHoy = citas.filter((c) => c.fecha_inicio?.slice(0, 10) === hoyISO);
  const consultasHoy = consultas.filter((c) => c.created_at?.slice(0, 10) === hoyISO);

  const citasPendientes = citasHoy.filter((c) => c.estado === "pendiente").length;
  const citasCompletadas = citasHoy.filter((c) => c.estado === "completada").length;
  const totalRecetasHoy = consultasHoy.length;

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatHora = (fechaStr) => {
    if (!fechaStr) return "--:--";
    return new Date(fechaStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const getInitials = (name = "") => name.charAt(0).toUpperCase();

  return (
    <Layout_Medicos>
      <div className="dashboard-wrapper-main">
        
        {/* Banner Superior / Cabecera */}
        <header className="dashboard-header">
          <div className="header-info">
            <div className="doctor-badge">
              <LocalHospitalRoundedIcon fontSize="small" />
              <span>Panel Médico Activo</span>
            </div>
            <h1 className="welcome-title">
              Bienvenido, {usuario ? `Dr. ${usuario.nombre}` : "Doctor"}
            </h1>
            <p className="welcome-subtitle">
              Resumen clínico general y agenda programada para hoy,{" "}
              <strong>
                {hoyDate.toLocaleDateString("es-ES", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </strong>
            </p>
          </div>
          <Link to="/Medicos/consulta" className="btn-primary-action">
            <AddRoundedIcon />
            <span>Nueva Consulta</span>
          </Link>
        </header>

        {/* Layout Principal Grid */}
        <div className="dashboard-grid-layout">
          
          {/* Contenido Izquierdo */}
          <main className="main-content">
            
            {/* Grid de Tarjetas de Estadísticas */}
            <section className="stats-grid">
              
              <div className="stat-card blue">
                <div className="stat-header">
                  <span className="stat-label">Citas de Hoy</span>
                  <div className="stat-icon-wrapper">
                    <CalendarMonthRoundedIcon />
                  </div>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{citasHoy.length}</span>
                  <span className="stat-subtext">Pacientes programados</span>
                </div>
              </div>

              <div className="stat-card amber">
                <div className="stat-header">
                  <span className="stat-label">En Espera</span>
                  <div className="stat-icon-wrapper">
                    <HourglassTopRoundedIcon />
                  </div>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{citasPendientes}</span>
                  <span className="stat-subtext">Consultas pendientes</span>
                </div>
              </div>

              <div className="stat-card emerald">
                <div className="stat-header">
                  <span className="stat-label">Atendidos</span>
                  <div className="stat-icon-wrapper">
                    <CheckCircleOutlineRoundedIcon />
                  </div>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{citasCompletadas}</span>
                  <span className="stat-subtext">Consultas finalizadas</span>
                </div>
              </div>

              <div className="stat-card purple">
                <div className="stat-header">
                  <span className="stat-label">Recetas Emitidas</span>
                  <div className="stat-icon-wrapper">
                    <MedicationRoundedIcon />
                  </div>
                </div>
                <div className="stat-body">
                  <span className="stat-value">{totalRecetasHoy}</span>
                  <span className="stat-subtext">Emitidas el día de hoy</span>
                </div>
              </div>

            </section>

            {/* Tabla de Citas del Día */}
            <section className="table-card">
              <div className="table-header">
                <div>
                  <h2 className="table-title">Agenda del Día</h2>
                  <p className="table-subtitle">Pacientes asignados para la jornada de hoy</p>
                </div>
                <span className="count-badge">{citasHoy.length} Citas</span>
              </div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Horario</th>
                      <th>Paciente</th>
                      <th>Motivo de Consulta</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {citasHoy.length > 0 ? (
                      citasHoy
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((cita, index) => {
                          const nombreCompleto = `${cita.paciente?.usuario?.nombre || "Paciente"} ${
                            cita.paciente?.apellidoP || ""
                          }`.trim();
                          const estado = cita.estado || "pendiente";

                          return (
                            <tr key={cita.id || index}>
                              <td className="time-cell">
                                <span className="time-text">{formatHora(cita.fecha_inicio)}</span>
                              </td>
                              <td className="patient-cell">
                                <div className="patient-info">
                                  <Avatar className="patient-avatar">
                                    {getInitials(cita.paciente?.usuario?.nombre)}
                                  </Avatar>
                                  <div className="patient-name-container">
                                    <span className="patient-name">{nombreCompleto}</span>
                                    <span className="patient-sub">ID: #{cita.paciente?.id || index + 1}</span>
                                  </div>
                                </div>
                              </td>
                              <td className="reason-cell">
                                <span className="reason-badge">
                                  {cita.motivo || "Consulta General"}
                                </span>
                              </td>
                              <td>
                                <Chip
                                  label={estado.toUpperCase()}
                                  className={`status-chip ${estado}`}
                                  size="small"
                                />
                              </td>
                            </tr>
                          );
                        })
                    ) : (
                      <tr>
                        <td colSpan="4" className="empty-state-cell">
                          <div className="empty-state">
                            <CalendarMonthRoundedIcon className="empty-icon" />
                            <p>No hay consultas agendadas para el día de hoy.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <TablePagination
                component="div"
                count={citasHoy.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage="Filas:"
              />
            </section>

          </main>

          {/* Lateral Derecho (Sidebar Acciones) */}
          <aside className="sidebar-content">
            
            {/* Panel Acceso Rápido */}
            <div className="sidebar-card">
              <h3 className="sidebar-title">Acceso Rápido</h3>
              <div className="quick-actions">
                <Link to="/Medicos/alta_pacientes" className="action-button">
                  <div className="action-icon icon-blue">
                    <PersonAddAlt1RoundedIcon />
                  </div>
                  <div className="action-text">
                    <span className="action-title">Nuevo Paciente</span>
                    <span className="action-desc">Registrar expediente</span>
                  </div>
                </Link>

                <button type="button" className="action-button">
                  <div className="action-icon icon-slate">
                    <HistoryRoundedIcon />
                  </div>
                  <div className="action-text">
                    <span className="action-title">Historial Clínico</span>
                    <span className="action-desc">Consultar expedientes</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Panel Últimas Recetas */}
            <div className="sidebar-card">
              <div className="sidebar-header-inline">
                <h3 className="sidebar-title">Recetas Recientes</h3>
                <span className="pulse-indicator" />
              </div>
              
              <div className="prescriptions-list">
                {consultasHoy.length > 0 ? (
                  consultasHoy.slice(0, 5).map((consulta, i) => (
                    <div key={consulta.id || i} className="prescription-item">
                      <div className="prescription-icon">
                        <DescriptionRoundedIcon fontSize="small" />
                      </div>
                      <div className="prescription-details">
                        <h4 className="prescription-title">{consulta.motivo || "Consulta Médica"}</h4>
                        <p className="prescription-patient">
                          {consulta.paciente?.usuario?.nombre} {consulta.paciente?.apellidoP || ""}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-sidebar">
                    <DescriptionRoundedIcon className="empty-sidebar-icon" />
                    <p>No se han registrado recetas en el turno actual.</p>
                  </div>
                )}
              </div>
            </div>

          </aside>

        </div>
      </div>
    </Layout_Medicos>
  );
}

export default Dashboard_medicos;