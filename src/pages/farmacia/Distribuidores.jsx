import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form
} from "react-bootstrap";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { PencilSquare, Trash } from "react-bootstrap-icons";

export default function Distribuidores() {

  const [distribuidores, setDistribuidores] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [distribuidorEdit, setDistribuidorEdit] = useState(null);
  const [distribuidorDelete, setDistribuidorDelete] = useState(null);

  const [nombre, setNombre] = useState("");

  // ===== CARGAR DATOS =====
  useEffect(() => {

    const data = JSON.parse(localStorage.getItem("distribuidores"));

    if (data && data.length > 0) {

      setDistribuidores(data);

    } else {

      const ejemplo = [
        { id: 1, nombre: "PharmaFirst" },
        { id: 2, nombre: "MediGlobal" },
        { id: 3, nombre: "SaludPlus" },
        { id: 4, nombre: "Farmatech" },
        { id: 5, nombre: "BioHealth Supply" },
        { id: 6, nombre: "Distribuidora Médica MX" },
        { id: 7, nombre: "Mediservicios" },
        { id: 8, nombre: "PharmaLogistics" }
      ];

      setDistribuidores(ejemplo);
      localStorage.setItem("distribuidores", JSON.stringify(ejemplo));
    }

  }, []);

  // ===== ABRIR EDITAR =====
  const abrirEditar = (item) => {
    setDistribuidorEdit(item);
    setNombre(item.nombre);
    setShowModal(true);
  };

  // ===== GUARDAR =====
  const guardarEdicion = () => {

    const actualizados = distribuidores.map((d) =>
      d.id === distribuidorEdit.id ? { ...d, nombre } : d
    );

    setDistribuidores(actualizados);
    localStorage.setItem("distribuidores", JSON.stringify(actualizados));

    setShowModal(false);
  };

  // ===== ABRIR ELIMINAR =====
  const abrirEliminar = (item) => {
    setDistribuidorDelete(item);
    setShowDelete(true);
  };

  // ===== CONFIRMAR ELIMINAR =====
  const eliminarDistribuidor = () => {

    const filtrados = distribuidores.filter(
      (d) => d.id !== distribuidorDelete.id
    );

    setDistribuidores(filtrados);
    localStorage.setItem("distribuidores", JSON.stringify(filtrados));

    setShowDelete(false);
  };

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>

        <Topbar />

        <div style={{ padding: "30px" }}>

          {/* HEADER */}
          <div className="d-flex align-items-center gap-3 mb-4">

            <h4 className="mb-0">Gestión de distribuidores</h4>

            <Button
              as={NavLink}
              to="/farmacia/AgregarDistribuidor"
              size="sm"
              variant="primary"
            >
              + Add
            </Button>

          </div>

          <Row className="g-4">

            {/* LISTA PRINCIPAL */}
            <Col md={8}>

              <Card className="p-4 rounded-4 border-0">

                <div className="d-flex justify-content-between mb-3">
                  <h6>Lista de distribuidores</h6>
                </div>

                {distribuidores.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom"
                  >

                    <div className="d-flex align-items-center gap-3">

                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#eaeaea",
                        }}
                      />

                      <strong>{item.nombre}</strong>

                    </div>

                    <div className="d-flex gap-2">

                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => abrirEditar(item)}
                      >
                        <PencilSquare />
                      </Button>

                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => abrirEliminar(item)}
                      >
                        <Trash />
                      </Button>

                    </div>

                  </div>

                ))}

              </Card>

            </Col>

            {/* PANEL DERECHO */}
            <Col md={4}>

              <Card className="p-4 rounded-4 border-0">

                <h6 className="mb-3">Distribuidores activos</h6>

                {distribuidores.map((item) => (

                  <div
                    key={item.id}
                    className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3"
                    style={{ background: "#f5f5f5" }}
                  >

                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: "#e0e0e0",
                      }}
                    />

                    <strong>{item.nombre}</strong>

                  </div>

                ))}

              </Card>

            </Col>

          </Row>

        </div>

      </div>

      {/* MODAL EDITAR */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>

        <Modal.Header closeButton>
          <Modal.Title>Editar distribuidor</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group>

              <Form.Label>Nombre del distribuidor</Form.Label>

              <Form.Control
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />

            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={guardarEdicion}
          >
            Guardar
          </Button>

        </Modal.Footer>

      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={showDelete} onHide={() => setShowDelete(false)} centered>

        <Modal.Header closeButton>
          <Modal.Title>Eliminar distribuidor</Modal.Title>
        </Modal.Header>

        <Modal.Body>

          ¿Estás seguro que deseas eliminar a
          <strong> {distribuidorDelete?.nombre}</strong>?

        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={() => setShowDelete(false)}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={eliminarDistribuidor}
          >
            Eliminar
          </Button>

        </Modal.Footer>

      </Modal>

    </div>
  );
}