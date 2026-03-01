import {Card, CardContent, Typography, Box, Chip, Avatar, Button,Paper } from "@mui/material";
import "./treatments.css";
import { jsPDF } from "jspdf";

export default function Treatments() {

  const downloadPDF = () => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Receta Médica", 20, 20);

  doc.setFontSize(12);
  doc.text("Paciente: Sofia Cardenas", 20, 40);
  doc.text("Médico: Dra. Elena Vargas", 20, 50);
  doc.text("Especialidad: Medicina General", 20, 60);

  doc.text("Medicamento: Metformina 850mg", 20, 80);
  doc.text("Frecuencia: Cada 12 horas", 20, 90);

  doc.text("Fecha: 12 Mayo 2024", 20, 110);

  doc.save("receta_medica.pdf");
};
  return (
    <div className="treatments-container">

      <Typography variant="h4" className="main-title">
        Mis Tratamientos y Recetas
      </Typography>

      {/* CARDS SUPERIORES */}
      <div className="treatment-cards">

        <Card className="treatment-card">
          <CardContent>
            <div className="card-header">
              <div>
                <Typography className="medicine-name">
                  Metformina
                </Typography>
                <Typography className="medicine-desc">
                  850mg - Tableta Oral
                </Typography>
              </div>
              <Chip label="En curso" size="small" className="status-chip" />
            </div>

            <div className="card-info">
              <div className="info-box">
                <Typography className="info-label">
                  FRECUENCIA
                </Typography>
                <Typography className="info-value">
                  CADA 12 HORAS
                </Typography>
              </div>

              <div className="info-box">
                <Typography className="info-label">
                  Médico
                </Typography>
                <Typography className="info-value">
                  DRA. Elena Vargas
                </Typography>
                <Typography className="info-sub">
                  Medicina General
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="treatment-card">
          <CardContent>
            <div className="card-header">
              <div>
                <Typography className="medicine-name">
                  Paracetamol
                </Typography>
                <Typography className="medicine-desc">
                  2000 UI - CAPSULA
                </Typography>
              </div>
              <Chip label="En curso" size="small" className="status-chip" />
            </div>

            <div className="card-info">
              <div className="info-box">
                <Typography className="info-label">
                  FRECUENCIA
                </Typography>
                <Typography className="info-value">
                  CADA 12 HORAS
                </Typography>
              </div>

              <div className="info-box">
                <Typography className="info-label">
                  Médico
                </Typography>
                <Typography className="info-value">
                  DRA. Elena Vargas
                </Typography>
                <Typography className="info-sub">
                  Medicina General
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* TABLA DE RECETAS */}
      <Paper className="table-container">

        <div className="table-header">
          <span>FECHA</span>
          <span>Receta/Tratamiento</span>
          <span>Medico</span>
          <span>ACCIONES</span>
        </div>

        {[1,2,3].map((item) => (
          <div className="table-row" key={item}>
            <div>12May 2024</div>
            <div>
              <strong>400</strong> units
            </div>
            <div className="doctor-cell">
              <Avatar className="doctor-avatar" />
              <div>
                <strong>DRA. Elena Vargas</strong>
                <p>Medicina General</p>
              </div>
            </div>
            <Button className="pdf-btn" onClick={downloadPDF}>
              DESCARGAR PDF
            </Button>
          </div>
        ))}

      </Paper>

      <Typography className="history-link">
        Ver Historial Completo
      </Typography>

    </div>
  );
}