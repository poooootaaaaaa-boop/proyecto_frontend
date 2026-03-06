import {
  Button,
  Avatar,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";
import PersonIcon from '@mui/icons-material/Person';
import DescriptionIcon from '@mui/icons-material/Description';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import LogoutModal from "../../components/farmacia/LogoutModal";
import "./Layout.css";
import { Nav, Offcanvas } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useState } from "react";


import { Link } from "react-router-dom";


function Layout_Medicos({ children }) {
    const [openLogout, setOpenLogout] = useState(false);
    const [show, setShow] = useState(false);

const linkStyle = ({ isActive }) => ({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  color: "#fff",
  padding: "10px 15px",
  borderRadius: "10px",
  textDecoration: "none",
  background: isActive ? "rgba(255,255,255,0.15)" : "transparent",
  fontWeight: isActive ? "600" : "400",
  transition: "0.2s",
});
  return (
     <div style={{ display: "flex", minHeight: "100vh" }}>
      <div className="sidebar">
        
      <Avatar
        sx={{
      width: 70,
      height: 70,
      margin: "0 auto",
      border: "3px solid white"
        }}
      />

      <Typography
        align="center"
        mt={2}
        fontWeight="bold"
      >
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

      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />



    <div style={{ marginTop: "auto" }}>
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
        }}
      >
        <i className="bi bi-box-arrow-right"></i>
        Cerrar sesión
      </Nav.Link>
    </div>

      <LogoutModal
            open={openLogout}
            handleClose={() => setOpenLogout(false)}
          />


      </div>




        <div style={{ flex: 1, padding: "20px", background:"#fefcf9" }}>
            {children}
        </div>

      </div>
    
  )
}

export default Layout_Medicos