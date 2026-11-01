import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Human from "@vladmandic/human";
import "./AgregarDoctor.css";
const API_URL = import.meta.env.VITE_API_URL;
export default function AgregarDoctor() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const [imagen, setImagen] = useState(null);
const [preview, setPreview] = useState(null);
const [doctor, setDoctor] = useState({
  nombre: "",
  correo: "",
  password: "",
  especialidad_id: "",
  cedula_profesional: "",
  anios_exp: "",
  telefono: "",
});

// Registro facial
const [mostrarCamara, setMostrarCamara] = useState(false);
const [rostroDetectado, setRostroDetectado] = useState(false);
const [mensajeRostro, setMensajeRostro] = useState(
  "Coloca tu rostro frente a la cámara"
);
const [faceEmbedding, setFaceEmbedding] = useState(null);
const [estadoFaceId, setEstadoFaceId] = useState(null);

const videoRef = useRef(null);
const streamRef = useRef(null);
const humanRef = useRef(null);
const deteccionActivaRef = useRef(false);


useEffect(() => {
  const human = new Human({
    modelBasePath: "https://vladmandic.github.io/human-models/models/",
    face: {
      enabled: true,
      detector: { enabled: true },
      mesh: { enabled: true },
      description: { enabled: true },
      antispoof: { enabled: true },
      liveness: { enabled: true },
    },
    body: { enabled: false },
    hand: { enabled: false },
    object: { enabled: false },
  });

  humanRef.current = human;

  human.load()
    .then(() => human.warmup())
    .catch((err) => {
      console.error("Error cargando Human:", err);
      setError("No se pudieron cargar los modelos faciales.");
    });

  return () => {
    detenerCamara();
  };
}, []);

const iniciarCamara = async () => {
  try {
    setError("");
    setFaceEmbedding(null);
    setEstadoFaceId(null);
    setRostroDetectado(false);
    deteccionActivaRef.current = false;
    setMensajeRostro("Coloca tu rostro frente a la cámara");

    if (!humanRef.current) {
      setError("El reconocimiento facial todavía está cargando.");
      return;
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 },
      },
    });

    streamRef.current = stream;
    setMostrarCamara(true);

    // Espera a que React monte el elemento video.
    requestAnimationFrame(() => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
    });
  } catch (err) {
    console.error("Error iniciando cámara:", err);
    setError("No se pudo acceder a la cámara. Revisa los permisos.");
  }
};

