import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Grid,
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./newAppointment.css";

const HOURS = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
];

const OCCUPIED = ["09:00 AM", "12:00 PM"];

export default function NewAppointment() {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs());
  const [selectedHour, setSelectedHour] = useState(null);
  return (
    <Box className="new-container">
      <Typography variant="h4" className="title">
        Agenda Médica
      </Typography>

      <Grid container spacing={3}>

        {/* CALENDARIO */}
        <Grid item xs={12} md={5}>
          <Paper className="calendar-box">
            <DateCalendar value={date} onChange={setDate} />
          </Paper>
        </Grid>

        {/* HORAS */}
        <Grid item xs={12} md={7}>
          <Paper className="hours-box">
            <Typography className="section-title">
              Horarios Disponibles
            </Typography>

            <Box className="hours-grid">
              {HOURS.map((hour) => {
                const isBusy = OCCUPIED.includes(hour);
                const isSelected = selectedHour === hour;

                return (
                  <Chip
                    key={hour}
                    label={hour}
                    clickable={!isBusy}
                    onClick={() => !isBusy && setSelectedHour(hour)}
                    className={`hour-chip ${
                      isBusy
                        ? "busy"
                        : isSelected
                        ? "selected"
                        : "free"
                    }`}
                  />
                );
              })}
            </Box>

            <Button
              variant="contained"
              fullWidth
              disabled={!selectedHour}
              className="confirm-btn"
              onClick={() =>
                navigate("/confirmar-cita", {
                  state: {
                    date: date.format("DD MMMM YYYY"),
                    time: selectedHour,
                  },
                })
              }
            >
              Continuar
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}