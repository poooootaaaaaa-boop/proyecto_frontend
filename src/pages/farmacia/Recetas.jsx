import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import {
  Card,
  Table,
  Badge,
  Button,
  Nav,
  Form,
  Col,
  Modal,
} from "react-bootstrap";
import { useState } from "react";
import "./RecetasRecibidas.css";

export default function RecetasRecibidas() {
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    paciente: "",
    hora: "",
    estado: "Normal",
  });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div className="page-wrapper">
          <h4 className="page-title">Recetas Recibidas</h4>

          {/* ===== CARDS RESUMEN ARRIBA ===== */}
          <div className="stats-grid">
            <Card className="stat-card">
              <small>Pendientes hoy</small>
              <h2>12</h2>
            </Card>

            <Card className="stat-card">
              <small>Validadas hoy</small>
              <h2>12</h2>
            </Card>

            <Card className="stat-card">
              <small>Surtidas hoy</small>
              <h2>2</h2>
            </Card>
          </div>

          {/* ===== ACCIONES ===== */}
          <div className="table-actions">
            <div className="left-actions">
              <span className="link-action">Ver receta</span>
            </div>

            <Button className="primary-btn">
              Validar receta
            </Button>
          </div>

          {/* ===== TABLA ===== */}
          <Card className="table-card">
            <h6 className="table-title">Recetas Pendientes</h6>

            <Table responsive borderless className="modern-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Paciente</th>
                  <th>Doctor</th>
                  <th>ID</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td>10:30</td>
                  <td>Juan Pérez</td>
                  <td>Juan Pérez</td>
                  <td>#1023</td>
                  <td>
                    <Badge className="badge-warning">
                      Pendiente
                    </Badge>
                  </td>
                  <td
                    className="actions"
                    onClick={openModal}
                  >
                    ⋮
                  </td>
                </tr>

                <tr>
                  <td>11:15</td>
                  <td>María López</td>
                  <td>Dr. Gómez</td>
                  <td>#1024</td>
                  <td>
                    <Badge className="badge-info">
                      Validando
                    </Badge>
                  </td>
                  <td
                    className="actions"
                    onClick={openModal}
                  >
                    ⋮
                  </td>
                </tr>

                <tr>
                  <td>12:00</td>
                  <td>Carlos Ruiz</td>
                  <td>Dra. Torres</td>
                  <td>#1025</td>
                  <td>
                    <Badge className="badge-success">
                      Listo para surtir
                    </Badge>
                  </td>
                  <td
                    className="actions"
                    onClick={openModal}
                  >
                    ⋮
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>
        </div>
      </div>

      {/* ===== MODAL (NO SE TOCA LÓGICA) ===== */}
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