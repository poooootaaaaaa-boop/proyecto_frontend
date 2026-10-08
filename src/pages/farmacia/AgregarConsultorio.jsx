import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Badge,
  Modal,
  Spinner,
  Alert,
  Nav,
  Tab
} from "react-bootstrap";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

import { useState, useEffect } from "react";
import axios from "axios";

import "./Consultorios.css";

const API_URL = import.meta.env.VITE_API_URL;

// ---------- Valores por defecto de cada formulario ----------

const CONSULTORIO_VACIO = {
  nombre: "",
  numero: "",
  piso: "",
  descripcion: "",
  estado: "Disponible"
};

const HABITACION_VACIA = {
  numero: "",
  piso: "",
  tipo: "Individual",
  estado: "Disponible",
  descripcion: ""
};

const INSTRUMENTO_VACIO = {
  nombre: "",
  categoria: "",
  cantidad: 1,
  estado: "Disponible",
  descripcion: ""
};

const ASIGNACION_VACIA = {
  consultorio_id: "",
  instrumento_id: "",
  cantidad: 1
};

// Colores de badge según el estado
const ESTADO_COLOR = {
  Disponible: "success",
  Ocupado: "danger",
  Ocupada: "danger",
  Mantenimiento: "warning",
  Limpieza: "info",
  "En uso": "primary",
  "Dañado": "dark"
};

function EstadoBadge({ estado }) {
  if (!estado) return null;
  return (
    <Badge bg={ESTADO_COLOR[estado] || "secondary"}>{estado}</Badge>
  );
}

// Iniciales para el avatar circular de cada fila
function inicial(texto) {
  if (!texto) return "?";
  return texto.trim().charAt(0).toUpperCase();
}

// Fila reutilizable para las listas de consultorios / habitaciones / instrumentos
function ItemRow({ tone, avatar, title, subtitle, badge, onEdit, onDelete }) {
  return (
    <div className="item-row">
      <div className={`item-avatar tone-${tone}`}>{avatar}</div>

      <div className="item-info">
        <div className="item-title">{title}</div>
        {subtitle && <div className="item-subtitle">{subtitle}</div>}
      </div>

      <div className="item-badge">{badge}</div>

      <div className="item-actions">
        {onEdit && (
          <button
            type="button"
            className="icon-btn icon-btn-edit"
            title="Editar"
            onClick={onEdit}
          >
            ✎
          </button>
        )}
        <button
          type="button"
          className="icon-btn icon-btn-delete"
          title="Eliminar"
          onClick={onDelete}
        >
          🗑
        </button>
      </div>
    </div>
  );
}

function ListaVacia({ icono, texto }) {
  return (
    <div className="lista-vacia">
      <div className="lista-vacia-icono">{icono}</div>
      <p>{texto}</p>
    </div>
  );
}

