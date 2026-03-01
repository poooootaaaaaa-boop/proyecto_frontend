import { Card, CardContent, Typography, Button, Box } from "@mui/material";

export default function WelcomeCard() {
  return (
    <Card
      sx={{
        borderRadius: 6,
        p: { xs: 2, md: 3 },
        background:
          "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
        border: "1px solid #dbeafe",
        boxShadow: "0 10px 30px rgba(37,99,235,0.08)",
        position: "relative",
        overflow: "hidden",

        "&::after": {
          content: '""',
          position: "absolute",
          right: -40,
          bottom: -40,
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "rgba(37,99,235,0.08)",
        },
      }}
    >
      <CardContent sx={{ position: "relative", zIndex: 1 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          gutterBottom
          sx={{ fontSize: { xs: 24, md: 30 } }}
        >
          Bienvenida de nuevo, Sofia
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ maxWidth: 620 }}
        >
          Tu bienestar es nuestra prioridad. Aquí tienes un resumen
          actualizado de tu estado de salud y próximas actividades.
        </Typography>

        <Box mt={3}>
          <Button
            variant="contained"
            sx={{
              background: "#2563eb",
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 700,
              px: 3,
              boxShadow: "0 6px 16px rgba(37,99,235,0.35)",
              "&:hover": {
                background: "#1d4ed8",
              },
            }}
          >
            ● Seguro Activo
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}