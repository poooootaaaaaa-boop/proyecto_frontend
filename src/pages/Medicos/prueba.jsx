import Sidebar from "../../components/farmacia/Sidebar";
import { Link } from "react-router-dom";
import Form from 'react-bootstrap/Form';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Typography} from "@mui/material";
import TablePagination from '@mui/material/TablePagination';
import { useState, useEffect, useRef } from "react";
import Axios from "axios";
import "./prueba.css";
import { useNavigate } from "react-router-dom";
import SlimSelect from 'slim-select';
import 'slim-select/styles';
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


  
   const [mostrarModal, setMostrarModal] = useState(false);
  const navigate = useNavigate();
  
  const [orden, setOrden] = useState({
  proveedor_id: "",
  proveedor_nombre: "",
  fecha: "",
  medicamentos: [
    {
      medicamento_id: "",
      nombre: "",
      nombrePersonalizado: "",
      unidades: "",
      descripcion: "",
      precio: ""
    }
    ]
  });



    useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
  try {
    const response = await Axios.get(
      "http://localhost:8000/api/proveedores"
    );

    setProveedores(response.data);
  } catch (error) {
    console.error(error);
  }
};

  const agregarMedicamento = () => {
    setOrden({
      ...orden,
      medicamentos: [
        ...orden.medicamentos,
        {
          medicamento_id: "",
          nombrePersonalizado: "",
          unidades: "",
          descripcion: "",
          precio: ""
        },
      ],
    });
  };

  const eliminarMedicamento = (index) => {
    if (orden.medicamentos.length === 1) return;

    const nuevos = [...orden.medicamentos];
    nuevos.splice(index, 1);

    setOrden({
      ...orden,
      medicamentos: nuevos,
    });
  };

  const cambiarMedicamento = (index, campo, valor) => {
    const nuevos = [...orden.medicamentos];

    nuevos[index][campo] = valor;

    setOrden({
      ...orden,
      medicamentos: nuevos,
    });
  };

  const guardarOrden = async () => {
    try {
      console.log(orden);

      await Axios.post(
        "http://localhost:8000/api/ordenes-compra",
        orden
      );

      //nuevo
            navigate("/medicos/documento-orden", {
      state: {
        orden
      }
    });
      //

      alert("Orden creada correctamente");

      setMostrarModal(false);

      setOrden({
        proveedor_id: "",
        proveedor_nombre: "",
        fecha: "",
        medicamentos: [
          {
            medicamento_id: "",
             nombre: "",
            nombrePersonalizado: "",
            unidades: "",
            descripcion: "",
            precio: ""
          },
        ],
      });
    } catch (error) {
      console.error(error);
      alert("Error al guardar");
    }
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

const selectMedicamentoRef = useRef(null);

useEffect(() => {
  let ss;
  if (selectMedicamentoRef.current && medicamentos.length > 0) {
    ss = new SlimSelect({
      select: selectMedicamentoRef.current,
      settings: {
        placeholderText: 'Selecciona medicamento',
        searchText: 'No se encontraron medicamentos',
        searchPlaceholder: 'Escribe para buscar...',
        customClass: 'modern-input',
      },
      // 👇 ¡ESTO ES LO NUEVO! Captura el cambio y actualiza tu estado "producto"
      events: {
        afterChange: (newVal) => {
          // newVal es un arreglo con las opciones seleccionadas. 
          // Tomamos el "value" (el ID) de la primera opción. If vacío, ponemos ""
          const idSeleccionado = newVal[0] ? newVal[0].value : "";
          setProducto(idSeleccionado);
        }
      }
    });
  }

  return () => {
    if (ss) ss.destroy();
  };
}, [medicamentos]);
  // ==========================================



const MedicamentoRef = useRef([]);
useEffect(() => {
  const slimInstances = [];

  MedicamentoRef.current.forEach((select, index) => {
    if (!select) return;

    const ss = new SlimSelect({
      select,
      settings: {
        placeholderText: "Selecciona medicamento",
        searchText: "No se encontraron medicamentos",
        searchPlaceholder: "Escribe para buscar...",
        customClass: "modern-input",
      },
      events: {
        afterChange: (newVal) => {
          const id = newVal[0] ? newVal[0].value : "";

          cambiarMedicamento(index, "medicamento_id", id);

          if (id !== "otro") {
            const medicamentoSeleccionado = medicamentos.find(
              (item) => item.id == id
            );

            cambiarMedicamento(
              index,
              "nombre",
              medicamentoSeleccionado?.nombre || ""
            );

            cambiarMedicamento(
              index,
              "nombrePersonalizado",
              ""
            );
          }
        },
      },
    });

    slimInstances.push(ss);
  });

  return () => {
    slimInstances.forEach((ss) => ss.destroy());
  };
}, [medicamentos, orden.medicamentos.length]);






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
              ref={selectMedicamentoRef}
              value={producto}
              //onChange={(e) => setProducto(e.target.value)}
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

    

    




    <div style={{ padding: "20px" }}>
      <button
        onClick={() => setMostrarModal(true)}
        style={{
          padding: "10px 20px",
          cursor: "pointer",
          backgroundColor: "blue",
          color:"white"
        }}
        className="action-btn"
      >
        Generar Orden
      </button>

      {mostrarModal && (
        <div
          style={{
  position: "fixed",
  inset: 0,
  background: "rgba(15,23,42,.45)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
          }}
        >
          <div
            style={{
              width: "900px",
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#fff",
              padding: "25px",
              borderRadius: "10px",
            }}
          >
            <h2>Nueva Orden de Compra</h2>

      <div style={{ marginBottom: "15px" }}>
        <label>Proveedor</label>

        <select
        className="modern-input"
          value={orden.proveedor_id}
          onChange={(e) => {
  const id = e.target.value;

  const proveedorSeleccionado = proveedores.find(
    (p) => p.id == id
  );
    console.log(proveedorSeleccionado);

  setOrden({
    ...orden,
    proveedor_id: id,
    proveedor_nombre: proveedorSeleccionado?.nombre || "",
    proveedor_rfc: proveedorSeleccionado?.rfc || "",
    proveedor_direccion: proveedorSeleccionado?.direccion || "",
    proveedor_telefono: proveedorSeleccionado?.telefono || "",
    proveedor_contacto: proveedorSeleccionado?.contacto || ""
  });
}}
          /*onChange={(e) =>
            setOrden({
              ...orden,
              proveedor_id: e.target.value
            })
          }*/
          style={{
            width: "100%",
            padding: "10px"
          }}
        >
          <option value="">
            Seleccione un proveedor
          </option>

          {proveedores.map((proveedor) => (
            <option
              key={proveedor.id}
              value={proveedor.id}
            >
              {proveedor.nombre}
            </option>
          ))}
        </select>
      </div>



            <div style={{ marginBottom: "20px" }}>
              <label>Fecha</label>

              <input
              className="modern-input"
                type="date"
                value={orden.fecha}
                onChange={(e) =>
                  setOrden({
                    ...orden,
                    fecha: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "10px",
                }}
              />
            </div>

            <hr />
             
            <h3>Medicamentos solicitados</h3>

            {orden.medicamentos.map((med, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ddd",
                  padding: "15px",
                  marginBottom: "15px",
                  borderRadius: "8px",
                }}
              >
                <h4>Medicamento #{index + 1}</h4>

                <div style={{ marginBottom: "10px" }}>
                  <label>Medicamento</label>

                  <select
                    ref={(el) => (MedicamentoRef.current[index] = el)}
                    className="modern-input"
                    value={med.medicamento_id}
                    style={{
                      width: "100%",
                      padding: "10px",
                    }}
                  >
                    <option value="">
                      Seleccione un medicamento
                    </option>

                    {medicamentos.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.nombre}
                      </option>
                    ))}

                    <option value="otro">
                      Otro medicamento
                    </option>
                  </select>
                </div>

                {med.medicamento_id === "otro" && (
                  <div style={{ marginBottom: "10px" }}>
                    <label>
                      Nombre del medicamento
                    </label>

                    <input
                    className="modern-input"
                      type="text"
                      placeholder="Escriba el medicamento"
                      value={med.nombrePersonalizado}
                      onChange={(e) =>
                        cambiarMedicamento(
                          index,
                          "nombrePersonalizado",
                          e.target.value
                        )
                      }
                      style={{
                        width: "100%",
                        padding: "10px",
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: "10px" }}>
                  <label>Unidades</label>

                  <input
                  className="modern-input"
                    type="number"
                    min="1"
                    value={med.unidades}
                    onChange={(e) =>
                      cambiarMedicamento(
                        index,
                        "unidades",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>Descripción</label>

                  <textarea
                  className="modern-input"
                    rows="3"
                    value={med.descripcion}
                    onChange={(e) =>
                      cambiarMedicamento(
                        index,
                        "descripcion",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "10px" }}>
                  <label>Precio</label>

                  <input
                    className="modern-input"
                    type="number"
                    min="0"
                    step="0.01"
                    value={med.precio}
                    onChange={(e) =>
                      cambiarMedicamento(
                        index,
                        "precio",
                        e.target.value
                      )
                    }
                    style={{
                      width: "100%",
                      padding: "10px",
                    }}
                  />
                </div>

                <button
                 className="action-btn"
                         style={{
                          backgroundColor: "red",
                          color:"white"
                        }}
                  type="button"
                  onClick={() =>
                    eliminarMedicamento(index)
                  }
                >
                  Eliminar
                </button>
              </div>
            ))}

            <button
             className="action-btn"
                     style={{
          backgroundColor: "blue",
          color:"white"
        }}
              type="button"
              onClick={agregarMedicamento}
            >
              + Agregar medicamento
            </button>

            <hr style={{ margin: "20px 0"}} />
            

            <button
              onClick={guardarOrden}
              style={{
                marginRight: "10px",
                backgroundColor: "green",
                color:"white"
              }}
              className="action-btn"
            >
              Guardar Orden
            </button>

            <button
              onClick={() =>
                setMostrarModal(false)
              }
              className="action-btn"

                      style={{
          backgroundColor: "red",
          color:"white"
        }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>






















  </div>
);
}

export default Prueba;

