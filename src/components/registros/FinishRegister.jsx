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
import { useLocation } from "react-router-dom";
import "./finishRegister.css";
import "./modal-styles.css";
import { registerUser } from "../../api/authService";

// Texto de Términos y Condiciones (puedes moverlo a un archivo aparte si crece mucho)
const TERMINOS_TEXTO = `
TÉRMINOS Y CONDICIONES DE USO
Última actualización: [Fecha]

1. IDENTIFICACIÓN DEL PROVEEDOR
Nombre: Equipo desarrollador de la plataforma
Correo: contacto@tuclinica.com

2. OBJETO DEL SERVICIO
La plataforma ofrece herramientas para la gestión de clínicas, médicos, pacientes y farmacias,
incluyendo agenda digital, expedientes clínicos, recetas electrónicas y facturación.

3. REGISTRO Y USO DE CUENTA
- El usuario debe proporcionar información veraz, completa y actualizada.
- El usuario es responsable de su cuenta y contraseña.
- Prohibido compartir cuentas.

4. PLANES, PRECIOS Y PAGOS
- Los pagos son mensuales con renovación automática.
- No se realizan reembolsos por meses no utilizados.

5. USO PROHIBIDO
- Acceder a datos de otros usuarios sin autorización.
- Utilizar la plataforma para fines fraudulentos o ilegales.
- Falsificar recetas electrónicas.

6. PROPIEDAD INTELECTUAL
- El código, diseño, logotipo y marca son propiedad de la plataforma.
- El usuario es dueño de la información que ingresa.

7. PRIVACIDAD Y DATOS PERSONALES
- El tratamiento de datos se realiza conforme al Aviso de Privacidad.
- Se cumple con la LFPDPPP.
- El usuario puede ejercer Derechos ARCO en: privacidad@tuclinica.com

8. LIMITACIÓN DE RESPONSABILIDAD
- La plataforma no es responsable por daños indirectos.
- No es responsable por la práctica médica de los médicos registrados.

9. JURISDICCIÓN APLICABLE
- Los términos se rigen por las leyes de los Estados Unidos Mexicanos.
- Controversias se someten a los tribunales de la Ciudad de México.

Contacto: contacto@tuclinica.com
`;

// Componente Modal para mostrar documentos completos (igual al usado en Registro.jsx)
const ModalDocumento = ({ isOpen, onClose, title, content, onAccept }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <pre>{content}</pre>
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Cerrar</button>
          {onAccept && (
            <button className="modal-accept" onClick={onAccept}>
              Aceptar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function FinishRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const logoFile = location.state?.logo;

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

  const handleOpenTerms = (e) => {
    e.preventDefault();
    setShowTerms(true);
  };

  const handleAcceptTerms = () => {
    setForm({ ...form, terms: true });
    setShowTerms(false);
  };

  const isValid =
    form.email &&
    form.whatsapp &&
    form.password.length >= 8 &&
    form.terms;

  const handleCreateAccount = async () => {
    if (!form.terms) {
      alert("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    try {
      const registerData = getRegisterData();

      // MAPEO REAL SEGÚN TU BASE DE DATOS
      const roleMap = {
        paciente: 2,
        medico: 3,
        clinica: 4,
        farmacia: 4
      };

      const formData = new FormData();

      // BASE (TODOS LOS USUARIOS)
      formData.append("nombre", registerData.name || "Usuario");
      formData.append("correo", form.email);
      formData.append("telefono", form.whatsapp);
      formData.append("password", form.password);
      formData.append("rol_id", roleMap[registerData.role] || 3);

      // LOGO (SI EXISTE)
      if (logoFile instanceof File) {
        formData.append("foto", logoFile);
      }

      // 👨‍⚕️ DOCTOR (ROL 3)
      if (roleMap[registerData.role] === 3) {
        if (registerData.specialty) {
          formData.append("especialidad_id", registerData.specialty);
        }
        if (registerData.specialty_name) {
          formData.append("especialidad_nombre", registerData.specialty_name);
        }
        if (registerData.license) {
          formData.append("cedula_profesional", registerData.license);
        }
        if (registerData.experience) {
          formData.append("anios_exp", registerData.experience);
        }
      }

      // 🏥 CLINICA / FARMACIA (ROL 4)
      if (roleMap[registerData.role] === 4) {
        formData.append("nombre_clinica", registerData.name || "");
        formData.append("direccion", registerData.address || "");

        if (registerData.city) {
          formData.append("ciudad", registerData.city);
        }
        if (registerData.state) {
          formData.append("estado", registerData.state);
        }
        if (registerData.country) {
          formData.append("pais", registerData.country);
        }
      }

      const response = await registerUser(formData);

      console.log("Registro exitoso", response);

      localStorage.setItem("token", response.token);

      const user = response.usuario;
      // localStorage.setItem("usuario_id", user.id);

      // redirigir según rol
      const rol = roleMap[registerData.role];

      switch (rol) {
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
        <Typography className="header-title">ClinicaVital</Typography>
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
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          <Typography className="password-info">
            Mínimo 8 caracteres, incluyendo números y letras.
          </Typography>

          {/* Terms - checkbox + link para abrir el modal */}
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
                Acepto los términos y condiciones
              </Typography>
            }
          />

          <Typography className="terms-description">
            Al crear una cuenta aceptas nuestros{" "}
            <span
              className="terms-link"
              role="button"
              tabIndex={0}
              onClick={handleOpenTerms}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Términos y Condiciones
            </span>{" "}
            y la Política de Privacidad.
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

      {/* MODAL DE TÉRMINOS Y CONDICIONES */}
      <ModalDocumento
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        title="Términos y Condiciones"
        content={TERMINOS_TEXTO}
        onAccept={handleAcceptTerms}
      />
    </Box>
  );
}
