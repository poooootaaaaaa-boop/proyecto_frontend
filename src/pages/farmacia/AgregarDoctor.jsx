import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Human from "@vladmandic/human";
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
    setRostroDetectado(false);
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

const detectarRostro = async () => {
  if (!videoRef.current || !humanRef.current) {
    return;
  }

  if (videoRef.current.readyState < 2) {
    setError("Espera a que la cámara esté lista.");
    return;
  }

  try {
    setMensajeRostro("Analizando rostro...");

    const resultado = await humanRef.current.detect(videoRef.current);

    if (!resultado.face || resultado.face.length === 0) {
      setRostroDetectado(false);
      setFaceEmbedding(null);
      setMensajeRostro("No se detectó ningún rostro.");
      return;
    }

    if (resultado.face.length !== 1) {
      setRostroDetectado(false);
      setFaceEmbedding(null);
      setMensajeRostro("Debe aparecer una sola persona en la cámara.");
      return;
    }

    const rostro = resultado.face[0];

    if (!rostro.embedding || rostro.embedding.length === 0) {
      setRostroDetectado(false);
      setFaceEmbedding(null);
      setMensajeRostro("No se pudo obtener la información facial. Intenta de nuevo.");
      return;
    }

    setFaceEmbedding(Array.from(rostro.embedding));
    setRostroDetectado(true);
    setMensajeRostro("Rostro registrado correctamente.");
  } catch (err) {
    console.error("Error detectando rostro:", err);
    setError("Ocurrió un error al analizar el rostro.");
  }
};



















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

          <div className="d-flex justify-content-end gap-3 mt-4">

          

          <Card className="card-modern p-4 mt-3">
              <h6 className="mb-3">Registro facial del doctor</h6>

              <p>
                Registra el rostro del doctor para permitir el acceso mediante
                reconocimiento facial.
              </p>

              {!mostrarCamara && (
                <Button
                  variant="outline-primary"
                  onClick={iniciarCamara}
                >
                  Activar cámara
                </Button>
              )}

              {mostrarCamara && (
                <div className="text-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    style={{
                      width: "100%",
                      maxWidth: "420px",
                      aspectRatio: "4 / 3",
                      objectFit: "cover",
                      transform: "scaleX(-1)",
                      borderRadius: "12px",
                      backgroundColor: "#000",
                    }}
                  />

                  <p className="mt-3">{mensajeRostro}</p>

                  <div className="d-flex justify-content-center gap-2">
                    <Button
                      variant="success"
                      onClick={detectarRostro}
                    >
                      Capturar rostro
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={detenerCamara}
                    >
                      Apagar cámara
                    </Button>
                  </div>
                </div>
              )}

              {rostroDetectado && faceEmbedding && (
                <Alert variant="success" className="mt-3 mb-0">
                  Rostro listo para guardar. Se obtuvo una representación facial
                  de {faceEmbedding.length} valores.
                </Alert>
              )}
            </Card>

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