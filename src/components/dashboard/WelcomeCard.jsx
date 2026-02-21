import { Card, CardContent, Typography, Button } from "@mui/material";

export default function WelcomeCard() {

  return (

    <Card sx={{
      borderRadius: 4,
      padding: 2,
      background: "#f8fafc"
    }}>

      <CardContent>

        <Typography variant="h4" fontWeight="bold">
          Bienvenida de nuevo, Sofia
        </Typography>

        <Typography color="text.secondary" mt={1}>
          Tu bienestar es nuestra prioridad. Aquí tienes un resumen de tu estado de salud actual.
        </Typography>

        <Button
          variant="contained"
          sx={{
            mt: 3,
            background: "#3b82f6",
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold"
          }}
        >
          Seguro Activo
        </Button>

      </CardContent>

    </Card>

  );

}