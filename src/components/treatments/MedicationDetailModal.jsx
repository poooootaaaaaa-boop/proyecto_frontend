import { Dialog, DialogContent, Typography, Box, Chip, Divider, Avatar, Tabs, Tab, Fade, IconButton} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MedicationIcon from "@mui/icons-material/Medication";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PersonIcon from "@mui/icons-material/Person";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import InfoIcon from "@mui/icons-material/Info";

import { useState } from "react";
import "./modalDetalleMedicamento.css";

export default function MedicationDetailModal({
  open,
  onClose,
  medicamento
}) {
  const [tabActiva, setTabActiva] = useState(0);

  if (!medicamento) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      transitionDuration={400}
      PaperProps={{
        className: "modal-detalle-medicamento"
      }}
    >
      <DialogContent>

        {/* HEADER PREMIUM */}
        <Box className="header-modal-detalle">
          <Box>
            <Typography className="titulo-modal-detalle">
              {medicamento.nombre}
            </Typography>
            <Typography className="subtitulo-modal-detalle">
              {medicamento.dosis}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" gap={2}>
            <Chip label="Tratamiento Activo" color="success" />
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* TABS */}
        <Tabs
          value={tabActiva}
          onChange={(e, newValue) => setTabActiva(newValue)}
          className="tabs-modal-detalle"
          centered
        >
          <Tab icon={<InfoIcon />} label="Información" />
          <Tab icon={<ScheduleIcon />} label="Horarios" />
          <Tab icon={<PersonIcon />} label="Doctor" />
        </Tabs>

        {/* CONTENIDO */}

        {tabActiva === 0 && (
          <Box className="contenido-tab-modal">

            <Box className="grid-detalle-modal">

              <Box className="card-info-modal">
                <MedicationIcon className="icono-modal" />
                <Typography className="label-modal">
                  Presentación
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.presentacion}
                </Typography>
              </Box>

              <Box className="card-info-modal">
                <AttachMoneyIcon className="icono-modal" />
                <Typography className="label-modal">
                  Precio en Farmacia
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.precio}
                </Typography>
              </Box>

              <Box className="card-info-modal">
                <LocalPharmacyIcon className="icono-modal" />
                <Typography className="label-modal">
                  Vía de Administración
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.via}
                </Typography>
              </Box>

            </Box>

            <Box className="descripcion-modal">
              <Typography className="label-modal">
                ¿Para qué sirve?
              </Typography>
              <Typography className="texto-descripcion-modal">
                {medicamento.descripcion}
              </Typography>
            </Box>

          </Box>
        )}

        {tabActiva === 1 && (
          <Box className="contenido-tab-modal">

            <Box className="grid-detalle-modal">

              <Box className="card-info-modal">
                <ScheduleIcon className="icono-modal" />
                <Typography className="label-modal">
                  Horario
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.hora_inicio} - {medicamento.hora_fin}
                </Typography>
              </Box>

              <Box className="card-info-modal">
                <MedicationIcon className="icono-modal" />
                <Typography className="label-modal">
                  Total de Tabletas
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.total_tabletas}
                </Typography>
              </Box>

              <Box className="card-info-modal">
                <InfoIcon className="icono-modal" />
                <Typography className="label-modal">
                  Duración
                </Typography>
                <Typography className="valor-modal">
                  {medicamento.duracion}
                </Typography>
              </Box>

            </Box>

          </Box>
        )}

        {tabActiva === 2 && (
          <Box className="contenido-tab-modal doctor-tab-modal">

            <Avatar className="avatar-doctor-modal" />

            <Typography className="nombre-doctor-modal">
              {medicamento.doctor}
            </Typography>

            <Typography className="especialidad-doctor-modal">
              {medicamento.especialidad}
            </Typography>

          </Box>
        )}

      </DialogContent>
    </Dialog>
  );
}