import { useCallback, useEffect, useState } from "react";
import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL;
export const PERSONAL_URL = `${API_URL}/personal`;

/* ---------- Sesión ---------- */
export const getUsuario = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario") || "null");
  } catch {
    return null;
  }
};
export const getClinicaId = () => getUsuario()?.clinica_id ?? null;

/* ---------- Catálogos ---------- */
export const DIAS = [
  { n: 1, corto: "Lun", largo: "Lunes" },
  { n: 2, corto: "Mar", largo: "Martes" },
  { n: 3, corto: "Mié", largo: "Miércoles" },
  { n: 4, corto: "Jue", largo: "Jueves" },
  { n: 5, corto: "Vie", largo: "Viernes" },
  { n: 6, corto: "Sáb", largo: "Sábado" },
  { n: 7, corto: "Dom", largo: "Domingo" },
];

export const TIPOS_CONTRATO = {
  indeterminado: "Indeterminado",
  determinado: "Determinado",
  honorarios: "Honorarios",
  practicas: "Prácticas",
};

export const TIPOS_PERMISO = {
  personal: "Personal",
  medico: "Médico / incapacidad",
  estudio: "Estudio",
  duelo: "Duelo",
  maternidad_paternidad: "Maternidad / paternidad",
  otro: "Otro",
};

export const ESTADOS_SOLICITUD = {
  pendiente: { label: "Pendiente", bg: "warning", text: "dark" },
  aprobado: { label: "Aprobado", bg: "success" },
  rechazado: { label: "Rechazado", bg: "danger" },
  cancelado: { label: "Cancelado", bg: "secondary" },
};

export const TIPOS_HISTORIAL = {
  alta: { label: "Alta", icon: "bi-person-plus", color: "green" },
  cambio_puesto: { label: "Cambio de puesto", icon: "bi-arrow-left-right", color: "blue" },
  cambio_salario: { label: "Cambio de salario", icon: "bi-cash-coin", color: "blue" },
  baja: { label: "Baja", icon: "bi-person-dash", color: "red" },
  reingreso: { label: "Reingreso", icon: "bi-arrow-counterclockwise", color: "green" },
  permiso: { label: "Permiso", icon: "bi-file-earmark-check", color: "indigo" },
  vacaciones: { label: "Vacaciones", icon: "bi-sun", color: "amber" },
  reconocimiento: { label: "Reconocimiento", icon: "bi-award", color: "green" },
  amonestacion: { label: "Amonestación", icon: "bi-exclamation-triangle", color: "red" },
  capacitacion: { label: "Capacitación", icon: "bi-mortarboard", color: "indigo" },
  otro: { label: "Otro", icon: "bi-journal-text", color: "gray" },
};

/* ---------- Formato ---------- */
export const fmtFecha = (s) => {
  if (!s) return "—";
  const d = new Date(`${String(s).slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
};

export const fmtRango = (ini, fin) =>
  String(ini).slice(0, 10) === String(fin).slice(0, 10) ? fmtFecha(ini) : `${fmtFecha(ini)} – ${fmtFecha(fin)}`;

export const fmtMoney = (v) =>
  v === null || v === undefined || v === ""
    ? "—"
    : Number(v).toLocaleString("es-MX", { style: "currency", currency: "MXN" });

export const hhmm = (t) => (t ? String(t).slice(0, 5) : "");

export const iniciales = (nombre = "", apellidos = "") =>
  `${nombre.trim()[0] || ""}${apellidos.trim()[0] || ""}`.toUpperCase() || "?";

/* ---------- Errores y avisos ---------- */
export const errMsg = (err, fallback = "Ocurrió un error. Intenta de nuevo.") => {
  const d = err?.response?.data;
  if (d?.errors) {
    const primero = Object.values(d.errors).flat()[0];
    if (primero) return primero;
  }
  return d?.message || fallback;
};

export function useAviso() {
  const [aviso, setAviso] = useState(null);
  const ok = useCallback((mensaje) => setAviso({ tipo: "success", mensaje }), []);
  const error = useCallback(
    (e) => setAviso({ tipo: "danger", mensaje: typeof e === "string" ? e : errMsg(e) }),
    []
  );
  const limpiar = useCallback(() => setAviso(null), []);

  useEffect(() => {
    if (!aviso) return undefined;
    const t = setTimeout(() => setAviso(null), 6000);
    return () => clearTimeout(t);
  }, [aviso]);

  return { aviso, ok, error, limpiar };
}

/* ---------- Datos ---------- */
/** estado: "activo" | "baja" | "" (todos) */
export function useEmpleados(clinicaId, estado = "activo") {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(true);

  const recargar = useCallback(async () => {
    if (!clinicaId) return;
    try {
      const { data } = await axios.get(`${PERSONAL_URL}/empleados`, {
        params: { clinica_id: clinicaId, estado: estado || undefined },
      });
      setEmpleados(data);
    } catch (err) {
      console.log("Error al cargar empleados:", err);
    } finally {
      setLoading(false);
    }
  }, [clinicaId, estado]);

  useEffect(() => {
    recargar();
  }, [recargar]);

  return { empleados, loading, recargar };
}

/** Horas de un bloque HH:MM → HH:MM (soporta turnos nocturnos). */
export const horasBloque = (ini, fin) => {
  const aMin = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  let d = aMin(hhmm(fin)) - aMin(hhmm(ini));
  if (d <= 0) d += 1440;
  return d / 60;
};