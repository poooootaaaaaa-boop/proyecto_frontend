import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import "./doctorInfo.css";
import { saveRegisterData } from "../../utils/registerStorage";

export default function DoctorInfo() {
  const [form, setForm] = useState({
    specialty: "",
    license: "",
    experience: ""
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };
const handleNext = () => {

  saveRegisterData({
    role: "medico",
    specialty: form.specialty,
    license: form.license,
    experience: form.experience
  });

  navigate("/registro/finish");
};
  const isValid =
    form.specialty !== "" &&
    form.license !== "" &&
    form.experience !== "";

  return (
    <Box className="doctor-container">

      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={50}
        className="progress-bar"
      />

      {/* Header */}
      <Box className="doctor-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          ClinicaVital
        </Typography>
      </Box>

      {/* Main */}
      <Box className="doctor-main">

        <Box className="doctor-text">
          <Typography variant="h4" className="doctor-title">
            Información del Doctor
          </Typography>

          <Typography variant="body2" className="doctor-subtitle">
            Por favor completa tus detalles profesionales para validar tu perfil.
          </Typography>
        </Box>

        <Box component="form" className="doctor-form" >

          <TextField
            label="Especialidad Médica"
            name="specialty"
            fullWidth
            size="small"
            value={form.specialty}
            onChange={handleChange}
            className="doctor-input"
          />

          <TextField
            label="Número de Licencia Profesional"
            name="license"
            fullWidth
            size="small"
            value={form.license}
            onChange={handleChange}
            className="doctor-input"
          />

          <TextField
            label="Años de Experiencia"
            name="experience"
            type="number"
            fullWidth
            size="small"
            value={form.experience}
            onChange={handleChange}
            inputProps={{ min: 0 }}
            className="doctor-input"
          />

          <Box className="doctor-button-container">
            <Button
              variant="contained"
              disabled={!isValid}
              className="doctor-button"
              onClick={handleNext}
            >
              Siguiente paso
            </Button>
          </Box>

        </Box>
      </Box>
    </Box>
  );
}