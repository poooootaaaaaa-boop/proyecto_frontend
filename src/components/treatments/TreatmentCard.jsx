import {Card, CardContent, Typography, Box, Chip, Avatar, Button,Paper } from "@mui/material";
import "./treatments.css";
import { jsPDF } from "jspdf";
import { useState, useEffect } from "react";
import MedicationDetailModal from "./MedicationDetailModal";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
export default function Treatments() {
const [recetas, setRecetas] = useState([]);

useEffect(() => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (!usuario) return;

  const fetchRecetas = async () => {
    try {
      const res = await fetch(
        `${API_URL}/recetas/paciente/${usuario.paciente_id}`
      );

      const data = await res.json();
      setRecetas(data);

    } catch (error) {
      console.error(error);
    }
  };

  fetchRecetas();
}, []);

  const navigate = useNavigate();
const downloadPDF = (receta) => {
  const doc = new jsPDF();
doc.text(`Paciente: ${receta.paciente?.usuario?.nombre}`, 20, 40);
doc.text(`Doctor: ${receta.doctor?.usuario?.nombre}`, 20, 50);
  doc.setFontSize(18);
  doc.text("Receta Médica", 20, 20);

  doc.setFontSize(12);
  doc.text(`Doctor: ${receta.doctor?.usuario?.nombre}`, 20, 40);

  let y = 60;

  receta.detalles.forEach((det, i) => {
    doc.text(
      `${i + 1}. ${det.medicamento?.nombre}`,
      20,
      y
    );

    doc.text(
      `Dosis: ${det.dosis} | ${det.frecuencia}`,
      20,
      y + 8
    );

    doc.text(
      `Duración: ${det.duracion}`,
      20,
      y + 16
    );

    y += 30;
  });

  doc.save(`receta_${receta.id}.pdf`);
};

const [openModal, setOpenModal] = useState(false);
const [selectedMedication, setSelectedMedication] = useState(null);
const ultimaReceta = recetas[0]; // la más reciente si vienen ordenadas
const medicamentos = ultimaReceta?.detalles || [];

  return (
    <div className="treatments-container">

      <Typography variant="h4" className="main-title">
        Mis Tratamientos y Recetas
      </Typography>
      <MedicationDetailModal
       open={openModal}
       onClose={() => setOpenModal(false)}
       medicamento={selectedMedication}
      />
      {/* CARDS SUPERIORES */}
      <div className="treatment-cards">

{medicamentos.map((det, i) => (
  <Card className="treatment-card" key={i}>
    <CardContent>

      <div className="card-header">
        <div>
          <Typography className="medicine-name">
            {det.medicamento?.nombre}
          </Typography>
          <Typography className="medicine-desc">
            {det.medicamento?.presentacion}
          </Typography>
        </div>
        <Chip label="En curso" size="small" className="status-chip" />
      </div>

      <div className="card-info">
        <div className="info-box">
          <Typography className="info-label">
            FRECUENCIA
          </Typography>
          <Typography className="info-value">
            {det.frecuencia}
          </Typography>
        </div>

        <div className="info-box">
          <Typography className="info-label">
            Médico
          </Typography>
          <Typography className="info-value">
            {ultimaReceta?.doctor?.usuario?.nombre}
          </Typography>
          <Typography className="info-sub">
            {ultimaReceta?.doctor?.especialidad?.nombre}
          </Typography>
        </div>
      </div>

      <Button
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
onClick={() => {
  setSelectedMedication({
    nombre: det.medicamento?.nombre,
    dosis: det.dosis,
    presentacion: det.medicamento?.presentacion,
    precio: det.medicamento?.inventario?.precio_venta || "Sin precio",
    via: "Oral",
    duracion: det.duracion,
    descripcion: det.medicamento?.descripcion_general,
    hora_inicio: det.frecuencia, // aquí puedes usar frecuencia
    hora_fin: det.instrucciones, // o instrucciones
    total_tabletas: det.duracion,
    doctor: ultimaReceta?.doctor?.usuario?.nombre,
especialidad: ultimaReceta?.doctor?.especialidad?.nombre
  });

  setOpenModal(true);
}}
      >
        Ver Detalle
      </Button>

    </CardContent>
  </Card>
))}

</div>

      {/* TABLA DE RECETAS */}
      <Paper className="table-container">

        <div className="table-header">
          <span>FECHA</span>
          <span>Receta/Tratamiento</span>
          <span>Medico</span>
          <span>ACCIONES</span>
        </div>

{recetas.map((receta) => (
  <div className="table-row" key={receta.id}>
    
    <div>
  {new Date(receta.creado_en).toLocaleDateString()}
</div>

   <div>
  {receta.detalles.map((d, i) => (
    <span key={i}>
      {d.medicamento?.nombre}
      {i < receta.detalles.length - 1 ? ", " : ""}
    </span>
  ))}
</div>

    <div className="doctor-cell">
      <Avatar className="doctor-avatar" />
      <div>
        <strong>
          {receta.doctor?.usuario?.nombre}
        </strong>
        <p>Médico</p>
      </div>
    </div>

    <Button
      className="pdf-btn"
      onClick={() => downloadPDF(receta)}
    >
      DESCARGAR PDF
    </Button>
  </div>
))}

      </Paper>

      <Typography
        className="history-link"
        onClick={() => navigate("/historial_medico")}
        sx={{ cursor: "pointer" }}
      >
      Ver Historial Completo
      </Typography>

    </div>
  );
}