import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import {
  Card,
  Table,
  Badge,
  Button,
  Nav,Form,Col
} from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useState } from "react";


export default function RecetasRecibidas() {
   const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    paciente: "",
    hora: "",
    estado: "Normal",
  });
  const openModal = () => {
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
  };
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          {/* ===== HEADER ===== */}
          <h4 className="mb-3">Recetas Recibidas</h4>

          {/* ===== TABS ===== */}
          <Nav variant="tabs" defaultActiveKey="activas" className="mb-4">
            <Nav.Item>
              <Nav.Link eventKey="activas">Recetas activas</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey="historial">Historial</Nav.Link>
            </Nav.Item>
          </Nav>

          {/* ===== ACCIONES ===== */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex gap-3 text-primary">
              <span style={{ cursor:  "pointer" }}> Ver receta</span>
            </div>

            <Button variant="primary">Validar receta</Button>
          </div>

          {/* ===== TABLA ===== */}
          <Card className="p-4 rounded-4 border-0 mb-4">
            <h6 className="mb-3">Recetas Pendientes</h6>

            <Table responsive borderless>
              <thead>
                <tr className="text-muted">
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Doctor</th>
                  <th>ID </th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>10:30</td>
                  <td>Juan Pérez</td>
                  <td>Juan Pérez</td>
                  <td>10:30</td>
                  <td>
                    <Badge bg="warning" text="dark">
                      Pendiente
                    </Badge>
                  </td>
             <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                </tr>

                <tr>
                  <td>10:30</td>
                  <td>Juan Pérez</td>
                  <td>Juan Pérez</td>
                  <td>10:30</td>
                  <td>
                    <Badge bg="info">Validando</Badge>
                  </td>
                <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                </tr>

                <tr>
                  <td>10:30</td>
                  <td>Juan Pérez</td>
                  <td>Juan Pérez</td>
                  <td>10:30</td>
                  <td>
                    <Badge bg="success">Listo para surtir</Badge>
                  </td>
                <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                </tr>

                <tr>
                  <td>10:30</td>
                  <td>Juan Pérez</td>
                  <td>Juan Pérez</td>
                  <td>10:30</td>
                  <td>
                    <Badge bg="warning" text="dark">
                      Pendiente
                    </Badge>
                  </td>
              <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                </tr>
              </tbody>
            </Table>
          </Card>

          {/* ===== RESUMEN ===== */}
          <div className="d-flex gap-3">
            <Card className="p-3 rounded-4 border-0 flex-fill">
              <small className="text-muted">Pendientes hoy</small>
              <h3>12</h3>
            </Card>

            <Card className="p-3 rounded-4 border-0 flex-fill">
              <small className="text-muted">Validadas hoy</small>
              <h3>12</h3>
            </Card>

            <Card className="p-3 rounded-4 border-0 flex-fill">
              <small className="text-muted">Surtidas hoy</small>
              <h3>2</h3>
            </Card>
          </div>
        </div>
      </div>
          <Modal show={showModal} onHide={closeModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Editar receta</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Fecha</Form.Label>
       <Col md={12}>
                    <Form.Control type="date" />
                  </Col>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Paciente</Form.Label>
        <Form.Control
          type="text"
          name="paciente"
          value={formData.paciente}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Doctor</Form.Label>
       <Col md={12}>
                    <Form.Control type="text" />
                  </Col>
      </Form.Group>

      <Form.Group>
        <Form.Label>Estado</Form.Label>
        <Form.Select
          name="estado"
          value={formData.estado}
          onChange={handleChange}
        >
          <option value="Urgente">Pendiente</option>
          <option value="Normal">Listo</option>
        </Form.Select>
      </Form.Group>
    </Form>
  </Modal.Body>

  <Modal.Footer>
    <Button variant="secondary" onClick={closeModal}>
      Cancelar
    </Button>
    <Button variant="primary" onClick={closeModal}>
      Guardar
    </Button>
  </Modal.Footer>
</Modal>
    </div>
  );
}