import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import {
  ESTADOS_SOLICITUD,
  PERSONAL_URL,
  errMsg,
  fmtFecha,
  fmtRango,
  getUsuario,
  useAviso,
  useEmpleados,
} from "./Personalutils.js";
import { Aviso, Cargando, ResolverModal, Vacio } from "../Compartidos.jsx";

/** CLIC-389 · Registrar vacaciones */
const hoy = () => new Date().toISOString().slice(0, 10);
const VACIO = { empleado_id: "", fecha_inicio: "", fecha_fin: "", comentarios: "" };

export default function TabVacaciones({ clinicaId, onCambio }) {
  const usuario = getUsuario();
  const { empleados } = useEmpleados(clinicaId, "activo");

  const [vacaciones, setVacaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroEmpleado, setFiltroEmpleado] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [saldo, setSaldo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [resolver, setResolver] = useState(null);
  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/vacaciones`, {
        params: {
          clinica_id: clinicaId,
          estado: filtroEstado || undefined,
          empleado_id: filtroEmpleado || undefined,
        },
      });
      setVacaciones(data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, filtroEstado, filtroEmpleado, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // saldo del empleado seleccionado en el formulario
  useEffect(() => {
    if (!showForm || !form.empleado_id) {
      setSaldo(null);
      return;
    }
    let cancelado = false;
    axios
      .get(`${PERSONAL_URL}/empleados/${form.empleado_id}/vacaciones-saldo`, { params: { clinica_id: clinicaId } })
      .then(({ data }) => !cancelado && setSaldo(data))
      .catch(() => !cancelado && setSaldo(null));
    return () => {
      cancelado = true;
    };
  }, [showForm, form.empleado_id, clinicaId]);

  const abrirNuevo = () => {
    setForm({ ...VACIO, fecha_inicio: hoy(), fecha_fin: hoy() });
    setSaldo(null);
    setFormError("");
    setShowForm(true);
  };

  const cambiar = (e) => {
    const { name, value } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      if (name === "fecha_inicio" && next.fecha_fin < value) next.fecha_fin = value;
      return next;
    });
    setFormError("");
  };

  const guardar = async () => {
    if (!form.empleado_id || !form.fecha_inicio || !form.fecha_fin) {
      setFormError("Selecciona el empleado y las fechas de las vacaciones.");
      return;
    }
    setSaving(true);
    try {
      const { data } = await axios.post(`${PERSONAL_URL}/vacaciones`, { ...form, clinica_id: clinicaId });
      ok(data.message);
      setShowForm(false);
      cargar();
      onCambio?.();
    } catch (err) {
      setFormError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const confirmarResolver = async (observaciones) => {
    setSaving(true);
    try {
      await axios.post(`${PERSONAL_URL}/vacaciones/${resolver.vacacion.id}/resolver`, {
        clinica_id: clinicaId,
        estado: resolver.accion,
        observaciones: observaciones || null,
        registrado_por: usuario?.id ?? null,
      });
      ok(`Vacaciones ${{ aprobado: "aprobadas", rechazado: "rechazadas", cancelado: "canceladas" }[resolver.accion]}.`);
      setResolver(null);
      cargar();
      onCambio?.();
    } catch (err) {
      setResolver(null);
      error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gp-panel">
      <div className="gp-toolbar">
        <div>
          <h5 className="gp-title">Vacaciones</h5>
          <small className="text-muted">Días según antigüedad (Ley Federal del Trabajo) y control de solicitudes</small>
        </div>
        <Button onClick={abrirNuevo} disabled={empleados.length === 0}>
          <i className="bi bi-plus-circle me-2"></i>Registrar vacaciones
        </Button>
      </div>

      <Aviso aviso={aviso} onClose={limpiar} />

      <Row className="g-2 mb-3">
        <Col md={5}>
          <Form.Select value={filtroEmpleado} onChange={(e) => setFiltroEmpleado(e.target.value)}>
            <option value="">Todos los empleados</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre_completo}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="">Todos los estados</option>
            {Object.entries(ESTADOS_SOLICITUD).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Cargando />
      ) : vacaciones.length === 0 ? (
        <Vacio icono="bi-sun" texto="No hay vacaciones registradas." />
      ) : (
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Fechas</th>
                <th>Días lab.</th>
                <th>Periodo</th>
                <th>Estado</th>
                <th>Comentarios / observaciones</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {vacaciones.map((v) => {
                const est = ESTADOS_SOLICITUD[v.estado];
                return (
                  <tr key={v.id}>
                    <td>
                      <div className="fw-semibold">{v.empleado?.nombre_completo}</div>
                      <small className="gp-muted">{v.empleado?.puesto?.nombre || v.empleado?.numero_empleado}</small>
                    </td>
                    <td>{fmtRango(v.fecha_inicio, v.fecha_fin)}</td>
                    <td>{v.dias}</td>
                    <td>
                      {v.periodo} año{v.periodo === 1 ? "" : "s"} de antigüedad
                    </td>
                    <td>
                      <Badge bg={est.bg} text={est.text}>{est.label}</Badge>
                    </td>
                    <td className="gp-muted gp-wrap">
                      {v.comentarios || "—"}
                      {v.observaciones && (
                        <div>
                          <em>{v.observaciones}</em>
                        </div>
                      )}
                    </td>
                    <td className="text-end gp-acciones">
                      {v.estado === "pendiente" && (
                        <>
                          <Button size="sm" variant="success" title="Aprobar" onClick={() => setResolver({ vacacion: v, accion: "aprobado" })}>
                            <i className="bi bi-check-lg"></i>
                          </Button>
                          <Button size="sm" variant="danger" title="Rechazar" onClick={() => setResolver({ vacacion: v, accion: "rechazado" })}>
                            <i className="bi bi-x-lg"></i>
                          </Button>
                        </>
                      )}
                      {(v.estado === "pendiente" || v.estado === "aprobado") && (
                        <Button size="sm" variant="outline-secondary" title="Cancelar" onClick={() => setResolver({ vacacion: v, accion: "cancelado" })}>
                          <i className="bi bi-slash-circle"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* REGISTRAR VACACIONES */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Registrar vacaciones</Modal.Title>
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

          {saldo && (
            <div className="gp-saldo">
              <div>
                <small>Antigüedad</small>
                <strong>{saldo.antiguedad_anios} año(s)</strong>
              </div>
              <div>
                <small>Derecho</small>
                <strong>{saldo.derecho} días</strong>
              </div>
              <div>
                <small>Aprobados</small>
                <strong>{saldo.tomados}</strong>
              </div>
              <div>
                <small>Pendientes</small>
                <strong>{saldo.pendientes}</strong>
              </div>
              <div className="gp-saldo-disp">
                <small>Disponibles</small>
                <strong>{saldo.disponibles}</strong>
              </div>
            </div>
          )}
          {saldo && saldo.derecho === 0 && (
            <p className="gp-muted small">
              Aún no cumple 1 año de antigüedad; el derecho se genera el {fmtFecha(saldo.proximo_aniversario)}.
            </p>
          )}

          <Row className="g-3 mb-3">
            <Col>
              <Form.Label>Desde *</Form.Label>
              <Form.Control type="date" name="fecha_inicio" value={form.fecha_inicio} onChange={cambiar} />
            </Col>
            <Col>
              <Form.Label>Hasta *</Form.Label>
              <Form.Control type="date" name="fecha_fin" min={form.fecha_inicio} value={form.fecha_fin} onChange={cambiar} />
            </Col>
          </Row>
          <p className="gp-muted small">Solo se descuentan los días en que el empleado trabaja según su horario (si no tiene horario, lunes a viernes).</p>
          <Form.Group>
            <Form.Label>Comentarios</Form.Label>
            <Form.Control as="textarea" rows={2} name="comentarios" value={form.comentarios} onChange={cambiar} maxLength={1000} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Registrar"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ResolverModal
        show={!!resolver}
        accion={resolver?.accion}
        busy={saving}
        resumen={
          resolver &&
          `${resolver.vacacion.empleado?.nombre_completo} · ${fmtRango(
            resolver.vacacion.fecha_inicio,
            resolver.vacacion.fecha_fin
          )} (${resolver.vacacion.dias} días laborables)`
        }
        onHide={() => setResolver(null)}
        onConfirm={confirmarResolver}
      />
    </div>
  );
}