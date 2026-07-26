import React, { useEffect, useState, useCallback } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import axios from "axios";
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  LinearProgress, Avatar, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Paper, TableContainer,
  CircularProgress
} from "@mui/material";
// Iconos
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MedicationIcon from "@mui/icons-material/Medication";
import ScienceIcon from "@mui/icons-material/Science";
import HistoryIcon from "@mui/icons-material/History";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import PdfModals from "./PdfModals";

import "./HistorialMedico.css";

const API_URL = import.meta.env.VITE_API_URL;

// El pacienteId debería venir de tu contexto de autenticación
// (por ejemplo useAuth().paciente.id) o de un parámetro de ruta.
// Aquí se recibe como prop para mantener el componente reutilizable.
export default function HistorialMedico() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const pacienteId = usuario?.paciente_id;
  const [openFullModal, setOpenFullModal] = useState(false);
  const [openConsultaModal, setOpenConsultaModal] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);

  // ===== ESTADO DE DATOS REALES =====
  const [paciente, setPaciente] = useState(null);
  const [consultas, setConsultas] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [labFiles, setLabFiles] = useState([]);
  const [consultaSeleccionada, setConsultaSeleccionada] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  // ===== CARGA INICIAL DE DATOS =====
  const cargarDatos = useCallback(async () => {
    if (!pacienteId) {
      setLoading(false);
      setError("No se recibió el ID del paciente. Revisa cómo se está renderizando este componente.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [perfilRes, consultasRes, recetasRes, archivosRes] = await Promise.all([
        axios.get(`${API_URL}/perfil/${pacienteId}`),
        axios.get(`${API_URL}/consultas/${pacienteId}`),
        axios.get(`${API_URL}/recetas/paciente/${pacienteId}`),
        axios.get(`${API_URL}/expediente-archivos/paciente/${pacienteId}`),
      ]);

      setPaciente(perfilRes.data);
      setConsultas(consultasRes.data || []);
      setRecetas(recetasRes.data || []);
      setLabFiles(archivosRes.data || []);
    } catch (err) {
      console.error(err);
      setError("No se pudo cargar el historial médico. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // ===== DESCARGA PDF: HISTORIAL COMPLETO =====
  const handleDownloadFullPDF = () => {
    const doc = new jsPDF();

    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("HISTORIAL MÉDICO", 20, 18);
    doc.setFontSize(10);
    doc.text("Hospital San Gabriel", 150, 18);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(14);
    doc.text("Información del Paciente", 20, 45);
    doc.setFontSize(11);
    doc.text(`Nombre: ${paciente?.nombre || "N/D"}`, 20, 55);
    doc.text(`Correo: ${paciente?.correo || "N/D"}`, 20, 62);
    doc.text(`Tipo de sangre: ${paciente?.tipoSangre || "N/D"}`, 20, 69);

    doc.setFontSize(14);
    doc.text("Tratamientos Activos", 20, 85);
    autoTable(doc, {
      startY: 90,
      head: [["Medicamento", "Dosis", "Frecuencia", "Médico"]],
      body: recetas.map((r) => [
        r.nombre || "-",
        r.dosis || "-",
        r.frecuencia || "-",
        r.medico || "-",
      ]),
      theme: "striped",
      headStyles: { fillColor: [25, 118, 210] },
    });

    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.text("Historial de Consultas", 20, finalY);
    autoTable(doc, {
      startY: finalY + 5,
      head: [["Fecha", "Motivo", "Especialista", "ID"]],
      body: consultas.map((c) => [
        c.fecha_inicio || "-",
        c.motivo || "-",
        c.doctor || "-",
        `#C-${String(c.id).padStart(5, "0")}`,
      ]),
      theme: "grid",
      headStyles: { fillColor: [56, 142, 60] },
    });

    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(
      "Documento generado automáticamente - Sistema Médico",
      20,
      pageHeight - 10
    );

    doc.save("historial_medico_profesional.pdf");
    setOpenFullModal(false);
    setOpenAlert(true);
  };

  // ===== DESCARGA PDF: UNA CONSULTA =====
  const handleDownloadConsultaPDF = () => {
    if (!consultaSeleccionada) return;
    const doc = new jsPDF();

    doc.setFillColor(25, 118, 210);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("REPORTE DE CONSULTA", 20, 18);
    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.text(`Paciente: ${paciente?.nombre || "N/D"}`, 20, 50);
    doc.text(`Fecha: ${consultaSeleccionada.fecha_inicio || "N/D"}`, 20, 60);
    doc.text(`Motivo: ${consultaSeleccionada.motivo || "N/D"}`, 20, 70);
    doc.text(`Doctor: ${consultaSeleccionada.doctor || "N/D"}`, 20, 80);

    doc.setFontSize(11);
    doc.text(
      `Diagnóstico: ${consultaSeleccionada.diagnostico || "Sin diagnóstico registrado"}`,
      20,
      100,
      { maxWidth: 170 }
    );

    doc.save("consulta_medica_profesional.pdf");
    setOpenConsultaModal(false);
    setOpenAlert(true);
  };

  const abrirModalConsulta = (consulta) => {
    setConsultaSeleccionada(consulta);
    setOpenConsultaModal(true);
  };

  // ===== SUBIDA DE ARCHIVOS (real, contra ExpedienteArchivoController) =====
  const fileInputRef = React.useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setPendingFiles(files);
    setOpenUploadModal(true);
    e.target.value = "";
  };

  const confirmUploadFiles = async () => {
    if (!pendingFiles.length || !pacienteId) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("paciente_id", pacienteId);
      pendingFiles.forEach((file) => {
        formData.append("archivos[]", file);
      });

      const { data } = await axios.post(
        `${API_URL}/expediente-archivos`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setLabFiles((prev) => [...data.archivos, ...prev]);
      setPendingFiles([]);
      setOpenUploadModal(false);
      setOpenAlert(true);
    } catch (err) {
      console.error(err);
      setError("No se pudo subir el archivo. Intenta de nuevo.");
      setOpenUploadModal(false);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${API_URL}/expediente-archivos/${fileId}`);
      setLabFiles((prev) => prev.filter((f) => f.id !== fileId));
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el archivo.");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="historial-wrapper">
        <Typography color="error">{error}</Typography>
        <Button onClick={cargarDatos} variant="outlined" sx={{ mt: 2 }}>
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box className="historial-wrapper">
      <PdfModals
        openFullModal={openFullModal}
        setOpenFullModal={setOpenFullModal}
        openConsultaModal={openConsultaModal}
        setOpenConsultaModal={setOpenConsultaModal}
        openAlert={openAlert}
        setOpenAlert={setOpenAlert}
        handleDownloadFullPDF={handleDownloadFullPDF}
        handleDownloadConsultaPDF={handleDownloadConsultaPDF}
        openUploadModal={openUploadModal}
        setOpenUploadModal={setOpenUploadModal}
        confirmUploadFiles={confirmUploadFiles}
        uploading={uploading}
      />

      {/* HEADER */}
      <Box className="historial-header-flex">
        <Typography variant="h4" className="main-title">
          Mi Historial Médico
        </Typography>
        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            className="btn-secondary"
            startIcon={<HistoryIcon />}
            onClick={handleUploadClick}
          >
            Archivo
          </Button>

          <input
            type="file"
            multiple
            accept=".pdf,image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            className="btn-primary"
            onClick={() => setOpenFullModal(true)}
            startIcon={<Box component="span" sx={{ fontSize: 20 }}>+</Box>}
          >
            Descargar el historial
          </Button>
        </Box>
      </Box>

      {/* SECCIÓN TRATAMIENTOS */}
      <Box className="section-container">
        <Box className="section-header">
          <MedicationIcon />
          <Typography variant="h6">Tratamientos Activos</Typography>
        </Box>

        {recetas.length === 0 ? (
          <Typography color="text.secondary" sx={{ p: 2 }}>
            No hay tratamientos registrados.
          </Typography>
        ) : (
          <Grid container spacing={20}>
            {recetas.map((r) => (
              <Grid item xs={12} md={12} key={r.id}>
                <Card className="custom-card card-tratamiento">
                  <CardContent sx={{ p: '40px !important' }}>
                    <Box className="treatment-top">
                      <Box display="flex" gap={2}>
                        <Box className="icon-badge blue">
                          <MedicationIcon />
                        </Box>
                        <Box>
                          <Typography className="item-name">{r.nombre}</Typography>
                          <Typography className="item-subtitle">
                            {r.concentracion}{r.unidad} • {r.presentacion}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={(r.estado || "").toUpperCase()}
                        className={`status-chip ${r.estado === "entregada" ? "green" : "blue-outline"}`}
                      />
                    </Box>

                    <Grid container spacing={2} sx={{ my: 2 }}>
                      <Grid item xs={6}>
                        <Box className="info-box">
                          <Typography className="info-label">Frecuencia</Typography>
                          <Box className="info-value"><ScheduleIcon fontSize="small" /> {r.frecuencia || "N/D"}</Box>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className="info-box">
                          <Typography className="info-label">Médico</Typography>
                          <Box className="info-value"><PersonIcon fontSize="small" /> {r.medico || "N/D"}</Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* HISTORIAL CONSULTAS */}
      <Box className="section-container">
        <Paper className="custom-card table-paper">
          <Box className="section-header" sx={{ p: 3, pb: 0 }}>
            <HistoryIcon />
            <Typography variant="h6">Historial de Consultas</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="table-head-cell">Fecha</TableCell>
                  <TableCell className="table-head-cell">Consulta / Motivo</TableCell>
                  <TableCell className="table-head-cell">Especialista</TableCell>
                  <TableCell align="right" className="table-head-cell">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography color="text.secondary">
                        No hay consultas registradas.
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  consultas.map((c) => (
                    <TableRow className="table-row-hover" key={c.id}>
                      <TableCell>
                        <Typography className="bold-text">{c.fecha_inicio}</Typography>
                        <Typography className="id-text">
                          ID: #C-{String(c.id).padStart(5, "0")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="bold-text">{c.motivo || "Sin motivo"}</Typography>
                        <Typography className="sub-text">{c.especialidad || ""}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar sx={{ width: 32, height: 32 }} src={c.doctor_foto || undefined} />
                          <Typography className="medium-text">{c.doctor || "N/D"}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="contained"
                          className="btn-download"
                          startIcon={<DownloadIcon />}
                          onClick={() => abrirModalConsulta(c)}
                        >
                          PDF
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>

      {/* RESULTADOS Y DIAGNÓSTICOS */}
      <Grid container spacing={15} sx={{ mt: 2 }}>
        {/* Resultados de Laboratorio */}
        <Grid item xs={12} lg={10}>
          <Card className="custom-card lab-results-container">
            <CardContent sx={{ p: '40px !important' }}>
              <Box className="section-header">
                <ScienceIcon />
                <Typography variant="h6">Resultados de Laboratorio</Typography>
              </Box>

              <Box
                className="lab-list"
                sx={{
                  maxHeight: 240,
                  overflowY: "auto",
                  overflowX: "hidden",
                  pr: 1,
                  "&::-webkit-scrollbar": { width: 6 },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#c1c1c1",
                    borderRadius: 3,
                  },
                }}
              >
                {labFiles.length === 0 ? (
                  <Typography color="text.secondary" sx={{ p: 2 }}>
                    No hay archivos en el expediente.
                  </Typography>
                ) : (
                  labFiles.map((file) => (
                    <Box
                      key={file.id}
                      className="lab-item-row"
                      sx={{ minHeight: 72, flexShrink: 0 }}
                    >
                      <Box display="flex" alignItems="center" gap={2} sx={{ minWidth: 0 }}>
                        <Box className={`file-icon-box ${file.tipo === "pdf" ? "pdf" : "image"}`}>
                          {file.tipo === "pdf" ? <PictureAsPdfIcon /> : <ImageIcon />}
                        </Box>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            className="lab-item-title"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {file.nombre_archivo}
                          </Typography>
                          <Typography
                            className="lab-item-date"
                            sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {file.creado_en} • Archivo subido
                          </Typography>
                        </Box>
                      </Box>

                      <Box display="flex" gap={0.5} sx={{ flexShrink: 0 }}>
                        <IconButton
                          className="action-btn-blue"
                          onClick={() => window.open(file.url_archivo, "_blank")}
                        >
                          {file.tipo === "pdf" ? <DownloadIcon /> : <VisibilityIcon />}
                        </IconButton>
                        <IconButton onClick={() => handleDeleteFile(file.id)}>
                          ✕
                        </IconButton>
                      </Box>
                    </Box>
                  ))
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Diagnósticos */}
        <Grid item xs={12} lg={4}>
          <Card className="custom-card">
            <CardContent sx={{ p: '40px !important' }}>
              <Box className="section-header">
                <HistoryIcon />
                <Typography variant="h6">Diagnósticos</Typography>
              </Box>

              <Box className="diagnosis-list">
                {consultas
                  .filter((c) => c.diagnostico)
                  .slice(0, 5)
                  .map((c) => (
                    <Box className="diagnosis-item" key={c.id}>
                      <Box>
                        <Typography className="diag-title">{c.diagnostico}</Typography>
                        <Typography className="diag-date">{c.fecha_inicio}</Typography>
                      </Box>
                    </Box>
                  ))}
                {consultas.filter((c) => c.diagnostico).length === 0 && (
                  <Typography color="text.secondary">Sin diagnósticos registrados.</Typography>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
