import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Badge, Button, Col, Form, Modal, Pagination, Row, Spinner } from "react-bootstrap";
import {
  PERSONAL_URL,
  TIPOS_CONTRATO,
  errMsg,
  fmtFecha,
  fmtMoney,
  getUsuario,
  iniciales,
  useAviso,
} from "./Personalutils.js";
import { Aviso, Cargando, Vacio } from "../Compartidos.jsx";

/** CLIC-385 · Registrar empleados */
const POR_PAGINA = 8;

const VACIO = {
  nombre: "",
  apellidos: "",
  fecha_nacimiento: "",
  curp: "",
  rfc: "",
  nss: "",
  correo: "",
  telefono: "",
  direccion: "",
  contacto_emergencia_nombre: "",
  contacto_emergencia_telefono: "",
  puesto_id: "",
  fecha_ingreso: "",
  tipo_contrato: "indeterminado",
  salario_mensual: "",
};

const antiguedad = (e) => {
  const a = e.antiguedad_anios;
  return a >= 1 ? `${a} año${a === 1 ? "" : "s"}` : "< 1 año";
};

export default function TabEmpleados({ clinicaId, onCambio, onVerHistorial }) {
  const usuario = getUsuario();

  const [empleados, setEmpleados] = useState([]);
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [buscar, setBuscar] = useState("");
  const [filtroPuesto, setFiltroPuesto] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("activo");
  const [pagina, setPagina] = useState(1);

  const [modal, setModal] = useState({ show: false, editando: null });
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [bajaDe, setBajaDe] = useState(null);
  const [bajaForm, setBajaForm] = useState({ fecha_baja: "", motivo_baja: "" });
  const [bajaError, setBajaError] = useState("");

  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    try {
      const [emp, pue] = await Promise.all([
        axios.get(`${PERSONAL_URL}/empleados`, { params: { clinica_id: clinicaId } }),
        axios.get(`${PERSONAL_URL}/puestos`, { params: { clinica_id: clinicaId } }),
      ]);
      setEmpleados(emp.data);
      setPuestos(pue.data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  /* ---------- filtros + paginación ---------- */
  const filtrados = useMemo(() => {
    const q = buscar.trim().toLowerCase();
    return empleados.filter((e) => {
      const coincide =
        !q ||
        e.nombre_completo?.toLowerCase().includes(q) ||
        e.numero_empleado?.toLowerCase().includes(q) ||
        e.correo?.toLowerCase().includes(q);
      const porPuesto = !filtroPuesto || String(e.puesto_id) === String(filtroPuesto);
      const porEstado = !filtroEstado || e.estado === filtroEstado;
      return coincide && porPuesto && porEstado;
    });
  }, [empleados, buscar, filtroPuesto, filtroEstado]);

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const visibles = filtrados.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

  useEffect(() => {
    if (pagina > totalPaginas) setPagina(totalPaginas);
  }, [pagina, totalPaginas]);

  /* ---------- crear / editar ---------- */
  const abrirNuevo = () => {
    setForm({ ...VACIO, fecha_ingreso: new Date().toISOString().slice(0, 10) });
    setFormError("");
    setModal({ show: true, editando: null });
  };

  const abrirEditar = (e) => {
    const f = { ...VACIO };
    Object.keys(VACIO).forEach((k) => {
      f[k] = e[k] === null || e[k] === undefined ? "" : String(e[k]).slice(0, k.startsWith("fecha") ? 10 : undefined);
    });
    setForm(f);
    setFormError("");
    setModal({ show: true, editando: e });
  };

  const cerrar = () => setModal({ show: false, editando: null });

  const cambiar = (ev) => {
    const { name, value } = ev.target;
    setForm((f) => {
      const next = { ...f, [name]: value };
      // al elegir puesto en un alta, sugerir el salario base del puesto
      if (name === "puesto_id" && !modal.editando && !f.salario_mensual) {
        const p = puestos.find((x) => String(x.id) === String(value));
        if (p?.salario_base) next.salario_mensual = p.salario_base;
      }
      return next;
    });
    setFormError("");
  };

  const guardar = async () => {
    if (!form.nombre.trim() || !form.apellidos.trim() || !form.puesto_id || !form.fecha_ingreso) {
      setFormError("Nombre, apellidos, puesto y fecha de ingreso son obligatorios.");
      return;
    }

    const payload = { ...form, clinica_id: clinicaId, registrado_por: usuario?.id ?? null };
    setSaving(true);
    try {
      if (modal.editando) {
        await axios.put(`${PERSONAL_URL}/empleados/${modal.editando.id}`, payload);
        ok("Empleado actualizado.");
      } else {
        const { data } = await axios.post(`${PERSONAL_URL}/empleados`, payload);
        ok(`Empleado registrado con número ${data.empleado.numero_empleado}.`);
      }
      cerrar();
      cargar();
      onCambio?.();
    } catch (err) {
      setFormError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- baja / reactivar ---------- */
  const abrirBaja = (e) => {
    setBajaDe(e);
    setBajaForm({ fecha_baja: new Date().toISOString().slice(0, 10), motivo_baja: "" });
    setBajaError("");
  };

  const confirmarBaja = async () => {
    if (!bajaForm.fecha_baja || !bajaForm.motivo_baja.trim()) {
      setBajaError("Indica la fecha y el motivo de la baja.");
      return;
    }
    setSaving(true);
    try {
      await axios.post(`${PERSONAL_URL}/empleados/${bajaDe.id}/baja`, {
        ...bajaForm,
        clinica_id: clinicaId,
        registrado_por: usuario?.id ?? null,
      });
      ok("Empleado dado de baja.");
      setBajaDe(null);
      cargar();
      onCambio?.();
    } catch (err) {
      setBajaError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  const reactivar = async (e) => {
    try {
      await axios.post(`${PERSONAL_URL}/empleados/${e.id}/reactivar`, {
        clinica_id: clinicaId,
        registrado_por: usuario?.id ?? null,
      });
      ok(`${e.nombre_completo} fue reactivado.`);
      cargar();
      onCambio?.();
    } catch (err) {
      error(err);
    }
  };

  const puestosForm = puestos.filter((p) => p.activo || String(p.id) === String(form.puesto_id));

  return (
    <div className="gp-panel">
      <div className="gp-toolbar">
        <div>
          <h5 className="gp-title">Empleados</h5>
          <small className="text-muted">Personal de la clínica (no incluye doctores, que se gestionan en “Doctores”)</small>
        </div>
        <Button onClick={abrirNuevo} disabled={puestos.filter((p) => p.activo).length === 0}>
          <i className="bi bi-person-plus me-2"></i>Registrar empleado
        </Button>
      </div>

      {!loading && puestos.filter((p) => p.activo).length === 0 && (
        <div className="alert alert-warning py-2">
          Primero registra al menos un puesto en la pestaña <strong>Puestos</strong>.
        </div>
      )}

      <Aviso aviso={aviso} onClose={limpiar} />

      <Row className="g-2 mb-3">
        <Col md={5}>
          <Form.Control
            placeholder="Buscar por nombre, número o correo…"
            value={buscar}
            onChange={(e) => {
              setBuscar(e.target.value);
              setPagina(1);
            }}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            value={filtroPuesto}
            onChange={(e) => {
              setFiltroPuesto(e.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos los puestos</option>
            {puestos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPagina(1);
            }}
          >
            <option value="">Todos</option>
            <option value="activo">Activos</option>
            <option value="baja">Bajas</option>
          </Form.Select>
        </Col>
      </Row>

      {loading ? (
        <Cargando />
      ) : visibles.length === 0 ? (
        <Vacio icono="bi-people" texto="No se encontraron empleados." />
      ) : (
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Puesto</th>
                <th>Ingreso</th>
                <th>Teléfono</th>
                <th>Salario</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {visibles.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="gp-persona">
                      <span className="gp-avatar">{iniciales(e.nombre, e.apellidos)}</span>
                      <div>
                        <div className="fw-semibold">{e.nombre_completo}</div>
                        <small className="gp-muted">{e.numero_empleado}</small>
                      </div>
                    </div>
                  </td>
                  <td>{e.puesto?.nombre || <span className="gp-muted">Sin puesto</span>}</td>
                  <td>
                    {fmtFecha(e.fecha_ingreso)}
                    <br />
                    <small className="gp-muted">{antiguedad(e)}</small>
                  </td>
                  <td>{e.telefono || "—"}</td>
                  <td>{fmtMoney(e.salario_mensual)}</td>
                  <td>
                    {e.estado === "activo" ? (
                      <Badge bg="success">Activo</Badge>
                    ) : (
                      <Badge bg="secondary" title={e.motivo_baja || ""}>
                        Baja {fmtFecha(e.fecha_baja)}
                      </Badge>
                    )}
                  </td>
                  <td className="text-end gp-acciones">
                    <Button size="sm" variant="light" title="Historial laboral" onClick={() => onVerHistorial?.(e.id)}>
                      <i className="bi bi-clock-history"></i>
                    </Button>
                    <Button size="sm" variant="light" title="Editar" onClick={() => abrirEditar(e)}>
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    {e.estado === "activo" ? (
                      <Button size="sm" variant="outline-danger" title="Dar de baja" onClick={() => abrirBaja(e)}>
                        <i className="bi bi-person-dash"></i>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline-success" title="Reactivar" onClick={() => reactivar(e)}>
                        <i className="bi bi-arrow-counterclockwise"></i>
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <Pagination>
            {[...Array(totalPaginas)].map((_, i) => (
              <Pagination.Item key={i} active={i + 1 === pagina} onClick={() => setPagina(i + 1)}>
                {i + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      <Modal show={modal.show} onHide={cerrar} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            {modal.editando ? `Editar empleado · ${modal.editando.numero_empleado}` : "Registrar empleado"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger py-2">{formError}</div>}

          <h6 className="gp-section">Datos personales</h6>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Nombre(s) *</Form.Label>
              <Form.Control name="nombre" value={form.nombre} onChange={cambiar} maxLength={100} />
            </Col>
            <Col md={6}>
              <Form.Label>Apellidos *</Form.Label>
              <Form.Control name="apellidos" value={form.apellidos} onChange={cambiar} maxLength={120} />
            </Col>
            <Col md={4}>
              <Form.Label>Fecha de nacimiento</Form.Label>
              <Form.Control type="date" name="fecha_nacimiento" value={form.fecha_nacimiento} onChange={cambiar} max={new Date().toISOString().slice(0, 10)} />
            </Col>
            <Col md={4}>
              <Form.Label>CURP</Form.Label>
              <Form.Control name="curp" value={form.curp} onChange={cambiar} maxLength={18} style={{ textTransform: "uppercase" }} />
            </Col>
            <Col md={2}>
              <Form.Label>RFC</Form.Label>
              <Form.Control name="rfc" value={form.rfc} onChange={cambiar} maxLength={13} style={{ textTransform: "uppercase" }} />
            </Col>
            <Col md={2}>
              <Form.Label>NSS</Form.Label>
              <Form.Control name="nss" value={form.nss} onChange={cambiar} maxLength={11} />
            </Col>
          </Row>

          <h6 className="gp-section">Contacto</h6>
          <Row className="g-3 mb-3">
            <Col md={6}>
              <Form.Label>Correo</Form.Label>
              <Form.Control type="email" name="correo" value={form.correo} onChange={cambiar} />
            </Col>
            <Col md={6}>
              <Form.Label>Teléfono</Form.Label>
              <Form.Control name="telefono" value={form.telefono} onChange={cambiar} maxLength={20} />
            </Col>
            <Col md={12}>
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="direccion" value={form.direccion} onChange={cambiar} />
            </Col>
            <Col md={6}>
              <Form.Label>Contacto de emergencia</Form.Label>
              <Form.Control name="contacto_emergencia_nombre" value={form.contacto_emergencia_nombre} onChange={cambiar} />
            </Col>
            <Col md={6}>
              <Form.Label>Teléfono de emergencia</Form.Label>
              <Form.Control name="contacto_emergencia_telefono" value={form.contacto_emergencia_telefono} onChange={cambiar} maxLength={20} />
            </Col>
          </Row>

          <h6 className="gp-section">Datos laborales</h6>
          <Row className="g-3">
            <Col md={6}>
              <Form.Label>Puesto *</Form.Label>
              <Form.Select name="puesto_id" value={form.puesto_id} onChange={cambiar}>
                <option value="">Selecciona…</option>
                {puestosForm.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Fecha de ingreso *</Form.Label>
              <Form.Control type="date" name="fecha_ingreso" value={form.fecha_ingreso} onChange={cambiar} />
            </Col>
            <Col md={6}>
              <Form.Label>Tipo de contrato</Form.Label>
              <Form.Select name="tipo_contrato" value={form.tipo_contrato} onChange={cambiar}>
                {Object.entries(TIPOS_CONTRATO).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Label>Salario mensual (MXN)</Form.Label>
              <Form.Control type="number" min="0" step="0.01" name="salario_mensual" value={form.salario_mensual} onChange={cambiar} />
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrar} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : modal.editando ? "Guardar cambios" : "Registrar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL BAJA */}
      <Modal show={!!bajaDe} onHide={() => setBajaDe(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Dar de baja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bajaError && <div className="alert alert-danger py-2">{bajaError}</div>}
          <p>
            Se dará de baja a <strong>{bajaDe?.nombre_completo}</strong>. Su historial se conserva y sus permisos o
            vacaciones pendientes se cancelarán.
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Fecha de baja *</Form.Label>
            <Form.Control
              type="date"
              value={bajaForm.fecha_baja}
              onChange={(e) => setBajaForm({ ...bajaForm, fecha_baja: e.target.value })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Motivo *</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              maxLength={255}
              value={bajaForm.motivo_baja}
              onChange={(e) => setBajaForm({ ...bajaForm, motivo_baja: e.target.value })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBajaDe(null)} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmarBaja} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Confirmar baja"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}