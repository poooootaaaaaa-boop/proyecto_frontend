import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import { PERSONAL_URL, TIPOS_HISTORIAL, errMsg, fmtFecha, getUsuario, useAviso, useEmpleados } from "./Personalutils.js";
import { Aviso, Cargando, Vacio } from "../Compartidos.jsx";

/** CLIC-390 · Historial laboral */
const MANUALES = ["reconocimiento", "amonestacion", "capacitacion", "otro"];
const hoy = () => new Date().toISOString().slice(0, 10);

export default function TabHistorial({ clinicaId, empleadoInicial = "" }) {
  const usuario = getUsuario();
  const { empleados } = useEmpleados(clinicaId, ""); // activos y bajas

  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [empleadoId, setEmpleadoId] = useState(empleadoInicial ? String(empleadoInicial) : "");
  const [tipo, setTipo] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ empleado_id: "", tipo: "reconocimiento", fecha: hoy(), descripcion: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/historial`, {
        params: { clinica_id: clinicaId, empleado_id: empleadoId || undefined, tipo: tipo || undefined },
      });
      setEventos(data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, empleadoId, tipo, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirNuevo = () => {
    setForm({ empleado_id: empleadoId, tipo: "reconocimiento", fecha: hoy(), descripcion: "" });
    setFormError("");
    setShowForm(true);
  };

  const cambiar = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setFormError("");
  };

  const guardar = async () => {
    if (!form.empleado_id || !form.fecha || !form.descripcion.trim()) {
      setFormError("Selecciona empleado, fecha y escribe la descripción.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${PERSONAL_URL}/historial`, {
        ...form,
        descripcion: form.descripcion.trim(),
        clinica_id: clinicaId,
        registrado_por: usuario?.id ?? null,
      });
      ok("Evento registrado en el historial.");
      setShowForm(false);
      cargar();
    } catch (err) {
      setFormError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const seleccionado = empleados.find((e) => String(e.id) === String(empleadoId));

  return (
    <div className="gp-panel">
      <div className="gp-toolbar">
        <div>
          <h5 className="gp-title">Historial laboral</h5>
          <small className="text-muted">
            Altas, cambios de puesto/salario, permisos, vacaciones y bajas se registran automáticamente
          </small>
        </div>
        <Button onClick={abrirNuevo} disabled={empleados.length === 0}>
          <i className="bi bi-journal-plus me-2"></i>Registrar evento
        </Button>
      </div>

      <Aviso aviso={aviso} onClose={limpiar} />

      <Row className="g-2 mb-3">
        <Col md={5}>
          <Form.Select value={empleadoId} onChange={(e) => setEmpleadoId(e.target.value)}>
            <option value="">Todos los empleados</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre_completo} · {e.numero_empleado}
                {e.estado === "baja" ? " (baja)" : ""}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos los eventos</option>
            {Object.entries(TIPOS_HISTORIAL).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {seleccionado && (
        <div className="gp-resumen-emp">
          <strong>{seleccionado.nombre_completo}</strong> · {seleccionado.puesto?.nombre || "Sin puesto"} · ingreso{" "}
          {fmtFecha(seleccionado.fecha_ingreso)}
          {seleccionado.estado === "baja" && <Badge bg="secondary" className="ms-2">Baja {fmtFecha(seleccionado.fecha_baja)}</Badge>}
        </div>
      )}

      {loading ? (
        <Cargando />
      ) : eventos.length === 0 ? (
        <Vacio icono="bi-clock-history" texto="No hay eventos en el historial." />
      ) : (
        <ul className="gp-timeline">
          {eventos.map((ev) => {
            const t = TIPOS_HISTORIAL[ev.tipo] || TIPOS_HISTORIAL.otro;
            return (
              <li key={ev.id} className="gp-tl-item">
                <span className={`gp-tl-icono ${t.color}`}>
                  <i className={`bi ${t.icon}`}></i>
                </span>
                <div className="gp-tl-cuerpo">
                  <div className="gp-tl-cabecera">
                    <strong>{t.label}</strong>
                    {!empleadoId && ev.empleado && (
                      <span className="gp-muted">
                        · {ev.empleado.nombre_completo} ({ev.empleado.numero_empleado})
                      </span>
                    )}
                    <span className="gp-tl-fecha">{fmtFecha(ev.fecha)}</span>
                  </div>
                  <p className="mb-1">{ev.descripcion}</p>
                  <small className="gp-muted">{ev.automatico ? "Registro automático" : "Registro manual"}</small>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* REGISTRAR EVENTO MANUAL */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar evento laboral</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger py-2">{formError}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Empleado *</Form.Label>
            <Form.Select name="empleado_id" value={form.empleado_id} onChange={cambiar}>
              <option value="">Selecciona…</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre_completo} · {e.numero_empleado}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Row className="g-3 mb-3">
            <Col>
              <Form.Label>Tipo *</Form.Label>
              <Form.Select name="tipo" value={form.tipo} onChange={cambiar}>
                {MANUALES.map((k) => (
                  <option key={k} value={k}>
                    {TIPOS_HISTORIAL[k].label}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col>
              <Form.Label>Fecha *</Form.Label>
              <Form.Control type="date" name="fecha" value={form.fecha} onChange={cambiar} />
            </Col>
          </Row>
          <Form.Group>
            <Form.Label>Descripción *</Form.Label>
            <Form.Control as="textarea" rows={3} name="descripcion" value={form.descripcion} onChange={cambiar} maxLength={500} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}