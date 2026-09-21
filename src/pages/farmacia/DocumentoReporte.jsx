import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.rh-wrap { font-family: Arial, sans-serif; font-size: 11px; background: #c8c8c8; min-height: 100vh; padding: 16px; color: #111; }
.rh-page { background: #fff; width: 720px; margin: 0 auto; border: 2px solid #222; }

.rh-header { display: flex; align-items: center; padding: 12px 16px; border-bottom: 2px solid #222; gap: 12px; }
.rh-logo-box { width: 52px; height: 52px; background: #1a3a5c; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 900; border-radius: 4px; letter-spacing: -1px; }
.rh-logo-txt { font-size: 10px; color: #555; line-height: 1.4; margin-left: 8px; }
.rh-logo-txt strong { display: block; font-size: 12px; color: #1a3a5c; }
.rh-title-block { flex: 1; text-align: right; }
.rh-title { font-size: 20px; font-weight: 900; color: #1a3a5c; text-transform: uppercase; letter-spacing: 1px; }
.rh-meta-row { display: flex; justify-content: flex-end; gap: 6px; align-items: center; margin-top: 3px; }
.rh-meta-lbl { font-size: 8px; font-weight: 700; color: #555; text-transform: uppercase; }
.rh-meta-val { font-size: 11px; font-weight: 700; color: #1a3a5c; }

.prio-badge { display: inline-block; padding: 2px 10px; border-radius: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-left: 8px; }
.prio-alta  { background: #f8d7da; color: #721c24; }
.prio-media { background: #fff3cd; color: #856404; }
.prio-baja  { background: #d4edda; color: #155724; }

.rh-sec { background: #1a3a5c; color: #fff; font-size: 9px; font-weight: 700; padding: 3px 14px; text-transform: uppercase; letter-spacing: 0.5px; }

.rh-datos { display: flex; border-bottom: 1.5px solid #222; }
.rh-col { flex: 1; padding: 7px 12px; border-right: 1px solid #aaa; }
.rh-col:last-child { border-right: none; }
.rh-field { margin-bottom: 5px; }
.rh-field label { display: block; font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 1px; }
.rh-field span { display: block; font-size: 10.5px; color: #111; border-bottom: 1px solid #eee; padding: 1px 0; }

table.rh-tbl { width: 100%; border-collapse: collapse; }
table.rh-tbl thead tr { background: #1a3a5c; color: #fff; }
table.rh-tbl th { padding: 5px 6px; font-size: 8.5px; font-weight: 700; text-transform: uppercase; text-align: center; border-right: 1px solid #2c5282; }
table.rh-tbl th:last-child { border-right: none; }
table.rh-tbl tbody tr { border-bottom: 1px solid #ddd; }
table.rh-tbl td { padding: 4px 6px; border-right: 1px solid #ddd; text-align: center; font-size: 10px; vertical-align: middle; }
table.rh-tbl td.left { text-align: left; }
table.rh-tbl td:last-child { border-right: none; }
.est-ok    { background: #d4edda; color: #155724; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 9px; }
.est-revision { background: #fff3cd; color: #856404; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 9px; }
.est-falla { background: #f8d7da; color: #721c24; padding: 2px 8px; border-radius: 3px; font-weight: 700; font-size: 9px; }

.rh-totales { display: flex; justify-content: flex-end; border-top: 2px solid #1a3a5c; padding: 6px 14px 4px; }
.rh-tot-tbl { font-size: 11px; }
.rh-tot-tbl td { padding: 2px 8px; }
.t-lbl { text-align: right; color: #555; font-weight: 600; }
.t-val { text-align: right; font-weight: 700; color: #111; min-width: 110px; border-bottom: 1px solid #ddd; }
.t-total .t-lbl { color: #1a3a5c; font-size: 13px; font-weight: 900; }
.t-total .t-val { color: #1a3a5c; font-size: 14px; font-weight: 900; border-bottom: 2px solid #1a3a5c; }

.rh-desc { padding: 7px 14px; border-bottom: 1.5px solid #222; }
.rh-desc label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; }
.rh-desc p { font-size: 10.5px; color: #111; line-height: 1.5; }

.rh-foto-block { padding: 7px 14px; border-bottom: 1.5px solid #222; }
.rh-foto-img { max-height: 220px; max-width: 100%; border-radius: 6px; border: 1px solid #ddd; object-fit: contain; margin-top: 6px; }
.rh-foto-placeholder { width: 100%; height: 100px; border: 1.5px dashed #bbb; border-radius: 6px; display: flex; align-items: center; justify-content: center; color: #aaa; font-size: 10px; margin-top: 6px; }

.rh-footer { display: flex; align-items: flex-end; padding: 10px 14px 14px; border-top: 1.5px solid #222; gap: 20px; }
.rh-firma { flex: 1; }
.rh-firma label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; }
.rh-firma-line { border-top: 1.5px solid #555; height: 32px; margin-bottom: 4px; }
.rh-firma-sub { font-size: 9px; color: #555; border-top: 1px solid #ccc; padding-top: 2px; }
.rh-sello { width: 90px; height: 80px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; text-transform: uppercase; transform: rotate(-8deg); gap: 2px; flex-shrink: 0; }

.rh-print-btn { display: block; margin: 14px auto; padding: 8px 28px; background: #1a3a5c; color: #fff; border: none; font-size: 12px; font-family: Arial; font-weight: 700; cursor: pointer; border-radius: 3px; }
.rh-print-btn:hover { background: #2c5282; }

@media print {
  body { background: white !important; }
  .rh-wrap { background: white; padding: 0; }
  .rh-page { border: none; width: 100%; }
  .rh-print-btn { display: none; }
  .rh-sec, table.rh-tbl thead tr, .rh-sello { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  .prio-badge, .est-ok, .est-revision, .est-falla { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("es-MX", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtFecha(f) {
  if (!f) return "-";
  const [y, m, d] = f.split("-");
  if (!y || !m || !d) return f;
  const meses = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"];
  return `${parseInt(d)} de ${meses[parseInt(m) - 1]} de ${y}`;
}

// Mapeo de prioridad a estilos
const PRIO = {
  alta:  { cls: "prio-alta",  label: "Alta",  selloColor: "#721c24", icon: "!" },
  media: { cls: "prio-media", label: "Media", selloColor: "#856404", icon: "~" },
  baja:  { cls: "prio-baja",  label: "Baja",  selloColor: "#155724", icon: "✔" },
};

export default function DocumentoReporte() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const reportes = state?.reportes?.length
    ? state.reportes
    : state?.reporte
      ? [state.reporte]
      : [];
  const reporte = reportes[0];

  if (!reporte) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h2>REPORTE DE HABITACIÓN</h2>
        <p style={{ marginTop: 12, color: "#c0392b" }}>
          No se encontró el reporte. Vuelva al formulario e intente de nuevo.
        </p>
      </div>
    );
  }

  const prio      = PRIO[reporte.prioridad] ?? PRIO.media;
  const costo     = reportes.reduce((total, item) => total + Number(item.costo || 0), 0);
  const iva       = costo * 0.16;
  const total     = costo + iva;

  return (
    <>
      <style>{css}</style>
      <div className="rh-wrap">
        <div className="rh-page">

          {/* ── HEADER ── */}
          <div className="rh-header">
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div className="rh-logo-box">ST</div>
              <div className="rh-logo-txt">
                <strong>SOLUCIONES<br />TECNOLÓGICAS</strong>S.A. de C.V.
              </div>
            </div>
            <div className="rh-title-block">
              <div className="rh-title">
                Reporte de Habitación
                <span className={`prio-badge ${prio.cls}`}>{prio.label}</span>
              </div>
              <div className="rh-meta-row">
                <span className="rh-meta-lbl">Fecha:</span>
                <span className="rh-meta-val">{fmtFecha(reporte.fecha_registro)}</span>
              </div>
            </div>
          </div>

          {/* ── DATOS DE LA HABITACIÓN ── */}
          <div className="rh-sec">Datos de la habitación</div>
          <div className="rh-datos">
            <div className="rh-col">
              <div className="rh-field">
                <label>No. de cuarto</label>
                <span>{reporte.cuarto_id ?? "-"}</span>
              </div>
            </div>
            <div className="rh-col">
              <div className="rh-field">
                <label>Prioridad</label>
                <span>{prio.label}</span>
              </div>
            </div>
            <div className="rh-col">
              <div className="rh-field">
                <label>Fecha de registro</label>
                <span>{fmtFecha(reporte.fecha_registro)}</span>
              </div>
            </div>
          </div>

          {/* ── INSTRUMENTOS ── */}
          <div className="rh-sec">Instrumentos y equipos</div>
          <table className="rh-tbl">
            <thead>
              <tr>
                <th style={{ width: "6%" }}>#</th>
                <th style={{ width: "40%", textAlign: "left" }}>Instrumento</th>
                <th style={{ width: "20%" }}>Estado</th>
                <th style={{ width: "20%" }}>Costo</th>
              </tr>
            </thead>
            <tbody>
              {reportes.map((item, index) => (
                <tr key={`${item.instrumento_id}-${index}`}>
                  <td>{index + 1}</td>
                  <td className="left">{item.instrumento_nombre || `Instrumento #${item.instrumento_id}`}</td>
                  <td>
                    <span className={
                      item.prioridad === "alta"  ? "est-falla" :
                      item.prioridad === "media" ? "est-revision" :
                                                      "est-ok"
                    }>
                      {item.prioridad === "alta"  ? "Con falla" :
                       item.prioridad === "media" ? "En revisión" :
                                                       "En orden"}
                    </span>
                  </td>
                  <td>{fmt(item.costo)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ── TOTALES ── */}
          <div className="rh-totales">
            <table className="rh-tot-tbl">
              <tbody>
                <tr><td className="t-lbl">Subtotal:</td><td className="t-val">{fmt(costo)}</td></tr>
                <tr><td className="t-lbl">IVA (16%):</td><td className="t-val">{fmt(iva)}</td></tr>
                <tr className="t-total"><td className="t-lbl">TOTAL:</td><td className="t-val">{fmt(total)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* ── DESCRIPCIÓN ── */}
          <div className="rh-sec">Descripción general</div>
          <div className="rh-desc">
            {reportes.map((item, index) => (
              <p key={`descripcion-${index}`}>
                <strong>Reporte {index + 1}:</strong> {item.descripcion || "Sin descripción."}
              </p>
            ))}
          </div>

          {/* ── FOTO ── */}
          <div className="rh-sec">Evidencia fotográfica</div>
          <div className="rh-foto-block">
            {reportes.some((item) => item.foto) ? reportes.map((item, index) => {
              if (!item.foto) return null;
              const fotoSrc = typeof item.foto === "string"
                ? item.foto
                : URL.createObjectURL(item.foto);

              return (
                <div key={`foto-${index}`}>
                  <p style={{ marginTop: 6 }}>Reporte {index + 1}</p>
                  <img src={fotoSrc} alt={`Evidencia del reporte ${index + 1}`} className="rh-foto-img" />
                </div>
              );
            }) : <div className="rh-foto-placeholder">Sin fotografía adjunta</div>}
          </div>

          {/* ── FOOTER ── */}
          <div className="rh-footer">
            <div className="rh-firma" style={{ flex: 2 }}>
              <label>Firma del responsable:</label>
              <div className="rh-firma-line" />
              <div className="rh-firma-sub">___________________________</div>
            </div>
            <div className="rh-firma" style={{ flex: 1 }}>
              <label>Revisado por:</label>
              <div className="rh-firma-line" />
              <div className="rh-firma-sub">___________________________</div>
            </div>
            <div
              className="rh-sello"
              style={{ border: `2.5px solid ${prio.selloColor}`, color: prio.selloColor }}
            >
              <span style={{ fontSize: 16 }}>{prio.icon}</span>
              <span style={{ fontSize: 9, letterSpacing: 1 }}>{prio.label.toUpperCase()}</span>
            </div>
          </div>

        </div>
        <button className="rh-print-btn" onClick={() => window.print()}>🖨 Imprimir / Guardar PDF</button>
        <button
          className="rh-print-btn"
          onClick={() => navigate(-1)}
        >
          ⬅ Regresar
        </button>
      </div>
    </>
  );
}