import {
  Box,
  Typography,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "dayjs/locale/es";
import { useState , useEffect } from "react";
import "./newAppointment.css";
import WeekAppointment from "./WeekAppointment";
import { useAppointments } from "../appointments/AppointmentContext";

dayjs.locale("es");

export default function NewAppointment() {

  const { appointments } = useAppointments();
  const [weekSelection, setWeekSelection] = useState(null);

  const navigate = useNavigate();
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(24);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const [selectedHour, setSelectedHour] = useState(null);
  const [viewMode, setViewMode] = useState("mes"); // semana | mes
  const days = [];

    useEffect(() => {
    setSelectedHour(null);
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === "mes") setWeekSelection(null);
  }, [viewMode]);


  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const availableDays = [1,2,6,8,10,14,15,21,22,23,28,30];

  // fechas ocupadas (formato: DD MMMM YYYY)
const bookedDates = appointments.map(a => a.date);

// horas ocupadas del día seleccionado
const bookedHoursForSelectedDay = appointments
  .filter(a =>
    a.date === currentMonth.date(selectedDay).format("DD MMMM YYYY")
  )
  .map(a => a.time);

  return (
    <Box className="apv-container">

      {/* SIDEBAR */}
      <Box className="apv-sidebar">
        <Box className="apv-doctor-card">
          <Avatar
            src="https://randomuser.me/api/portraits/men/32.jpg"
            className="apv-doctor-avatar"
          />
          <Typography className="apv-doctor-name">
            Dr. Alejandro Ruiz
          </Typography>
          <Typography className="apv-doctor-specialty">
            Cardiología Clínica
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box className="apv-doctor-stats">
            <div>
              <Typography className="apv-stat-label">
                Experiencia
              </Typography>
              <Typography className="apv-stat-value">
                15 años
              </Typography>
            </div>

            <div>
              <Typography className="apv-stat-label">
                Pacientes
              </Typography>
              <Typography className="apv-stat-value">
                +2.5k
              </Typography>
            </div>
          </Box>
        </Box>
      </Box>

      {/* CALENDARIO */}
      <Box className="apv-calendar-area">

        <Box className="apv-calendar-header">
          <Box>
            <Typography variant="h5" fontWeight={800}>
              Agenda Médica
            </Typography>
            <Typography color="text.secondary" fontSize={13}>
              Seleccione el día para ver los horarios disponibles
            </Typography>
          </Box>

          <Box className="apv-view-switch">
  <Button
    size="small"
    variant={viewMode === "semana" ? "contained" : "text"}
    onClick={() => setViewMode("semana")}
  >
    Semana
  </Button>

  <Button
    size="small"
    variant={viewMode === "mes" ? "contained" : "text"}
    onClick={() => setViewMode("mes")}
  >
    Mes
  </Button>
</Box>
        </Box>
        {viewMode === "mes" && (

        <Box className="apv-calendar-card">

          <Box className="apv-month-bar">
            <Button
              onClick={() =>
                setCurrentMonth(currentMonth.subtract(1, "month"))
              }
            >
              {"<"}
            </Button>

            <Typography fontWeight={700}>
              {currentMonth.format("MMMM YYYY")}
            </Typography>

            <Button
              onClick={() =>
                setCurrentMonth(currentMonth.add(1, "month"))
              }
            >
              {">"}
            </Button>
          </Box>

     <Box className="apv-week-row">
  {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d) => (
    <div key={d}>{d}</div>
  ))}
</Box>

<Box className="apv-calendar-grid">
  {days.map((day, index) => {

    const isAvailable = availableDays.includes(day);
    const isSelected = selectedDay === day;

    const formattedDate = day
      ? currentMonth.date(day).format("DD MMMM YYYY")
      : null;

    const isBooked =
      formattedDate && bookedDates.includes(formattedDate);

    return (
      <div
        key={index}
        className={`apv-day-cell
          ${!day ? "empty" : ""}
          ${isSelected ? "selected" : ""}
          ${isBooked ? "booked" : ""}
        `}
        onClick={() => {
          if (!day || isBooked) return; //  aquí se bloquea
          setSelectedDay(day);
          setSelectedHour(null);
        }}
      >
        {day && (
          <>
            <span className="apv-day-number">
              {day}
            </span>

            {isAvailable && !isBooked && (
              <span className="apv-dot"></span>
            )}
          </>
        )}
      </div>
    );
  })}
</Box>

        </Box>
        )}

{viewMode === "semana" && (
  <WeekAppointment
    onSelectSlot={(data) => {
      setWeekSelection(data);
      setSelectedHour(data.time);
    }}
  />
)}

      </Box>

      {/* ASISTENTE */}
      <Box className="apv-assistant">

  <Typography className="apv-assistant-title">
    Asistente de Citas
  </Typography>

  <Box className="apv-assistant-card">

    <Typography className="apv-assistant-label">
      Día Seleccionado
    </Typography>

    {/* FECHA SEGÚN VISTA */}
    {viewMode === "semana" && weekSelection ? (
      <Typography fontWeight={700}>
        {weekSelection.date}
      </Typography>
    ) : (
      <Typography fontWeight={700}>
        {currentMonth
          .date(selectedDay)
          .format("dddd, DD MMMM")}
      </Typography>
    )}

    {/* HORA SEGÚN VISTA */}
    {viewMode === "semana" ? (
      weekSelection?.time && (
        <Typography
          sx={{ mt: 1 }}
          fontWeight={600}
          color="#135bec"
        >
          Hora: {weekSelection.time}
        </Typography>
      )
    ) : (
      selectedHour && (
        <Typography
          sx={{ mt: 1 }}
          fontWeight={600}
          color="#135bec"
        >
          Hora: {selectedHour}
        </Typography>
      )
    )}

    {/*  SOLO EN MODO MES SE VEN LAS HORAS */}
    {viewMode === "mes" && (
      <Box className="apv-hours-grid">
        {["08:00 AM","09:00 AM","10:00 AM","11:00 PM"].map((h) => (
          <Button
            key={h}
            size="small"
            variant={selectedHour === h ? "contained" : "outlined"}
            onClick={() => setSelectedHour(h)}
            sx={{
              fontWeight: 600,
              borderRadius: "10px"
            }}
          >
            {h}
          </Button>
        ))}
      </Box>
    )}

    <Divider sx={{ my: 3 }} />

    <Typography fontSize={12} color="text.secondary">
      Consulta Especialista
    </Typography>
    <Typography variant="h5" fontWeight={800}>
      $85.00
    </Typography>

  </Box>


<Button
  variant="contained"
  fullWidth
  disabled={
    viewMode === "mes"
      ? !selectedHour
      : !weekSelection
  }
  className="apv-confirm-button"
  onClick={() => {
    if (viewMode === "mes") {
      navigate("/confirmar-cita", {
        state: {
          date: currentMonth
            .date(selectedDay)
            .format("DD MMMM YYYY"),
          time: selectedHour,
        },
      });
    } else {
      navigate("/confirmar-cita", {
        state: weekSelection,
      });
    }
  }}
>
  Continuar
</Button>

      </Box>

    </Box>
  );
}