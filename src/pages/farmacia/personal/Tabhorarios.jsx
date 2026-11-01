import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Badge, Button, Modal, Spinner, Form } from "react-bootstrap";
import { DIAS, PERSONAL_URL, errMsg, hhmm, horasBloque, iniciales, useAviso } from "./Personalutils.js";
import { Aviso, Cargando, Vacio } from "../Compartidos.jsx";

/** CLIC-387 · Registrar horarios */
const BLOQUE_DEFAULT = { inicio: "08:00", fin: "16:00" };

const vacioSemana = () => Object.fromEntries(DIAS.map((d) => [d.n, []]));

const horasSemana = (horarios) =>
  horarios.reduce((t, h) => t + horasBloque(h.hora_inicio, h.hora_fin), 0);

const fmtHoras = (h) => (Number.isInteger(h) ? `${h} h` : `${h.toFixed(1)} h`);

export default function TabHorarios({ clinicaId, onCambio }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editando, setEditando] = useState(null);
  const [semana, setSemana] = useState(vacioSemana());
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const { aviso, ok, error, limpiar } = useAviso();

  const cargar = useCallback(async () => {
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/horarios`, { params: { clinica_id: clinicaId } });
      setEmpleados(data);
    } catch (err) {
      error(err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, error]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const abrir = (emp) => {
    const s = vacioSemana();
    emp.horarios.forEach((h) => s[h.dia_semana].push({ inicio: hhmm(h.hora_inicio), fin: hhmm(h.hora_fin) }));
    setSemana(s);
    setFormError("");
    setEditando(emp);
  };

  const cerrar = () => setEditando(null);

  const alternarDia = (n, activo) =>
    setSemana((s) => ({ ...s, [n]: activo ? [{ ...BLOQUE_DEFAULT }] : [] }));

  const cambiarBloque = (n, i, campo, valor) =>
    setSemana((s) => ({ ...s, [n]: s[n].map((b, j) => (j === i ? { ...b, [campo]: valor } : b)) }));

  const agregarBloque = (n) =>
    setSemana((s) => ({ ...s, [n]: [...s[n], { inicio: "16:00", fin: "20:00" }] }));

  const quitarBloque = (n, i) =>
    setSemana((s) => ({ ...s, [n]: s[n].filter((_, j) => j !== i) }));

  const aplicarLunesViernes = () =>
    setSemana((s) => {
      const base = s[1][0] || BLOQUE_DEFAULT;
      return Object.fromEntries(
        DIAS.map((d) => [d.n, d.n <= 5 ? [{ ...base }] : []])
      );
    });

  const aplanar = () =>
    DIAS.flatMap((d) =>
      semana[d.n].map((b) => ({ dia_semana: d.n, hora_inicio: b.inicio, hora_fin: b.fin }))
    );

  const totalEditor = aplanar().reduce((t, h) => t + horasBloque(h.hora_inicio, h.hora_fin), 0);

  const guardar = async () => {
    const horarios = aplanar();
    if (horarios.some((h) => !h.hora_inicio || !h.hora_fin)) {
      setFormError("Completa la hora de inicio y fin de todos los turnos.");
      return;
    }
    if (horarios.some((h) => h.hora_inicio === h.hora_fin)) {
      setFormError("La hora de inicio y fin no pueden ser iguales.");
      return;
    }

    setSaving(true);
    try {
      await axios.put(`${PERSONAL_URL}/empleados/${editando.id}/horarios`, {
        clinica_id: clinicaId,
        horarios,
      });
      ok(`Horario de ${editando.nombre_completo} guardado.`);
      cerrar();
      cargar();
      onCambio?.();
    } catch (err) {
      setFormError(errMsg(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="gp-panel">
      <div className="gp-toolbar">
        <div>
          <h5 className="gp-title">Horarios</h5>
          <small className="text-muted">Horario semanal del personal activo. Se permiten turnos nocturnos (ej. 22:00 – 06:00).</small>
        </div>
      </div>

      <Aviso aviso={aviso} onClose={limpiar} />

      {loading ? (
        <Cargando />
      ) : empleados.length === 0 ? (
        <Vacio icono="bi-clock" texto="No hay empleados activos. Registra empleados primero." />
      ) : (
        <div className="gp-table-wrap">
          <table className="gp-table gp-horarios">
            <thead>
              <tr>
                <th>Empleado</th>
                {DIAS.map((d) => (
                  <th key={d.n} className="text-center">
                    {d.corto}
                  </th>
                ))}
                <th className="text-center">Total</th>
                <th className="text-end"></th>
              </tr>
            </thead>
            <tbody>
              {empleados.map((e) => (
                <tr key={e.id}>
                  <td>
                    <div className="gp-persona">
                      <span className="gp-avatar">{iniciales(e.nombre, e.apellidos)}</span>
                      <div>
                        <div className="fw-semibold">{e.nombre_completo}</div>
                        <small className="gp-muted">{e.puesto?.nombre || "Sin puesto"}</small>
                      </div>
                    </div>
                  </td>
                  {DIAS.map((d) => {
                    const bloques = e.horarios.filter((h) => h.dia_semana === d.n);
                    return (
                      <td key={d.n} className="text-center">
                        {bloques.length === 0 ? (
                          <span className="gp-muted">—</span>
                        ) : (
                          bloques.map((b) => (
                            <div key={b.id} className="gp-turno">
                              {hhmm(b.hora_inicio)}–{hhmm(b.hora_fin)}
                            </div>
                          ))
                        )}
                      </td>
                    );
                  })}
                  <td className="text-center">
                    {e.horarios.length === 0 ? (
                      <Badge bg="warning" text="dark">Sin horario</Badge>
                    ) : (
                      <strong>{fmtHoras(horasSemana(e.horarios))}</strong>
                    )}
                  </td>
                  <td className="text-end">
                    <Button size="sm" variant="light" onClick={() => abrir(e)} title="Editar horario">
                      <i className="bi bi-pencil-square"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* EDITOR */}
      <Modal show={!!editando} onHide={cerrar} size="lg" centered scrollable>
        <Modal.Header closeButton>
          <Modal.Title>Horario · {editando?.nombre_completo}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formError && <div className="alert alert-danger py-2">{formError}</div>}

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
            <Button size="sm" variant="outline-primary" onClick={aplicarLunesViernes}>
              Aplicar lunes a viernes {(semana[1][0] || BLOQUE_DEFAULT).inicio}–{(semana[1][0] || BLOQUE_DEFAULT).fin}
            </Button>
            <span className="gp-muted">
              Total semanal: <strong>{fmtHoras(totalEditor)}</strong>
            </span>
          </div>

          {DIAS.map((d) => (
            <div key={d.n} className="gp-dia-row">
              <Form.Check
                type="switch"
                id={`dia-${d.n}`}
                className="gp-dia-nombre"
                label={d.largo}
                checked={semana[d.n].length > 0}
                onChange={(e) => alternarDia(d.n, e.target.checked)}
              />
              <div className="gp-dia-bloques">
                {semana[d.n].length === 0 ? (
                  <span className="gp-muted">Descanso</span>
                ) : (
                  semana[d.n].map((b, i) => (
                    <div key={i} className="gp-bloque">
                      <Form.Control type="time" size="sm" value={b.inicio} onChange={(e) => cambiarBloque(d.n, i, "inicio", e.target.value)} />
                      <span>a</span>
                      <Form.Control type="time" size="sm" value={b.fin} onChange={(e) => cambiarBloque(d.n, i, "fin", e.target.value)} />
                      {semana[d.n].length > 1 && (
                        <Button size="sm" variant="outline-danger" onClick={() => quitarBloque(d.n, i)} title="Quitar turno">
                          <i className="bi bi-x-lg"></i>
                        </Button>
                      )}
                    </div>
                  ))
                )}
                {semana[d.n].length > 0 && semana[d.n].length < 3 && (
                  <Button size="sm" variant="link" className="p-0" onClick={() => agregarBloque(d.n)}>
                    + turno
                  </Button>
                )}
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={cerrar} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={guardar} disabled={saving}>
            {saving ? <Spinner size="sm" /> : "Guardar horario"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}