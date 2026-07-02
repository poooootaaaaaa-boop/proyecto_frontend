import {
  Card,
  CardContent,
  Typography,
  Avatar,
  Grow,
  Box,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./appointments.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AppointmentHistory() {

  const [historyAppointments, setHistoryAppointments] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    const loadHistoryAppointments = async () => {
      try {
        const res = await fetch(
          `${API_URL}/citas/paciente/${usuario.paciente_id}/pasadas`
        );
        const data = await res.json();

        const citasFormateadas = data.map(c => {
          const fecha = dayjs(c.fecha_fin);

      return {
    id: c.id,
    doctor: c.doctor?.usuario?.nombre, // 👈 FIX
    specialty: c.doctor?.especialidad?.nombre,
    avatar: c.doctor?.usuario?.foto_url, // 👈 FIX
    date: fecha.format("DD MMMM YYYY"),
    time: fecha.format("hh:mm A"),
  };
        });

        setHistoryAppointments(citasFormateadas);

      } catch (error) {
        console.error(error);
      }
    };

    loadHistoryAppointments();
  }, []);

  return (
    <>
      {historyAppointments.length === 0 && (
        <Typography sx={{ mt: 3, color: "gray" }}>
          No tienes historial de citas.
        </Typography>
      )}

      {historyAppointments.map((appt, i) => (
        <Grow in key={i} timeout={400 + i * 120}>
          <Card className="appointment-card history-card">
            <CardContent className="card-content-citas">
              <Avatar src={appt.avatar} className="doctor-avatar" />

              <div className="doctor-info">
                <Box className="history-header">
                  <Typography className="doctor-name">
                    {appt.doctor}
                  </Typography>

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
              </div>
            </CardContent>
          </Card>
        </Grow>
      ))}
    </>
  );
}