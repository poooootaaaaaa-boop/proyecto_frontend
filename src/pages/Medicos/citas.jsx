import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import dayjs from "dayjs";

import Layout_Medicos from "./Layout_Medicos";
import Mensaje from "./mensaje";

// Material UI Components
import { Autocomplete, TextField, Avatar } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";

// Icons
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import EventNoteRoundedIcon from "@mui/icons-material/EventNoteRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";

import "./CrearCita.css";

const API_URL = import.meta.env.VITE_API_URL;

function Citas({ data, setData }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const doctor_id = usuario?.doctor_id;

  const [pacientes, setPacientes] = useState([]);
  const [pacienteSeleccionadoObj, setPacienteSeleccionadoObj] = useState(null);

  const [tipoCita, setTipoCita] = useState("rutina");
  const [motivoCita, setMotivoCita] = useState("");
  const [fechaCita, setFechaCita] = useState(dayjs());
  const [citasDoctor, setCitasDoctor] = useState([]);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    if (!doctor_id) return;

    axios
      .get(`${API_URL}/pacientes-doctor/${doctor_id}`)
      .then((res) => setPacientes(res.data || []))
      .catch((err) => console.error(err));

    axios
      .get(`${API_URL}/citas-doctor/${doctor_id}`)
      .then((res) => setCitasDoctor(res.data || []))
      .catch((err) => console.error(err));
  }, [doctor_id]);

  const esHoraOcupada = (fecha) => {
    return citasDoctor.some(
      (c) =>
        dayjs(c.fecha_fin).format("YYYY-MM-DD HH:mm") ===
        dayjs(fecha).format("YYYY-MM-DD HH:mm")
    );
  };

  const FinalizarCita = async () => {
    if (!doctor_id) {
      alert("No se identificó la sesión del médico");
      return;
    }

    if (!pacienteSeleccionadoObj) {
      alert("Por favor seleccione un paciente.");
      return;
    }

    if (!fechaCita) {
      alert("Por favor seleccione una fecha y hora para la cita.");
      return;
    }

    const nuevaCita = {
      doctor_id,
      paciente_id: pacienteSeleccionadoObj.id,
      fecha_inicio: fechaCita.format("YYYY-MM-DD HH:mm:ss"),
      fecha_fin: fechaCita.add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
      motivo: `${tipoCita.toUpperCase()} - ${motivoCita}`,
    };

    try {
      const res = await axios.post(`${API_URL}/citas`, nuevaCita, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (res.status === 200 || res.status === 201) {
        setMostrarMensaje(true);
      }
    } catch (error) {
      console.error("Error al crear cita:", error);
    }
  };

  const getInitials = (name = "") => name.charAt(0).toUpperCase();

  return (
    <Layout_Medicos>
      {mostrarMensaje ? (
        <Mensaje
          titulo="¡Cita Agendada con Éxito!"
          descripcion="La cita médica ha sido registrada en el sistema."
          botonPrincipal="Volver a la Agenda"
          onPrincipal="/Medicos/agendar-cita"
        />
      ) : (
        <div className="create-appointment-wrapper">
          {/* Header Superior */}
          <header className="appointment-header-card">
            <div>
              <div className="header-badge">
                <CalendarMonthRoundedIcon fontSize="small" />
                <span>Gestión de Citas</span>
              </div>
              <h1 className="header-title">Agendar Nueva Cita Médica</h1>
              <p className="header-subtitle">
                Complete los detalles del paciente, tipo de consulta y horario.
              </p>
            </div>
            <Link to="/Medicos/agendar-cita" className="btn-back-link">
              <ArrowBackRoundedIcon />
              <span>Regresar</span>
            </Link>
          </header>

          {/* Formulario en Grid de 2 Columnas */}
          <div className="appointment-grid-layout">
            {/* Columna Izquierda: Datos del Formulario */}
            <div className="form-column">
              {/* Sección 1: Selección del Paciente con Buscador Autocomplete */}
              <div className="glass-card">
                <div className="card-section-title">
                  <PersonSearchRoundedIcon className="section-icon" />
                  <div>
                    <h3>Buscar y Seleccionar Paciente</h3>
                    <p>Escriba el nombre o apellidos para filtrar los expedientes</p>
                  </div>
                </div>

                <div className="field-group">
                  <Autocomplete
                    options={pacientes}
                    getOptionLabel={(option) =>
                      `${option.usuario?.nombre || ""} ${option.apellidoP || ""} ${option.apellidoM || ""}`.trim()
                    }
                    value={pacienteSeleccionadoObj}
                    onChange={(e, newValue) => setPacienteSeleccionadoObj(newValue)}
                    renderOption={(props, option) => (
                      <li {...props} key={option.id} className="patient-option-item">
                        <Avatar className="patient-option-avatar">
                          {getInitials(option.usuario?.nombre)}
                        </Avatar>
                        <div className="patient-option-info">
                          <span className="patient-option-name">
                            {option.usuario?.nombre} {option.apellidoP} {option.apellidoM}
                          </span>
                          <span className="patient-option-id">ID Paciente: #{option.id}</span>
                        </div>
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nombre del Paciente"
                        placeholder="Comience a escribir..."
                        variant="outlined"
                        className="custom-material-input"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Sección 2: Configuración del Tipo de Cita y Motivo */}
              <div className="glass-card">
                <div className="card-section-title">
                  <EventNoteRoundedIcon className="section-icon" />
                  <div>
                    <h3>Detalles de la Consulta</h3>
                    <p>Especifique la prioridad y el motivo de la atención</p>
                  </div>
                </div>

                {/* Chips / Cards de Selección Tipo de Cita */}
                <label className="custom-input-label">Tipo de Cita / Prioridad</label>
                <div className="type-selector-cards">
                  <button
                    type="button"
                    className={`type-card rutina ${tipoCita === "rutina" ? "selected" : ""}`}
                    onClick={() => setTipoCita("rutina")}
                  >
                    <span className="type-dot"></span>
                    <span className="type-title">Rutina</span>
                  </button>

                  <button
                    type="button"
                    className={`type-card seguimiento ${tipoCita === "seguimiento" ? "selected" : ""}`}
                    onClick={() => setTipoCita("seguimiento")}
                  >
                    <span className="type-dot"></span>
                    <span className="type-title">Seguimiento</span>
                  </button>

                  <button
                    type="button"
                    className={`type-card urgente ${tipoCita === "urgente" ? "selected" : ""}`}
                    onClick={() => setTipoCita("urgente")}
                  >
                    <span className="type-dot"></span>
                    <span className="type-title">Urgente</span>
                  </button>
                </div>

                <div className="field-group" style={{ marginTop: "20px" }}>
                  <label className="custom-input-label">Motivo de la Cita</label>
                  <textarea
                    rows={3}
                    className="custom-textarea"
                    placeholder="Describa el motivo principal de la consulta..."
                    value={motivoCita}
                    onChange={(e) => setMotivoCita(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Columna Derecha: Picker de Fecha y Resumen */}
            <div className="summary-column">
              {/* Selector de Horario */}
              <div className="glass-card calendar-card-container">
                <div className="card-section-title">
                  <CalendarMonthRoundedIcon className="section-icon" />
                  <div>
                    <h3>Fecha y Hora</h3>
                    <p>Seleccione un bloque de horario libre</p>
                  </div>
                </div>

                <div className="picker-wrapper">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDateTimePicker
                      displayStaticWrapperAs="desktop"
                      value={fechaCita}
                      onChange={(newValue) => {
                        if (!newValue) return;
                        if (esHoraOcupada(newValue)) {
                          alert("Esta fecha/hora ya tiene una cita agendada. Elija otra.");
                          return;
                        }
                        setFechaCita(newValue);
                      }}
                      slotProps={{ actionBar: { actions: [] } }}
                    />
                  </LocalizationProvider>
                </div>
              </div>

              {/* Card Resumen de confirmación */}
              <div className="glass-card summary-card">
                <h4 className="summary-title">
                  <LocalHospitalRoundedIcon fontSize="small" /> Resumen de Agendado
                </h4>

                <div className="summary-list">
                  <div className="summary-item">
                    <span>Paciente:</span>
                    <strong>
                      {pacienteSeleccionadoObj
                        ? `${pacienteSeleccionadoObj.usuario?.nombre} ${pacienteSeleccionadoObj.apellidoP}`
                        : "No seleccionado"}
                    </strong>
                  </div>

                  <div className="summary-item">
                    <span>Tipo:</span>
                    <span className={`badge-type ${tipoCita}`}>
                      {tipoCita.toUpperCase()}
                    </span>
                  </div>

                  <div className="summary-item">
                    <span>Fecha & Hora:</span>
                    <strong>
                      {fechaCita ? fechaCita.format("DD/MM/YYYY - hh:mm A") : "Sin definir"}
                    </strong>
                  </div>
                </div>

                <div className="action-buttons-wrapper">
                  <button
                    type="button"
                    className="btn-submit-appointment"
                    onClick={FinalizarCita}
                  >
                    <CheckCircleRoundedIcon />
                    <span>Confirmar y Agendar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout_Medicos>
  );
}

export default Citas;