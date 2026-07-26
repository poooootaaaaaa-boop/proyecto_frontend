import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import dayjs from "dayjs";

import Layout_Medicos from "./Layout_Medicos";
import Mensaje from "./mensaje";

// Material UI Components
import { Autocomplete, TextField, Avatar, Switch, FormControlLabel } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";

// Icons
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MedicalServicesRoundedIcon from "@mui/icons-material/MedicalServicesRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventRepeatRoundedIcon from "@mui/icons-material/EventRepeatRounded";

import "./Consulta.css";

const API_URL = import.meta.env.VITE_API_URL;

function Consulta({ data, setData }) {
  const [pacienteId, setPacienteId] = useState("");
  const [dataPacientes, setDataPacientes] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [sintomas, setSintomas] = useState("");
  const [examen, setExamen] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [notas, setNotas] = useState("");

  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [medicamentos, setMedicamentos] = useState([]);
  const [listaMedicamentos, setListaMedicamentos] = useState([]);
  const [citaSeleccionada, setCitaSeleccionada] = useState("");
  const [citas, setCitas] = useState([]);

  const [requiereSeguimiento, setRequiereSeguimiento] = useState(false);
  const [fechaSeguimiento, setFechaSeguimiento] = useState(null);
  const [medicamentoActivo, setMedicamentoActivo] = useState(null);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  useEffect(() => {
    if (!usuario || !usuario.doctor_id) return;
    const doctor_id = usuario.doctor_id;

    Axios.get(`${API_URL}/citas-doctor/${doctor_id}`)
      .then((res) => {
        const hoy = new Date().toLocaleDateString("sv-SE");
        const pendientesHoy = res.data.filter((c) => {
          const fechaCita = c.fecha_fin.split(" ")[0];
          return c.estado === "pendiente" && fechaCita === hoy;
        });
        setCitas(pendientesHoy);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    Axios.get(`${API_URL}/medicamentos`)
      .then((res) => setListaMedicamentos(res.data || []))
      .catch((err) => console.error(err));

    Axios.get(`${API_URL}/MostrarPaciente`)
      .then((response) => {
        setDataPacientes(response.data.paciente || []);
      })
      .catch((error) => console.error("Error cargando pacientes:", error));
  }, []);

  const agregarMedicamento = () => {
    const nuevos = [
      ...medicamentos,
      {
        medicamento_id: "",
        dosis: "",
        frecuencia: "",
        duracion: "",
        instrucciones: "",
      },
    ];
    setMedicamentos(nuevos);
    setMedicamentoActivo(nuevos.length - 1);
  };

  const eliminarMedicamento = (index) => {
    const nuevos = medicamentos.filter((_, i) => i !== index);
    setMedicamentos(nuevos);
    if (medicamentoActivo === index) setMedicamentoActivo(null);
  };

  const actualizarMedicamento = (index, campo, valor) => {
    const nuevos = [...medicamentos];
    nuevos[index][campo] = valor;
    setMedicamentos(nuevos);
  };

  const finalizarConsulta = async () => {
    if (!citaSeleccionada) {
      alert("Por favor seleccione una cita médica activa.");
      return;
    }

    try {
      await Axios.post(`${API_URL}/finalizar-consulta`, {
        cita_id: citaSeleccionada,
        doctor_id: usuario.doctor_id,
        paciente_id: pacienteId,
        motivo,
        sintomas,
        diagnostico,
        notas,
        examen,
        medicamentos,
      });

      await Axios.put(`${API_URL}/citas/${citaSeleccionada}/estado`, {
        estado: "completada",
      });

      if (requiereSeguimiento && fechaSeguimiento) {
        const ocupado = citas.some(
          (c) =>
            new Date(c.fecha_fin).getTime() === fechaSeguimiento.toDate().getTime()
        );

        if (ocupado) {
          alert("Ese horario ya está ocupado");
          return;
        }

        await Axios.post(`${API_URL}/citas`, {
          doctor_id: usuario.doctor_id,
          paciente_id: pacienteId,
          fecha_inicio: fechaSeguimiento.format("YYYY-MM-DD HH:mm:ss"),
          fecha_fin: fechaSeguimiento.add(30, "minute").format("YYYY-MM-DD HH:mm:ss"),
          estado: "pendiente",
          motivo: "SEGUIMIENTO - " + motivo,
        });
      }

      setMostrarMensaje(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Helper para buscar paciente actual
  const citaActualObj = citas.find((c) => c.id == citaSeleccionada);
  const pacienteActualObj = dataPacientes.find(
    (p) => p.id === citaActualObj?.paciente_id
  );

  return (
    <Layout_Medicos>
      {mostrarMensaje ? (
        <Mensaje
          titulo="¡Consulta Registrada!"
          descripcion="La consulta médica y la receta han sido guardadas con éxito."
          botonPrincipal="Volver a Recetas"
          onPrincipal="/Medicos/recetas_medicas"
        />
      ) : (
        <div className="consulta-page-wrapper">
          {/* Header Superior */}
          <header className="consulta-header-card">
            <div>
              <div className="header-badge">
                <MedicalServicesRoundedIcon fontSize="small" />
                <span>Expediente Clínico</span>
              </div>
              <h1 className="header-title">Registro de Consulta Médica</h1>
              <p className="header-subtitle">
                Complete el diagnóstico, notas médicas y la prescripción de medicamentos.
              </p>
            </div>
            <Link to="/Medicos/recetas_medicas" className="btn-back-link">
              <ArrowBackRoundedIcon />
              <span>Regresar</span>
            </Link>
          </header>

          <div className="consulta-grid-layout">
            {/* COLUMNA IZQUIERDA: Selección + Evaluación Médica */}
            <div className="main-column">
              {/* Card 1: Selección del Paciente / Cita del día */}
              <div className="glass-card">
                <div className="card-section-title">
                  <PersonRoundedIcon className="section-icon" />
                  <div>
                    <h3>Paciente y Cita Programada</h3>
                    <p>Seleccione la cita correspondiente al paciente en sala de espera</p>
                  </div>
                </div>

                <div className="field-group">
                  <label className="custom-input-label">Citas del día de hoy</label>
                  <select
                    className="custom-select"
                    value={citaSeleccionada}
                    onChange={(e) => {
                      const citaIdVal = e.target.value;
                      const cita = citas.find((c) => c.id == citaIdVal);
                      setCitaSeleccionada(citaIdVal);
                      if (cita) setPacienteId(cita.paciente_id);
                    }}
                  >
                    <option value="">-- Seleccionar Cita Pendiente --</option>
                    {citas.map((c) => {
                      const pac = dataPacientes.find((p) => p.id === c.paciente_id);
                      const hora = new Date(c.fecha_fin).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      });
                      return (
                        <option key={c.id} value={c.id}>
                          {hora} - {pac ? `${pac.nombre} ${pac.apellidoP || ""}` : "Paciente desconocido"}
                        </option>
                      );
                    })}
                  </select>
                </div>

                {pacienteActualObj && (
                  <div className="patient-summary-box">
                    <Avatar className="patient-avatar">
                      {pacienteActualObj.nombre.charAt(0)}
                    </Avatar>
                    <div>
                      <h4 className="patient-name">
                        {pacienteActualObj.nombre} {pacienteActualObj.apellidoP}{" "}
                        {pacienteActualObj.apellidoM}
                      </h4>
                      <p className="patient-subtext">ID Paciente: #{pacienteActualObj.id}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Evaluación Clínica */}
              <div className="glass-card">
                <div className="card-section-title">
                  <LocalHospitalRoundedIcon className="section-icon" />
                  <div>
                    <h3>Evaluación y Diagnóstico</h3>
                    <p>Detalle los hallazgos clínicos de la consulta</p>
                  </div>
                </div>

                <div className="form-grid-2col">
                  <div className="field-group">
                    <label className="custom-input-label">Motivo de Consulta</label>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="Ej. Dolor abdominal agudo..."
                      value={motivo}
                      onChange={(e) => setMotivo(e.target.value)}
                    />
                  </div>

                  <div className="field-group">
                    <label className="custom-input-label">Examen Físico / Estudios</label>
                    <input
                      type="text"
                      className="custom-input"
                      placeholder="Ej. Presión 120/80, T. 36.5°C..."
                      value={examen}
                      onChange={(e) => setExamen(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field-group mt-3">
                  <label className="custom-input-label">Síntomas Presentados</label>
                  <textarea
                    rows={2}
                    className="custom-textarea"
                    placeholder="Describa la sintomatología del paciente..."
                    value={sintomas}
                    onChange={(e) => setSintomas(e.target.value)}
                  />
                </div>

                <div className="field-group mt-3">
                  <label className="custom-input-label">Diagnóstico Clínico</label>
                  <textarea
                    rows={2}
                    className="custom-textarea"
                    placeholder="Conclusión o diagnóstico médico..."
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                  />
                </div>

                <div className="field-group mt-3">
                  <label className="custom-input-label">Notas Adicionales / Observaciones</label>
                  <textarea
                    rows={3}
                    className="custom-textarea"
                    placeholder="Recomendaciones generales, dieta, cuidados..."
                    value={notas}
                    onChange={(e) => setNotas(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: Receta + Cita de Seguimiento */}
            <div className="side-column">
              {/* Card 3: Prescripción de Medicamentos */}
              <div className="glass-card">
                <div className="card-section-title">
                  <MedicationRoundedIcon className="section-icon" />
                  <div>
                    <h3>Prescripción / Receta</h3>
                    <p>Agregue medicamentos y su posología</p>
                  </div>
                </div>

                <div className="prescription-list">
                  {medicamentos.length === 0 && (
                    <div className="empty-meds-box">
                      <p>No se han agregado medicamentos a la receta.</p>
                    </div>
                  )}

                  {medicamentos.map((med, index) => {
                    const medSeleccionado = listaMedicamentos.find(
                      (m) => m.id == med.medicamento_id
                    );
                    const isOpen = medicamentoActivo === index;

                    return (
                      <div key={index} className={`med-accordion ${isOpen ? "open" : ""}`}>
                        <div
                          className="med-accordion-header"
                          onClick={() => setMedicamentoActivo(isOpen ? null : index)}
                        >
                          <span className="med-title">
                            {medSeleccionado
                              ? medSeleccionado.nombre
                              : `Medicamento #${index + 1}`}
                          </span>
                          <div className="med-header-actions">
                            <button
                              type="button"
                              className="btn-icon-delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                eliminarMedicamento(index);
                              }}
                            >
                              <DeleteOutlineRoundedIcon fontSize="small" />
                            </button>
                            {isOpen ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />}
                          </div>
                        </div>

                        {isOpen && (
                          <div className="med-accordion-content">
                            <div className="field-group mb-2">
                              <label className="custom-input-label">Medicamento</label>
                              <select
                                className="custom-select"
                                value={med.medicamento_id}
                                onChange={(e) =>
                                  actualizarMedicamento(index, "medicamento_id", e.target.value)
                                }
                              >
                                <option value="">Seleccionar Fármaco</option>
                                {listaMedicamentos.map((m) => (
                                  <option key={m.id} value={m.id}>
                                    {m.nombre}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-grid-2col">
                              <input
                                type="text"
                                className="custom-input"
                                placeholder="Dosis (Ej. 500mg)"
                                value={med.dosis}
                                onChange={(e) =>
                                  actualizarMedicamento(index, "dosis", e.target.value)
                                }
                              />
                              <input
                                type="text"
                                className="custom-input"
                                placeholder="Frecuencia (c/8hrs)"
                                value={med.frecuencia}
                                onChange={(e) =>
                                  actualizarMedicamento(index, "frecuencia", e.target.value)
                                }
                              />
                            </div>

                            <input
                              type="text"
                              className="custom-input mt-2"
                              placeholder="Duración (Ej. 7 días)"
                              value={med.duracion}
                              onChange={(e) =>
                                actualizarMedicamento(index, "duracion", e.target.value)
                              }
                            />

                            <textarea
                              rows={2}
                              className="custom-textarea mt-2"
                              placeholder="Instrucciones especiales..."
                              value={med.instrucciones}
                              onChange={(e) =>
                                actualizarMedicamento(index, "instrucciones", e.target.value)
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="btn-add-medication"
                  onClick={agregarMedicamento}
                >
                  <AddCircleOutlineRoundedIcon fontSize="small" />
                  <span>Agregar Medicamento</span>
                </button>
              </div>

              {/* Card 4: Cita de Seguimiento */}
              <div className="glass-card">
                <div className="card-section-title">
                  <EventRepeatRoundedIcon className="section-icon" />
                  <div>
                    <h3>Cita de Seguimiento</h3>
                    <p>Programar próxima revisión</p>
                  </div>
                </div>

                <FormControlLabel
                  control={
                    <Switch
                      checked={requiereSeguimiento}
                      onChange={(e) => setRequiereSeguimiento(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <span style={{ fontSize: "13px", fontWeight: 600 }}>
                      ¿Requiere cita de seguimiento?
                    </span>
                  }
                />

                {requiereSeguimiento && (
                  <div className="picker-wrapper mt-3">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <StaticDateTimePicker
                        displayStaticWrapperAs="desktop"
                        value={fechaSeguimiento}
                        onChange={(newValue) => setFechaSeguimiento(newValue)}
                        slotProps={{ actionBar: { actions: [] } }}
                      />
                    </LocalizationProvider>
                  </div>
                )}
              </div>

              {/* Acciones Finales */}
              <div className="action-panel">
                <Link to="/Medicos/recetas_medicas" className="btn-cancel">
                  Cancelar
                </Link>
                <button
                  type="button"
                  className="btn-submit-consult"
                  onClick={finalizarConsulta}
                >
                  <CheckCircleRoundedIcon fontSize="small" />
                  <span>Finalizar Consulta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout_Medicos>
  );
}

export default Consulta;