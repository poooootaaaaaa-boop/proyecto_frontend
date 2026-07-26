import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Loader2, FileDown, RefreshCcw, CheckCircle2, XCircle, FilePenLine } from "lucide-react";
import FirmaElectronica from "../../components/multiusos/FirmaElectronica.jsx";

import "./PruebaConsentimientoFirma.css";

const API_URL = "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

export default function PruebaConsentimientoFirma() {
  const [formatos, setFormatos] = useState([]);
  const [cargandoFormatos, setCargandoFormatos] = useState(true);

  const [pacientes, setPacientes] = useState([]);
  const [cargandoPacientes, setCargandoPacientes] = useState(true);

  const [doctores, setDoctores] = useState([]);
  const [cargandoDoctores, setCargandoDoctores] = useState(true);

  const [form, setForm] = useState({
    paciente_id: "",
    doctor_id: "",
    formato_id: "",
    consulta_id: "",
    observaciones: "",
  });

  const [consentimiento, setConsentimiento] = useState(null);
  const [historial, setHistorial] = useState([]);

  const [creando, setCreando] = useState(false);
  const [guardandoFirma, setGuardandoFirma] = useState(false);
  const [cargandoHistorial, setCargandoHistorial] = useState(false);

  const [mensaje, setMensaje] = useState(null); // { tipo: 'ok' | 'error', texto }

  const mostrarMensaje = (tipo, texto) => setMensaje({ tipo, texto });

  const errorTexto = (err, fallback) =>
    err?.response?.data?.message ||
    (err?.response?.data?.errors
      ? Object.values(err.response.data.errors).flat().join(" ")
      : null) ||
    err?.message ||
    fallback;

  // ---- Cargar formatos activos ----
  useEffect(() => {
    let activo = true;
    setCargandoFormatos(true);
    api
      .get("/formatos-consentimiento/activos")
      .then((res) => {
        if (activo) setFormatos(res.data?.data ?? []);
      })
      .catch((err) => {
        if (activo) mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los formatos."));
      })
      .finally(() => activo && setCargandoFormatos(false));
    return () => {
      activo = false;
    };
  }, []);

  // ---- Cargar pacientes para el select ----
useEffect(() => {
  let activo = true;
  setCargandoPacientes(true);
  api
    .get("/MostrarPaciente")
    .then((res) => {
      if (activo) setPacientes(res.data?.paciente ?? []);
    })
    .catch((err) => {
      if (activo) mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los pacientes."));
    })
    .finally(() => activo && setCargandoPacientes(false));
  return () => {
    activo = false;
  };
}, []);

  // ---- Cargar doctores para el select ----
  useEffect(() => {
    let activo = true;
    setCargandoDoctores(true);
    api
      .get("/doctores-completo")
      .then((res) => {
        if (activo) setDoctores(res.data?.data ?? res.data ?? []);
      })
      .catch((err) => {
        if (activo) mostrarMensaje("error", errorTexto(err, "No se pudieron cargar los doctores."));
      })
      .finally(() => activo && setCargandoDoctores(false));
    return () => {
      activo = false;
    };
  }, []);

  const actualizarCampo = (campo) => (e) =>
    setForm((prev) => ({ ...prev, [campo]: e.target.value }));

  // Nombre "amigable" del paciente sin importar el shape exacto que regrese la API
  const nombrePaciente = (p) =>
    p.nombre ?? p.usuario?.nombre ?? p.correo ?? `Paciente #${p.id}`;

  const nombreDoctor = (d) =>
    d.nombre ?? d.usuario?.nombre ?? d.correo ?? `Doctor #${d.id}`;

  // ---- 1) Crear consentimiento ----
  const crearConsentimiento = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCreando(true);
    try {
      const payload = {
        paciente_id: Number(form.paciente_id),
        doctor_id: Number(form.doctor_id),
        formato_id: Number(form.formato_id),
        consulta_id: form.consulta_id ? Number(form.consulta_id) : null,
        observaciones: form.observaciones || null,
      };
      const res = await api.post("/consentimientos", payload);
      setConsentimiento(res.data.data);
      setHistorial([]);
      mostrarMensaje("ok", "Consentimiento creado. Ahora puedes firmarlo abajo.");
    } catch (err) {
      mostrarMensaje("error", errorTexto(err, "Error al crear el consentimiento."));
    } finally {
      setCreando(false);
    }
  };

  // ---- 2) Guardar firma ----
  const guardarFirma = useCallback(
    async (dataUrl) => {
      if (!consentimiento?.id) return;
      setMensaje(null);
      setGuardandoFirma(true);
      try {
        const res = await api.post(`/consentimientos/${consentimiento.id}/firma`, {
          firma: dataUrl,
        });
        setConsentimiento(res.data.data);
        setHistorial(res.data.data?.historial ?? []);
        mostrarMensaje("ok", "Firma guardada y PDF generado en el backend.");
      } catch (err) {
        mostrarMensaje("error", errorTexto(err, "Error al guardar la firma."));
      } finally {
        setGuardandoFirma(false);
      }
    },
    [consentimiento]
  );

  // ---- 3) Historial ----
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

  // ---- 4) PDF local de prueba ----
  const generarPdfLocal = async () => {
    if (!consentimiento) return;

    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margenX = 40;
    let y = 50;

    doc.setFontSize(16);
    doc.text("Consentimiento informado (prueba local)", margenX, y);
    y += 24;

    doc.setFontSize(10);
    doc.text(`ID consentimiento: ${consentimiento.id}`, margenX, y);
    y += 14;
    doc.text(`Titulo: ${consentimiento.titulo ?? "-"}`, margenX, y);
    y += 14;
    doc.text(`Estado: ${consentimiento.estado ?? "-"}`, margenX, y);
    y += 14;
    doc.text(`Fecha de firma: ${consentimiento.fecha_firma ?? "Sin firmar"}`, margenX, y);
    y += 20;

    if (historial.length > 0) {
      autoTable(doc, {
        startY: y,
        margin: { left: margenX, right: margenX },
        head: [["Fecha", "Acción", "Descripción"]],
        body: historial.map((h) => [h.created_at ?? "-", h.accion ?? "-", h.descripcion ?? "-"]),
        styles: { fontSize: 8 },
        headStyles: { fillColor: [30, 58, 95] },
      });
      y = doc.lastAutoTable.finalY + 20;
    } else {
      doc.text("Sin historial cargado.", margenX, y);
      y += 20;
    }

    if (consentimiento.firma) {
      try {
        const urlFirma = firmaAUrl(consentimiento.firma);
        const dataUrlFirma = await urlAImagenDataUrl(urlFirma);
        doc.setFontSize(10);
        doc.text("Firma:", margenX, y);
        doc.addImage(dataUrlFirma, "PNG", margenX, y + 6, 200, 80);
      } catch (e) {
        doc.text("(No se pudo cargar la imagen de la firma para el PDF local)", margenX, y);
      }
    }

    doc.save(`consentimiento_${consentimiento.id}_prueba.pdf`);
  };

  const firmaAUrl = (rutaRelativa) => {
    const base = API_URL.replace(/\/api\/?$/, "");
    return `${base}/storage/${rutaRelativa}`;
  };

  const urlAImagenDataUrl = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = url;
    });

  return (
    <div className="consent-page">
      <div className="consent-container">
        <header className="consent-header">
          <div className="consent-header-icon">
            <FilePenLine size={22} />
          </div>
          <div>
            <h2>Consentimientos informados</h2>
            <p>Crea, firma y descarga el consentimiento de un paciente</p>
          </div>
        </header>

        {mensaje && (
          <div className={`consent-alert ${mensaje.tipo === "ok" ? "is-ok" : "is-error"}`}>
            {mensaje.tipo === "ok" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
            <span>{mensaje.texto}</span>
          </div>
        )}

        {/* --- Paso 1 --- */}
        <section className="consent-card">
          <div className="consent-card-header">
            <span className="consent-step">1</span>
            <h3>Crear consentimiento</h3>
          </div>

          <form onSubmit={crearConsentimiento} className="consent-grid">
            <Campo label="Paciente">
              {cargandoPacientes ? (
                <Cargando texto="Cargando pacientes..." />
              ) : (
                <select
                  required
                  value={form.paciente_id}
                  onChange={actualizarCampo("paciente_id")}
                  className="consent-input"
                >
                  <option value="">Selecciona un paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {nombrePaciente(p)}
                    </option>
                  ))}
                </select>
              )}
            </Campo>

            <Campo label="Doctor">
              {cargandoDoctores ? (
                <Cargando texto="Cargando doctores..." />
              ) : (
                <select
                  required
                  value={form.doctor_id}
                  onChange={actualizarCampo("doctor_id")}
                  className="consent-input"
                >
                  <option value="">Selecciona un doctor</option>
                  {doctores.map((d) => (
                    <option key={d.id} value={d.id}>
                      {nombreDoctor(d)}
                    </option>
                  ))}
                </select>
              )}
            </Campo>

            <Campo label="Formato" full>
              {cargandoFormatos ? (
                <Cargando texto="Cargando formatos..." />
              ) : (
                <select
                  required
                  value={form.formato_id}
                  onChange={actualizarCampo("formato_id")}
                  className="consent-input"
                >
                  <option value="">Selecciona un formato</option>
                  {formatos.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nombre}
                    </option>
                  ))}
                </select>
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

            <Campo label="Observaciones (opcional)" full>
              <textarea
                rows={2}
                value={form.observaciones}
                onChange={actualizarCampo("observaciones")}
                className="consent-input"
                placeholder="Notas adicionales..."
              />
            </Campo>

            <button type="submit" disabled={creando} className="consent-btn-primary consent-full">
              {creando && <Loader2 size={14} className="spin" />}
              Crear consentimiento
            </button>
          </form>
        </section>

        {/* --- Paso 2 --- */}
        {consentimiento && (
          <section className="consent-card">
            <div className="consent-card-header">
              <span className="consent-step">2</span>
              <h3>
                Firmar consentimiento #{consentimiento.id}{" "}
                <span
                  className={`consent-badge ${
                    consentimiento.estado === "Firmado" ? "is-signed" : "is-pending"
                  }`}
                >
                  {consentimiento.estado}
                </span>
              </h3>
            </div>

            {consentimiento.estado === "Firmado" ? (
              <p className="consent-note is-ok">Este consentimiento ya está firmado.</p>
            ) : (
              <FirmaElectronica
                onGuardar={guardarFirma}
                etiqueta={guardandoFirma ? "Guardando..." : "Firme dentro del recuadro"}
                deshabilitado={guardandoFirma}
              />
            )}
          </section>
        )}

        {/* --- Paso 3 --- */}
        {consentimiento && (
          <section className="consent-card">
            <div className="consent-card-header consent-card-header-split">
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span className="consent-step">3</span>
                <h3>Historial</h3>
              </div>
              <button
                onClick={cargarHistorial}
                disabled={cargandoHistorial}
                className="consent-btn-ghost"
              >
                {cargandoHistorial ? (
                  <Loader2 size={13} className="spin" />
                ) : (
                  <RefreshCcw size={13} />
                )}
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

            <button onClick={generarPdfLocal} className="consent-btn-primary consent-full">
              <FileDown size={14} />
              Generar PDF de prueba (jsPDF)
            </button>
            <p className="consent-hint">
              Este PDF se genera en el cliente, solo para comparar contra el PDF oficial que
              genera el backend con DomPDF (campo <code>pdf</code> del consentimiento).
            </p>
          </section>
        )}
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