import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import Layout_Medicos from "./Layout_Medicos";

// MUI Components
import { Avatar, TablePagination } from "@mui/material";

// Iconos
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import FolderSharedRoundedIcon from "@mui/icons-material/FolderSharedRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

import "./Lista_pacientes.css";

const API_URL = import.meta.env.VITE_API_URL;

function ListaPaciente() {
  const [data, setData] = useState([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    Axios.get(`${API_URL}/MostrarPaciente`)
      .then((response) => {
        const pacientes = response.data.paciente || response.data || [];
        setData(pacientes);
        setPacientesFiltrados(pacientes);
      })
      .catch((error) => {
        console.error("Error cargando pacientes:", error);
      });
  }, []);

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPage(0); // Reinicia a la primera página al buscar

    const resultado = data.filter((p) => {
      const nombreCompleto = `${p.nombre || ""} ${p.apellidoP || ""} ${p.apellidoM || ""}`.toLowerCase();
      const dniExpediente = (p.dni || p.expediente || p.id || "").toString().toLowerCase();
      const termino = valor.toLowerCase();

      return nombreCompleto.includes(termino) || dniExpediente.includes(termino);
    });

    setPacientesFiltrados(resultado);
  };

  const listaActual = busqueda ? pacientesFiltrados : data;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInitials = (name = "") => name.charAt(0).toUpperCase();

  return (
    <Layout_Medicos>
      <div className="dashboard-wrapper-main">
        
        {/* Cabecera de la Vista */}
        <header className="dashboard-header">
          <div className="header-info">
            <div className="doctor-badge">
              <PeopleAltRoundedIcon fontSize="small" />
              <span>Directorio Médico</span>
            </div>
            <h1 className="welcome-title">Lista de Pacientes</h1>
            <p className="welcome-subtitle">
              Consulte expedientes clínicos y gestione la información general de sus pacientes.
            </p>
          </div>
          <Link to="/Medicos/alta_pacientes" className="btn-primary-action">
            <PersonAddAlt1RoundedIcon />
            <span>+ Nuevo Paciente</span>
          </Link>
        </header>

        {/* Sección de Filtro y Búsqueda */}
        <div className="filter-card">
          <div className="search-input-wrapper">
            <SearchRoundedIcon className="search-icon" />
            <input
              type="text"
              className="custom-search-input"
              placeholder="Buscar por nombre, apellidos, expediente o DNI..."
              value={busqueda}
              onChange={handleBusqueda}
            />
          </div>
        </div>

        {/* Tabla Principal */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2 className="table-title">Pacientes Registrados</h2>
              <p className="table-subtitle">Resultados en sistema</p>
            </div>
            <span className="count-badge">{listaActual.length} Pacientes</span>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Última Cita</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaActual.length > 0 ? (
                  listaActual
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((paciente, index) => {
                      const nombreCompleto = `${paciente.nombre || "Paciente"} ${paciente.apellidoP || ""}`.trim();

                      return (
                        <tr key={paciente.id || index}>
                          <td className="patient-cell">
                            <div className="patient-info">
                              <Avatar className="patient-avatar">
                                {getInitials(paciente.nombre)}
                              </Avatar>
                              <div className="patient-name-container">
                                <span className="patient-name">{nombreCompleto}</span>
                                <span className="patient-sub">
                                  {paciente.expediente ? `Exp: #${paciente.expediente}` : "Paciente registrado"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="time-cell">
                            <div className="last-appointment">
                              <CalendarTodayRoundedIcon fontSize="small" className="calendar-icon" />
                              <span>{paciente.ultimaCita || "Sin cita previa"}</span>
                            </div>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <Link
                              to="/Medicos/historial"
                              state={{ paciente }}
                              className="btn-expedient-action"
                            >
                              <VisibilityRoundedIcon fontSize="small" />
                              <span>Ver Expediente</span>
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="3" className="empty-state-cell">
                      <div className="empty-state">
                        <FolderSharedRoundedIcon className="empty-icon" />
                        <p>No se encontraron pacientes que coincidan con la búsqueda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <TablePagination
            component="div"
            count={listaActual.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Filas por página:"
          />
        </div>

      </div>
    </Layout_Medicos>
  );
}

export default ListaPaciente;