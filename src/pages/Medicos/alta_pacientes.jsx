import React, { useState } from "react";
import { Link } from "react-router-dom";
import Axios from "axios";

import Layout_Medicos from "./Layout_Medicos";
import Mensaje from "./mensaje";

// Material UI Components & Icons
import { Dialog, DialogContent } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import KeyRoundedIcon from "@mui/icons-material/KeyRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";

import "./AltaPacientes.css";

const API_URL = import.meta.env.VITE_API_URL;

function Alta_pacientes({ data, setData }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const doctor_id = usuario?.doctor_id;

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [apellidoP, setApellidoP] = useState("");
  const [apellidoM, setApellidoM] = useState("");
  const [nacimiento, setNacimiento] = useState("");
  const [genero, setGenero] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [colonia, setColonia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  
  // Opcionales por defecto
  const [tipoSangre, setTipoSangre] = useState("");
  const [alergias, setAlergias] = useState("");
  const [padecimientoHeredofamiliar, setPadecimientoHeredofamiliar] = useState("");
  
  // Estados para manejo de UI
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroresCampos, setErroresCampos] = useState({});

  // Estado Modal Credenciales
  const [modalCredenciales, setModalCredenciales] = useState({
    open: false,
    usuario: "",
    password: "",
  });
  const [copiado, setCopiado] = useState(false);

  // Función para validar campos obligatorios localmente
  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio";
    if (!apellidoP.trim()) nuevosErrores.apellidoP = "El apellido paterno es obligatorio";
    if (!correo.trim()) {
      nuevosErrores.correo = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(correo)) {
      nuevosErrores.correo = "Formato de correo inválido";
    }

    setErroresCampos(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const finalizar = () => {
    // 1. Validar requeridos antes de hacer la petición
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    // 2. Armar el objeto garantizando que opcionales no rompan si están vacíos
    const altaPaciente = {
      doctor_id: doctor_id || null,
      nombre: nombre.trim(),
      apellidoP: apellidoP.trim(),
      apellidoM: apellidoM.trim() || null,
      nacimiento: nacimiento || null,
      genero: genero || null,
      telefono: telefono ? String(telefono) : null,
      correo: correo.trim(),
      direccion: direccion || null,
      colonia: colonia || null,
      ciudad: ciudad || null,
      estado: estado || null,
      codigoPostal: codigoPostal ? String(codigoPostal) : null,
      // Opcionales:
      tipoSangre: tipoSangre || null,
      alergias: alergias.trim() || null,
      padecimientoHeredofamiliar: padecimientoHeredofamiliar.trim() || null,
    };

    if (typeof setData === "function") {
      setData((prev) => [...prev, altaPaciente]);
    }

    Axios.post(`${API_URL}/AltaPaciente`, altaPaciente)
      .then((response) => {
        setModalCredenciales({
          open: true,
          usuario: response.data.usuario,
          password: response.data.password,
        });

        // Limpieza de campos tras guardar con éxito
        setNombre("");
        setApellidoP("");
        setApellidoM("");
        setNacimiento("");
        setGenero("");
        setTelefono("");
        setCorreo("");
        setDireccion("");
        setColonia("");
        setCiudad("");
        setEstado("");
        setCodigoPostal("");
        setTipoSangre("");
        setAlergias("");
        setPadecimientoHeredofamiliar("");
        setErroresCampos({});
      })
      .catch((error) => {
        console.error("Error guardando en backend:", error);

        if (error.response && error.response.status === 422) {
          const backendErrors = error.response.data.errors;
          const mapaErrores = {};

          // Convertir errores de Laravel a nuestro estado local
          for (let campo in backendErrors) {
            mapaErrores[campo] = backendErrors[campo][0];
          }
          setErroresCampos(mapaErrores);
        } else {
          alert("Ocurrió un error en el servidor. Intente más tarde.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const copiarCredenciales = () => {
    const texto = `Correo: ${modalCredenciales.usuario}\nContraseña: ${modalCredenciales.password}`;
    navigator.clipboard.writeText(texto);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  const cerrarModal = () => {
    setModalCredenciales({ open: false, usuario: "", password: "" });
    setMostrarMensaje(true);
  };

  return (
    <Layout_Medicos>
      {mostrarMensaje ? (
        <Mensaje
          titulo="¡Paciente Registrado!"
          descripcion="El paciente fue agregado correctamente al expediente."
          botonPrincipal="Volver a la Lista"
          onPrincipal="/Medicos/lista_paciente"
        />
      ) : (
        <div className="alta-pacientes-wrapper">
          <header className="alta-header-card">
            <div>
              <div className="header-badge">
                <PersonAddAlt1RoundedIcon fontSize="small" />
                <span>Gestión de Expedientes</span>
              </div>
              <h1 className="header-title">Alta de Nuevo Paciente</h1>
              <p className="header-subtitle">
                Complete la información para crear el expediente. Los campos marcados con <span className="required-star">*</span> son obligatorios.
              </p>
            </div>
            <Link to="/Medicos/lista_paciente" className="btn-back-link">
              <ArrowBackRoundedIcon />
              <span>Regresar</span>
            </Link>
          </header>

          <div className="alta-form-container">
            {/* Sección 1: Información Personal */}
            <div className="glass-card">
              <div className="card-section-title">
                <PersonIcon className="section-icon" />
                <div>
                  <h3>Información Personal</h3>
                  <p>Datos de identificación del paciente</p>
                </div>
              </div>

              <div className="form-grid-3col">
                <div className="field-group">
                  <label className="custom-input-label">
                    Nombre(s) <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`custom-input ${erroresCampos.nombre ? "input-error" : ""}`}
                    placeholder="Ej. Juan Carlos"
                    value={nombre}
                    onChange={(e) => {
                      setNombre(e.target.value);
                      if (erroresCampos.nombre) setErroresCampos({ ...erroresCampos, nombre: null });
                    }}
                  />
                  {erroresCampos.nombre && <span className="error-text">{erroresCampos.nombre}</span>}
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Apellido Paterno <span className="required-star">*</span>
                  </label>
                  <input
                    type="text"
                    className={`custom-input ${erroresCampos.apellidoP ? "input-error" : ""}`}
                    placeholder="Ej. Pérez"
                    value={apellidoP}
                    onChange={(e) => {
                      setApellidoP(e.target.value);
                      if (erroresCampos.apellidoP) setErroresCampos({ ...erroresCampos, apellidoP: null });
                    }}
                  />
                  {erroresCampos.apellidoP && <span className="error-text">{erroresCampos.apellidoP}</span>}
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Apellido Materno <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ej. Gómez"
                    value={apellidoM}
                    onChange={(e) => setApellidoM(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-2col mt-3">
                <div className="field-group">
                  <label className="custom-input-label">
                    Fecha de Nacimiento <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="date"
                    className="custom-input"
                    value={nacimiento}
                    onChange={(e) => setNacimiento(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Género <span className="optional-tag">(Opcional)</span>
                  </label>
                  <select
                    className="custom-select"
                    value={genero}
                    onChange={(e) => setGenero(e.target.value)}
                  >
                    <option value="">Seleccionar género</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección 2: Contacto */}
            <div className="glass-card">
              <div className="card-section-title">
                <ContactPhoneIcon className="section-icon" />
                <div>
                  <h3>Información de Contacto y Dirección</h3>
                  <p>Ubicación y comunicación del paciente</p>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="field-group">
                  <label className="custom-input-label">
                    Teléfono <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="Ej. 5512345678"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Correo Electrónico <span className="required-star">*</span>
                  </label>
                  <input
                    type="email"
                    className={`custom-input ${erroresCampos.correo ? "input-error" : ""}`}
                    placeholder="paciente@ejemplo.com"
                    value={correo}
                    onChange={(e) => {
                      setCorreo(e.target.value);
                      if (erroresCampos.correo) setErroresCampos({ ...erroresCampos, correo: null });
                    }}
                  />
                  {erroresCampos.correo && <span className="error-text">{erroresCampos.correo}</span>}
                </div>
              </div>

              <div className="form-grid-2col mt-3">
                <div className="field-group">
                  <label className="custom-input-label">
                    Calle y Número <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ej. Av. Reforma #123"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Colonia <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ej. Del Valle"
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-grid-3col mt-3">
                <div className="field-group">
                  <label className="custom-input-label">
                    Ciudad <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ej. Ciudad de México"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Estado <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ej. CDMX"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  />
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Código Postal <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="number"
                    className="custom-input"
                    placeholder="Ej. 03100"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Sección 3: Antecedentes (TODOS OPCIONALES) */}
            <div className="glass-card">
              <div className="card-section-title">
                <MedicalInformationIcon className="section-icon" />
                <div>
                  <h3>Historial Médico Inicial</h3>
                  <p>Información médica preventiva (Opcional)</p>
                </div>
              </div>

              <div className="form-grid-2col">
                <div className="field-group">
                  <label className="custom-input-label">
                    Tipo de Sangre <span className="optional-tag">(Opcional)</span>
                  </label>
                  <select
                    className="custom-select"
                    value={tipoSangre}
                    onChange={(e) => setTipoSangre(e.target.value)}
                  >
                    <option value="">Sin especificar</option>
                    <option value="O+">O Rh Positivo (O+)</option>
                    <option value="O-">O Rh Negativo (O-)</option>
                    <option value="A+">A Rh Positivo (A+)</option>
                    <option value="A-">A Rh Negativo (A-)</option>
                    <option value="B+">B Rh Positivo (B+)</option>
                    <option value="B-">B Rh Negativo (B-)</option>
                    <option value="AB+">AB Rh Positivo (AB+)</option>
                    <option value="AB-">AB Rh Negativo (AB-)</option>
                  </select>
                </div>

                <div className="field-group">
                  <label className="custom-input-label">
                    Padecimientos Heredofamiliares <span className="optional-tag">(Opcional)</span>
                  </label>
                  <input
                    type="text"
                    className="custom-input"
                    placeholder="Ninguno o especifique (ej. Diabetes)"
                    value={padecimientoHeredofamiliar}
                    onChange={(e) => setPadecimientoHeredofamiliar(e.target.value)}
                  />
                </div>
              </div>

              <div className="field-group mt-3">
                <label className="custom-input-label">
                  Alergias Conocidas <span className="optional-tag">(Opcional)</span>
                </label>
                <textarea
                  rows={3}
                  className="custom-textarea"
                  placeholder="Ninguna o especifique (ej. Penicilina, Polvo...)"
                  value={alergias}
                  onChange={(e) => setAlergias(e.target.value)}
                />
              </div>
            </div>

            {/* Panel de Botones */}
            <div className="action-panel">
              <Link to="/Medicos/lista_paciente" className="btn-cancel">
                Cancelar
              </Link>
              <button
                type="button"
                className="btn-submit"
                onClick={finalizar}
                disabled={loading}
              >
                <CheckCircleRoundedIcon fontSize="small" />
                <span>{loading ? "Guardando..." : "Finalizar Registro"}</span>
              </button>
            </div>
          </div>

          {/* Modal Credenciales */}
          <Dialog
            open={modalCredenciales.open}
            onClose={cerrarModal}
            PaperProps={{
              style: {
                borderRadius: "20px",
                padding: "8px",
                maxWidth: "420px",
                width: "100%",
              },
            }}
          >
            <DialogContent>
              <div className="credentials-modal-content">
                <div className="modal-icon-badge">
                  <CheckCircleRoundedIcon fontSize="large" color="primary" />
                </div>

                <h3 className="modal-title">¡Paciente Creado!</h3>
                <p className="modal-description">
                  Proporcione estas credenciales al paciente para que acceda a su portal.
                </p>

                <div className="credentials-box">
                  <div className="cred-row">
                    <EmailRoundedIcon className="cred-icon" />
                    <div className="cred-info">
                      <span className="cred-label">Correo / Usuario</span>
                      <strong className="cred-value">{modalCredenciales.usuario}</strong>
                    </div>
                  </div>

                  <div className="cred-divider" />

                  <div className="cred-row">
                    <KeyRoundedIcon className="cred-icon" />
                    <div className="cred-info">
                      <span className="cred-label">Contraseña Temporal</span>
                      <strong className="cred-value">{modalCredenciales.password}</strong>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className={`btn-copy ${copiado ? "copied" : ""}`}
                  onClick={copiarCredenciales}
                >
                  <ContentCopyRoundedIcon fontSize="small" />
                  <span>{copiado ? "¡Copiado al Portapapeles!" : "Copiar Credenciales"}</span>
                </button>

                <button
                  type="button"
                  className="btn-accept-modal"
                  onClick={cerrarModal}
                >
                  Aceptar y Continuar
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Layout_Medicos>
  );
}

export default Alta_pacientes;