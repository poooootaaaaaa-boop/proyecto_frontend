import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./weekAppointment.css";
import { useAppointments } from "../appointments/AppointmentContext";

dayjs.locale("es");

const HOURS = ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"];

export default function WeekAppointment({ onSelectSlot }) {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { appointments } = useAppointments();

  // inicio de semana (lunes)
  const startOfWeek = currentWeek.startOf("week").add(1, "day");

  const days = Array.from({ length: 5 }).map((_, i) =>
    startOfWeek.add(i, "day")
  );

  const goPrevWeek = () =>
    setCurrentWeek(currentWeek.subtract(1, "week"));

  const goNextWeek = () =>
    setCurrentWeek(currentWeek.add(1, "week"));

  return (
    <Box className="week-container">
      {/* HEADER */}
      <Box className="week-header">
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Agenda Médica
          </Typography>
          <Typography color="text.secondary" fontSize={13}>
            Seleccione el horario disponible
          </Typography>
        </Box>
      </Box>

      {/* CARD */}
      <Paper className="week-card">
        {/* BARRA SEMANA */}
        <Box className="week-bar">
          <Button onClick={goPrevWeek}>{"<"}</Button>

          <Typography fontWeight={700}>
            Semana del{" "}
            {startOfWeek.format("DD")} -{" "}
            {startOfWeek.add(4, "day").format("DD [de] MMMM")}
          </Typography>

          <Button onClick={goNextWeek}>{">"}</Button>
        </Box>

        {/* GRID */}
        <Box className="week-grid">
          {/* columna horas */}
          <Box className="hours-col">
            <div className="hour-cell header">Hora</div>
            {HOURS.map((h) => (
              <div key={h} className="hour-cell">
                {h}
              </div>
            ))}
          </Box>

          {/* columnas días */}
          {days.map((day) => (
            <Box key={day.format()} className="day-col">
              <div className="day-header">
                <span>{day.format("dddd")}</span>
                <strong>{day.format("DD")}</strong>
              </div>

              {HOURS.map((hour) => {
  const dateFormatted = day.format("DD MMMM YYYY");

  const isBooked = appointments.some(
    (a) => a.date === dateFormatted && a.time === hour
  );

  const key = `${day.format("YYYY-MM-DD")}-${hour}`;
  const isSelected = selectedSlot === key;

  return (
    <div
      key={key}
      className={`slot 
        ${isSelected ? "selected" : ""} 
        ${isBooked ? "booked" : ""}
      `}
      onClick={() => {
        if (isBooked) return; //  bloquea click

        setSelectedSlot(key);

        onSelectSlot?.({
          date: dateFormatted,
          time: hour,
        });
      }}
    >
      {isBooked ? (
        <span className="slot-occupied">
          Ocupado
        </span>
      ) : (
        <>
          <span className="slot-hour">{hour}</span>
          <span className="slot-action">
            {isSelected ? "Seleccionado" : "Reservar"}
          </span>
        </>
      )}
    </div>
  );
})}
            </Box>
          ))}
        </Box>
      </Paper>


    </Box>
  );
}