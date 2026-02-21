import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Paper
} from "@mui/material";
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { useState } from "react";
import "./appointments.css";

export default function AppointmentList() {

  const [tab, setTab] = useState(0);

  return (
    <Box className="appointments-container">

      {/* HEADER */}
      <div className="appointments-header">
        <div>
          <Typography variant="h4" className="title">
            Mis Citas Medicas
          </Typography>
          <Typography className="subtitle">
            gestiona tus consultas y revisa tu historial medico
          </Typography>
        </div>

        <Button className="new-btn">
          + NUEVA CITA
        </Button>
      </div>

      {/* CONTENT */}
      <div className="appointments-content">

        {/* LEFT SIDE */}
        <div className="appointments-left">

          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            className="tabs"
          >
            <Tab label="Proximas Citas" />
            <Tab label="Historial de Citas" />
          </Tabs>

          {/* CARD 1 */}
          <Card className="appointment-card">
            <CardContent className="card-content">

              <Avatar
                src="https://i.pravatar.cc/150?img=12"
                className="doctor-avatar"
              />

              <div className="doctor-info">
                <Typography className="doctor-name">
                  DRA. Elena Vargas
                </Typography>
                <Typography className="specialty">
                  Medicina General
                </Typography>
                <Typography className="details">
                  24 de Julio 2026
                </Typography>
                <Typography className="details">
                  10:30 AM
                </Typography>
                <Typography className="details">
                  Consultorio 402, Ala Norte
                </Typography>
              </div>

              <div className="actions">
                <Button className="reagendar-btn">
                  Reagendar
                </Button>
                <Button className="cancelar-btn">
                  Cancelar
                </Button>
              </div>

            </CardContent>
          </Card>

          {/* CARD 2 */}
          <Card className="appointment-card">
            <CardContent className="card-content">

              <Avatar
                src="https://i.pravatar.cc/150?img=20"
                className="doctor-avatar"
              />

              <div className="doctor-info">
                <Typography className="doctor-name">
                  DRA. Julián Heredia
                </Typography>
                <Typography className="specialty">
                  Medicina General
                </Typography>
                <Typography className="details">
                  28 de Julio 2026
                </Typography>
                <Typography className="details">
                  10:30 AM
                </Typography>
                <Typography className="details">
                  Consultorio 402, Ala Norte
                </Typography>
              </div>

              <div className="actions">
                <Button className="reagendar-btn">
                  Reagendar
                </Button>
                <Button className="cancelar-btn">
                  Cancelar
                </Button>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* RIGHT SIDE */}
        <div className="appointments-right">

          <Paper className="calendar">
            <DateCalendar />
          </Paper>

          <Paper className="notes">
            <Typography className="notes-title">
              Notas Rapidas
            </Typography>
            <Typography className="notes-text">
              Recuerda llegar 15 minutos antes de tu cita con la Dra. Vargas para actualizar tus datos.
            </Typography>
          </Paper>

        </div>

      </div>

    </Box>
  );
}