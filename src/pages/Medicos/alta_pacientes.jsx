import React, { useState, useEffect, useRef } from "react";
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
import Human from "@vladmandic/human";
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

      // Estados para el registro facial
    const [mostrarCamara, setMostrarCamara] = useState(false);
    const [rostroDetectado, setRostroDetectado] = useState(false);
    const [rostroRegistrado, setRostroRegistrado] = useState(false);
    const [mensajeRostro, setMensajeRostro] = useState("");
    const [estadoFaceId, setEstadoFaceId] = useState(null);

    // Referencias para la cámara y Human
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const humanRef = useRef(null);
    const embeddingRef = useRef(null);
    const guardandoRef = useRef(false);










    useEffect(() => {
  const inicializarHuman = async () => {
    try {
      const config = {
        backend: "webgl",
        modelBasePath:
          "https://vladmandic.github.io/human-models/models/",

        face: {
          enabled: true,
          detector: {
            rotation: true,
            return: true,
          },
          mesh: { enabled: true },
          description: { enabled: true },
          iris: { enabled: false },
          emotion: { enabled: false },
          age: { enabled: false },
          gender: { enabled: false },
          antispoof: { enabled: true },
          liveness: { enabled: true },
        },

        body: { enabled: false },
        hand: { enabled: false },
        object: { enabled: false },
        gesture: { enabled: false },
        segmentation: { enabled: false },
      };

      const human = new Human(config);

      humanRef.current = human;

      await human.load();
      await human.warmup();

      console.log("Human cargado en alta de pacientes");
    } catch (error) {
      console.error("Error cargando Human:", error);
    }
  };

  inicializarHuman();

  return () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };
}, []);


// Abrir cámara frontal
const abrirCamara = async () => {
  try {
    setMensajeRostro("Coloca el rostro frente a la cámara.");
    setRostroDetectado(false);
    guardandoRef.current = false;
    setEstadoFaceId(null);

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user" },
      audio: false,
    });

    streamRef.current = stream;
    setMostrarCamara(true);
  } catch (error) {
    console.error("Error accediendo a la cámara:", error);
    setMensajeRostro(
      "No se pudo acceder a la cámara. Verifica los permisos."
    );
  }
};

// Re-capturar rostro por si salió mal
const recapturarRostro = () => {
  embeddingRef.current = null;
  guardandoRef.current = false;
  setRostroDetectado(false);
  setRostroRegistrado(false);
  setEstadoFaceId(null);
  setMensajeRostro("Coloca el rostro frente a la cámara.");
};

// Detectar rostro y generar embedding automáticamente
const detectarRostroPaciente = async () => {
  const human = humanRef.current;
  const video = videoRef.current;

  if (
    !human ||
    !video ||
    video.readyState < 2 ||
    guardandoRef.current
  ) {
    return;
  }

  try {
    const resultado = await human.detect(video);

    if (resultado.face && resultado.face.length > 0) {
      const rostro = resultado.face[0];

      if (rostro.embedding) {
        guardandoRef.current = true;
        embeddingRef.current = Array.from(rostro.embedding);

        setRostroDetectado(true);
        setRostroRegistrado(true);
        setMensajeRostro("Rostro guardado correctamente.");

        // Animación Face ID idéntica al login
        setEstadoFaceId("loading");
        await new Promise((r) => setTimeout(r, 400));
        setEstadoFaceId("success");

        await new Promise((r) => setTimeout(r, 1600));
        setEstadoFaceId(null);
      } else {
        setRostroDetectado(false);
        setMensajeRostro(
          "No se pudo generar el registro facial. Intenta nuevamente."
        );
      }
    } else {
      if (!guardandoRef.current) {
        setRostroDetectado(false);
        setMensajeRostro("Coloca el rostro frente a la cámara.");
      }
    }
  } catch (error) {
    console.error("Error detectando rostro:", error);
    setMensajeRostro("Ocurrió un error al detectar el rostro.");
  }
};

