import { useState, useEffect } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .mrp-body {
    font-family: 'Source Sans 3', Arial, sans-serif;
    font-size: 10px;
    background: #d0d0d0;
    padding: 16px;
    color: #000;
  }

  .mrp-page {
    background: #fff;
    width: 900px;
    margin: 0 auto;
    border: 2px solid #000;
  }

  .mrp-header {
    background: #1a3a5c;
    color: #fff;
    text-align: center;
    padding: 8px 4px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.3px;
    border-bottom: 2px solid #000;
    text-transform: uppercase;
  }

  .mrp-form-body { padding: 6px 8px; }

  .mrp-row {
    display: flex;
    border-bottom: 1px solid #000;
  }

  .mrp-cell {
    border-right: 1px solid #000;
    padding: 3px 5px;
    flex: 1;
  }

  .mrp-cell:last-child { border-right: none; }

  .mrp-label {
    font-size: 8px;
    font-weight: 700;
    color: #1a3a5c;
    margin-bottom: 1px;
    text-transform: uppercase;
    display: block;
  }

  .mrp-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #888;
    background: transparent;
    font-family: inherit;
    font-size: 10px;
    outline: none;
    padding: 1px 2px;
    color: #000;
  }

  .mrp-textarea {
    width: 100%;
    border: 1px solid #aaa;
    background: transparent;
    font-family: inherit;
    font-size: 10px;
    outline: none;
    padding: 3px;
    resize: none;
    height: 44px;
  }

  .mrp-section-title {
    background: #1a3a5c;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    padding: 3px 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .mrp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9px;
  }

  .mrp-table th {
    background: #dce8f5;
    border: 1px solid #000;
    padding: 3px 4px;
    text-align: center;
    font-weight: 700;
    font-size: 8px;
    text-transform: uppercase;
    color: #1a3a5c;
  }

  .mrp-table td {
    border: 1px solid #555;
    padding: 2px 3px;
    vertical-align: middle;
    text-align: center;
  }

  .mrp-table td input[type="text"] {
    width: 100%;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: 9px;
    outline: none;
    text-align: center;
  }

  .mrp-table td input[type="checkbox"] {
    width: 11px;
    height: 11px;
    cursor: pointer;
    accent-color: #1a3a5c;
  }

  .mrp-firma-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 8px;
    border-bottom: 1px solid #000;
  }

  .mrp-firma-block p {
    font-size: 8.5px;
    font-style: italic;
    color: #333;
    line-height: 1.4;
  }

  .mrp-firma-row {
    display: flex;
    gap: 12px;
    margin-top: 4px;
    align-items: flex-end;
  }

  .mrp-firma-field { flex: 1; }

  .mrp-sello-box {
    width: 80px;
    height: 40px;
    border: 1px dashed #888;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 7.5px;
    color: #888;
    text-align: center;
    flex-shrink: 0;
  }

  .mrp-add-btn {
    background: #1a3a5c;
    color: #fff;
    border: none;
    padding: 3px 10px;
    font-size: 9px;
    cursor: pointer;
    margin: 4px 8px;
    border-radius: 2px;
  }

  .mrp-add-btn:hover { background: #2c5282; }

  .mrp-print-btn {
    display: block;
    margin: 14px auto;
    padding: 8px 28px;
    background: #1a3a5c;
    color: #fff;
    border: none;
    font-size: 12px;
    font-family: inherit;
    font-weight: 700;
    cursor: pointer;
    border-radius: 3px;
    letter-spacing: 0.5px;
  }

  .mrp-print-btn:hover { background: #2c5282; }

  @media print {
    .mrp-body { background: white; padding: 0; }
    .mrp-page { border: none; width: 100%; }
    .mrp-print-btn, .mrp-add-btn { display: none; }
    .mrp-section-title,
    .mrp-header,
    .mrp-table th { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
`;

const CRETIB = ["C", "R", "E", "T", "I", "B", "M"];

function newResiduo() {
  return {
    id: Date.now() + Math.random(),
    nombre: "",
    cretib: Object.fromEntries(CRETIB.map((k) => [k, false])),
    tipo: "",
    capacidad: "",
    cantidad: "",
    etiquetaSi: false,
    etiquetaNo: false,
    clasificacion: "",
  };
}

function AddressFields({ prefix, data, onChange }) {
  const f = (field) => (e) => onChange(field, e.target.value);
  return (
    <>
      <div className="mrp-row">
        <div className="mrp-cell" style={{ flex: 1 }}>
          <label className="mrp-label">Código postal:</label>
          <input className="mrp-input" style={{ maxWidth: 80 }} value={data.cp} onChange={f("cp")} />
        </div>
        <div className="mrp-cell" style={{ flex: 3 }}>
          <label className="mrp-label">Calle:</label>
          <input className="mrp-input" value={data.calle} onChange={f("calle")} />
        </div>
        <div className="mrp-cell" style={{ flex: 1 }}>
          <label className="mrp-label">Núm. Ext.:</label>
          <input className="mrp-input" value={data.numExt} onChange={f("numExt")} />
        </div>
        <div className="mrp-cell" style={{ flex: 1 }}>
          <label className="mrp-label">Núm. Int.:</label>
          <input className="mrp-input" value={data.numInt} onChange={f("numInt")} />
        </div>
      </div>
      <div className="mrp-row">
        <div className="mrp-cell" style={{ flex: 2 }}>
          <label className="mrp-label">Colonia:</label>
          <input className="mrp-input" value={data.colonia} onChange={f("colonia")} />
        </div>
        <div className="mrp-cell" style={{ flex: 2 }}>
          <label className="mrp-label">Municipio o Delegación:</label>
          <input className="mrp-input" value={data.municipio} onChange={f("municipio")} />
        </div>
        <div className="mrp-cell" style={{ flex: 1 }}>
          <label className="mrp-label">Estado:</label>
          <input className="mrp-input" value={data.estado} onChange={f("estado")} />
        </div>
      </div>
      <div className="mrp-row">
        <div className="mrp-cell" style={{ flex: 1 }}>
          <label className="mrp-label">Teléfono:</label>
          <input className="mrp-input" value={data.tel} onChange={f("tel")} />
        </div>
        <div className="mrp-cell" style={{ flex: 2 }}>
          <label className="mrp-label">Correo electrónico:</label>
          <input className="mrp-input" type="email" value={data.email} onChange={f("email")} />
        </div>
      </div>
    </>
  );
}

function emptyAddress() {
  return { cp: "", calle: "", numExt: "", numInt: "", colonia: "", municipio: "", estado: "", tel: "", email: "" };
}

function FirmaBlock({ numero, texto, label, value, onChange, fecha, onFecha, selloLabel }) {
  return (
    <div className="mrp-firma-block">
      <p>
        <strong>{numero}-</strong> {texto}
      </p>
      <div className="mrp-firma-row">
        <div className="mrp-firma-field" style={{ flex: 3 }}>
          <label className="mrp-label">{label}</label>
          <input className="mrp-input" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
        <div className="mrp-firma-field" style={{ flex: 1 }}>
          <label className="mrp-label">Fecha:</label>
          <input className="mrp-input" type="date" value={fecha} onChange={(e) => onFecha(e.target.value)} />
        </div>
        <div>
          <label className="mrp-label" style={{ display: "block" }}>Sello:</label>
          <div className="mrp-sello-box">{selloLabel}</div>
        </div>
      </div>
    </div>
  );
}

export default function ManifiestoResiduos() {
  // Generador
  const [regAmbiental, setRegAmbiental] = useState("");
  const [numManifiesto, setNumManifiesto] = useState("");
  const [pagina, setPagina] = useState("1/1");
  const [nombreGenerador, setNombreGenerador] = useState("");
  const [dirGen, setDirGen] = useState(emptyAddress());

  // Residuos
  const [residuos, setResiduos] = useState([newResiduo(), newResiduo(), newResiduo()]);

  useEffect(() => {
    const saved = localStorage.getItem("manifiestoSalida");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      if (data?.medicamento?.nombre) {
        setResiduos([
          {
            ...newResiduo(),
            nombre: data.medicamento.nombre,
            cantidad: data.cantidad || "",
            tipo: "",
          },
        ]);
      }
    } catch (error) {
      console.error("Error leyendo manifiestoSalida:", error);
    }

    localStorage.removeItem("manifiestoSalida");
  }, []);

  // Instrucciones especiales
  const [instrucciones, setInstrucciones] = useState("");

  // Firma generador
  const [firmaGen, setFirmaGen] = useState("");
  const [fechaGen, setFechaGen] = useState("");

  // Transportista
  const [nombreTrans, setNombreTrans] = useState("");
  const [dirTrans, setDirTrans] = useState(emptyAddress());
  const [autSemarnatTrans, setAutSemarnatTrans] = useState("");
  const [permSCT, setPermSCT] = useState("");
  const [tipoVehiculo, setTipoVehiculo] = useState("");
  const [placa, setPlaca] = useState("");
  const [ruta, setRuta] = useState("");
  const [firmaTrans, setFirmaTrans] = useState("");
  const [fechaTrans, setFechaTrans] = useState("");

  // Destinatario
  const [nombreDest, setNombreDest] = useState("");
  const [dirDest, setDirDest] = useState(emptyAddress());
  const [autSemarnatDest, setAutSemarnatDest] = useState("");
  const [personaRecibe, setPersonaRecibe] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [firmaDest, setFirmaDest] = useState("");
  const [fechaDest, setFechaDest] = useState("");

  function updateResiduo(id, field, value) {
    setResiduos((prev) =>
      prev.map((r) =>
        r.id === id
          ? field.startsWith("cretib.")
            ? { ...r, cretib: { ...r.cretib, [field.slice(7)]: value } }
            : { ...r, [field]: value }
          : r
      )
    );
  }

  function addResiduo() {
    setResiduos((prev) => [...prev, newResiduo()]);
  }

  function updateDirGen(field, val) { setDirGen((d) => ({ ...d, [field]: val })); }
  function updateDirTrans(field, val) { setDirTrans((d) => ({ ...d, [field]: val })); }
  function updateDirDest(field, val) { setDirDest((d) => ({ ...d, [field]: val })); }

  return (
    <>
      <style>{styles}</style>
      <div className="mrp-body">
        <div className="mrp-page">
          {/* ENCABEZADO */}
          <div className="mrp-header">
            Manifiesto de Entrega, Transporte y Recepción de Residuos Peligrosos (Generador)
          </div>

          <div className="mrp-form-body">
            {/* Fila 1 */}
            <div className="mrp-row">
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">1- Núm. de registro ambiental:</label>
                <input className="mrp-input" value={regAmbiental} onChange={(e) => setRegAmbiental(e.target.value)} />
              </div>
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">2- Núm. de manifiesto:</label>
                <input className="mrp-input" value={numManifiesto} onChange={(e) => setNumManifiesto(e.target.value)} />
              </div>
              <div className="mrp-cell" style={{ flex: 1 }}>
                <label className="mrp-label">3- Página:</label>
                <input className="mrp-input" value={pagina} onChange={(e) => setPagina(e.target.value)} placeholder="1/1" />
              </div>
            </div>

            {/* Nombre generador */}
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">4- Nombre o razón social del generador:</label>
                <input className="mrp-input" value={nombreGenerador} onChange={(e) => setNombreGenerador(e.target.value)} />
              </div>
            </div>
            <AddressFields data={dirGen} onChange={updateDirGen} />

            {/* Sección 5 */}
            <div className="mrp-section-title">5- Identificación de los residuos</div>
            <table className="mrp-table">
              <thead>
                <tr>
                  <th rowSpan={2} style={{ width: "22%" }}>Nombre del Residuo</th>
                  <th colSpan={7}>Clasificación</th>
                  <th rowSpan={2} style={{ width: "8%" }}>Tipo<br />Envase</th>
                  <th rowSpan={2} style={{ width: "10%" }}>Capacidad<br />(kg o ton)</th>
                  <th rowSpan={2} style={{ width: "8%" }}>Cantidad</th>
                  <th colSpan={2} style={{ width: "10%" }}>Etiqueta</th>
                  <th rowSpan={2} style={{ width: "8%" }}>Clasificación</th>
                </tr>
                <tr>
                  {CRETIB.map((c) => <th key={c}>{c}</th>)}
                  <th>Si</th>
                  <th>No</th>
                </tr>
              </thead>
              <tbody>
                {residuos.map((r) => (
                  <tr key={r.id}>
                    <td>
                      <input type="text" value={r.nombre}
                        onChange={(e) => updateResiduo(r.id, "nombre", e.target.value)}
                        placeholder="Nombre del residuo" />
                    </td>
                    {CRETIB.map((c) => (
                      <td key={c}>
                        <input type="checkbox" checked={r.cretib[c]}
                          onChange={(e) => updateResiduo(r.id, `cretib.${c}`, e.target.checked)} />
                      </td>
                    ))}
                    <td><input type="text" value={r.tipo} onChange={(e) => updateResiduo(r.id, "tipo", e.target.value)} placeholder="Tipo" /></td>
                    <td><input type="text" value={r.capacidad} onChange={(e) => updateResiduo(r.id, "capacidad", e.target.value)} placeholder="kg/ton" /></td>
                    <td><input type="text" value={r.cantidad} onChange={(e) => updateResiduo(r.id, "cantidad", e.target.value)} /></td>
                    <td><input type="checkbox" checked={r.etiquetaSi} onChange={(e) => updateResiduo(r.id, "etiquetaSi", e.target.checked)} /></td>
                    <td><input type="checkbox" checked={r.etiquetaNo} onChange={(e) => updateResiduo(r.id, "etiquetaNo", e.target.checked)} /></td>
                    <td><input type="text" value={r.clasificacion} onChange={(e) => updateResiduo(r.id, "clasificacion", e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="mrp-add-btn" onClick={addResiduo}>+ Agregar residuo</button>

            {/* Sección 6 */}
            <div className="mrp-section-title">6- Instrucciones especiales e información adicional para el manejo seguro:</div>
            <div style={{ padding: "6px 8px", borderBottom: "1px solid #000" }}>
              <textarea className="mrp-textarea" value={instrucciones} onChange={(e) => setInstrucciones(e.target.value)} />
            </div>

            {/* Firma 7 */}
            <FirmaBlock
              numero="7"
              texto="Declaro bajo protesta de decir verdad que el contenido de este lote está total y correctamente descrito mediante el número de manifiesto, nombre del residuo, características CRETIB, debidamente envasado y etiquetado y que se han previsto las condiciones de seguridad para su transporte por vía terrestre de acuerdo con la legislación vigente."
              label="Nombre y firma del responsable:"
              value={firmaGen} onChange={setFirmaGen}
              fecha={fechaGen} onFecha={setFechaGen}
              selloLabel="Sello empresa"
            />

            {/* TRANSPORTISTA */}
            <div className="mrp-section-title">Datos del Transportista</div>
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">8- Nombre o razón social del transportista:</label>
                <input className="mrp-input" value={nombreTrans} onChange={(e) => setNombreTrans(e.target.value)} />
              </div>
            </div>
            <AddressFields data={dirTrans} onChange={updateDirTrans} />
            <div className="mrp-row">
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">9- Núm. de autorización SEMARNAT:</label>
                <input className="mrp-input" value={autSemarnatTrans} onChange={(e) => setAutSemarnatTrans(e.target.value)} />
              </div>
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">10- Núm. de permiso S.C.T.:</label>
                <input className="mrp-input" value={permSCT} onChange={(e) => setPermSCT(e.target.value)} />
              </div>
            </div>
            <div className="mrp-row">
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">11- Tipo de vehículo:</label>
                <input className="mrp-input" value={tipoVehiculo} onChange={(e) => setTipoVehiculo(e.target.value)} placeholder="tanque, caja seca, etc." />
              </div>
              <div className="mrp-cell" style={{ flex: 2 }}>
                <label className="mrp-label">12- Núm. de placa:</label>
                <input className="mrp-input" value={placa} onChange={(e) => setPlaca(e.target.value)} />
              </div>
            </div>
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">13- Ruta de la empresa generadora hasta su entrega:</label>
                <input className="mrp-input" value={ruta} onChange={(e) => setRuta(e.target.value)} />
              </div>
            </div>

            {/* Firma 14 */}
            <FirmaBlock
              numero="14"
              texto="Declaro bajo protesta de decir verdad que recibí los residuos peligrosos descritos en el manifiesto para su transporte a la empresa destinataria señalada por el generador."
              label="Nombre y firma del responsable:"
              value={firmaTrans} onChange={setFirmaTrans}
              fecha={fechaTrans} onFecha={setFechaTrans}
              selloLabel="Sello transportista"
            />

            {/* DESTINATARIO */}
            <div className="mrp-section-title">Datos de la Empresa Destinataria</div>
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">15- Nombre o razón social del destinatario:</label>
                <input className="mrp-input" value={nombreDest} onChange={(e) => setNombreDest(e.target.value)} />
              </div>
            </div>
            <AddressFields data={dirDest} onChange={updateDirDest} />
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">16- Núm. autorización SEMARNAT:</label>
                <input className="mrp-input" value={autSemarnatDest} onChange={(e) => setAutSemarnatDest(e.target.value)} />
              </div>
            </div>
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">17- Nombre y cargo de la persona que recibe los residuos:</label>
                <input className="mrp-input" value={personaRecibe} onChange={(e) => setPersonaRecibe(e.target.value)} />
              </div>
            </div>
            <div className="mrp-row">
              <div className="mrp-cell">
                <label className="mrp-label">18- Observaciones:</label>
                <textarea className="mrp-textarea" style={{ height: 36 }} value={observaciones} onChange={(e) => setObservaciones(e.target.value)} />
              </div>
            </div>

            {/* Firma 19 */}
            <FirmaBlock
              numero="19"
              texto="Declaro bajo protesta de decir verdad que recibí los residuos peligrosos descritos en el manifiesto."
              label="Nombre y firma del responsable:"
              value={firmaDest} onChange={setFirmaDest}
              fecha={fechaDest} onFecha={setFechaDest}
              selloLabel="Sello destinatario"
            />
          </div>
        </div>

        <button className="mrp-print-btn" onClick={() => window.print()}>
          🖨 Imprimir / Guardar PDF
        </button>
      </div>
    </>
  );
}