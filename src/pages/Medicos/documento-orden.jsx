/*import { useLocation } from "react-router-dom";

export default function DocumentoOrden() {
  const { state } = useLocation();
  

  const orden = state?.orden;
  if (!orden) {
    return (
      <div>
        <h1>ORDEN DE COMPRA</h1>
        <p>No se encontró la orden. Vuelva a la lista e intente de nuevo.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>ORDEN DE COMPRA</h1>

      <p>Proveedor: {orden.proveedor_nombre}</p>
      <p>Fecha: {orden.fecha ?? "-"}</p>

      <table>
        <thead>
          <tr>
            <th>Medicamento</th>
            <th>Unidades</th>
            <th>Descripción</th>
          </tr>
        </thead>

<tbody>
  {(orden.medicamentos ?? []).map((m, index) => (
    <tr key={index}>
      <td>{m.nombrePersonalizado || m.nombre}</td>
      <td>{m.unidades}</td>
      <td>{m.descripcion}</td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}
  */

import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
/* ── Estilos ────────────────────────────────────────────────────────────── */
const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  .oc-wrap {
    font-family: Arial, sans-serif;
    font-size: 11px;
    background: #c8c8c8;
    min-height: 100vh;
    padding: 16px;
    color: #111;
  }
  .oc-page {
    background: #fff;
    width: 720px;
    margin: 0 auto;
    border: 2px solid #222;
  }

  /* HEADER */
  .oc-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-bottom: 2px solid #222;
    gap: 12px;
  }
  .oc-logo { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
  .oc-logo-box {
    width: 52px; height: 52px;
    background: #1a3a5c;
    display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 20px; font-weight: 900;
    border-radius: 4px; letter-spacing: -1px;
  }
  .oc-logo-text { font-size: 10px; color: #555; line-height: 1.4; }
  .oc-logo-text strong { display: block; font-size: 12px; color: #1a3a5c; }
  .oc-title-block { flex: 1; text-align: right; }
  .oc-title {
    font-size: 22px; font-weight: 900; color: #1a3a5c;
    letter-spacing: 1px; text-transform: uppercase;
  }
  .oc-meta { margin-top: 6px; }
  .oc-meta-row {
    display: flex; justify-content: flex-end;
    gap: 6px; align-items: center; margin-bottom: 3px;
  }
  .oc-meta-label { font-size: 9px; font-weight: 700; color: #555; text-transform: uppercase; }
  .oc-meta-val { font-size: 11px; font-weight: 700; color: #1a3a5c; }

  /* PARTES */
  .oc-parties { display: flex; border-bottom: 1.5px solid #222; }
  .oc-party { flex: 1; padding: 8px 14px; border-right: 1px solid #aaa; }
  .oc-party:last-child { border-right: none; }
  .oc-party-title {
    font-size: 9px; font-weight: 700; color: #fff;
    background: #1a3a5c; padding: 2px 6px; margin-bottom: 6px;
    text-transform: uppercase; letter-spacing: 0.4px; display: inline-block;
  }
  .oc-field { margin-bottom: 4px; }
  .oc-field label { display: block; font-size: 8px; font-weight: 700; color: #888; text-transform: uppercase; }
  .oc-field span { font-size: 10.5px; color: #111; display: block; border-bottom: 1px solid #eee; padding: 1px 0; }

  /* TABLA */
  table.oc-items { width: 100%; border-collapse: collapse; }
  table.oc-items thead tr { background: #1a3a5c; color: #fff; }
  table.oc-items th {
    padding: 5px 6px; font-size: 9px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.3px; text-align: center;
    border-right: 1px solid #2c5282;
  }
  table.oc-items th:last-child { border-right: none; }
  table.oc-items tbody tr { border-bottom: 1px solid #ddd; }
  table.oc-items tbody tr:nth-child(even) { background: #f4f8ff; }
  table.oc-items td {
    padding: 4px 6px; border-right: 1px solid #ddd;
    vertical-align: middle; text-align: center; font-size: 10.5px;
  }
  table.oc-items td.desc { text-align: left; }
  table.oc-items td:last-child { border-right: none; }
  .importe-cell { font-weight: 700; color: #1a3a5c; }

  /* TOTALES */
  .oc-totales {
    display: flex; justify-content: flex-end;
    border-top: 2px solid #1a3a5c;
    padding: 8px 14px 4px;
  }
  .oc-totales-table { font-size: 11px; }
  .oc-totales-table td { padding: 2px 8px; }
  .t-label { text-align: right; color: #555; font-weight: 600; }
  .t-val { text-align: right; font-weight: 700; color: #111; min-width: 110px; border-bottom: 1px solid #ddd; }
  .t-total .t-label { color: #1a3a5c; font-size: 13px; font-weight: 900; }
  .t-total .t-val { color: #1a3a5c; font-size: 14px; font-weight: 900; border-bottom: 2px solid #1a3a5c; }

  /* TÉRMINOS */
  .oc-terminos {
    border-top: 1px solid #ccc;
    padding: 8px 14px;
    font-size: 9.5px; color: #444; line-height: 1.5;
  }
  .oc-terminos strong {
    font-size: 9px; color: #1a3a5c; text-transform: uppercase;
    display: block; margin-bottom: 2px;
  }

  /* FOOTER */
  .oc-footer {
    display: flex; align-items: flex-end;
    padding: 10px 14px 14px;
    border-top: 1.5px solid #222;
    gap: 20px;
  }
  .oc-firma-block { flex: 1; }
  .oc-firma-block label {
    font-size: 8px; font-weight: 700; color: #888;
    text-transform: uppercase; display: block; margin-bottom: 4px;
  }
  .oc-firma-line {
    border-top: 1.5px solid #555; margin-bottom: 4px; height: 32px;
  }
  .oc-firma-name { font-size: 9.5px; color: #333; border-top: 1px solid #ccc; padding-top: 2px; }
  .oc-sello {
    width: 90px; height: 80px;
    border: 2.5px solid #c0392b;
    border-radius: 6px;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    color: #c0392b; font-size: 8px; font-weight: 900;
    text-transform: uppercase; letter-spacing: 1.5px;
    transform: rotate(-8deg);
    gap: 2px; flex-shrink: 0;
  }
  .sello-big { font-size: 14px; letter-spacing: 2px; }

  /* PRINT BUTTON */
  .oc-print-btn {
    display: block; margin: 14px auto;
    padding: 8px 28px; background: #1a3a5c; color: #fff;
    border: none; font-size: 12px; font-family: inherit;
    font-weight: 700; cursor: pointer; border-radius: 3px;
  }
  .oc-print-btn:hover { background: #2c5282; }

  @media print {
    body { background: white !important; }
    .oc-wrap { background: white; padding: 0; }
    .oc-page { border: none; width: 100%; }
    .oc-print-btn { display: none; }
    table.oc-items thead tr,
    .oc-party-title,
    .oc-sello { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

/* ── Helpers ─────────────────────────────────────────────────────────────── */
function fmt(n) {
  return "$" + Number(n || 0).toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtFecha(f) {
  if (!f) return "-";
  // Acepta ISO o dd/mm/yyyy
  const d = new Date(f);
  if (isNaN(d)) return f;
  return d.toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" });
}

/* ── Componente ──────────────────────────────────────────────────────────── */
export default function DocumentoOrden() {
  const { state } = useLocation();
  const orden = state?.orden;
  const navigate = useNavigate();

  if (!orden) {
    return (
      <div style={{ padding: 40, fontFamily: "Arial" }}>
        <h2>ORDEN DE COMPRA</h2>
        <p style={{ marginTop: 12, color: "#c0392b" }}>
          No se encontró la orden. Vuelva a la lista e intente de nuevo.
        </p>
      </div>
    );
  }

  const medicamentos = orden.medicamentos ?? [];

  // Calcular totales — usa m.precio_unitario si existe, si no 0
  const subtotal = medicamentos.reduce(
    (acc, m) => acc + (Number(m.precio || 0) * Number(m.unidades || 0)),
    0
  );
  const iva = subtotal * 0.16;
  const total = subtotal + iva;

  return (
    <>
      <style>{css}</style>
      <div className="oc-wrap">
        <div className="oc-page">

          {/* ── HEADER ── */}
          <div className="oc-header">
            <div className="oc-logo">
              <div className="oc-logo-box">CS</div>
              <div className="oc-logo-text">
                <strong>CLINISERVIS</strong>
                S.A. de C.V.
              </div>
            </div>
            <div className="oc-title-block">
              <div className="oc-title">Orden de Compra</div>
              <div className="oc-meta">
                <div className="oc-meta-row">
                  <span className="oc-meta-label">No. OC:</span>
                  <span className="oc-meta-val">{orden.numero_oc ?? orden.id ?? "-"}</span>
                </div>
                <div className="oc-meta-row">
                  <span className="oc-meta-label">Fecha:</span>
                  <span className="oc-meta-val">{fmtFecha(orden.fecha)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── PARTES ── */}
          
          <div className="oc-parties">
            <div className="oc-party">
              <div className="oc-party-title">Datos del Proveedor</div>
              <div className="oc-field">
                <label>Nombre / Razón social</label>
                <span>{orden.proveedor_nombre ?? "-"}</span>
              </div>

            </div>

            <div className="oc-party">
              <div className="oc-party-title">Datos de Facturación</div>

              <div className="oc-field">
                {orden.proveedor_rfc && (
                <div className="oc-field">
                  <label>RFC</label>
                  <span>{orden.proveedor_rfc}</span>
                </div>
              )}
              </div>
              <div className="oc-field">
                 {orden.proveedor_direccion && (
                <div className="oc-field">
                  <label>Dirección</label>
                  <span>{orden.proveedor_direccion}</span>
                </div>
              )}
              </div>
              <div className="oc-field">
                {orden.proveedor_telefono && (
                <div className="oc-field">
                  <label>Teléfono</label>
                  <span>{orden.proveedor_telefono}</span>
                </div>
              )}
              </div>

              <div className="oc-field">
                {orden.proveedor_contacto && (
                <div className="oc-field">
                  <label>Contacto</label>
                  <span>{orden.proveedor_contacto}</span>
                </div>
              )}
              </div>
            </div>
          </div>

          {/* ── TABLA DE MEDICAMENTOS ── */}
          <table className="oc-items">
            <thead>
              <tr>
                <th style={{ width: "4%" }}>Ítem</th>
                <th style={{ width: "36%", textAlign: "left" }}>Medicamento</th>
                <th style={{ width: "14%" }}>Descripción</th>
                <th style={{ width: "8%" }}>Unidades</th>
                <th style={{ width: "6%" }}>U.M.</th> 
                <th style={{ width: "14%" }}>P. Unitario</th>
                <th style={{ width: "14%" }}>Importe</th>
              </tr>
            </thead>
            <tbody>
              {medicamentos.length > 0 ? (
                medicamentos.map((m, index) => {
                  const precio = Number(m.precio || 0);
                  const unidades = Number(m.unidades || 0);
                  const importe = precio * unidades;
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td className="desc">{m.nombrePersonalizado || m.nombre || "-"}</td>
                      <td>{m.descripcion || "-"}</td>
                      <td>{unidades}</td>
                      <td>{m.um ?? "Pza"}</td>
                      <td>{fmt(precio)}</td>
                      <td className="importe-cell">{fmt(importe)}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", padding: 12, color: "#888" }}>
                    Sin medicamentos registrados
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ── TOTALES ── */}
          <div className="oc-totales">
            <table className="oc-totales-table">
              <tbody>
                <tr>
                  <td className="t-label">Subtotal:</td>
                  <td className="t-val">{fmt(subtotal)}</td>
                </tr>
                <tr>
                  <td className="t-label">IVA (16%):</td>
                  <td className="t-val">{fmt(iva)}</td>
                </tr>
                <tr className="t-total">
                  <td className="t-label">TOTAL:</td>
                  <td className="t-val">{fmt(total)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── TÉRMINOS ── */}
          <div className="oc-terminos">
            <strong>Términos y Condiciones:</strong>
            {orden.terminos
              ? orden.terminos
              : "El tiempo de entrega acordado queda sujeto a los términos establecidos con el proveedor."}
          </div>

          {/* ── FOOTER ── */}
          <div className="oc-footer">
            <div className="oc-firma-block">
              <label>Autorizado por:</label>
              <div className="oc-firma-line" />
              <div className="oc-firma-name">
                {orden.autorizado_por ?? "Gerente de Compras"}
              </div>
            </div>
            <div className="oc-sello">
              <span>✔</span>
              <span className="sello-big">APROBADO</span>
            </div>
          </div>

        </div>

        {/* BOTÓN IMPRIMIR */}
        <button className="oc-print-btn" onClick={() => window.print()}>
          🖨 Imprimir / Guardar PDF
        </button>

            <button
      className="oc-print-btn"
      onClick={() => navigate(-1)}
    >
      ⬅ Regresar
    </button>
      </div>
    </>
  );
}