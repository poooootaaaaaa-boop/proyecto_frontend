import { Card, Table, Badge,Button, Form, Col } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { NavLink } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { useState } from "react";


export default function Inventario() {
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
          <h4 className="mb-4">Inventario</h4>
      <div
            className="d-flex justify-content-between align-items-center mb-4"
          >
            <h4>Medicamentos</h4>

            <Button
              as={NavLink}
              to="/farmacia/AgregarMedicamento"
              variant="primary"
            >
              Agregar medicamento
            </Button>
          </div>
         
          {/* ====== CARDS ====== */}
          <div className="d-flex gap-3 mb-4">
            <Card className="p-3 flex-fill rounded-4 border-0">
              <h6>Total Items</h6>
              <h2>1,240</h2>
              <small className="text-success">2.4% from last month</small>
            </Card>

            <Card className="p-3 flex-fill rounded-4 border-0">
              <div className="d-flex justify-content-between">
                <h6>Low Stock</h6>
                <Badge bg="success">+12%</Badge>
              </div>
              <h2>12</h2>
              <small className="text-danger">6 pendientes para la tarde</small>
            </Card>

            <Card className="p-3 flex-fill rounded-4 border-0">
              <h6>Expired</h6>
              <h2>2</h2>
              <small className="text-danger">6 pendientes para la tarde</small>
            </Card>
          </div>
          <br />
              <Button
              as={NavLink}
              to="/farmacia/Distribuidores"
              variant="primary"
            >
              ver distribuidores
            </Button>

          {/* ====== TABLE ====== */}
          <Card className="p-4 rounded-4 border-0">
            <br />
            <Table responsive borderless>
              <thead>
                <tr className="text-muted">
                  <th>MEDICATION NAME & CATEGORY</th>
                  <th>TOTAL STOCK</th>
                  <th>LOTES Y CADUCIDAD</th>
                  <th>STATUS</th>
                  <th>ACCIONES</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    400 units <br />
                    <small className="text-success">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">in stock</Badge></td>
              <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                       </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="danger">in stock</Badge></td>
              <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                       </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-danger">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="danger">in stock</Badge></td>
              <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                       </tr>

                <tr>
                  <td><strong>Amoxicilin 500 mg</strong></td>
                  <td>
                    200 units <br />
                    <small className="text-success">optimal level</small>
                  </td>
                  <td>oct 2025</td>
                  <td><Badge bg="success">in stock</Badge></td>
              <td className="actions" onClick={openModal} style={{ cursor: "pointer" }}>
  ⋮
</td>       
                       </tr>
              </tbody>
            </Table>
          </Card>
        </div>
      </div>
                <Modal show={showModal} onHide={closeModal} centered>
  <Modal.Header closeButton>
    <Modal.Title>Editar Medicamento</Modal.Title>
  </Modal.Header>

  <Modal.Body>
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Nombre y categoria</Form.Label>
       <Col md={12}>
                    <Form.Control type="text" />
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