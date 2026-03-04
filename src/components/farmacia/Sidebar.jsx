import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import LogoutModal from "./LogoutModal";

export default function Sidebar() {
  const [openLogout, setOpenLogout] = useState(false);

  return (
    <div
      style={{
        width: "240px",
        background: "#1f3fa3",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Título */}
      <h4 className="mb-4">CliniConnect</h4>

      {/* Menú principal */}
      <Nav className="flex-column gap-3">
        <Nav.Link
          as={NavLink}
          to="/farmacia/Home"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Inicio
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/farmacia/dashboard"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Dashboard
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/farmacia/RecetasMedicas"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Recetas Médicas
        </Nav.Link>

        <Nav.Link
          as={NavLink}
          to="/farmacia/inventario"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Inventario
        </Nav.Link>
      </Nav>

      {/* Parte inferior */}
      <div style={{ marginTop: "auto" }}>
        <hr style={{ borderColor: "rgba(255,255,255,0.3)" }} />

        {/* Configuración */}
        <Nav.Link
          as={NavLink}
          to="/farmacia/configuracion"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Configuración
        </Nav.Link>

        {/* Cerrar sesión */}
        <Nav.Link
          onClick={() => setOpenLogout(true)}
          style={{
            color: "#fff",
            cursor: "pointer",
          }}
        >
          Cerrar sesión
        </Nav.Link>
      </div>

      {/* Modal logout */}
      <LogoutModal
        open={openLogout}
        handleClose={() => setOpenLogout(false)}
      />
    </div>
  );
}