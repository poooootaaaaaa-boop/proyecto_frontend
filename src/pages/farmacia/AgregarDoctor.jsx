import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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