import {
 
  Button,
  Form,
  Col,
  Modal,
} from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import "./Inventario.css";

export default function Inventario() {
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
          <div className="inventory-header">
            <div>
              <h2 className="main-title">Inventario</h2>
              <p className="subtitle">Gestión de medicamentos</p>
            </div>

            <Button
              as={NavLink}
              to="/farmacia/AgregarMedicamento"
              className="primary-btn"
            >
              Agregar medicamento
            </Button>
          </div>

          {/* ===== CARDS RESUMEN ===== */}
          <div className="stats-grid">
            <div className="stat-card-modern">
              <small>Total Items</small>
              <h3>1,240</h3>
              <span className="stat-badge success">
                +2.4% último mes
              </span>
            </div>

            <div className="stat-card-modern">
              <small>Low Stock</small>
              <h3>12</h3>
              <span className="stat-badge warning">
                6 pendientes
              </span>
            </div>

            <div className="stat-card-modern">
              <small>Expired</small>
              <h3>2</h3>
              <span className="stat-badge danger">
                Revisión urgente
              </span>
            </div>
          </div>

          <div className="inventory-actions">
            <Button
              as={NavLink}
              to="/farmacia/Distribuidores"
    className="primary-btn"            >
              Ver distribuidores
            </Button>
          </div>

          {/* ===== TABLA MODERNA ===== */}
          <div className="card-modern">
            <h5 className="section-title">
              Lista de Medicamentos
            </h5>

            <div className="table-modern">
              <div className="table-header-modern">
                <span>Medicamento</span>
                <span>Total Stock</span>
                <span>Lote / Caducidad</span>
                <span>Status</span>
                <span></span>
              </div>

              <div className="table-row-modern">
                <div>
                  <strong>Amoxicilina 500mg</strong>
                  <br />
                  <small className="muted">
                    Antibiótico
                  </small>
                </div>

                <div>
                  400 unidades
                  <br />
                  <small className="success-text">
                    Nivel óptimo
                  </small>
                </div>

                <div>Oct 2025</div>

                <div>
                  <span className="status-badge in-stock">
                    In Stock
                  </span>
                </div>

                <div
                  className="row-action"
                  onClick={openModal}
                >
                  ⋮
                </div>
              </div>

              <div className="table-row-modern">
                <div>
                  <strong>Ibuprofeno 600mg</strong>
                  <br />
                  <small className="muted">
                    Analgésico
                  </small>
                </div>

                <div>
                  120 unidades
                  <br />
                  <small className="danger-text">
                    Bajo stock
                  </small>
                </div>

                <div>Nov 2025</div>

                <div>
                  <span className="status-badge low-stock">
                    Low Stock
                  </span>
                </div>

                <div
                  className="row-action"
                  onClick={openModal}
                >
                  ⋮
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MODAL (LÓGICA INTACTA) ===== */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Medicamento
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Nombre y categoría
              </Form.Label>
              <Col md={12}>
                <Form.Control type="text" />
              </Col>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                name="paciente"
                value={formData.paciente}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
              >
                <option value="Urgente">
                  Low Stock
                </option>
                <option value="Normal">
                  In Stock
                </option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={closeModal}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={closeModal}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}