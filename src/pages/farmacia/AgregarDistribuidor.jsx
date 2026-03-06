import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Modal,
  Alert
} from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

export default function AgregarDistribuidor() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [distribuidor, setDistribuidor] = useState({
    nombre: "",
    rfc: "",
    categoria: "",
    contacto: "",
    correo: "",
    telefono: "",
    direccion: "",
    entrega: "",
    ciudad: "",
    pago: ""
  });

  const handleChange = (e) => {
    setDistribuidor({
      ...distribuidor,
      [e.target.name]: e.target.value
    });

    setError("");
  };

  const cerrarModal = () => setShowModal(false);

  // VALIDAR CAMPOS
  const abrirModal = () => {

    const campos = Object.values(distribuidor);

    const vacio = campos.some((campo) => campo === "");

    if (vacio) {
      setError("Por favor llena todos los campos.");
      return;
    }

    setShowModal(true);
  };

  const guardarDistribuidor = () => {

    const distribuidoresGuardados =
      JSON.parse(localStorage.getItem("distribuidores")) || [];

    distribuidoresGuardados.push(distribuidor);

    localStorage.setItem(
      "distribuidores",
      JSON.stringify(distribuidoresGuardados)
    );

    cerrarModal();

    navigate("/farmacia/Distribuidores");
  };

  return (
    <div style={{ display: "flex", background: "#f7f7f7", minHeight: "100vh" }}>
      <Sidebar />

      <Container fluid className="p-4">
        <Topbar />

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Registrar nuevo distribuidor</h4>
          <Button variant="primary" onClick={abrirModal}>
            Registrar
          </Button>
        </div>

        {/* ALERTA */}
        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        {/* Información empresa */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>

            <h5 className="mb-3">Información de la empresa</h5>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="nombre"
                  value={distribuidor.nombre}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Identificación fiscal</Form.Label>
                <Form.Control
                  name="rfc"
                  value={distribuidor.rfc}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Categoría comercial</Form.Label>
                <Form.Control
                  name="categoria"
                  value={distribuidor.categoria}
                  onChange={handleChange}
                />
              </Col>
            </Row>

          </Card.Body>
        </Card>

        {/* Contacto */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>

            <h5 className="mb-3">Información de contacto</h5>

            <Row>

              <Col md={6} className="mb-3">
                <Form.Label>Persona de contacto</Form.Label>
                <Form.Control
                  name="contacto"
                  value={distribuidor.contacto}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Correo</Form.Label>
                <Form.Control
                  type="email"
                  name="correo"
                  value={distribuidor.correo}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  name="telefono"
                  value={distribuidor.telefono}
                  onChange={handleChange}
                />
              </Col>

            </Row>

          </Card.Body>
        </Card>

        {/* Dirección */}
        <Card className="shadow-sm">
          <Card.Body>

            <h5 className="mb-3">Dirección y logística</h5>

            <Row>

              <Col md={6} className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  name="direccion"
                  value={distribuidor.direccion}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Tiempo de entrega</Form.Label>
                <Form.Control
                  name="entrega"
                  value={distribuidor.entrega}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control
                  name="ciudad"
                  value={distribuidor.ciudad}
                  onChange={handleChange}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Términos de pago</Form.Label>
                <Form.Control
                  name="pago"
                  value={distribuidor.pago}
                  onChange={handleChange}
                />
              </Col>

            </Row>

          </Card.Body>
        </Card>

      </Container>

      {/* MODAL */}
      <Modal show={showModal} onHide={cerrarModal} centered>

        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Desea agregar este distribuidor?
        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={guardarDistribuidor}>
            Sí, agregar
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}