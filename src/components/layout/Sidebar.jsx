import {
  Button,
  Avatar,
  Typography
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import MedicationIcon from "@mui/icons-material/Medication";
import HistoryIcon from "@mui/icons-material/History";;

import { Link } from "react-router-dom";

export default function Sidebar() {

  return (

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
        Sofia Cardenas
      </Typography>

      <Typography
        align="center"
        mb={3}
        fontSize={14}
      >
        Paciente
      </Typography>

      <Button
        component={Link}
        to="/"
        startIcon={<DashboardIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        INICIO
      </Button>

      <Button
        component={Link}
        to="/citas"
        startIcon={<EventIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        CITAS
      </Button>

      <Button
        component={Link}
        to="/historial_medico"
        startIcon={<HistoryIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        HISTORIAL MÉDICO
      </Button>

      <Button
        component={Link}
        to="/angelito-cachondo"
        startIcon={<MedicationIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        Vistas de carlos 
      </Button>


        <Button
        component={Link}
        to="/tratamientos"
        startIcon={<MedicationIcon />}
        fullWidth
        sx={{ color: "white", justifyContent: "flex-start" }}
      >
        MEDICAMENTOS
      </Button>

    </div>

  );

}