import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getRegisterData } from "../../utils/registerStorage";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import "./finishRegister.css";
import { registerUser } from "../../api/authService";


export default function FinishRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    whatsapp: "",
    password: "",
    terms: false
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const isValid =
    form.email &&
    form.whatsapp &&
    form.password.length >= 8 &&
    form.terms;

const handleCreateAccount = async () => {
  try {
    const registerData = getRegisterData();

    // MAPEO REAL SEGÚN TU BASE DE DATOS
    const roleMap = {
      paciente: 2,
      medico: 3,
      clinica: 4,
      farmacia: 4
    };

const payload = {
  nombre: registerData.name || "Usuario",
  correo: form.email,
  telefono: form.whatsapp,
  password: form.password,
  rol_id: roleMap[registerData.role] || 3,

  nombre_clinica: registerData.name,
  direccion: registerData.address,
  anios_exp: registerData.experience || null,

  especialidad_id: registerData.specialty || null,
  especialidad_nombre: registerData.specialty_name || null, //  AQUI
  cedula_profesional: registerData.license || null,
};

    const response = await registerUser(payload);

    console.log("Registro exitoso", response);

    localStorage.setItem("token", response.token);

    const user = response.usuario;

// redirigir según rol
switch (user.rol_id) {
  case 3:
    navigate("/medicos/dashboard_medicos");
    break;

  case 4:
    navigate("/farmacia/dashboard");
    break;

  default:
    navigate("/dashboard");
}

  } catch (error) {
    console.error(error.response?.data || error.message);
    alert("Error al registrar");
  }
};
  return (
    <Box className="finish-container">

      {/* Barra progreso */}
      <Box className="finish-progress">
        <Box className="progress-bar"></Box>
      </Box>

      {/* Header */}
      <Box className="finish-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography className="header-title">
          ClinicaVital
        </Typography>
      </Box>

      {/* Main */}
      <Box className="finish-main">

        <Box className="finish-text">
          <Typography variant="h4" className="finish-title">
            Datos de Contacto y Seguridad
          </Typography>

          <Typography className="finish-subtitle">
            Último paso para completar tu registro.
          </Typography>
        </Box>

        {/* Form */}
        <Box className="finish-form">

          {/* Email */}
          <TextField
            label="Correo Electrónico Corporativo"
            name="email"
            type="email"
            fullWidth
            value={form.email || ""}
            onChange={handleChange}
            placeholder="tu@clinica.com"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MailOutlineIcon />
                </InputAdornment>
              )
            }}
          />

          {/* WhatsApp */}
          <TextField
            label="WhatsApp de Contacto"
            name="whatsapp"
            type="tel"
            fullWidth
            value={form.whatsapp || ""}
            onChange={handleChange}
            placeholder="9991234567"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <WhatsAppIcon />
                </InputAdornment>
              )
            }}
          />

          {/* Password */}
          <TextField
            label="Contraseña de Seguridad"
            name="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={form.password || ""}
            onChange={handleChange}
            placeholder="••••••••"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Typography className="password-info">
            Mínimo 8 caracteres, incluyendo números y letras.
          </Typography>

          {/* Terms */}
          <FormControlLabel
            control={
              <Checkbox
                name="terms"
                checked={form.terms || false}
                onChange={handleChange}
              />
            }
            label={
              <Typography className="terms-text">
                Acepto términos y condiciones
              </Typography>
            }
          />

          <Typography className="terms-description">
            Al crear una cuenta aceptas nuestros
            <span className="terms-link"> Términos de Servicio </span>
            y
            <span className="terms-link"> Política de Privacidad</span>.
          </Typography>

          {/* Button */}
          <Button
            variant="contained"
            disabled={!isValid}
            className="finish-button"
            endIcon={<ArrowForwardIcon />}
            onClick={handleCreateAccount}
          >
            Crear Cuenta
          </Button>

        </Box>
      </Box>

    </Box>
  );
}