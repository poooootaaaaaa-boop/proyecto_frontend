import {
  Grow,Box,Card, CardContent, Typography, Avatar, Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppointments } from "./AppointmentContext";
import "./confirm.css";
import SuccessModal from "./SuccessModal";
import { useState } from "react";

export default function ConfirmAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAppointment } = useAppointments();

  const { date, time } = location.state || {};
  const [openModal, setOpenModal] = useState(false);

  const handleConfirm = () => {
  addAppointment({
    id: Date.now(),
    doctor: "DRA. Elena Vargas",
    specialty: "Medicina General",
    date,
    time,
    location: "Consultorio 402",
    avatar: "https://i.pravatar.cc/150?img=12",
  });

  setOpenModal(true); // 👈 ABRE el modal
};

return (
  <Box className="confirm-container">
    <Grow in timeout={600}>
      <Box className="confirm-wrapper">


        <SuccessModal
  open={openModal}
  onClose={() => {
    setOpenModal(false);
    navigate("/citas"); // 👈 aquí sí
  }}
/>

        {/* HEADER */}
        <Box className="confirm-header">
          <Box className="check-circle">
            <span className="material-symbols-outlined success-icon">
              check_circle
            </span>
          </Box>

          <Typography className="title">
            Confirmación de Reserva
          </Typography>

          <Typography className="subtitle">
            Por favor, verifique los detalles antes de finalizar.
          </Typography>
        </Box>

        {/* CARD */}
        <Card className="confirm-card">

          {/* DOCTOR */}
          <Box className="doctor-card">
            <Box className="doctor-image-wrapper">
              <Avatar
                src="https://i.pravatar.cc/150?img=12"
                className="doctor-image"
              />
              <Box className="rating-badge">
                <span className="material-symbols-outlined star-icon">
                  star
                </span>
                <span>4.9</span>
              </Box>
            </Box>

            <Box>
              <Typography className="doctor-label">
                Especialista Asignado
              </Typography>
              <Typography className="doctor-name">
                DRA. Elena Vargas
              </Typography>
              <Typography className="doctor-specialty">
                Medicina General
              </Typography>
            </Box>
          </Box>

          {/* INFO GRID */}
          <Box className="info-grid">
            <Box className="info-item">
              <span className="material-symbols-outlined info-icon">
                calendar_today
              </span>
              <Typography className="info-title">Fecha</Typography>
              <Typography className="info-value">{date}</Typography>
            </Box>

            <Box className="info-item">
              <span className="material-symbols-outlined info-icon">
                schedule
              </span>
              <Typography className="info-title">Hora</Typography>
              <Typography className="info-value">{time}</Typography>
            </Box>

            <Box className="info-item">
              <span className="material-symbols-outlined info-icon">
                location_on
              </span>
              <Typography className="info-title">Ubicación</Typography>
              <Typography className="info-value">
                Consultorio 402
              </Typography>
            </Box>
          </Box>

          {/* INSTRUCCIONES */}
          <Box className="instructions-section">
            <Typography className="instructions-title">
              <span className="material-symbols-outlined small-primary">
                priority_high
              </span>
              Instrucciones Importantes
            </Typography>

            <Box className="instructions-grid">
              <Box className="instruction-card">
                <span className="material-symbols-outlined amber-icon">
                  fastfood
                </span>
                <Box>
                  <Typography className="instruction-title">
                    Ayuno Requerido
                  </Typography>
                  <Typography className="instruction-text">
                    Mantener ayuno de 8 horas antes de su cita.
                  </Typography>
                </Box>
              </Box>

              <Box className="instruction-card">
                <span className="material-symbols-outlined blue-icon">
                  description
                </span>
                <Box>
                  <Typography className="instruction-title">
                    Documentación
                  </Typography>
                  <Typography className="instruction-text">
                    Traer identificación oficial vigente.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

        </Card>

        {/* BOTONES */}
        <Box className="button-group">
          <Button
            className="confirm-btn"
            onClick={handleConfirm}
            fullWidth
          >
            Confirmar y Agendar
            <span className="material-symbols-outlined btn-icon">
              event_available
            </span>
          </Button>

          <Button
  className="secondary-btn"
  onClick={() => navigate(-1)}
  fullWidth   // 👈 FALTABA ESTO
>
  Modificar Selección
</Button>
        </Box>

        <Typography className="legal-text">
          Al confirmar, se enviará una notificación con los detalles de su cita.
        </Typography>

      </Box>
    </Grow>
  </Box>

  
);
}