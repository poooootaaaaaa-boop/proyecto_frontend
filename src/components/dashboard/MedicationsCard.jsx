import { Card, CardContent, Typography, Box } from "@mui/material";

export default function MedicationsCard() {

  return (

    <Card sx={{
    borderRadius: 4,
    width: "100%",
    display: "flex",
    flexDirection: "column"
    }}>

      <CardContent sx={{ flexGrow: 1 }}>

        <Typography fontWeight="bold">
          Medicamentos Activos
        </Typography>

        <Box mt={2} p={2}
          sx={{ background: "#fde2d1", borderRadius: 3 }}>
          <Typography fontWeight="bold">
            Vitamina D3
          </Typography>

          <Typography>
            2000 UI - Diaria
          </Typography>
        </Box>

        <Box mt={2} p={2}
          sx={{ background: "#dbeafe", borderRadius: 3 }}>
          <Typography fontWeight="bold">
            Vitamina D3
          </Typography>

          <Typography>
            2000 UI - Diaria
          </Typography>
        </Box>

      </CardContent>

    </Card>

  );

}