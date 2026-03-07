import { Box, Typography, Button, Modal } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState } from "react";
import "./calendar.css";

dayjs.locale("es");

export default function Calendar({ citas = [] }) {

  const today = dayjs();

  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();

  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const availableDays = [1,2,6,8,10,14,15,21,22,23,28,30];

  return (

    <Box className="calendar-container">

      {/* HEADER */}
      <Box className="calendar-header">

        <Button
          onClick={() =>
            setCurrentMonth(currentMonth.subtract(1,"month"))
          }
        >
          {"<"}
        </Button>

        <Typography fontWeight={700}>
          {currentMonth.format("MMMM YYYY")}
        </Typography>

        <Button
          onClick={() =>
            setCurrentMonth(currentMonth.add(1,"month"))
          }
        >
          {">"}
        </Button>

      </Box>

      {/* WEEK DAYS */}
      <Box className="calendar-week-row">
        {["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"].map((d)=>(
          <div key={d}>{d}</div>
        ))}
      </Box>

      {/* GRID */}
      <Box className="calendar-grid">

        {days.map((day,index)=>{

          const isAvailable = availableDays.includes(day);
          const isSelected = selectedDay === day;

          const formattedDate = day
            ? currentMonth.date(day).format("YYYY-MM-DD")
            : null;

          const citaDelDia = citas.find(c =>
            dayjs(c.fechaCita).format("YYYY-MM-DD") === formattedDate
          );

          const isBooked = !!citaDelDia;

          return(

            <div
              key={index}
              className={`calendar-day
                ${!day ? "empty":""}
                ${isSelected ? "selected":""}
              `}
              onClick={()=>{

                if(!day) return;

                setSelectedDay(day);

                if(citaDelDia){
                  setCitaSeleccionada(citaDelDia);
                  setOpenModal(true);
                }

              }}
            >

              {day && (
                <>
                  <span className="calendar-day-number">
                    {day}
                  </span>

                  {/* Punto rojo si hay cita */}
                  {isBooked && (
                    <span className="calendar-red-dot"></span>
                  )}
                </>
              )}

            </div>

          );

        })}

      </Box>


      {/* MODAL DETALLE CITA */}
      <Modal open={openModal} onClose={()=>setOpenModal(false)}>
        <Box
          sx={{
            position:"absolute",
            top:"50%",
            left:"50%",
            transform:"translate(-50%,-50%)",
            bgcolor:"white",
            p:4,
            borderRadius:"12px",
            width:350
          }}
        >

          {citaSeleccionada && (
            <>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Detalle de la cita
              </Typography>

              <Typography>
                Paciente: {citaSeleccionada.nombre} {citaSeleccionada.apellidoP}
              </Typography>

              <Typography>
                Motivo: {citaSeleccionada.motivoCita}
              </Typography>

              <Typography>
                Tipo: {citaSeleccionada.tipoCita}
              </Typography>

              <Typography>
                Fecha: {dayjs(citaSeleccionada.fechaCita).format("DD MMMM YYYY HH:mm")}
              </Typography>

            </>
          )}

        </Box>
      </Modal>

    </Box>
  );
}