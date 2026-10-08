import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import Sidebar from "../../components/farmacia/Sidebar";
import {
  Loader2,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  BedDouble,
  Search,
  X,
  Plus,
  History,
  LogOut,
  ClipboardList,
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  DoorOpen,
  SprayCan,
  Wrench,
  FileText,
  Download,
  Eye,
  ArrowLeftRight,
  Route,
} from "lucide-react";

import "./GestionIngresosEgresos.css";

const API_URL = import.meta.env.VITE_API_URL;

const lista = (res, ...claves) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  for (const k of ["data", ...claves]) if (Array.isArray(d?.[k])) return d[k];
  return [];
};

const errorTexto = (err, fallback) =>
  err?.response?.data?.message ||
  (err?.response?.data?.errors ? Object.values(err.response.data.errors).flat().join(" ") : null) ||
  err?.message ||
  fallback;

// datetime-local necesita "YYYY-MM-DDTHH:mm" en hora local, no UTC
const ahoraLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const hoyISO = () => new Date().toISOString().slice(0, 10);

const inicioMesISO = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
};

const formatoFecha = (valor) => {
  if (!valor) return "—";
  const d = new Date(valor);
  return d.toLocaleString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatoFechaCorta = (valor) => {
  if (!valor) return "—";
  return new Date(valor).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
};

const nombrePaciente = (p) => p?.usuario?.nombre ?? p?.nombre ?? p?.correo ?? (p?.id ? `Paciente #${p.id}` : "—");
const nombreDoctor = (d) => d?.nombre ?? d?.usuario?.nombre ?? d?.correo ?? (d?.id ? `Doctor #${d.id}` : "—");

const CONDICIONES_EGRESO = ["Mejorado", "Curado", "Referido", "Voluntaria", "Fallecido"];

const formIngresoInicial = {
  paciente_id: "",
  habitacion_id: "",
  fecha_ingreso: ahoraLocal(),
  motivo: "",
  diagnostico: "",
  dias_estimados: "",
};

export default function GestionIngresosEgresos() {
  const [tab, setTab] = useState("activos"); // 'activos' | 'reportes'

  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargandoHabitaciones, setCargandoHabitaciones] = useState(true);
  const [doctores, setDoctores] = useState([]);
  const [cargandoDoctores, setCargandoDoctores] = useState(true);

  const [activos, setActivos] = useState([]);
  const [cargandoActivos, setCargandoActivos] = useState(true);
  const [busqueda, setBusqueda] = useState("");

  const [mostrarIngreso, setMostrarIngreso] = useState(false);
  const [formIngreso, setFormIngreso] = useState(formIngresoInicial);
  const [guardandoIngreso, setGuardandoIngreso] = useState(false);

  const [modalAlta, setModalAlta] = useState(null); // ocupación seleccionada
  const formAltaInicial = () => ({
    fecha_alta_medica: ahoraLocal(),
    fecha_salida: ahoraLocal(),
    doctor_alta_id: "",
    diagnostico_egreso: "",
    tratamiento_egreso: "",
    medicamentos_egreso: "",
    recomendaciones: "",
    proxima_consulta: "",
    condicion_egreso: "",
    notas_alta: "",
  });
  const [formAlta, setFormAlta] = useState(formAltaInicial());
  const [guardandoAlta, setGuardandoAlta] = useState(false);

  const [modalHistorial, setModalHistorial] = useState(null); // ocupación (para saber el paciente)
  const [historial, setHistorial] = useState([]);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [reporte, setReporte] = useState(null);
  const [rangoReporte, setRangoReporte] = useState({ desde: inicioMesISO(), hasta: hoyISO() });
  const [cargandoReporte, setCargandoReporte] = useState(false);

  const [actualizandoHabitacion, setActualizandoHabitacion] = useState(null); // id de la habitación en proceso

  const [documentos, setDocumentos] = useState([]);
  const [cargandoDocumentos, setCargandoDocumentos] = useState(false);
  const [busquedaDocumentos, setBusquedaDocumentos] = useState("");
  const [rangoDocumentos, setRangoDocumentos] = useState({ desde: "", hasta: "" });

  const [mensaje, setMensaje] = useState(null);
  const mostrarMensaje = useCallback((tipo, texto) => setMensaje({ tipo, texto }), []);

  // ---------- Traslado de habitación ----------
  const [modalTraslado, setModalTraslado] = useState(null); // ocupación seleccionada
  const [formTraslado, setFormTraslado] = useState({
    habitacion_destino_id: "",
    doctor_id: "",
    motivo: "",
    fecha_traslado: ahoraLocal(),
  });
  const [guardandoTraslado, setGuardandoTraslado] = useState(false);

  const [modalTraslados, setModalTraslados] = useState(null); // ocupación (para ver su historial de traslados)
  const [traslados, setTraslados] = useState([]);
  const [cargandoTraslados, setCargandoTraslados] = useState(false);

  const cargarActivos = useCallback(
    async (q = busqueda) => {
      setCargandoActivos(true);
      try {
        const res = await axios.get(`${API_URL}/hospitalizaciones/activas`, {
          params: q ? { buscar: q } : {},
        });
        setActivos(lista(res));
      } catch (err) {
        mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los pacientes hospitalizados."));
      } finally {
        setCargandoActivos(false);
      }
    },
    [busqueda, mostrarMensaje]
  );

  const cargarHabitaciones = useCallback(async () => {
    setCargandoHabitaciones(true);
    try {
      const res = await axios.get(`${API_URL}/habitaciones`);
      setHabitaciones(lista(res, "habitaciones"));
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudieron cargar las habitaciones."));
    } finally {
      setCargandoHabitaciones(false);
    }
  }, [mostrarMensaje]);

  useEffect(() => {
    cargarActivos("");
    cargarHabitaciones();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let activo = true;
    axios
      .get(`${API_URL}/MostrarPaciente`)
      .then((res) => activo && setPacientes(lista(res, "paciente")))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los pacientes.")))
      .finally(() => activo && setCargandoPacientes(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  useEffect(() => {
    let activo = true;
    axios
      .get(`${API_URL}/doctores-completo`)
      .then((res) => activo && setDoctores(lista(res)))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los doctores.")))
      .finally(() => activo && setCargandoDoctores(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  useEffect(() => {
    const t = setTimeout(() => cargarActivos(busqueda), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busqueda]);

  const habitacionesDisponibles = useMemo(
    () => habitaciones.filter((h) => h.estado === "Disponible"),
    [habitaciones]
  );

  const pacientesSinHospitalizar = useMemo(() => {
    const activosIds = new Set(activos.map((a) => Number(a.paciente_id)));
    return pacientes.filter((p) => !activosIds.has(Number(p.id)));
  }, [pacientes, activos]);

  // ---------- Registrar ingreso ----------
  const abrirIngreso = () => {
    setFormIngreso({ ...formIngresoInicial, fecha_ingreso: ahoraLocal() });
    setMostrarIngreso(true);
  };

  const crearIngreso = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setGuardandoIngreso(true);
    try {
      await axios.post(`${API_URL}/hospitalizaciones`, {
        paciente_id: Number(formIngreso.paciente_id),
        habitacion_id: Number(formIngreso.habitacion_id),
        fecha_ingreso: formIngreso.fecha_ingreso,
        motivo: formIngreso.motivo || null,
        diagnostico: formIngreso.diagnostico || null,
      });
      setMostrarIngreso(false);
      mostrarMensaje("ok", "Ingreso registrado y habitación asignada.");
      cargarActivos();
      cargarHabitaciones();
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo registrar el ingreso."));
    } finally {
      setGuardandoIngreso(false);
    }
  };

  // ---------- Dar de alta ----------
  const abrirAlta = (ocupacion) => {
    setModalAlta(ocupacion);
    setFormAlta(formAltaInicial());
  };

  const confirmarAlta = async (e) => {
    e.preventDefault();
    if (!modalAlta) return;
    setMensaje(null);
    setGuardandoAlta(true);
    try {
      await axios.post(`${API_URL}/hospitalizaciones/${modalAlta.id}/alta`, {
        ...formAlta,
        tratamiento_egreso: formAlta.tratamiento_egreso || null,
        medicamentos_egreso: formAlta.medicamentos_egreso || null,
        recomendaciones: formAlta.recomendaciones || null,
        proxima_consulta: formAlta.proxima_consulta || null,
        notas_alta: formAlta.notas_alta || null,
      });
      mostrarMensaje("ok", "Alta registrada. La habitación quedó libre para limpieza.");
      setModalAlta(null);
      cargarActivos();
      cargarHabitaciones();
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo registrar el alta."));
    } finally {
      setGuardandoAlta(false);
    }
  };

  // ---------- Historial de estancias ----------
  const abrirHistorial = async (ocupacion) => {
    setModalHistorial(ocupacion);
    setCargandoHistorial(true);
    try {
      const res = await axios.get(`${API_URL}/hospitalizaciones/paciente/${ocupacion.paciente_id}/historial`);
      setHistorial(lista(res));
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo cargar el historial."));
    } finally {
      setCargandoHistorial(false);
    }
  };

  // ---------- Reportes ----------
  const generarReporte = useCallback(async () => {
    setCargandoReporte(true);
    setMensaje(null);
    try {
      const res = await axios.get(`${API_URL}/hospitalizaciones/reporte`, { params: rangoReporte });
      setReporte(res.data?.data ?? null);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo generar el reporte."));
    } finally {
      setCargandoReporte(false);
    }
  }, [rangoReporte, mostrarMensaje]);

  useEffect(() => {
    if (tab === "reportes" && !reporte) generarReporte();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ---------- Control manual de habitaciones (limpieza / mantenimiento) ----------
  const cambiarEstadoHabitacion = async (habitacion, nuevoEstado) => {
    setMensaje(null);
    setActualizandoHabitacion(habitacion.id);
    try {
      await axios.patch(`${API_URL}/habitaciones/${habitacion.id}/estado`, { estado: nuevoEstado });
      mostrarMensaje("ok", `Hab. ${habitacion.numero} marcada como ${nuevoEstado}.`);
      cargarHabitaciones();
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo actualizar la habitación."));
    } finally {
      setActualizandoHabitacion(null);
    }
  };

  // ---------- Historial de documentos (consentimientos) ----------
  const [finalizandoDocumento, setFinalizandoDocumento] = useState(null);

  const cargarDocumentos = useCallback(async () => {
    setCargandoDocumentos(true);
    try {
      const params = {};
      if (busquedaDocumentos) params.buscar = busquedaDocumentos;
      if (rangoDocumentos.desde) params.desde = rangoDocumentos.desde;
      if (rangoDocumentos.hasta) params.hasta = rangoDocumentos.hasta;
      const res = await axios.get(`${API_URL}/consentimientos`, { params });
      setDocumentos(lista(res));
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los documentos."));
    } finally {
      setCargandoDocumentos(false);
    }
  }, [busquedaDocumentos, rangoDocumentos, mostrarMensaje]);

  useEffect(() => {
    if (tab === "documentos") cargarDocumentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab !== "documentos") return;
    const t = setTimeout(() => cargarDocumentos(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaDocumentos, rangoDocumentos]);

  const finalizarDocumento = async (consentimiento) => {
    setMensaje(null);
    setFinalizandoDocumento(consentimiento.id);
    try {
      await axios.post(`${API_URL}/consentimientos/${consentimiento.id}/finalizar`);
      mostrarMensaje("ok", `Documento #${consentimiento.id} marcado como Finalizado.`);
      cargarDocumentos();
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo finalizar el documento."));
    } finally {
      setFinalizandoDocumento(null);
    }
  };

  // ---------- Traslado de paciente ----------
  const abrirTraslado = (ocupacion) => {
    setModalTraslado(ocupacion);
    setFormTraslado({
      habitacion_destino_id: "",
      doctor_id: "",
      motivo: "",
      fecha_traslado: ahoraLocal(),
    });
  };

  const confirmarTraslado = async (e) => {
    e.preventDefault();
    if (!modalTraslado) return;
    setMensaje(null);
    setGuardandoTraslado(true);
    try {
      await axios.post(`${API_URL}/hospitalizaciones/${modalTraslado.id}/traslado`, {
        habitacion_destino_id: Number(formTraslado.habitacion_destino_id),
        doctor_id: formTraslado.doctor_id ? Number(formTraslado.doctor_id) : null,
        motivo: formTraslado.motivo || null,
        fecha_traslado: formTraslado.fecha_traslado || null,
      });
      mostrarMensaje("ok", "Paciente trasladado de habitación.");
      setModalTraslado(null);
      cargarActivos();
      cargarHabitaciones();
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo trasladar al paciente."));
    } finally {
      setGuardandoTraslado(false);
    }
  };

  // ---------- Historial de traslados ----------
  const abrirHistorialTraslados = async (ocupacion) => {
    setModalTraslados(ocupacion);
    setCargandoTraslados(true);
    try {
      const res = await axios.get(`${API_URL}/hospitalizaciones/${ocupacion.id}/traslados`);
      setTraslados(lista(res));
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo cargar el historial de traslados."));
    } finally {
      setCargandoTraslados(false);
    }
  };

  return (
    <div className="ie-layout">
      <Sidebar />

      <div className="ie-container">
        <header className="ie-header">
          <div>
            <span className="ie-badge">
              <BedDouble size={13} />
              {activos.length} paciente{activos.length === 1 ? "" : "s"} hospitalizado{activos.length === 1 ? "" : "s"}
            </span>
            <h2>Ingresos y egresos hospitalarios</h2>
            <p>Registra el ingreso, asigna habitación, da de alta y consulta el historial y los reportes.</p>
          </div>
          <button type="button" className="ie-btn-primary" onClick={abrirIngreso}>
            <Plus size={15} />
            Registrar ingreso
          </button>
        </header>

        {mensaje && (
          <div className={`ie-alert ${mensaje.tipo === "ok" ? "is-ok" : "is-error"}`} role="status">
            {mensaje.tipo === "ok" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{mensaje.texto}</span>
            <button type="button" onClick={() => setMensaje(null)} aria-label="Cerrar mensaje">
              <X size={14} />
            </button>
          </div>
        )}

        <nav className="ie-tabs" aria-label="Secciones">
          <button type="button" className={tab === "activos" ? "is-active" : ""} onClick={() => setTab("activos")}>
            <ClipboardList size={15} />
            Hospitalizados
          </button>
          <button type="button" className={tab === "reportes" ? "is-active" : ""} onClick={() => setTab("reportes")}>
            <BarChart3 size={15} />
            Reportes
          </button>
          <button type="button" className={tab === "habitaciones" ? "is-active" : ""} onClick={() => setTab("habitaciones")}>
            <DoorOpen size={15} />
            Habitaciones
          </button>
          <button type="button" className={tab === "documentos" ? "is-active" : ""} onClick={() => setTab("documentos")}>
            <FileText size={15} />
            Documentos
          </button>
        </nav>

        {tab === "activos" && (
          <section className="ie-card">
            <div className="ie-card-header">
              <h3>Pacientes hospitalizados actualmente</h3>
              <div className="ie-search">
                <Search size={14} />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar paciente por nombre"
                />
              </div>
            </div>

            <div className="ie-table-wrap">
              <table className="ie-table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Habitación</th>
                    <th>Ingreso</th>
                    <th>Días</th>
                    <th>Motivo</th>
                    <th className="ie-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoActivos ? (
                    <tr>
                      <td colSpan={6} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : activos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ie-empty">
                        No hay pacientes hospitalizados en este momento.
                      </td>
                    </tr>
                  ) : (
                    activos.map((o) => (
                      <tr key={o.id}>
                        <td className="ie-strong">{nombrePaciente(o.paciente)}</td>
                        <td>
                          {o.habitacion ? (
                            <>
                              Hab. {o.habitacion.numero}
                              {o.habitacion.tipo ? <small className="ie-muted"> · {o.habitacion.tipo}</small> : null}
                            </>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{formatoFecha(o.fecha_ingreso)}</td>
                        <td>
                          <span className="ie-chip">{o.dias_estancia ?? "—"}</span>
                        </td>
                        <td className="ie-muted">{o.motivo || "—"}</td>
                        <td>
                          <div className="ie-actions">
                            <button type="button" className="ie-icon-btn" onClick={() => abrirHistorial(o)} title="Ver historial de estancias">
                              <History size={15} />
                            </button>
                            <button type="button" className="ie-icon-btn" onClick={() => abrirHistorialTraslados(o)} title="Ver historial de traslados">
                              <Route size={15} />
                            </button>
                            <button type="button" className="ie-btn-secondary ie-btn-compact" onClick={() => abrirTraslado(o)}>
                              <ArrowLeftRight size={13} />
                              Trasladar
                            </button>
                            <button type="button" className="ie-btn-secondary ie-btn-compact" onClick={() => abrirAlta(o)}>
                              <LogOut size={13} />
                              Dar de alta
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "reportes" && (
          <section className="ie-card">
            <div className="ie-card-header">
              <h3>Reporte de ingresos y altas</h3>
              <div className="ie-range">
                <input
                  type="date"
                  value={rangoReporte.desde}
                  onChange={(e) => setRangoReporte((r) => ({ ...r, desde: e.target.value }))}
                  className="ie-input ie-input-compact"
                />
                <span>a</span>
                <input
                  type="date"
                  value={rangoReporte.hasta}
                  onChange={(e) => setRangoReporte((r) => ({ ...r, hasta: e.target.value }))}
                  className="ie-input ie-input-compact"
                />
                <button type="button" className="ie-btn-secondary ie-btn-compact" onClick={generarReporte} disabled={cargandoReporte}>
                  {cargandoReporte ? <Loader2 size={13} className="ie-spin" /> : <RefreshCcw size={13} />}
                  Generar
                </button>
              </div>
            </div>

            {reporte && (
              <>
                <div className="ie-stats">
                  <div className="ie-stat">
                    <span className="ie-stat-icon blue">
                      <Users size={18} />
                    </span>
                    <div>
                      <small>Ingresos en el rango</small>
                      <strong>{reporte.total_ingresos}</strong>
                    </div>
                  </div>
                  <div className="ie-stat">
                    <span className="ie-stat-icon green">
                      <CheckCircle2 size={18} />
                    </span>
                    <div>
                      <small>Altas en el rango</small>
                      <strong>{reporte.total_altas}</strong>
                    </div>
                  </div>
                  <div className="ie-stat">
                    <span className="ie-stat-icon amber">
                      <BedDouble size={18} />
                    </span>
                    <div>
                      <small>Hospitalizados ahora</small>
                      <strong>{reporte.hospitalizados_actualmente}</strong>
                    </div>
                  </div>
                  <div className="ie-stat">
                    <span className="ie-stat-icon violet">
                      <Clock size={18} />
                    </span>
                    <div>
                      <small>Promedio de estancia</small>
                      <strong>{reporte.promedio_dias_estancia} días</strong>
                    </div>
                  </div>
                </div>

                {reporte.por_tipo_habitacion?.length > 0 && (
                  <>
                    <h4 className="ie-subtitle">
                      <TrendingUp size={14} /> Ingresos por tipo de habitación
                    </h4>
                    <ul className="ie-bars">
                      {reporte.por_tipo_habitacion.map((r) => {
                        const max = Math.max(...reporte.por_tipo_habitacion.map((x) => x.total), 1);
                        return (
                          <li key={r.tipo || "sin-tipo"}>
                            <span className="ie-bar-label">{r.tipo || "Sin tipo"}</span>
                            <span className="ie-bar-track">
                              <span className="ie-bar-fill" style={{ width: `${(r.total / max) * 100}%` }} />
                            </span>
                            <span className="ie-bar-value">{r.total}</span>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}

                <h4 className="ie-subtitle">Detalle de ingresos</h4>
                <div className="ie-table-wrap">
                  <table className="ie-table">
                    <thead>
                      <tr>
                        <th>Paciente</th>
                        <th>Habitación</th>
                        <th>Ingreso</th>
                        <th>Salida</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reporte.detalle.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="ie-empty">
                            Sin movimientos en este rango de fechas.
                          </td>
                        </tr>
                      ) : (
                        reporte.detalle.map((o) => (
                          <tr key={o.id}>
                            <td>{nombrePaciente(o.paciente)}</td>
                            <td>{o.habitacion ? `Hab. ${o.habitacion.numero}` : "—"}</td>
                            <td>{formatoFechaCorta(o.fecha_ingreso)}</td>
                            <td>{formatoFechaCorta(o.fecha_salida)}</td>
                            <td>
                              <span
                                className={`ie-status ${
                                  o.estado === "Activa" ? "is-active" : o.estado === "Alta" ? "is-done" : "is-off"
                                }`}
                              >
                                {o.estado}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>
        )}

        {tab === "habitaciones" && (
          <section className="ie-card">
            <div className="ie-card-header">
              <h3>Estado de las habitaciones</h3>
              <button type="button" className="ie-btn-secondary ie-btn-compact" onClick={cargarHabitaciones} disabled={cargandoHabitaciones}>
                {cargandoHabitaciones ? <Loader2 size={13} className="ie-spin" /> : <RefreshCcw size={13} />}
                Actualizar
              </button>
            </div>

            <p className="ie-hint ie-hint-block">
              Cuando das de alta a un paciente, la habitación pasa a <strong>Limpieza</strong> y deja de aparecer para
              nuevos ingresos hasta que alguien la marque aquí como lista.
            </p>

            <div className="ie-table-wrap">
              <table className="ie-table">
                <thead>
                  <tr>
                    <th>Habitación</th>
                    <th>Tipo</th>
                    <th>Estado</th>
                    <th className="ie-center">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoHabitaciones ? (
                    <tr>
                      <td colSpan={4} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : habitaciones.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="ie-empty">
                        No hay habitaciones registradas.
                      </td>
                    </tr>
                  ) : (
                    habitaciones.map((h) => {
                      const enProceso = actualizandoHabitacion === h.id;
                      return (
                        <tr key={h.id}>
                          <td className="ie-strong">
                            Hab. {h.numero}
                            {h.piso ? <small className="ie-muted"> · Piso {h.piso}</small> : null}
                          </td>
                          <td className="ie-muted">{h.tipo || "—"}</td>
                          <td>
                            <span
                              className={`ie-status ${
                                h.estado === "Disponible"
                                  ? "is-done"
                                  : h.estado === "Ocupada"
                                  ? "is-active"
                                  : h.estado === "Limpieza"
                                  ? "is-cleaning"
                                  : "is-off"
                              }`}
                            >
                              {h.estado}
                            </span>
                          </td>
                          <td>
                            <div className="ie-actions">
                              {h.estado === "Limpieza" && (
                                <button
                                  type="button"
                                  className="ie-btn-secondary ie-btn-compact"
                                  disabled={enProceso}
                                  onClick={() => cambiarEstadoHabitacion(h, "Disponible")}
                                >
                                  {enProceso ? <Loader2 size={13} className="ie-spin" /> : <SprayCan size={13} />}
                                  Ya está limpia
                                </button>
                              )}
                              {h.estado === "Disponible" && (
                                <button
                                  type="button"
                                  className="ie-btn-secondary ie-btn-compact"
                                  disabled={enProceso}
                                  onClick={() => cambiarEstadoHabitacion(h, "Mantenimiento")}
                                >
                                  {enProceso ? <Loader2 size={13} className="ie-spin" /> : <Wrench size={13} />}
                                  Enviar a mantenimiento
                                </button>
                              )}
                              {h.estado === "Mantenimiento" && (
                                <button
                                  type="button"
                                  className="ie-btn-secondary ie-btn-compact"
                                  disabled={enProceso}
                                  onClick={() => cambiarEstadoHabitacion(h, "Disponible")}
                                >
                                  {enProceso ? <Loader2 size={13} className="ie-spin" /> : <CheckCircle2 size={13} />}
                                  Listo, marcar disponible
                                </button>
                              )}
                              {h.estado === "Ocupada" && <span className="ie-muted">Da de alta al paciente primero</span>}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {tab === "documentos" && (
          <section className="ie-card">
            <div className="ie-card-header">
              <h3>Historial de documentos</h3>
              <div className="ie-range">
                <input
                  type="date"
                  value={rangoDocumentos.desde}
                  onChange={(e) => setRangoDocumentos((r) => ({ ...r, desde: e.target.value }))}
                  className="ie-input ie-input-compact"
                />
                <span>a</span>
                <input
                  type="date"
                  value={rangoDocumentos.hasta}
                  onChange={(e) => setRangoDocumentos((r) => ({ ...r, hasta: e.target.value }))}
                  className="ie-input ie-input-compact"
                />
              </div>
            </div>

            <div className="ie-search" style={{ marginBottom: 14 }}>
              <Search size={14} />
              <input
                type="search"
                value={busquedaDocumentos}
                onChange={(e) => setBusquedaDocumentos(e.target.value)}
                placeholder="Buscar por paciente"
              />
            </div>

            <div className="ie-table-wrap">
              <table className="ie-table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Doctor</th>
                    <th>Formato</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="ie-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoDocumentos ? (
                    <tr>
                      <td colSpan={6} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : documentos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ie-empty">
                        No hay documentos registrados en este rango.
                      </td>
                    </tr>
                  ) : (
                    documentos.map((c) => (
                      <tr key={c.id}>
                        <td className="ie-strong">{nombrePaciente(c.paciente)}</td>
                        <td className="ie-muted">{nombreDoctor(c.doctor)}</td>
                        <td className="ie-muted">{c.formato?.nombre || "—"}</td>
                        <td>{formatoFecha(c.created_at)}</td>
                        <td>
                          <span
                            className={`ie-status ${
                              c.estado === "Finalizado"
                                ? "is-done"
                                : c.estado === "Firmado"
                                ? "is-cleaning"
                                : c.estado === "Cancelado"
                                ? "is-off"
                                : "is-active"
                            }`}
                          >
                            {c.estado || "Pendiente"}
                          </span>
                        </td>
                        <td>
                          <div className="ie-actions">
                            {c.estado !== "Finalizado" && c.estado !== "Cancelado" && (
                              <button
                                type="button"
                                className="ie-btn-secondary ie-btn-compact"
                                disabled={finalizandoDocumento === c.id}
                                onClick={() => finalizarDocumento(c)}
                              >
                                {finalizandoDocumento === c.id ? (
                                  <Loader2 size={13} className="ie-spin" />
                                ) : (
                                  <CheckCircle2 size={13} />
                                )}
                                Finalizar
                              </button>
                            )}
                            <a
                              href={`${API_URL}/consentimientos/${c.id}/pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="ie-icon-btn"
                              title="Ver PDF"
                            >
                              <Eye size={15} />
                            </a>
                            <a
                              href={`${API_URL}/consentimientos/${c.id}/pdf?download=1`}
                              className="ie-icon-btn"
                              title="Descargar PDF"
                            >
                              <Download size={15} />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>

      {/* ---------- Modal: registrar ingreso ---------- */}
      {mostrarIngreso && (
        <div className="ie-overlay" onClick={() => setMostrarIngreso(false)}>
          <div className="ie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>Registrar ingreso</h3>
              <button type="button" onClick={() => setMostrarIngreso(false)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={crearIngreso} className="ie-form">
              <label className="ie-field">
                Paciente
                {cargandoPacientes ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    required
                    value={formIngreso.paciente_id}
                    onChange={(e) => setFormIngreso((p) => ({ ...p, paciente_id: e.target.value }))}
                    className="ie-input"
                  >
                    <option value="">Selecciona un paciente</option>
                    {pacientesSinHospitalizar.map((p) => (
                      <option key={p.id} value={p.id}>
                        {nombrePaciente(p)}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label className="ie-field">
                Habitación
                {cargandoHabitaciones ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    required
                    value={formIngreso.habitacion_id}
                    onChange={(e) => setFormIngreso((p) => ({ ...p, habitacion_id: e.target.value }))}
                    className="ie-input"
                  >
                    <option value="">Selecciona una habitación disponible</option>
                    {habitacionesDisponibles.map((h) => (
                      <option key={h.id} value={h.id}>
                        Hab. {h.numero}
                        {h.piso ? ` · Piso ${h.piso}` : ""}
                        {h.tipo ? ` · ${h.tipo}` : ""}
                      </option>
                    ))}
                  </select>
                )}
                {!cargandoHabitaciones && habitacionesDisponibles.length === 0 && (
                  <span className="ie-hint">No hay habitaciones disponibles ahora mismo.</span>
                )}
              </label>

              <label className="ie-field">
                Fecha y hora de ingreso
                <input
                  type="datetime-local"
                  required
                  value={formIngreso.fecha_ingreso}
                  onChange={(e) => setFormIngreso((p) => ({ ...p, fecha_ingreso: e.target.value }))}
                  className="ie-input"
                />
              </label>

              <label className="ie-field">
                Diagnóstico
                <input
                  type="text"
                  value={formIngreso.diagnostico}
                  onChange={(e) => setFormIngreso((p) => ({ ...p, diagnostico: e.target.value }))}
                  className="ie-input"
                  placeholder="Diagnóstico de ingreso"
                />
              </label>
              <label className="ie-field">
  Días estimados de estancia (opcional)
  <input
    type="number"
    min="1"
    value={formIngreso.dias_estimados}
    onChange={(e) => setFormIngreso((p) => ({ ...p, dias_estimados: e.target.value }))}
    className="ie-input"
    placeholder="Ej. 5"
  />
</label>

              <label className="ie-field">
                Motivo de la hospitalización
                <textarea
                  rows={2}
                  value={formIngreso.motivo}
                  onChange={(e) => setFormIngreso((p) => ({ ...p, motivo: e.target.value }))}
                  className="ie-input"
                  placeholder="Describe por qué se hospitaliza al paciente..."
                />
              </label>

              <div className="ie-modal-actions">
                <button type="button" className="ie-btn-cancel" onClick={() => setMostrarIngreso(false)}>
                  Cancelar
                </button>
                <button type="submit" className="ie-btn-primary" disabled={guardandoIngreso}>
                  {guardandoIngreso && <Loader2 size={14} className="ie-spin" />}
                  Registrar ingreso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Modal: dar de alta ---------- */}
      {modalAlta && (
        <div className="ie-overlay" onClick={() => setModalAlta(null)}>
          <div className="ie-modal ie-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>Dar de alta</h3>
              <button type="button" onClick={() => setModalAlta(null)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>

            <div className="ie-summary">
              <div>
                <small>Paciente</small>
                <strong>{nombrePaciente(modalAlta.paciente)}</strong>
              </div>
              <div>
                <small>Habitación</small>
                <strong>{modalAlta.habitacion ? `Hab. ${modalAlta.habitacion.numero}` : "—"}</strong>
              </div>
              <div>
                <small>Ingreso</small>
                <strong>{formatoFecha(modalAlta.fecha_ingreso)}</strong>
              </div>
            </div>

            <form onSubmit={confirmarAlta} className="ie-form">
              <label className="ie-field">
                Fecha y hora de alta médica
                <input
                  type="datetime-local"
                  required
                  value={formAlta.fecha_alta_medica}
                  onChange={(e) => setFormAlta((f) => ({ ...f, fecha_alta_medica: e.target.value }))}
                  className="ie-input"
                />
                <span className="ie-hint">Cuándo el médico decide que el paciente puede egresar.</span>
              </label>

              <label className="ie-field">
                Fecha y hora de salida real
                <input
                  type="datetime-local"
                  required
                  value={formAlta.fecha_salida}
                  onChange={(e) => setFormAlta((f) => ({ ...f, fecha_salida: e.target.value }))}
                  className="ie-input"
                />
                <span className="ie-hint">Cuándo el paciente físicamente se retira.</span>
              </label>

              <label className="ie-field">
                Médico que autoriza el alta
                {cargandoDoctores ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    required
                    value={formAlta.doctor_alta_id}
                    onChange={(e) => setFormAlta((f) => ({ ...f, doctor_alta_id: e.target.value }))}
                    className="ie-input"
                  >
                    <option value="">Selecciona un doctor</option>
                    {doctores.map((d) => (
                      <option key={d.id} value={d.id}>
                        {nombreDoctor(d)}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label className="ie-field">
                Diagnóstico final
                <input
                  type="text"
                  required
                  value={formAlta.diagnostico_egreso}
                  onChange={(e) => setFormAlta((f) => ({ ...f, diagnostico_egreso: e.target.value }))}
                  className="ie-input"
                  placeholder="Diagnóstico con el que egresa el paciente"
                />
              </label>

              <label className="ie-field">
                Condición del paciente al egresar
                <select
                  required
                  value={formAlta.condicion_egreso}
                  onChange={(e) => setFormAlta((f) => ({ ...f, condicion_egreso: e.target.value }))}
                  className="ie-input"
                >
                  <option value="">Selecciona una condición</option>
                  {CONDICIONES_EGRESO.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="ie-field">
                Tratamiento al egreso
                <textarea
                  rows={2}
                  value={formAlta.tratamiento_egreso}
                  onChange={(e) => setFormAlta((f) => ({ ...f, tratamiento_egreso: e.target.value }))}
                  className="ie-input"
                  placeholder="Indicaciones de tratamiento a seguir en casa"
                />
              </label>

              <label className="ie-field">
                Medicamentos indicados
                <textarea
                  rows={2}
                  value={formAlta.medicamentos_egreso}
                  onChange={(e) => setFormAlta((f) => ({ ...f, medicamentos_egreso: e.target.value }))}
                  className="ie-input"
                  placeholder="Nombre, dosis y frecuencia de cada medicamento"
                />
              </label>

              <label className="ie-field">
                Recomendaciones
                <textarea
                  rows={2}
                  value={formAlta.recomendaciones}
                  onChange={(e) => setFormAlta((f) => ({ ...f, recomendaciones: e.target.value }))}
                  className="ie-input"
                  placeholder="Cuidados, dieta, actividad física, signos de alarma..."
                />
              </label>

              <label className="ie-field">
                Próxima consulta (opcional)
                <input
                  type="date"
                  value={formAlta.proxima_consulta}
                  onChange={(e) => setFormAlta((f) => ({ ...f, proxima_consulta: e.target.value }))}
                  className="ie-input"
                />
              </label>

              <label className="ie-field">
                Notas adicionales (opcional)
                <textarea
                  rows={2}
                  value={formAlta.notas_alta}
                  onChange={(e) => setFormAlta((f) => ({ ...f, notas_alta: e.target.value }))}
                  className="ie-input"
                  placeholder="Cualquier otra observación del alta"
                />
              </label>

              <div className="ie-modal-actions">
                <button type="button" className="ie-btn-cancel" onClick={() => setModalAlta(null)}>
                  Cancelar
                </button>
                <button type="submit" className="ie-btn-primary" disabled={guardandoAlta}>
                  {guardandoAlta && <Loader2 size={14} className="ie-spin" />}
                  Confirmar alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Modal: historial de estancias ---------- */}
      {modalHistorial && (
        <div className="ie-overlay" onClick={() => setModalHistorial(null)}>
          <div className="ie-modal ie-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>Historial de estancias — {nombrePaciente(modalHistorial.paciente)}</h3>
              <button type="button" onClick={() => setModalHistorial(null)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>

            <div className="ie-table-wrap">
              <table className="ie-table">
                <thead>
                  <tr>
                    <th>Habitación</th>
                    <th>Ingreso</th>
                    <th>Salida</th>
                    <th>Estado</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoHistorial ? (
                    <tr>
                      <td colSpan={5} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : historial.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="ie-empty">
                        Sin estancias registradas.
                      </td>
                    </tr>
                  ) : (
                    historial.map((h) => (
                      <tr key={h.id}>
                        <td>{h.habitacion ? `Hab. ${h.habitacion.numero}` : "—"}</td>
                        <td>{formatoFecha(h.fecha_ingreso)}</td>
                        <td>{formatoFecha(h.fecha_salida)}</td>
                        <td>
                          <span
                            className={`ie-status ${
                              h.estado === "Activa" ? "is-active" : h.estado === "Alta" ? "is-done" : "is-off"
                            }`}
                          >
                            {h.estado}
                          </span>
                        </td>
                        <td className="ie-muted">{h.motivo || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Modal: trasladar de habitación ---------- */}
      {modalTraslado && (
        <div className="ie-overlay" onClick={() => setModalTraslado(null)}>
          <div className="ie-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>Trasladar de habitación</h3>
              <button type="button" onClick={() => setModalTraslado(null)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>

            <div className="ie-summary">
              <div>
                <small>Paciente</small>
                <strong>{nombrePaciente(modalTraslado.paciente)}</strong>
              </div>
              <div>
                <small>Habitación actual</small>
                <strong>{modalTraslado.habitacion ? `Hab. ${modalTraslado.habitacion.numero}` : "—"}</strong>
              </div>
            </div>

            <form onSubmit={confirmarTraslado} className="ie-form">
              <label className="ie-field">
                Habitación destino
                {cargandoHabitaciones ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    required
                    value={formTraslado.habitacion_destino_id}
                    onChange={(e) => setFormTraslado((f) => ({ ...f, habitacion_destino_id: e.target.value }))}
                    className="ie-input"
                  >
                    <option value="">Selecciona una habitación disponible</option>
                    {habitacionesDisponibles.map((h) => (
                      <option key={h.id} value={h.id}>
                        Hab. {h.numero}
                        {h.piso ? ` · Piso ${h.piso}` : ""}
                        {h.tipo ? ` · ${h.tipo}` : ""}
                      </option>
                    ))}
                  </select>
                )}
                {!cargandoHabitaciones && habitacionesDisponibles.length === 0 && (
                  <span className="ie-hint">No hay habitaciones disponibles ahora mismo.</span>
                )}
              </label>

              <label className="ie-field">
                Fecha y hora del traslado
                <input
                  type="datetime-local"
                  required
                  value={formTraslado.fecha_traslado}
                  onChange={(e) => setFormTraslado((f) => ({ ...f, fecha_traslado: e.target.value }))}
                  className="ie-input"
                />
                <span className="ie-hint">Cuándo se mueve físicamente al paciente a la nueva habitación.</span>
              </label>

              <label className="ie-field">
                Doctor que autoriza (opcional)
                {cargandoDoctores ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    value={formTraslado.doctor_id}
                    onChange={(e) => setFormTraslado((f) => ({ ...f, doctor_id: e.target.value }))}
                    className="ie-input"
                  >
                    <option value="">Sin especificar</option>
                    {doctores.map((d) => (
                      <option key={d.id} value={d.id}>
                        {nombreDoctor(d)}
                      </option>
                    ))}
                  </select>
                )}
              </label>

              <label className="ie-field">
                Motivo del traslado
                <textarea
                  rows={2}
                  value={formTraslado.motivo}
                  onChange={(e) => setFormTraslado((f) => ({ ...f, motivo: e.target.value }))}
                  className="ie-input"
                  placeholder="Ej. necesita monitoreo en UCI, cambio de piso por disponibilidad..."
                />
              </label>

              <div className="ie-modal-actions">
                <button type="button" className="ie-btn-cancel" onClick={() => setModalTraslado(null)}>
                  Cancelar
                </button>
                <button type="submit" className="ie-btn-primary" disabled={guardandoTraslado}>
                  {guardandoTraslado && <Loader2 size={14} className="ie-spin" />}
                  Confirmar traslado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------- Modal: historial de traslados ---------- */}
      {modalTraslados && (
        <div className="ie-overlay" onClick={() => setModalTraslados(null)}>
          <div className="ie-modal ie-modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="ie-modal-header">
              <h3>Historial de traslados — {nombrePaciente(modalTraslados.paciente)}</h3>
              <button type="button" onClick={() => setModalTraslados(null)} aria-label="Cerrar">
                <X size={16} />
              </button>
            </div>

            <div className="ie-table-wrap">
              <table className="ie-table">
                <thead>
                  <tr>
                    <th>De</th>
                    <th>A</th>
                    <th>Fecha</th>
                    <th>Autorizó</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoTraslados ? (
                    <tr>
                      <td colSpan={5} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : traslados.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="ie-empty">
                        Sin traslados registrados para esta estancia.
                      </td>
                    </tr>
                  ) : (
                    traslados.map((t) => (
                      <tr key={t.id}>
                        <td className="ie-muted">{t.habitacionOrigen ? `Hab. ${t.habitacionOrigen.numero}` : "—"}</td>
                        <td className="ie-strong">{t.habitacionDestino ? `Hab. ${t.habitacionDestino.numero}` : "—"}</td>
                        <td>{formatoFecha(t.fecha_traslado)}</td>
                        <td className="ie-muted">{t.doctor ? nombreDoctor(t.doctor) : "—"}</td>
                        <td className="ie-muted">{t.motivo || "—"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}