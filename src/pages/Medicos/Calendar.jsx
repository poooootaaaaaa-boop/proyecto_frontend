import { Box, Typography, Button, Modal } from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/es";
import { useState, useEffect } from "react";
import axios from "axios";
import "./calendar.css";

const API_URL = import.meta.env.VITE_API_URL;

dayjs.locale("es");

export default function Calendar({ citas = [] }) {

  const today = dayjs();

  const [currentMonth, setCurrentMonth] = useState(today);
  const [selectedDay, setSelectedDay] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [citasDoctor, setCitasDoctor] = useState([]);

  const startOfMonth = currentMonth.startOf("month");
  const endOfMonth = currentMonth.endOf("month");

  const startDay = startOfMonth.day();
  const daysInMonth = endOfMonth.date();
  useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (!usuario || !usuario.doctor_id) return;

  const doctor_id = usuario.doctor_id;  

   axios
      .get(`${API_URL}/citas-doctor/${doctor_id}`)
      .then(res => setCitasDoctor(res.data))
      .catch(err => console.error(err));
  }, []);

  const days = [];

  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const availableDays = [1,2,6,8,10,14,15,21,22,23,28,30];
  const getColorByTipo = (motivo) => {
  if (!motivo) return "gray";

  const tipo = motivo.split(" - ")[0];

  switch (tipo) {
    case "URGENTE":
      return "red";
    case "RUTINA":
      return "blue";
    case "SEGUIMIENTO":
      return "green";
    default:
      return "gray";
  }
};

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

const citasDelDia = citasDoctor.filter(c =>
  dayjs(c.fecha_fin).format("YYYY-MM-DD") === formattedDate
);

          const isBooked = citasDelDia.length > 0;

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

  if(citasDelDia.length > 0){
    setCitaSeleccionada(citasDelDia); //  ahora es array
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
                    <div style={{display:"flex", gap:"3px", marginTop:"4px"}}>
  {citasDelDia.slice(0,3).map((cita, i) => (
    <span
      key={i}
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        backgroundColor: getColorByTipo(cita.motivo)
      }}
    ></span>
  ))}
</div>
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
      width:350,
      maxHeight:400,
      overflowY:"auto"
    }}
  >

    <Typography variant="h6" fontWeight={700} mb={2}>
      Citas del día
    </Typography>

    {Array.isArray(citaSeleccionada) && citaSeleccionada.map((cita, i) => {

      const [tipo, descripcion] = cita.motivo.split(" - ");

      const getColor = (tipo) => {
        switch (tipo) {
          case "URGENTE": return "red";
          case "RUTINA": return "blue";
          case "SEGUIMIENTO": return "green";
          default: return "gray";
        }
      };

      return (
        <Box key={i} mb={2} p={1} borderBottom="1px solid #eee">

          <Typography fontWeight={600}>
            {cita.paciente?.usuario?.nombre}
          </Typography>

          <Typography style={{color: getColor(tipo)}}>
            {tipo}
          </Typography>

          <Typography>
            {descripcion}
          </Typography>

          <Typography fontSize="12px">
            {dayjs(cita.fecha_fin).format("HH:mm")}
          </Typography>

        </Box>
      );

    })}

  </Box>
</Modal>

    </Box>
  );
}