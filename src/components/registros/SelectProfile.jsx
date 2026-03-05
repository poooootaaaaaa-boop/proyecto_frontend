import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Radio,
  Button,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import "./selectProfile.css";

export default function SelectProfile() {
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();

  const handleNext = () => {
    if (profile === "doctor") {
      navigate("/registro/doctor");
    } else if (profile === "clinic") {
      navigate("/registro/clinic");
    }
  };

  return (
    <Box className="profile-container">

      {/* Header */}
      <Box className="profile-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          ClinicaVital
        </Typography>
      </Box>

      {/* Main */}
      <Box className="profile-main">

        <Box className="profile-text">
          <Typography variant="h3" className="profile-title">
            Bienvenido a ClinicaVital
          </Typography>

          <Typography variant="body1" className="profile-subtitle">
            Selecciona cómo usarás la plataforma para que podamos personalizar
            las herramientas a tus necesidades específicas.
          </Typography>
        </Box>

        {/* Cards */}
        <Box className="profile-options">

          {/* Doctor */}
          <Card
            className={`profile-card ${profile === "doctor" ? "selected" : ""}`}
            onClick={() => setProfile("doctor")}
          >
            <CardContent className="card-content">
              <Radio
                checked={profile === "doctor"}
                value="doctor"
                sx={{ display: "none" }}
              />

              <Avatar className={`card-avatar ${profile === "doctor" ? "avatar-selected" : ""}`}>
                <MedicalServicesIcon fontSize="large" />
              </Avatar>

              <Typography variant="h5" className="card-title">
                Doctor
              </Typography>

              <Typography variant="body2" className="card-description">
                Soy un profesional de la salud independiente que busca
                gestionar sus pacientes y agenda.
              </Typography>
            </CardContent>
          </Card>

          {/* Clínica */}
          <Card
            className={`profile-card ${profile === "clinic" ? "selected" : ""}`}
            onClick={() => setProfile("clinic")}
          >
            <CardContent className="card-content">
              <Radio
                checked={profile === "clinic"}
                value="clinic"
                sx={{ display: "none" }}
              />

              <Avatar className={`card-avatar ${profile === "clinic" ? "avatar-selected" : ""}`}>
                <LocalHospitalIcon fontSize="large" />
              </Avatar>

              <Typography variant="h5" className="card-title">
                Clínica / Farmacia
              </Typography>

              <Typography variant="body2" className="card-description">
                Represento a una institución médica o farmacia que necesita
                administrar personal e inventario.
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Button */}
        <Box className="profile-button-container">
          <Button
            variant="contained"
            disabled={!profile}
            className="next-button"
            onClick={handleNext}
          >
            Siguiente
          </Button>
        </Box>

      </Box>
    </Box>
  );
}