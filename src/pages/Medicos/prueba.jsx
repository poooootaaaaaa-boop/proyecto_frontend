import Layout_Medicos from "./Layout_Medicos"
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography} from "@mui/material";
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

  const dataToSend = {
    tipo: tipoMovimiento,
    producto: producto,
    cantidad: cantidad,
    motivo: motivo
  };

  Axios.post(
    "http://127.0.0.1:8000/api/guardarMovimientos",
    dataToSend
  )
    .then((response) => {

      alert("Movimiento guardado correctamente ");

      // limpiar formulario
      setProducto("");
      setCantidad("");
      setMotivo("");
      setTipoMovimiento("");

      setMostrarEntrada(false);
      setMostrarSalida(false);

    })
    .catch((error) => {

      alert("Error al enviar datos: " + error.message);
      console.error(error);

    });
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
                <option value="">Selecciona un producto</option>
                <option value="Paracetamol">Paracetamol</option>
                <option value="Ibuprofeno">Ibuprofeno</option>
            </select>
            

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
            <tr>
              <th>1</th>
              <td>Mark</td>
              <td>Entrada</td>
              <td>10</td>
              <td>Compra</td>
            </tr>

            <tr>
              <th>2</th>
              <td>Otto</td>
              <td>Salida</td>
              <td>3</td>
              <td>Venta</td>
            </tr>
          </tbody>

        </table>
      </div>

    </div>

      </Layout_Medicos>
    </div>
  );
}

export default Prueba;