// Confirmar registro facial
const confirmarRostro = () => {
  if (!embeddingRef.current || !rostroDetectado) {
    setMensajeRostro("Primero coloca tu rostro frente a la cámara.");
    return;
  }

  setRostroRegistrado(true);
  setMensajeRostro("Rostro registrado correctamente.");

  cerrarCamara();
};

// Cerrar cámara y detener el video
const cerrarCamara = () => {
  guardandoRef.current = false;
  setEstadoFaceId(null);
  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  setMostrarCamara(false);
  setRostroDetectado(false);
};

// Detectar automáticamente mientras la cámara esté abierta
useEffect(() => {
  if (!mostrarCamara || guardandoRef.current) return;

  const intervalo = setInterval(() => {
    detectarRostroPaciente();
  }, 700);

  return () => clearInterval(intervalo);
}, [mostrarCamara, rostroRegistrado]);











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

      face_embedding: embeddingRef.current
    ? JSON.stringify(embeddingRef.current)
    : null,
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

            {/* Sección de registro facial */}
<div className="glass-card">
  <div className="card-section-title">
    <PersonIcon className="section-icon" />
    <div>
      <h3>Reconocimiento Facial</h3>
      <p>Registrar el rostro del paciente para acceso biométrico</p>
    </div>
  </div>

  <button
    type="button"
    className="btn-submit"
    onClick={abrirCamara}
  >
    {rostroRegistrado ? "Actualizar rostro" : "Registrar rostro"}
  </button>

  {rostroRegistrado && (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "12px", background: "rgba(34, 197, 94, 0.1)", border: "1px solid rgba(34, 197, 94, 0.3)", padding: "8px 14px", borderRadius: "10px", color: "#166534", fontSize: "13px", fontWeight: "600" }}>
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none">
        <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="2" fill="none" />
        <path d="M6 10 L9 13 L14 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Rostro guardado correctamente
    </div>
  )}

  {mensajeRostro && !mostrarCamara && !rostroRegistrado && (
    <p style={{ marginTop: "10px", color: "#64748b", fontSize: "13px" }}>{mensajeRostro}</p>
  )}
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
          {/* Modal de reconocimiento facial */}
          {/* Modal de reconocimiento facial biométrico */}
<Dialog
  open={mostrarCamara}
  onClose={cerrarCamara}
  PaperProps={{
    style: {
      borderRadius: "24px",
      padding: "24px",
      maxWidth: "480px",
      width: "100%",
      backgroundColor: "#ffffff",
      boxShadow: "0 25px 60px -15px rgba(0, 0, 0, 0.25)",
      overflow: "hidden",
    },
  }}
