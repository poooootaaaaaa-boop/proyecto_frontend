import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

export default function NextAppointmentCard() {

  // SIMULACIÓN DE RESPUESTA BACKEND (JSON)
  const appointmentData = {
    id: 1,
    doctor: {
      name: "Dra. Elena Vargas",
      specialty: "Medicina General",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    date: "2026-07-24",
    formattedDate: "24 de Julio, 2026",
    time: "10:30 AM",
    location: "Consultorio 402",
    reason: "Revisión general y seguimiento de tratamiento.",
    status: "Confirmada",
  };

  const [open, setOpen] = useState(false);

  return (
    <>
      {/* CARD */}
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
          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight="bold">
              Próxima Cita
            </Typography>
            <EventIcon color="primary" />
          </Box>

          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar src={appointmentData.doctor.avatar} />
            <Box>
              <Typography fontWeight="bold">
                {appointmentData.doctor.name}
              </Typography>
              <Typography color="text.secondary" fontSize={14}>
                {appointmentData.doctor.specialty}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              background: "#eff6ff",
              borderRadius: 3,
              p: 2,
              mb: 2,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <EventIcon fontSize="small" />
              <Typography fontWeight="bold">
                {appointmentData.formattedDate}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1} mt={1}>
              <ScheduleIcon fontSize="small" />
              <Typography fontSize={14}>
                {appointmentData.time} — {appointmentData.location}
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant="contained"
            onClick={() => setOpen(true)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              background: "#2563eb",
              "&:hover": { background: "#1e40af" },
            }}
          >
            Ver Detalle
          </Button>
        </CardContent>
      </Card>

      {/* MODAL */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: "#ffffff",
          },
        }}
      >
        {/* HEADER AZUL */}
        <DialogTitle
          sx={{
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Detalle de la Cita
          <CloseIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setOpen(false)}
          />
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>

          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar
              src={appointmentData.doctor.avatar}
              sx={{ width: 60, height: 60 }}
            />
            <Box>
              <Typography fontWeight="bold" fontSize={18}>
                {appointmentData.doctor.name}
              </Typography>
              <Chip
                label={appointmentData.doctor.specialty}
                size="small"
                sx={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  fontWeight: 600,
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box display="flex" flexDirection="column" gap={2}>

            <Box display="flex" alignItems="center" gap={1}>
              <EventIcon sx={{ color: "#2563eb" }} />
              <Typography fontWeight={600}>
                Fecha:
              </Typography>
              <Typography>
                {appointmentData.formattedDate}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <ScheduleIcon sx={{ color: "#2563eb" }} />
              <Typography fontWeight={600}>
                Hora:
              </Typography>
              <Typography>
                {appointmentData.time}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <LocationOnIcon sx={{ color: "#2563eb" }} />
              <Typography fontWeight={600}>
                Ubicación:
              </Typography>
              <Typography>
                {appointmentData.location}
              </Typography>
            </Box>

            <Box>
              <Typography fontWeight={600} mb={1}>
                Motivo:
              </Typography>
              <Typography color="text.secondary">
                {appointmentData.reason}
              </Typography>
            </Box>

            <Chip
              label={`Estado: ${appointmentData.status}`}
              sx={{
                mt: 2,
                background: "#2563eb",
                color: "white",
                fontWeight: 600,
                width: "fit-content",
              }}
            />

          </Box>

        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            variant="contained"
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 3,
              textTransform: "none",
              background: "#2563eb",
              "&:hover": { background: "#1e40af" },
            }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}