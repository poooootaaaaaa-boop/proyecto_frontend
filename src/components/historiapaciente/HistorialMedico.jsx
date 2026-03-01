import React from 'react';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  LinearProgress, Avatar, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Paper, TableContainer
} from "@mui/material";
import { useState } from "react";
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

export default function HistorialMedico() {
  const [openFullModal, setOpenFullModal] = useState(false);
const [openConsultaModal, setOpenConsultaModal] = useState(false);
const [openAlert, setOpenAlert] = useState(false);
const [openUploadModal, setOpenUploadModal] = useState(false);
const [pendingFiles, setPendingFiles] = useState([]);

const handleDownloadFullPDF = () => {
  const doc = new jsPDF();

  // ===== HEADER =====
  doc.setFillColor(25, 118, 210); // azul médico
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("HISTORIAL MÉDICO", 20, 18);

  // Logo fake (texto por ahora)
  doc.setFontSize(10);
  doc.text("Hospital San Gabriel", 150, 18);

  // Reset color
  doc.setTextColor(0, 0, 0);

  // ===== INFO PACIENTE =====
  doc.setFontSize(14);
  doc.text("Información del Paciente", 20, 45);

  doc.setFontSize(11);
  doc.text("Nombre: Juan Pérez", 20, 55);
  doc.text("Edad: 34 años", 20, 62);
  doc.text("Última actualización: 2024", 20, 69);

  // ===== TRATAMIENTOS =====
  doc.setFontSize(14);
  doc.text("Tratamientos Activos", 20, 85);

  autoTable(doc, {
    startY: 90,
    head: [["Medicamento", "Dosis", "Frecuencia", "Médico"]],
    body: [
      ["Metformina", "850mg", "Cada 12 horas", "Dra. Elena Vargas"],
      ["Vitamina D3", "2000 UI", "Diariamente", "Dr. Ricardo Soto"],
    ],
    theme: "striped",
    headStyles: { fillColor: [25, 118, 210] },
  });

  // ===== CONSULTAS =====
  const finalY = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.text("Historial de Consultas", 20, finalY);

  autoTable(doc, {
    startY: finalY + 5,
    head: [["Fecha", "Motivo", "Especialista", "ID"]],
    body: [
      ["15 Ene 2024", "Chequeo Anual", "Dra. Sofía García", "#C-58421"],
      ["10 Oct 2023", "Dolor lumbar", "Dr. Ricardo Soto", "#C-58400"],
    ],
    theme: "grid",
    headStyles: { fillColor: [56, 142, 60] },
  });

  // ===== FOOTER =====
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

const handleDownloadConsultaPDF = () => {
  const doc = new jsPDF();

  // Header azul
  doc.setFillColor(25, 118, 210);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("REPORTE DE CONSULTA", 20, 18);

  doc.setTextColor(0, 0, 0);

  doc.setFontSize(12);
  doc.text("Paciente: Juan Pérez", 20, 50);
  doc.text("Fecha: 15 Ene 2024", 20, 60);
  doc.text("Motivo: Chequeo Anual", 20, 70);
  doc.text("Especialidad: Cardiología", 20, 80);
  doc.text("Doctora: Sofía García", 20, 90);

  doc.setFontSize(11);
  doc.text(
    "Observaciones: Paciente estable, continuar tratamiento actual.",
    20,
    110,
    { maxWidth: 170 }
  );

  doc.save("consulta_medica_profesional.pdf");

  setOpenConsultaModal(false);
  setOpenAlert(true);
};


const [labFiles, setLabFiles] = useState([
  {
    id: 1,
    name: "Análisis de Sangre Completo",
    date: "12 May 2024",
    type: "pdf",
    url: null,
  },
  {
    id: 2,
    name: "Resonancia Magnética Lumbar",
    date: "05 Abr 2024",
    type: "image",
    url: null,
  },
]);


const fileInputRef = React.useRef(null);

const handleUploadClick = () => {
  fileInputRef.current.click();
};


const handleFileChange = (e) => {
  const files = Array.from(e.target.files);

  if (files.length === 0) return;

  setPendingFiles(files);      // guardamos temporalmente
  setOpenUploadModal(true);    // abrimos modal de confirmación

  e.target.value = ""; // reset input para permitir subir el mismo archivo otra vez
};

const confirmUploadFiles = () => {
  const newFiles = pendingFiles.map((file, index) => {
    const isPdf = file.type.includes("pdf");

    return {
      id: Date.now() + index,
      name: file.name,
      date: new Date().toLocaleDateString(),
      type: isPdf ? "pdf" : "image",
      url: URL.createObjectURL(file),
      rawFile: file,
    };
  });

  setLabFiles((prev) => [...newFiles, ...prev]);
  setPendingFiles([]);
  setOpenUploadModal(false);
};

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
         // NUEVO
        openUploadModal={openUploadModal}
        setOpenUploadModal={setOpenUploadModal}
        confirmUploadFiles={confirmUploadFiles}
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

        <Grid container spacing={20}>
          {/* Card Tratamiento 1 */}
          <Grid item xs={12} md={12}>
            <Card className="custom-card card-tratamiento">
              <CardContent sx={{ p: '40px !important' }}>
                <Box className="treatment-top">
                  <Box display="flex" gap={2}>
                    <Box className="icon-badge blue">
                      <MedicationIcon />
                    </Box>
                    <Box>
                      <Typography className="item-name">Metformina</Typography>
                      <Typography className="item-subtitle">850mg • Tableta Oral</Typography>
                    </Box>
                  </Box>
                  <Chip label="EN CURSO" className="status-chip green" />
                </Box>

                <Grid container spacing={2} sx={{ my: 2 }}>
                  <Grid item xs={6}>
                    <Box className="info-box">
                      <Typography className="info-label">Frecuencia</Typography>
                      <Box className="info-value"><ScheduleIcon fontSize="small" /> Cada 12 horas</Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="info-box">
                      <Typography className="info-label">Médico</Typography>
                      <Box className="info-value"><PersonIcon fontSize="small" /> Dra. Elena Vargas</Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box className="progress-section">
                  <Box className="progress-labels">
                    <span>Progreso del tratamiento</span>
                    <span className="accent-text">Quedan 12 días</span>
                  </Box>
                  <LinearProgress variant="determinate" value={75} className="custom-progress" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Card Tratamiento 2 */}
          <Grid item xs={12} md={12}>
            <Card className="custom-card card-tratamiento">
              <CardContent sx={{ p: '40px !important' }}>
                <Box className="treatment-top">
                  <Box display="flex" gap={2}>
                    <Box className="icon-badge blue">
                      <MedicationIcon />
                    </Box>
                    <Box>
                      <Typography className="item-name">Vitamina D3</Typography>
                      <Typography className="item-subtitle">2000 UI • Cápsula</Typography>
                    </Box>
                  </Box>
                  <Chip label="EN CURSO" className="status-chip green" />
                </Box>

                <Grid container spacing={2} sx={{ my: 2 }}>
                  <Grid item xs={6}>
                    <Box className="info-box">
                      <Typography className="info-label">Frecuencia</Typography>
                      <Box className="info-value"><ScheduleIcon fontSize="small" /> Diariamente</Box>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box className="info-box">
                      <Typography className="info-label">Médico</Typography>
                      <Box className="info-value"><PersonIcon fontSize="small" /> Dr. Ricardo Soto</Box>
                    </Box>
                  </Grid>
                </Grid>

                <Box className="progress-section">
                  <Box className="progress-labels">
                    <span>Progreso del tratamiento</span>
                    <span className="accent-text">Quedan 45 días</span>
                  </Box>
                  <LinearProgress variant="determinate" value={40} className="custom-progress" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
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
                <TableRow className="table-row-hover">
                  <TableCell>
                    <Typography className="bold-text">15 Ene 2024</Typography>
                    <Typography className="id-text">ID: #C-58421</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography className="bold-text">Chequeo Anual</Typography>
                    <Typography className="sub-text">Cardiología - Evaluación Preventiva</Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Avatar sx={{ width: 32, height: 32 }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlvFnGoNN8VovDUsNmEdqXM5jFIRUtTNUr9JVAb3zyFoJbtyT1EFCwpf7DBFhSohDuZCUc1yosgTA9Jx4-1wTDeZOLkqvq0RITI6ScQNcDfcYpncri9SmDiSbdFGPkJHmZN-DrJ46nA0FCqqLUBb84esXPRG51xMf0WMRzniy7nSt0zIkadPy-9mDk0jaZaLsvP9atIYheAkUhkLvKSn61uGKcINWb8f27YzLJHNOGWIiRnAcfblcBWROfxNnGY5ZL7DAyJTiHFkxs" />
                      <Typography className="medium-text">Dra. Sofía García</Typography>
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="contained"
                      className="btn-download"
                      startIcon={<DownloadIcon />}
                      onClick={() => setOpenConsultaModal(true)}
                    >
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
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
    maxHeight: 240,        //  altura fija
    overflowY: "auto",     //  scroll vertical
    overflowX: "hidden",
    pr: 1,

    "&::-webkit-scrollbar": {
      width: 6,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#c1c1c1",
      borderRadius: 3,
    },
  }}
