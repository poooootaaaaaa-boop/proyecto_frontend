import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Avatar,
  IconButton
} from "@mui/material";
import { saveRegisterData } from "../../utils/registerStorage";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./clinicInfo.css";

export default function ClinicInfo() {
  const [darkMode, setDarkMode] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    sanitary: "",
    address: "",
    type: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleNext = () => {

  saveRegisterData({
    role: "clinica", 
    name: form.name,
    sanitary: form.sanitary,
    address: form.address,
    type: form.type,
    logo: logoPreview
  });

  navigate("/registro/finish");
};

  const isValid =
    form.name &&
    form.sanitary &&
    form.address &&
    form.type;

  return (
    <Box className={`clinic-container ${darkMode ? "dark" : ""}`}>

      {/* Header */}
      <Box className="clinic-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          ClinicaVital
        </Typography>
      </Box>

      {/* Main */}
      <Box className="clinic-main">

        <Box className="clinic-text">
          <Typography variant="h4" className="clinic-title">
            Información de la Clínica / Farmacia
          </Typography>

          <Typography className="clinic-subtitle">
            Por favor, completa los datos de tu establecimiento para finalizar el registro.
          </Typography>
        </Box>

        <Box className="clinic-form">

          {/* Logo Upload */}
          <Box className="logo-upload">
            <Typography className="logo-label">
              Logo de la Empresa (Opcional)
            </Typography>

            <Box className="logo-box">
              {logoPreview ? (
                <Avatar
                  src={logoPreview}
                  className="logo-preview"
                />
              ) : (
                <>
                  <CloudUploadIcon className="upload-icon" />
                  <Typography className="upload-text">
                    Subir logo
                  </Typography>
                </>
              )}

              <input
                type="file"
                accept="image/*"
                className="file-input"
                onChange={handleLogoChange}
              />
            </Box>
          </Box>

          {/* Inputs */}
          <TextField
            label="Nombre del Establecimiento"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Número de Registro Sanitario"
            name="sanitary"
            fullWidth
            value={form.sanitary}
            onChange={handleChange}
          />

          <TextField
            label="Dirección Fiscal"
            name="address"
            fullWidth
            value={form.address}
            onChange={handleChange}
          />

          <TextField
            select
            label="Tipo de Establecimiento"
            name="type"
            fullWidth
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="">Seleccione el tipo</MenuItem>
            <MenuItem value="clinica">Clínica Médica</MenuItem>
            <MenuItem value="farmacia">Farmacia</MenuItem>
            <MenuItem value="laboratorio">Laboratorio</MenuItem>
            <MenuItem value="otro">Otro</MenuItem>
          </TextField>

          <Box className="clinic-button-container">
            <Button
              variant="contained"
              disabled={!isValid}
              className="clinic-button"
              onClick={handleNext}
            >
              Siguiente paso
            </Button>
          </Box>

        </Box>
      </Box>

      {/* Footer */}
      <Box className="clinic-footer">
        <Typography variant="caption">
          © 2024 ClinicaVital. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Dark Mode Toggle */}
      <IconButton
        className="dark-toggle"
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>

    </Box>
  );
}