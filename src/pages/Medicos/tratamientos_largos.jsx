import React, { useState, useEffect } from "react";
import Axios from "axios";
import Layout_Medicos from "./Layout_Medicos";

// Material UI Components & Icons
import {
  Dialog,
  DialogContent,
  IconButton,
  Tooltip,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import EventIcon from "@mui/icons-material/Event";
import WarningIcon from "@mui/icons-material/Warning";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";

import "./TratamientosLargos.css";

const API_URL = import.meta.env.VITE_API_URL;

function TratamientosLargos() {
  const [data, setData] = useState([]);
  const [tratamientoEditando, setTratamientoEditando] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTratamiento, setShowTratamiento] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
    const doctor_id = usuario?.doctor_id || 1;

    Axios.get(`${API_URL}/tratamientos-largos/${doctor_id}`)
      .then((res) => {
        const transformados = res.data.map((c) => ({
          id: c.id,
          nombre: `${c.paciente?.usuario?.nombre ?? ""} ${c.paciente?.apellidoP ?? ""}`.trim() || "Paciente Sin Nombre",
          progreso: c.estado === "completada" ? 100 : 50,
          fechaTratamiento: c.fecha_fin,
          fecha_inicio: c.fecha_inicio,
          estado: c.estado || "activo",
          motivo: c.motivo || "Sin descripción especificada.",
        }));
        setData(transformados);
      })
      .catch((err) => console.error("Error al cargar tratamientos:", err));
  }, []);

  const cambiarProgreso = (id, valor) => {
    const nuevos = data.map((t) =>
      t.id === id ? { ...t, progreso: valor } : t
    );
    setData(nuevos);

    if (tratamientoEditando && tratamientoEditando.id === id) {
      setTratamientoEditando((prev) => ({ ...prev, progreso: valor }));
    }
  };

  const finalizarTratamiento = () => {
    if (!tratamientoEditando) return;
    const nuevos = data.map((t) =>
      t.id === tratamientoEditando.id
        ? { ...t, progreso: 100, estado: "completada" }
        : t
    );
    setData(nuevos);
    setShowModal(false);
    setTratamientoEditando(null);
  };

  const cancelarTratamiento = () => {
    if (!tratamientoEditando) return;
    const nuevos = data.filter((t) => t.id !== tratamientoEditando.id);
    setData(nuevos);
    setShowModal(false);
    setTratamientoEditando(null);
  };

  // Cálculos para Dashboard
  const hoy = new Date().toISOString().slice(0, 10);
  const tratamientosActivos = data.length;
  const proximasCitas = data.filter(
    (t) => t.fecha_inicio && t.fecha_inicio.slice(0, 10) > hoy
  ).length;
  const pendientes = data.filter((t) => t.estado === "pendiente").length;

  return (
    <Layout_Medicos>
      <div className="tratamientos-wrapper">
        {/* ENCABEZADO */}
        <header className="tratamientos-header">
          <div>
            <div className="header-badge">
              <MedicalServicesRoundedIcon fontSize="small" />
              <span>Control Clínico</span>
            </div>
            <h1 className="header-title">Seguimiento de Tratamientos Largos</h1>
            <p className="header-subtitle">
              Monitoreo del progreso en tiempo real, citas agendadas y alertas del paciente.
            </p>
          </div>
        </header>

        {/* TARJETAS METRICAS */}
        <div className="metrics-grid">
          <div className="metric-card blue">
            <div className="metric-info">
              <span className="metric-label">Tratamientos Activos</span>
              <h2 className="metric-value">{tratamientosActivos}</h2>
            </div>
            <div className="metric-icon-box blue">
              <AssignmentIcon />
            </div>
          </div>

          <div className="metric-card amber">
            <div className="metric-info">
              <span className="metric-label">Próximas Citas</span>
              <h2 className="metric-value">{proximasCitas}</h2>
            </div>
            <div className="metric-icon-box amber">
              <EventIcon />
            </div>
          </div>

          <div className="metric-card red">
            <div className="metric-info">
              <span className="metric-label">Casos Pendientes</span>
              <h2 className="metric-value">{pendientes}</h2>
            </div>
            <div className="metric-icon-box red">
              <WarningIcon />
            </div>
          </div>
        </div>

        {/* TABLA CONTENEDOR */}
        <div className="table-card-container">
          <div className="table-card-header">
            <h3>Monitoreo de Tratamientos</h3>
            <p>Seleccione un paciente para ver detalles o ajuste su porcentaje de avance.</p>
          </div>

          <div className="custom-table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Avance / Progreso</th>
                  <th>Próxima Cita</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state-td">
                      No hay tratamientos registrados en este momento.
                    </td>
                  </tr>
                ) : (
                  data.map((p) => (
                    <tr key={p.id}>
                      {/* PACIENTE */}
                      <td>
                        <div
                          className="patient-profile-link"
                          onClick={() => {
                            setPacienteSeleccionado(p);
                            setShowTratamiento(true);
                          }}
                        >
                          <div className="avatar-circle">
                            {p.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="patient-name">{p.nombre}</span>
                        </div>
                      </td>

                      {/* PROGRESO */}
                      <td>
                        <div className="progress-cell">
                          <div className="range-wrapper">
                            <input
                              type="range"
                              min="0"
                              max="100"
                              className="custom-range-slider"
                              value={p.progreso}
                              onChange={(e) =>
                                cambiarProgreso(p.id, Number(e.target.value))
                              }
                            />
                            <div
                              className="range-fill"
                              style={{ width: `${p.progreso}%` }}
                            />
                          </div>
                          <span className="progress-percentage">
                            {p.progreso}% Completado
                          </span>
                        </div>
                      </td>

                      {/* FECHA */}
                      <td>
                        <div className="date-badge">
                          <EventIcon fontSize="inherit" />
                          <span>
                            {p.fechaTratamiento
                              ? new Date(p.fechaTratamiento).toLocaleDateString("es-ES", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Sin Fecha"}
                          </span>
                        </div>
                      </td>

                      {/* ACCIONES */}
                      <td className="text-center">
                        <Tooltip title="Editar Tratamiento" arrow>
                          <IconButton
                            className="btn-action-edit"
                            onClick={() => {
                              setTratamientoEditando(p);
                              setShowModal(true);
                            }}
                          >
                            <EditRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: EDITAR TRATAMIENTO */}
        <Dialog
          open={showModal}
          onClose={() => setShowModal(false)}
          PaperProps={{
            style: {
              borderRadius: "20px",
              padding: "12px",
              maxWidth: "460px",
              width: "100%",
            },
          }}
        >
          <div className="modal-header-custom">
            <div>
              <h3>Ajustar Tratamiento</h3>
              <p>Actualización del progreso del paciente</p>
            </div>
            <IconButton onClick={() => setShowModal(false)} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </div>

          <DialogContent style={{ padding: "16px 0" }}>
            {tratamientoEditando && (
              <div className="modal-edit-body">
                <div className="patient-card-mini">
                  <PersonRoundedIcon className="icon" />
                  <div>
                    <span className="label">Paciente Seleccionado</span>
                    <strong>{tratamientoEditando.nombre}</strong>
                  </div>
                </div>

                <div className="slider-box">
                  <div className="slider-label-row">
                    <span>Avance Clínico</span>
                    <strong className="percentage">{tratamientoEditando.progreso}%</strong>
                  </div>

                  <div className="range-wrapper big">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="custom-range-slider"
                      value={tratamientoEditando.progreso}
                      onChange={(e) =>
                        cambiarProgreso(tratamientoEditando.id, Number(e.target.value))
                      }
                    />
                    <div
                      className="range-fill"
                      style={{ width: `${tratamientoEditando.progreso}%` }}
                    />
                  </div>
                </div>

                <div className="modal-actions-grid">
                  <button
                    type="button"
                    className="btn-modal-action success"
                    onClick={finalizarTratamiento}
                  >
                    <CheckCircleRoundedIcon fontSize="small" />
                    <span>Finalizar Tratamiento</span>
                  </button>

                  <button
                    type="button"
                    className="btn-modal-action danger"
                    onClick={cancelarTratamiento}
                  >
                    <CancelRoundedIcon fontSize="small" />
                    <span>Dar de Baja</span>
                  </button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* MODAL 2: VER MOTIVO TRATAMIENTO */}
        <Dialog
          open={showTratamiento}
          onClose={() => setShowTratamiento(false)}
          PaperProps={{
            style: {
              borderRadius: "20px",
              padding: "12px",
              maxWidth: "450px",
              width: "100%",
            },
          }}
        >
          <div className="modal-header-custom">
            <div>
              <h3>Ficha de Tratamiento</h3>
              <p>Detalle del expediente clínico</p>
            </div>
            <IconButton onClick={() => setShowTratamiento(false)} size="small">
              <CloseRoundedIcon />
            </IconButton>
          </div>

          <DialogContent style={{ padding: "16px 0" }}>
            {pacienteSeleccionado && (
              <div className="modal-info-body">
                <div className="patient-card-mini">
                  <PersonRoundedIcon className="icon" />
                  <div>
                    <span className="label">Paciente</span>
                    <strong>{pacienteSeleccionado.nombre}</strong>
                  </div>
                </div>

                <div className="info-block">
                  <span className="info-title">Motivo o Diagnóstico del Tratamiento</span>
                  <div className="info-box-text">
                    {pacienteSeleccionado.motivo}
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-modal-close"
                  onClick={() => setShowTratamiento(false)}
                >
                  Entendido / Cerrar
                </button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout_Medicos>
  );
}

export default TratamientosLargos;