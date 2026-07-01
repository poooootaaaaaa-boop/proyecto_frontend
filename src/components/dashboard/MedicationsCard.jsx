import { Card, CardContent, Typography, Box, Chip } from "@mui/material";
import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

function MedItem({ name, dose, time, bg }) {
  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 3,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all .25s ease",

        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
        },
      }}
    >
      {/* IZQUIERDA */}
      <Box>
        <Typography fontWeight={700} fontSize={15}>
          {name}
        </Typography>

        <Typography
          fontSize={13}
          sx={{ color: "#64748b", mt: 0.5 }}
        >
          {dose}
        </Typography>
      </Box>

      {/* DERECHA */}
      <Chip
        label={time}
        size="small"
        sx={{
          background: "#e0edff",
          color: "#2563eb",
          fontWeight: 600,
          borderRadius: "999px",
          px: 1,
        }}
      />
    </Box>
  );
}

export default function MedicationsCard() {
  const [medicamentos, setMedicamentos] = useState([]);

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    if (!usuario) return;

    const fetchData = async () => {
      try {
        const res = await fetch(
          `${API_URL}/consulta/paciente/${usuario.paciente_id}/ultima`
        );

        const data = await res.json();

        if (!data || !data.receta) return;

        const meds = data.receta.detalles.map(det => ({
          name: det.medicamento?.nombre,
          dose: `${det.dosis} — ${det.frecuencia}`,
          time: det.instrucciones || "Sin indicación",
          bg: "#eef2ff"
        }));

        setMedicamentos(meds);

      } catch (error) {
        console.error("Error cargando medicamentos:", error);
      }
    };

    fetchData();
  }, []);

  return (
<Card
  sx={{
    borderRadius: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
    border: "1px solid #eef2f7",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
    },
  }}
>
  <CardContent sx={{ flexGrow: 1 }}>
    
    {/* HEADER */}
    <Box display="flex" justifyContent="space-between" mb={2}>
      <Typography fontWeight={700} fontSize={16}>
        Medicamentos Activos
      </Typography>

      <Chip
        label={medicamentos.length}
        size="small"
        sx={{
          background: "#eef2ff",
          color: "#4f46e5",
          fontWeight: 600,
        }}
      />
    </Box>

    {/* LISTA */}
    <Box display="flex" flexDirection="column" gap={2}>
      {medicamentos.length === 0 ? (
        <Typography color="text.secondary">
          No hay medicamentos activos
        </Typography>
      ) : (
        medicamentos.map((med, i) => (
          <MedItem
            key={i}
            name={med.name}
            dose={med.dose}
            time={med.time}
          />
        ))
      )}
    </Box>
  </CardContent>
</Card>
  );
}