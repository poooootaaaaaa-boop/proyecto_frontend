import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  LinearProgress,
  MenuItem
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import "./doctorInfo.css";
import { saveRegisterData,clearRegisterData  } from "../../utils/registerStorage";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorInfo() {
  const [form, setForm] = useState({
    specialty: "",
    license: "",
    experience: "",
    name: "",
    university: ""
  });

  const [especialidades, setEspecialidades] = useState([]);
  const [newSpecialty, setNewSpecialty] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const res = await axios.get(`${API_URL}/especialidades`);
        setEspecialidades(res.data);
      } catch (error) {
        console.error("Error cargando especialidades");
      }
    };

    fetchEspecialidades();
  }, []);

  const handleNext = () => {

    clearRegisterData(); 
saveRegisterData({
  role: "medico",
  name: form.name, //  FALTABA ESTO
  specialty: form.specialty === "otro" ? null : form.specialty,
  specialty_name: form.specialty === "otro" ? newSpecialty : null,
  license: form.license,
  experience: form.experience,
  university: form.university
});

    navigate("/registro/finish");
  };

  const isValid =
    form.specialty !== "" &&
    form.license !== "" &&
    form.experience !== "" &&
    (form.specialty !== "otro" || newSpecialty !== "");

  return (
    <Box className="doctor-container">

      <LinearProgress
        variant="determinate"
        value={50}
        className="progress-bar"
      />

      <Box className="doctor-header">
        <MedicalServicesIcon className="header-icon" />
        <Typography variant="h6" className="header-title">
          ClinicaVital
        </Typography>
      </Box>

      <Box className="doctor-main">

        <Box className="doctor-text">
          <Typography variant="h4" className="doctor-title">
            Información del Doctor
          </Typography>

          <Typography variant="body2" className="doctor-subtitle">
            Por favor completa tus detalles profesionales para validar tu perfil.
          </Typography>
        </Box>

        <Box component="form" className="doctor-form">

          {/*  SELECT */}
          <TextField
            select
            label="Especialidad Médica"
            name="specialty"
            fullWidth
            size="small"
            value={form.specialty}
            onChange={handleChange}
            className="doctor-input"
          >
            <MenuItem value="">Seleccione</MenuItem>

            {especialidades.map((esp) => (
              <MenuItem key={esp.id} value={esp.id}>
                {esp.nombre}
              </MenuItem>
            ))}

            <MenuItem value="otro">Otra (crear nueva)</MenuItem>
          </TextField>

          {/*  INPUT DINÁMICO */}
          {form.specialty === "otro" && (
            <TextField
              label="Nueva especialidad"
              fullWidth
              size="small"
              value={newSpecialty}
              onChange={(e) => setNewSpecialty(e.target.value)}
              className="doctor-input"
            />
          )}

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

          <TextField
            label="Nombre Completo"
            name="name"
            fullWidth
            value={form.name}
            onChange={handleChange}
          />

          <TextField
            label="Universidad"
            name="university"
            fullWidth
            value={form.university}
            onChange={handleChange}
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