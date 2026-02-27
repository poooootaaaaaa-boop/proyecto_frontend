import {Box, Card, CardContent,  Typography,  Button,  Avatar,  Tabs,  Tab,  Paper,  Grow, Snackbar, Alert,} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "./AppointmentContext";
import "./appointments.css";
import AppointmentHistory from "./AppointmentHistory";
import TodayIcon from "@mui/icons-material/Today";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HistoryIcon from "@mui/icons-material/History";
import { Chip } from "@mui/material";
import ModalCancelarCita from "./ModalCancelarCita";

export default function AppointmentList() {
  const [openCancel, setOpenCancel] = useState(false);
const [selectedAppointment, setSelectedAppointment] = useState(null);
const [successMessage, setSuccessMessage] = useState(false);
  const [tab, setTab] = useState(0);
  const navigate = useNavigate();
  const { appointments, updateAppointment, deleteAppointment } = useAppointments();
  const [selectedDate, setSelectedDate] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
const [editingAppointment, setEditingAppointment] = useState(null);


const handleCancelClick = (appt) => {
    setSelectedAppointment(appt);
    setOpenCancel(true);
  };


  // filtro del día seleccionado (si hay)
 const filteredAppointments = selectedDate
  ? appointments.filter((appt) =>
      dayjs(appt.date, "DD MMMM YYYY").isSame(selectedDate, "day")
    )
  : appointments;
const sortedAppointments = [...filteredAppointments].sort((a, b) => {
  const today = dayjs().startOf("day");

  const dateA = dayjs(a.date, "DD MMMM YYYY").startOf("day");
  const dateB = dayjs(b.date, "DD MMMM YYYY").startOf("day");

  const diffA = dateA.diff(today, "day");
  const diffB = dateB.diff(today, "day");

  // Futuras primero (más cercanas primero)
  if (diffA >= 0 && diffB >= 0) {
    return diffA - diffB;
  }

  // Si una es futura y otra pasada
  if (diffA >= 0 && diffB < 0) return -1;
  if (diffA < 0 && diffB >= 0) return 1;

  // Si ambas son pasadas → la más reciente primero
  return diffB - diffA;
});
const handleEditClick = (appt) => {
  setEditingAppointment(appt);
  setOpenEdit(true);
};



const handleConfirmCancel = () => {
  if (!selectedAppointment) return;

  deleteAppointment(selectedAppointment.id);
  setOpenCancel(false);
  setSuccessMessage(true);

  setTimeout(() => {
    setSuccessMessage(false);
  }, 2500);
};

//Logica para determinar el estado de la cita (próxima, pasada, hoy, etc.)
  const getAppointmentStatus = (dateString) => {
  const today = dayjs().startOf("day");
  const appointmentDate = dayjs(dateString, "DD MMMM YYYY").startOf("day");

  const diffDays = appointmentDate.diff(today, "day");

  if (diffDays === 0) {
    return {
      label: "Hoy",
      subLabel: "Es hoy",
      color: "#16a34a",
      icon: "today",
    };
  }

  if (diffDays < 0) {
    return {
      label: "Pasada",
      subLabel: "Ya ocurrió",
      color: "#dc2626",
      icon: "past",
    };
  }

  if (diffDays <= 3) {
    return {
      label: "Próxima",
      subLabel: `En ${diffDays} día${diffDays > 1 ? "s" : ""}`,
      color: "#2563eb",
      icon: "soon",
    };
  }

  if (diffDays <= 7) {
    return {
      label: "Esta semana",
      subLabel: `En ${diffDays} días`,
      color: "#d97706",
      icon: "week",
    };
  }

  return {
    label: "Programada",
    subLabel: `En ${diffDays} días`,
    color: "#7c3aed",
    icon: "future",
  };
};



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
{tab === 0 && (
  <>
    {sortedAppointments.length === 0 && (
      <Typography sx={{ mt: 3, color: "gray" }}>
        No tienes citas registradas.
      </Typography>
    )}

    {sortedAppointments.map((appt, i) => {
  const status = getAppointmentStatus(appt.date);

  const getIcon = () => {
    switch (status.icon) {
      case "today":
        return <TodayIcon fontSize="small" />;
      case "soon":
        return <NotificationsActiveIcon fontSize="small" />;
      case "past":
        return <HistoryIcon fontSize="small" />;
      default:
        return <EventAvailableIcon fontSize="small" />;
    }
  };

  

  return (
    <Grow in key={i} timeout={400 + i * 120}>
      <Card
        className="appointment-card"
        sx={{
          borderLeft: `6px solid ${status.color}`,
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 6,
          },
        }}
      >
        <CardContent className="card-content">
          <Avatar src={appt.avatar} className="doctor-avatar" />

          <div className="doctor-info">
            <Typography className="doctor-name">
              {appt.doctor}
            </Typography>

            {/*  Badge Moderno */}
            <Chip
              icon={getIcon()}
              label={`${status.label} • ${status.subLabel}`}
              size="small"
              sx={{
                mt: 1,
                mb: 1,
                backgroundColor: status.color,
                color: "#fff",
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: "8px",
              }}
            />

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

          <div className="actions">

  <Button
    className="cancelar-btn"
    onClick={() => handleCancelClick(appt)}
  >
    Cancelar
  </Button>
</div>
        </CardContent>
      </Card>
    </Grow>
  );
})}
  </>
)}

{tab === 1 && (
  <AppointmentHistory appointments={appointments} />
)}
        </div>

        {/* RIGHT */}
        <div className="appointments-right">
          <Paper className="calendar">
            <DateCalendar
  value={selectedDate}
  onChange={(newValue) => setSelectedDate(newValue)}
/>
{selectedDate && (
  <Button
    size="small"
    sx={{ mt: 1 }}
    onClick={() => setSelectedDate(null)}
  >
    Limpiar filtro
  </Button>
)}
          </Paper>

          <Paper className="notes">
            <Typography className="notes-title">
              Notas Rápidas
            </Typography>
            <Typography className="notes-text">
              Recuerda llegar 15 minutos antes de tu cita médica.
            </Typography>
          </Paper>

          <ModalCancelarCita
  open={openCancel}
  onClose={() => setOpenCancel(false)}
  onConfirm={handleConfirmCancel}
  appointment={selectedAppointment}
/>

<Snackbar
  open={successMessage}
  autoHideDuration={2500}
  onClose={() => setSuccessMessage(false)}
>
  <Alert severity="success" variant="filled">
    Cita cancelada exitosamente
  </Alert>
</Snackbar>
        </div>
      </div>
    </Box>
    
  );
}