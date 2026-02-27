import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1f3fa3",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
        position: "relative",
      }}
    >
      <h4 className="mb-4">CliniConnect</h4>

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

        <Nav.Link
          as={NavLink}
          to="/farmacia/medicamentos"
          style={({ isActive }) => ({
            color: "#fff",
            fontWeight: isActive ? "bold" : "normal",
          })}
        >
          Medicamentos
        </Nav.Link>
      </Nav>

      <div style={{ position: "absolute", bottom: 20 }}>
        Configuración
      </div>
    </div>
  );
}