import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AgregarDoctor() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [doctor, setDoctor] = useState({
    name: "",
    role: "",
    specialty: "",
    license: "",
    email: "",
    status: "",
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

    const campos = Object.values(doctor);

    const vacio = campos.some((campo) => campo === "");

    if (vacio) {
      setError("Por favor llena todos los campos.");
      return;
    }

    setShowModal(true);
  };

  const guardarDoctor = () => {

    const doctorsGuardados =
      JSON.parse(localStorage.getItem("doctors")) || [];

    doctorsGuardados.push(doctor);

    localStorage.setItem(
      "doctors",
      JSON.stringify(doctorsGuardados)
    );

    cerrarModal();

    navigate("/farmacia/doctores");
  };

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        <div style={{ padding: "30px" }}>

          <h2 className="main-title">Agregar nuevo doctor</h2>

          {/* ALERTA */}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <Row className="g-4">

            {/* COLUMNA IZQUIERDA */}
            <Col md={8}>

              <Card className="card-modern p-4 mb-3">

                <h6 className="mb-3">Información del Doctor</h6>

                <Row className="g-3">

                  <Col md={6}>
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      name="name"
                      onChange={handleChange}
                      placeholder="Ej. Dr. Juan Pérez"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Rol</Form.Label>
                    <Form.Control
                      name="role"
                      onChange={handleChange}
                      placeholder="Ej. Medicina General"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Especialidad</Form.Label>
                    <Form.Control
                      name="specialty"
                      onChange={handleChange}
                      placeholder="Ej. Cardiólogo"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Número de licencia</Form.Label>
                    <Form.Control
                      name="license"
                      onChange={handleChange}
                      placeholder="MLN-00000"
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      name="email"
                      type="email"
                      onChange={handleChange}
                      placeholder="doctor@email.com"
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Estado</Form.Label>
                    <Form.Select
                      name="status"
                      onChange={handleChange}
                    >
                      <option value="">Selecciona...</option>
                      <option>Activo</option>
                      <option>Inactivo</option>
                    </Form.Select>
                  </Col>

                </Row>

              </Card>

            </Col>

            {/* COLUMNA DERECHA */}
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

          {/* BOTONES */}
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

      {/* MODAL */}
      <Modal show={showModal} onHide={cerrarModal} centered>

        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Quieres agregar este doctor al sistema?
        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={cerrarModal}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={guardarDoctor}
          >
            Sí, agregar
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}