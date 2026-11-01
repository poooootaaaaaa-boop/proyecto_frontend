import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Activity,
  ArrowLeft,
  BedDouble,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  FileDown,
  Loader2,
  Pill,
  RefreshCw,
  Search,
  Stethoscope,
  Wallet,
} from "lucide-react";
import Layout_Medicos from "./Layout_Medicos";
import "./Estancias.css";

const API_URL = import.meta.env.VITE_API_URL;

const TIPOS = [
  { value: "evolucion", label: "Evolución" },
  { value: "procedimiento", label: "Procedimiento" },
  { value: "observacion", label: "Observación médica" },
];
const CATEGORIAS = [
  { value: "medicamento", label: "Medicamento" },
  { value: "suero", label: "Suero" },
  { value: "material_medico", label: "Material médico" },
];

const money = (valor) => Number(valor || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const fechaHora = (valor) => (valor ? new Date(valor).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—");
const errorTexto = (error) =>
  error.response?.data?.message ||
  Object.values(error.response?.data?.errors || {}).flat().join(" ") ||
  "No se pudo completar la operación.";
const nombrePaciente = (item) => item?.paciente?.usuario?.nombre || `Paciente #${item?.paciente_id}`;
const diasEstancia = (item) => {
  if (item?.dias_estancia) return item.dias_estancia;
  if (!item?.fecha_ingreso) return 1;
  const fin = item.fecha_alta ? new Date(item.fecha_alta) : new Date();
  return Math.max(1, Math.ceil((fin - new Date(item.fecha_ingreso)) / 86400000));
};
const iniciales = (nombre = "") =>
  nombre.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "P";

export default function Estancias() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const doctorId = usuario?.doctor_id;

  const [estancias, setEstancias] = useState([]);
  const [estadoLista, setEstadoLista] = useState("Activa");
  const [busqueda, setBusqueda] = useState("");
  const [seleccionId, setSeleccionId] = useState(null);
  const [estancia, setEstancia] = useState(null);
  const [tab, setTab] = useState("resumen");
  const [filtroRegistro, setFiltroRegistro] = useState("todos");
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  const cargarEstancias = useCallback(async () => {
    if (!doctorId) {
      setCargando(false);
      setMensaje({ tipo: "error", texto: "No se encontró el doctor asignado en la sesión." });
      return;
    }
    setCargando(true);
    try {
      const response = await axios.get(`${API_URL}/hospitalizaciones/doctor/${doctorId}/activas`, {
        params: { estado: estadoLista },
      });
      const lista = response.data?.data || [];
      setEstancias(lista);
      setSeleccionId((actual) => (lista.some((item) => item.id === actual) ? actual : null));
      setEstancia((actual) => (actual && lista.some((item) => item.id === actual.id) ? actual : null));
    } catch (error) {
      setMensaje({ tipo: "error", texto: errorTexto(error) });
    } finally {
      setCargando(false);
    }
  }, [doctorId, estadoLista]);

  const cargarDetalle = useCallback(
    async (ocupacion) => {
      if (!ocupacion || !doctorId) return;
      setSeleccionId(ocupacion.id);
      setEstancia(null);
      setTab("resumen");
      setFiltroRegistro("todos");
      setCargandoDetalle(true);
      setMensaje(null);
      try {
        const response = await axios.get(`${API_URL}/hospitalizaciones/${ocupacion.id}/seguimiento`, {
          params: { doctor_id: doctorId },
        });
        setEstancia(response.data?.data || null);
      } catch (error) {
        setSeleccionId(null);
        setMensaje({ tipo: "error", texto: errorTexto(error) });
      } finally {
        setCargandoDetalle(false);
      }
    },
    [doctorId]
  );

  useEffect(() => {
    cargarEstancias();
  }, [cargarEstancias]);

  const volverALista = () => {
    setSeleccionId(null);
    setEstancia(null);
  };

  const listaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return estancias;
    return estancias.filter((item) =>
      `${nombrePaciente(item)} ${item.habitacion?.numero || ""}`.toLowerCase().includes(q)
    );
  }, [estancias, busqueda]);

  const descargarReporte = async () => {
    if (!estancia) return;
    try {
      const response = await axios.get(`${API_URL}/hospitalizaciones/${estancia.id}/reporte-final/pdf`, {
        responseType: "blob",
      });
      const url = URL.createObjectURL(response.data);
      const enlace = document.createElement("a");
      enlace.href = url;
      enlace.download = `reporte-estancia-${estancia.id}.pdf`;
      enlace.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      setMensaje({ tipo: "error", texto: errorTexto(error) });
    }
  };

  const registros = estancia?.registros || [];
  const consumos = estancia?.consumos || [];
  const costosPorCategoria = estancia?.costos_por_categoria || [];
  const total = estancia?.costo_total || 0;
  const ultimaEvolucion = [...registros].reverse().find((item) => item.tipo === "evolucion");
  const registrosOrdenados = [...registros].reverse();
  const registrosVisibles =
    filtroRegistro === "todos" ? registrosOrdenados : registrosOrdenados.filter((item) => item.tipo === filtroRegistro);
  const hayDetalle = Boolean(seleccionId);

  const TABS = [
    { id: "resumen", label: "Resumen", icon: ClipboardList },
    { id: "consumos", label: "Consumos", icon: Pill, count: consumos.length },
    { id: "evolucion", label: "Evolución", icon: Activity, count: registros.length },
  ];

  const renderRegistro = (item) => (
    <article className="estancias-entry" key={item.id}>
      <div className={`estancias-entry-dot is-${item.tipo}`} />
      <div className="estancias-entry-body">
        <div className="estancias-entry-meta">
          <span className={`estancias-tag is-${item.tipo}`}>
            {TIPOS.find((tipo) => tipo.value === item.tipo)?.label || item.tipo}
          </span>
          {item.tipo === "procedimiento" && Number(item.costo) > 0 && (
            <span className="estancias-entry-cost">{money(item.costo)}</span>
          )}
          <time>{fechaHora(item.fecha_hora)}</time>
        </div>
        <p>{item.descripcion}</p>
        <small>
          {item.descripcion?.startsWith("Registro de Farmacia") ? "Farmacia" : item.doctor?.usuario?.nombre || "Doctor"}
        </small>
      </div>
    </article>
  );

  return (
    <Layout_Medicos>
      <main className="estancias-page">
        <header className="estancias-header">
          <div>
            <span className="estancias-kicker">
              <Stethoscope size={14} /> SEGUIMIENTO CLÍNICO
            </span>
            <h1>Estancias de pacientes</h1>
            <p>Consulta la evolución y el consumo de insumos durante la hospitalización.</p>
          </div>
          <button type="button" className="estancias-refresh" onClick={cargarEstancias} disabled={cargando}>
            {cargando ? <Loader2 size={16} className="estancias-spin" /> : <RefreshCw size={16} />}
            <span>Actualizar</span>
          </button>
        </header>

        {mensaje && (
          <div className={`estancias-message is-${mensaje.tipo}`} role="status">
            {mensaje.texto}
          </div>
        )}

        <div className={`estancias-layout ${hayDetalle ? "has-detail" : ""}`}>
          {/* ---------- LISTA ---------- */}
          <aside className="estancias-list-panel">
            <div className="estancias-segmented" role="tablist" aria-label="Estado de estancias">
              {[
                { v: "Activa", l: "Activas" },
                { v: "Alta", l: "Finalizadas" },
              ].map((op) => (
                <button
                  key={op.v}
                  type="button"
                  role="tab"
                  aria-selected={estadoLista === op.v}
                  className={estadoLista === op.v ? "is-on" : ""}
                  onClick={() => setEstadoLista(op.v)}
                >
                  {op.l}
                </button>
              ))}
            </div>

            <label className="estancias-search">
              <Search size={16} />
              <input
                type="search"
                placeholder="Buscar paciente o habitación"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </label>

            <div className="estancias-panel-title">
              <strong>{estadoLista === "Activa" ? "Hospitalizados" : "Estancias finalizadas"}</strong>
              <span className="estancias-count">{listaFiltrada.length}</span>
            </div>

            {cargando ? (
              <div className="estancias-empty">
                <Loader2 className="estancias-spin" size={18} /> Cargando estancias…
              </div>
            ) : listaFiltrada.length === 0 ? (
              <div className="estancias-empty">
                {busqueda
                  ? "Ningún paciente coincide con la búsqueda."
                  : estadoLista === "Activa"
                  ? "No tienes pacientes asignados en estancia activa."
                  : "No hay estancias finalizadas."}
              </div>
            ) : (
              <div className="estancias-patient-list">
                {listaFiltrada.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`estancias-patient ${seleccionId === item.id ? "is-selected" : ""}`}
                    onClick={() => cargarDetalle(item)}
                  >
                    <span className="estancias-avatar">{iniciales(nombrePaciente(item))}</span>
                    <span className="estancias-patient-info">
                      <span className="estancias-patient-name">{nombrePaciente(item)}</span>
                      <span className="estancias-patient-meta">
                        <DoorOpen size={12} /> Hab. {item.habitacion?.numero || "—"}
                        <CalendarDays size={12} /> {diasEstancia(item)} día(s)
                      </span>
                      {item.estado_actual && <span className="estancias-current-state">{item.estado_actual}</span>}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* ---------- DETALLE ---------- */}
          <section className="estancias-detail">
            {!hayDetalle ? (
              <div className="estancias-detail-empty">
                <BedDouble size={34} />
                <strong>Selecciona un paciente</strong>
                <span>Aquí verás su diagnóstico, evolución y consumo de insumos.</span>
              </div>
            ) : cargandoDetalle || !estancia ? (
              <div className="estancias-detail-empty">
                <Loader2 className="estancias-spin" size={26} />
                <span>Cargando expediente de estancia…</span>
              </div>
            ) : (
              <>
                <button type="button" className="estancias-back" onClick={volverALista}>
                  <ArrowLeft size={18} /> Volver a pacientes
                </button>

                <div className="estancias-patient-summary">
                  <div className="estancias-summary-main">
                    <span className="estancias-avatar is-large">{iniciales(nombrePaciente(estancia))}</span>
                    <div>
                      <h2>{nombrePaciente(estancia)}</h2>
                      <span className={`estancias-status ${estancia.estado === "Activa" ? "is-active" : ""}`}>
                        <i /> {estancia.estado}
                      </span>
                    </div>
                  </div>
                  <div className="estancias-facts">
                    <div>
                      <span>Habitación</span>
                      <strong>{estancia.habitacion?.numero ? `Hab. ${estancia.habitacion.numero}` : "Sin habitación"}</strong>
                    </div>
                    <div>
                      <span>Ingreso</span>
                      <strong>{fechaHora(estancia.fecha_ingreso)}</strong>
                    </div>
                    <div>
                      <span>Duración</span>
                      <strong>{diasEstancia(estancia)} día(s)</strong>
                    </div>
                  </div>
                  {estancia.estado === "Alta" && (
                    <button type="button" className="estancias-report-button" onClick={descargarReporte}>
                      <FileDown size={16} /> Descargar reporte final
                    </button>
                  )}
                </div>

                <nav className="estancias-tabs" role="tablist">
                  {TABS.map(({ id, label, icon: Icon, count }) => (
                    <button
                      key={id}
                      type="button"
                      role="tab"
                      aria-selected={tab === id}
                      className={tab === id ? "is-on" : ""}
                      onClick={() => setTab(id)}
                    >
                      <Icon size={16} />
                      <span>{label}</span>
                      {count !== undefined && <em>{count}</em>}
                    </button>
                  ))}
                </nav>

                {/* RESUMEN */}
                {tab === "resumen" && (
                  <div className="estancias-stack">
                    <div className="estancias-current-box">
                      <span>Diagnóstico de ingreso · registrado por Farmacia</span>
                      <p>{estancia.diagnostico || "Sin diagnóstico registrado por Farmacia."}</p>
                    </div>
                    <div className="estancias-current-box is-evolucion">
                      <span>Última evolución</span>
                      <p>{ultimaEvolucion?.descripcion || "Sin evolución registrada"}</p>
                      {ultimaEvolucion && <small>{fechaHora(ultimaEvolucion.fecha_hora)}</small>}
                    </div>

                    <section className="estancias-card">
                      <div className="estancias-section-heading">
                        <h3>
                          <Wallet size={17} /> Costo acumulado
                        </h3>
                        <strong className="estancias-total">{money(total)}</strong>
                      </div>
                      {costosPorCategoria.length > 0 ? (
                        <div className="estancias-cost-groups">
                          {costosPorCategoria.map((item) => (
                            <div key={item.categoria} className={`is-${item.categoria}`}>
                              <span>{CATEGORIAS.find((cat) => cat.value === item.categoria)?.label || item.categoria}</span>
                              <strong>{money(item.total)}</strong>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="estancias-muted">Aún no hay consumos registrados.</p>
                      )}
                    </section>

                    <section className="estancias-card">
                      <div className="estancias-section-heading">
                        <h3>
                          <Activity size={17} /> Actividad reciente
                        </h3>
                        {registros.length > 3 && (
                          <button type="button" className="estancias-link" onClick={() => setTab("evolucion")}>
                            Ver todo
                          </button>
                        )}
                      </div>
                      {registrosOrdenados.length ? (
                        <div className="estancias-timeline">{registrosOrdenados.slice(0, 3).map(renderRegistro)}</div>
                      ) : (
                        <p className="estancias-muted">Sin evolución, procedimientos u observaciones.</p>
                      )}
                    </section>
                  </div>
                )}

                {/* CONSUMOS */}
                {tab === "consumos" && (
                  <section className="estancias-card">
                    <div className="estancias-section-heading">
                      <h3>
                        <Pill size={17} /> Consumo de insumos
                      </h3>
                      <strong className="estancias-total">{money(total)}</strong>
                    </div>
                    {consumos.length ? (
                      <div className="estancias-table-wrap">
                        <table className="estancias-table">
                          <thead>
                            <tr>
                              <th>Fecha</th>
                              <th>Insumo</th>
                              <th>Cantidad</th>
                              <th>Precio unitario</th>
                              <th>Subtotal</th>
                              <th>Médico responsable</th>
                            </tr>
                          </thead>
                          <tbody>
                            {consumos.map((item) => (
                              <tr key={item.id}>
                                <td data-label="Fecha">{fechaHora(item.fecha_hora)}</td>
                                <td data-label="Insumo" className="estancias-cell-main">
                                  {item.insumo?.nombre || "Insumo"}
                                  {item.observaciones && <small>{item.observaciones}</small>}
                                </td>
                                <td data-label="Cantidad">
                                  {item.cantidad} {item.insumo?.unidad_medida}
                                </td>
                                <td data-label="Precio unitario">{money(item.precio_unitario)}</td>
                                <td data-label="Subtotal" className="estancias-cell-strong">
                                  {money(item.subtotal)}
                                </td>
                                <td data-label="Médico">{item.doctor?.usuario?.nombre || "—"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="estancias-muted estancias-center">Aún no hay insumos registrados.</p>
                    )}
                  </section>
                )}

                {/* EVOLUCIÓN */}
                {tab === "evolucion" && (
                  <section className="estancias-card">
                    <div className="estancias-section-heading">
                      <h3>
                        <Activity size={17} /> Evolución y actividades
                      </h3>
                    </div>
                    <div className="estancias-chips">
                      {[{ value: "todos", label: "Todo" }, ...TIPOS].map((op) => (
                        <button
                          key={op.value}
                          type="button"
                          className={filtroRegistro === op.value ? "is-on" : ""}
                          onClick={() => setFiltroRegistro(op.value)}
                        >
                          {op.label}
                        </button>
                      ))}
                    </div>
                    {registrosVisibles.length ? (
                      <div className="estancias-timeline">{registrosVisibles.map(renderRegistro)}</div>
                    ) : (
                      <p className="estancias-muted estancias-center">Sin registros en esta categoría.</p>
                    )}
                  </section>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </Layout_Medicos>
  );
}