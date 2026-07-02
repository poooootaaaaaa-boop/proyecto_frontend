import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState, useEffect } from "react";
import { Card, Button, Table, Form, Row, Col, Spinner, Alert } from "react-bootstrap";
import { BoxArrowInRight, BoxArrowLeft, Clock, CalendarCheck } from "react-bootstrap-icons";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function DoctorAttendance() {
  // ID del doctor (En producción lo extraerás de tu AuthContext o LocalStorage)
  const [doctorId] = useState(1); 
  
  const [reloj, setReloj] = useState(new Date());
  const [estadoActual, setEstadoActual] = useState("fuera"); 
  const [historialPersonal, setHistorialPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroFecha, setFilterFecha] = useState("");

  // Reloj de alta precisión actualizado cada segundo
  useEffect(() => {
    const timer = setInterval(() => setReloj(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchHistorialPersonal = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/doctores/${doctorId}/asistencias`, {
        params: { fecha: filtroFecha }
      });
      setHistorialPersonal(res.data.historial);
      setEstadoActual(res.data.estado_actual);
    } catch (err) {
      console.log("Error al cargar historial:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorialPersonal();
  }, [filtroFecha]);

  const marcarAsistencia = async (tipo) => {
    try {
      await axios.post(`${API_URL}/asistencias`, {
        doctor_id: doctorId,
        tipo: tipo
      });
      fetchHistorialPersonal(); // Recargar el estado y la tabla del doctor inmediatamente
    } catch (err) {
      alert("Error al registrar asistencia.");
    }
  };

  return (
    <div className="home-layout">
      <Sidebar />
      <div className="home-content-modern">
        <Topbar />

        <div className="mb-4">
          <h2>Registro de Asistencias - Médico</h2>
          <p className="text-muted">Control de entrada y salida personal con reloj en tiempo real</p>
        </div>

        <Row className="mb-4">
          {/* CONTROL DE MARCAJE CON RELOJ */}
          <Col md={5}>
            <Card className="shadow-sm border-0 text-center p-3 h-100" style={{ backgroundColor: "#fafafa" }}>
              <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                <Clock size={45} className="text-primary mb-3" />
                <h5 className="text-muted mb-1">Hora Local Activa</h5>
                <h1 className="display-5 fw-bold mb-4" style={{ fontFamily: "monospace" }}>
                  {reloj.toLocaleTimeString()}
                </h1>

                {estadoActual === "dentro" ? (
                  <Alert variant="success" className="w-100 mb-4 py-2">
                    🟢 Turno activo (En clínica)
                  </Alert>
                ) : (
                  <Alert variant="danger" className="w-100 mb-4 py-2">
                    🔴 Fuera de turno
                  </Alert>
                )}

                <div className="d-flex gap-3 w-100">
                  <Button
                    variant="success"
                    size="lg"
                    className="w-50 py-3 d-flex align-items-center justify-content-center gap-2"
                    disabled={estadoActual === "dentro"}
                    onClick={() => marcarAsistencia("entrada")}
                  >
                    <BoxArrowInRight size={22} /> Entrada
                  </Button>
                  <Button
                    variant="warning"
                    size="lg"
                    className="w-50 py-3 d-flex align-items-center justify-content-center gap-2 text-white"
                    disabled={estadoActual !== "dentro"}
                    onClick={() => marcarAsistencia("salida")}
                  >
                    <BoxArrowLeft size={22} /> Salida
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* HISTORIAL PERSONAL */}
          <Col md={7}>
            <Card className="shadow-sm border-0 p-3 h-100">
              <Card.Header className="bg-transparent border-0 d-flex justify-content-between align-items-center px-2">
                <h4 className="mb-0 d-flex align-items-center gap-2">
                  <CalendarCheck className="text-muted" /> Mi Reporte de Guardias
                </h4>
                
                <Form.Control
                  type="date"
                  size="sm"
                  style={{ width: "160px" }}
                  value={filtroFecha}
                  onChange={(e) => setFilterFecha(e.target.value)}
                />
              </Card.Header>

              <Card.Body className="p-1" style={{ maxHeight: "350px", overflowY: "auto" }}>
                {loading ? (
                  <div className="text-center py-5"><Spinner animation="border" /></div>
                ) : historialPersonal.length > 0 ? (
                  <Table hover responsive size="sm" className="align-middle mt-2 small">
                    <thead className="table-light">
                      <tr>
                        <th>Fecha</th>
                        <th>Entrada</th>
                        <th>Salida</th>
                        <th>Guardia (Horas)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historialPersonal.map((asis) => (
                        <tr key={asis.id}>
                          <td>{new Date(asis.fecha).toLocaleDateString()}</td>
                          <td>{asis.hora_entrada}</td>
                          <td>{asis.hora_salida || <span className="text-success small">Activo...</span>}</td>
                          <td className="fw-semibold">{asis.horas_trabajadas || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <div className="text-center py-5 text-muted small">No hay asistencias registradas para esta fecha.</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}