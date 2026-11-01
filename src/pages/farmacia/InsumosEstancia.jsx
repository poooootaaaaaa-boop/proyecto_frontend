import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Activity, BedDouble, Check, Edit2, Loader2, Plus, Search, Thermometer, ToggleLeft, ToggleRight, X } from "lucide-react";
import Sidebar from "../../components/farmacia/Sidebar";
import "./insumosEstancia.css";

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIAS = [
  { value: "medicamento", label: "Medicamento" },
  { value: "suero", label: "Suero" },
  { value: "material_medico", label: "Material médico" },
];
const FORM_VACIO = { nombre: "", categoria: "medicamento", unidad_medida: "pieza", precio_unitario: "", activo: true };
const CLINICO_VACIO = { diagnostico: "", temperatura: "", presion: "", pulso: "", observaciones: "" };
const CONSUMO_VACIO = { insumo_id: "", cantidad: "1", observaciones: "" };
const moneda = (valor) => Number(valor || 0).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
const listaApi = (response) => Array.isArray(response.data?.data) ? response.data.data : Array.isArray(response.data) ? response.data : [];

export default function InsumosEstancia() {
  const [insumos, setInsumos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [editorAbierto, setEditorAbierto] = useState(false);
  const [seleccionado, setSeleccionado] = useState(null);
  const [form, setForm] = useState(FORM_VACIO);
  const [mensaje, setMensaje] = useState(null);
  const [vista, setVista] = useState("registro");

  const cargarInsumos = useCallback(async () => {
    setCargando(true);
    try {
      const res = await axios.get(`${API_URL}/insumos-estancia`, {
        params: { incluir_inactivos: 1, buscar: busqueda || undefined, categoria: categoria || undefined },
      });
      setInsumos(res.data?.data ?? []);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudo cargar el catálogo." });
    } finally {
      setCargando(false);
    }
  }, [busqueda, categoria]);

  useEffect(() => {
    const timeout = setTimeout(cargarInsumos, 250);
    return () => clearTimeout(timeout);
  }, [cargarInsumos]);

  const abrirNuevo = () => {
    setSeleccionado(null);
    setForm(FORM_VACIO);
    setMensaje(null);
    setEditorAbierto(true);
  };

  const abrirEdicion = (insumo) => {
    setSeleccionado(insumo);
    setForm({
      nombre: insumo.nombre,
      categoria: insumo.categoria,
      unidad_medida: insumo.unidad_medida,
      precio_unitario: insumo.precio_unitario,
      activo: insumo.activo,
    });
    setMensaje(null);
    setEditorAbierto(true);
  };

  const guardar = async (event) => {
    event.preventDefault();
    setGuardando(true);
    setMensaje(null);
    try {
      if (seleccionado) {
        await axios.patch(`${API_URL}/insumos-estancia/${seleccionado.id}`, form);
      } else {
        await axios.post(`${API_URL}/insumos-estancia`, form);
      }
      setSeleccionado(null);
      setEditorAbierto(false);
      setMensaje({ tipo: "ok", texto: seleccionado ? "Insumo actualizado." : "Insumo agregado al catálogo." });
      await cargarInsumos();
    } catch (error) {
      const errores = error.response?.data?.errors;
      setMensaje({
        tipo: "error",
        texto: error.response?.data?.message || (errores ? Object.values(errores).flat().join(" ") : "No se pudo guardar el insumo."),
      });
    } finally {
      setGuardando(false);
    }
  };

  const alternarEstado = async (insumo) => {
    try {
      await axios.patch(`${API_URL}/insumos-estancia/${insumo.id}`, { activo: !insumo.activo });
      setMensaje({ tipo: "ok", texto: insumo.activo ? "Insumo desactivado." : "Insumo reactivado." });
      await cargarInsumos();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudo cambiar el estado." });
    }
  };

  return (
    <div className="insumos-layout">
      <Sidebar />
      <main className="insumos-main">
        <header className="insumos-header">
          <div>
            <span className="insumos-eyebrow">Hospitalización</span>
            <h1>{vista === "registro" ? "Registro de estancia" : "Catálogo de insumos"}</h1>
            <p>{vista === "registro" ? "Registra diagnóstico, signos vitales y los insumos utilizados por paciente." : "Administra los precios y unidades disponibles para las estancias."}</p>
          </div>
          {vista === "catalogo" && <button type="button" className="insumos-primary" onClick={abrirNuevo}><Plus size={16} /> Nuevo insumo</button>}
        </header>

        {mensaje && <div className={`insumos-message is-${mensaje.tipo}`} role="status">{mensaje.texto}</div>}

        <div className="insumos-tabs" role="tablist" aria-label="Secciones de estancia">
          <button type="button" role="tab" aria-selected={vista === "registro"} className={vista === "registro" ? "is-active" : ""} onClick={() => { setVista("registro"); setMensaje(null); }}>Registro de pacientes</button>
          <button type="button" role="tab" aria-selected={vista === "catalogo"} className={vista === "catalogo" ? "is-active" : ""} onClick={() => { setVista("catalogo"); setMensaje(null); }}>Catálogo de insumos</button>
        </div>

        {vista === "registro" ? <RegistroEstancia onMensaje={setMensaje} /> : <>
        <section className="insumos-toolbar" aria-label="Filtros del catálogo">
          <label className="insumos-search">
            <Search size={16} />
            <input value={busqueda} onChange={(event) => setBusqueda(event.target.value)} placeholder="Buscar insumo" aria-label="Buscar insumo" />
          </label>
          <label className="insumos-category">
            <span>Categoría</span>
            <select value={categoria} onChange={(event) => setCategoria(event.target.value)}>
              <option value="">Todas</option>
              {CATEGORIAS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </label>
          <span className="insumos-count">{insumos.length} insumo{insumos.length === 1 ? "" : "s"}</span>
        </section>

        <div className="insumos-table-wrap">
          <table className="insumos-table">
            <thead><tr><th>Nombre</th><th>Categoría</th><th>Unidad</th><th>Precio unitario</th><th>Estado</th><th aria-label="Acciones" /></tr></thead>
            <tbody>
              {cargando ? <tr><td colSpan={6} className="insumos-empty">Cargando catálogo…</td></tr> : insumos.length === 0 ? <tr><td colSpan={6} className="insumos-empty">No hay insumos que coincidan.</td></tr> : insumos.map((insumo) => (
                <tr key={insumo.id} className={!insumo.activo ? "is-inactive" : ""}>
                  <td className="insumos-name">{insumo.nombre}</td>
                  <td>{CATEGORIAS.find((item) => item.value === insumo.categoria)?.label || insumo.categoria}</td>
                  <td>{insumo.unidad_medida}</td>
                  <td>{moneda(insumo.precio_unitario)}</td>
                  <td><span className={`insumos-status ${insumo.activo ? "is-active" : "is-inactive"}`}>{insumo.activo ? "Activo" : "Inactivo"}</span></td>
                  <td>
                    <div className="insumos-actions">
                      <button type="button" title="Editar insumo" aria-label={`Editar ${insumo.nombre}`} onClick={() => abrirEdicion(insumo)}><Edit2 size={15} /></button>
                      <button type="button" title={insumo.activo ? "Desactivar insumo" : "Reactivar insumo"} aria-label={insumo.activo ? `Desactivar ${insumo.nombre}` : `Reactivar ${insumo.nombre}`} onClick={() => alternarEstado(insumo)}>
                        {insumo.activo ? <ToggleRight size={17} /> : <ToggleLeft size={17} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>}
      </main>

      {editorAbierto && (
        <div className="insumos-overlay" onClick={() => setEditorAbierto(false)}>
          <form className="insumos-dialog" onSubmit={guardar} onClick={(event) => event.stopPropagation()}>
            <div className="insumos-dialog-head"><div><small>{seleccionado ? "Editar catálogo" : "Nuevo registro"}</small><h2>{seleccionado ? "Editar insumo" : "Agregar insumo"}</h2></div><button type="button" aria-label="Cerrar" onClick={() => setEditorAbierto(false)}><X size={18} /></button></div>
            <InsumoFields form={form} setForm={setForm} />
            <div className="insumos-dialog-actions"><button type="button" className="insumos-secondary" onClick={() => setEditorAbierto(false)}>Cancelar</button><button type="submit" className="insumos-primary" disabled={guardando}>{guardando ? "Guardando…" : <><Check size={15} /> Guardar</>}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}

function RegistroEstancia({ onMensaje }) {
  const [estancias, setEstancias] = useState([]);
  const [doctoresRelacionados, setDoctoresRelacionados] = useState([]);
  const [estanciaId, setEstanciaId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [detalle, setDetalle] = useState(null);
  const [insumos, setInsumos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoDoctores, setCargandoDoctores] = useState(false);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [formClinico, setFormClinico] = useState(CLINICO_VACIO);
  const [consumo, setConsumo] = useState(CONSUMO_VACIO);
  const [consumosPendientes, setConsumosPendientes] = useState([]);

  const cargarEstancias = useCallback(async () => {
    setCargando(true);
    try {
      const response = await axios.get(`${API_URL}/hospitalizaciones/activas`);
      const items = listaApi(response);
      setEstancias(items);
      setEstanciaId((actual) => actual && items.some((item) => String(item.id) === actual) ? actual : "");
    } catch (error) {
      onMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudieron cargar las estancias activas." });
    } finally {
      setCargando(false);
    }
  }, [onMensaje]);

  useEffect(() => { cargarEstancias(); }, [cargarEstancias]);

  useEffect(() => {
    axios.get(`${API_URL}/insumos-estancia`)
      .then((response) => setInsumos(listaApi(response)))
      .catch((error) => {
        onMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudo cargar el catálogo de insumos." });
      });
  }, [onMensaje]);

  // Doctores vinculados a la estancia (responsable + vigilancia del consentimiento)
  useEffect(() => {
    setDetalle(null);
    if (!estanciaId) {
      setDoctoresRelacionados([]);
      setDoctorId("");
      return undefined;
    }
    let activo = true;
    setCargandoDoctores(true);
    setDoctoresRelacionados([]);
    setDoctorId("");
    axios.get(`${API_URL}/hospitalizaciones/${estanciaId}/doctores-vinculados`)
      .then((response) => {
        if (!activo) return;
        const items = listaApi(response);
        setDoctoresRelacionados(items);
        setDoctorId(String(items[0]?.id ?? ""));
      })
      .catch((error) => {
        if (!activo) return;
        setDoctoresRelacionados([]);
        onMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudieron cargar los doctores vinculados." });
      })
      .finally(() => { if (activo) setCargandoDoctores(false); });
    return () => { activo = false; };
  }, [estanciaId, onMensaje]);

  const ocupacionSeleccionada = estancias.find((item) => String(item.id) === estanciaId);
  const pacienteNombre = (item) => item?.paciente?.usuario?.nombre || item?.paciente?.nombre || `Paciente #${item?.paciente_id}`;

  // reiniciar=true: cambio de paciente/médico (limpia formularios).
  // reiniciar=false: solo refresca los datos después de guardar, sin perder lo que se está capturando.
  const cargarDetalle = useCallback(async (ocupacion, responsableId, reiniciar = true) => {
    if (!ocupacion || !responsableId) {
      setDetalle(null);
      return;
    }
    if (reiniciar) {
      setDetalle(null);
      setCargandoDetalle(true);
      onMensaje(null);
    }
    try {
      const response = await axios.get(`${API_URL}/hospitalizaciones/${ocupacion.id}/seguimiento`, { params: { doctor_id: Number(responsableId) } });
      setDetalle(response.data?.data || response.data || null);
      if (reiniciar) {
        setFormClinico(CLINICO_VACIO);
        setConsumo(CONSUMO_VACIO);
        setConsumosPendientes([]);
      }
    } catch (error) {
      if (reiniciar) setDetalle(null);
      onMensaje({ tipo: "error", texto: error.response?.data?.message || "No se pudo cargar el seguimiento de la estancia." });
    } finally {
      if (reiniciar) setCargandoDetalle(false);
    }
  }, [onMensaje]);

  useEffect(() => {
    cargarDetalle(ocupacionSeleccionada, doctorId);
  }, [ocupacionSeleccionada, doctorId, cargarDetalle]);

  const consumoActualValido = Boolean(consumo.insumo_id) && Number(consumo.cantidad) > 0;
  const renglonesClinicos = () => [
    "Registro de Farmacia",
    formClinico.diagnostico.trim() && `Diagnóstico reportado: ${formClinico.diagnostico.trim()}`,
    formClinico.temperatura && `Temperatura: ${formClinico.temperatura} °C`,
    formClinico.presion.trim() && `Presión arterial: ${formClinico.presion.trim()} mmHg`,
    formClinico.pulso && `Pulso: ${formClinico.pulso} lpm`,
    formClinico.observaciones.trim() && `Observaciones: ${formClinico.observaciones.trim()}`,
  ].filter(Boolean);
  const hayClinico = renglonesClinicos().length > 1;
  const hayAlgoQueGuardar = hayClinico || consumosPendientes.length > 0 || consumoActualValido;

  // Un solo botón guarda todo: registro clínico + insumos de la lista + el insumo que esté seleccionado.
  const guardarTodo = async (event) => {
    event.preventDefault();
    if (!detalle || guardando) return;
    if (!doctorId) {
      onMensaje({ tipo: "error", texto: "Selecciona el médico responsable antes de guardar." });
      return;
    }

    const renglones = renglonesClinicos();
    const guardarClinico = renglones.length > 1;

    // Si dejaron un insumo seleccionado sin pulsar "Agregar a la lista", se incluye también.
    let lista = consumosPendientes;
    if (consumoActualValido) {
      const nuevo = { ...consumo, clave: `${Date.now()}-${Math.random()}` };
      lista = [...consumosPendientes, nuevo];
      setConsumosPendientes(lista);
      setConsumo(CONSUMO_VACIO);
    }

    if (!guardarClinico && lista.length === 0) {
      onMensaje({ tipo: "error", texto: "Captura un registro clínico o agrega al menos un insumo." });
      return;
    }

    setGuardando(true);
    onMensaje(null);
    let clinicoGuardado = false;
    let registrados = 0;
    try {
      if (guardarClinico) {
        await axios.post(`${API_URL}/hospitalizaciones/${detalle.id}/observaciones`, {
          doctor_id: Number(doctorId),
          descripcion: renglones.join("\n"),
        });
        clinicoGuardado = true;
        setFormClinico(CLINICO_VACIO);
      }

      for (const item of lista) {
        await axios.post(`${API_URL}/hospitalizaciones/${detalle.id}/consumos`, {
          doctor_id: Number(doctorId),
          insumo_id: Number(item.insumo_id),
          cantidad: Number(item.cantidad),
          observaciones: `Registro de Farmacia${item.observaciones.trim() ? `: ${item.observaciones.trim()}` : ""}`,
        });
        registrados += 1;
        setConsumosPendientes((actuales) => actuales.filter((pendiente) => pendiente.clave !== item.clave));
      }

      const partes = [];
      if (clinicoGuardado) partes.push("registro clínico guardado");
      if (registrados) partes.push(`${registrados} insumo(s) registrado(s)`);
      onMensaje({ tipo: "ok", texto: `Listo: ${partes.join(" y ")}.` });
    } catch (error) {
      const guardado = [clinicoGuardado && "el registro clínico", registrados > 0 && `${registrados} insumo(s)`].filter(Boolean).join(" y ");
      onMensaje({
        tipo: "error",
        texto: `${error.response?.data?.message || "No se pudo guardar todo."}${guardado ? ` Ya se guardó ${guardado}.` : ""} Lo pendiente sigue en pantalla.`,
      });
    } finally {
      setGuardando(false);
      await cargarDetalle(ocupacionSeleccionada, doctorId, false);
    }
  };

  const agregarConsumoPendiente = () => {
    if (!consumo.insumo_id || !Number(consumo.cantidad)) return;
    setConsumosPendientes((actuales) => [...actuales, { ...consumo, clave: `${Date.now()}-${Math.random()}` }]);
    setConsumo(CONSUMO_VACIO);
  };

  const totalPendiente = consumosPendientes.reduce((suma, item) => {
    const insumo = insumos.find((catalogo) => String(catalogo.id) === String(item.insumo_id));
    return suma + Number(item.cantidad) * Number(insumo?.precio_unitario || 0);
  }, 0);

  const etiquetaDoctor = (doctor) =>
    `${doctor.nombre || doctor.correo || `Doctor #${doctor.id}`}${doctor.especialidad ? ` · ${doctor.especialidad}` : ""}${doctor.rol === "responsable" ? " (responsable)" : ""}`;

  return (
    <section className="estancia-registro">
      <div className="estancia-selector-row">
        <label className="insumos-field">Paciente hospitalizado
          <select value={estanciaId} onChange={(event) => setEstanciaId(event.target.value)}>
            <option value="">Selecciona un paciente</option>
            {estancias.map((item) => <option key={item.id} value={item.id}>{pacienteNombre(item)}{item.habitacion?.numero ? ` · Hab. ${item.habitacion.numero}` : ""}</option>)}
          </select>
        </label>
        <button type="button" className="insumos-secondary" onClick={cargarEstancias} disabled={cargando}>{cargando ? <Loader2 size={15} className="estancia-spin" /> : <BedDouble size={15} />} Actualizar</button>
      </div>
      {cargando && <div className="estancia-empty"><Loader2 size={17} className="estancia-spin" /> Cargando pacientes hospitalizados…</div>}
      {!cargando && estancias.length === 0 && <div className="estancia-empty">No hay pacientes hospitalizados activos.</div>}
      {ocupacionSeleccionada && <label className="insumos-field estancia-doctor-select">Médico responsable
        <select required value={doctorId} onChange={(event) => setDoctorId(event.target.value)} disabled={cargandoDoctores}>
          <option value="">{cargandoDoctores ? "Cargando médicos…" : "Selecciona un médico vinculado"}</option>
          {doctoresRelacionados.map((doctor) => <option key={doctor.id} value={doctor.id}>{etiquetaDoctor(doctor)}</option>)}
        </select>
      </label>}
      {ocupacionSeleccionada && !cargandoDoctores && doctoresRelacionados.length === 0 && <div className="estancia-empty">Esta estancia no tiene médicos asignados en su consentimiento (responsable o vigilancia).</div>}
      {ocupacionSeleccionada && !cargandoDoctores && doctoresRelacionados.length > 0 && !doctorId && <div className="estancia-empty">Selecciona un médico vinculado para cargar el expediente.</div>}
      {ocupacionSeleccionada && doctorId && (cargandoDetalle ? <div className="estancia-empty"><Loader2 size={17} className="estancia-spin" /> Cargando expediente…</div> : detalle && <>
        <div className="estancia-paciente-resumen">
          <div><span>Paciente</span><strong>{pacienteNombre(detalle)}</strong></div>
          <div><span>Diagnóstico de ingreso</span><strong>{detalle.diagnostico || "Sin diagnóstico capturado"}</strong></div>
          <div><span>Habitación</span><strong>{detalle.habitacion?.numero ? `Hab. ${detalle.habitacion.numero}` : "Sin habitación"}</strong></div>
        </div>
        <form className="estancia-guardar-todo" onSubmit={guardarTodo}>
        <div className="estancia-form-grid">
          <div className="estancia-form">
            <h2><Activity size={17} /> Diagnóstico y signos vitales</h2>
            <label className="insumos-field">Diagnóstico<textarea rows={2} value={formClinico.diagnostico} onChange={(event) => setFormClinico((current) => ({ ...current, diagnostico: event.target.value }))} placeholder="Diagnóstico observado o actualización" /></label>
            <div className="estancia-vitales-grid">
              <label className="insumos-field"><span><Thermometer size={14} /> Temperatura (°C)</span><input type="number" min="25" max="45" step="0.1" value={formClinico.temperatura} onChange={(event) => setFormClinico((current) => ({ ...current, temperatura: event.target.value }))} placeholder="36.5" /></label>
              <label className="insumos-field">Presión arterial (mmHg)<input value={formClinico.presion} onChange={(event) => setFormClinico((current) => ({ ...current, presion: event.target.value }))} placeholder="120/80" /></label>
              <label className="insumos-field">Pulso (lpm)<input type="number" min="1" max="250" value={formClinico.pulso} onChange={(event) => setFormClinico((current) => ({ ...current, pulso: event.target.value }))} placeholder="72" /></label>
            </div>
            <label className="insumos-field">Observaciones<textarea rows={2} value={formClinico.observaciones} onChange={(event) => setFormClinico((current) => ({ ...current, observaciones: event.target.value }))} placeholder="Notas relevantes para el médico" /></label>
          </div>
          <div className="estancia-form">
            <h2><Plus size={17} /> Insumos consumidos</h2>
            <label className="insumos-field">Insumo<select value={consumo.insumo_id} onChange={(event) => setConsumo((current) => ({ ...current, insumo_id: event.target.value }))}><option value="">Selecciona un insumo</option>{insumos.filter((item) => item.activo !== false).map((item) => <option key={item.id} value={item.id}>{item.nombre} · {moneda(item.precio_unitario)}/{item.unidad_medida}</option>)}</select></label>
            <label className="insumos-field">Cantidad<input type="number" min="0.001" step="0.001" value={consumo.cantidad} onChange={(event) => setConsumo((current) => ({ ...current, cantidad: event.target.value }))} /></label>
            <label className="insumos-field">Observaciones del consumo<input value={consumo.observaciones} onChange={(event) => setConsumo((current) => ({ ...current, observaciones: event.target.value }))} placeholder="Opcional" /></label>
            <button type="button" className="insumos-secondary estancia-add-consumo" disabled={!consumo.insumo_id || !Number(consumo.cantidad)} onClick={agregarConsumoPendiente}><Plus size={15} /> Agregar a la lista</button>
            {consumosPendientes.length > 0 && <div className="estancia-consumos-pendientes">
              <strong>Insumos por registrar ({consumosPendientes.length}) · {moneda(totalPendiente)}</strong>
              {consumosPendientes.map((item) => {
                const insumo = insumos.find((catalogo) => String(catalogo.id) === String(item.insumo_id));
                return <div className="estancia-consumo-pendiente" key={item.clave}>
                  <span>{insumo?.nombre || "Insumo"} · {item.cantidad} {insumo?.unidad_medida || ""} · {moneda(Number(item.cantidad) * Number(insumo?.precio_unitario || 0))}{item.observaciones.trim() && <small>{item.observaciones.trim()}</small>}</span>
                  <button type="button" aria-label={`Quitar ${insumo?.nombre || "insumo"}`} onClick={() => setConsumosPendientes((actuales) => actuales.filter((pendiente) => pendiente.clave !== item.clave))}><X size={15} /></button>
                </div>;
              })}
            </div>}
          </div>
        </div>
        <div className="estancia-guardar-todo-actions">
          <button type="submit" className="insumos-primary" disabled={guardando || !doctorId || !hayAlgoQueGuardar}>
            {guardando ? "Guardando…" : <><Check size={15} /> Guardar todo</>}
          </button>
        </div>
        </form>
        <section className="estancia-form estancia-consumos-registrados">
          <h2><Plus size={17} /> Consumo registrado · {moneda(detalle.costo_total)}</h2>
          {(detalle.consumos || []).length === 0 ? <p className="estancia-empty">Aún no hay insumos registrados en esta estancia.</p> : (
            <div className="insumos-table-wrap">
              <table className="insumos-table">
                <thead><tr><th>Fecha</th><th>Insumo</th><th>Cantidad</th><th>Precio unitario</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {detalle.consumos.map((item) => (
                    <tr key={item.id}>
                      <td>{item.fecha_hora ? new Date(item.fecha_hora).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" }) : "—"}</td>
                      <td className="insumos-name">{item.insumo?.nombre || "Insumo"}</td>
                      <td>{item.cantidad} {item.insumo?.unidad_medida || ""}</td>
                      <td>{moneda(item.precio_unitario)}</td>
                      <td>{moneda(item.subtotal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </>)}
    </section>
  );
}

function InsumoFields({ form, setForm }) {
  return (
    <div className="insumos-form-grid">
      <label className="insumos-field insumos-full">Nombre<input required maxLength={180} value={form.nombre} onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))} /></label>
      <label className="insumos-field">Categoría<select required value={form.categoria} onChange={(event) => setForm((current) => ({ ...current, categoria: event.target.value }))}>{CATEGORIAS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
      <label className="insumos-field">Unidad de medida<input required maxLength={60} value={form.unidad_medida} onChange={(event) => setForm((current) => ({ ...current, unidad_medida: event.target.value }))} placeholder="pieza, ml, dosis…" /></label>
      <label className="insumos-field">Precio unitario<input required type="number" min="0" step="0.01" value={form.precio_unitario} onChange={(event) => setForm((current) => ({ ...current, precio_unitario: event.target.value }))} /></label>
      <label className="insumos-active"><input type="checkbox" checked={form.activo} onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))} /> Activo para nuevas estancias</label>
    </div>
  );
}