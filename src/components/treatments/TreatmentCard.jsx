import {Card, CardContent, Typography, Box, Chip, Avatar, Button,Paper } from "@mui/material";
import "./treatments.css";

export default function Treatments() {
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
            <Button className="pdf-btn">
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