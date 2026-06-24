import Sidebar from "../../components/farmacia/Sidebar";
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
  const [caducado, setCaducado]= useState(false);
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

useEffect(() => {
  if (caducado) {
    setRecetaId("");
  }
}, [caducado]);
/*
  const handleCaducadoChange = (e) => {
    const checked = e.target.checked;
    setCaducado(checked);
    Axios.post("http://127.0.0.1:8000/api/medicamentoCaducado", {
      medicamento_id: producto || null,
      caducado: checked,
      cantidad: cantidad || null,
      motivo: motivo || null,
    })
      .then((res) => {
        console.log('Caducado enviado:', res.data);
      })
      .catch((err) => {
        console.error('Error al enviar caducado:', err);
      });
  };
*/
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

  if (tipoMovimiento === "salida" && !recetaId && !caducado) {
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

  const selectedMed = medicamentos.find(
    (med) => String(med.id) === String(producto)
  );

  if (tipoMovimiento === "salida" && caducado && selectedMed) {
    
      Axios.post("http://127.0.0.1:8000/api/medicamentoCaducado", {
    medicamento_id: producto,
    cantidad,
    motivo,
  })
  .then(() => {
    const manifiestoSalida = {
      medicamento: {
        id: selectedMed.id,
        nombre: selectedMed.nombre,
      },
      cantidad,
      motivo,
    };

    localStorage.setItem("manifiestoSalida", JSON.stringify(manifiestoSalida));
    window.location.href = "/farmacia/manifesto-residuo";
  })
  .catch(err => console.error(err));

  return;
  }

  Axios.post("http://127.0.0.1:8000/api/guardarMovimientos", dataToSend)
    .then(() => {
      if (tipoMovimiento === "salida" && selectedMed) {
        const manifiestoSalida = {
          medicamento: {
            id: selectedMed.id,
            nombre: selectedMed.nombre,
          },
          cantidad,
          motivo,
        };

        /*
        localStorage.setItem("manifiestoSalida", JSON.stringify(manifiestoSalida));
        window.location.href = "/farmacia/manifesto-residuo";
        return;
      */
      }
        

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
  <div className="movimientos-layout">
    <Sidebar />

    <div className="movimientos-container">

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h2>Movimientos de Stock</h2>
          <p>Administra entradas y salidas de medicamentos</p>
        </div>
      </div>

      {/* CARD FORMULARIO */}
      <div className="movimiento-card">

        <div className="tipo-operacion">
          <button
            className={`action-btn entrada ${
              tipoMovimiento === "entrada" ? "active" : ""
            }`}
            onClick={Entrada}
          >
            ⬇ Entrada
          </button>

          <button
            className={`action-btn salida ${
              tipoMovimiento === "salida" ? "active" : ""
            }`}
            onClick={Salida}
          >
            ⬆ Salida
          </button>
        </div>

        <div className="form-grid">

          <div className="input-group-custom">
            <label>Medicamento</label>

            <select
              className="modern-input"
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
          </div>

          <div className="input-group-custom">
            <label>Cantidad</label>

            <input
              type="number"
              className="modern-input"
              placeholder="Cantidad"
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>

          {tipoMovimiento === "entrada" && (
            <div className="input-group-custom">
              <label>Proveedor</label>

              <select
                className="modern-input"
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
            </div>
          )}

          {tipoMovimiento === "salida" && !caducado && (
            <div className="input-group-custom">
              <label>Receta</label>

              <select
                className="modern-input"
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
            </div>
          )}

          <div className="input-group-custom full-width">
            <label>Motivo</label>

            <input
              type="text"
              className="modern-input"
              placeholder="Describe el motivo del movimiento"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>

          <div className="caducado-box full-width">
            <input
              type="checkbox"
              checked={caducado}
              onChange={(e) => setCaducado(e.target.checked)}
            />

            <span>Medicamento caducado</span>
          </div>

          <div className="full-width">
            {mostrarEntrada && (
              <button
                type="button"
                className="submit-btn entrada-btn"
                onClick={guardarMovimiento}
              >
                Registrar Entrada
              </button>
            )}

            {mostrarSalida && (
              <button
                type="button"
                className="submit-btn salida-btn"
                onClick={guardarMovimiento}
              >
                Registrar Salida
              </button>
            )}
          </div>

        </div>
      </div>

      {/* TABLA */}
      <div className="historial-card">

        <div className="table-header">
          <h3>Historial General</h3>
        </div>

        <div className="table-responsive">
          <table className="modern-table">

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
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((mov) => (
                    <tr key={mov.id}>
                      <td>
                        {new Date(
                          mov.fecha_movimiento
                        ).toLocaleString()}
                      </td>

                      <td>
                        {mov.inventario?.medicamento?.nombre ||
                          "Sin nombre"}
                      </td>

                      <td>
                        <span
                          className={`badge-tipo ${
                            mov.tipo === "entrada"
                              ? "badge-entrada"
                              : "badge-salida"
                          }`}
                        >
                          {mov.tipo}
                        </span>
                      </td>

                      <td>{mov.cantidad}</td>

                      <td>{mov.motivo || "—"}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="5" className="empty-row">
                    No hay movimientos registrados
                  </td>
                </tr>
              )}
            </tbody>

          </table>
        </div>

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
  </div>
);
}

export default Prueba;