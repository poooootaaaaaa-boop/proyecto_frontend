import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import Layout_Medicos from "./Layout_Medicos";

// Material UI Components
import { Avatar, TablePagination } from "@mui/material";

// Iconos
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import "./Recetas_medicas.css";

const API_URL = import.meta.env.VITE_API_URL;

function RecetasMedicas() {
  const [busqueda, setBusqueda] = useState("");
  const [pacientesFiltrados, setPacientesFiltrados] = useState([]);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [consultas, setConsultas] = useState([]);

  // Paginación
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    Axios.get(`${API_URL}/MostrarConsulta`)
      .then((res) => {
        setConsultas(res.data || []);
      })
      .catch((error) => {
        console.error("Error cargando consultas:", error);
      });
  }, []);

  // Agrupar consultas con receta por paciente
  const pacientesConRecetas = consultas
    .filter((c) => c.receta && c.receta.detalles && c.receta.detalles.length > 0)
    .reduce((acc, consulta) => {
      const id = consulta.paciente?.id;
      if (!id) return acc;

      if (!acc[id]) {
        acc[id] = {
          paciente: consulta.paciente,
          consultas: [],
        };
      }
      acc[id].consultas.push(consulta);
      return acc;
    }, {});

  const listaPacientes = Object.values(pacientesConRecetas).map((p) => ({
    ...p,
    consultas: p.consultas.sort((a, b) => b.id - a.id),
  }));

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    setPage(0);

    const resultado = listaPacientes.filter((p) => {
      const nombreCompleto = `${p.paciente?.usuario?.nombre || ""} ${p.paciente?.apellidoP || ""}`.toLowerCase();
      return nombreCompleto.includes(valor.toLowerCase());
    });

    setPacientesFiltrados(resultado);
  };

  const listaActual = busqueda ? pacientesFiltrados : listaPacientes;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getInitials = (name = "") => name.charAt(0).toUpperCase();

  // Generador de PDF
  const handleDownloadFullPDF = (consulta) => {
    const doc = new jsPDF();

    /* ================= HEADER ================= */
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 30, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("RECETA MÉDICA", 20, 18);

    doc.setFontSize(10);
    doc.text("Sistema Profesional Médico", 20, 25);

    doc.setTextColor(0, 0, 0);

    /* ================= DOCTOR ================= */
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Doctor: ${consulta.doctor?.usuario?.nombre ?? "N/A"}`, 20, 40);

    doc.setFont("helvetica", "normal");
    doc.text(`Cédula: ${consulta.doctor?.cedula_profesional ?? "N/A"}`, 140, 40);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 45, 190, 45);

    /* ================= PACIENTE ================= */
    doc.setFont("helvetica", "bold");
    doc.text(
      `Paciente: ${consulta.paciente?.usuario?.nombre ?? ""} ${consulta.paciente?.apellidoP ?? ""}`,
      20,
      52
    );

    doc.setFont("helvetica", "normal");
    doc.text(`ID Consulta: #${consulta.id}`, 20, 60);
    doc.text(`Teléfono: ${consulta.paciente?.usuario?.telefono ?? "N/A"}`, 20, 68);
    doc.text(`Correo: ${consulta.paciente?.usuario?.correo ?? "N/A"}`, 20, 76);

    /* ================= CONSULTA ================= */
    doc.setFontSize(13);
    doc.text("Detalle de Consulta", 20, 90);

    autoTable(doc, {
      startY: 95,
      head: [["Motivo", "Síntomas", "Diagnóstico"]],
      body: [
        [
          consulta.motivo ?? "N/A",
          consulta.sintomas ?? "N/A",
          consulta.diagnostico ?? "N/A",
        ],
      ],
      headStyles: { fillColor: [37, 99, 235] },
    });

    /* ================= NOTAS ================= */
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Notas Clínicas"]],
      body: [[consulta.notas_clinicas ?? "N/A"]],
      headStyles: { fillColor: [71, 85, 105] },
    });

    /* ================= RECETA (MEDICAMENTOS) ================= */
    if (consulta.receta && consulta.receta.detalles.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Medicamento", "Dosis", "Frecuencia", "Duración", "Instrucciones"]],
        body: consulta.receta.detalles.map((d) => [
          d.medicamento?.nombre ?? "N/A",
          d.dosis ?? "N/A",
          d.frecuencia ?? "N/A",
          d.duracion ?? "N/A",
          d.instrucciones ?? "N/A",
        ]),
        headStyles: { fillColor: [37, 99, 235] },
      });
    }

    /* ================= FIRMA ================= */
    const finalY = doc.lastAutoTable.finalY + 22;
    doc.line(130, finalY, 190, finalY);

    doc.setFontSize(10);
    doc.text(`${consulta.doctor?.usuario?.nombre ?? "Doctor"}`, 135, finalY + 5);
    doc.text("Firma del Médico", 140, finalY + 10);

    /* ================= FOOTER ================= */
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(226, 232, 240);
    doc.line(20, pageHeight - 18, 190, pageHeight - 18);
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Documento generado automáticamente • Sistema Médico", 20, pageHeight - 10);

    /* ================= DESCARGA ================= */
    doc.save(`Receta_${consulta.paciente?.usuario?.nombre}_${consulta.id}.pdf`);
  };

  return (
    <Layout_Medicos>
      <div className="dashboard-wrapper-main">
        {/* Modal de Historial de Recetas por Paciente */}
        {openModal && pacienteSeleccionado && (
          <div className="modal-backdrop-custom">
            <div className="modal-container-custom">
              <div className="modal-header-custom">
                <div className="modal-title-wrapper">
                  <Avatar className="patient-avatar">
                    {getInitials(pacienteSeleccionado.paciente?.usuario?.nombre)}
                  </Avatar>
                  <div>
                    <h3 className="modal-patient-name">
                      {pacienteSeleccionado.paciente.usuario?.nombre}{" "}
                      {pacienteSeleccionado.paciente?.apellidoP}
                    </h3>
                    <span className="modal-patient-sub">
                      Historial de Recetas ({pacienteSeleccionado.consultas.length})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setOpenModal(false)}
                >
                  <CloseRoundedIcon />
                </button>
              </div>

              <div className="modal-body-custom">
                {pacienteSeleccionado.consultas.map((consulta, i) => (
                  <div key={i} className="consultation-modal-card">
                    <div className="consultation-card-header">
                      <span className="consultation-id">Consulta #{consulta.id}</span>
                      <button
                        type="button"
                        className="btn-download-pdf"
                        onClick={() => handleDownloadFullPDF(consulta)}
                      >
                        <DownloadRoundedIcon fontSize="small" />
                        <span>Descargar PDF</span>
                      </button>
                    </div>

                    <div className="consultation-card-body">
                      <p><strong>Motivo:</strong> {consulta.motivo || "N/A"}</p>
                      <p><strong>Diagnóstico:</strong> {consulta.diagnostico || "N/A"}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cabecera de la Vista */}
        <header className="dashboard-header">
          <div className="header-info">
            <div className="doctor-badge">
              <MedicationRoundedIcon fontSize="small" />
              <span>Módulo Farmacéutico</span>
            </div>
            <h1 className="welcome-title">Gestión de Recetas Médicas</h1>
            <p className="welcome-subtitle">
              Consulte, gestione y descargue las recetas emitidas a sus pacientes.
            </p>
          </div>
          <Link to="/Medicos/consulta" className="btn-primary-action">
            <AddRoundedIcon />
            <span>+ Nueva Consulta</span>
          </Link>
        </header>

        {/* Barra de Búsqueda */}
        <div className="filter-card">
          <div className="search-input-wrapper">
            <SearchRoundedIcon className="search-icon" />
            <input
              type="text"
              className="custom-search-input"
              placeholder="Buscar receta por nombre o apellido del paciente..."
              value={busqueda}
              onChange={handleBusqueda}
            />
          </div>
        </div>

        {/* Tabla Principal */}
        <div className="table-card">
          <div className="table-header">
            <div>
              <h2 className="table-title">Pacientes con Prescripción</h2>
              <p className="table-subtitle">Expedientes con recetas generadas</p>
            </div>
            <span className="count-badge">{listaActual.length} Pacientes</span>
          </div>

          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Último Motivo</th>
                  <th>Total Consultas</th>
                  <th style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {listaActual.length > 0 ? (
                  listaActual
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((p, index) => {
                      const nombreCompleto = `${p.paciente?.usuario?.nombre || "Paciente"} ${
                        p.paciente?.apellidoP || ""
                      }`.trim();
                      const ultimaConsulta = p.consultas[0];

                      return (
                        <tr key={p.paciente?.id || index}>
                          <td
                            className="patient-cell clickable-cell"
                            onClick={() => {
                              setPacienteSeleccionado(p);
                              setOpenModal(true);
                            }}
                          >
                            <div className="patient-info">
                              <Avatar className="patient-avatar">
                                {getInitials(p.paciente?.usuario?.nombre)}
                              </Avatar>
                              <div className="patient-name-container">
                                <span className="patient-name">{nombreCompleto}</span>
                                <span className="patient-sub">
                                  ID Paciente: #{p.paciente?.id}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="reason-cell">
                            <span className="reason-text">
                              {ultimaConsulta?.motivo || "Consulta General"}
                            </span>
                          </td>

                          <td>
                            <span className="consultation-count-badge">
                              {p.consultas.length} {p.consultas.length === 1 ? "receta" : "recetas"}
                            </span>
                          </td>

                          <td style={{ textAlign: "right" }}>
                            <div className="action-buttons-group">
                              <button
                                type="button"
                                className="btn-secondary-action"
                                title="Ver Historial"
                                onClick={() => {
                                  setPacienteSeleccionado(p);
                                  setOpenModal(true);
                                }}
                              >
                                <VisibilityRoundedIcon fontSize="small" />
                                <span>Historial</span>
                              </button>

                              <button
                                type="button"
                                className="btn-primary-pdf-action"
                                title="Descargar Último PDF"
                                onClick={() => handleDownloadFullPDF(ultimaConsulta)}
                              >
                                <DownloadRoundedIcon fontSize="small" />
                                <span>PDF</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-state-cell">
                      <div className="empty-state">
                        <DescriptionRoundedIcon className="empty-icon" />
                        <p>No se encontraron recetas médicas registradas.</p>
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

export default RecetasMedicas;