import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState, useEffect } from "react";
import { Button, Spinner, Modal, Form, Pagination, Badge, Card, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { 
  PencilSquare, 
  Trash, 
  PlusCircle, 
  BoxArrowInRight, 
  BoxArrowLeft, 
  PeopleFill, 
  CheckCircleFill, 
  XCircleFill 
} from "react-bootstrap-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterEspecialidad, setFilterEspecialidad] = useState("");
  const [filterEstado, setFilterEstado] = useState(""); 

  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState(null);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${API_URL}/doctores`);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEspecialidades = async () => {
    try {
      const res = await axios.get(`${API_URL}/especialidades`);
      setEspecialidades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchEspecialidades();
  }, []);

  const registrarAsistencia = async (doctorId, tipo) => {
    try {
      await axios.post(`${API_URL}/asistencias`, {
        doctor_id: doctorId,
        tipo: tipo
      });
      fetchDoctors();
    } catch (err) {
      console.log("Error al registrar asistencia:", err);
      alert("No se pudo registrar la asistencia.");
    }
  };

  // Métricas
  const totalDoctores = doctors.length;
  const doctoresDentro = doctors.filter(doc => doc.estado_asistencia === 'dentro').length;
  const doctoresFuera = totalDoctores - doctoresDentro;

  // Filtrado
  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = 
      doc.cedula_profesional?.toLowerCase().includes(search.toLowerCase()) ||
      doc.usuario?.nombre?.toLowerCase().includes(search.toLowerCase());

    const matchesEspecialidad = filterEspecialidad 
      ? String(doc.especialidad_id) === String(filterEspecialidad) 
      : true;

    const matchesEstado = filterEstado 
      ? doc.estado_asistencia === filterEstado 
      : true;

    return matchesSearch && matchesEspecialidad && matchesEstado;
  });

  // Paginación
  const indexOfLast = currentPage * doctorsPerPage;
  const indexOfFirst = indexOfLast - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Editar
  const openEditModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedDoctor({
      ...selectedDoctor,
      [e.target.name]: e.target.value,
    });
  };

  const updateDoctor = async () => {
    try {
      await axios.put(
        `${API_URL}/doctores/${selectedDoctor.id}`,
        selectedDoctor
      );
      fetchDoctors();
      setShowEditModal(false);
    } catch (err) {
      console.log("Error al actualizar:", err);
    }
  };

  // Eliminar
  const openDeleteModal = (doctor) => {
    setDoctorToDelete(doctor);
    setShowDeleteModal(true);
  };

  const deleteDoctor = async () => {
    try {
      await axios.delete(
        `${API_URL}/doctores/${doctorToDelete.id}`
      );
      fetchDoctors();
      setShowDeleteModal(false);
    } catch (err) {
      console.log("Error al eliminar:", err);
    }
  };

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-content-modern">
        <Topbar />

        <div className="page-wrapper" style={{ padding: "20px 28px" }}>
          {/* HEADER REESTRUCTURADO Y COMPACTO */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 className="main-title" style={{ fontSize: "1.5rem", marginBottom: "2px" }}>
                Gestión y Presencia de Doctores
              </h2>
              <p className="subtitle" style={{ fontSize: "0.85rem" }}>
                Control de personal y marcajes rápidos de entrada y salida
              </p>
            </div>

            <Button
              as={NavLink}
              to="/farmacia/agregardoctor"
              className="primary-btn d-flex align-items-center gap-2"
              style={{ padding: "8px 16px", borderRadius: "10px", fontSize: "0.88rem" }}
            >
              <PlusCircle size={16} /> Agregar Doctor
            </Button>
          </div>

          {/* TARJETAS MÉTRICAS OPTIMIZADAS (ESPACIADOS COMPACTOS) */}
          <Row className="mb-3 g-3">
            <Col md={4}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #2196F3" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Plantilla Total
                    </span>
                    <h3 className="m-0" style={{ fontWeight: 800, fontSize: "1.4rem", color: "#0f172a" }}>
                      {totalDoctores} Doctores
                    </h3>
                  </div>
                  <div style={{ background: "#eff6ff", padding: "10px", borderRadius: "10px", color: "#2196F3" }}>
                    <PeopleFill size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #4CAF50" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      En Turno (Dentro)
                    </span>
                    <h3 className="m-0 text-success" style={{ fontWeight: 800, fontSize: "1.4rem" }}>
                      {doctoresDentro} Activos
                    </h3>
                  </div>
                  <div style={{ background: "#f0fdf4", padding: "10px", borderRadius: "10px", color: "#4CAF50" }}>
                    <CheckCircleFill size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #F44336" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Fuera de Servicio
                    </span>
                    <h3 className="m-0 text-danger" style={{ fontWeight: 800, fontSize: "1.4rem" }}>
                      {doctoresFuera} Fuera
                    </h3>
                  </div>
                  <div style={{ background: "#fef2f2", padding: "10px", borderRadius: "10px", color: "#F44336" }}>
                    <XCircleFill size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* FILTROS COMPACTOS */}
          <Card className="p-3 mb-3 border-0 shadow-sm" style={{ borderRadius: "14px", background: "#ffffff" }}>
            <Row className="g-2">
              <Col md={4}>
                <Form.Control
                  type="text"
                  placeholder="Buscar por cédula o nombre..."
                  value={search}
                  style={{ fontSize: "0.85rem", padding: "8px 12px", borderRadius: "10px" }}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filterEspecialidad}
                  style={{ fontSize: "0.85rem", padding: "8px 12px", borderRadius: "10px" }}
                  onChange={(e) => {
                    setFilterEspecialidad(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Todas las especialidades</option>
                  {especialidades.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4}>
                <Form.Select
                  value={filterEstado}
                  style={{ fontSize: "0.85rem", padding: "8px 12px", borderRadius: "10px" }}
                  onChange={(e) => {
                    setFilterEstado(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">Todos los estados</option>
                  <option value="dentro">En Clínica (Dentro)</option>
                  <option value="fuera">Fuera de Clínica</option>
                </Form.Select>
              </Col>
            </Row>
          </Card>

          {/* TABLA Densa Y MODERNA */}
          <div className="card-modern" style={{ padding: "16px 20px", borderRadius: "16px" }}>
            <div className="table-modern">
              <div 
                className="table-header-modern" 
                style={{ 
                  gridTemplateColumns: "1.5fr 1.2fr 1fr 1fr 0.8fr 1.5fr",
                  padding: "10px 14px",
                  fontSize: "0.75rem"
                }}
              >
                <span>Nombre</span>
                <span>Especialidad</span>
                <span>Cédula</span>
                <span>Teléfono</span>
                <span>Presencia</span>
                <span>Acciones Rápidas</span>
              </div>

              {loading ? (
                <div className="text-center py-4"><Spinner animation="border" size="sm" color="primary" /></div>
              ) : currentDoctors.length > 0 ? (
                currentDoctors.map((doctor) => {
                  const especialidad = especialidades.find(e => e.id === doctor.especialidad_id);
                  
                  return (
                    <div 
                      key={doctor.id} 
                      className="table-row-modern" 
                      style={{ 
                        gridTemplateColumns: "1.5fr 1.2fr 1fr 1fr 0.8fr 1.5fr", 
                        alignItems: "center",
                        padding: "10px 14px",
                        fontSize: "0.88rem"
                      }}
                    >
                      <div style={{ fontWeight: "600", color: "#0f172a" }}>
                        {doctor.usuario?.nombre || "Sin nombre asignado"}
                      </div>
                      <div style={{ color: "#475569" }}>
                        {especialidad ? especialidad.nombre : "Medicina General"}
                      </div>
                      <div style={{ color: "#64748b" }}>{doctor.cedula_profesional || "—"}</div>
                      <div style={{ color: "#64748b" }}>{doctor.telefono || "—"}</div>
                      
                      <div>
                        {doctor.estado_asistencia === 'dentro' ? (
                          <Badge bg="success" style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem" }}>Dentro</Badge>
                        ) : (
                          <Badge bg="danger" style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem" }}>Fuera</Badge>
                        )}
                      </div>

                      <div className="d-flex gap-1 align-items-center">
                        <Button
                          size="sm"
                          variant="success"
                          style={{ fontSize: "0.75rem", padding: "4px 8px", borderRadius: "6px" }}
                          disabled={doctor.estado_asistencia === 'dentro'}
                          onClick={() => registrarAsistencia(doctor.id, 'entrada')}
                        >
                          <BoxArrowInRight /> Entrada
                        </Button>

                        <Button
                          size="sm"
                          variant="warning"
                          disabled={doctor.estado_asistencia !== 'dentro'}
                          onClick={() => registrarAsistencia(doctor.id, 'salida')}
                          style={{ color: "#fff", fontSize: "0.75rem", padding: "4px 8px", borderRadius: "6px" }}
                        >
                          <BoxArrowLeft /> Salida
                        </Button>

                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => openEditModal(doctor)}
                          style={{ padding: "4px 8px", borderRadius: "6px", color: "#2563eb", background: "#eff6ff", border: "none" }}
                          className="ms-1"
                        >
                          <PencilSquare />
                        </Button>

                        <Button
                          size="sm"
                          variant="light"
                          onClick={() => openDeleteModal(doctor)}
                          style={{ padding: "4px 8px", borderRadius: "6px", color: "#dc2626", background: "#fef2f2", border: "none" }}
                        >
                          <Trash />
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-4 text-muted" style={{ fontSize: "0.88rem" }}>
                  No se encontraron doctores registrados.
                </div>
              )}
            </div>
          </div>

          {/* PAGINACIÓN CENTRADA Y REDUCIDA */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination size="sm">
                {[...Array(totalPages)].map((_, index) => (
                  <Pagination.Item
                    key={index}
                    active={index + 1 === currentPage}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITAR DOCTOR */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="modern-modal">
        <Modal.Header closeButton style={{ padding: "12px 20px" }}>
          <Modal.Title style={{ fontWeight: "700", fontSize: "1.05rem" }}>Editar Doctor</Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ padding: "16px 20px" }}>
          {selectedDoctor && (
            <Form className="d-flex flex-column gap-2">
              <Form.Group>
                <Form.Label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Especialidad</Form.Label>
                <Form.Select
                  name="especialidad_id"
                  value={selectedDoctor.especialidad_id}
                  onChange={handleEditChange}
                  style={{ fontSize: "0.88rem" }}
                >
                  {especialidades.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Cédula Profesional</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula_profesional"
                  value={selectedDoctor.cedula_profesional || ""}
                  onChange={handleEditChange}
                  style={{ fontSize: "0.88rem" }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Años de Experiencia</Form.Label>
                <Form.Control
                  type="number"
                  name="anios_exp"
                  value={selectedDoctor.anios_exp || ""}
                  onChange={handleEditChange}
                  style={{ fontSize: "0.88rem" }}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ fontSize: "0.85rem", fontWeight: "600" }}>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={selectedDoctor.telefono || ""}
                  onChange={handleEditChange}
                  style={{ fontSize: "0.88rem" }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer style={{ padding: "10px 20px" }}>
          <Button variant="light" size="sm" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={updateDoctor} className="primary-btn">
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR DOCTOR */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered className="modern-modal">
        <Modal.Header closeButton style={{ padding: "12px 20px" }}>
          <Modal.Title style={{ fontWeight: "700", fontSize: "1.05rem", color: "#dc2626" }}>Eliminar Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ padding: "16px 20px", fontSize: "0.9rem", color: "#475569" }}>
          ¿Seguro que quieres eliminar a este doctor? Se borrará permanentemente todo su historial de marcajes de asistencia.
        </Modal.Body>
        <Modal.Footer style={{ padding: "10px 20px" }}>
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" size="sm" onClick={deleteDoctor}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}