>
  {labFiles.map((file) => (
    <Box
      key={file.id}
      className="lab-item-row"
      sx={{
        minHeight: 72,            //  filas iguales
        flexShrink: 0,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        sx={{ minWidth: 0 }}       //  CLAVE para ellipsis
      >
        <Box
          className={`file-icon-box ${
            file.type === "pdf" ? "pdf" : "image"
          }`}
        >
          {file.type === "pdf" ? (
            <PictureAsPdfIcon />
          ) : (
            <ImageIcon />
          )}
        </Box>

        {/*  contenedor del texto */}
        <Box sx={{ minWidth: 0 }}>
          <Typography
            className="lab-item-title"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.name}
          </Typography>

          <Typography
            className="lab-item-date"
            sx={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {file.date} • Archivo subido
          </Typography>
        </Box>
      </Box>

      <IconButton
        className="action-btn-blue"
        onClick={() => window.open(file.url, "_blank")}
        sx={{ flexShrink: 0 }} // 🔹 evita que se deforme
      >
        {file.type === "pdf" ? <DownloadIcon /> : <VisibilityIcon />}
      </IconButton>
    </Box>
  ))}
</Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Diagnósticos y Línea de Tiempo */}
  <Grid item xs={12} lg={4}>
    <Card className="custom-card">
      <CardContent sx={{ p: '40px !important' }}>
        <Box className="section-header">
          <HistoryIcon />
          <Typography variant="h6">Diagnósticos</Typography>
        </Box>

        <Box className="diagnosis-list">
          <Box className="diagnosis-item">
            <Box>
              <Typography className="diag-title">Alergias Estacionales</Typography>
              <Typography className="diag-date">Abril 2023</Typography>
            </Box>
            <Chip label="ACTIVO" className="status-chip blue-light" />
          </Box>

          <Box className="diagnosis-item">
            <Box>
              <Typography className="diag-title">Hipertensión Leve</Typography>
              <Typography className="diag-date">Octubre 2022</Typography>
            </Box>
            <Chip label="CONTROLADO" className="status-chip blue-outline" />
          </Box>
        </Box>

        <Box className="timeline-section">
          <Typography className="timeline-header">LÍNEA DE TIEMPO</Typography>
          
          <Box className="timeline-container">
            <Box className="timeline-item active">
              <Box className="timeline-dot-outer">
                <Box className="timeline-dot-inner" />
              </Box>
              <Box>
                <Typography className="timeline-text-bold">Última consulta</Typography>
                <Typography className="timeline-text-sub">Hace 4 meses</Typography>
              </Box>
            </Box>

            <Box className="timeline-item muted">
              <Box className="timeline-dot-outer gray" />
              <Box>
                <Typography className="timeline-text-bold gray">Inicio Tratamiento</Typography>
                <Typography className="timeline-text-sub gray">Abril 2023</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>
    </Box>
  );
}