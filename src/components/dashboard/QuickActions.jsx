import { Grid, Button, Box, Typography } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HistoryIcon from "@mui/icons-material/History";
import { Link } from "react-router-dom";

export default function QuickActions() {
  const actions = [
    {
      label: "Reserva Cita",
      sub: "Nueva consulta presencial",
      icon: <AddCircleOutlineIcon />,
      bg: "#2563eb",
      color: "#fff",
      shadow: "0 12px 30px rgba(37,99,235,0.35)",
      path: "/nueva-cita", //  Ruta correcta
    },
    {
      label: "Ver Prescripciones",
      sub: "Recetas y dosis activas",
      icon: <ReceiptLongIcon />,
      bg: "#ffffff",
      color: "#0f172a",
      border: true,
      path: "/tratamientos", //  Ruta correcta
    },
    {
      label: "Historial Médico",
      sub: "Consultas y diagnósticos",
      icon: <HistoryIcon />,
      bg: "#ffffff",
      color: "#0f172a",
      border: true,
      path: "/historial_medico", //  Ruta correcta
    },
  ];

  return (
    <Grid container spacing={3}>
      {actions.map((a, i) => (
        <Grid item xs={12} md={4} key={i}>
          <Button
            component={Link}
            to={a.path}   //  navegación dinámica
            fullWidth
            sx={{
              height: 96,
              borderRadius: 4,
              background: a.bg,
              color: a.color,
              textTransform: "none",
              justifyContent: "flex-start",
              px: 3,
              boxShadow:
                a.shadow || "0 6px 20px rgba(0,0,0,0.06)",
              border: a.border ? "1px solid #e5e7eb" : "none",
              transition: "all .25s ease",

              "&:hover": {
                transform: "translateY(-5px)",
                background: a.bg,
                boxShadow:
                  a.shadow || "0 20px 40px rgba(0,0,0,0.10)",
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    a.bg === "#ffffff"
                      ? "#f1f5f9"
                      : "rgba(255,255,255,0.15)",
                }}
              >
                {a.icon}
              </Box>

              <Box textAlign="left">
                <Typography fontWeight={800}>
                  {a.label}
                </Typography>
                <Typography fontSize={12} opacity={0.7}>
                  {a.sub}
                </Typography>
              </Box>
            </Box>
          </Button>
        </Grid>
      ))}
    </Grid>
  );
}