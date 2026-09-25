import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
.ca-wrap { font-family: Arial, sans-serif; font-size: 11px; background: #c8c8c8; min-height: 100vh; padding: 16px; color: #111; }
.ca-page { background: #fff; width: 720px; margin: 0 auto; border: 2px solid #222; }

/* HEADER */
.ca-header { display: flex; align-items: center; padding: 12px 16px; border-bottom: 2px solid #222; gap: 12px; }
.ca-logo-box { width: 52px; height: 52px; background: #1a3a5c; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; font-weight: 900; border-radius: 4px; letter-spacing: -1px; }
.ca-logo-txt { font-size: 10px; color: #555; line-height: 1.4; margin-left: 8px; }
.ca-logo-txt strong { display: block; font-size: 12px; color: #1a3a5c; }
.ca-title-block { flex: 1; text-align: right; }
.ca-title { font-size: 20px; font-weight: 900; color: #1a3a5c; text-transform: uppercase; letter-spacing: 1px; }
.ca-meta-row { display: flex; justify-content: flex-end; gap: 6px; align-items: center; margin-top: 3px; }
.ca-meta-lbl { font-size: 8px; font-weight: 700; color: #555; text-transform: uppercase; }
.ca-meta-val { font-size: 11px; font-weight: 700; color: #1a3a5c; }

/* BADGE ESTADO ALIMENTOS */
.badge { display: inline-block; padding: 2px 10px; border-radius: 3px; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.4px; }
.badge-bueno   { background: #d4edda; color: #155724; }
.badge-regular { background: #fff3cd; color: #856404; }
.badge-malo    { background: #f8d7da; color: #721c24; }
.badge-si      { background: #d4edda; color: #155724; }
.badge-no      { background: #f8d7da; color: #721c24; }

/* SECCIÓN */
.ca-sec { background: #1a3a5c; color: #fff; font-size: 9px; font-weight: 700; padding: 3px 14px; text-transform: uppercase; letter-spacing: 0.5px; }

/* DATOS GENERALES */
.ca-datos { display: flex; border-bottom: 1.5px solid #222; }
.ca-col { flex: 1; padding: 7px 12px; border-right: 1px solid #aaa; }
.ca-col:last-child { border-right: none; }
.ca-field { margin-bottom: 5px; }
.ca-field label { display: block; font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; margin-bottom: 1px; }
.ca-field span { display: block; font-size: 10.5px; color: #111; border-bottom: 1px solid #eee; padding: 1px 0; min-height: 14px; }

/* TABLA ALIMENTOS */
table.ca-tbl { width: 100%; border-collapse: collapse; }
table.ca-tbl thead tr { background: #1a3a5c; color: #fff; }
table.ca-tbl th { padding: 5px 6px; font-size: 8.5px; font-weight: 700; text-transform: uppercase; text-align: center; border-right: 1px solid #2c5282; }
table.ca-tbl th:last-child { border-right: none; }
table.ca-tbl tbody tr { border-bottom: 1px solid #ddd; }
table.ca-tbl tbody tr:nth-child(even) { background: #f4f8ff; }
table.ca-tbl td { padding: 4px 6px; border-right: 1px solid #ddd; text-align: center; font-size: 10px; vertical-align: middle; }
table.ca-tbl td.left { text-align: left; }
table.ca-tbl td:last-child { border-right: none; }

/* BLOQUE TEXTO */
.ca-text-block { padding: 7px 14px; border-bottom: 1.5px solid #222; }
.ca-text-block label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; display: block; margin-bottom: 3px; }
.ca-text-block p { font-size: 10.5px; color: #111; line-height: 1.6; }
.ca-text-block p.vacio { color: #aaa; font-style: italic; }

/* DOS COLS INFO */
.ca-info-row { display: flex; border-bottom: 1.5px solid #222; }
.ca-info-cell { flex: 1; padding: 7px 12px; border-right: 1px solid #aaa; }
.ca-info-cell:last-child { border-right: none; }
.ca-info-cell label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; }

/* FOOTER */
.ca-footer { display: flex; align-items: flex-end; padding: 10px 14px 14px; border-top: 1.5px solid #222; gap: 20px; }
.ca-firma { flex: 1; }
.ca-firma label { font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; display: block; margin-bottom: 4px; }
.ca-firma-line { border-top: 1.5px solid #555; height: 32px; margin-bottom: 4px; }
.ca-firma-sub { font-size: 9px; color: #555; border-top: 1px solid #ccc; padding-top: 2px; }
.ca-sello { width: 90px; height: 80px; border-radius: 6px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-weight: 900; text-transform: uppercase; transform: rotate(-8deg); gap: 2px; flex-shrink: 0; }

.ca-print-btn { display: block; margin: 14px auto; padding: 8px 28px; background: #1a3a5c; color: #fff; border: none; font-size: 12px; font-family: Arial; font-weight: 700; cursor: pointer; border-radius: 3px; }
.ca-print-btn:hover { background: #2c5282; }

@media print {
  body { background: white !important; }
  .ca-wrap { background: white; padding: 0; }
  .ca-page { border: none; width: 100%; }
  .ca-print-btn { display: none; }
  .ca-sec, .ca-header, table.ca-tbl thead tr, .ca-sello, .badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

function fmtFechaHora(f) {
  if (!f) return "-";
  const d = new Date(f);
  if (isNaN(d)) return f;
  return d.toLocaleString("es-MX", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// Estilos del sello según estado de alimentos
const ESTADO_SELLO = {
  bueno:   { color: "#155724", icon: "✔", label: "BUENO"   },
  regular: { color: "#856404", icon: "~", label: "REGULAR"  },
  malo:    { color: "#721c24", icon: "✕", label: "MALO"     },
};

export default function DocumentoControlAlimentos() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const control = state?.control;

  if (!control) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h2>CONTROL DE ALIMENTOS</h2>
        <p style={{ marginTop: 12, color: "#c0392b" }}>
          No se encontró el registro. Vuelva al formulario e intente de nuevo.
        </p>
      </div>
    );
  }

  const sello = ESTADO_SELLO[control.estado_alimentos] ?? ESTADO_SELLO.regular;
  const alimentos = control.detalle_alimentos ?? [];
  const totalPorciones = alimentos.reduce((a, i) => a + Number(i.cantidad || 0), 0);

  return (
    <>
      <style>{css}</style>
      <div className="ca-wrap">
        <div className="ca-page">

          {/* ── HEADER ── */}
          <div className="ca-header">
            <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              <div className="ca-logo-box">CS</div>
              <div className="ca-logo-txt">
                <strong>CLINISERVIS<br /></strong>S.A. de C.V.
              </div>
            </div>
            <div className="ca-title-block">
              <div className="ca-title">Control de Alimentos</div>
              <div className="ca-meta-row">
                <span className="ca-meta-lbl">Fecha y hora:</span>
                <span className="ca-meta-val">{fmtFechaHora(control.fecha_hora_recepcion)}</span>
              </div>
              <div className="ca-meta-row">
                <span className="ca-meta-lbl">Estado:</span>
                <span className={`badge badge-${control.estado_alimentos}`}>
                  {control.estado_alimentos ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* ── DATOS DEL PACIENTE ── */}
          <div className="ca-sec">Datos del paciente</div>
          <div className="ca-datos">
            <div className="ca-col">
              <div className="ca-field">
                <label>Paciente</label>
                <span>{control.paciente_nombre ?? `Paciente #${control.paciente_id}`}</span>
              </div>
            </div>
            <div className="ca-col">
              <div className="ca-field">
                <label>Fecha y hora de recepción</label>
                <span>{fmtFechaHora(control.fecha_hora_recepcion)}</span>
              </div>
            </div>
            <div className="ca-col">
              <div className="ca-field">
                <label>Estado de los alimentos</label>
                <span>
                  <span className={`badge badge-${control.estado_alimentos}`}>
                    {control.estado_alimentos ?? "-"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* ── ALIMENTOS RECIBIDOS ── */}
          <div className="ca-sec">Alimentos recibidos</div>
          <table className="ca-tbl">
            <thead>
              <tr>
                <th style={{ width: "6%" }}>#</th>
                <th style={{ width: "70%", textAlign: "left" }}>Alimento</th>
                <th style={{ width: "24%" }}>Cantidad (porciones)</th>
              </tr>
            </thead>
            <tbody>
              {alimentos.length > 0 ? (
                alimentos.map((a, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td className="left">{a.nombre || "-"}</td>
                    <td>{a.cantidad}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} style={{ textAlign: "center", color: "#aaa", fontStyle: "italic", padding: 10 }}>
                    Sin alimentos registrados
                  </td>
                </tr>
              )}
              {alimentos.length > 0 && (
                <tr style={{ background: "#dce8f5" }}>
                  <td colSpan={2} style={{ textAlign: "right", fontWeight: 700, color: "#1a3a5c", fontSize: 10 }}>Total porciones:</td>
                  <td style={{ fontWeight: 900, color: "#1a3a5c" }}>{totalPorciones}</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── ALIMENTOS DESECHADOS ── */}
          <div className="ca-info-row">
            <div className="ca-info-cell">
              <label>Alimentos desechados</label>
              <span style={{ fontSize: 10.5 }}>{control.alimentos_desechados || <span style={{ color: "#aaa", fontStyle: "italic" }}>Ninguno</span>}</span>
            </div>
            <div className="ca-info-cell">
              <label>Motivo del desecho</label>
              <span style={{ fontSize: 10.5 }}>{control.motivo_desecho || <span style={{ color: "#aaa", fontStyle: "italic" }}>N/A</span>}</span>
            </div>
          </div>

          {/* ── CONSUMO Y ENTREGA ── */}
          <div className="ca-sec">Consumo y entrega</div>
          <div className="ca-info-row">
            <div className="ca-info-cell">
              <label>¿El paciente consumió la comida?</label>
              <span className={`badge badge-${control.paciente_consumio === true || control.paciente_consumio === "si" ? "si" : "no"}`}>
                {control.paciente_consumio === true || control.paciente_consumio === "si" ? "Sí consumió" : "No consumió"}
              </span>
            </div>
            <div className="ca-info-cell">
              <label>Entrega de alimentos al paciente</label>
              <span className={`badge badge-${control.entrega_alimentos_paciente === true || control.entrega_alimentos_paciente === "si" ? "si" : "no"}`}>
                {control.entrega_alimentos_paciente === true || control.entrega_alimentos_paciente === "si" ? "Entregado" : "No entregado"}
              </span>
            </div>
          </div>

          {/* ── OBSERVACIONES NUTRICIONALES ── */}
          <div className="ca-sec">Observaciones nutricionales</div>
          <div className="ca-text-block">
            {control.observaciones_nutricionales
              ? <p>{control.observaciones_nutricionales}</p>
              : <p className="vacio">Sin observaciones registradas.</p>
            }
          </div>

          {/* ── FOOTER ── */}
          <div className="ca-footer">
            <div className="ca-firma" style={{ flex: 2 }}>
              <label>Nombre y firma del responsable:</label>
              <div className="ca-firma-line" />
              <div className="ca-firma-sub">___________________________</div>
            </div>
            <div className="ca-firma" style={{ flex: 1 }}>
              <label>Revisado por:</label>
              <div className="ca-firma-line" />
              <div className="ca-firma-sub">___________________________</div>
            </div>
            <div
              className="ca-sello"
              style={{ border: `2.5px solid ${sello.color}`, color: sello.color }}
            >
              <span style={{ fontSize: 16 }}>{sello.icon}</span>
              <span style={{ fontSize: 9, letterSpacing: 1 }}>{sello.label}</span>
            </div>
          </div>

        </div>
        <button className="ca-print-btn" onClick={() => window.print()}>🖨 Imprimir / Guardar PDF</button>
        <button className="ca-print-btn"onClick={() => navigate(-1)} >
          ⬅ Regresar
        </button>
      </div>
    </>
  );
}