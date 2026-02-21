import { Grid, Button } from "@mui/material";

export default function QuickActions() {

  return (

    <Grid container spacing={3}>

      <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 70,
            borderRadius: 4,
            background: "#2563eb"
          }}
        >
          Reserva Cita
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 70,
            borderRadius: 4,
            background: "#2563eb"
          }}
        >
          Ver Prescripciones
        </Button>
      </Grid>

      <Grid item xs={12} md={4}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            height: 70,
            borderRadius: 4,
            background: "#2563eb"
          }}
        >
          Historial Médico
        </Button>
      </Grid>

    </Grid>

  );

}