import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState, useEffect } from "react";
import { Card, Table, Form, Row, Col, Badge, Spinner } from "react-bootstrap";
import { CalendarRange, ClockHistory, ShieldCheck, HourglassSplit } from "react-bootstrap-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

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
      const res = await axios.get(`${API_URL}/clinic/asistencias`, {
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
      const res = await axios.get(`${API_URL}/especialidades`);
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

        <div className="page-wrapper" style={{ padding: "20px 28px" }}>
          {/* HEADER COMPACTO */}
          <div className="mb-3">
            <h2 className="main-title" style={{ fontSize: "1.5rem", marginBottom: "2px" }}>
              Consolidado de Asistencias - Clínica
            </h2>
            <p className="subtitle" style={{ fontSize: "0.85rem" }}>
              Análisis, reportes de turnos y control de guardias del personal médico
            </p>
          </div>

          {/* TABLERO DE MÉTRICAS OPTIMIZADO */}
          <Row className="mb-3 g-3">
            <Col md={3}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #00BCD4" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Total Eventos
                    </span>
                    <h4 className="m-0" style={{ fontWeight: 800, fontSize: "1.3rem", color: "#0f172a" }}>
                      {totalRegistros} Registros
                    </h4>
                  </div>
                  <div style={{ background: "#e0f7fa", padding: "8px 10px", borderRadius: "10px", color: "#00BCD4" }}>
                    <ClockHistory size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #4CAF50" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Guardias Activas
                    </span>
                    <h4 className="m-0 text-success" style={{ fontWeight: 800, fontSize: "1.3rem" }}>
                      {activasAhora} Dentro
                    </h4>
                  </div>
                  <div style={{ background: "#f0fdf4", padding: "8px 10px", borderRadius: "10px", color: "#4CAF50" }}>
                    <ShieldCheck size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #9C27B0" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Completados
                    </span>
                    <h4 className="m-0" style={{ fontWeight: 800, fontSize: "1.3rem", color: "#9C27B0" }}>
                      {completadas} Salidas
                    </h4>
                  </div>
                  <div style={{ background: "#f3e5f5", padding: "8px 10px", borderRadius: "10px", color: "#9C27B0" }}>
                    <HourglassSplit size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="shadow-sm border-0" style={{ borderRadius: "14px", borderLeft: "4px solid #FF9800" }}>
                <Card.Body className="d-flex align-items-center justify-content-between p-3">
                  <div>
                    <span className="text-muted d-block" style={{ fontSize: "0.75rem", fontWeight: 600, textTransform: "uppercase" }}>
                      Rango Activo
                    </span>
                    <h4 className="m-0 text-truncate" style={{ fontWeight: 700, fontSize: "0.95rem", color: "#d97706" }}>
                      {fechaInicio || "Inicio"} a {fechaFin || "Hoy"}
                    </h4>
                  </div>
                  <div style={{ background: "#fffbebf0", padding: "8px 10px", borderRadius: "10px", color: "#FF9800" }}>
                    <CalendarRange size={22} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* FILTROS DE RANGO DE FECHAS COMPACTOS */}
          <Card className="p-3 mb-3 border-0 shadow-sm" style={{ borderRadius: "14px", background: "#ffffff" }}>
            <Form>
              <Row className="g-2">
                <Col md={3}>
                  <Form.Label className="small text-muted mb-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Desde</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaInicio}
                    style={{ fontSize: "0.85rem", padding: "7px 12px", borderRadius: "10px" }}
                    onChange={(e) => setFechaInicio(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label className="small text-muted mb-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Hasta</Form.Label>
                  <Form.Control
                    type="date"
                    value={fechaFin}
                    style={{ fontSize: "0.85rem", padding: "7px 12px", borderRadius: "10px" }}
                    onChange={(e) => setFechaFin(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label className="small text-muted mb-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Buscar Doctor</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ej: Dr. Erick..."
                    value={buscarDoctor}
                    style={{ fontSize: "0.85rem", padding: "7px 12px", borderRadius: "10px" }}
                    onChange={(e) => setBuscarDoctor(e.target.value)}
                  />
                </Col>
                <Col md={3}>
                  <Form.Label className="small text-muted mb-1" style={{ fontSize: "0.78rem", fontWeight: 600 }}>Especialidad</Form.Label>
                  <Form.Select
                    value={filterEspecialidad}
                    style={{ fontSize: "0.85rem", padding: "7px 12px", borderRadius: "10px" }}
                    onChange={(e) => setFilterEspecialidad(e.target.value)}
                  >
                    <option value="">Todas las especialidades</option>
                    {especialidades.map(esp => (
                      <option key={esp.id} value={esp.id}>{esp.nombre}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Form>
          </Card>

          {/* HISTORIAL GENERAL DENSO Y MODERNO */}
          <div className="card-modern" style={{ padding: "16px 20px", borderRadius: "16px" }}>
            <div className="table-modern">
              <div 
                className="table-header-modern" 
                style={{ 
                  gridTemplateColumns: "1fr 1.5fr 1.2fr 1fr 1fr 1.2fr 0.8fr",
                  padding: "10px 14px",
                  fontSize: "0.75rem"
                }}
              >
                <span>Fecha</span>
                <span>Doctor</span>
                <span>Especialidad</span>
                <span>Hora Entrada</span>
                <span>Hora Salida</span>
                <span>Horas Guardadas</span>
                <span className="text-center">Estado</span>
              </div>

              {loading ? (
                <div className="text-center py-4"><Spinner animation="border" size="sm" color="primary" /></div>
              ) : asistenciasFiltradas.length > 0 ? (
                asistenciasFiltradas.map((asis) => (
                  <div 
                    key={asis.id} 
                    className="table-row-modern" 
                    style={{ 
                      gridTemplateColumns: "1fr 1.5fr 1.2fr 1fr 1fr 1.2fr 0.8fr",
                      alignItems: "center",
                      padding: "10px 14px",
                      fontSize: "0.88rem"
                    }}
                  >
                    <div style={{ color: "#64748b" }}>
                      {new Date(asis.fecha).toLocaleDateString()}
                    </div>
                    <div style={{ fontWeight: "600", color: "#0f172a" }}>
                      {asis.doctor?.usuario?.nombre || "N/A"}
                    </div>
                    <div style={{ color: "#475569" }}>
                      {asis.doctor?.especialidad?.nombre || "Medicina General"}
                    </div>
                    <div style={{ color: "#334155", fontWeight: 500 }}>
                      {asis.hora_entrada}
                    </div>
                    <div style={{ color: "#334155", fontWeight: 500 }}>
                      {asis.hora_salida || "—"}
                    </div>
                    <div style={{ color: "#64748b" }}>
                      {asis.horas_trabajadas || "En curso..."}
                    </div>
                    <div className="text-center">
                      {asis.hora_salida ? (
                        <Badge bg="secondary" style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem" }}>
                          Completado
                        </Badge>
                      ) : (
                        <Badge bg="success" style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.72rem" }}>
                          En Turno
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted" style={{ fontSize: "0.88rem" }}>
                  No se encontraron registros bajo este filtro.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}