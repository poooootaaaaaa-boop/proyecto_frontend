import {
  Button,
  Avatar,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';

import LogoutModal from "../../components/farmacia/LogoutModal";
import "./Layout.css";

import { Nav, Offcanvas } from "react-bootstrap";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMediaQuery } from "@mui/material";

function Layout_Medicos({ children }) {

  const [openLogout, setOpenLogout] = useState(false);
  const [show, setShow] = useState(false);

  const isMobile = useMediaQuery("(max-width:900px)");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sidebarContent = (
    <div className="sidebar">

      <Avatar
        sx={{
          width: 70,
          height: 70,
          margin: "0 auto",
          border: "3px solid white"
        }}
      />

      <Typography align="center" mt={2} fontWeight="bold">
        Dr. Juan perez
      </Typography>

      <div style={{ height: "30px" }}></div>

      <Button
        component={Link}
        to="/Medicos/Dashboard_medicos"
        startIcon={<DashboardIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        DASHBOARD
      </Button>

      <Button
        component={Link}
        to="/Medicos/lista_paciente"
        startIcon={<PersonIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        PACIENTES
      </Button>

      <Button
        component={Link}
        to="/Medicos/recetas_medicas"
        startIcon={<DescriptionIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        RECETAS MEDICAS
      </Button>

      <Button
        component={Link}
        to="/Medicos/agendar-cita"
        startIcon={<CalendarTodayIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        CITAS
      </Button>

      <Button
        component={Link}
        to="/Medicos/tratamientos_largos"
        startIcon={<ContentPasteIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        TRATAMIENTOS
      </Button>

      <div style={{ marginTop: "auto", }}>
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        <Nav.Link
          onClick={() => setOpenLogout(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "#ffdddd",
            padding: "10px 15px",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "20px" 
           
          }}
        >
          Cerrar sesión
        </Nav.Link>
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