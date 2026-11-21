import React, { useState, useEffect } from "react";
import {
  Card,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Badge,
  InputGroup,
} from "react-bootstrap";
import { NavLink } from "react-router-dom";
import {
  PencilSquare,
  Trash,
  PlusLg,
  Search,
  Building,
  Telephone,
  Envelope,
  GeoAlt,
} from "react-bootstrap-icons";
import Axios from "axios";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./distribuidores.css"; // Estilos dedicados

const API_URL = import.meta.env.VITE_API_URL;

export default function Distribuidores() {
  const [distribuidores, setDistribuidores] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const [distribuidorEdit, setDistribuidorEdit] = useState(null);
  const [distribuidorDelete, setDistribuidorDelete] = useState(null);

  const [formData, setFormData] = useState({
    nombre: "",
    rfc: "",
    categoria: "",
    contacto: "",
    correo: "",
    telefono: "",
    direccion: "",
    ciudad: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===== CARGAR DATOS =====
  useEffect(() => {
    Axios.get(`${API_URL}/MostrarDistribuidor`)
      .then((response) => {
        setDistribuidores(response.data.distribuidor || []);
      })
      .catch((error) => {
        console.error("Error al obtener distribuidores:", error);
      });
  }, []);

  // ===== ABRIR EDITAR =====
  const abrirEditar = (item) => {
    setDistribuidorEdit(item);
    setFormData(item);
    setShowModal(true);
  };

  // ===== GUARDAR EDICIÓN =====
  const guardarEdicion = () => {
    Axios.put(
      `${API_URL}/UpdateDistribuidor/${distribuidorEdit.id}`,
      formData
    )
      .then((response) => {
        const actualizado = response.data.distribuidor;

        const actualizados = distribuidores.map((d) =>
          d.id === actualizado.id ? actualizado : d
        );

        setDistribuidores(actualizados);
        setShowModal(false);
      })
      .catch((error) => {
        console.error("Error al actualizar:", error);
      });
  };

  // ===== ABRIR ELIMINAR =====
  const abrirEliminar = (item) => {
    setDistribuidorDelete(item);
    setShowDelete(true);
  };

  // ===== CONFIRMAR ELIMINAR =====
  const eliminarDistribuidor = () => {
    Axios.delete(
      `${API_URL}/DeleteDistribuidor/${distribuidorDelete.id}`
    )
      .then(() => {
        // quitar del estado (UI inmediata)
        const filtrados = distribuidores.filter(
          (d) => d.id !== distribuidorDelete.id
        );

        setDistribuidores(filtrados);
        setShowDelete(false);
      })
      .catch((error) => {
        console.error("Error al eliminar:", error);
        alert("No se pudo eliminar el distribuidor.");
      });
  };

  // Filtro de búsqueda dinámica
  const distribuidoresFiltrados = distribuidores.filter(
    (d) =>
      d.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.rfc?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="distribuidores-layout">
      <Sidebar />

      <div className="distribuidores-main">
        <Topbar />

        <div className="distribuidores-content">
          {/* HEADER PRINCIPAL */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h3 className="fw-bold mb-1 text-dark">Gestión de Distribuidores</h3>
              <p className="text-muted mb-0 small">
                Administra tus proveedores y contactos comerciales asociados.
              </p>
            </div>

            <Button
              as={NavLink}
              to="/farmacia/AgregarDistribuidor"
              variant="primary"
              className="d-flex align-items-center gap-2 px-3 py-2 rounded-3 fw-semibold shadow-sm"
            >
              <PlusLg /> Nuevo Distribuidor
            </Button>
          </div>

          <Row className="g-4">
            {/* PANEL IZQUIERDO: LISTA PRINCIPAL CON INFORMACIÓN EXTENDIDA */}
            <Col lg={8}>
              <Card className="card-modern p-4">
                <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                  <h6 className="fw-bold text-dark mb-0">
                    Directorio de Proveedores ({distribuidoresFiltrados.length})
                  </h6>

                  {/* Buscador de Proveedores */}
                  <div style={{ maxWidth: "250px" }}>
                    <InputGroup size="sm">
                      <InputGroup.Text className="bg-white border-end-0">
                        <Search className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Buscar..."
                        className="border-start-0 search-input"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                      />
                    </InputGroup>
                  </div>
                </div>

                {distribuidoresFiltrados.length > 0 ? (
                  distribuidoresFiltrados.map((item) => (
                    <div key={item.id} className="distribuidor-item">
                      <div className="d-flex justify-content-between align-items-start gap-3">
                        <div className="d-flex gap-3 align-items-start">
                          {/* Avatar con la primera letra */}
                          <div className="avatar-circle">
                            {item.nombre ? item.nombre.charAt(0).toUpperCase() : "D"}
                          </div>

                          <div>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                              <h6 className="mb-0 fw-bold text-dark">{item.nombre}</h6>
                              {item.rfc && (
                                <Badge bg="light" text="dark" className="border">
                                  {item.rfc}
                                </Badge>
                              )}
                              {item.categoria && (
                                <Badge bg="info" className="bg-opacity-10 text-info fw-semibold">
                                  {item.categoria}
                                </Badge>
                              )}
                            </div>

                            {/* Detalle rápido de contacto */}
                            <div className="d-flex align-items-center gap-3 mt-2 flex-wrap text-muted small">
                              {item.telefono && (
                                <span className="d-flex align-items-center gap-1">
                                  <Telephone size={13} /> {item.telefono}
                                </span>
                              )}
                              {item.correo && (
                                <span className="d-flex align-items-center gap-1">
                                  <Envelope size={13} /> {item.correo}
                                </span>
                              )}
                              {item.ciudad && (
                                <span className="d-flex align-items-center gap-1">
                                  <GeoAlt size={13} /> {item.ciudad}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Botones de Acción */}
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-2 p-1 px-2"
                            onClick={() => abrirEditar(item)}
                            title="Editar"
                          >
                            <PencilSquare size={15} />
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="rounded-2 p-1 px-2"
                            onClick={() => abrirEliminar(item)}
                            title="Eliminar"
                          >
                            <Trash size={15} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-5 text-muted">
                    <Building size={40} className="mb-2 text-secondary opacity-50" />
                    <p className="mb-0">No se encontraron distribuidores.</p>
                  </div>
                )}
              </Card>
            </Col>

            {/* PANEL DERECHO: RESUMEN / ACTIVOS */}
            <Col lg={4}>
              <Card className="card-modern p-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h6 className="fw-bold text-dark mb-0">Vista Rápida</h6>
                  <Badge bg="success" className="bg-opacity-10 text-success px-2 py-1">
                    Activos
                  </Badge>
                </div>

                <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                  {distribuidores.slice(0, 8).map((item) => (
                    <div
                      key={item.id}
                      className="d-flex align-items-center gap-3 p-2.5 mb-2 rounded-3 border-0 bg-light"
                    >
                      <div className="avatar-circle-sm">
                        {item.nombre ? item.nombre.charAt(0).toUpperCase() : "D"}
                      </div>
                      <div className="text-truncate">
                        <strong className="d-block text-dark small text-truncate">
                          {item.nombre}
                        </strong>
                        <span className="text-muted d-block small" style={{ fontSize: "0.75rem" }}>
                          {item.contacto ? `Contacto: ${item.contacto}` : item.ciudad || "Sin detalles"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* MODAL EDITAR MEJORADO CON ESTRUCTURA GRID */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        size="lg"
        className="modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold">
            Editar Informacion de Distribuidor
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form>
            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Nombre comercial
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="nombre"
                    value={formData.nombre || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">RFC</Form.Label>
                  <Form.Control
                    type="text"
                    name="rfc"
                    value={formData.rfc || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Categoría
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="categoria"
                    value={formData.categoria || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Persona de Contacto
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="contacto"
                    value={formData.contacto || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Correo Electrónico
                  </Form.Label>
                  <Form.Control
                    type="email"
                    name="correo"
                    value={formData.correo || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Teléfono
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="telefono"
                    value={formData.telefono || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Dirección
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="direccion"
                    value={formData.direccion || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="small fw-semibold text-secondary">
                    Ciudad
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ciudad"
                    value={formData.ciudad || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" className="border" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarEdicion}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal
        show={showDelete}
        onHide={() => setShowDelete(false)}
        centered
        className="modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title className="h6 fw-bold text-danger">
            Eliminar Distribuidor
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <p className="mb-0 text-secondary">
            ¿Estás seguro de que deseas eliminar a{" "}
            <strong className="text-dark">{distribuidorDelete?.nombre}</strong>?
            Esta acción eliminará sus registros asociados y no se puede deshacer.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" className="border" onClick={() => setShowDelete(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarDistribuidor}>
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
