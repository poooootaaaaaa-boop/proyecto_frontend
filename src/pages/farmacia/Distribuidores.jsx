import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { Card, Button, Row, Col } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Distribuidores() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={{ flex: 1, background: "#f7f7f7", minHeight: "100vh" }}>
        <Topbar />

        <div style={{ padding: "30px" }}>
          {/* ===== HEADER ===== */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Gestión de distribuidores</h4>

            <Button
              as={NavLink}
              to="/farmacia/distribuidores/nuevo"
              variant="primary"
            >
              Agregar
            </Button>
          </div>

          <h6 className="mb-4">Panel de Suministro</h6>

          <Row className="g-4">
            {/* ===== ÚLTIMOS SUMINISTROS ===== */}
            <Col md={8}>
              <Card className="p-4 rounded-4 border-0">
                <div className="d-flex justify-content-between mb-3">
                  <h6>Últimos suministros</h6>
                  <span className="text-primary" style={{ cursor: "pointer" }}>
                    Ver todo
                  </span>
                </div>

                {[
                  { nombre: "PharmaFirts" },
                  { nombre: "MediGlobal" },
                  { nombre: "LogiDrug" },
                  { nombre: "Vital" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="d-flex justify-content-between align-items-center py-3 border-bottom"
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#eaeaea",
                        }}
                      />
                      <strong>{item.nombre}</strong>
                    </div>

                    <div className="text-muted">
                      Paracetamol <br /> 500gr
                    </div>

                    <strong>1,200 uds</strong>
                  </div>
                ))}
              </Card>
            </Col>

            {/* ===== DISTRIBUIDORES ===== */}
            <Col md={4}>
              <Card className="p-4 rounded-4 border-0">
                <h6 className="mb-3">Distribuidores</h6>

                {["PharmaFirts", "MediGlobal", "MediGlobal"].map(
                  (nombre, index) => (
                    <div
                      key={index}
                      className="d-flex align-items-center gap-3 p-3 mb-3 rounded-3"
                      style={{ background: "#f5f5f5" }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          background: "#e0e0e0",
                        }}
                      />
                      <strong>{nombre}</strong>
                    </div>
                  )
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}