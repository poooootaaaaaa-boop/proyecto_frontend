import { Button, Form, Modal } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import "./INVENTARIO.css";
import axios from "axios";
import Pagination from "@mui/material/Pagination";

const API_URL = import.meta.env.VITE_API_URL;

export default function Inventario() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [imagenNueva, setImagenNueva] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;

  const [modalEditar, setModalEditar] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [medSeleccionado, setMedSeleccionado] = useState(null);

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias`);
      setCategorias(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerMedicamentos = async () => {
    try {
      const res = await axios.get(`${API_URL}/medicamentos`);
      setMedicamentos(res.data);
      setPaginaActual(1);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    obtenerMedicamentos();
    obtenerCategorias();
  }, []);

  const handleImagen = (e) => {
    setImagenNueva(e.target.files[0]);
  };

  const abrirEditar = (med) => {
    setMedSeleccionado({ ...med });
    setModalEditar(true);
  };

  const abrirEliminar = (med) => {
    setMedSeleccionado(med);
    setModalEliminar(true);
  };

  const cerrarModales = () => {
    setModalEditar(false);
    setModalEliminar(false);
    setMedSeleccionado(null);
    setImagenNueva(null);
  };

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const medicamentosPaginados = medicamentos.slice(indexPrimero, indexUltimo);
  const totalPaginas = Math.ceil(medicamentos.length / itemsPorPagina);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMedSeleccionado({
      ...medSeleccionado,
      [name]: value,
    });
  };

  const totalItems = medicamentos.length;
  const lowStock = medicamentos.filter((m) => m.stock <= m.stock_minimo).length;
  const expired = medicamentos.filter((m) => {
    if (!m.fecha_caducidad) return false;
    const hoy = new Date();
    const cad = new Date(m.fecha_caducidad);
    return cad < hoy;
  }).length;

  const guardarCambios = async () => {
    try {
      const datos = new FormData();
      datos.append("operacion", "Modificar");
      datos.append("id", medSeleccionado.id);
      datos.append("nombre", medSeleccionado.nombre);
      datos.append("categoria_id", medSeleccionado.categoria_id);
      datos.append("stock", medSeleccionado.stock);
      datos.append("sustancia_activa", medSeleccionado.sustancia_activa);

      if (imagenNueva) {
        datos.append("imagen", imagenNueva);
      }

      await axios.post(`${API_URL}/medicamentos/operaciones`, datos);
      obtenerMedicamentos();
      cerrarModales();
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangePage = (event, value) => {
    setPaginaActual(value);
  };

  const eliminarMedicamento = async () => {
    try {
      const datos = new FormData();
      datos.append("operacion", "Eliminar");
      datos.append("id", medSeleccionado.id);

      await axios.post(`${API_URL}/medicamentos/operaciones`, datos);
      obtenerMedicamentos();
      cerrarModales();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div className="page-wrapper">
          {/* HEADER */}
          <div className="inventory-header">
            <div>
              <h2 className="main-title">Inventario</h2>
              <p className="subtitle">Gestión y control de medicamentos</p>
            </div>

            <Button as={NavLink} to="/farmacia/AgregarMedicamento" className="primary-btn">
              + Agregar medicamento
            </Button>
          </div>

          {/* CARDS DE MÉTRICAS COMPACTAS */}
          <div className="stats-grid">
            <div className="stat-card-modern">
              <small>Total Items</small>
              <h3>{totalItems}</h3>
              <span className="stat-badge success">+2.4% último mes</span>
            </div>

            <div className="stat-card-modern">
              <small>Low Stock</small>
              <h3>{lowStock}</h3>
              <span className="stat-badge warning">6 pendientes</span>
            </div>

            <div className="stat-card-modern">
              <small>Expired</small>
              <h3>{expired}</h3>
              <span className="stat-badge danger">Revisión urgente</span>
            </div>
          </div>

          {/* ACCIÓN SECUNDARIA */}
          <div className="inventory-actions">
            <Button as={NavLink} to="/farmacia/Distribuidores" className="secondary-btn">
              Ver distribuidores
            </Button>
          </div>

          {/* TABLA DE MEDICAMENTOS */}
          <div className="card-modern">
            <div className="card-top-title">
              <h5 className="section-title">Lista de Medicamentos</h5>
            </div>

            <div className="table-modern">
              <div className="table-header-modern">
                <span>Medicamento</span>
                <span>Stock Actual</span>
                <span>Lote / Caducidad</span>
                <span>Status</span>
                <span className="text-center">Acciones</span>
              </div>

              {medicamentosPaginados.length === 0 ? (
                <div className="empty-table-msg">No hay medicamentos registrados.</div>
              ) : (
                medicamentosPaginados.map((med, index) => (
                  <div className="table-row-modern" key={index}>
                    {/* MEDICAMENTO */}
                    <div className="med-info-cell">
                      <img
                        src={`http://localhost:8000/api/medicamentos/imagen/${med.imagen_url}`}
                        alt={med.nombre}
                        className="med-img-thumbnail"
                      />
                      <div>
                        <strong>{med.nombre}</strong>
                        <small className="muted d-block">{med.sustancia_activa}</small>
                        <small className="category-tag">{med.categoria}</small>
                      </div>
                    </div>

                    {/* STOCK */}
                    <div>
                      <span className="font-semibold">{med.stock} unidades</span>
                      <small className="success-text d-block">Nivel óptimo</small>
                    </div>

                    {/* LOTE / CADUCIDAD */}
                    <div>
                      <span className="font-medium">{med.lote || "S/N"}</span>
                      <small className="muted d-block">{med.fecha_caducidad || "Sin fecha"}</small>
                    </div>

                    {/* STATUS */}
                    <div>
                      <span
                        className={`status-badge ${
                          med.stock <= med.stock_minimo ? "low-stock" : "in-stock"
                        }`}
                      >
                        {med.stock <= med.stock_minimo ? "Low Stock" : "In Stock"}
                      </span>
                    </div>

                    {/* ACCIONES */}
                    <div className="actions-cell">
                      <i
                        className="bi bi-pencil-square action-icon edit"
                        title="Editar"
                        onClick={() => abrirEditar(med)}
                      />
                      <i
                        className="bi bi-trash action-icon delete"
                        title="Eliminar"
                        onClick={() => abrirEliminar(med)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* PAGINACIÓN */}
          {totalPaginas > 1 && (
            <div className="pagination-container">
              <Pagination
                count={totalPaginas}
                page={paginaActual}
                onChange={handleChangePage}
                variant="outlined"
                color="primary"
                shape="rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDITAR */}
      <Modal show={modalEditar} onHide={cerrarModales} centered className="modern-modal">
        <Modal.Header closeButton>
          <Modal.Title>Editar Medicamento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                name="nombre"
                value={medSeleccionado?.nombre || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="categoria_id"
                value={medSeleccionado?.categoria_id || ""}
                onChange={handleChange}
              >
                <option value="">Selecciona</option>
                {categorias.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                name="stock"
                type="number"
                value={medSeleccionado?.stock || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Sustancia activa</Form.Label>
              <Form.Control
                name="sustancia_activa"
                value={medSeleccionado?.sustancia_activa || ""}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Imagen</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImagen} />
              {medSeleccionado?.imagen_url && (
                <img
                  src={`http://localhost:8000/api/medicamentos/imagen/${medSeleccionado.imagen_url}`}
                  alt="preview"
                  className="modal-img-preview"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={cerrarModales} className="btn-modal-cancel">
            Cancelar
          </Button>
          <Button variant="primary" onClick={guardarCambios} className="primary-btn">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL ELIMINAR */}
      <Modal show={modalEliminar} onHide={cerrarModales} centered className="modern-modal">
        <Modal.Header closeButton>
          <Modal.Title>Eliminar medicamento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="delete-modal-text">
            ¿Seguro que deseas eliminar <strong>{medSeleccionado?.nombre}</strong>? Esta acción no se puede deshacer.
          </p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="light" onClick={cerrarModales} className="btn-modal-cancel">
            Cancelar
          </Button>
          <Button variant="danger" onClick={eliminarMedicamento} className="btn-modal-delete">
            Sí, Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}