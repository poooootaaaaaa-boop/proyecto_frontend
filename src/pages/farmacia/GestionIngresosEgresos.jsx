import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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
  Trash2,
} from "lucide-react";
import FirmaElectronica from "../../components/multiusos/FirmaElectronica.jsx";

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
const TIPOS_DOCUMENTO = ["Consentimiento", "Ingreso", "Alta", "Limpieza", "Traslado", "Reporte estancia"];
const ROLES_FIRMA_TRASLADO = ["Doctor", "Familiar", "Paciente", "Clinica"];
const FIRMAS_TRASLADO_REQUERIDAS = ["Doctor", "Clinica"];

const medicamentoInicial = () => ({ medicamento_id: "", dosis: "", frecuencia: "", duracion: "", instrucciones: "" });

const fechaMasMinutosLocal = (valor, minutos) => {
  if (!valor) return "";
  const fecha = new Date(valor);
  fecha.setMinutes(fecha.getMinutes() + minutos);
  const local = new Date(fecha.getTime() - fecha.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
};

export default function GestionIngresosEgresos() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("activos"); // 'activos' | 'reportes'

  const [habitaciones, setHabitaciones] = useState([]);
  const [cargandoHabitaciones, setCargandoHabitaciones] = useState(true);
  const [doctores, setDoctores] = useState([]);
  const [cargandoDoctores, setCargandoDoctores] = useState(true);
  const [catalogoMedicamentos, setCatalogoMedicamentos] = useState([]);
  const [cargandoMedicamentos, setCargandoMedicamentos] = useState(true);

  const [activos, setActivos] = useState([]);
  const [cargandoActivos, setCargandoActivos] = useState(true);
  const [busqueda, setBusqueda] = useState("");

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
    requiere_cita: false,
    fecha_cita: "",
     doctor_cita_id: "", 
    medicamentos_receta: [],
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
  const [busquedaNombreDocumento, setBusquedaNombreDocumento] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
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
    familiar_nombre: "",
    firmas: Object.fromEntries(ROLES_FIRMA_TRASLADO.map((rol) => [rol, ""])),
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
      .get(`${API_URL}/doctores-completo`)
      .then((res) => activo && setDoctores(lista(res)))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los doctores.")))
      .finally(() => activo && setCargandoDoctores(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  useEffect(() => {
    let activo = true;
    axios
      .get(`${API_URL}/medicamentos`)
      .then((res) => activo && setCatalogoMedicamentos(lista(res)))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los medicamentos.")))
      .finally(() => activo && setCargandoMedicamentos(false));
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

  // ---------- Registrar ingreso ----------
  const abrirIngreso = () => navigate("/farmacia/prueba-consentimiento-firma", { state: { modo: "ingreso" } });

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
    const { requiere_cita, fecha_cita, doctor_cita_id, medicamentos_receta, ...datosAlta } = formAlta;
    await axios.post(`${API_URL}/hospitalizaciones/${modalAlta.id}/alta`, {
      ...datosAlta,
      tratamiento_egreso: datosAlta.tratamiento_egreso || null,
      medicamentos_egreso: datosAlta.medicamentos_egreso || null,
      recomendaciones: datosAlta.recomendaciones || null,
      proxima_consulta: requiere_cita ? fecha_cita.slice(0, 10) : datosAlta.proxima_consulta || null,
      notas_alta: datosAlta.notas_alta || null,
      medicamentos: medicamentos_receta.filter((medicamento) => medicamento.medicamento_id),
      cita_seguimiento: requiere_cita
        ? {
            doctor_id: Number(doctor_cita_id),
            paciente_id: modalAlta.paciente_id,
            fecha_inicio: fecha_cita,
            fecha_fin: fechaMasMinutosLocal(fecha_cita, 30),
          }
        : null,
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

  const agregarMedicamentoAlta = () =>
    setFormAlta((form) => ({ ...form, medicamentos_receta: [...form.medicamentos_receta, medicamentoInicial()] }));

  const actualizarMedicamentoAlta = (indice, campo, valor) =>
    setFormAlta((form) => ({
      ...form,
      medicamentos_receta: form.medicamentos_receta.map((medicamento, i) =>
        i === indice ? { ...medicamento, [campo]: valor } : medicamento
      ),
    }));

  const eliminarMedicamentoAlta = (indice) =>
    setFormAlta((form) => ({
      ...form,
      medicamentos_receta: form.medicamentos_receta.filter((_, i) => i !== indice),
    }));

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
      if (busquedaNombreDocumento) params.nombre = busquedaNombreDocumento;
      if (tipoDocumento) params.tipo_documento = tipoDocumento;
      if (rangoDocumentos.desde) params.desde = rangoDocumentos.desde;
      if (rangoDocumentos.hasta) params.hasta = rangoDocumentos.hasta;
      const [resConsentimientos, resHospitalarios] = await Promise.all([
        axios.get(`${API_URL}/consentimientos`, { params }),
        axios.get(`${API_URL}/hospitalizacion-documentos`, { params }),
      ]);
      const consentimientos = lista(resConsentimientos).map((documento) => ({
        ...documento,
        tipo_documento: "Consentimiento",
        nombre_documento: documento.nombre_documento || documento.titulo || documento.formato?.nombre,
        pdf_url: documento.pdf_url || `${API_URL}/consentimientos/${documento.id}/pdf`,
        download_url: documento.download_url || `${API_URL}/consentimientos/${documento.id}/pdf?download=1`,
      }));
      setDocumentos([...consentimientos, ...lista(resHospitalarios)]);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los documentos."));
    } finally {
      setCargandoDocumentos(false);
    }
  }, [busquedaDocumentos, busquedaNombreDocumento, tipoDocumento, rangoDocumentos, mostrarMensaje]);

  useEffect(() => {
    if (tab === "documentos") cargarDocumentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  useEffect(() => {
    if (tab !== "documentos") return;
    const t = setTimeout(() => cargarDocumentos(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busquedaDocumentos, busquedaNombreDocumento, tipoDocumento, rangoDocumentos]);

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

  const tiposDocumento = TIPOS_DOCUMENTO;

  const documentosFiltrados = useMemo(() => {
    const nombre = busquedaNombreDocumento.trim().toLocaleLowerCase("es");
    return documentos.filter((documento) => {
      const tipo = documento.tipo_documento || documento.tipo || documento.formato?.nombre || "";
      const nombreVisible = documento.nombre_documento || documento.nombre || documento.formato?.nombre || "";
      return (!tipoDocumento || tipo === tipoDocumento) && nombreVisible.toLocaleLowerCase("es").includes(nombre);
    });
  }, [documentos, busquedaNombreDocumento, tipoDocumento]);

  // ---------- Traslado de paciente ----------
  const abrirTraslado = (ocupacion) => {
    setModalTraslado(ocupacion);
    setFormTraslado({
      habitacion_destino_id: "",
      doctor_id: "",
      motivo: "",
      fecha_traslado: ahoraLocal(),
      familiar_nombre: "",
      firmas: Object.fromEntries(ROLES_FIRMA_TRASLADO.map((rol) => [rol, ""])),
    });
  };

  const guardarFirmaTraslado = (rol, firma) =>
    setFormTraslado((form) => ({ ...form, firmas: { ...form.firmas, [rol]: firma } }));

  const confirmarTraslado = async (e) => {
    e.preventDefault();
    if (!modalTraslado) return;
    if (FIRMAS_TRASLADO_REQUERIDAS.some((rol) => !formTraslado.firmas[rol])) {
      mostrarMensaje("error", "Se requieren las firmas del doctor y la clínica.");
      return;
    }
    setMensaje(null);
    setGuardandoTraslado(true);
    try {
      await axios.post(`${API_URL}/hospitalizaciones/${modalTraslado.id}/traslado`, {
        habitacion_destino_id: Number(formTraslado.habitacion_destino_id),
        doctor_id: Number(formTraslado.doctor_id),
        motivo: formTraslado.motivo || null,
        fecha_traslado: formTraslado.fecha_traslado || null,
        familiar_nombre: formTraslado.familiar_nombre || null,
        firmas: formTraslado.firmas,
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

            <div className="ie-document-filters">
              <label className="ie-field">
                Tipo de documento
                <select value={tipoDocumento} onChange={(e) => setTipoDocumento(e.target.value)} className="ie-input">
                  <option value="">Todos los tipos</option>
                  {tiposDocumento.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </label>
              <div className="ie-search">
                <Search size={14} />
                <input
                  type="search"
                  value={busquedaNombreDocumento}
                  onChange={(e) => setBusquedaNombreDocumento(e.target.value)}
                  placeholder="Buscar por nombre del documento"
                  aria-label="Buscar por nombre del documento"
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
                    <th>Tipo</th>
                    <th>Documento</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="ie-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cargandoDocumentos ? (
                    <tr>
                      <td colSpan={7} className="ie-empty">
                        <Loader2 size={16} className="ie-spin" /> Cargando...
                      </td>
                    </tr>
                  ) : documentosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="ie-empty">
                        {documentos.length === 0 ? "No hay documentos registrados en este rango." : "No hay documentos que coincidan con los filtros."}
                      </td>
                    </tr>
                  ) : (
                    documentosFiltrados.map((c) => (
                      <tr key={`${c.tipo_documento || "documento"}-${c.id}`}>
                        <td className="ie-strong">{nombrePaciente(c.paciente)}</td>
                        <td className="ie-muted">{nombreDoctor(c.doctor)}</td>
                        <td><span className="ie-chip">{c.tipo_documento || "Consentimiento"}</span></td>
                        <td className="ie-muted">{c.nombre_documento || c.nombre || c.formato?.nombre || "—"}</td>
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
                            {c.tipo_documento === "Consentimiento" && c.estado !== "Finalizado" && c.estado !== "Cancelado" && (
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
                              href={c.pdf_url || `${API_URL}/consentimientos/${c.id}/pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="ie-icon-btn"
                              title="Ver PDF"
                            >
                              <Eye size={15} />
                            </a>
                            <a
                              href={c.download_url || `${API_URL}/consentimientos/${c.id}/pdf?download=1`}
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
                Indicaciones farmacológicas para el alta
                <textarea
                  rows={2}
                  value={formAlta.medicamentos_egreso}
                  onChange={(e) => setFormAlta((f) => ({ ...f, medicamentos_egreso: e.target.value }))}
                  className="ie-input"
                  placeholder="Nombre, dosis y frecuencia de cada medicamento"
                />
              </label>

              <div className="ie-prescriptions">
                <div className="ie-prescriptions-header">
                  <h4>Receta de egreso</h4>
                  <button type="button" className="ie-btn-secondary ie-btn-compact" onClick={agregarMedicamentoAlta}>
                    <Plus size={13} /> Agregar medicamento
                  </button>
                </div>
                {cargandoMedicamentos ? (
                  <span className="ie-loading"><Loader2 size={13} className="ie-spin" /> Cargando medicamentos...</span>
                ) : formAlta.medicamentos_receta.length === 0 ? (
                  <p className="ie-muted">Sin medicamentos en la receta.</p>
                ) : (
                  formAlta.medicamentos_receta.map((medicamento, indice) => (
                    <div className="ie-prescription-row" key={`medicamento-alta-${indice}`}>
                      <label className="ie-field">
                        Medicamento
                        <select
                          required
                          value={medicamento.medicamento_id}
                          onChange={(e) => actualizarMedicamentoAlta(indice, "medicamento_id", e.target.value)}
                          className="ie-input"
                        >
                          <option value="">Selecciona un medicamento</option>
                          {catalogoMedicamentos.map((med) => (
                            <option key={med.id} value={med.id}>{med.nombre}</option>
                          ))}
                        </select>
                      </label>
                      <label className="ie-field">Dosis<input className="ie-input" value={medicamento.dosis} onChange={(e) => actualizarMedicamentoAlta(indice, "dosis", e.target.value)} placeholder="Ej. 500 mg" /></label>
                      <label className="ie-field">Frecuencia<input className="ie-input" value={medicamento.frecuencia} onChange={(e) => actualizarMedicamentoAlta(indice, "frecuencia", e.target.value)} placeholder="Ej. cada 8 h" /></label>
                      <label className="ie-field">Duración<input className="ie-input" value={medicamento.duracion} onChange={(e) => actualizarMedicamentoAlta(indice, "duracion", e.target.value)} placeholder="Ej. 7 días" /></label>
                      <label className="ie-field ie-prescription-instructions">Instrucciones<textarea rows={2} className="ie-input" value={medicamento.instrucciones} onChange={(e) => actualizarMedicamentoAlta(indice, "instrucciones", e.target.value)} placeholder="Indicaciones adicionales" /></label>
                      <button type="button" className="ie-icon-btn ie-prescription-remove" onClick={() => eliminarMedicamentoAlta(indice)} title="Quitar medicamento" aria-label="Quitar medicamento">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

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

              <label className="ie-check">
  <input
    type="checkbox"
    checked={formAlta.requiere_cita}
    onChange={(e) =>
      setFormAlta((f) => ({
        ...f,
        requiere_cita: e.target.checked,
        doctor_cita_id: e.target.checked ? f.doctor_cita_id || f.doctor_alta_id : "",
        fecha_cita: e.target.checked ? f.fecha_cita : "",
      }))
    }
  />
  Programar nueva cita de seguimiento
</label>
              {formAlta.requiere_cita && (
  <>
    <label className="ie-field">
      Doctor de la cita de seguimiento
      {cargandoDoctores ? (
        <span className="ie-loading">
          <Loader2 size={13} className="ie-spin" /> Cargando...
        </span>
      ) : (
        <select
          required
          value={formAlta.doctor_cita_id}
          onChange={(e) => setFormAlta((f) => ({ ...f, doctor_cita_id: e.target.value }))}
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
      Fecha y hora de seguimiento
      <input
        type="datetime-local"
        required
        min={fechaMasMinutosLocal(formAlta.fecha_salida, 1)}
        value={formAlta.fecha_cita}
        onChange={(e) => setFormAlta((f) => ({ ...f, fecha_cita: e.target.value }))}
        className="ie-input"
      />
    </label>
  </>
)}

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
          <div className="ie-modal ie-modal-wide" onClick={(e) => e.stopPropagation()}>
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
                Doctor que autoriza
                {cargandoDoctores ? (
                  <span className="ie-loading">
                    <Loader2 size={13} className="ie-spin" /> Cargando...
                  </span>
                ) : (
                  <select
                    required
                    value={formTraslado.doctor_id}
                    onChange={(e) => setFormTraslado((f) => ({ ...f, doctor_id: e.target.value }))}
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
                Motivo del traslado
                <textarea
                  rows={2}
                  value={formTraslado.motivo}
                  onChange={(e) => setFormTraslado((f) => ({ ...f, motivo: e.target.value }))}
                  className="ie-input"
                  placeholder="Ej. necesita monitoreo en UCI, cambio de piso por disponibilidad..."
                />
              </label>

              <div className="ie-guardian-fields">
                <label className="ie-field">
                  Nombre del familiar (opcional)
                  <input maxLength={200} value={formTraslado.familiar_nombre} onChange={(e) => setFormTraslado((f) => ({ ...f, familiar_nombre: e.target.value }))} className="ie-input" />
                </label>
              </div>

              <div className="ie-transfer-signatures">
                <h4>Firmas de autorización</h4>
                <div className="ie-signature-grid">
                  {ROLES_FIRMA_TRASLADO.map((rol) => (
                    <div className="ie-signature-field" key={rol}>
                      <FirmaElectronica
                        etiqueta={`Firma: ${rol === "Clinica" ? "clínica" : rol.toLowerCase()}${FIRMAS_TRASLADO_REQUERIDAS.includes(rol) ? " (requerida)" : " (opcional)"}`}
                        onGuardar={(firma) => guardarFirmaTraslado(rol, firma)}
                      />
                    </div>
                  ))}
                </div>
              </div>

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