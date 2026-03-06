import { Card, Form, Button, Row, Col, Modal, Alert } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AgregarMedicamento() {

  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");

  const [medicamento, setMedicamento] = useState({
    nombre: "",
    presentacion: "",
    categoria: "",
    codigo: "",
    stockMax: "",
    stockMin: "",
    precio: "",
    vencimiento: "",
    distribuidor: "",
    entrega: "",
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

  const guardarMedicamento = () => {

    const medicamentosGuardados =
      JSON.parse(localStorage.getItem("medicamentos")) || [];

    medicamentosGuardados.push(medicamento);

    localStorage.setItem(
      "medicamentos",
      JSON.stringify(medicamentosGuardados)
    );

    cerrarModal();

    navigate("/farmacia/inventario");
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
                    <Form.Label>Nombre Comercial</Form.Label>
                    <Form.Control
                      name="nombre"
                      onChange={handleChange}
                      placeholder="Ej. Amoxicilina"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Presentación</Form.Label>
                    <Form.Control
                      name="presentacion"
                      onChange={handleChange}
                      placeholder="Ej. 500 mg"
                    />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control
                      name="categoria"
                      onChange={handleChange}
                      placeholder="Antibiótico"
                    />
                  </Col>
                </Row>
              </Card>

              {/* INVENTARIO */}
              <Card className="card-modern p-4 mb-3">
                <h6 className="mb-3">Inventario y precios</h6>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Código de barras</Form.Label>
                    <Form.Control name="codigo" onChange={handleChange}/>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Stock máximo</Form.Label>
                    <Form.Control name="stockMax" onChange={handleChange}/>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Stock mínimo</Form.Label>
                    <Form.Control name="stockMin" onChange={handleChange}/>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control name="precio" onChange={handleChange}/>
                  </Col>

                  <Col md={12}>
                    <Form.Label>Fecha de vencimiento</Form.Label>
                    <Form.Control
                      type="date"
                      name="vencimiento"
                      onChange={handleChange}
                    />
                  </Col>
                </Row>
              </Card>

              {/* DISTRIBUIDOR */}
              <Card className="card-modern p-4">
                <h6 className="mb-3">Información del distribuidor</h6>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Distribuidor</Form.Label>
                    <Form.Select
                      name="distribuidor"
                      onChange={handleChange}
                    >
                      <option value="">Selecciona...</option>
                      <option>Distribuidor A</option>
                      <option>Distribuidor B</option>
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Tiempo de entrega</Form.Label>
                    <Form.Control
                      name="entrega"
                      onChange={handleChange}
                      placeholder="Ej. 2 días"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* COLUMNA DERECHA */}
            <Col md={4}>
              <Card className="card-modern d-flex justify-content-center align-items-center">
                <div
                  style={{
                    width: "140px",
                    height: "140px",
                    border: "2px dashed #ccc",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#aaa",
                  }}
                >
                  Imagen
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