import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Button, Col, Form, Modal, Row, Spinner } from "react-bootstrap";
import {
  ESTADOS_SOLICITUD,
  PERSONAL_URL,
  TIPOS_PERMISO,
  errMsg,
  fmtRango,
  getUsuario,
  useAviso,
  useEmpleados,
} from "./Personalutils.js";
import { Aviso, Cargando, ResolverModal, Vacio } from "../Compartidos.jsx";

/** CLIC-388 · Registrar permisos */
const hoy = () => new Date().toISOString().slice(0, 10);
const VACIO = { empleado_id: "", tipo: "personal", fecha_inicio: "", fecha_fin: "", con_goce_sueldo: true, motivo: "" };

const diasNaturales = (ini, fin) =>
  ini && fin && fin >= ini ? Math.round((new Date(fin) - new Date(ini)) / 86400000) + 1 : 0;

export default function TabPermisos({ clinicaId, onCambio }) {
  const usuario = getUsuario();
  const { empleados } = useEmpleados(clinicaId, "activo");

  const [permisos, setPermisos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroEmpleado, setFiltroEmpleado] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [resolver, setResolver] = useState(null); // { permiso, accion }
  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/permisos`, {
        params: {
          clinica_id: clinicaId,
          estado: filtroEstado || undefined,
          empleado_id: filtroEmpleado || undefined,
        },
      });
      setPermisos(data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, filtroEstado, filtroEmpleado, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirNuevo = () => {
    setForm({ ...VACIO, fecha_inicio: hoy(), fecha_fin: hoy() });
    setFormError("");
    setShowForm(true);
  };

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => {
      const next = { ...f, [name]: type === "checkbox" ? checked : value };
      if (name === "fecha_inicio" && next.fecha_fin < value) next.fecha_fin = value;
      return next;
    });
    setFormError("");
  };

  const guardar = async () => {
    if (!form.empleado_id || !form.fecha_inicio || !form.fecha_fin) {
      setFormError("Selecciona el empleado y las fechas del permiso.");
      return;
    }
    if (form.fecha_fin < form.fecha_inicio) {
      setFormError("La fecha fin no puede ser anterior a la de inicio.");
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${PERSONAL_URL}/permisos`, { ...form, clinica_id: clinicaId });
      ok("Permiso registrado. Queda pendiente de aprobación.");
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
      await axios.post(`${PERSONAL_URL}/permisos/${resolver.permiso.id}/resolver`, {
        clinica_id: clinicaId,
        estado: resolver.accion,
        observaciones: observaciones || null,
        registrado_por: usuario?.id ?? null,
      });
      ok(`Permiso ${resolver.accion}.`);
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
          <h5 className="gp-title">Permisos</h5>
          <small className="text-muted">Solicitudes de permiso del personal y su aprobación</small>
        </div>
        <Button onClick={abrirNuevo} disabled={empleados.length === 0}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo permiso
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
      ) : permisos.length === 0 ? (
        <Vacio icono="bi-file-earmark-check" texto="No hay permisos registrados." />
      ) : (
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Tipo</th>
                <th>Fechas</th>
                <th>Días</th>
                <th>Estado</th>
                <th>Motivo / observaciones</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {permisos.map((p) => {
                const est = ESTADOS_SOLICITUD[p.estado];
                return (
                  <tr key={p.id}>
                    <td>
                      <div className="fw-semibold">{p.empleado?.nombre_completo}</div>
                      <small className="gp-muted">{p.empleado?.puesto?.nombre || p.empleado?.numero_empleado}</small>
                    </td>
                    <td>
                      {TIPOS_PERMISO[p.tipo]}
                      <br />
                      <small className="gp-muted">{p.con_goce_sueldo ? "Con goce de sueldo" : "Sin goce de sueldo"}</small>
                    </td>
                    <td>{fmtRango(p.fecha_inicio, p.fecha_fin)}</td>
                    <td>{p.dias}</td>
                    <td>
                      <Badge bg={est.bg} text={est.text}>{est.label}</Badge>
                    </td>
                    <td className="gp-muted gp-wrap">
                      {p.motivo || "—"}
                      {p.observaciones && (
                        <div>
                          <em>{p.observaciones}</em>
                        </div>
                      )}
                    </td>
                    <td className="text-end gp-acciones">
                      {p.estado === "pendiente" && (
                        <>
                          <Button size="sm" variant="success" title="Aprobar" onClick={() => setResolver({ permiso: p, accion: "aprobado" })}>
                            <i className="bi bi-check-lg"></i>
                          </Button>
                          <Button size="sm" variant="danger" title="Rechazar" onClick={() => setResolver({ permiso: p, accion: "rechazado" })}>
                            <i className="bi bi-x-lg"></i>
                          </Button>
                        </>
                      )}
                      {(p.estado === "pendiente" || p.estado === "aprobado") && (
                        <Button size="sm" variant="outline-secondary" title="Cancelar" onClick={() => setResolver({ permiso: p, accion: "cancelado" })}>
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

      {/* NUEVO PERMISO */}
      <Modal show={showForm} onHide={() => setShowForm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Nuevo permiso</Modal.Title>
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
          <Form.Group className="mb-3">
            <Form.Label>Tipo de permiso *</Form.Label>
            <Form.Select name="tipo" value={form.tipo} onChange={cambiar}>
              {Object.entries(TIPOS_PERMISO).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
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
          <p className="gp-muted mb-3">
            Duración: <strong>{diasNaturales(form.fecha_inicio, form.fecha_fin)}</strong> día(s) naturales
          </p>
          <Form.Check
            type="switch"
            id="permiso-goce"
            name="con_goce_sueldo"
            label="Con goce de sueldo"
            className="mb-3"
            checked={form.con_goce_sueldo}
            onChange={cambiar}
          />
          <Form.Group>
            <Form.Label>Motivo</Form.Label>
            <Form.Control as="textarea" rows={3} name="motivo" value={form.motivo} onChange={cambiar} maxLength={1000} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowForm(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Registrar permiso"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ResolverModal
        show={!!resolver}
        accion={resolver?.accion}
        busy={saving}
        resumen={
          resolver &&
          `${resolver.permiso.empleado?.nombre_completo} · ${TIPOS_PERMISO[resolver.permiso.tipo]} · ${fmtRango(
            resolver.permiso.fecha_inicio,
            resolver.permiso.fecha_fin
          )}`
        }
        onHide={() => setResolver(null)}
        onConfirm={confirmarResolver}
      />
    </div>
  );
}