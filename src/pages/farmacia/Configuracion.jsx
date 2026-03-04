import { Card, Table, Badge, Form, Row, Col } from "react-bootstrap";
import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import { useState } from "react";
import "./Configuracion.css";

export default function Configuracion() {
  const [tab, setTab] = useState("ajustes");

  return (
    <div className="farmacia-layout">
      <Sidebar />

      <div className="farmacia-content">
        <Topbar />

        <div className="config-wrapper">
          {/* ===== HEADER ===== */}
          <div className="config-header">
            <h4>Configuración general</h4>

            <Form.Control
              placeholder="Buscar configuración..."
              className="config-search"
            />
          </div>

          {/* ===== TABS ===== */}
          <div className="config-tabs">
            <span
              className={tab === "ajustes" ? "tab active" : "tab"}
              onClick={() => setTab("ajustes")}
            >
              Ajustes
            </span>

            <span
              className={tab === "general" ? "tab active" : "tab"}
              onClick={() => setTab("general")}
            >
              General
            </span>
          </div>

          {/* ===== CONTENT ===== */}
          <Row className="g-4">
            {/* ===== FARMACIAS AFILIADAS ===== */}
            <Col md={6}>
              <Card className="farm-card h-100">
                <h6 className="card-title">Farmacias afiliadas</h6>

                <Table borderless responsive className="farm-table">
                  <thead>
                    <tr>
                      <th>SUCURSAL</th>
                      <th>UBICACIÓN</th>
                      <th>ESTADO</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Sucursal Norte</td>
                      <td>
                        Av. Central <br />
                        <small>CP 4556</small>
                      </td>
                      <td>
                        <Badge bg="secondary">Inactiva</Badge>
                      </td>
                      <td className="action-dots">⋮</td>
                    </tr>

                    <tr>
                      <td>Sucursal Centro</td>
                      <td>
                        Calle 5 <br />
                        <small>CP 4456</small>
                      </td>
                      <td>
                        <Badge bg="success">Activa</Badge>
                      </td>
                      <td className="action-dots">⋮</td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>

            {/* ===== NOTIFICACIONES ===== */}
            <Col md={6}>
              <Card className="farm-card h-100">
                <h6 className="card-title">
                  Notificaciones de sistema
                </h6>

                <div className="switch-group">
                  <Form.Check
                    type="switch"
                    label="Alerta de inventario crítico"
                    defaultChecked
                  />

                  <Form.Check
                    type="switch"
                    label="Avisos de vencimiento próximo"
                    defaultChecked
                  />

                  <Form.Check
                    type="switch"
                    label="Actualizaciones de precios"
                  />
                </div>
              </Card>
            </Col>

            {/* ===== USUARIOS INTERNOS ===== */}
            <Col md={6}>
              <Card className="farm-card">
                <h6 className="card-title">Usuarios internos</h6>

                <Table borderless className="farm-table">
                  <thead>
                    <tr>
                      <th>USUARIO</th>
                      <th>ESTADO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Juan Pérez</strong></td>
                      <td>
                        <Badge bg="success">Activo</Badge>
                      </td>
                    </tr>

                    <tr>
                      <td><strong>María López</strong></td>
                      <td>
                        <Badge bg="success">Activo</Badge>
                      </td>
                    </tr>

                    <tr>
                      <td><strong>Carlos Ruiz</strong></td>
                      <td>
                        <Badge bg="secondary">Inactivo</Badge>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}