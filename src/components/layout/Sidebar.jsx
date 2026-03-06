import {
  Button,
  Avatar,
  Typography,
  Box,
  Divider,
  Drawer,
  IconButton,
  useMediaQuery
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import { useLocation } from "react-router-dom";
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
  const [openMenu, setOpenMenu] = useState(false);
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width:900px)");

  const sidebarContent = (

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

      <Box sx={{ flexGrow: 1 }}>

        <Button
  component={Link}
  to="/Dashboard_paciente"
  startIcon={<DashboardIcon />}
  fullWidth
  sx={{
    ...buttonStyle,
    ...(location.pathname === "/Dashboard_paciente" && activeStyle)
  }}
>
  INICIO
</Button>

        <Button
  component={Link}
  to="/citas"
  startIcon={<EventIcon />}
  fullWidth
  sx={{
    ...buttonStyle,
    ...(location.pathname === "/citas" && activeStyle)
  }}
>
  CITAS
</Button>

        <Button
  component={Link}
  to="/historial_medico"
  startIcon={<HistoryIcon />}
  fullWidth
  sx={{
    ...buttonStyle,
    ...(location.pathname === "/historial_medico" && activeStyle)
  }}
>
  HISTORIAL MÉDICO
</Button>

        <Button
  component={Link}
  to="/tratamientos"
  startIcon={<MedicationIcon />}
  fullWidth
  sx={{
    ...buttonStyle,
    ...(location.pathname === "/tratamientos" && activeStyle)
  }}
>
  MEDICAMENTOS
</Button>

      </Box>

      <Divider sx={{ my: 2, backgroundColor: "rgba(255,255,255,0.3)" }} />

      <Box>

       <Button
  component={Link}
  to="/perfil_edit"
  startIcon={<SettingsIcon />}
  fullWidth
  sx={{
    ...buttonStyle,
    ...(location.pathname === "/perfil_edit" && activeStyle)
  }}
>
  CONFIGURACIONES
</Button>

        <Button startIcon={<LogoutIcon />} fullWidth sx={buttonStyle} onClick={() => setOpenLogout(true)}>
          CERRAR SESIÓN
        </Button>

      </Box>

      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
      />

    </Box>
  );

  return (
    <>

      {/* BOTON HAMBURGUESA SOLO MOVIL */}
      {isMobile && (
        <IconButton
          onClick={() => setOpenMenu(true)}
          sx={{
            position: "fixed",
            top: 15,
            left: 15,
            zIndex: 2000,
            background: "#1e3a8a",
            color: "white",
            "&:hover": {
              background: "#1e40af"
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* DESKTOP */}
      {!isMobile && sidebarContent}

      {/* MOVIL */}
      <Drawer
        open={openMenu}
        onClose={() => setOpenMenu(false)}
      >
        {sidebarContent}
      </Drawer>

    </>
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

const activeStyle = {
  backgroundColor: "rgba(255,255,255,0.15)",
  boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
  fontWeight: "bold"
};