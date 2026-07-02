import {
  Button,
  Avatar,
  Typography
} from "@mui/material";
import axios from "axios";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import LogoutModal from "../../components/farmacia/LogoutModal";
//import "./Layout.css";

import { Nav, Offcanvas } from "react-bootstrap";
import { useState, useEffect  } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

const API_URL = import.meta.env.VITE_API_URL;

function Layout_Medicos({ children }) {

  const [openLogout, setOpenLogout] = useState(false);
  const [show, setShow] = useState(false);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [usuario, setUsuario] = useState(null);
  const [foto, setFoto] = useState(null);

useEffect(() => {
  const userStorage = localStorage.getItem("usuario");

  if (userStorage) {
    const user = JSON.parse(userStorage);
    setUsuario(user);

 if (user.foto_url) {
  setFoto(`${API_URL}/storage/fotos/usuarios/${user.foto_url}`);
}
  }
}, []);

useEffect(() => {
  const userStorage = localStorage.getItem("usuario");

  if (userStorage) {
    setUsuario(JSON.parse(userStorage));
  }
}, []);
const buttonStyle = {
  color: "white",
  justifyContent: "flex-start",
  textTransform: "none",
  borderRadius: "10px",
  padding: "10px 15px",
  fontWeight: 500,
  "&:hover": {
    backgroundColor: "rgba(255,255,255,0.15)"
  }
};

const sidebarContent = (
  <div
    style={{
      width: "250px",
      background: "linear-gradient(180deg, #1e3a8a, #162c73)",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "25px 20px",
      minHeight: "100vh"
    }}
  >

    {/* HEADER */}
    <div
      style={{
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "30px",
        display: "flex",
        alignItems: "center",
        gap: "10px"
      }}
    >
       Panel Médico
    </div>

    {/* USUARIO */}
    <div style={{ textAlign: "center", marginBottom: "25px" }}>
      <Avatar
        src={foto || ""}
        sx={{
          width: 70,
          height: 70,
          margin: "0 auto",
          border: "3px solid white"
        }}
      >
        {!foto && usuario?.nombre?.charAt(0)}
      </Avatar>

      <Typography mt={1} fontWeight="bold">
        {usuario ? `Dr. ${usuario.nombre}` : "Doctor"}
      </Typography>
    </div>

    {/* MENU */}
    <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>

      <Button
        component={Link}
        to="/Medicos/Dashboard_medicos"
        startIcon={<DashboardIcon />}
        sx={buttonStyle}
        fullWidth
      >
        DASHBOARD
      </Button>

      <Button
        component={Link}
        to="/Medicos/lista_paciente"
        startIcon={<PersonIcon />}
        sx={buttonStyle}
        fullWidth
      >
        PACIENTES
      </Button>

      <Button
        component={Link}
        to="/Medicos/recetas_medicas"
        startIcon={<DescriptionIcon />}
        sx={buttonStyle}
        fullWidth
      >
        RECETAS MEDICAS
      </Button>

      <Button
        component={Link}
        to="/Medicos/agendar-cita"
        startIcon={<CalendarTodayIcon />}
        sx={buttonStyle}
        fullWidth
      >
        CITAS
      </Button>

      <Button
        component={Link}
        to="/Medicos/tratamientos_largos"
        startIcon={<ContentPasteIcon />}
        sx={buttonStyle}
        fullWidth
      >
        TRATAMIENTOS
      </Button>

    </div>

    {/* FOOTER ABAJO */}
    <div style={{ marginTop: "auto" }}>

      <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

      <Button
        onClick={() => setOpenLogout(true)}
        sx={{
          ...buttonStyle,
          color: "#ffdddd"
        }}
        fullWidth
      >
        CERRAR SESIÓN
      </Button>

    </div>

    <LogoutModal
      open={openLogout}
      handleClose={() => setOpenLogout(false)}
    />

  </div>
);

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>

      {/* BOTON HAMBURGUESA */}
      {isMobile && (
<button
  onClick={() => setShow(!show)}
  style={{
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: 2000,
    background: "#1f3fa3",
    border: "none",
    color: "white",
    padding: "10px 12px",
    borderRadius: "8px",
    cursor: "pointer"
  }}
>
  ☰
</button>
      )}

      {/* SIDEBAR DESKTOP */}
      {!isMobile && sidebarContent}

      {/* SIDEBAR MOVIL */}
      <Offcanvas show={show} onHide={handleClose}  backdrop={false}>
        <Offcanvas.Body
          style={{
            background: "#1f3fa3",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            padding: "25px 20px",
          }}
        >
          {sidebarContent}
        </Offcanvas.Body>
      </Offcanvas>

      <div style={{ flex: 1, padding: "20px", background: "#fefcf9" }}>
        {children}
      </div>

    </div>
  );
}

export default Layout_Medicos;