import { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import {
  Loader2,
  Download,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  FilePenLine,
  FilePlus,
  Siren,
  BedDouble,
  HeartPulse,
  Scissors,
  Baby,
  Stethoscope,
  Search,
  X,
  Check,
  Printer,
  Plus,
  Paperclip,
  Trash2,
  Building2,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import FirmaElectronica from "../../components/multiusos/FirmaElectronica.jsx";

import "./PruebaConsentimientoFirma.css";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

// ---- Catálogos del front ----
const TIPOS_HOSPITALIZACION = [
  { id: "urgencias", nombre: "Observación en urgencias", desc: "Estancia corta, menos de 24 h", icon: Siren, habitaciones: ["Urgencias"] },
  { id: "general", nombre: "Hospitalización general", desc: "Habitación o piso de internamiento", icon: BedDouble, habitaciones: ["Individual", "Compartida"] },
  { id: "uci", nombre: "Cuidados intensivos", desc: "Monitoreo continuo en UCI", icon: HeartPulse, habitaciones: ["UCI"] },
  { id: "quirurgica", nombre: "Quirúrgica", desc: "Preoperatorio y posoperatorio", icon: Scissors, habitaciones: ["Quirófano", "Individual"] },
  { id: "obstetricia", nombre: "Obstetricia", desc: "Parto, cesárea o embarazo de riesgo", icon: Baby, habitaciones: ["Individual"] },
  { id: "pediatria", nombre: "Pediatría", desc: "Internamiento de menores", icon: Stethoscope, habitaciones: ["Individual", "Compartida"] },
];

const PRIORIDADES = [
  { id: "Programada", clase: "is-normal" },
  { id: "Urgente", clase: "is-urgent" },
  { id: "Crítica", clase: "is-critical" },
];

const FIRMAS = [
  { tipo: "Clinica", titulo: "Clínica", icon: Building2, registrable: true, campoNombre: "clinica_nombre" },
  { tipo: "Doctor", titulo: "Doctor responsable", icon: Stethoscope, registrable: true, campoNombre: "doctor_nombre" },
  { tipo: "Paciente", titulo: "Paciente", icon: UserRound, registrable: false, campoNombre: "paciente_nombre" },
];

const MARCADORES = ["paciente", "doctor", "clinica", "fecha", "diagnostico", "motivo", "tipo_hospitalizacion", "fecha_ingreso", "habitacion"];

const hoyISO = () => new Date().toISOString().slice(0, 10);

const formInicial = {
  paciente_id: "",
  doctor_id: "",
  formato_id: "",
  consulta_id: "",
  observaciones: "",
  tipo_hospitalizacion: "",
  prioridad: "Programada",
  fecha_ingreso: hoyISO(),
  dias_estimados: "",
  habitacion_id: "",
  diagnostico: "",
  motivo: "",
};

const formatoInicial = { nombre: "", descripcion: "", contenido: "", requiere_firma: true, activo: true };

// Saca un arreglo de la respuesta sin importar si viene en data, data.data o en otra clave
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

const formatoBytes = (n) => {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
};

export default function PruebaConsentimientoFirma() {
  const navigate = useNavigate();
  const [formatos, setFormatos] = useState([]);
  const [cargandoFormatos, setCargandoFormatos] = useState(true);
  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);
  const [doctores, setDoctores] = useState([]);
  const [cargandoDoctores, setCargandoDoctores] = useState(true);
  const [habitaciones, setHabitaciones] = useState([]);
  const [cargandoHabitaciones, setCargandoHabitaciones] = useState(true);

  const [form, setForm] = useState(formInicial);
  const [conHospitalizacion, setConHospitalizacion] = useState(true);
  const [vigilancia, setVigilancia] = useState([]);
  const [busquedaDoctor, setBusquedaDoctor] = useState("");

  // Nuevo formato de consentimiento
  const [mostrarNuevoFormato, setMostrarNuevoFormato] = useState(false);
  const [nuevoFormato, setNuevoFormato] = useState(formatoInicial);
  const [guardandoFormato, setGuardandoFormato] = useState(false);

  const [consentimiento, setConsentimiento] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [creando, setCreando] = useState(false);
  const [slotAbierto, setSlotAbierto] = useState(null);
  const [guardandoFirma, setGuardandoFirma] = useState(null);
  const [recordar, setRecordar] = useState({ Clinica: true, Doctor: true });
  const [versionFirmas, setVersionFirmas] = useState(0);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);
  const [subiendoAdjunto, setSubiendoAdjunto] = useState(false);
  const [finalizando, setFinalizando] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  const [mensaje, setMensaje] = useState(null); // { tipo: 'ok' | 'error', texto }
  const mostrarMensaje = useCallback((tipo, texto) => setMensaje({ tipo, texto }), []);

  // ---- Cargas iniciales ----
  const cargarFormatos = useCallback(async () => {
    setCargandoFormatos(true);
    try {
      const res = await api.get("/formatos-consentimiento/activos");
      const l = lista(res);
      setFormatos(l);
      return l;
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los formatos."));
      return [];
    } finally {
      setCargandoFormatos(false);
    }
  }, [mostrarMensaje]);

  useEffect(() => {
    cargarFormatos();
  }, [cargarFormatos]);

  useEffect(() => {
    let activo = true;
    api
      .get("/MostrarPaciente")
      .then((res) => activo && setPacientes(lista(res, "paciente")))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los pacientes.")))
      .finally(() => activo && setCargandoPacientes(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  useEffect(() => {
    let activo = true;
    api
      .get("/doctores-completo")
      .then((res) => activo && setDoctores(lista(res)))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los doctores.")))
      .finally(() => activo && setCargandoDoctores(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  useEffect(() => {
    let activo = true;
    api
      .get("/habitaciones")
      .then((res) => activo && setHabitaciones(lista(res, "habitaciones")))
      .catch((err) => activo && mostrarMensaje("error", errorTexto(err, "No se pudieron cargar las habitaciones.")))
      .finally(() => activo && setCargandoHabitaciones(false));
    return () => {
      activo = false;
    };
  }, [mostrarMensaje]);

  const actualizarCampo = (campo) => (e) => setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  // ---- Nombres tolerantes al shape de cada API ----
  const nombrePaciente = (p) => p.nombre ?? p.usuario?.nombre ?? p.correo ?? `Paciente #${p.id}`;
  const nombreDoctor = (d) => d.nombre ?? d.usuario?.nombre ?? d.correo ?? `Doctor #${d.id}`;
  const especialidadDoctor = (d) => {
    const e = d.especialidad ?? d.especialidades?.[0];
    return typeof e === "string" ? e : e?.nombre ?? "";
  };
  const iniciales = (texto) =>
    texto
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  const tipoSeleccionado = TIPOS_HOSPITALIZACION.find((t) => t.id === form.tipo_hospitalizacion);
  const formatoSeleccionado = formatos.find((f) => String(f.id) === String(form.formato_id));

  // ---- Habitaciones disponibles para el tipo elegido ----
  const habitacionesDisponibles = useMemo(() => {
    const permitidas = tipoSeleccionado?.habitaciones;
    return habitaciones.filter(
      (h) => (h.estado ? h.estado === "Disponible" : true) && (!permitidas || !h.tipo || permitidas.includes(h.tipo))
    );
  }, [habitaciones, tipoSeleccionado]);

  const elegirTipo = (id) =>
    setForm((prev) => ({ ...prev, tipo_hospitalizacion: id, habitacion_id: "" }));

  // ---- Equipo de vigilancia ----
  const doctoresDisponibles = useMemo(() => {
    const q = busquedaDoctor.trim().toLowerCase();
    return doctores
      .filter((d) => String(d.id) !== String(form.doctor_id))
      .filter((d) => (q ? `${nombreDoctor(d)} ${especialidadDoctor(d)}`.toLowerCase().includes(q) : true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctores, busquedaDoctor, form.doctor_id]);

  const doctoresVigilancia = useMemo(
    () => vigilancia.map((id) => doctores.find((d) => Number(d.id) === id)).filter(Boolean),
    [vigilancia, doctores]
  );

  const alternarVigilancia = (id) =>
    setVigilancia((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const cambiarResponsable = (e) => {
    const valor = e.target.value;
    setForm((prev) => ({ ...prev, doctor_id: valor }));
    setVigilancia((prev) => prev.filter((id) => id !== Number(valor)));
  };

  // ---- Nuevo formato ----
  const insertarMarcador = (marcador) =>
    setNuevoFormato((prev) => {
      const sep = prev.contenido && !/\s$/.test(prev.contenido) ? " " : "";
      return { ...prev, contenido: `${prev.contenido}${sep}{{${marcador}}}` };
    });

  const guardarNuevoFormato = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setGuardandoFormato(true);
    try {
      const nombre = nuevoFormato.nombre.trim();
      const res = await api.post("/formatos-consentimiento", {
        nombre,
        descripcion: nuevoFormato.descripcion.trim() || null,
        contenido: nuevoFormato.contenido,
        requiere_firma: nuevoFormato.requiere_firma ? 1 : 0,
        activo: nuevoFormato.activo ? 1 : 0,
      });
      const creado = res.data?.data ?? res.data;
      const l = await cargarFormatos();
      const id = creado?.id ?? [...l].reverse().find((f) => f.nombre === nombre)?.id;
      if (id && nuevoFormato.activo) setForm((prev) => ({ ...prev, formato_id: String(id) }));
      setNuevoFormato(formatoInicial);
      setMostrarNuevoFormato(false);
      mostrarMensaje("ok", nuevoFormato.activo ? "Formato creado y seleccionado." : "Formato creado (está inactivo, no aparece en la lista).");
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo crear el formato."));
    } finally {
      setGuardandoFormato(false);
    }
  };

  // ---- Respuesta del backend → estado ----
  const aplicarDetalle = (data) => {
    setConsentimiento(data);
    setHistorial(data?.historial ?? []);
  };

  // ---- 1) Crear consentimiento ----
  const crearConsentimiento = async (e) => {
    e.preventDefault();
    setMensaje(null);

    if (conHospitalizacion && !form.tipo_hospitalizacion) {
      mostrarMensaje("error", "Elige el tipo de hospitalización.");
      return;
    }

    setCreando(true);
    try {
      const payload = {
        paciente_id: Number(form.paciente_id),
        doctor_id: Number(form.doctor_id),
        formato_id: Number(form.formato_id),
        consulta_id: form.consulta_id ? Number(form.consulta_id) : null,
        observaciones: form.observaciones || null,
      };
      if (conHospitalizacion) {
        payload.hospitalizacion = {
          tipo: form.tipo_hospitalizacion,
          prioridad: form.prioridad,
          fecha_ingreso: form.fecha_ingreso || null,
          dias_estimados: form.dias_estimados ? Number(form.dias_estimados) : null,
          habitacion_id: form.habitacion_id ? Number(form.habitacion_id) : null,
          diagnostico: form.diagnostico || null,
          motivo: form.motivo || null,
        };
        payload.doctores_vigilancia = vigilancia;
      }

      const res = await api.post("/consentimientos", payload);
      aplicarDetalle(res.data.data);
      setVersionFirmas((v) => v + 1);
      mostrarMensaje("ok", "Consentimiento creado. Firma abajo o imprime el PDF para que lo firme el paciente.");
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "Error al crear el consentimiento."));
    } finally {
      setCreando(false);
    }
  };

  // ---- 2) Firmas (se guardan en la base de datos) ----
  const firmado = (tipo) => !!consentimiento?.firmas?.some((f) => f.tipo === tipo);
  const urlFirma = (tipo) =>
    `${API_URL}/consentimientos/${consentimiento.id}/firmas/${tipo.toLowerCase()}/imagen?v=${versionFirmas}`;

  const guardarFirma = async (slot, dataUrl) => {
    if (!consentimiento?.id) return;
    setMensaje(null);
    setGuardandoFirma(slot.tipo);
    try {
      const res = await api.post(`/consentimientos/${consentimiento.id}/firma`, {
        firma: dataUrl,
        tipo: slot.tipo,
        registrar: slot.registrable ? !!recordar[slot.tipo] : false,
      });
      aplicarDetalle(res.data.data);
      setVersionFirmas((v) => v + 1);
      setSlotAbierto(null);
      mostrarMensaje("ok", `Firma (${slot.titulo.toLowerCase()}) guardada en la base de datos y PDF actualizado.`);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "Error al guardar la firma."));
    } finally {
      setGuardandoFirma(null);
    }
  };

  // ---- 3) Historial y adjuntos ----
  const cargarHistorial = async () => {
    if (!consentimiento?.id) return;
    setCargandoHistorial(true);
    try {
      const res = await api.get(`/consentimientos/${consentimiento.id}/historial`);
      setHistorial(res.data.data ?? []);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "Error al cargar el historial."));
    } finally {
      setCargandoHistorial(false);
    }
  };

  const subirAdjunto = async (e) => {
    const archivo = e.target.files?.[0];
    e.target.value = "";
    if (!archivo || !consentimiento?.id) return;
    if (archivo.size > 5 * 1024 * 1024) {
      mostrarMensaje("error", "El archivo supera los 5 MB.");
      return;
    }
    setSubiendoAdjunto(true);
    try {
      const datos = new FormData();
      datos.append("archivo", archivo);
      const res = await api.post(`/consentimientos/${consentimiento.id}/adjuntos`, datos);
      aplicarDetalle(res.data.data);
      mostrarMensaje("ok", "Archivo guardado en la base de datos.");
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo subir el archivo."));
    } finally {
      setSubiendoAdjunto(false);
    }
  };

  const eliminarAdjunto = async (id) => {
    try {
      await api.delete(`/consentimiento-adjuntos/${id}`);
      const res = await api.get(`/consentimientos/${consentimiento.id}`);
      aplicarDetalle(res.data.data);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo eliminar el archivo."));
    }
  };

  const nuevoConsentimiento = () => {
    setConsentimiento(null);
    setHistorial([]);
    setVigilancia([]);
    setBusquedaDoctor("");
    setSlotAbierto(null);
    setForm({ ...formInicial, fecha_ingreso: hoyISO() });
    setMensaje(null);
    setFinalizado(false);
  };

  const urlPdf = (descargar = false) =>
    `${API_URL}/consentimientos/${consentimiento.id}/pdf${descargar ? "?download=1" : ""}`;

  // ---- 4) Finalizar el proceso: descarga el documento y cierra este consentimiento ----
  const finalizarProceso = async () => {
    if (!consentimiento?.id || finalizando) return;

    const confirmar = window.confirm(
      "¿Finalizar el proceso? Se descargará el documento final y este consentimiento quedará cerrado."
    );
    if (!confirmar) return;

    setMensaje(null);
    setFinalizando(true);
    try {
      // Dispara la descarga forzada del PDF (misma ruta que "Descargar")
      const enlace = document.createElement("a");
      enlace.href = urlPdf(true);
      enlace.rel = "noreferrer";
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      setFinalizado(true);
      mostrarMensaje("ok", "Proceso finalizado. El documento se descargó y el consentimiento quedó cerrado.");

      // Da tiempo a que se vea el mensaje y se dispare la descarga antes de salir de la página
      setTimeout(() => {
        navigate("/Farmacia/dashboard");
      }, 800);
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "No se pudo finalizar el proceso."));
    } finally {
      setFinalizando(false);
    }
  };

  // Paso actual para el riel
  const paso = !consentimiento ? 1 : !firmado("Paciente") ? 2 : 3;
  const pasos = [
    { n: 1, titulo: "Ingreso", texto: "Formato, paciente y equipo" },
    { n: 2, titulo: "Firmas", texto: "Clínica, doctor y paciente" },
    { n: 3, titulo: "Documento", texto: "PDF, historial y archivos" },
  ];

  return (
    <div className="consent-page">
      <div className="consent-shell">
        <header className="consent-header">
          <div className="consent-header-icon">
            <FilePenLine size={22} />
          </div>
          <div>
            <h2>Consentimientos y hospitalización</h2>
            <p>Crea el formato, indica el internamiento, reúne las tres firmas e imprime el PDF para el paciente.</p>
          </div>
        </header>

        <div className="consent-layout">
          <nav className="consent-rail" aria-label="Progreso">
            <ol>
              {pasos.map((p) => (
                <li
                  key={p.n}
                  className={paso === p.n ? "is-current" : paso > p.n ? "is-done" : ""}
                  aria-current={paso === p.n ? "step" : undefined}
                >
                  <span className="consent-rail-dot">{paso > p.n ? <Check size={12} /> : p.n}</span>
                  <span className="consent-rail-text">
                    <strong>{p.titulo}</strong>
                    <small>{p.texto}</small>
                  </span>
                </li>
              ))}
            </ol>
          </nav>

          <main className="consent-main">
            {mensaje && (
              <div className={`consent-alert ${mensaje.tipo === "ok" ? "is-ok" : "is-error"}`} role="status">
                {mensaje.tipo === "ok" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                <span>{mensaje.texto}</span>
              </div>
            )}

            {/* ============ Nuevo formato de consentimiento ============ */}
            {mostrarNuevoFormato && !consentimiento && (
              <section className="consent-card consent-card-accent">
                <div className="consent-card-header consent-card-header-split">
                  <h3>Nuevo formato de consentimiento</h3>
                  <button type="button" className="consent-btn-ghost" onClick={() => setMostrarNuevoFormato(false)}>
                    <X size={13} />
                    Cerrar
                  </button>
                </div>

                <form onSubmit={guardarNuevoFormato} className="consent-grid">
                  <Campo label="Nombre del formato" full>
                    <input
                      required
                      maxLength={200}
                      value={nuevoFormato.nombre}
                      onChange={(e) => setNuevoFormato((p) => ({ ...p, nombre: e.target.value }))}
                      className="consent-input"
                      placeholder="Ej. Consentimiento de hospitalización"
                    />
                  </Campo>

                  <Campo label="Descripción (opcional)" full>
                    <input
                      value={nuevoFormato.descripcion}
                      onChange={(e) => setNuevoFormato((p) => ({ ...p, descripcion: e.target.value }))}
                      className="consent-input"
                      placeholder="Para qué se usa este formato"
                    />
                  </Campo>

                  <Campo label="Texto del consentimiento" full>
                    <textarea
                      required
                      rows={8}
                      value={nuevoFormato.contenido}
                      onChange={(e) => setNuevoFormato((p) => ({ ...p, contenido: e.target.value }))}
                      className="consent-input"
                      placeholder="Yo, {{paciente}}, autorizo al Dr. {{doctor}} de {{clinica}} a..."
                    />
                  </Campo>

                  <div className="consent-full">
                    <p className="consent-hint consent-hint-top">
                      Toca un dato para insertarlo. Al crear el consentimiento se reemplaza por la información real.
                    </p>
                    <div className="consent-tokens">
                      {MARCADORES.map((m) => (
                        <button type="button" key={m} onClick={() => insertarMarcador(m)}>
                          {`{{${m}}}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <label className="consent-check">
                    <input
                      type="checkbox"
                      checked={nuevoFormato.requiere_firma}
                      onChange={(e) => setNuevoFormato((p) => ({ ...p, requiere_firma: e.target.checked }))}
                    />
                    Requiere firma del paciente
                  </label>
                  <label className="consent-check">
                    <input
                      type="checkbox"
                      checked={nuevoFormato.activo}
                      onChange={(e) => setNuevoFormato((p) => ({ ...p, activo: e.target.checked }))}
                    />
                    Formato activo
                  </label>

                  <button type="submit" disabled={guardandoFormato} className="consent-btn-primary consent-full">
                    {guardandoFormato && <Loader2 size={14} className="spin" />}
                    Guardar formato
                  </button>
                </form>
              </section>
            )}

            {/* ============ Paso 1 ============ */}
            <section className="consent-card">
              <div className="consent-card-header">
                <h3>Datos del ingreso</h3>
                {consentimiento && <span className="consent-tag">Consentimiento #{consentimiento.id}</span>}
              </div>

              <form onSubmit={crearConsentimiento} className="consent-form">
                <fieldset className="consent-fieldset" disabled={!!consentimiento}>
                  <legend>Paciente y formato</legend>
                  <div className="consent-grid">
                    <Campo label="Paciente">
                      {cargandoPacientes ? (
                        <Cargando texto="Cargando pacientes..." />
                      ) : (
                        <select required value={form.paciente_id} onChange={actualizarCampo("paciente_id")} className="consent-input">
                          <option value="">Selecciona un paciente</option>
                          {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                              {nombrePaciente(p)}
                            </option>
                          ))}
                        </select>
                      )}
                    </Campo>

                    <Campo label="Doctor responsable">
                      {cargandoDoctores ? (
                        <Cargando texto="Cargando doctores..." />
                      ) : (
                        <select required value={form.doctor_id} onChange={cambiarResponsable} className="consent-input">
                          <option value="">Selecciona un doctor</option>
                          {doctores.map((d) => (
                            <option key={d.id} value={d.id}>
                              {nombreDoctor(d)}
                              {especialidadDoctor(d) ? ` — ${especialidadDoctor(d)}` : ""}
                            </option>
                          ))}
                        </select>
                      )}
                    </Campo>

                    <Campo label="Formato de consentimiento" full>
                      {cargandoFormatos ? (
                        <Cargando texto="Cargando formatos..." />
                      ) : (
                        <div className="consent-inline">
                          <select required value={form.formato_id} onChange={actualizarCampo("formato_id")} className="consent-input">
                            <option value="">Selecciona un formato</option>
                            {formatos.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.nombre}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            className="consent-btn-secondary consent-btn-compact"
                            onClick={() => setMostrarNuevoFormato(true)}
                          >
                            <FilePlus size={14} />
                            Nuevo formato
                          </button>
                        </div>
                      )}
                      {formatoSeleccionado?.descripcion && (
                        <span className="consent-hint consent-hint-top">{formatoSeleccionado.descripcion}</span>
                      )}
                    </Campo>

                    <Campo label="Consulta (opcional)">
                      <input
                        type="number"
                        value={form.consulta_id}
                        onChange={actualizarCampo("consulta_id")}
                        className="consent-input"
                        placeholder="ID de consulta"
                      />
                    </Campo>
                  </div>
                </fieldset>

                <label className="consent-check consent-check-block">
                  <input
                    type="checkbox"
                    checked={conHospitalizacion}
                    onChange={(e) => setConHospitalizacion(e.target.checked)}
                    disabled={!!consentimiento}
                  />
                  Este consentimiento incluye una hospitalización
                </label>

                {conHospitalizacion && (
                  <>
                    <fieldset className="consent-fieldset" disabled={!!consentimiento}>
                      <legend>Tipo de hospitalización</legend>
                      <div className="consent-options" role="radiogroup" aria-label="Tipo de hospitalización">
                        {TIPOS_HOSPITALIZACION.map((t) => {
                          const Icono = t.icon;
                          const activo = form.tipo_hospitalizacion === t.id;
                          return (
                            <button
                              type="button"
                              key={t.id}
                              role="radio"
                              aria-checked={activo}
                              className={`consent-option ${activo ? "is-selected" : ""}`}
                              onClick={() => elegirTipo(t.id)}
                            >
                              <span className="consent-option-icon">
                                <Icono size={18} />
                              </span>
                              <span className="consent-option-text">
                                <strong>{t.nombre}</strong>
                                <small>{t.desc}</small>
                              </span>
                              {activo && <Check size={16} className="consent-option-check" />}
                            </button>
                          );
                        })}
                      </div>

                      <div className="consent-grid consent-grid-spaced">
                        <Campo label="Prioridad" full>
                          <div className="consent-segmented" role="radiogroup" aria-label="Prioridad">
                            {PRIORIDADES.map((p) => (
                              <button
                                type="button"
                                key={p.id}
                                role="radio"
                                aria-checked={form.prioridad === p.id}
                                className={`${p.clase} ${form.prioridad === p.id ? "is-selected" : ""}`}
                                onClick={() => setForm((prev) => ({ ...prev, prioridad: p.id }))}
                              >
                                {p.id}
                              </button>
                            ))}
                          </div>
                        </Campo>

                        <Campo label="Fecha de ingreso">
                          <input type="date" required value={form.fecha_ingreso} onChange={actualizarCampo("fecha_ingreso")} className="consent-input" />
                        </Campo>

                        <Campo label="Estancia estimada (días)">
                          <input
                            type="number"
                            min="1"
                            value={form.dias_estimados}
                            onChange={actualizarCampo("dias_estimados")}
                            className="consent-input"
                            placeholder="Ej. 3"
                          />
                        </Campo>

                        <Campo label="Habitación (opcional)" full>
                          {cargandoHabitaciones ? (
                            <Cargando texto="Cargando habitaciones..." />
                          ) : (
                            <select value={form.habitacion_id} onChange={actualizarCampo("habitacion_id")} className="consent-input">
                              <option value="">Asignar después</option>
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
                            <span className="consent-hint consent-hint-top">
                              No hay habitaciones disponibles{tipoSeleccionado ? " de este tipo" : ""}.
                            </span>
                          )}
                        </Campo>

                        <Campo label="Diagnóstico" full>
                          <input
                            type="text"
                            value={form.diagnostico}
                            onChange={actualizarCampo("diagnostico")}
                            className="consent-input"
                            placeholder="Diagnóstico de ingreso"
                          />
                        </Campo>

                        <Campo label="Motivo de la hospitalización" full>
                          <textarea
                            rows={2}
                            value={form.motivo}
                            onChange={actualizarCampo("motivo")}
                            className="consent-input"
                            placeholder="Describe por qué se hospitaliza al paciente..."
                          />
                        </Campo>
                      </div>
                    </fieldset>

                    <fieldset className="consent-fieldset" disabled={!!consentimiento}>
                      <legend>
                        Doctores que vigilarán al paciente
                        {vigilancia.length > 0 && <span className="consent-count">{vigilancia.length}</span>}
                      </legend>

                      {doctoresVigilancia.length > 0 && (
                        <ul className="consent-chips">
                          {doctoresVigilancia.map((d) => (
                            <li key={d.id}>
                              <span className="consent-avatar">{iniciales(nombreDoctor(d))}</span>
                              {nombreDoctor(d)}
                              <button type="button" onClick={() => alternarVigilancia(Number(d.id))} aria-label={`Quitar a ${nombreDoctor(d)}`}>
                                <X size={12} />
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}

                      <div className="consent-search">
                        <Search size={14} />
                        <input
                          type="search"
                          value={busquedaDoctor}
                          onChange={(e) => setBusquedaDoctor(e.target.value)}
                          placeholder="Buscar por nombre o especialidad"
                        />
                      </div>

                      {cargandoDoctores ? (
                        <Cargando texto="Cargando doctores..." />
                      ) : doctoresDisponibles.length === 0 ? (
                        <p className="consent-empty">
                          {form.doctor_id || busquedaDoctor ? "No hay doctores que coincidan." : "No hay doctores disponibles."}
                        </p>
                      ) : (
                        <ul className="consent-doctor-list">
                          {doctoresDisponibles.map((d) => {
                            const id = Number(d.id);
                            const marcado = vigilancia.includes(id);
                            return (
                              <li key={d.id}>
                                <button
                                  type="button"
                                  className={marcado ? "is-selected" : ""}
                                  aria-pressed={marcado}
                                  onClick={() => alternarVigilancia(id)}
                                >
                                  <span className="consent-avatar">{iniciales(nombreDoctor(d))}</span>
                                  <span className="consent-doctor-text">
                                    <strong>{nombreDoctor(d)}</strong>
                                    {especialidadDoctor(d) && <small>{especialidadDoctor(d)}</small>}
                                  </span>
                                  <span className="consent-doctor-toggle">{marcado ? <Check size={14} /> : <Plus size={14} />}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </fieldset>
                  </>
                )}

                <fieldset className="consent-fieldset" disabled={!!consentimiento}>
                  <legend>Observaciones</legend>
                  <textarea
                    rows={2}
                    value={form.observaciones}
                    onChange={actualizarCampo("observaciones")}
                    className="consent-input"
                    placeholder="Notas adicionales (opcional)"
                  />
                </fieldset>

                {!consentimiento && (
                  <button type="submit" disabled={creando} className="consent-btn-primary consent-full">
                    {creando && <Loader2 size={14} className="spin" />}
                    Crear consentimiento
                  </button>
                )}
              </form>
            </section>

            {/* ============ Paso 2: firmas ============ */}
            {consentimiento && (
              <section className="consent-card">
                <div className="consent-card-header consent-card-header-split">
                  <h3>Firmas</h3>
                  <span className={`consent-badge ${consentimiento.estado === "Firmado" ? "is-signed" : "is-pending"}`}>
                    {consentimiento.estado}
                  </span>
                </div>

                <div className="consent-slots">
                  {FIRMAS.map((slot) => {
                    const Icono = slot.icon;
                    const ok = firmado(slot.tipo);
                    const abierto = slotAbierto === slot.tipo;
                    return (
                      <div key={slot.tipo} className={`consent-slot ${ok ? "is-signed" : ""}`}>
                        <div className="consent-slot-head">
                          <span className="consent-slot-icon">
                            <Icono size={16} />
                          </span>
                          <span className="consent-slot-title">
                            <strong>{slot.titulo}</strong>
                            <small>{consentimiento[slot.campoNombre] || "—"}</small>
                          </span>
                          <span className="consent-slot-thumb">
                            {ok ? <img src={urlFirma(slot.tipo)} alt={`Firma: ${slot.titulo}`} /> : <em>Sin firma</em>}
                          </span>
                          {!abierto && (
                            <button
                              type="button"
                              className="consent-btn-ghost"
                              onClick={() => setSlotAbierto(slot.tipo)}
                            >
                              {ok ? "Volver a firmar" : "Firmar"}
                            </button>
                          )}
                        </div>

                        {abierto && (
                          <div className="consent-slot-body">
                            {slot.registrable && (
                              <label className="consent-check">
                                <input
                                  type="checkbox"
                                  checked={!!recordar[slot.tipo]}
                                  onChange={(e) => setRecordar((r) => ({ ...r, [slot.tipo]: e.target.checked }))}
                                />
                                Guardar como firma registrada {slot.tipo === "Clinica" ? "de la clínica" : "de este doctor"} para los próximos consentimientos
                              </label>
                            )}
                            <FirmaElectronica
                              onGuardar={(dataUrl) => guardarFirma(slot, dataUrl)}
                              etiqueta={`Firma: ${slot.titulo.toLowerCase()}`}
                              guardando={guardandoFirma === slot.tipo}
                            />
                            <button type="button" className="consent-btn-ghost" onClick={() => setSlotAbierto(null)}>
                              Cancelar
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="consent-hint">
                  Las firmas de la clínica y del doctor se copian solas cuando ya están registradas. El paciente puede firmar
                  aquí o en papel: imprime el PDF, que ya lleva las firmas de la clínica y del doctor.
                </p>
              </section>
            )}

            {/* ============ Paso 3: documento ============ */}
            {consentimiento && (
              <section className="consent-card">
                <div className="consent-card-header">
                  <h3>Documento</h3>
                </div>

                <div className="consent-actions">
                  <a href={urlPdf()} target="_blank" rel="noreferrer" className="consent-btn-primary">
                    <Printer size={14} />
                    Ver e imprimir PDF
                  </a>
                  <a href={urlPdf(true)} className="consent-btn-secondary">
                    <Download size={14} />
                    Descargar
                  </a>
                  <button
                    type="button"
                    onClick={finalizarProceso}
                    disabled={finalizando || finalizado}
                    className="consent-btn-primary"
                  >
                    {finalizando ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                    {finalizado ? "Proceso finalizado" : "Finalizar y descargar"}
                  </button>
                  <button type="button" onClick={nuevoConsentimiento} className="consent-btn-ghost">
                    <Plus size={13} />
                    Nuevo consentimiento
                  </button>
                </div>
                <p className="consent-hint">
                  El PDF se genera en el servidor con las firmas guardadas en la base de datos. Si el paciente aún no firma,
                  su recuadro queda en blanco para firmarlo a mano. "Finalizar y descargar" guarda una última copia del
                  documento en tu equipo y marca este consentimiento como cerrado.
                </p>

                <h4 className="consent-subtitle">Archivos adjuntos</h4>
                {consentimiento.adjuntos?.length > 0 ? (
                  <ul className="consent-files">
                    {consentimiento.adjuntos.map((a) => (
                      <li key={a.id}>
                        <Paperclip size={14} />
                        <a href={`${API_URL}/consentimiento-adjuntos/${a.id}`} target="_blank" rel="noreferrer">
                          {a.nombre_original ?? a.archivo}
                        </a>
                        <small>{formatoBytes(a.tamano)}</small>
                        <button type="button" onClick={() => eliminarAdjunto(a.id)} aria-label={`Eliminar ${a.nombre_original ?? a.archivo}`}>
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="consent-empty">Sin archivos. Puedes adjuntar estudios o una copia firmada en papel (PDF o imagen, hasta 5 MB).</p>
                )}
                <label className={`consent-btn-secondary consent-upload ${subiendoAdjunto ? "is-busy" : ""}`}>
                  {subiendoAdjunto ? <Loader2 size={14} className="spin" /> : <Paperclip size={14} />}
                  Adjuntar archivo
                  <input type="file" accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" onChange={subirAdjunto} disabled={subiendoAdjunto} />
                </label>

                <div className="consent-card-header consent-card-header-split consent-subsection">
                  <h4 className="consent-subtitle">Historial</h4>
                  <button type="button" onClick={cargarHistorial} disabled={cargandoHistorial} className="consent-btn-ghost">
                    {cargandoHistorial ? <Loader2 size={13} className="spin" /> : <RefreshCcw size={13} />}
                    Actualizar
                  </button>
                </div>
                {historial.length === 0 ? (
                  <p className="consent-empty">Sin registros aún.</p>
                ) : (
                  <ul className="consent-history">
                    {historial.map((h) => (
                      <li key={h.id}>
                        <span>
                          <strong>{h.accion}</strong> — {h.descripcion}
                        </span>
                        <span className="consent-history-date">{h.created_at}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, children, full = false }) {
  return (
    <label className={`consent-field ${full ? "consent-full" : ""}`}>
      {label}
      {children}
    </label>
  );
}

function Cargando({ texto }) {
  return (
    <div className="consent-loading">
      <Loader2 size={14} className="spin" /> {texto}
    </div>
  );
}