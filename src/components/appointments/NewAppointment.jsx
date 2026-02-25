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
import { useState } from "react";
import "./newAppointment.css";

dayjs.locale("es");

export default function NewAppointment() {

  const navigate = useNavigate();
  const today = dayjs();
  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(23);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  const [selectedHour, setSelectedHour] = useState(null);

  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const availableDays = [1,2,6,8,10,14,15,21,22,23,28,30];

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
            <Button size="small">Semana</Button>
            <Button size="small" variant="contained">
              Mes
            </Button>
          </Box>
        </Box>

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

              return (
                <div
                  key={index}
                  className={`apv-day-cell
                    ${!day ? "empty" : ""}
                    ${isSelected ? "selected" : ""}
                  `}
                  onClick={() => {
  if (!day) return;
  setSelectedDay(day);
  setSelectedHour(null); //  resetea la hora al cambiar de día
}}
                >
                  {day && (
                    <>
                      <span className="apv-day-number">
                        {day}
                      </span>

                      {isAvailable && (
                        <span className="apv-dot"></span>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </Box>

        </Box>

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

          <Typography fontWeight={700}>
            {currentMonth
              .date(selectedDay)
              .format("dddd, DD MMMM")}
          </Typography>

          {selectedHour && (
  <Typography sx={{ mt: 1 }} fontWeight={600} color="#135bec">
    Hora: {selectedHour}
  </Typography>
)}

          <Box className="apv-hours-grid">
  {["09:00 AM","10:30 AM","11:00 AM","03:30 PM"].map((h) => (
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
  disabled={!selectedHour}
  className="apv-confirm-button"
  onClick={() =>
    navigate("/confirmar-cita", {
      state: {
        date: currentMonth
          .date(selectedDay)
          .format("DD MMMM YYYY"),
        time: selectedHour,
      },
    })
  }
>
  Continuar
</Button>

      </Box>

    </Box>
  );
}