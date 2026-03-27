import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import { useState, useEffect } from "react";
import Axios from "axios";
import "./prueba.css";
function Prueba() {
      // ===== ESTADOS (reemplazan document.getElementById) =====
  const [tipoMovimiento, setTipoMovimiento] = useState("");
  const [mostrarEntrada, setMostrarEntrada] = useState(false);
  const [mostrarSalida, setMostrarSalida] = useState(false);
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");
  const [medicamentos, setMedicamentos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
const [recetas, setRecetas] = useState([]);
const [proveedorId, setProveedorId] = useState("");
const [recetaId, setRecetaId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event, newPage) => {
  setPage(newPage);
};
const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

  /*
  useEffect(() => {
  Axios.get("http://127.0.0.1:8000/api/medicamentos")
    .then((response) => {
      setMedicamentos(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
}, []);
  */


    /*
    <select
  className="form-control"
  value={producto}
  onChange={(e) => setProducto(e.target.value)}
>
  <option value="">Selecciona un medicamento</option>

  {medicamentos.map((med) => (
    <option key={med.id} value={med.id}>
      {med.nombre}
    </option>
  ))}

</select>
    */
  // ===== FUNCIONES =====

  const [historial, setHistorial] = useState([]);

useEffect(() => {
  Axios.get("http://127.0.0.1:8000/api/medicamentosselct")
    .then(res => setMedicamentos(res.data));

  Axios.get("http://127.0.0.1:8000/api/proveedores")
    .then(res => setProveedores(res.data));

  Axios.get("http://127.0.0.1:8000/api/recetas")
    .then(res => setRecetas(res.data));

  Axios.get("http://127.0.0.1:8000/api/movimientos")
    .then(res => setHistorial(res.data));

}, []);

  const Entrada = () => {
    setTipoMovimiento("entrada");
    setMostrarEntrada(!mostrarEntrada);
    setMostrarSalida(false);
  };

  const Salida = () => {
    setTipoMovimiento("salida");
    setMostrarSalida(!mostrarSalida);
    setMostrarEntrada(false);
  };


const guardarMovimiento = () => {

  if (!tipoMovimiento) {
    alert("Selecciona Entrada o Salida");
    return;
  }

  if (tipoMovimiento === "entrada" && !proveedorId) {
    alert("Selecciona proveedor");
    return;
  }

  if (tipoMovimiento === "salida" && !recetaId) {
    alert("Selecciona receta");
    return;
  }

  const dataToSend = {
    tipo: tipoMovimiento,
    medicamento_id: producto,
    cantidad,
    motivo,
    proveedor_id: tipoMovimiento === "entrada" ? proveedorId : null,
    receta_id: tipoMovimiento === "salida" ? recetaId : null
  };

  Axios.post("http://127.0.0.1:8000/api/guardarMovimientos", dataToSend)
    .then(() => {

      alert("Guardado correctamente");

      //  refrescar tabla automáticamente
      Axios.get("http://127.0.0.1:8000/api/movimientos")
        .then(res => setHistorial(res.data));

      // limpiar
      setProducto("");
      setCantidad("");
      setMotivo("");
      setProveedorId("");
      setRecetaId("");
      setTipoMovimiento("");
      setMostrarEntrada(false);
      setMostrarSalida(false);

    })
    .catch(err => console.error(err));
};




  return (
    <div>
      <Layout_Medicos>
         <div >
      <br /><br />

      <h4 style={{ marginLeft: "40px" }}>
        <strong>Movimientos de Stock</strong>
      </h4>

      <h6 style={{ color: "#888", marginLeft: "40px" }}>
        <strong>Registra entradas y salidas de Medicamentos</strong>
      </h6>

      <br />

      {/* CARD */}
      <div className="card-movimiento">

        {/* BOTONES */}
        <div className="tipo-operacion">
          <button
            className="btn-entrada"
            onClick={Entrada}
          >
            <i className="bi bi-arrow-down-circle-fill"></i>
            Entrada
          </button>

          <button
            className="btn-salida"
            onClick={Salida}
          >
            <i className="bi bi-arrow-up-circle-fill"></i>
            Salida
          </button>
        </div>

        {/* FORM */}
        <form className="form-movimiento">

          <input type="hidden" value={tipoMovimiento} />

          <div className="mb-3">

            <label className="form-label">Producto</label>
            <br />
       <select
  className="form-control"
  value={producto}
  onChange={(e) => setProducto(e.target.value)}
>
  <option value="">Selecciona medicamento</option>
  {medicamentos.map((med) => (
    <option key={med.id} value={med.id}>
      {med.nombre}
    </option>
  ))}
</select>
            
{tipoMovimiento === "entrada" && (
  <>
    <label>Proveedor</label>
    <select
      className="form-control"
      value={proveedorId}
      onChange={(e) => setProveedorId(e.target.value)}
    >
      <option value="">Selecciona proveedor</option>
      {proveedores.map((prov) => (
        <option key={prov.id} value={prov.id}>
          {prov.nombre}
        </option>
      ))}
    </select>
  </>
)}

{tipoMovimiento === "salida" && (
  <>
    <label>Receta</label>
    <select
      className="form-control"
      value={recetaId}
      onChange={(e) => setRecetaId(e.target.value)}
    >
      <option value="">Selecciona receta</option>
      {recetas.map((rec) => (
        <option key={rec.id} value={rec.id}>
          Paciente: {rec.paciente_nombre}
        </option>
      ))}
    </select>
  </>
)}
            <br />

            <label className="form-label">Cantidad</label>
            <br />
            <input
            type="number"
            placeholder="Cantidad del producto"
            className="form-control"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            />

            <br />

            <label className="form-label">Motivo</label>
            <br />

            <input
            type="text"
            placeholder="Motivo del movimiento"
            className="form-control"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            />

            <br />

            {/* BOTONES CONDICIONALES */}

            {mostrarEntrada && (
              <button
                type="button"
                className="btn btn-success"
                style={{ width: "100%" }}
                onClick={guardarMovimiento}
              >
                Enviar entrada
              </button>
            )}

            {mostrarSalida && (
              <button
                type="button"
                className="btn btn-danger"
                style={{ width: "100%" }}
                onClick={guardarMovimiento}
              >
                Enviar salida
              </button>
            )}

          </div>
        </form>
      </div>

      {/* TABLA */}
      <h4 style={{ marginLeft: "40px" }}>
        <strong>Historial general</strong>
      </h4>

      <div id="tabla_1">
        <br /><br />

        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Producto</th>
              <th>Tipo</th>
              <th>Cantidad</th>
              <th>Motivo</th>
            </tr>
          </thead>

<tbody>
  {historial.length > 0 ? (
    historial
  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
  .map((mov) => (
      <tr key={mov.id}>
        <td>
  {new Date(mov.fecha_movimiento).toLocaleString()}
</td>

        <td>
          {mov.inventario?.medicamento?.nombre || "Sin nombre"}
        </td>

        <td>
          <span style={{
            color: mov.tipo === "entrada" ? "green" : "red",
            fontWeight: "bold"
          }}>
            {mov.tipo}
          </span>
        </td>

        <td>{mov.cantidad}</td>

        <td>{mov.motivo || "—"}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="5" style={{ textAlign: "center" }}>
        No hay movimientos registrados
      </td>
    </tr>
  )}
</tbody>

        </table>
        <TablePagination
  component="div"
  count={historial.length}
  page={page}
  onPageChange={handleChangePage}
  rowsPerPage={rowsPerPage}
  onRowsPerPageChange={handleChangeRowsPerPage}
/>
      </div>

    </div>

      </Layout_Medicos>
    </div>
  );
}

export default Prueba;