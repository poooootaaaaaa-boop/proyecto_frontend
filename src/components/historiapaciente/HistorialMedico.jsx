import React from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  LinearProgress, Avatar, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Paper, TableContainer
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

import "./HistorialMedico.css";

export default function HistorialMedico() {
  return (
    <Box className="historial-wrapper">
      {/* HEADER */}
      <Box className="historial-header-flex">
        <Typography variant="h4" className="main-title">
          Mi Historial Médico
        </Typography>
        <Box display="flex" gap={1.5}>
          <Button variant="outlined" className="btn-secondary" startIcon={<HistoryIcon />}>
            Archivo
          </Button>
          <Button variant="contained" className="btn-primary" startIcon={<Box component="span" sx={{ fontSize: 20 }}>+</Box>}>
            Nueva Consulta
          </Button>
        </Box>
      </Box>

      {/* SECCIÓN TRATAMIENTOS */}
      <Box className="section-container">
        <Box className="section-header">
          <MedicationIcon />
          <Typography variant="h6">Tratamientos Activos</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Card Tratamiento 1 */}
          <Grid item xs={12} md={6}>
            <Card className="custom-card">
              <CardContent sx={{ p: '24px !important' }}>
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
          <Grid item xs={12} md={6}>
            <Card className="custom-card">
              <CardContent sx={{ p: '24px !important' }}>
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
                    <Button variant="contained" className="btn-download" startIcon={<DownloadIcon />}>
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
<Grid container spacing={4} sx={{ mt: 2 }}>
  {/* Resultados de Laboratorio */}
  <Grid item xs={12} lg={8}>
    <Card className="custom-card lab-results-container">
      <CardContent sx={{ p: '32px !important' }}>
        <Box className="section-header">
          <ScienceIcon />
          <Typography variant="h6">Resultados de Laboratorio</Typography>
        </Box>

        <Box className="lab-list">
          {/* Item 1 */}
          <Box className="lab-item-row">
            <Box display="flex" alignItems="center" gap={2}>
              <Box className="file-icon-box pdf">
                <PictureAsPdfIcon />
              </Box>
              <Box>
                <Typography className="lab-item-title">Análisis de Sangre Completo</Typography>
                <Typography className="lab-item-date">12 May 2024 • Bioquímica</Typography>
              </Box>
            </Box>
            <IconButton className="action-btn-blue">
              <DownloadIcon />
            </IconButton>
          </Box>

          {/* Item 2 */}
          <Box className="lab-item-row">
            <Box display="flex" alignItems="center" gap={2}>
              <Box className="file-icon-box image">
                <ImageIcon />
              </Box>
              <Box>
                <Typography className="lab-item-title">Resonancia Magnética Lumbar</Typography>
                <Typography className="lab-item-date">05 Abr 2024 • Imagenología</Typography>
              </Box>
            </Box>
            <IconButton className="action-btn-blue">
              <VisibilityIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  </Grid>

  {/* Diagnósticos y Línea de Tiempo */}
  <Grid item xs={12} lg={4}>
    <Card className="custom-card">
      <CardContent sx={{ p: '32px !important' }}>
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