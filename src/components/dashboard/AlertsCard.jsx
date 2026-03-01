import { Card, CardContent, Typography, Box } from "@mui/material";

function AlertItem({ title, desc, time, color }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        p: 1.5,
        borderRadius: 2,
        "&:hover": { background: "#f8fafc" },
      }}
    >
      <Box
        sx={{
          width: 8,
          height: 8,
          mt: 1,
          borderRadius: "50%",
          background: color,
        }}
      />

      <Box>
        <Typography fontWeight="bold" fontSize={14}>
          {title}
        </Typography>
        <Typography fontSize={12} color="text.secondary">
          {desc}
        </Typography>
        <Typography fontSize={10} color="text.disabled">
          {time}
        </Typography>
      </Box>
    </Box>
  );
}

export default function AlertsCard() {
  return (
    <Card
  sx={{
    borderRadius: 4,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
    border: "1px solid #eef2f7",
    transition: "all .25s ease",

    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 16px 40px rgba(0,0,0,0.10)",
    },
  }}
>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography fontWeight="bold" mb={2}>
          Alertas Recientes
        </Typography>

        <AlertItem
          title="Mensaje de DRA. Vargas"
          desc="Hola Sofi, he revisado tus últimos análisis..."
          time="Hace 2 horas"
          color="#3b82f6"
        />

        <AlertItem
          title="Resultado disponible"
          desc="Tu perfil lipídico ya está listo"
          time="Ayer 04:15 PM"
          color="#10b981"
        />
      </CardContent>
    </Card>
  );
}