import { Card, Form, Button, Row, Col } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";

export default function AgregarMedicamento() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          <h5 className="mb-4">Agregar nuevo medicamento</h5>

          <Row className="g-4">
            {/* ===== COLUMNA IZQUIERDA ===== */}
            <Col md={8}>
              {/* Detalles del medicamento */}
              <Card className="p-4 rounded-4 border-0 mb-3">
                <h6 className="mb-3"> Detalles del medicamento</h6>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Nombre Comercial</Form.Label>
                    <Form.Control placeholder="Ej. Amoxicilina" />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Presentación</Form.Label>
                    <Form.Control placeholder="Ej. 500 mg" />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Categoría</Form.Label>
                    <Form.Control placeholder="Antibiótico" />
                  </Col>
                </Row>
              </Card>

              {/* Inventario y precios */}
              <Card className="p-4 rounded-4 border-0 mb-3">
                <h6 className="mb-3"> Inventario y precios</h6>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Código de barras</Form.Label>
                    <Form.Control />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Stock máximo</Form.Label>
                    <Form.Control />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Stock mínimo</Form.Label>
                    <Form.Control />
                  </Col>

                  <Col md={6}>
                    <Form.Label>Precio</Form.Label>
                    <Form.Control />
                  </Col>

                  <Col md={12}>
                    <Form.Label>Fecha de vencimiento</Form.Label>
                    <Form.Control type="date" />
                  </Col>
                </Row>
              </Card>

              {/* Información del distribuidor */}
              <Card className="p-4 rounded-4 border-0">
                <h6 className="mb-3"> Información del distribuidor</h6>

                <Row className="g-3">
                  <Col md={6}>
                    <Form.Label>Seleccionar distribuidor</Form.Label>
                    <Form.Select>
                      <option>Selecciona...</option>
                      <option>Distribuidor A</option>
                      <option>Distribuidor B</option>
                    </Form.Select>
                  </Col>

                  <Col md={6}>
                    <Form.Label>Tiempo de entrega</Form.Label>
                    <Form.Control placeholder="Ej. 2 días" />
                  </Col>
                </Row>
              </Card>
            </Col>

            {/* ===== COLUMNA DERECHA (IMAGEN) ===== */}
            <Col md={4}>
              <Card
                className="rounded-4 border-0 d-flex justify-content-center align-items-center"
                style={{ height: "100%" }}
              >
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

          {/* ===== BOTONES ===== */}
          <div className="d-flex justify-content-end gap-3 mt-4">
            <Button variant="light">Cancelar</Button>
            <Button variant="primary">Agregar</Button>
          </div>
        </div>
      </div>
    </div>
  );
}