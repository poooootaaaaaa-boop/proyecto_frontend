import { Card, CardContent, Typography, Box, Chip } from "@mui/material";

function MedItem({ name, dose, time, bg }) {
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        background: bg,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography fontWeight="bold">{name}</Typography>
        <Typography fontSize={13} color="text.secondary">
          {dose}
        </Typography>
      </Box>

      <Chip label={time} size="small" />
    </Box>
  );
}

export default function MedicationsCard() {
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
          Medicamentos Activos
        </Typography>

        <Box display="flex" flexDirection="column" gap={2}>
          <MedItem
            name="Vitamina D3"
            dose="2000 UI — Diaria"
            time="8:00 AM"
            bg="#fff7ed"
          />
          <MedItem
            name="Magnesio"
            dose="400mg — Diaria"
            time="9:30 PM"
            bg="#eef2ff"
          />
        </Box>
      </CardContent>
    </Card>
  );
}