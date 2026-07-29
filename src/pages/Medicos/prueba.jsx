import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import TablePagination from "@mui/material/TablePagination";
import SlimSelect from "slim-select";
import "slim-select/styles";

import Sidebar from "../../components/farmacia/Sidebar";
import "./prueba.css";

const API_URL = import.meta.env.VITE_API_URL;

// Encapsulamiento seguro para SlimSelect
const SlimSelectField = ({ options, value, onChange, placeholder = "Selecciona una opción" }) => {
  const selectRef = useRef(null);
  const slimInstanceRef = useRef(null);

  useEffect(() => {
    if (selectRef.current) {
      slimInstanceRef.current = new SlimSelect({
        select: selectRef.current,
        settings: {
          placeholderText: placeholder,
          searchText: "No se encontraron resultados",
          searchPlaceholder: "Buscar...",
        },
        events: {
          afterChange: (newVal) => {
            const selectedVal = newVal[0] ? newVal[0].value : "";
            if (selectedVal !== value) {
              onChange(selectedVal);
            }
          },
        },
      });
    }

    return () => {
      if (slimInstanceRef.current) {
        slimInstanceRef.current.destroy();
      }
    };
  }, [options]);

  useEffect(() => {
    if (slimInstanceRef.current) {
      slimInstanceRef.current.setSelected(value || "");
    }
  }, [value]);

  return (
    <select ref={selectRef} defaultValue={value} className="modern-input">
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.id} value={opt.id}>
          {opt.nombre}
        </option>
      ))}
    </select>
  );
};

