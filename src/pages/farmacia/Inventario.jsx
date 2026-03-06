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

  const [medicamentos, setMedicamentos] = useState(
    JSON.parse(localStorage.getItem("medicamentos")) || []
  );

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [medSeleccionado, setMedSeleccionado] = useState(null);

  const abrirEditar = (med) => {
    setMedSeleccionado({ ...med });
    setModalEditar(true);
  };

  const abrirEliminar = (med) => {
    setMedSeleccionado(med);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalEditar(false);
    setModalEliminar(false);
    setMedSeleccionado(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setMedSeleccionado({
      ...medSeleccionado,
      [name]: value,
    });
  };

  const guardarCambios = () => {

    const nuevos = medicamentos.map((m) =>
      m.nombre === medSeleccionado.nombre
        ? medSeleccionado
        : m
    );

    setMedicamentos(nuevos);
    localStorage.setItem(
      "medicamentos",
      JSON.stringify(nuevos)
    );

    cerrarModales();
  };

  const eliminarMedicamento = () => {

    const nuevos = medicamentos.filter(
      (m) => m.nombre !== medSeleccionado.nombre
    );

    setMedicamentos(nuevos);
    localStorage.setItem(
      "medicamentos",
      JSON.stringify(nuevos)
    );

    cerrarModales();
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
              <p className="subtitle">
                Gestión de medicamentos
              </p>
            </div>

            <Button
              as={NavLink}
              to="/farmacia/AgregarMedicamento"
              className="primary-btn"
            >
              Agregar medicamento
            </Button>
          </div>

          {/* CARDS */}
          <div className="stats-grid">

            <div className="stat-card-modern">
              <small>Total Items</small>
              <h3>{medicamentos.length}</h3>
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
              className="primary-btn"
            >
              Ver distribuidores
            </Button>
          </div>

          {/* TABLA */}
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
                <span>Acciones</span>
              </div>

              {medicamentos.map((med, index) => (

                <div
                  className="table-row-modern"
                  key={index}
                >

                  <div>
                    <strong>{med.nombre}</strong>
                    <br />
                    <small className="muted">
                      {med.categoria}
                    </small>
                  </div>

                  <div>
                    {med.stockMax} unidades
                    <br />
                    <small className="success-text">
                      Nivel óptimo
                    </small>
                  </div>

                  <div>{med.vencimiento}</div>

                  <div>
                    <span className="status-badge in-stock">
                      In Stock
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                    }}
                  >

                    <i
                      className="bi bi-pencil-square"
                      style={{
                        cursor: "pointer",
                        color: "#2563eb",
                        fontSize: "18px",
                      }}
                      onClick={() =>
                        abrirEditar(med)
                      }
                    />

                    <i
                      className="bi bi-trash"
                      style={{
                        cursor: "pointer",
                        color: "#dc2626",
                        fontSize: "18px",
                      }}
                      onClick={() =>
                        abrirEliminar(med)
                      }
                    />

                  </div>

                </div>

              ))}

            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      <Modal
        show={modalEditar}
        onHide={cerrarModales}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Editar Medicamento
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>

          <Form>

            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={medSeleccionado?.nombre || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Control
                name="categoria"
                value={
                  medSeleccionado?.categoria || ""
                }
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                name="stockMax"
                value={
                  medSeleccionado?.stockMax || ""
                }
                onChange={handleChange}
              />
            </Form.Group>

          </Form>

        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={cerrarModales}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            onClick={guardarCambios}
          >
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        show={modalEliminar}
        onHide={cerrarModales}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Eliminar medicamento
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Seguro que deseas eliminar{" "}
          <strong>
            {medSeleccionado?.nombre}
          </strong>
          ?
        </Modal.Body>

        <Modal.Footer>

          <Button
            variant="secondary"
            onClick={cerrarModales}
          >
            Cancelar
          </Button>

          <Button
            variant="danger"
            onClick={eliminarMedicamento}
          >
            Eliminar
          </Button>

        </Modal.Footer>
      </Modal>
    </div>
  );
}