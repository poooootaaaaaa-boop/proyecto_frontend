import { Card, CardContent, Typography, Button, Avatar, Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";

export default function NextAppointmentCard() {

  return (

    <Card sx={{
    borderRadius: 4,
    width: "100%",
    display: "flex",
    flexDirection: "column"
    }}>

      <CardContent sx={{ flexGrow: 1 }}>

        <Typography fontWeight="bold">
          Próxima Cita
        </Typography>

        <Box display="flex" alignItems="center" mt={2}>

          <Avatar sx={{ mr: 2 }} />

          <Box>
            <Typography fontWeight="bold">
              DRA. Elena Vargas
            </Typography>

            <Typography color="text.secondary">
              Medicina General
            </Typography>
          </Box>

        </Box>

        <Box
          mt={2}
          p={2}
          sx={{
            background: "#eef2ff",
            borderRadius: 3
          }}
        >

          <EventIcon />

          <Typography fontWeight="bold">
            24 de Julio, 2026
          </Typography>

          <Typography>
            10:30 AM - Consultorio 402
          </Typography>

        </Box>

        <Button
          fullWidth
          sx={{
            mt: 2,
            background: "#e0e7ff",
            borderRadius: 3
          }}
        >
          Ver Cita
        </Button>

      </CardContent>

    </Card>

  );

}