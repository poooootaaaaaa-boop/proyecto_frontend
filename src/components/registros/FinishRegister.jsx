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
const handleCreateAccount = () => {

  // Obtener datos guardados de pasos anteriores
  const registerData = getRegisterData();

  const newUser = {
    email: form.email,
    password: form.password,
    whatsapp: form.whatsapp,
    role: registerData.role,
    ...registerData
  };

  // Obtener usuarios guardados
  const savedUsers =
    JSON.parse(localStorage.getItem("registeredUsers")) || [];

  // Agregar nuevo usuario
  savedUsers.push(newUser);

  // Guardar nuevamente
  localStorage.setItem("registeredUsers", JSON.stringify(savedUsers));

  // limpiar registro temporal
  localStorage.removeItem("registerData");

  // ir al login
  navigate("/login");
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
            value={form.email}
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
            value={form.whatsapp}
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
            value={form.password}
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
                checked={form.terms}
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