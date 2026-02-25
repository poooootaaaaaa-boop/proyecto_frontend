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
import "./Layout.css";

import { Link } from "react-router-dom";


function Layout_Medicos({ children }) {
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
        ANGELITO CACHONDO
      </Typography>

      <Typography
        align="center"
        mb={3}
        fontSize={14}
      >
        Paciente
      </Typography>

        <div style={{ height: "30px" }}></div>



        <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<DashboardIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        DASHBOARD
      </Button>


        <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<PersonIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        PACIENTES
      </Button>


        <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<DescriptionIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        RECETAS MEDICAS
      </Button>



        <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<CalendarTodayIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        CITAS
      </Button>




        <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<ContentPasteIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        TRATAMIENTOS
      </Button>


      </div>




        <div style={{ flex: 1, padding: "20px", background: "#ffffff" }}>
            {children}
        </div>

      </div>
    
  )
}

export default Layout_Medicos