export default function AgregarConsultorio() {
  const [tabActivo, setTabActivo] = useState("consultorios");

  // ---------- Consultorios ----------
  const [consultorio, setConsultorio] = useState(CONSULTORIO_VACIO);
  const [consultorios, setConsultorios] = useState([]);
  const [editandoConsultorioId, setEditandoConsultorioId] = useState(null);
  const [errorConsultorio, setErrorConsultorio] = useState("");
  const [loadingConsultorio, setLoadingConsultorio] = useState(false);

  // ---------- Habitaciones ----------
  const [habitacion, setHabitacion] = useState(HABITACION_VACIA);
  const [habitaciones, setHabitaciones] = useState([]);
  const [editandoHabitacionId, setEditandoHabitacionId] = useState(null);
  const [errorHabitacion, setErrorHabitacion] = useState("");
  const [loadingHabitacion, setLoadingHabitacion] = useState(false);

  // ---------- Instrumentos ----------
  const [instrumento, setInstrumento] = useState(INSTRUMENTO_VACIO);
  const [instrumentos, setInstrumentos] = useState([]);
  const [editandoInstrumentoId, setEditandoInstrumentoId] = useState(null);
  const [errorInstrumento, setErrorInstrumento] = useState("");
  const [loadingInstrumento, setLoadingInstrumento] = useState(false);

  // ---------- Asignación consultorio <-> instrumento ----------
  const [asignacion, setAsignacion] = useState(ASIGNACION_VACIA);
  const [inventario, setInventario] = useState([]);
  const [errorAsignacion, setErrorAsignacion] = useState("");
  const [loadingAsignacion, setLoadingAsignacion] = useState(false);

  // ---------- Mensaje de éxito global ----------
  const [success, setSuccess] = useState("");

  // ---------- Modal de confirmación de borrado ----------
  const [confirmar, setConfirmar] = useState({
    show: false,
    tipo: null,
    id: null,
    nombre: ""
  });

  const mostrarExito = (mensaje) => {
    setSuccess(mensaje);
    setTimeout(() => setSuccess(""), 3000);
  };

  const obtenerUsuario = () => {
    try {
      return JSON.parse(localStorage.getItem("usuario"));
    } catch {
      return null;
    }
  };

  // =========================================================
  // CONSULTORIOS
  // =========================================================

  const obtenerConsultorios = async () => {
    try {
      const response = await axios.get(`${API_URL}/consultorios`);
      setConsultorios(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editarConsultorio = (item) => {
    setTabActivo("consultorios");
    setEditandoConsultorioId(item.id);
    setConsultorio({
      nombre: item.nombre || "",
      numero: item.numero || "",
      piso: item.piso || "",
      descripcion: item.descripcion || "",
      estado: item.estado || "Disponible"
    });
    setErrorConsultorio("");
  };

  const cancelarEdicionConsultorio = () => {
    setEditandoConsultorioId(null);
    setConsultorio(CONSULTORIO_VACIO);
    setErrorConsultorio("");
  };

  const guardarConsultorio = async () => {
    if (!consultorio.nombre.trim() || !consultorio.numero.trim()) {
      setErrorConsultorio("El nombre y el número son obligatorios");
      return;
    }

    try {
      setLoadingConsultorio(true);
      setErrorConsultorio("");

      if (editandoConsultorioId) {
        await axios.put(
          `${API_URL}/consultorios/${editandoConsultorioId}`,
          consultorio
        );
        mostrarExito("Consultorio actualizado correctamente");
      } else {
        const usuario = obtenerUsuario();

        await axios.post(`${API_URL}/consultorios`, {
          clinica_id: usuario?.clinica_id,
          ...consultorio
        });
        mostrarExito("Consultorio registrado correctamente");
      }

      cancelarEdicionConsultorio();
      obtenerConsultorios();
    } catch (err) {
      console.error(err);
      setErrorConsultorio(
        err.response?.data?.message || "Error al guardar el consultorio"
      );
    } finally {
      setLoadingConsultorio(false);
    }
  };

  const eliminarConsultorio = async (id) => {
    try {
      await axios.delete(`${API_URL}/consultorios/${id}`);
      mostrarExito("Consultorio eliminado");
      if (editandoConsultorioId === id) cancelarEdicionConsultorio();
      obtenerConsultorios();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // HABITACIONES
  // =========================================================

  const obtenerHabitaciones = async () => {
    try {
      const response = await axios.get(`${API_URL}/habitaciones`);
      setHabitaciones(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editarHabitacion = (item) => {
    setTabActivo("habitaciones");
    setEditandoHabitacionId(item.id);
    setHabitacion({
      numero: item.numero || "",
      piso: item.piso || "",
      tipo: item.tipo || "Individual",
      estado: item.estado || "Disponible",
      descripcion: item.descripcion || ""
    });
    setErrorHabitacion("");
  };

  const cancelarEdicionHabitacion = () => {
    setEditandoHabitacionId(null);
    setHabitacion(HABITACION_VACIA);
    setErrorHabitacion("");
  };

  const guardarHabitacion = async () => {
    if (!habitacion.numero.trim()) {
      setErrorHabitacion("El número de habitación es obligatorio");
      return;
    }

    try {
      setLoadingHabitacion(true);
      setErrorHabitacion("");

      if (editandoHabitacionId) {
        await axios.put(
          `${API_URL}/habitaciones/${editandoHabitacionId}`,
          habitacion
        );
        mostrarExito("Habitación actualizada correctamente");
      } else {
        const usuario = obtenerUsuario();

        await axios.post(`${API_URL}/habitaciones`, {
          ...habitacion,
          clinica_id: usuario?.clinica_id
        });
        mostrarExito("Habitación registrada correctamente");
      }

      cancelarEdicionHabitacion();
      obtenerHabitaciones();
    } catch (err) {
      console.error(err);
      setErrorHabitacion(
        err.response?.data?.message || "Error al guardar la habitación"
      );
    } finally {
      setLoadingHabitacion(false);
    }
  };

  const eliminarHabitacion = async (id) => {
    try {
      await axios.delete(`${API_URL}/habitaciones/${id}`);
      mostrarExito("Habitación eliminada");
      if (editandoHabitacionId === id) cancelarEdicionHabitacion();
      obtenerHabitaciones();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // INSTRUMENTOS
  // =========================================================

  const obtenerInstrumentos = async () => {
    try {
      const response = await axios.get(`${API_URL}/instrumentos`);
      setInstrumentos(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const editarInstrumento = (item) => {
    setTabActivo("instrumentos");
    setEditandoInstrumentoId(item.id);
    setInstrumento({
      nombre: item.nombre || "",
      categoria: item.categoria || "",
      cantidad: item.cantidad ?? 1,
      estado: item.estado || "Disponible",
      descripcion: item.descripcion || ""
    });
    setErrorInstrumento("");
  };

  const cancelarEdicionInstrumento = () => {
    setEditandoInstrumentoId(null);
    setInstrumento(INSTRUMENTO_VACIO);
    setErrorInstrumento("");
  };

  const guardarInstrumento = async () => {
    if (!instrumento.nombre.trim()) {
      setErrorInstrumento("El nombre del instrumento es obligatorio");
      return;
    }

    try {
      setLoadingInstrumento(true);
      setErrorInstrumento("");

      if (editandoInstrumentoId) {
        await axios.put(
          `${API_URL}/instrumentos/${editandoInstrumentoId}`,
          instrumento
        );
        mostrarExito("Instrumento actualizado correctamente");
      } else {
        const usuario = obtenerUsuario();

        await axios.post(`${API_URL}/instrumentos`, {
          ...instrumento,
          clinica_id: usuario?.clinica_id
        });
        mostrarExito("Instrumento registrado correctamente");
      }

      cancelarEdicionInstrumento();
      obtenerInstrumentos();
    } catch (err) {
      console.error(err);
      setErrorInstrumento(
        err.response?.data?.message || "Error al guardar el instrumento"
      );
    } finally {
      setLoadingInstrumento(false);
    }
  };

  const eliminarInstrumento = async (id) => {
    try {
      await axios.delete(`${API_URL}/instrumentos/${id}`);
      mostrarExito("Instrumento eliminado");
      if (editandoInstrumentoId === id) cancelarEdicionInstrumento();
      obtenerInstrumentos();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // ASIGNACIÓN CONSULTORIO <-> INSTRUMENTO
  // =========================================================

  const obtenerInventario = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/consultorio-instrumentos/inventario`
      );
      setInventario(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const asignarInstrumento = async () => {
    if (!asignacion.consultorio_id || !asignacion.instrumento_id) {
      setErrorAsignacion("Selecciona un consultorio y un instrumento");
      return;
    }

    try {
      setLoadingAsignacion(true);
      setErrorAsignacion("");

      await axios.post(`${API_URL}/consultorio-instrumentos`, asignacion);

      mostrarExito("Instrumento asignado correctamente");
      setAsignacion(ASIGNACION_VACIA);
      obtenerInventario();
    } catch (err) {
      console.error(err);
      setErrorAsignacion(
        err.response?.data?.message || "Error al asignar el instrumento"
      );
    } finally {
      setLoadingAsignacion(false);
    }
  };

  const eliminarAsignacion = async (id) => {
    try {
      await axios.delete(`${API_URL}/consultorio-instrumentos/${id}`);
      mostrarExito("Asignación eliminada");
      obtenerInventario();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================================================
  // MODAL DE CONFIRMACIÓN
  // =========================================================

  const pedirConfirmacion = (tipo, id, nombre) => {
    setConfirmar({ show: true, tipo, id, nombre });
  };

  const cerrarConfirmacion = () => {
    setConfirmar({ show: false, tipo: null, id: null, nombre: "" });
  };

  const confirmarEliminacion = async () => {
    const { tipo, id } = confirmar;

    if (tipo === "consultorio") await eliminarConsultorio(id);
    if (tipo === "habitacion") await eliminarHabitacion(id);
    if (tipo === "instrumento") await eliminarInstrumento(id);
    if (tipo === "asignacion") await eliminarAsignacion(id);

    cerrarConfirmacion();
  };

  useEffect(() => {
    obtenerConsultorios();
    obtenerHabitaciones();
    obtenerInstrumentos();
    obtenerInventario();
  }, []);

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div className="page-consultorio">
          <div className="consultorio-header">
            <h2>🏥 Espacios y equipo médico</h2>
            <p>Configura consultorios, habitaciones e instrumentos de tu clínica</p>
          </div>

          {success && (
            <Alert
              variant="success"
              onClose={() => setSuccess("")}
              dismissible
              className="alerta-flotante"
            >
              {success}
            </Alert>
          )}

          {/* ---------- Tarjetas resumen / accesos rápidos ---------- */}
          <Row className="mb-4 g-3">
            <Col md={4}>
              <div
                className={`stat-card tone-consultorio ${
                  tabActivo === "consultorios" ? "activo" : ""
                }`}
                onClick={() => setTabActivo("consultorios")}
              >
                <div className="stat-icono">🏥</div>
                <div>
                  <h2>{consultorios.length}</h2>
                  <small>Consultorios</small>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div
                className={`stat-card tone-habitacion ${
                  tabActivo === "habitaciones" ? "activo" : ""
                }`}
                onClick={() => setTabActivo("habitaciones")}
              >
                <div className="stat-icono">🛏</div>
                <div>
                  <h2>{habitaciones.length}</h2>
                  <small>Habitaciones</small>
                </div>
              </div>
            </Col>

            <Col md={4}>
              <div
                className={`stat-card tone-instrumento ${
                  tabActivo === "instrumentos" ? "activo" : ""
                }`}
                onClick={() => setTabActivo("instrumentos")}
              >
                <div className="stat-icono">🩺</div>
                <div>
                  <h2>{instrumentos.length}</h2>
                  <small>Instrumentos</small>
                </div>
              </div>
            </Col>
          </Row>

          {/* ---------- Navegación por pestañas ---------- */}
          <Tab.Container activeKey={tabActivo} onSelect={setTabActivo}>
            <Nav variant="pills" className="tabs-modernas">
              <Nav.Item>
                <Nav.Link eventKey="consultorios">🏥 Consultorios</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="habitaciones">🛏 Habitaciones</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="instrumentos">🩺 Instrumentos</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="asignaciones">🔗 Asignaciones</Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              {/* ================= CONSULTORIOS ================= */}
              <Tab.Pane eventKey="consultorios">
                <Row className="g-4">
                  <Col lg={5}>
                    <Card className="card-modern-consultorio p-4 form-card">
                      {editandoConsultorioId && (
                        <div className="modo-edicion">
                          Editando consultorio
                          <button
                            type="button"
                            onClick={cancelarEdicionConsultorio}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      <h5 className="form-card-titulo">
                        {editandoConsultorioId
                          ? "Editar consultorio"
                          : "Nuevo consultorio"}
                      </h5>

                      {errorConsultorio && (
                        <Alert variant="danger" className="py-2">
                          {errorConsultorio}
                        </Alert>
                      )}

                      <Row className="g-3">
                        <Col md={7}>
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            value={consultorio.nombre}
                            onChange={(e) =>
                              setConsultorio({
                                ...consultorio,
                                nombre: e.target.value
                              })
                            }
                            placeholder="Ej. Consultorio 1"
                          />
                        </Col>

                        <Col md={5}>
                          <Form.Label>Número *</Form.Label>
                          <Form.Control
                            value={consultorio.numero}
                            onChange={(e) =>
                              setConsultorio({
                                ...consultorio,
                                numero: e.target.value
                              })
                            }
                            placeholder="Ej. 101"
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Piso</Form.Label>
                          <Form.Control
                            value={consultorio.piso}
                            onChange={(e) =>
                              setConsultorio({
                                ...consultorio,
                                piso: e.target.value
                              })
                            }
                            placeholder="Ej. 1"
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Estado</Form.Label>
                          <Form.Select
                            value={consultorio.estado}
                            onChange={(e) =>
                              setConsultorio({
                                ...consultorio,
                                estado: e.target.value
                              })
                            }
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="Ocupado">Ocupado</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Limpieza">Limpieza</option>
                          </Form.Select>
                        </Col>

                        <Col md={12}>
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={consultorio.descripcion}
                            onChange={(e) =>
                              setConsultorio({
                                ...consultorio,
                                descripcion: e.target.value
                              })
                            }
                          />
                        </Col>
                      </Row>

                      <div className="mt-4 d-flex justify-content-end">
                        <Button
                          className="btn-primary-modern"
                          onClick={guardarConsultorio}
                          disabled={loadingConsultorio}
                        >
                          {loadingConsultorio ? (
                            <Spinner size="sm" animation="border" />
                          ) : editandoConsultorioId ? (
                            "Actualizar consultorio"
                          ) : (
                            "Guardar consultorio"
                          )}
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  <Col lg={7}>
                    <Card className="card-modern-consultorio p-4 lista-card">
                      <div className="seccion-header">
                        <h5 className="mb-0">Consultorios registrados</h5>
                        <span className="contador-pill">
                          {consultorios.length}
                        </span>
                      </div>

                      {consultorios.length > 0 ? (
                        <div className="lista-items">
                          {consultorios.map((c) => (
                            <ItemRow
                              key={c.id}
                              tone="consultorio"
                              avatar={inicial(c.nombre)}
                              title={c.nombre}
                              subtitle={`N.º ${c.numero || "—"} · Piso ${
                                c.piso || "—"
                              }`}
                              badge={<EstadoBadge estado={c.estado} />}
                              onEdit={() => editarConsultorio(c)}
                              onDelete={() =>
                                pedirConfirmacion(
                                  "consultorio",
                                  c.id,
                                  c.nombre
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <ListaVacia
                          icono="🏥"
                          texto="Aún no hay consultorios registrados"
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ================= HABITACIONES ================= */}
              <Tab.Pane eventKey="habitaciones">
                <Row className="g-4">
                  <Col lg={5}>
                    <Card className="card-modern-consultorio p-4 form-card">
                      {editandoHabitacionId && (
                        <div className="modo-edicion">
                          Editando habitación
                          <button
                            type="button"
                            onClick={cancelarEdicionHabitacion}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      <h5 className="form-card-titulo">
                        {editandoHabitacionId
                          ? "Editar habitación"
                          : "Nueva habitación"}
                      </h5>

                      {errorHabitacion && (
                        <Alert variant="danger" className="py-2">
                          {errorHabitacion}
                        </Alert>
                      )}

                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Label>Número *</Form.Label>
                          <Form.Control
                            value={habitacion.numero}
                            placeholder="Número"
                            onChange={(e) =>
                              setHabitacion({
                                ...habitacion,
                                numero: e.target.value
                              })
                            }
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Piso</Form.Label>
                          <Form.Control
                            value={habitacion.piso}
                            placeholder="Piso"
                            onChange={(e) =>
                              setHabitacion({
                                ...habitacion,
                                piso: e.target.value
                              })
                            }
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Tipo</Form.Label>
                          <Form.Select
                            value={habitacion.tipo}
                            onChange={(e) =>
                              setHabitacion({
                                ...habitacion,
                                tipo: e.target.value
                              })
                            }
                          >
                            <option value="Individual">Individual</option>
                            <option value="Compartida">Compartida</option>
                            <option value="Urgencias">Urgencias</option>
                            <option value="Quirófano">Quirófano</option>
                            <option value="UCI">UCI</option>
                          </Form.Select>
                        </Col>

                        <Col md={6}>
                          <Form.Label>Estado</Form.Label>
                          <Form.Select
                            value={habitacion.estado}
                            onChange={(e) =>
                              setHabitacion({
                                ...habitacion,
                                estado: e.target.value
                              })
                            }
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="Ocupada">Ocupada</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Limpieza">Limpieza</option>
                          </Form.Select>
                        </Col>

                        <Col md={12}>
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={habitacion.descripcion}
                            placeholder="Descripción"
                            onChange={(e) =>
                              setHabitacion({
                                ...habitacion,
                                descripcion: e.target.value
                              })
                            }
                          />
                        </Col>
                      </Row>

                      <div className="mt-4 d-flex justify-content-end">
                        <Button
                          className="btn-primary-modern"
                          onClick={guardarHabitacion}
                          disabled={loadingHabitacion}
                        >
                          {loadingHabitacion ? (
                            <Spinner size="sm" animation="border" />
                          ) : editandoHabitacionId ? (
                            "Actualizar habitación"
                          ) : (
                            "Guardar habitación"
                          )}
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  <Col lg={7}>
                    <Card className="card-modern-consultorio p-4 lista-card">
                      <div className="seccion-header">
                        <h5 className="mb-0">Habitaciones registradas</h5>
                        <span className="contador-pill">
                          {habitaciones.length}
                        </span>
                      </div>

                      {habitaciones.length > 0 ? (
                        <div className="lista-items">
                          {habitaciones.map((h) => (
                            <ItemRow
                              key={h.id}
                              tone="habitacion"
                              avatar={inicial(h.tipo)}
                              title={`Habitación ${h.numero || "—"}`}
                              subtitle={`${h.tipo || "—"} · Piso ${
                                h.piso || "—"
                              }`}
                              badge={<EstadoBadge estado={h.estado} />}
                              onEdit={() => editarHabitacion(h)}
                              onDelete={() =>
                                pedirConfirmacion(
                                  "habitacion",
                                  h.id,
                                  `habitación ${h.numero}`
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <ListaVacia
                          icono="🛏"
                          texto="Aún no hay habitaciones registradas"
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ================= INSTRUMENTOS ================= */}
              <Tab.Pane eventKey="instrumentos">
                <Row className="g-4">
                  <Col lg={5}>
                    <Card className="card-modern-consultorio p-4 form-card">
                      {editandoInstrumentoId && (
                        <div className="modo-edicion">
                          Editando instrumento
                          <button
                            type="button"
                            onClick={cancelarEdicionInstrumento}
                          >
                            Cancelar
                          </button>
                        </div>
                      )}

                      <h5 className="form-card-titulo">
                        {editandoInstrumentoId
                          ? "Editar instrumento"
                          : "Nuevo instrumento"}
                      </h5>

                      {errorInstrumento && (
                        <Alert variant="danger" className="py-2">
                          {errorInstrumento}
                        </Alert>
                      )}

                      <Row className="g-3">
                        <Col md={7}>
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control
                            value={instrumento.nombre}
                            placeholder="Nombre"
                            onChange={(e) =>
                              setInstrumento({
                                ...instrumento,
                                nombre: e.target.value
                              })
                            }
                          />
                        </Col>

                        <Col md={5}>
                          <Form.Label>Categoría</Form.Label>
                          <Form.Control
                            value={instrumento.categoria}
                            placeholder="Categoría"
                            onChange={(e) =>
                              setInstrumento({
                                ...instrumento,
                                categoria: e.target.value
                              })
                            }
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Cantidad</Form.Label>
                          <Form.Control
                            type="number"
                            min={0}
                            value={instrumento.cantidad}
                            onChange={(e) =>
                              setInstrumento({
                                ...instrumento,
                                cantidad: e.target.value
                              })
                            }
                          />
                        </Col>

                        <Col md={6}>
                          <Form.Label>Estado</Form.Label>
                          <Form.Select
                            value={instrumento.estado}
                            onChange={(e) =>
                              setInstrumento({
                                ...instrumento,
                                estado: e.target.value
                              })
                            }
                          >
                            <option value="Disponible">Disponible</option>
                            <option value="En uso">En uso</option>
                            <option value="Mantenimiento">Mantenimiento</option>
                            <option value="Dañado">Dañado</option>
                          </Form.Select>
                        </Col>

                        <Col md={12}>
                          <Form.Label>Descripción</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={instrumento.descripcion}
                            onChange={(e) =>
                              setInstrumento({
                                ...instrumento,
                                descripcion: e.target.value
                              })
                            }
                          />
                        </Col>
                      </Row>

                      <div className="mt-4 d-flex justify-content-end">
                        <Button
                          className="btn-primary-modern"
                          onClick={guardarInstrumento}
                          disabled={loadingInstrumento}
                        >
                          {loadingInstrumento ? (
                            <Spinner size="sm" animation="border" />
                          ) : editandoInstrumentoId ? (
                            "Actualizar instrumento"
                          ) : (
                            "Guardar instrumento"
                          )}
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  <Col lg={7}>
                    <Card className="card-modern-consultorio p-4 lista-card">
                      <div className="seccion-header">
                        <h5 className="mb-0">Instrumentos registrados</h5>
                        <span className="contador-pill">
                          {instrumentos.length}
                        </span>
                      </div>

                      {instrumentos.length > 0 ? (
                        <div className="lista-items">
                          {instrumentos.map((i) => (
                            <ItemRow
                              key={i.id}
                              tone="instrumento"
                              avatar={inicial(i.nombre)}
                              title={i.nombre}
                              subtitle={`${i.categoria || "Sin categoría"} · Cant. ${
                                i.cantidad ?? 0
                              }`}
                              badge={<EstadoBadge estado={i.estado} />}
                              onEdit={() => editarInstrumento(i)}
                              onDelete={() =>
                                pedirConfirmacion(
                                  "instrumento",
                                  i.id,
                                  i.nombre
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <ListaVacia
                          icono="🩺"
                          texto="Aún no hay instrumentos registrados"
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* ================= ASIGNACIONES ================= */}
              <Tab.Pane eventKey="asignaciones">
                <Row className="g-4">
                  <Col lg={5}>
                    <Card className="card-modern-consultorio p-4 form-card">
                      <h5 className="form-card-titulo">
                        Asignar instrumento a consultorio
                      </h5>

                      {errorAsignacion && (
                        <Alert variant="danger" className="py-2">
                          {errorAsignacion}
                        </Alert>
                      )}

                      <Row className="g-3">
                        <Col md={12}>
                          <Form.Label>Consultorio</Form.Label>
                          <Form.Select
                            value={asignacion.consultorio_id}
                            onChange={(e) =>
                              setAsignacion({
                                ...asignacion,
                                consultorio_id: e.target.value
                              })
                            }
                          >
                            <option value="">Seleccione consultorio</option>
                            {consultorios.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.nombre} (#{c.numero})
                              </option>
                            ))}
                          </Form.Select>
                        </Col>

                        <Col md={12}>
                          <Form.Label>Instrumento</Form.Label>
                          <Form.Select
                            value={asignacion.instrumento_id}
                            onChange={(e) =>
                              setAsignacion({
                                ...asignacion,
                                instrumento_id: e.target.value
                              })
                            }
                          >
                            <option value="">Seleccione instrumento</option>
                            {instrumentos.map((i) => (
                              <option key={i.id} value={i.id}>
                                {i.nombre}
                              </option>
                            ))}
                          </Form.Select>
                        </Col>

                        <Col md={12}>
                          <Form.Label>Cantidad</Form.Label>
                          <Form.Control
                            type="number"
                            min={1}
                            value={asignacion.cantidad}
                            onChange={(e) =>
                              setAsignacion({
                                ...asignacion,
                                cantidad: e.target.value
                              })
                            }
                          />
                        </Col>
                      </Row>

                      <div className="mt-4 d-flex justify-content-end">
                        <Button
                          className="btn-primary-modern"
                          onClick={asignarInstrumento}
                          disabled={loadingAsignacion}
                        >
                          {loadingAsignacion ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "Asignar instrumento"
                          )}
                        </Button>
                      </div>
                    </Card>
                  </Col>

                  <Col lg={7}>
                    <Card className="card-modern-consultorio p-4 lista-card">
                      <div className="seccion-header">
                        <h5 className="mb-0">Instrumentos por consultorio</h5>
                        <span className="contador-pill">
                          {inventario.length}
                        </span>
                      </div>

                      {inventario.length > 0 ? (
                        <div className="lista-items">
                          {inventario.map((item) => (
                            <ItemRow
                              key={item.id}
                              tone="asignacion"
                              avatar={inicial(item.instrumento?.nombre)}
                              title={item.instrumento?.nombre}
                              subtitle={`${item.consultorio?.nombre} (#${
                                item.consultorio?.numero
                              }) · Cant. ${item.cantidad}`}
                              badge={
                                <Badge bg="secondary">
                                  {item.instrumento?.categoria || "—"}
                                </Badge>
                              }
                              onEdit={null}
                              onDelete={() =>
                                pedirConfirmacion(
                                  "asignacion",
                                  item.id,
                                  `${item.instrumento?.nombre} en ${item.consultorio?.nombre}`
                                )
                              }
                            />
                          ))}
                        </div>
                      ) : (
                        <ListaVacia
                          icono="🔗"
                          texto="Todavía no hay instrumentos asignados"
                        />
                      )}
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>

      {/* ================= MODAL CONFIRMACIÓN ================= */}

      <Modal
        show={confirmar.show}
        onHide={cerrarConfirmacion}
        centered
        className="modal-modern"
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar <strong>{confirmar.nombre}</strong>?
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarConfirmacion}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarEliminacion}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}