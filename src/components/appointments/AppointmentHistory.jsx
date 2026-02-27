import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grow,
  Box,
  Chip,
} from "@mui/material";
import "./appointments.css";

export default function AppointmentHistory({ appointments = [] }) {
  // citas pasadas reales
  const historyAppointments = appointments.filter(
    (a) => a.status === "completed" || a.status === "past"
  );

  // fallback 
  const fallbackHistory = [
    {
      doctor: "Dra. María López",
      specialty: "Cardiología",
      date: "10 Ene 2026",
      time: "09:00 AM",
      location: "Clínica Central",
      avatar: "",
    },
    {
      doctor: "Dr. Juan Pérez",
      specialty: "Dermatología",
      date: "22 Dic 2025",
      time: "11:30 AM",
      location: "Hospital Norte",
      avatar: "",
    },
    {
      doctor: "Dra. Ana Torres",
      specialty: "Medicina General",
      date: "05 Dic 2025",
      time: "04:00 PM",
      location: "Consultorio Familiar",
      avatar: "",
    },
  ];

  const dataToShow =
    historyAppointments.length > 0 ? historyAppointments : fallbackHistory;

  return (
    <>
      {dataToShow.map((appt, i) => (
        <Grow in key={i} timeout={400 + i * 120}>
          <Card className="appointment-card history-card">
            <CardContent className="card-content">
              <Avatar src={appt.avatar} className="doctor-avatar" />

              <div className="doctor-info">
                <Box className="history-header">
                  <Typography className="doctor-name">
                    {appt.doctor}
                  </Typography>

                  {/*  BADGE FINALIZADA */}
                  <Chip
                    label="Finalizada"
                    size="small"
                    className="finalizada-chip"
                  />
                </Box>

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
            </CardContent>
          </Card>
        </Grow>
      ))}
    </>
  );
}