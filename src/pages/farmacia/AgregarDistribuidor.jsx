import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button
} from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

export default function AgregarDistribuidor() {
  return (
    <div style={{ display: "flex", background: "#f7f7f7", minHeight: "100vh" }}>
      <Sidebar />

      <Container fluid className="p-4">
        <Topbar />

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>Registrar nuevo distribuidor</h4>
          <Button variant="primary">Registrar</Button>
        </div>

        {/* Información de la empresa */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Información de la empresa</h5>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control placeholder="Nombre del distribuidor" />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Identificación fiscal</Form.Label>
                <Form.Control placeholder="RFC / ID fiscal" />
              </Col>

              <Col md={6}>
                <Form.Label>Categoría comercial</Form.Label>
                <Form.Control placeholder="Mayorista / Minorista" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Información de contacto */}
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Información de contacto</h5>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Persona de contacto principal</Form.Label>
                <Form.Control placeholder="Nombre completo" />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" placeholder="correo@empresa.com" />
              </Col>

              <Col md={6}>
                <Form.Label>Teléfono</Form.Label>
                <Form.Control placeholder="999 999 9999" />
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Dirección y logística */}
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Dirección y logística</h5>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control placeholder="Calle, número, colonia" />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Tiempo de entrega</Form.Label>
                <Form.Control placeholder="Ej. 24 - 48 horas" />
              </Col>

              <Col md={6} className="mb-3">
                <Form.Label>Ciudad</Form.Label>
                <Form.Control placeholder="Ciudad" />
              </Col>

              <Col md={6}>
                <Form.Label>Términos de pago</Form.Label>
                <Form.Control placeholder="Contado / Crédito" />
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}