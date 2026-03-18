import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import {  useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";



export default function AgregarMedicamento() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
const [categorias, setCategorias] = useState([]);


  const [imagen, setImagen] = useState(null);
const [preview, setPreview] = useState(null);
const fileInputRef = useRef();
const seleccionarImagen = (e) => {
  const file = e.target.files[0];
  if (file) {
    setImagen(file);
    setPreview(URL.createObjectURL(file));
  }
};

useEffect(() => {

axios.get("http://localhost:8000/api/categorias")
.then(res => {
  setCategorias(res.data);
})
.catch(err => console.log(err));

}, []);



const [medicamento, setMedicamento] = useState({
  categoria_id: "",
  nombre: "",
  sustancia_activa: "",
  concentracion: "",
  unidad: "",
  presentacion: "",
  cantidad_presentacion: "",
  requiere_receta: "",
  descripcion_general: "",

  stock: "",
  stock_minimo: "",
  precio_compra: "",
  precio_venta: "",
  lote: "",
  fecha_caducidad: "",

  distribuidor_id: ""
});



  const handleChange = (e) => {
    setMedicamento({
      ...medicamento,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const cerrarModal = () => setShowModal(false);

  // VALIDAR CAMPOS
  const abrirModal = () => {

    const campos = Object.values(medicamento);

    const vacio = campos.some((campo) => campo === "");

    if (vacio) {
      setError("Por favor llena todos los campos.");
      return;
    }

    setShowModal(true);
  };
const guardarMedicamento = async (e) => {

  if (e) e.preventDefault();

  try {

    const formData = new FormData();

    formData.append("operacion", "Agregar");
    formData.append("categoria_id", medicamento.categoria_id);


    formData.append("nombre", medicamento.nombre);
    formData.append("sustancia_activa", medicamento.sustancia_activa);
    formData.append("concentracion", medicamento.concentracion);
    formData.append("unidad", medicamento.unidad);
    formData.append("presentacion", medicamento.presentacion);
    formData.append("cantidad_presentacion", medicamento.cantidad_presentacion);
    formData.append("requiere_receta", medicamento.requiere_receta);
    formData.append("descripcion_general", medicamento.descripcion_general);

    formData.append("stock", medicamento.stock);
    formData.append("stock_minimo", medicamento.stock_minimo);
    formData.append("precio_compra", medicamento.precio_compra);
    formData.append("precio_venta", medicamento.precio_venta);
    formData.append("lote", medicamento.lote);
    formData.append("fecha_caducidad", medicamento.fecha_caducidad);

    formData.append("distribuidor_id", medicamento.distribuidor_id);
    formData.append("farmacia_id", 1);

    if (imagen) {
      formData.append("imagen", imagen);
    }

    await axios.post(
      "http://localhost:8000/api/medicamentos/operaciones",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    cerrarModal();
    navigate("/farmacia/inventario");

  } catch (error) {

    console.error(error);
    setError("Error al guardar el medicamento");

  }
};

  return (
    <div className="home-layout">
      <Sidebar />

      <div className="home-content-modern">
        <Topbar />

        <div style={{ padding: "30px" }}>
          <h2 className="main-title">Agregar nuevo medicamento</h2>

          {/* ALERTA */}
          {error && (
            <Alert variant="danger" className="mt-3">
              {error}
            </Alert>
          )}

          <Row className="g-4">

            {/* COLUMNA IZQUIERDA */}
            <Col md={8}>

            <Card className="card-modern p-4 mb-3">
  <h6 className="mb-3">Detalles del medicamento</h6>

  <Row className="g-3">

    <Col md={6}>
      <Form.Label>Nombre</Form.Label>
      <Form.Control name="nombre" onChange={handleChange}/>
    </Col>

    <Col md={6}>
      <Form.Label>Sustancia activa</Form.Label>
      <Form.Control name="sustancia_activa" onChange={handleChange}/>
    </Col>

    <Col md={6}>
      <Form.Label>Concentración</Form.Label>
      <Form.Control
        name="concentracion"
        placeholder="Ej. 500"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Unidad</Form.Label>
      <Form.Control
        name="unidad"
        placeholder="mg / ml"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Presentación</Form.Label>
      <Form.Control
        name="presentacion"
        placeholder="Tabletas / Jarabe"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Cantidad por presentación</Form.Label>
      <Form.Control
        type="number"
        name="cantidad_presentacion"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Requiere receta</Form.Label>
      <Form.Select
        name="requiere_receta"
        onChange={handleChange}
      >
        <option value="">Selecciona</option>
        <option value="1">Sí</option>
        <option value="0">No</option>
      </Form.Select>
    </Col>

    <Col md={12}>
      <Form.Label>Descripción</Form.Label>
      <Form.Control
        as="textarea"
        name="descripcion_general"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
<Form.Label>Categoría</Form.Label>

<Form.Select
name="categoria_id"
onChange={handleChange}
>

<option value="">Selecciona</option>

{categorias.map(cat => (

<option key={cat.id} value={cat.id}>
{cat.nombre}
</option>

))}

</Form.Select>

</Col>


  </Row>
</Card>


              {/* INVENTARIO */}
    <Card className="card-modern p-4 mb-3">
  <h6 className="mb-3">Inventario y precios</h6>

  <Row className="g-3">

    <Col md={6}>
      <Form.Label>Stock</Form.Label>
      <Form.Control
        type="number"
        name="stock"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Stock mínimo</Form.Label>
      <Form.Control
        type="number"
        name="stock_minimo"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Precio compra</Form.Label>
      <Form.Control
        type="number"
        name="precio_compra"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Precio venta</Form.Label>
      <Form.Control
        type="number"
        name="precio_venta"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Lote</Form.Label>
      <Form.Control
        name="lote"
        onChange={handleChange}
      />
    </Col>

    <Col md={6}>
      <Form.Label>Fecha caducidad</Form.Label>
      <Form.Control
        type="date"
        name="fecha_caducidad"
        onChange={handleChange}
      />
    </Col>

  </Row>
</Card>

              {/* DISTRIBUIDOR */}
<Card className="card-modern p-4">
  <h6 className="mb-3">Distribuidor</h6>

  <Row className="g-3">

    <Col md={12}>
      <Form.Label>Distribuidor</Form.Label>

      <Form.Select
        name="distribuidor_id"
        onChange={handleChange}
      >
        <option value="">Selecciona...</option>
        <option value="1">Distribuidor A</option>
        <option value="2">Distribuidor B</option>
      </Form.Select>

    </Col>

  </Row>
</Card>

            </Col>

            {/* COLUMNA DERECHA */}
<Col md={4}>
  <Card className="card-modern d-flex justify-content-center align-items-center">
    
    <input
      type="file"
      accept="image/*"
      ref={fileInputRef}
      style={{ display: "none" }}
      onChange={seleccionarImagen}
    />

    <div
      onClick={() => fileInputRef.current.click()}
      style={{
        width: "140px",
        height: "140px",
        border: "2px dashed #ccc",
        borderRadius: "12px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#aaa",
        cursor: "pointer",
        overflow: "hidden",
      }}
    >
      {preview ? (
        <img
          src={preview}
          alt="preview"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      ) : (
        "Imagen"
      )}
    </div>

  </Card>
</Col>


          </Row>

          {/* BOTONES */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="light">Cancelar</Button>
            <Button variant="primary" onClick={abrirModal}>
              Agregar
            </Button>
          </div>
        </div>
      </div>

      {/* MODAL */}
      <Modal show={showModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar acción</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          ¿Quieres agregar este medicamento al inventario?
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={cerrarModal}>
            Cancelar
          </Button>

          <Button variant="primary" onClick={guardarMedicamento}>
            Sí, agregar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}