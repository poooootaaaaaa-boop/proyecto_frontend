import Sidebar from "../../components/farmacia/Sidebar";
import Topbar from "../../components/farmacia/Topbar";
import "./dashboardFarmacia.css";
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function Configuracion() {

  const [tab, setTab] = useState("ajustes");

  return (
    <div className="home-layout">

      <Sidebar />

      <div className="home-content-modern">

        <Topbar />

        {/* HEADER */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "25px",
          }}
        >

          <div>
            <h2 className="main-title">Configuración</h2>
            <p style={{ color: "#64748b" }}>
              Gestiona ajustes del sistema y administración interna.
            </p>
          </div>

          <Form.Control
            placeholder="Buscar configuración..."
            style={{
              maxWidth: "280px",
              borderRadius: "10px",
            }}
          />

        </div>

        {/* TABS */}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "25px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >

          <span
            style={{
              color: tab === "ajustes" ? "#2563eb" : "#64748b",
              borderBottom: tab === "ajustes" ? "2px solid #2563eb" : "none",
              paddingBottom: "6px",
            }}
            onClick={() => setTab("ajustes")}
          >
            Ajustes
          </span>


        </div>

        {/* GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >

          {/* FARMACIAS */}
          <div className="card-modern table-card">

            <h5 className="section-title">
              Farmacias afiliadas
            </h5>

            <div className="table-modern">

              <div className="table-header-modern">
                <span>Sucursal</span>
                <span>Ubicación</span>
                <span>Estado</span>
                <span></span>
              </div>

              <div className="table-row-modern">

                <div>
                  <strong>Sucursal Norte</strong>
                </div>

                <div>
                  Av. Central
                  <small style={{ display: "block", color: "#64748b" }}>
                    CP 4556
                  </small>
                </div>

                <div>
                  <span className="status-badge danger">
                    Inactiva
                  </span>
                </div>


              </div>

              <div className="table-row-modern">

                <div>
                  <strong>Sucursal Centro</strong>
                </div>

                <div>
                  Calle 5
                  <small style={{ display: "block", color: "#64748b" }}>
                    CP 4456
                  </small>
                </div>

                <div>
                  <span className="status-badge success">
                    Activa
                  </span>
                </div>


              </div>

            </div>

          </div>

          {/* NOTIFICACIONES */}
          <div className="card-modern">

            <h5 className="section-title">
              Notificaciones del sistema
            </h5>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "10px",
              }}
            >

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

          </div>

          {/* USUARIOS */}
          <div className="card-modern table-card">

            <h5 className="section-title">
              Usuarios internos
            </h5>

            <div className="table-modern">

              <div className="table-header-modern">
                <span>Usuario</span>
                <span>Estado</span>
              </div>

              <div className="table-row-modern">

                <div>
                  <strong>Juan Pérez</strong>
                </div>

                <div>
                  <span className="status-badge success">
                    Activo
                  </span>
                </div>

              </div>

              <div className="table-row-modern">

                <div>
                  <strong>María López</strong>
                </div>

                <div>
                  <span className="status-badge success">
                    Activo
                  </span>
                </div>

              </div>

              <div className="table-row-modern">

                <div>
                  <strong>Carlos Ruiz</strong>
                </div>

                <div>
                  <span className="status-badge danger">
                    Inactivo
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}