function Prueba() {
  const [caducado, setCaducado] = useState(false);
  const [tipoMovimiento, setTipoMovimiento] = useState("entrada");
  const [producto, setProducto] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("");

  const [carrito, setCarrito] = useState([]);
  const [medicamentos, setMedicamentos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [recetas, setRecetas] = useState([]);
  const [proveedorId, setProveedorId] = useState("");
  const [recetaId, setRecetaId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [historial, setHistorial] = useState([]);

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
        precio: "",
      },
    ],
  });

  useEffect(() => {
    Axios.get(`${API_URL}/medicamentosselct`)
      .then((res) => setMedicamentos(res.data))
      .catch((err) => console.error(err));

    Axios.get(`${API_URL}/proveedores`)
      .then((res) => setProveedores(res.data))
      .catch((err) => console.error(err));

    Axios.get(`${API_URL}/recetas`)
      .then((res) => setRecetas(res.data))
      .catch((err) => console.error(err));

    Axios.get(`${API_URL}/movimientos`)
      .then((res) => setHistorial(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (caducado) setRecetaId("");
  }, [caducado]);

  const agregarAlCarrito = () => {
    if (!producto) return alert("Selecciona un medicamento");
    if (!cantidad || Number(cantidad) <= 0) return alert("Ingresa una cantidad válida");

    const medSel = medicamentos.find((m) => String(m.id) === String(producto));
    if (!medSel) return alert("Medicamento no encontrado");

    setCarrito((prev) => {
      const existe = prev.find((item) => String(item.medicamento_id) === String(producto));
      if (existe) {
        return prev.map((item) =>
          String(item.medicamento_id) === String(producto)
            ? { ...item, cantidad: Number(item.cantidad) + Number(cantidad) }
            : item
        );
      }
      return [
        ...prev,
        { medicamento_id: producto, nombre: medSel.nombre, cantidad: Number(cantidad) },
      ];
    });

    setProducto("");
    setCantidad("");
  };

  const eliminarDelCarrito = (index) => {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  };

  const guardarMovimiento = () => {
    if (!tipoMovimiento) return alert("Selecciona Entrada o Salida");
    if (carrito.length === 0) return alert("Agrega medicamentos al carrito");
    if (tipoMovimiento === "entrada" && !proveedorId) return alert("Selecciona un proveedor");
    if (tipoMovimiento === "salida" && !recetaId && !caducado) return alert("Selecciona una receta");

    const dataToSend = {
      tipo: tipoMovimiento,
      motivo,
      proveedor_id: tipoMovimiento === "entrada" ? proveedorId : null,
      receta_id: tipoMovimiento === "salida" ? recetaId : null,
      caducado,
      medicamentos: carrito,
    };

    Axios.post(`${API_URL}/guardarMovimientos`, dataToSend)
      .then(() => {
        alert("Movimiento registrado con éxito");
        Axios.get(`${API_URL}/movimientos`).then((res) => setHistorial(res.data));
        setProducto("");
        setCantidad("");
        setMotivo("");
        setProveedorId("");
        setRecetaId("");
        setCaducado(false);
        setCarrito([]);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error al guardar el movimiento");
      });
  };

  const agregarMedicamentoOrden = () => {
    setOrden((prev) => ({
      ...prev,
      medicamentos: [
        ...prev.medicamentos,
        {
          medicamento_id: "",
          nombre: "",
          nombrePersonalizado: "",
          unidades: "",
          descripcion: "",
          precio: "",
        },
      ],
    }));
  };

  const eliminarMedicamentoOrden = (index) => {
    if (orden.medicamentos.length === 1) return;
    setOrden((prev) => ({
      ...prev,
      medicamentos: prev.medicamentos.filter((_, i) => i !== index),
    }));
  };

  const cambiarMedicamentoOrden = (index, campo, valor) => {
    setOrden((prev) => {
      const nuevos = [...prev.medicamentos];
      nuevos[index] = { ...nuevos[index], [campo]: valor };

      if (campo === "medicamento_id") {
        if (valor !== "otro") {
          const med = medicamentos.find((m) => String(m.id) === String(valor));
          nuevos[index].nombre = med?.nombre || "";
          nuevos[index].nombrePersonalizado = "";
        } else {
          nuevos[index].nombre = "";
        }
      }

      return { ...prev, medicamentos: nuevos };
    });
  };

  const guardarOrden = async () => {
    try {
      await Axios.post(`${API_URL}/ordenes-compra`, orden);
      navigate("/medicos/documento-orden", { state: { orden } });
      alert("Orden de compra generada exitosamente");
      setMostrarModal(false);
    } catch (error) {
      alert("Error al intentar guardar la orden");
    }
  };

  return (
    <div className="movimientos-layout">
      <Sidebar />

      <div className="movimientos-container">
        {/* ENCABEZADO */}
        <div className="page-header">
          <div>
            <h2>Gestión de Inventario</h2>
            <p>Monitorea las entradas, salidas y genera órdenes de compra</p>
          </div>
          <button className="btn-primary" onClick={() => setMostrarModal(true)}>
            + Generar Orden de Compra
          </button>
        </div>

        {/* REGISTRO DE MOVIMIENTO */}
        <div className="movimiento-card">
          <div className="tipo-operacion">
            <button
              className={`toggle-btn entrada ${tipoMovimiento === "entrada" ? "active" : ""}`}
              onClick={() => setTipoMovimiento("entrada")}
            >
              ⬇ Entrada de Stock
            </button>
            <button
              className={`toggle-btn salida ${tipoMovimiento === "salida" ? "active" : ""}`}
              onClick={() => setTipoMovimiento("salida")}
            >
              ⬆ Salida de Stock
            </button>
          </div>

          <div className="form-grid">
            <div className="input-group-custom">
              <label>Medicamento</label>
              <SlimSelectField
                options={medicamentos}
                value={producto}
                onChange={(val) => setProducto(val)}
                placeholder="Selecciona medicamento"
              />
            </div>

            <div className="input-group-custom">
              <label>Cantidad</label>
              <input
                type="number"
                className="modern-input"
                placeholder="0"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
            </div>

            <div className="input-group-custom">
              <button type="button" className="btn-secondary" onClick={agregarAlCarrito}>
                + Aañadir a Lista
              </button>
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
                <label>Receta Asociada</label>
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
              <label>Motivo u Observación</label>
              <input
                type="text"
                className="modern-input"
                placeholder="Ej. Reabastecimiento mensual / Mermas / Ajuste"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
              />
            </div>

            {tipoMovimiento === "salida" && (
              <div className="caducado-box full-width">
                <input
                  type="checkbox"
                  id="caducado"
                  checked={caducado}
                  onChange={(e) => setCaducado(e.target.checked)}
                />
                <label htmlFor="caducado">Marcar producto como caducado / dañado</label>
              </div>
            )}

            {carrito.length > 0 && (
              <div className="full-width carrito-section">
                <h4>Items a Procesar ({carrito.length})</h4>
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th>Medicamento</th>
                      <th>Cantidad</th>
                      <th style={{ textAlign: "right" }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carrito.map((item, index) => (
                      <tr key={index}>
                        <td>{item.nombre}</td>
                        <td>{item.cantidad} unidades</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn-danger-soft"
                            onClick={() => eliminarDelCarrito(index)}
                          >
                            Quitar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="full-width" style={{ marginTop: "1rem" }}>
              <button type="button" className="btn-primary" onClick={guardarMovimiento}>
                Confirmar Registro de {tipoMovimiento === "entrada" ? "Entrada" : "Salida"}
              </button>
            </div>
          </div>
        </div>

        {/* HISTORIAL GENERAL */}
        <div className="historial-card">
          <h3>Historial de Movimientos</h3>
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
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((mov) => (
                      <tr key={mov.id}>
                        <td>{new Date(mov.fecha_movimiento).toLocaleString()}</td>
                        <td>{mov.inventario?.medicamento?.nombre || "N/A"}</td>
                        <td>
                          <span
                            className={`badge-tipo ${
                              mov.tipo === "entrada" ? "badge-entrada" : "badge-salida"
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
                    <td colSpan="5" style={{ textAlign: "center", color: "#94a3b8" }}>
                      No se encontraron registros de movimiento
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
            onPageChange={(e, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </div>
      </div>

      {/* MODAL ORDEN DE COMPRA */}
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Generar Nueva Orden de Compra</h3>
              <button
                type="button"
                className="btn-danger-soft"
                onClick={() => setMostrarModal(false)}
              >
                ✕ Cerrar
              </button>
            </div>

            <div className="form-grid" style={{ marginBottom: "1.5rem" }}>
              <div className="input-group-custom">
                <label>Proveedor</label>
                <select
                  className="modern-input"
                  value={orden.proveedor_id}
                  onChange={(e) => {
                    const id = e.target.value;
                    const p = proveedores.find((prov) => String(prov.id) === String(id));
                    setOrden({
                      ...orden,
                      proveedor_id: id,
                      proveedor_nombre: p?.nombre || "",
                      proveedor_rfc: p?.rfc || "",
                      proveedor_direccion: p?.direccion || "",
                      proveedor_telefono: p?.telefono || "",
                      proveedor_contacto: p?.contacto || "",
                    });
                  }}
                >
                  <option value="">Selecciona Proveedor</option>
                  {proveedores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="input-group-custom">
                <label>Fecha de Solicitud</label>
                <input
                  type="date"
                  className="modern-input"
                  value={orden.fecha}
                  onChange={(e) => setOrden({ ...orden, fecha: e.target.value })}
                />
              </div>
            </div>

            <h4 style={{ marginBottom: "1rem" }}>Listado de Productos</h4>

            {orden.medicamentos.map((med, index) => (
              <div className="med-card-item" key={index}>
                <div className="med-card-header">
                  <h5>Producto #{index + 1}</h5>
                  {orden.medicamentos.length > 1 && (
                    <button
                      type="button"
                      className="btn-danger-soft"
                      onClick={() => eliminarMedicamentoOrden(index)}
                    >
                      Eliminar
                    </button>
                  )}
                </div>

                <div className="form-grid">
                  <div className="input-group-custom">
                    <label>Medicamento</label>
                    <SlimSelectField
                      options={[...medicamentos, { id: "otro", nombre: "Otro (Especificar)" }]}
                      value={med.medicamento_id}
                      onChange={(val) => cambiarMedicamentoOrden(index, "medicamento_id", val)}
                      placeholder="Seleccionar..."
                    />
                  </div>

                  {med.medicamento_id === "otro" && (
                    <div className="input-group-custom">
                      <label>Nombre del Medicamento</label>
                      <input
                        type="text"
                        className="modern-input"
                        placeholder="Nombre comercial/genérico"
                        value={med.nombrePersonalizado}
                        onChange={(e) =>
                          cambiarMedicamentoOrden(index, "nombrePersonalizado", e.target.value)
                        }
                      />
                    </div>
                  )}

                  <div className="input-group-custom">
                    <label>Unidades</label>
                    <input
                      type="number"
                      className="modern-input"
                      min="1"
                      value={med.unidades}
                      onChange={(e) => cambiarMedicamentoOrden(index, "unidades", e.target.value)}
                    />
                  </div>

                  <div className="input-group-custom">
                    <label>Precio Estimado ($)</label>
                    <input
                      type="number"
                      className="modern-input"
                      min="0"
                      step="0.01"
                      value={med.precio}
                      onChange={(e) => cambiarMedicamentoOrden(index, "precio", e.target.value)}
                    />
                  </div>

                  <div className="input-group-custom full-width">
                    <label>Notas / Descripción</label>
                    <textarea
                      className="modern-input"
                      rows="2"
                      placeholder="Presentación, concentración o detalles adicionales"
                      value={med.descripcion}
                      onChange={(e) => cambiarMedicamentoOrden(index, "descripcion", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              className="btn-secondary"
              onClick={agregarMedicamentoOrden}
              style={{ width: "100%", marginBottom: "1.5rem" }}
            >
              + Agregar otro medicamento a la lista
            </button>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>
              <button type="button" className="btn-primary" onClick={guardarOrden}>
                Guardar y Emitir Orden
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Prueba;