const detenerCamara = () => {
  deteccionActivaRef.current = false;
  setEstadoFaceId(null);

  if (streamRef.current) {
    streamRef.current.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  if (videoRef.current) {
    videoRef.current.pause();
    videoRef.current.srcObject = null;
  }

  setMostrarCamara(false);
};

const recapturarRostro = () => {
  setFaceEmbedding(null);
  setRostroDetectado(false);
  setEstadoFaceId(null);
  deteccionActivaRef.current = false;
  setMensajeRostro("Coloca tu rostro frente a la cámara");
};

const detectarRostro = async () => {
  if (!videoRef.current || !humanRef.current || deteccionActivaRef.current || faceEmbedding) {
    return;
  }

  if (videoRef.current.readyState < 2) {
    return;
  }

  try {
    deteccionActivaRef.current = true;
    const resultado = await humanRef.current.detect(videoRef.current);

    if (!resultado.face || resultado.face.length === 0) {
      setRostroDetectado(false);
      setMensajeRostro("Coloca tu rostro frente a la cámara");
      deteccionActivaRef.current = false;
      return;
    }

    if (resultado.face.length !== 1) {
      setRostroDetectado(false);
      setMensajeRostro("Debe aparecer una sola persona en la cámara.");
      deteccionActivaRef.current = false;
      return;
    }

    const rostro = resultado.face[0];

    if (!rostro.embedding || rostro.embedding.length === 0) {
      setRostroDetectado(false);
      setMensajeRostro("Analizando rostro...");
      deteccionActivaRef.current = false;
      return;
    }

    // Rostro detectado: guardar embedding
    const embeddingArr = Array.from(rostro.embedding);
    setFaceEmbedding(embeddingArr);
    setRostroDetectado(true);
    setMensajeRostro("Rostro guardado correctamente.");

    // Animación Face ID con texto 'Rostro guardado'
    setEstadoFaceId("loading");
    await new Promise((r) => setTimeout(r, 400));
    setEstadoFaceId("success");

    await new Promise((r) => setTimeout(r, 1600));
    setEstadoFaceId(null);

  } catch (err) {
    console.error("Error detectando rostro:", err);
    deteccionActivaRef.current = false;
  }
};

useEffect(() => {
  if (!mostrarCamara || faceEmbedding) {
    return;
  }

  const intervalo = setInterval(() => {
    detectarRostro();
  }, 700);

  return () => {
    clearInterval(intervalo);
  };
}, [mostrarCamara, faceEmbedding]);



















  const handleChange = (e) => {
    setDoctor({
      ...doctor,
      [e.target.name]: e.target.value,
    });

    setError("");
  };
  const handleImagen = (e) => {
  const file = e.target.files[0];
  setImagen(file);

  if (file) {
    setPreview(URL.createObjectURL(file));
  }
};

  const cerrarModal = () => setShowModal(false);

  // VALIDAR CAMPOS
  const abrirModal = () => {

 if (
  !doctor.nombre ||
  !doctor.correo ||
  !doctor.password ||
  !doctor.cedula_profesional
) {
  setError("Completa todos los campos obligatorios");
  return;
}

    setShowModal(true);
  };

  // GUARDAR DOCTOR
const guardarDoctor = async () => {

  setLoading(true);

  try {

    const formData = new FormData();

    formData.append("nombre", doctor.nombre);
    formData.append("correo", doctor.correo);
    formData.append("password", doctor.password);
    formData.append("especialidad_id", doctor.especialidad_id);
    formData.append("cedula_profesional", doctor.cedula_profesional);
    formData.append("anios_exp", doctor.anios_exp);
    formData.append("telefono", doctor.telefono);
    if (imagen) {
      formData.append("imagen", imagen);
    }
    if (faceEmbedding) {
        formData.append(
          "face_embedding",
          JSON.stringify(faceEmbedding)
        );
      }

    const response = await axios.post(
      `${API_URL}/doctores`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    cerrarModal();
    detenerCamara();
    navigate("/farmacia/doctores");

  } catch (err) {

    if (err.response) {
      setError(err.response.data.message || "Error");
    } else {
      setError("Error de conexión");
    }

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        <div style={{ padding: "30px" }}>

          <h2 className="main-title">Agregar nuevo doctor</h2>

          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <Row className="g-4">

            <Col md={8}>

              <Card className="card-modern p-4 mb-3">

                <h6 className="mb-3">Información del Doctor</h6>

                <Row className="g-3">

                  <Col md={6}>
                    <Form.Label>Especialidad ID</Form.Label>
                    <Form.Control
                      type="number"
                      name="especialidad_id"
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Cédula Profesional</Form.Label>
                    <Form.Control
                      name="cedula_profesional"
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Años de experiencia</Form.Label>
                    <Form.Control
                      type="number"
                      name="anios_exp"
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Teléfono</Form.Label>
                    <Form.Control
                      name="telefono"
                      onChange={handleChange}
                    />
                  </Col>

                  <Col md={6}>
  <Form.Label>Nombre</Form.Label>
  <Form.Control
    name="nombre"
    onChange={handleChange}
  />
</Col>

<Col md={6}>
  <Form.Label>Correo</Form.Label>
  <Form.Control
    name="correo"
    onChange={handleChange}
  />
</Col>

<Col md={6}>
  <Form.Label>Contraseña</Form.Label>
  <Form.Control
    type="password"
    name="password"
    onChange={handleChange}
  />
</Col>

                </Row>

              </Card>

            </Col>

            <Col md={4}>

<Card className="card-modern d-flex justify-content-center align-items-center">

  <label
    style={{
      width: "140px",
      height: "140px",
      border: "2px dashed #ccc",
      borderRadius: "12px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#aaa",
      cursor: "pointer",
      overflow: "hidden"
    }}
  >
    {preview ? (
      <img
        src={preview}
        alt="preview"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    ) : (
      "Foto Doctor"
    )}

    <input
      type="file"
      accept="image/*"
      onChange={handleImagen}
      style={{ display: "none" }}
    />
  </label>

</Card>

            </Col>

          </Row>

          {/* Card de Registro Facial Biométrico */}
          <Card className="card-modern biometric-register-card p-4 mt-4">
            <div className="biometric-card-header">
              <div className="biometric-card-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#0047cc" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 3 7 V 5 A 2 2 0 0 1 5 3 H 7" />
                  <path d="M 17 3 H 19 A 2 2 0 0 1 21 5 V 7" />
                  <path d="M 21 17 V 19 A 2 2 0 0 1 19 21 H 17" />
                  <path d="M 7 21 H 5 A 2 2 0 0 1 3 19 V 17" />
                  <circle cx="9" cy="10" r="1" fill="#0047cc" />
                  <circle cx="15" cy="10" r="1" fill="#0047cc" />
                  <path d="M 9.5 15 C 10.5 16.2 13.5 16.2 14.5 15" />
                </svg>
              </div>
              <div className="biometric-card-text">
                <h6 className="biometric-card-title">Registro facial del doctor</h6>
                <p className="biometric-card-desc">
                  Registre el rostro del médico para permitir el acceso mediante reconocimiento facial.
                </p>
              </div>
            </div>

            {!mostrarCamara && (
              <div className="biometric-inactive-box">
                <div className="biometric-inactive-icon">
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#0047cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 23 19 A 2 2 0 0 1 21 21 H 3 A 2 2 0 0 1 1 19 V 8 A 2 2 0 0 1 3 6 H 7 L 9 3 H 15 L 17 6 H 21 A 2 2 0 0 1 23 8 Z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </div>
                <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "8px" }}>
                  La cámara se encuentra inactiva
                </p>
                <button
                  type="button"
                  className="btn-activate-camera"
                  onClick={iniciarCamara}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                  Activar cámara
                </button>
              </div>
            )}

            {mostrarCamara && (
              <div className="biometric-camera-wrapper text-center">
                <div className={`camera-viewfinder-reg ${rostroDetectado ? "is-detected" : ""}`}>
                  <video
                    ref={videoRef}
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
                  {mensajeRostro}
                </p>

                <div className="camera-controls-reg">
                  {faceEmbedding && (
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
                    onClick={detenerCamara}
                  >
                    {faceEmbedding ? "Cerrar cámara" : "Apagar cámara"}
                  </button>
                </div>
              </div>
            )}

            {rostroDetectado && faceEmbedding && (
              <div className="biometric-success-alert">
                <svg viewBox="0 0 20 20" width="20" height="20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="2" fill="none" />
                  <path d="M6 10 L9 13 L14 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>
                  <strong>Rostro guardado correctamente.</strong> Representación facial biométrica de {faceEmbedding.length} valores lista.
                </span>
              </div>
            )}
          </Card>

          {/* Botones de acción del formulario */}
          <div className="d-flex justify-content-end gap-3 mt-4 mb-4">
            <Button
              variant="light"
              onClick={() => navigate("/farmacia/doctores")}
            >
              Cancelar
            </Button>

            <Button
              variant="primary"
              onClick={abrirModal}
            >
              Agregar
            </Button>
          </div>

        </div>

      </div>

      <Modal show={showModal} onHide={cerrarModal} centered>

        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Quieres agregar este doctor al sistema?
        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={guardarDoctor}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Sí, agregar"}
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}