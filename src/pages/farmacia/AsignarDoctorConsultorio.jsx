import {
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Badge,
  Pagination,
  Spinner
} from "react-bootstrap";

import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

import { useState, useEffect } from "react";
import axios from "axios";

import "./Consultorios.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function AsignarDoctorConsultorio() {

  const [doctores, setDoctores] = useState([]);
  const [consultorios, setConsultorios] = useState([]);

  const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
  const [consultorioSeleccionado, setConsultorioSeleccionado] = useState("");

  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [horario, setHorario] = useState({
    dia_semana: "",
    hora_inicio: "",
    hora_fin: ""
  });

  const [paginaActual, setPaginaActual] = useState(1);
  const doctoresPorPagina = 3;
  const ultimoDoctor = paginaActual * doctoresPorPagina;
  const primerDoctor = ultimoDoctor - doctoresPorPagina;
  const doctoresPaginados = doctores.slice(primerDoctor, ultimoDoctor);
  const totalPaginas = Math.ceil(doctores.length / doctoresPorPagina);

  const [horarios, setHorarios] = useState([]);

  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    setError("");
    try {
      const [doctoresRes, consultoriosRes] = await Promise.all([
        axios.get(`${API_URL}/doctores-completo`),
        axios.get(`${API_URL}/consultorios`),
      ]);

      setDoctores(doctoresRes.data);
      setConsultorios(consultoriosRes.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los doctores o consultorios.");
    } finally {
      setCargando(false);
    }
  };

  const agregarHorario = () => {
    if (!horario.dia_semana || !horario.hora_inicio || !horario.hora_fin) {
      return;
    }

    if (horario.hora_fin <= horario.hora_inicio) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    setHorarios([...horarios, horario]);
    setHorario({ dia_semana: "", hora_inicio: "", hora_fin: "" });
    setError("");
  };

  const eliminarHorario = (index) => {
    setHorarios(horarios.filter((_, i) => i !== index));
  };

  const guardarAsignacion = async () => {
    setMensaje("");
    setError("");

    if (!doctorSeleccionado) {
      setError("Selecciona un doctor.");
      return;
    }
    if (!consultorioSeleccionado) {
      setError("Selecciona un consultorio.");
      return;
    }
    if (horarios.length === 0) {
      setError("Agrega al menos un horario.");
      return;
    }

    setGuardando(true);
    try {
      await axios.post(`${API_URL}/asignar-doctor-consultorio`, {
        doctor_id: doctorSeleccionado,
        consultorio_id: consultorioSeleccionado,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        horarios
      });

      setMensaje("Asignación guardada correctamente");
      // Limpiar formulario tras guardar
      setDoctorSeleccionado("");
      setConsultorioSeleccionado("");
      setFechaInicio("");
      setFechaFin("");
      setHorarios([]);
    } catch (err) {
      console.error(err);
      setError("Error al guardar la asignación.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        <div className="page-consultorio">

          <div className="consultorio-header">
            <h2>👨‍⚕️ Asignar Doctor a Consultorio</h2>
            <p>Configura horarios y espacios médicos</p>
          </div>

          {mensaje && <Alert variant="success">{mensaje}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}

          {cargando ? (
            <div className="text-center my-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              <Card className="card-modern-consultorio p-4 mb-4">

                <h5 className="mb-4">Selecciona un Doctor</h5>

                {doctores.length === 0 ? (
                  <p className="text-muted">No hay doctores registrados.</p>
                ) : (
                  <Row className="g-3">
                    {doctoresPaginados.map((doctor) => (
                      <Col md={4} key={doctor.id}>
                        <Card
                          className={`doctor-card p-3 ${
                            doctorSeleccionado === doctor.id ? "selected" : ""
                          }`}
                          onClick={() => setDoctorSeleccionado(doctor.id)}
                        >
                          <h5>{doctor.usuario?.nombre}</h5>
                          <p className="text-muted mb-0">
                            {doctor.especialidad?.nombre || "General"}
                          </p>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}

                {totalPaginas > 1 && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.Prev
                        disabled={paginaActual === 1}
                        onClick={() => setPaginaActual(paginaActual - 1)}
                      />
                      {[...Array(totalPaginas)].map((_, i) => (
                        <Pagination.Item
                          key={i}
                          active={paginaActual === i + 1}
                          onClick={() => setPaginaActual(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        disabled={paginaActual === totalPaginas}
                        onClick={() => setPaginaActual(paginaActual + 1)}
                      />
                    </Pagination>
                  </div>
                )}
              </Card>

              <Card className="card-modern-consultorio p-4 mb-4">
                <Form.Label>Consultorio</Form.Label>
                <Form.Select
                  value={consultorioSeleccionado}
                  onChange={(e) => setConsultorioSeleccionado(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  {consultorios.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Card>

              <Card className="card-modern-consultorio p-4 mb-4">
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Fecha de inicio</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaInicio}
                      onChange={(e) => setFechaInicio(e.target.value)}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label>Fecha de fin</Form.Label>
                    <Form.Control
                      type="date"
                      value={fechaFin}
                      min={fechaInicio || undefined}
                      onChange={(e) => setFechaFin(e.target.value)}
                    />
                  </Col>
                </Row>
              </Card>

              <Card className="card-modern-consultorio p-4">

                <h5>Horarios</h5>

                <Row className="g-3">
                  <Col md={4}>
                    <Form.Select
                      value={horario.dia_semana}
                      onChange={(e) =>
                        setHorario({ ...horario, dia_semana: e.target.value })
                      }
                    >
                      <option value="">Día</option>
                      <option value="1">Lunes</option>
                      <option value="2">Martes</option>
                      <option value="3">Miércoles</option>
                      <option value="4">Jueves</option>
                      <option value="5">Viernes</option>
                      <option value="6">Sábado</option>
                      <option value="7">Domingo</option>
                    </Form.Select>
                  </Col>

                  <Col md={3}>
                    <Form.Control
                      type="time"
                      value={horario.hora_inicio}
                      onChange={(e) =>
                        setHorario({ ...horario, hora_inicio: e.target.value })
                      }
                    />
                  </Col>

                  <Col md={3}>
                    <Form.Control
                      type="time"
                      value={horario.hora_fin}
                      onChange={(e) =>
                        setHorario({ ...horario, hora_fin: e.target.value })
                      }
                    />
                  </Col>

                  <Col md={2}>
                    <Button className="btn-primary-modern w-100" onClick={agregarHorario}>
                      +
                    </Button>
                  </Col>
                </Row>

                <div className="mt-4">
                  {horarios.length === 0 ? (
                    <p className="text-muted">Aún no has agregado horarios.</p>
                  ) : (
                    horarios.map((h, index) => (
                      <Badge bg="primary" key={index} className="me-2 mb-2 p-3">
                        {h.dia_semana} | {h.hora_inicio}-{h.hora_fin}
                        <span
                          style={{ marginLeft: "10px", cursor: "pointer" }}
                          onClick={() => eliminarHorario(index)}
                        >
                          ✕
                        </span>
                      </Badge>
                    ))
                  )}
                </div>
              </Card>

              <div className="text-end mt-4">
                <Button
                  className="btn-primary-modern"
                  onClick={guardarAsignacion}
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar Asignación"}
                </Button>
              </div>
            </>
          )}

        </div>

      </div>

    </div>
  );
}
