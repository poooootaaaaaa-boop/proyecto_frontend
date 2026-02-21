import { Card, CardContent, Typography, Box } from "@mui/material";

export default function AlertsCard() {

  return (

    <Card sx={{
    borderRadius: 4,
    width: "100%",
    display: "flex",
    flexDirection: "column"
    }}>

      <CardContent sx={{ flexGrow: 1 }}>

        <Typography fontWeight="bold">
          Alertas Recientes
        </Typography>

        <Box mt={2} p={2}
          sx={{ background: "#fde2d1", borderRadius: 3 }}>

          <Typography fontWeight="bold">
            Mensaje de DRA. Vargas
          </Typography>

          <Typography>
            Hola, Sofi he revisado tus análisis...
          </Typography>

        </Box>

        <Box mt={2} p={2}
          sx={{ background: "#dbeafe", borderRadius: 3 }}>

          <Typography fontWeight="bold">
            Resultado disponibles
          </Typography>

          <Typography>
            Tu perfil lipídico está listo
          </Typography>

        </Box>

      </CardContent>

    </Card>

  );

}