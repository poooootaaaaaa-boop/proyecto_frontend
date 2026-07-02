import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState, useEffect } from "react";
import { Card, Table, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { CalendarRange, ClockHistory, ShieldCheck, HourglassSplit } from "react-bootstrap-icons";
import axios from "axios";

export default function ClinicAttendance() {
  const [asistencias, setAsistencias] = useState([]);
  const [especialidades, setEspecialidades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros dinámicos
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [buscarDoctor, setBuscarDoctor] = useState("");
  const [filterEspecialidad, setFilterEspecialidad] = useState("");

  const fetchAsistenciasGlobales = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/clinic/asistencias", {
        params: {
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        }
      });
      setAsistencias(res.data);
    } catch (err) {
      console.log("Error al cargar asistencias de clínica:", err);
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
    fetchAsistenciasGlobales();
  }, [fechaInicio, fechaFin]);

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  const asistenciasFiltradas = asistencias.filter((asis) => {
    const matchesDoctor = asis.doctor?.usuario?.nombre
      ?.toLowerCase()
      .includes(buscarDoctor.toLowerCase());
    
    const matchesEspecialidad = filterEspecialidad
      ? String(asis.doctor?.especialidad_id) === String(filterEspecialidad)
      : true;

    return matchesDoctor && matchesEspecialidad;
  });

  const totalRegistros = asistenciasFiltradas.length;
  const activasAhora = asistenciasFiltradas.filter(a => !a.hora_salida).length;
  const completadas = totalRegistros - activasAhora;

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-content-modern">
        <Topbar />

        <div className="mb-4">
          <h2>Consolidado de Asistencias - Clínica</h2>
          <p className="text-muted">Análisis, reportes de turnos y control de guardias de todo el personal médico</p>
        </div>

        {/* TABLERO DE MÉTRICAS */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="shadow-sm border-0 text-center p-2" style={{ borderLeft: "5px solid #00BCD4" }}>
              <Card.Body>
                <ClockHistory size={28} className="text-info mb-2" />
                <Card.Title className="text-muted small">Total Eventos</Card.Title>
                <h4>{totalRegistros} Registros</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 text-center p-2" style={{ borderLeft: "5px solid #4CAF50" }}>
              <Card.Body>
                <ShieldCheck size={28} className="text-success mb-2" />
                <Card.Title className="text-muted small">Guardias Activas</Card.Title>
                <h4 className="text-success">{activasAhora} Doctores Dentro</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 text-center p-2" style={{ borderLeft: "5px solid #9C27B0" }}>
              <Card.Body>
                <HourglassSplit size={28} className="text-purple mb-2" style={{ color: "#9C27B0" }} />
                <Card.Title className="text-muted small">Turnos Completados</Card.Title>
                <h4>{completadas} Salidas</h4>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="shadow-sm border-0 text-center p-2" style={{ borderLeft: "5px solid #FF9800" }}>
              <Card.Body>
                <CalendarRange size={28} className="text-warning mb-2" />
                <Card.Title className="text-muted small">Rango Activo</Card.Title>
                <h4 className="small text-truncate">
                  {fechaInicio || "Inicio"} a {fechaFin || "Hoy"}
                </h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* FILTROS DE RANGO DE FECHAS */}
        <Card className="p-3 mb-4 border-0 shadow-sm">
          <Form>
            <Row className="g-3">
              <Col md={3}>
                <Form.Label className="small text-muted">Desde</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Hasta</Form.Label>
                <Form.Control
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Buscar Doctor</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ej: Dr. Erick..."
                  value={buscarDoctor}
                  onChange={(e) => setBuscarDoctor(e.target.value)}
                />
              </Col>
              <Col md={3}>
                <Form.Label className="small text-muted">Especialidad</Form.Label>
                <Form.Select
                  value={filterEspecialidad}
                  onChange={(e) => setFilterEspecialidad(e.target.value)}
                >
                  <option value="">Todas</option>
                  {especialidades.map(esp => (
                    <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Form>
        </Card>

        {/* HISTORIAL GENERAL */}
        <Card className="border-0 shadow-sm p-4">
          <div className="table-responsive">
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Doctor</th>
                  <th>Especialidad</th>
                  <th>Hora Entrada</th>
                  <th>Hora Salida</th>
                  <th>Horas Guardadas</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <Spinner animation="border" />
                    </td>
                  </tr>
                ) : asistenciasFiltradas.length > 0 ? (
                  asistenciasFiltradas.map((asis) => (
                    <tr key={asis.id}>
                      <td>{new Date(asis.fecha).toLocaleDateString()}</td>
                      <td style={{ fontWeight: "600" }}>{asis.doctor?.usuario?.nombre}</td>
                      <td>{asis.doctor?.especialidad?.nombre || "Medicina General"}</td>
                      <td>{asis.hora_entrada}</td>
                      <td>{asis.hora_salida || "—"}</td>
                      <td>{asis.horas_trabajadas || "En curso..."}</td>
                      <td>
                        {asis.hora_salida ? (
                          <Badge bg="secondary">Completado</Badge>
                        ) : (
                          <Badge bg="success">En Turno</Badge>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center text-muted py-4">
                      No se encontraron registros bajo este filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card>
      </div>
    </div>
  );
}