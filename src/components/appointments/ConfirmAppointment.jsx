import {
  Grow,Box,Card, CardContent, Typography, Avatar, Button,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppointments } from "./AppointmentContext";
import "./confirm.css";

export default function ConfirmAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addAppointment } = useAppointments();

  const { date, time } = location.state || {};

  const handleConfirm = () => {
    addAppointment({
      doctor: "DRA. Elena Vargas",
      specialty: "Medicina General",
      date,
      time,
      location: "Consultorio 402",
      avatar: "https://i.pravatar.cc/150?img=12",
    });

    navigate("/citas");
  };

  return (
    <Box className="confirm-container">
      <Grow in timeout={500}>
        <Card className="confirm-card">
          <CardContent>
            <Typography variant="h5" className="title">
              Confirmación de Reserva
            </Typography>

            <Avatar
              src="https://i.pravatar.cc/150?img=12"
              className="avatar"
            />

            <Typography className="info">{date}</Typography>
            <Typography className="info">{time}</Typography>

            <Button
              variant="contained"
              fullWidth
              className="confirm-btn"
              onClick={handleConfirm}
            >
              Confirmar y Agendar
            </Button>
          </CardContent>
        </Card>
      </Grow>
    </Box>
  );
}