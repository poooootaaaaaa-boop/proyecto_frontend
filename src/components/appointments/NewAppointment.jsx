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
const API_URL = import.meta.env.VITE_API_URL;

export default function NewAppointment() {

  const { appointments, loadAppointmentsByDoctor } = useAppointments();
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
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [doctorId, setDoctorId] = useState(null);
  const [doctores, setDoctores] = useState([]);
const [selectedDoctor, setSelectedDoctor] = useState(null);
const paciente_id = usuario?.paciente_id;
  const [viewMode, setViewMode] = useState("mes"); // semana | mes

  const HOURS = ["08:00 AM","09:00 AM","10:00 AM","11:00 AM"];
  const days = [];

    useEffect(() => {
    setSelectedHour(null);
  }, [viewMode]);


useEffect(() => {
  if (!doctorId) return;

  loadAppointmentsByDoctor(doctorId);

}, [doctorId]);

useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) return;

  const obtenerDoctores = async () => {
    try {
      const res = await fetch(`${API_URL}/paciente/doctores/${usuario.id}`);
      const data = await res.json();

      setDoctores(data);

      // seleccionar el primero por default
      if (data.length > 0) {
        setSelectedDoctor(data[0]);
        setDoctorId(data[0].id);
      }

    } catch (error) {
      console.error(error);
    }
  };

  obtenerDoctores();
}, []);
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
  src={selectedDoctor?.foto_url || "https://ui-avatars.com/api/?name=Doctor&background=0D8ABC&color=fff"}
  className="apv-doctor-avatar"
/>
<Typography className="apv-doctor-name">
  {selectedDoctor?.nombre || "Selecciona un doctor"}
</Typography>

<Typography className="apv-doctor-specialty">
  {selectedDoctor?.especialidad || ""}
</Typography>

          <Divider sx={{ my: 2 }} />

          <Box className="apv-doctor-stats">
            <div>
              <Typography className="apv-stat-label">
                Experiencia
              </Typography>
             
<Typography className="apv-stat-value">
  {selectedDoctor?.anios_exp || 0} años
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

          <Box sx={{ mb: 2 }}>
  <Typography fontWeight={600}>Seleccionar Doctor</Typography>

  <select
    value={selectedDoctor?.id || ""}
    onChange={(e) => {
      const doc = doctores.find(d => d.id == e.target.value);
      setSelectedDoctor(doc);
      setDoctorId(doc.id);
    }}
    style={{ width: "100%", padding: "8px", borderRadius: "8px" }}
  >
    {doctores.map(doc => (
      <option key={doc.id} value={doc.id}>
        {doc.nombre} - {doc.especialidad}
      </option>
    ))}
  </select>
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

// obtener horas ocupadas de ese día
const bookedHours = appointments
  .filter(a => a.date === formattedDate)
  .map(a => a.time);

// verificar si TODAS están ocupadas
const isFullBooked =
  formattedDate &&
  HOURS.every(h => bookedHours.includes(h));

    const isBooked =
      formattedDate && bookedDates.includes(formattedDate);

    return (
      <div
        key={index}
        className={`apv-day-cell
          ${!day ? "empty" : ""}
          ${isSelected ? "selected" : ""}
          ${isFullBooked ? "booked" : ""}
        `}
      onClick={() => {
  if (!day || isFullBooked) return;
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
    {HOURS.map((h) => {

      const isBooked = bookedHoursForSelectedDay.includes(h);

      return (
        <Button
          key={h}
          size="small"
          disabled={isBooked} // BLOQUEA CLICK
          variant={selectedHour === h ? "contained" : "outlined"}
          onClick={() => setSelectedHour(h)}
          sx={{
            fontWeight: 600,
            borderRadius: "10px",
            opacity: isBooked ? 0.5 : 1 // efecto visual
          }}
        >
          {isBooked ? "Ocupado" : h}
        </Button>
      );
    })}
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
          doctor: selectedDoctor 
        },
      });
    } else {
      navigate("/confirmar-cita", {
        state: weekSelection,
        doctor: selectedDoctor
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