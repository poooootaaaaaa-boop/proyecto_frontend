import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AgregarDoctor() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [doctor, setDoctor] = useState({
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

  const cerrarModal = () => setShowModal(false);

  // VALIDAR CAMPOS
  const abrirModal = () => {

    if (
      !doctor.especialidad_id ||
      !doctor.cedula_profesional ||
      !doctor.anios_exp ||
      !doctor.telefono
    ) {
      setError("Por favor llena todos los campos.");
      return;
    }

    setShowModal(true);
  };

  // GUARDAR DOCTOR
  const guardarDoctor = async () => {

    setLoading(true);

    try {

      const response = await axios.post(
        "http://127.0.0.1:8000/api/doctores",
        {
          especialidad_id: parseInt(doctor.especialidad_id),
          cedula_profesional: doctor.cedula_profesional,
          anios_exp: parseInt(doctor.anios_exp),
          telefono: doctor.telefono,
        }
      );

      console.log("Doctor guardado:", response.data);

      cerrarModal();
      navigate("/farmacia/doctores");

    } catch (err) {

      console.log(err);

      if (err.response) {
        setError(err.response.data.message || "Error del servidor");
      } else {
        setError("No se pudo conectar con el servidor");
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

                </Row>

              </Card>

            </Col>

            <Col md={4}>

              <Card className="card-modern d-flex justify-content-center align-items-center">

                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    border: "2px dashed #ccc",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Foto Doctor
                </div>

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