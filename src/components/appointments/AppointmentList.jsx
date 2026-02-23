import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Tabs,
  Tab,
  Paper,
  Grow,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "./AppointmentContext";
import "./appointments.css";

export default function AppointmentList() {
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const { appointments } = useAppointments();

  // opcional de filtro se agrega aquí, por ahora se muestran todos
  const filteredAppointments = appointments;

  return (
    <Box className="appointments-container">
      {/* HEADER */}
      <div className="appointments-header">
        <div>
          <Typography variant="h4" className="title">
            Mis Citas Médicas
          </Typography>
          <Typography className="subtitle">
            Gestiona tus consultas y revisa tu historial médico
          </Typography>
        </div>

        <Button
          variant="contained"
          className="new-btn"
          onClick={() => navigate("/nueva-cita")}
        >
          + Nueva Cita
        </Button>
      </div>

      {/* CONTENT */}
      <div className="appointments-content">
        {/* LEFT */}
        <div className="appointments-left">
          <Tabs
            value={tab}
            onChange={(e, v) => setTab(v)}
            className="tabs"
          >
            <Tab label="Próximas Citas" />
            <Tab label="Historial de Citas" />
          </Tabs>

          {/* LISTADO */}
          {filteredAppointments.length === 0 && (
            <Typography sx={{ mt: 3, color: "gray" }}>
              No tienes citas registradas.
            </Typography>
          )}

          {filteredAppointments.map((appt, i) => (
            <Grow in key={i} timeout={400 + i * 120}>
              <Card className="appointment-card">
                <CardContent className="card-content">
                  <Avatar
                    src={appt.avatar}
                    className="doctor-avatar"
                  />

                  <div className="doctor-info">
                    <Typography className="doctor-name">
                      {appt.doctor}
                    </Typography>

                    {appt.specialty && (
                      <Typography className="specialty">
                        {appt.specialty}
                      </Typography>
                    )}

                    <Typography className="details">
                      {appt.date}
                    </Typography>

                    <Typography className="details">
                      {appt.time}
                    </Typography>

                    {appt.location && (
                      <Typography className="details">
                        {appt.location}
                      </Typography>
                    )}
                  </div>

                  {/* acciones opcionales */}
                  {(appt.onReschedule || appt.onCancel) && (
                    <div className="actions">
                      {appt.onReschedule && (
                        <Button
                          className="reagendar-btn"
                          onClick={() => appt.onReschedule(appt)}
                        >
                          Reagendar
                        </Button>
                      )}

                      {appt.onCancel && (
                        <Button
                          className="cancelar-btn"
                          onClick={() => appt.onCancel(appt)}
                        >
                          Cancelar
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Grow>
          ))}
        </div>

        {/* RIGHT */}
        <div className="appointments-right">
          <Paper className="calendar">
            <DateCalendar />
          </Paper>

          <Paper className="notes">
            <Typography className="notes-title">
              Notas Rápidas
            </Typography>
            <Typography className="notes-text">
              Recuerda llegar 15 minutos antes de tu cita médica.
            </Typography>
          </Paper>
        </div>
      </div>
    </Box>
  );
}