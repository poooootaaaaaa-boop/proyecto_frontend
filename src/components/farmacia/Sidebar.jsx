import { Nav } from "react-bootstrap";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        background: "#1f3fa3",
        color: "#fff",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <h4 className="mb-4">CliniConnect</h4>

      <Nav className="flex-column gap-3">
        <Nav.Link style={{ color: "#fff" }}> Inicio</Nav.Link>
        <Nav.Link style={{ color: "#fff" }}> Dashboard</Nav.Link>
        <Nav.Link style={{ color: "#fff" }}> Recetas Médicas</Nav.Link>
        <Nav.Link style={{ color: "#fff" }}> Inventario</Nav.Link>
        <Nav.Link style={{ color: "#fff" }}> Medicamentos</Nav.Link>
      </Nav>

      <div style={{ position: "absolute", bottom: 20 }}>
         Configuración
      </div>
    </div>
  );
}