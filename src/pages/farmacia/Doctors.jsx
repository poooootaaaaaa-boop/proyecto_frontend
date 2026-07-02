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
      const res = await axios.get("http://127.0.0.1:8000/api/especialidades");
      setEspecialidades(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDoctors();
    fetchEspecialidades();
  }, []);

  // Registrar Entrada o Salida rápida desde el listado
  const registrarAsistencia = async (doctorId, tipo) => {
    try {
      await axios.post("http://127.0.0.1:8000/api/asistencias", {
        doctor_id: doctorId,
        tipo: tipo
      });
      fetchDoctors(); // Recargar datos para refrescar la presencia visual
    } catch (err) {
      console.log("Error al registrar asistencia:", err);
      alert("No se pudo registrar la asistencia.");
    }
  };

  // Cálculo de Métricas Dinámicas superiores
  const totalDoctores = doctors.length;
  const doctoresDentro = doctors.filter(doc => doc.estado_asistencia === 'dentro').length;
  const doctoresFuera = totalDoctores - doctoresDentro;

  // Filtrado Avanzado
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

        {/* HEADER */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2>Gestión y Presencia de Doctores</h2>
            <p className="text-muted">Control de personal y marcajes rápidos de entrada y salida</p>
          </div>

          <Button
            as={NavLink}
            to="/farmacia/agregardoctor"
            size="md"
            variant="primary"
            className="d-flex align-items-center gap-2"
          >
            <PlusCircle /> Agregar Doctor
          </Button>
        </div>

        {/* PANEL DE MÉTRICAS */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-center shadow-sm border-0" style={{ borderLeft: "5px solid #2196F3" }}>
              <Card.Body>
                <PeopleFill size={30} className="text-primary mb-2" />
                <Card.Title className="text-muted small">Plantilla Total</Card.Title>
                <h3>{totalDoctores} Doctores</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm border-0" style={{ borderLeft: "5px solid #4CAF50" }}>
              <Card.Body>
                <CheckCircleFill size={30} className="text-success mb-2" />
                <Card.Title className="text-muted small">En Turno (Dentro)</Card.Title>
                <h3 className="text-success">{doctoresDentro} Activos</h3>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-center shadow-sm border-0" style={{ borderLeft: "5px solid #F44336" }}>
              <Card.Body>
                <XCircleFill size={30} className="text-danger mb-2" />
                <Card.Title className="text-muted small">Fuera de Servicio</Card.Title>
                <h3 className="text-danger">{doctoresFuera} Fuera</h3>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FILTROS AVANZADOS */}
        <Card className="p-3 mb-4 border-0 shadow-sm">
          <Row className="g-2">
            <Col md={4}>
              <Form.Control
                type="text"
                placeholder="Buscar por cédula o nombre..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Col>
            <Col md={4}>
              <Form.Select
                value={filterEspecialidad}
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

        {/* TABLA INTERACTIVA */}
        <div className="table-modern">
          <div className="table-header-modern" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1.5fr" }}>
            <span>Nombre</span>
            <span>Especialidad</span>
            <span>Cédula</span>
            <span>Teléfono</span>
            <span>Presencia</span>
            <span>Acciones Rápidas</span>
          </div>

          {loading ? (
            <div className="text-center my-4"><Spinner /></div>
          ) : currentDoctors.length > 0 ? (
            currentDoctors.map((doctor) => {
              const especialidad = especialidades.find(e => e.id === doctor.especialidad_id);
              
              return (
                <div key={doctor.id} className="table-row-modern" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1.5fr", alignItems: "center" }}>
                  <div style={{ fontWeight: "600" }}>{doctor.usuario?.nombre || "Sin nombre asignado"}</div>
                  <div>{especialidad ? especialidad.nombre : "Medicina General"}</div>
                  <div>{doctor.cedula_profesional}</div>
                  <div>{doctor.telefono}</div>
                  
                  <div>
                    {doctor.estado_asistencia === 'dentro' ? (
                      <Badge bg="success">Dentro</Badge>
                    ) : (
                      <Badge bg="danger">Fuera</Badge>
                    )}
                  </div>

                  <div className="d-flex gap-1">
                    <Button
                      size="sm"
                      variant="success"
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
                      style={{ color: "#fff" }}
                    >
                      <BoxArrowLeft /> Salida
                    </Button>

                    <Button
                      size="sm"
                      variant="light"
                      onClick={() => openEditModal(doctor)}
                      className="ms-2"
                    >
                      <PencilSquare />
                    </Button>

                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => openDeleteModal(doctor)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center my-4 p-4 text-muted">No se encontraron doctores.</div>
          )}
        </div>

        {/* PAGINACIÓN */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
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
      </div>

      {/* MODAL EDITAR */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontWeight: "600" }}>Editar Doctor</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedDoctor && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Especialidad</Form.Label>
                <Form.Select
                  name="especialidad_id"
                  value={selectedDoctor.especialidad_id}
                  onChange={handleEditChange}
                >
                  {especialidades.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cédula Profesional</Form.Label>
                <Form.Control
                  type="text"
                  name="cedula_profesional"
                  value={selectedDoctor.cedula_profesional}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Años de experiencia</Form.Label>
                <Form.Control
                  type="number"
                  name="anios_exp"
                  value={selectedDoctor.anios_exp}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={selectedDoctor.telefono}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>

        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={updateDoctor}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Doctor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Seguro que quieres eliminar este doctor? Se borrará permanentemente todo su historial de marcajes de asistencia.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={deleteDoctor}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}