>
  <div className="biometric-modal-header">
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div className="biometric-card-icon">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 3 7 V 5 A 2 2 0 0 1 5 3 H 7" />
          <path d="M 17 3 H 19 A 2 2 0 0 1 21 5 V 7" />
          <path d="M 21 17 V 19 A 2 2 0 0 1 19 21 H 17" />
          <path d="M 7 21 H 5 A 2 2 0 0 1 3 19 V 17" />
          <circle cx="9" cy="10" r="1" fill="#2563eb" />
          <circle cx="15" cy="10" r="1" fill="#2563eb" />
          <path d="M 9.5 15 C 10.5 16.2 13.5 16.2 14.5 15" />
        </svg>
      </div>
      <div>
        <h3 className="biometric-modal-title">Registrar rostro del paciente</h3>
        <p className="biometric-modal-subtitle">Centra el rostro del paciente dentro del visor</p>
      </div>
    </div>
    <button
      type="button"
      className="biometric-modal-close"
      onClick={cerrarCamara}
      disabled={!!estadoFaceId}
      title="Cerrar"
    >
      ✕
    </button>
  </div>

  <div className="biometric-camera-wrapper text-center">
    <div className={`camera-viewfinder-reg ${rostroDetectado ? "is-detected" : ""}`}>
      <video
        ref={(elemento) => {
          videoRef.current = elemento;
          if (elemento && streamRef.current) {
            elemento.srcObject = streamRef.current;
          }
        }}
        autoPlay
        muted
        playsInline
        className="camera-video-reg"
      />

      {estadoFaceId && (
        <div className="faceid-overlay">
          <div className="faceid-card">
            {estadoFaceId === "loading" && (
              <>
                <div className="faceid-icon-container">
                  <div className="faceid-pulse-ring"></div>
                  <div className="faceid-scanner-laser"></div>
                  <svg viewBox="0 0 100 100" className="faceid-svg">
                    <path d="M 22 36 V 26 A 12 12 0 0 1 34 14 H 44" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M 56 14 H 66 A 12 12 0 0 1 78 26 V 36" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M 78 64 V 74 A 12 12 0 0 1 66 86 H 56" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M 44 86 H 34 A 12 12 0 0 1 22 74 V 64" fill="none" stroke="#30d158" strokeWidth="5.5" strokeLinecap="round" />
                    <circle cx="37" cy="42" r="4.5" fill="#30d158" />
                    <circle cx="63" cy="42" r="4.5" fill="#30d158" />
                    <path d="M 50 42 V 55 A 4 4 0 0 1 46 59 H 45" fill="none" stroke="#30d158" strokeWidth="4.5" strokeLinecap="round" />
                    <path d="M 37 68 Q 50 78 63 68" fill="none" stroke="#30d158" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                </div>
                <h3 className="faceid-title">Face ID</h3>
                <p className="faceid-subtitle">Guardando rostro...</p>
                <div className="faceid-bar-loader">
                  <div className="faceid-bar-fill"></div>
                </div>
              </>
            )}

            {estadoFaceId === "success" && (
              <>
                <div className="faceid-success-circle">
                  <svg viewBox="0 0 60 60" className="faceid-check-svg">
                    <path
                      d="M 16 31 L 26 41 L 44 20"
                      fill="none"
                      stroke="#30d158"
                      strokeWidth="5.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="faceid-check-path"
                    />
                  </svg>
                </div>
                <h3 className="faceid-title">Face ID</h3>
                <p className="faceid-subtitle" style={{ color: "#30d158", fontWeight: "600", marginTop: "4px" }}>
                  Rostro guardado
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <div className="viewfinder-hud-reg">
        <div className={`viewfinder-badge-reg ${rostroDetectado ? "detected" : "searching"}`}>
          <span className={`badge-dot-reg ${rostroDetectado ? "green" : "pulse"}`}></span>
          {rostroDetectado ? "Rostro detectado" : "Buscando rostro..."}
        </div>
      </div>

      <div className="viewfinder-target-reg">
        <span className="target-corner-reg tl"></span>
        <span className="target-corner-reg tr"></span>
        <span className="target-corner-reg bl"></span>
        <span className="target-corner-reg br"></span>
      </div>
    </div>

    <p className="camera-status-msg-reg">
      {mensajeRostro || (rostroDetectado ? "✓ Rostro detectado y enfocado" : "Coloca el rostro frente a la cámara")}
    </p>

    <div className="camera-controls-reg">
      {rostroRegistrado && (
        <button
          type="button"
          className="btn-recapture-face"
          onClick={recapturarRostro}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 1 4 v 6 h 6" />
            <path d="M 3.51 15 a 9 9 0 1 0 2.13 -9.36 L 1 10" />
          </svg>
          Volver a capturar
        </button>
      )}

      <button
        type="button"
        className="btn-stop-camera"
        onClick={cerrarCamara}
        disabled={!!estadoFaceId}
      >
        {rostroRegistrado ? "Listo / Cerrar cámara" : "Cerrar cámara"}
      </button>
    </div>
  </div>
</Dialog>
        </div>
      )}
    </Layout_Medicos>
  );
}

export default Alta_pacientes;