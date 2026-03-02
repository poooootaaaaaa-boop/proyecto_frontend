import {
  Container,
  Row,
  Col,
  Table,
  Badge,
  Card,
  Button,
  Form,
  Modal,
} from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./homeFarmacia.css";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function HomeFarmacia() {
  // 🔹 Datos dinámicos
  const [recetas, setRecetas] = useState([
    { id: 1, paciente: "Juan Pérez", hora: "10:30", estado: "Urgente" },
    { id: 2, paciente: "María López", hora: "11:00", estado: "Normal" },
    { id: 3, paciente: "Carlos Ruiz", hora: "12:15", estado: "Normal" },
  ]);

  // 🔹 Modal
  const [showModal, setShowModal] = useState(false);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState(null);

  // 🔹 Abrir modal con datos
  const openModal = (receta) => {
    setRecetaSeleccionada({ ...receta });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setRecetaSeleccionada(null);
  };

  // 🔹 Cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecetaSeleccionada({
      ...recetaSeleccionada,
      [name]: value,
    });
  };

  // 🔹 Guardar cambios
  const handleSave = () => {
    setRecetas((prev) =>
      prev.map((r) =>
        r.id === recetaSeleccionada.id ? recetaSeleccionada : r
      )
    );
    closeModal();
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <Container fluid className="home-content">
        <Topbar />

        {/* Header */}
        <div className="home-header">
          <div>
            <h4>Buen día Dr. Alejandro</h4>
            <small className="text-muted">Jueves, 24 de octubre</small>
          </div>

          <Form.Control
            type="search"
            placeholder="Buscar"
            className="home-search"
          />
        </div>

        <Row className="mt-4">
          {/* Próximas recetas */}
          <Col md={8}>
            <Card className="card-soft">
              <Card.Body>
                <h5 className="mb-3">Próximas recetas</h5>

                <Table hover responsive className="tabla-home">
                  <thead>
                    <tr>
                      <th>Paciente</th>
                      <th>Hora</th>
                      <th>Estado</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recetas.map((receta) => (
                      <tr key={receta.id}>
                        <td className="paciente">
                          <img src="https://i.pravatar.cc/40" alt="avatar" />
                          {receta.paciente}
                        </td>
                        <td>{receta.hora}</td>
                        <td>
                          <Badge
                            bg={
                              receta.estado === "Urgente"
                                ? "danger"
                                : "secondary"
                            }
                          >
                            {receta.estado}
                          </Badge>
                        </td>
                        <td
                          className="actions"
                          onClick={() => openModal(receta)}
                          style={{ cursor: "pointer" }}
                        >
                          ⋮
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>

          {/* Accesos rápidos */}
          <Col md={4}>
            <h6 className="mb-3">Accesos rápidos</h6>

            <Card className="card-soft mb-3">
              <Card.Body>
                <Button
                  as={NavLink}
                  to="/farmacia/AgregarMedicamento"
                  variant="primary"
                >
                  Agregar medicamento
                </Button>
              </Card.Body>
            </Card>

            <Card className="card-soft mb-3">
              <Card.Body>
                <Button
                  as={NavLink}
                  to="/farmacia/Distribuidores"
                  variant="primary"
                >
                  Distribuidores
                </Button>
              </Card.Body>
            </Card>

            <Card className="card-soft mb-3">
              <Card.Body>
                <small className="label">Recetas por validar</small>
                <h3>{recetas.length}</h3>
              </Card.Body>
            </Card>

            <Card className="card-soft">
              <Card.Body>
                <small className="label">Alerta de stock</small>
                <h3>5</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* MODAL */}
        <Modal show={showModal} onHide={closeModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Editar receta</Modal.Title>
          </Modal.Header>

          {recetaSeleccionada && (
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Paciente</Form.Label>
                  <Form.Control
                    type="text"
                    name="paciente"
                    value={recetaSeleccionada.paciente}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Hora</Form.Label>
                  <Form.Control
                    type="time"
                    name="hora"
                    value={recetaSeleccionada.hora}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="estado"
                    value={recetaSeleccionada.estado}
                    onChange={handleChange}
                  >
                    <option value="Urgente">Urgente</option>
                    <option value="Normal">Normal</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Modal.Body>
          )}

          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
}