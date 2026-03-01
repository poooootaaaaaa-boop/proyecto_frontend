import {
  Button,
  Avatar,
  Typography,
  Box,
  Divider
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";
import HistoryIcon from "@mui/icons-material/History";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

import { Link } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {

  const [openLogout, setOpenLogout] = useState(false);

  return (

    <Box
      sx={{
        width: 250,
        
        background: "linear-gradient(180deg, #1e3a8a 0%, #1e3a8a 100%)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: 3
      }}
    >

      {/* Avatar y nombre */}
      <Box textAlign="center">
        <Avatar
          sx={{
            width: 80,
            height: 80,
            margin: "0 auto",
            border: "3px solid white"
          }}
        />
        <Typography mt={2} fontWeight="bold">
          Sofia Cardenas
        </Typography>
        <Typography fontSize={14} color="rgba(255,255,255,0.7)">
          Paciente
        </Typography>
      </Box>

      <Divider sx={{ my: 3, backgroundColor: "rgba(255,255,255,0.3)" }} />

      {/* Menú principal */}
      <Box sx={{ flexGrow: 1 }}>

        <Button
          component={Link}
          to="/"
          startIcon={<DashboardIcon />}
          fullWidth
          sx={buttonStyle}
        >
          INICIO
        </Button>

        <Button
          component={Link}
          to="/citas"
          startIcon={<EventIcon />}
          fullWidth
          sx={buttonStyle}
        >
          CITAS
        </Button>

        <Button
          component={Link}
          to="/historial_medico"
          startIcon={<HistoryIcon />}
          fullWidth
          sx={buttonStyle}
        >
          HISTORIAL MÉDICO
        </Button>

        <Button
          component={Link}
          to="/tratamientos"
          startIcon={<MedicationIcon />}
          fullWidth
          sx={buttonStyle}
        >
          MEDICAMENTOS
        </Button>

      </Box>

      <Divider sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.3)" }} />

      {/* Parte inferior */}
      <Box>

        <Button
          component={Link}
          to="/perfil_edit"
          startIcon={<SettingsIcon />}
          fullWidth
          sx={buttonStyle}
        >
          CONFIGURACIONES
        </Button>

        <Button
          startIcon={<LogoutIcon />}
          fullWidth
          sx={buttonStyle}
          onClick={() => setOpenLogout(true)}
        >
          CERRAR SESIÓN
        </Button>

      </Box>

      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
      />

    </Box>
  );
}

const buttonStyle = {
  color: "white",
  justifyContent: "flex-start",
  mb: 1,
  textTransform: "none",
  fontWeight: 500,
  borderRadius: 2,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)"
  }
};