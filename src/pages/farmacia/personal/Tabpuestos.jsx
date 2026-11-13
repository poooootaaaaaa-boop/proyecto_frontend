import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Button, Form, Modal, Spinner } from "react-bootstrap";
import { PERSONAL_URL, errMsg, fmtMoney, useAviso } from "./Personalutils.js";
import { Aviso, Cargando, Vacio } from "../Compartidos.jsx";

/** CLIC-386 · Registrar puesto */
const VACIO = { nombre: "", descripcion: "", salario_base: "", activo: true };

export default function TabPuestos({ clinicaId, onCambio }) {
  const [puestos, setPuestos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ show: false, editando: null });
  const [form, setForm] = useState(VACIO);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [borrar, setBorrar] = useState(null);
  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/puestos`, { params: { clinica_id: clinicaId } });
      setPuestos(data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrirNuevo = () => {
    setForm(VACIO);
    setFormError("");
    setModal({ show: true, editando: null });
  };

  const abrirEditar = (p) => {
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || "",
      salario_base: p.salario_base ?? "",
      activo: !!p.activo,
    });
    setFormError("");
    setModal({ show: true, editando: p });
  };

  const cerrar = () => setModal({ show: false, editando: null });
  const cambiar = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
    setFormError("");
  };

  const guardar = async () => {
    if (!form.nombre.trim()) {
      setFormError("El nombre del puesto es obligatorio.");
      return;
    }

    const payload = {
      clinica_id: clinicaId,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      salario_base: form.salario_base === "" ? null : form.salario_base,
      activo: form.activo,
    };

    setSaving(true);
    try {
      if (modal.editando) {
        await axios.put(`${PERSONAL_URL}/puestos/${modal.editando.id}`, payload);
        ok("Puesto actualizado.");
      } else {
        await axios.post(`${PERSONAL_URL}/puestos`, payload);
        ok("Puesto registrado.");
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

  const eliminar = async () => {
    try {
      await axios.delete(`${PERSONAL_URL}/puestos/${borrar.id}`, { params: { clinica_id: clinicaId } });
      ok("Puesto eliminado.");
      setBorrar(null);
      cargar();
    } catch (err) {
      setBorrar(null);
      error(err);
    }
  };

  return (
    <div className="gp-panel">
      <div className="gp-toolbar">
        <div>
          <h5 className="gp-title">Puestos</h5>
          <small className="text-muted">Catálogo de puestos de la clínica</small>
        </div>
        <Button onClick={abrirNuevo}>
          <i className="bi bi-plus-circle me-2"></i>Nuevo puesto
        </Button>
      </div>

      <Aviso aviso={aviso} onClose={limpiar} />

      {loading ? (
        <Cargando />
      ) : puestos.length === 0 ? (
        <Vacio icono="bi-briefcase" texto="Aún no hay puestos registrados." />
      ) : (
        <div className="gp-table-wrap">
          <table className="gp-table">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Descripción</th>
                <th>Salario base</th>
                <th>Empleados activos</th>
                <th>Estado</th>
                <th className="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {puestos.map((p) => (
                <tr key={p.id}>
                  <td className="fw-semibold">{p.nombre}</td>
                  <td className="gp-muted">{p.descripcion || "—"}</td>
                  <td>{fmtMoney(p.salario_base)}</td>
                  <td>{p.empleados_activos}</td>
                  <td>
                    <Badge bg={p.activo ? "success" : "secondary"}>{p.activo ? "Activo" : "Inactivo"}</Badge>
                  </td>
                  <td className="text-end">
                    <Button size="sm" variant="light" className="me-1" onClick={() => abrirEditar(p)} title="Editar">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                    <Button size="sm" variant="outline-danger" onClick={() => setBorrar(p)} title="Eliminar">
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL CREAR / EDITAR */}
      <Modal show={modal.show} onHide={cerrar} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modal.editando ? "Editar puesto" : "Nuevo puesto"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger py-2">{formError}</div>}
          <Form.Group className="mb-3">
            <Form.Label>Nombre *</Form.Label>
            <Form.Control name="nombre" value={form.nombre} onChange={cambiar} maxLength={100} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} name="descripcion" value={form.descripcion} onChange={cambiar} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Salario base mensual (MXN)</Form.Label>
            <Form.Control type="number" min="0" step="0.01" name="salario_base" value={form.salario_base} onChange={cambiar} />
          </Form.Group>
          <Form.Check type="switch" id="puesto-activo" name="activo" label="Puesto activo" checked={form.activo} onChange={cambiar} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrar} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Guardar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={!!borrar} onHide={() => setBorrar(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar puesto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Eliminar el puesto <strong>{borrar?.nombre}</strong>? Si tiene empleados asignados no se podrá eliminar;
          en ese caso desactívalo.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setBorrar(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminar}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}